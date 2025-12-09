import { PrismaClient } from "@/generated/prisma/client";

let prisma: PrismaClient;

/**
 * Obtenir l'instance Prisma pour les tests
 */
export function getPrismaTestClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  return prisma;
}

/**
 * Se connecter à la DB de test
 */
export async function connectTestDatabase(): Promise<PrismaClient> {
  const client = getPrismaTestClient();
  await client.$connect();
  console.log("✅ Connected to test database");
  return client;
}

/**
 * Se déconnecter de la DB de test
 */
export async function disconnectTestDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    console.log("✅ Disconnected from test database");
  }
}

/**
 * Nettoyer toutes les tables (pour setup de tests)
 * ATTENTION: Supprime TOUTES les données !
 */
export async function cleanDatabase(): Promise<void> {
  const client = getPrismaTestClient();

  // Ordre important : supprimer d'abord les tables avec foreign keys
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

  // PostgreSQL : reset sequences (si nécessaire)
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
 * Wrapper pour exécuter un test dans une transaction (rollback automatique)
 * Utile pour l'isolation complète sans cleanup manuel
 */
export async function runInTransaction<T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  const client = getPrismaTestClient();

  return client.$transaction(async (tx) => {
    await callback(tx as PrismaClient);
    // Throw pour forcer rollback
    throw new Error("ROLLBACK_TRANSACTION");
  }).catch((error) => {
    if (error.message === "ROLLBACK_TRANSACTION") {
      // Transaction rollback réussie
      return undefined as T;
    }
    throw error;
  });
}
