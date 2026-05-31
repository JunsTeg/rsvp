import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

type GlobalWithPrisma = typeof globalThis & { prisma?: PrismaClient }

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL || 'file:./dev.db'
  const adapter = new PrismaBetterSqlite3({ url })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as GlobalWithPrisma

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
