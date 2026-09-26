

import { PrismaClient } from '@prisma/client/wasm';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { cache } from 'react';

if (typeof WebSocket !== 'undefined') {
  neonConfig.webSocketConstructor = WebSocket;
}
neonConfig.poolQueryViaFetch = true;

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_sGz4abuSR7BA@ep-little-poetry-b1aatcpp-pooler.c-5.eu-central-1.aws.neon.tech/neondb?sslmode=require';

// Create a per-request singleton factory using React.cache()
// This ensures that within a single request, the same PrismaClient (and thus WebSocket) is used.
// But across different requests, a fresh one is created, avoiding Cloudflare WebSocket freezing bugs.
const getPrisma = cache(() => {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter, log: ['error', 'warn'] });
});

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (prop === 'then') return undefined;
    if (process.env.SKIP_PRISMA) {
      return () => [];
    }
    
    // In Edge environments, get a fresh instance per request via cache()
    const prismaInstance = getPrisma();
    
    const value = prismaInstance[prop as keyof PrismaClient];
    if (typeof value === 'function') {
      return value.bind(prismaInstance);
    }
    return value;
  }
});
