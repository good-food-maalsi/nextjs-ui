import { PrismaClient } from "@/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma: PrismaClient;

/**
 * Get Prisma instance for tests
 */
export function getPrismaTestClient(): PrismaClient {
  if (!prisma) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    prisma = new PrismaClient({
      adapter,
    });
  }
  return prisma;
}

/**
 * Connect to test database
 */
export async function connectTestDatabase(): Promise<PrismaClient> {
  const client = getPrismaTestClient();
  await client.$connect();
  console.log("✅ Connected to test database");
  return client;
}

/**
 * Disconnect from test database
 */
export async function disconnectTestDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    console.log("✅ Disconnected from test database");
  }
}

/**
 * Clean all tables (for test setup)
 * WARNING: Deletes ALL data!
 */
export async function cleanDatabase(): Promise<void> {
  const client = getPrismaTestClient();

  // Important order: delete tables with foreign keys first
  await client.commandIngredient.deleteMany();
  await client.command.deleteMany();
  await client.stockFranchise.deleteMany();
  await client.ingredientCategory.deleteMany();
  await client.ingredient.deleteMany();
  await client.category.deleteMany();
  await client.supplier.deleteMany();
  await client.franchise.deleteMany();

  console.log("🧹 Database cleaned");
}

/**
 * Reset auto-increment IDs (optionnel)
 */
export async function resetSequences(): Promise<void> {
  const client = getPrismaTestClient();

  // PostgreSQL: reset sequences (if needed)
  await client.$executeRawUnsafe(`
    DO $$
    DECLARE r RECORD;
    BEGIN
      FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
      END LOOP;
    END $$;
  `);

  console.log("🔄 Sequences reset");
}

/**
 * Wrapper to run a test in a transaction (automatic rollback)
 * Useful for complete isolation without manual cleanup
 */
export async function runInTransaction<T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  const client = getPrismaTestClient();

  return client
    .$transaction(async (tx) => {
      await callback(tx as PrismaClient);
      // Throw to force rollback
      throw new Error("ROLLBACK_TRANSACTION");
    })
    .catch((error) => {
      if (error.message === "ROLLBACK_TRANSACTION") {
        // Transaction rollback successful
        return undefined as T;
      }
      throw error;
    });
}
