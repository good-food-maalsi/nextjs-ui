# Tests d'Intégration - Backend API

Ce dossier contient tous les tests d'intégration pour l'API backend avec **base de données réelle PostgreSQL**.

## 📊 Statistiques

- **Total de tests** : 60+
- **Coverage** : Repositories & Base de données
- **Isolation** : Cleanup automatique entre chaque test
- **CI Ready** : Optimisé pour GitHub Actions

---

## 🎯 Qu'est-ce qu'un test d'intégration ?

| Tests Unitaires | Tests d'Intégration |
|-----------------|---------------------|
| ❌ Pas de DB | ✅ **DB PostgreSQL réelle** |
| Repositories mockés | ✅ **Vraies requêtes Prisma** |
| Ultra rapides (< 1s) | Rapides (5-10s) |
| Testent la logique | ✅ **Testent les requêtes SQL** |
| Pas d'infra | ✅ **Docker requis** |

---

## 🚀 Lancer les tests

### Option 1 : Script automatique (recommandé pour CI)

```bash
# Lance Docker + Migrations + Tests + Cleanup automatique
pnpm test:integration:full
```

**Ce script fait tout** :
1. ✅ Démarre la DB de test (Docker)
2. ✅ Attend que la DB soit prête
3. ✅ Applique les migrations
4. ✅ Lance les tests
5. ✅ Nettoie tout (stop + volumes)

### Option 2 : Manuelle (développement)

```bash
# 1. Démarrer la DB de test
pnpm db:test:up

# 2. Appliquer les migrations (première fois seulement)
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/goodfood_test?schema=public" \
pnpm prisma migrate deploy

# 3. Lancer les tests
pnpm test:integration

# 4. Arrêter la DB quand c'est fini
pnpm db:test:down
```

### Option 3 : Mode watch (développement)

```bash
# DB doit déjà tourner (db:test:up)
pnpm test:integration:watch
```

---

## 📁 Structure des tests

```
src/lib/api/__integration__/
├── category.repository.integration.test.ts (28 tests)
├── command.repository.integration.test.ts  (20 tests)
├── stock.repository.integration.test.ts    (16 tests)
└── README.md (ce fichier)
```

### Category Repository (28 tests)
- ✅ CRUD complet
- ✅ Pagination & filtres
- ✅ Recherche case-insensitive
- ✅ Cascade delete (ingredient_categories)

### Command Repository (20 tests)
- ✅ Création atomique (command + items)
- ✅ Transactions avec rollback
- ✅ Gestion des items (CRUD)
- ✅ Workflow de statuts
- ✅ Relations complètes (franchise, ingredients, supplier)
- ✅ Cascade delete

### Stock Repository (16 tests)
- ✅ Upsert (create ou update)
- ✅ Filtres (low stock, par franchise)
- ✅ Relations (ingredient, supplier)
- ✅ Cascade delete
- ✅ Queries complexes

---

## 🏗️ Architecture

### Configuration

**vitest.integration.config.ts** :
```typescript
{
  setupFiles: ["./src/tests/integration-setup.ts"],
  include: ["**/*.integration.test.ts"],
  isolate: true,              // Chaque fichier isolé
  pool: "forks",              // Pas de parallélisation
  singleFork: true,           // Évite les conflits DB
  testTimeout: 30000,         // 30s par test
}
```

### Setup global

**src/tests/integration-setup.ts** :
- Charge `.env.test`
- Vérifie `DATABASE_URL`
- Configure l'environnement

### Helpers

**db-test-helper.ts** :
```typescript
connectTestDatabase()     // Connexion
disconnectTestDatabase()  // Déconnexion
cleanDatabase()           // Supprime TOUTES les données
resetSequences()          // Reset auto-increment
runInTransaction()        // Test avec rollback auto
```

**seed-test-data.ts** :
```typescript
testDataFactory.createSupplier()
testDataFactory.createFranchise()
testDataFactory.createCategory()
testDataFactory.createIngredient()
testDataFactory.createCommand()
testDataFactory.createStock()
```

---

## 🔒 Isolation des tests

Chaque test est **complètement isolé** :

```typescript
describe("Test Suite", () => {
  beforeAll(async () => {
    prisma = await connectTestDatabase();  // Une seule fois
  });

  afterAll(async () => {
    await disconnectTestDatabase();        // Une seule fois
  });

  beforeEach(async () => {
    await cleanDatabase();                 // AVANT CHAQUE TEST
  });

  it("test 1", async () => {
    // DB vide au départ
    // Crée ses propres données
  });

  it("test 2", async () => {
    // DB vide à nouveau (cleanup auto)
    // Indépendant du test 1
  });
});
```

**Avantages** :
- ✅ Tests déterministes (même résultat à chaque run)
- ✅ Pas de pollution entre tests
- ✅ Ordre d'exécution n'a pas d'importance
- ✅ Debugging facile

---

## 🐳 Docker Compose

**docker-compose.test.yml** :
```yaml
services:
  postgres-test:
    image: postgres:16-alpine
    container_name: goodfood-test-db
    ports:
      - "5433:5432"              # Port 5433 (pas 5432)
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: goodfood_test  # DB dédiée aux tests
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
```

**Pourquoi port 5433 ?**
- ✅ N'entre pas en conflit avec DB de dev (5432)
- ✅ Peut tourner en parallèle
- ✅ Isolation complète

---

## 🤖 CI/CD (GitHub Actions)

**`.github/workflows/tests.yml`** :

### Job : integration-tests

```yaml
services:
  postgres:
    image: postgres:16-alpine
    env:
      POSTGRES_DB: goodfood_test
    ports:
      - 5433:5432
    options: --health-cmd pg_isready

steps:
  - Install dependencies
  - Generate Prisma Client
  - Run migrations
  - Run integration tests ✅
```

**Optimisations CI** :
- ✅ Service PostgreSQL natif (pas de Docker-in-Docker)
- ✅ Healthcheck automatique
- ✅ Migrations appliquées avant tests
- ✅ Cleanup automatique (GitHub gère les services)
- ✅ Parallélisation : unit tests + integration tests en parallèle

---

## 📝 Exemples de tests

### Test CRUD basique

```typescript
it("should create category", async () => {
  const category = await prisma.category.create({
    data: { name: "Viandes" },
  });

  expect(category.id).toBeDefined();
  expect(category.name).toBe("Viandes");
});
```

### Test avec relations

```typescript
it("should include franchise and ingredients", async () => {
  const supplier = await testDataFactory.createSupplier(prisma);
  const franchise = await testDataFactory.createFranchise(prisma);
  const ingredient = await testDataFactory.createIngredient(prisma, supplier.id);
  const command = await testDataFactory.createCommand(prisma, franchise.id);

  await prisma.commandIngredient.create({
    data: {
      command_id: command.id,
      ingredient_id: ingredient.id,
      quantity: 10,
    },
  });

  const result = await prisma.command.findUnique({
    where: { id: command.id },
    include: {
      franchise: true,
      command_ingredients: {
        include: { ingredient: { include: { supplier: true } } },
      },
    },
  });

  expect(result?.franchise).toBeDefined();
  expect(result?.command_ingredients).toHaveLength(1);
});
```

### Test transaction avec rollback

```typescript
it("should rollback if item creation fails", async () => {
  await expect(
    prisma.$transaction(async (tx) => {
      const cmd = await tx.command.create({ data: {...} });
      // Création avec ingrédient inexistant (FAIL)
      await tx.commandIngredient.create({
        data: {
          command_id: cmd.id,
          ingredient_id: "non-existent-id",
          quantity: 10,
        },
      });
    })
  ).rejects.toThrow();

  // Vérifier rollback
  const commands = await prisma.command.findMany();
  expect(commands).toHaveLength(0);
});
```

---

## 🔍 Debugging

### Voir les logs de la DB

```bash
docker-compose -f docker-compose.test.yml logs postgres-test
```

### Se connecter à la DB de test

```bash
docker exec -it goodfood-test-db psql -U postgres -d goodfood_test
```

### Lancer un seul fichier de test

```bash
pnpm test:integration category.repository.integration.test.ts
```

### Mode verbose

```bash
DEBUG=* pnpm test:integration
```

---

## ⚡ Performance

### Métriques

- **Setup DB** : ~2-3s (Docker + healthcheck)
- **Migrations** : ~1s
- **Tests** : ~5-8s (60 tests)
- **Total** : **< 15s** 🚀

### Optimisations

✅ **Single fork** : Pas de parallélisation (évite conflicts DB)
✅ **Cleanup minimal** : `deleteMany` au lieu de `truncate`
✅ **Connexion persistante** : `beforeAll` (pas `beforeEach`)
✅ **Transactions** : Pour tests complexes (rollback auto)
✅ **Indexes** : Prisma utilise les indexes du schéma

---

## 🐛 Troubleshooting

### ❌ "Database connection failed"

```bash
# Vérifier que la DB tourne
docker ps | grep goodfood-test-db

# Redémarrer
pnpm db:test:down && pnpm db:test:up
```

### ❌ "Port 5433 already in use"

```bash
# Trouver le process
lsof -i :5433

# Ou arrêter la DB de test
pnpm db:test:down
```

### ❌ "Migrations out of sync"

```bash
# Réappliquer les migrations
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/goodfood_test?schema=public" \
pnpm prisma migrate reset
```

### ❌ "Tests failing randomly"

- Vérifier que `cleanDatabase()` est bien dans `beforeEach`
- Vérifier qu'il n'y a pas de parallélisation (`singleFork: true`)
- Regarder les logs : `docker-compose -f docker-compose.test.yml logs`

---

## 📚 Références

- [Vitest Documentation](https://vitest.dev)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
- [GitHub Actions Services](https://docs.github.com/en/actions/using-containerized-services)

---

## 🎓 Best Practices

✅ **DO**
- Cleanup avant CHAQUE test (`beforeEach`)
- Utiliser les factories pour créer des données
- Tester les cascades et contraintes DB
- Vérifier les relations (include)
- Tester les cas d'erreur (rollback, foreign keys)

❌ **DON'T**
- Partager des données entre tests
- Oublier le cleanup
- Utiliser des IDs hardcodés (sauf UUID spécifiques)
- Mocker Prisma (c'est l'intégration qu'on teste !)
- Lancer en parallèle sans isolation

---

**Pour toute question** : Voir le code des tests existants, ils sont commentés ! 🚀
