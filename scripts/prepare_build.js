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

const dbUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || '';
const isPostgres = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');
const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

console.log('--- Preparing Sherman Prisma Build ---');
console.log(`Environment: ${isVercel ? 'Vercel Serverless Production' : 'Local / Custom Server'}`);
console.log(`Database Protocol: ${isPostgres ? 'PostgreSQL (Persistent Cloud)' : 'SQLite (Local File)'}`);

if (isVercel && !isPostgres) {
  console.warn('\n========================================================================');
  console.warn('⚠️  CRITICAL NOTICE: VERCEL PRODUCTION DATABASE PERSISTENCE');
  console.warn('========================================================================');
  console.warn('Your Vercel deployment is currently configured with:');
  console.warn(`DATABASE_URL="${dbUrl}"`);
  console.warn('\nLocal SQLite files ("file:./dev.db") CANNOT persist in Vercel serverless.');
  console.warn('Changes made in the Admin panel will be lost on container restart or redeploy.');
  console.warn('\nTO ENSURE PERSISTENCE ON VERCEL:');
  console.warn('1. Create a persistent PostgreSQL database (e.g. Neon Serverless Postgres or Vercel Postgres).');
  console.warn('2. In Vercel Project Settings → Environment Variables, add:');
  console.warn('   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"');
  console.warn('========================================================================\n');
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
if (isPostgres && dbUrl) {
  console.log('Synchronizing schema with persistent PostgreSQL database...');
  try {
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
    console.log('✓ Database schema synchronized successfully.');
  } catch (e) {
    console.warn('Warning during prisma db push:', e.message);
  }
}
