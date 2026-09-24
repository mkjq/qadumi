

import { PrismaClient } from '@prisma/client/wasm';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

if (typeof WebSocket !== 'undefined') {
  neonConfig.webSocketConstructor = WebSocket;
}
neonConfig.poolQueryViaFetch = true;

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_sGz4abuSR7BA@ep-little-poetry-b1aatcpp-pooler.c-5.eu-central-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient | null = globalForPrisma.prisma || null;

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (prop === 'then') return undefined; // Promise chaining support
    if (process.env.SKIP_PRISMA) {
      return () => [];
    }
    if (!prismaInstance) {
      prismaInstance = new PrismaClient({
        adapter,
        log: ['error', 'warn'],
      });
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prismaInstance;
      }
    }
    const value = prismaInstance[prop as keyof PrismaClient];
    if (typeof value === 'function') {
      return value.bind(prismaInstance);
    }
    return value;
  }
});
