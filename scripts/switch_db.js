/**
 * scripts/switch_db.js
 * 
 * Switches prisma/schema.prisma datasource provider between 'sqlite' and 'postgresql'
 * and regenerates Prisma Client automatically.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetProvider = process.argv[2]?.toLowerCase() || 'postgresql';

if (!['postgresql', 'sqlite'].includes(targetProvider)) {
  console.error('Invalid provider! Use: node scripts/switch_db.js [postgresql | sqlite]');
  process.exit(1);
}

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

const updated = schemaContent.replace(
  /datasource db \{\s*provider\s*=\s*"[^"]+"\s*url\s*=\s*env\("DATABASE_URL"\)\s*\}/,
  `datasource db {\n  provider = "${targetProvider}"\n  url      = env("DATABASE_URL")\n}`
);

fs.writeFileSync(schemaPath, updated, 'utf8');
console.log(`✓ Updated prisma/schema.prisma datasource provider to: "${targetProvider}"`);

try {
  console.log('Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✓ Prisma Client generated successfully!');
} catch (e) {
  console.error('Warning during prisma generate:', e.message);
}
