import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }

  // Potential database source locations in Next.js / Vercel bundle
  const prismaDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  const rootDbPath = path.join(process.cwd(), 'dev.db');

  // In Vercel serverless environment, filesystem is read-only except /tmp
  const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  
  if (isServerless) {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    try {
      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(prismaDbPath)) {
          fs.copyFileSync(prismaDbPath, tmpDbPath);
        } else if (fs.existsSync(rootDbPath)) {
          fs.copyFileSync(rootDbPath, tmpDbPath);
        }
      }
      return `file:${tmpDbPath}`;
    } catch (e) {
      console.warn('Could not copy db to /tmp:', e);
    }
  }

  if (fs.existsSync(prismaDbPath)) {
    return `file:${prismaDbPath}`;
  }
  if (fs.existsSync(rootDbPath)) {
    return `file:${rootDbPath}`;
  }

  return envUrl || `file:${prismaDbPath}`;
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

