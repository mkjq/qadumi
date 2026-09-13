import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }

  // On Vercel / serverless environments
  if (process.env.VERCEL) {
    const tmpDbPath = '/tmp/dev.db';
    const bundledPrismaDb = path.join(process.cwd(), 'prisma', 'dev.db');
    const bundledRootDb = path.join(process.cwd(), 'dev.db');
    
    try {
      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(bundledPrismaDb)) {
          fs.copyFileSync(bundledPrismaDb, tmpDbPath);
          console.log('[Prisma] Copied prisma/dev.db to /tmp/dev.db');
        } else if (fs.existsSync(bundledRootDb)) {
          fs.copyFileSync(bundledRootDb, tmpDbPath);
          console.log('[Prisma] Copied dev.db to /tmp/dev.db');
        } else {
          console.warn('[Prisma] Bundled SQLite DB not found in cwd');
        }
      }
      return `file:${tmpDbPath}`;
    } catch (err) {
      console.error('[Prisma] Error setting up /tmp/dev.db:', err);
      return fs.existsSync(bundledPrismaDb) ? `file:${bundledPrismaDb}` : `file:${bundledRootDb}`;
    }
  }

  // Local development / server environment
  const localPrismaDb = path.join(process.cwd(), 'prisma', 'dev.db');
  const localRootDb = path.join(process.cwd(), 'dev.db');
  return fs.existsSync(localPrismaDb) ? `file:${localPrismaDb}` : `file:${localRootDb}`;
}

const dbUrl = getDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
