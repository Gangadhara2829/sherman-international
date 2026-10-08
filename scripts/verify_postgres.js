const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Load .env
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

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL
    }
  }
});

async function main() {
  const [
    users,
    categories,
    brands,
    products,
    industries,
    services,
    content,
    clients,
    media
  ] = await Promise.all([
    prisma.adminUser.count(),
    prisma.productCategory.count(),
    prisma.brand.count(),
    prisma.product.count(),
    prisma.industry.count(),
    prisma.service.count(),
    prisma.siteContent.count(),
    prisma.proudlyServedClient.count(),
    prisma.mediaAsset.count()
  ]);

  console.log('Neon PostgreSQL Row Counts:');
  console.log(`- Admin Users: ${users}`);
  console.log(`- Product Categories: ${categories}`);
  console.log(`- Brands: ${brands}`);
  console.log(`- Products: ${products}`);
  console.log(`- Industries: ${industries}`);
  console.log(`- Services: ${services}`);
  console.log(`- Site Content: ${content}`);
  console.log(`- Clients: ${clients}`);
  console.log(`- Media: ${media}`);

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
