/**
 * scripts/prepare_build.js
 * 
 * Automatically detects whether production is running with persistent PostgreSQL
 * (Neon / Vercel Postgres / Supabase) or local SQLite, updates prisma/schema.prisma
 * datasource provider accordingly, and ensures Prisma Client and database schema are synchronized.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load .env locally if present
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const candidateUrls = [
  process.env.POSTGRES_PRISMA_URL,
  process.env.POSTGRES_URL,
  process.env.POSTGRES_DATABASE_URL,
  process.env.DATABASE_URL,
];

let activePostgresUrl = null;
for (const url of candidateUrls) {
  if (url && typeof url === 'string' && url.trim().length > 0) {
    const trimmed = url.trim();
    if (trimmed.startsWith('postgresql://') || trimmed.startsWith('postgres://')) {
      activePostgresUrl = trimmed;
      break;
    }
  }
}

const isPostgres = Boolean(activePostgresUrl);
const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

if (isPostgres) {
  // Set process.env.DATABASE_URL for Prisma CLI operations
  process.env.DATABASE_URL = activePostgresUrl;
}

console.log('--- Preparing Sherman Prisma Build ---');
console.log(`Environment: ${isVercel ? 'Vercel Serverless Production' : 'Local / Custom Server'}`);
console.log(`Database Protocol: ${isPostgres ? 'PostgreSQL (Persistent Cloud Neon)' : 'SQLite (Local Development File)'}`);

if (isVercel && !isPostgres) {
  console.error('\n========================================================================');
  console.error('❌ FATAL BUILD ERROR: VERCEL PRODUCTION DATABASE NOT CONFIGURED');
  console.error('========================================================================');
  console.error('Vercel production build cannot use local SQLite ("file:./dev.db").');
  console.error('SQLite databases are ephemeral in serverless functions and will cause data loss.');
  console.error('\nREQUIRED ACTION:');
  console.error('Ensure POSTGRES_PRISMA_URL or DATABASE_URL in Vercel Project Settings →');
  console.error('Environment Variables is populated with your Neon PostgreSQL connection string:');
  console.error('postgresql://[user]:[password]@[host]/[dbname]?sslmode=require');
  console.error('========================================================================\n');
  process.exit(1);
}

const targetProvider = isPostgres ? 'postgresql' : 'sqlite';
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

if (fs.existsSync(schemaPath)) {
  let schema = fs.readFileSync(schemaPath, 'utf8');
  const currentProviderMatch = schema.match(/datasource\s+db\s*\{[\s\S]*?provider\s*=\s*"([^"]+)"/);
  const currentProvider = currentProviderMatch ? currentProviderMatch[1] : '';

  if (currentProvider !== targetProvider) {
    console.log(`Updating prisma/schema.prisma datasource provider: "${currentProvider}" -> "${targetProvider}"`);
    schema = schema.replace(
      /datasource\s+db\s*\{[\s\S]*?provider\s*=\s*"[^"]+"/,
      `datasource db {\n  provider = "${targetProvider}"`
    );
    fs.writeFileSync(schemaPath, schema, 'utf8');
    console.log(`✓ Updated datasource provider to "${targetProvider}"`);
  } else {
    console.log(`✓ Datasource provider already set to "${targetProvider}"`);
  }
}

// Generate Prisma Client
console.log('Generating Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✓ Prisma Client generated.');
} catch (e) {
  console.error('Prisma generate warning:', e.message);
}

// If using persistent PostgreSQL, push schema automatically
if (isPostgres && activePostgresUrl) {
  console.log('Synchronizing schema with persistent PostgreSQL database...');
  try {
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
    console.log('✓ Database schema synchronized successfully.');
  } catch (e) {
    console.warn('Warning during prisma db push:', e.message);
  }
}
