import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

function getDatabaseUrl(): string {
  // 1. Direct connection to Persistent Cloud PostgreSQL (Neon, Vercel Postgres, Supabase)
  const candidateUrls = [
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_DATABASE_URL,
    process.env.DATABASE_URL,
  ];

  for (const url of candidateUrls) {
    if (url && typeof url === 'string' && url.trim().length > 0) {
      const trimmed = url.trim();
      if (trimmed.startsWith('postgresql://') || trimmed.startsWith('postgres://')) {
        return trimmed;
      }
    }
  }

  // 2. Local SQLite database file path resolution (Local Development only)
  const prismaDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  const rootDbPath = path.join(process.cwd(), 'dev.db');

  if (fs.existsSync(prismaDbPath)) {
    return `file:${prismaDbPath}`;
  }
  if (fs.existsSync(rootDbPath)) {
    return `file:${rootDbPath}`;
  }

  return process.env.DATABASE_URL || `file:${prismaDbPath}`;
}

const resolvedDbUrl = getDatabaseUrl();
process.env.DATABASE_URL = resolvedDbUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedDbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

