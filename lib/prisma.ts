// lib/prisma.ts
import { PrismaClient } from '@/generated/prisma';

// This prevents hot-reloading in development from creating a new PrismaClient instance on every change.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Optional: log queries to the console
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;