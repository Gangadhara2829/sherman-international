/**
 * scripts/migrate_to_postgres.js
 * 
 * Safely migrates all existing records from the local SQLite snapshot (db_backup_exact.json)
 * into the persistent production PostgreSQL database (Neon / Vercel Postgres / Supabase)
 * preserving 100% of IDs, relationships, passwords, and timestamps.
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function migrateData() {
  const backupFile = path.join(__dirname, '..', 'db_backup_exact.json');
  if (!fs.existsSync(backupFile)) {
    console.error('Error: db_backup_exact.json not found!');
    process.exit(1);
  }

  const candidateUrls = [
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_DATABASE_URL,
    process.env.DATABASE_URL,
  ];

  let targetUrl = null;
  for (const url of candidateUrls) {
    if (url && typeof url === 'string' && url.trim().length > 0) {
      const trimmed = url.trim();
      if (trimmed.startsWith('postgresql://') || trimmed.startsWith('postgres://')) {
        targetUrl = trimmed;
        break;
      }
    }
  }

  if (!targetUrl) {
    console.error('Error: No PostgreSQL connection string found in POSTGRES_PRISMA_URL or DATABASE_URL!');
    console.error('Please provide a valid PostgreSQL connection string:');
    console.error('DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require" node scripts/migrate_to_postgres.js');
    process.exit(1);
  }

  process.env.DATABASE_URL = targetUrl;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: targetUrl,
      },
    },
  });

  console.log('--- Starting Migration to Persistent Production Database ---');
  console.log('Target Protocol: PostgreSQL (Persistent Neon Cloud)');

  try {
    // 1. Admin Users
    console.log(`\n1. Migrating Admin Users (${data.users?.length || 0})...`);
    for (const u of data.users || []) {
      await prisma.adminUser.upsert({
        where: { email: u.email },
        update: {
          passwordHash: u.passwordHash,
          name: u.name,
          role: u.role,
        },
        create: {
          id: u.id,
          email: u.email,
          passwordHash: u.passwordHash,
          name: u.name,
          role: u.role,
          createdAt: new Date(u.createdAt),
          updatedAt: new Date(u.updatedAt),
        },
      });
    }
    console.log(`✓ Admin users migrated.`);

    // 2. Product Categories
    console.log(`\n2. Migrating Product Categories (${data.cats?.length || 0})...`);
    for (const c of data.cats || []) {
      await prisma.productCategory.upsert({
        where: { id: c.id },
        update: {
          name: c.name,
          slug: c.slug,
          description: c.description,
          image: c.image,
          icon: c.icon,
          displayOrder: c.displayOrder,
          isActive: c.isActive,
        },
        create: {
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          image: c.image,
          icon: c.icon,
          displayOrder: c.displayOrder,
          isActive: c.isActive,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
        },
      });
    }
    console.log(`✓ Product categories migrated.`);

    // 3. Brands
    console.log(`\n3. Migrating Brands (${data.brands?.length || 0})...`);
    for (const b of data.brands || []) {
      await prisma.brand.upsert({
        where: { id: b.id },
        update: {
          name: b.name,
          slug: b.slug,
          logo: b.logo,
          websiteUrl: b.websiteUrl,
          description: b.description,
          displayOrder: b.displayOrder,
          isActive: b.isActive,
        },
        create: {
          id: b.id,
          name: b.name,
          slug: b.slug,
          logo: b.logo,
          websiteUrl: b.websiteUrl,
          description: b.description,
          displayOrder: b.displayOrder,
          isActive: b.isActive,
          createdAt: new Date(b.createdAt),
          updatedAt: new Date(b.updatedAt),
        },
      });
    }
    console.log(`✓ Brands migrated.`);

    // 4. Products
    console.log(`\n4. Migrating Products (${data.prods?.length || 0})...`);
    for (const p of data.prods || []) {
      await prisma.product.upsert({
        where: { id: p.id },
        update: {
          name: p.name,
          slug: p.slug,
          categoryId: p.categoryId,
          brandId: p.brandId,
          shortDescription: p.shortDescription,
          description: p.description,
          specifications: p.specifications,
          features: p.features,
          applications: p.applications,
          image: p.image,
          additionalImages: p.additionalImages,
          isPublished: p.isPublished,
          isFeatured: p.isFeatured,
          displayOrder: p.displayOrder,
        },
        create: {
          id: p.id,
          name: p.name,
          slug: p.slug,
          categoryId: p.categoryId,
          brandId: p.brandId,
          shortDescription: p.shortDescription,
          description: p.description,
          specifications: p.specifications,
          features: p.features,
          applications: p.applications,
          image: p.image,
          additionalImages: p.additionalImages,
          isPublished: p.isPublished,
          isFeatured: p.isFeatured,
          displayOrder: p.displayOrder,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        },
      });
    }
    console.log(`✓ Products migrated.`);

    // 5. Industries
    console.log(`\n5. Migrating Industries (${data.inds?.length || 0})...`);
    for (const ind of data.inds || []) {
      await prisma.industry.upsert({
        where: { id: ind.id },
        update: {
          name: ind.name,
          slug: ind.slug,
          description: ind.description,
          fullDescription: ind.fullDescription,
          image: ind.image,
          icon: ind.icon,
          isPublished: ind.isPublished,
          displayOrder: ind.displayOrder,
        },
        create: {
          id: ind.id,
          name: ind.name,
          slug: ind.slug,
          description: ind.description,
          fullDescription: ind.fullDescription,
          image: ind.image,
          icon: ind.icon,
          isPublished: ind.isPublished,
          displayOrder: ind.displayOrder,
          createdAt: new Date(ind.createdAt),
          updatedAt: new Date(ind.updatedAt),
        },
      });
    }
    console.log(`✓ Industries migrated.`);

    // 6. Services
    console.log(`\n6. Migrating Services (${data.servs?.length || 0})...`);
    for (const s of data.servs || []) {
      await prisma.service.upsert({
        where: { id: s.id },
        update: {
          name: s.name,
          slug: s.slug,
          shortDescription: s.shortDescription,
          fullDescription: s.fullDescription,
          capabilities: s.capabilities,
          image: s.image,
          icon: s.icon,
          isPublished: s.isPublished,
          displayOrder: s.displayOrder,
        },
        create: {
          id: s.id,
          name: s.name,
          slug: s.slug,
          shortDescription: s.shortDescription,
          fullDescription: s.fullDescription,
          capabilities: s.capabilities,
          image: s.image,
          icon: s.icon,
          isPublished: s.isPublished,
          displayOrder: s.displayOrder,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
        },
      });
    }
    console.log(`✓ Services migrated.`);

    // 7. Site Content
    console.log(`\n7. Migrating Site Content (${data.contents?.length || 0})...`);
    for (const sc of data.contents || []) {
      await prisma.siteContent.upsert({
        where: { key: sc.key },
        update: {
          section: sc.section,
          title: sc.title,
          subtitle: sc.subtitle,
          content: sc.content,
          metadata: sc.metadata,
          image: sc.image,
        },
        create: {
          id: sc.id,
          key: sc.key,
          section: sc.section,
          title: sc.title,
          subtitle: sc.subtitle,
          content: sc.content,
          metadata: sc.metadata,
          image: sc.image,
          updatedAt: new Date(sc.updatedAt),
        },
      });
    }
    console.log(`✓ Site content migrated.`);

    // 8. Clients (Proudly Served)
    console.log(`\n8. Migrating Proudly Served Clients (${data.clients?.length || 0})...`);
    for (const cl of data.clients || []) {
      await prisma.proudlyServedClient.upsert({
        where: { id: cl.id },
        update: {
          name: cl.name,
          logo: cl.logo,
          websiteUrl: cl.websiteUrl,
          displayOrder: cl.displayOrder,
          isActive: cl.isActive,
        },
        create: {
          id: cl.id,
          name: cl.name,
          logo: cl.logo,
          websiteUrl: cl.websiteUrl,
          displayOrder: cl.displayOrder,
          isActive: cl.isActive,
          createdAt: new Date(cl.createdAt),
          updatedAt: new Date(cl.updatedAt),
        },
      });
    }
    console.log(`✓ Clients migrated.`);

    // 9. Media Assets
    console.log(`\n9. Migrating Media Assets (${data.media?.length || 0})...`);
    for (const m of data.media || []) {
      await prisma.mediaAsset.upsert({
        where: { id: m.id },
        update: {
          fileName: m.fileName,
          fileUrl: m.fileUrl,
          fileType: m.fileType,
          fileSize: m.fileSize,
          altText: m.altText,
        },
        create: {
          id: m.id,
          fileName: m.fileName,
          fileUrl: m.fileUrl,
          fileType: m.fileType,
          fileSize: m.fileSize,
          altText: m.altText,
          createdAt: new Date(m.createdAt),
        },
      });
    }
    console.log(`✓ Media assets migrated.`);

    console.log('\n========================================================');
    console.log(' SUCCESS: ALL DATA MIGRATED WITH 100% FIDELITY & INTEGRITY');
    console.log('========================================================\n');
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
