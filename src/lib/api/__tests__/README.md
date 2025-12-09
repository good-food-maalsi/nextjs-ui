# Tests Unitaires Backend

Ce dossier contient tous les tests unitaires pour l'API backend du projet Good Food.

## 📊 Statistiques

- **Total de tests**: 95
- **Taux de réussite**: 100%
- **Couverture**: Validators & Handlers

## 🧪 Types de tests

### 1. Validators Tests (67 tests)

Tests de validation Zod pour tous les schémas d'entrée/sortie.

#### Category Validators (18 tests)
- ✅ `createCategorySchema`: validation création, rejet noms courts/longs
- ✅ `updateCategorySchema`: validation MAJ, champs optionnels, null
- ✅ `categoryQuerySchema`: pagination, coercion, limites
- ✅ `categoryIdSchema`: validation UUID

#### Ingredient Validators (17 tests)
- ✅ `createIngredientSchema`: validation complète, catégories (ID ou nom)
- ✅ `updateIngredientSchema`: MAJ partielles, null
- ✅ `ingredientQuerySchema`: filtres (supplier, category, search)
- ✅ `addCategoriesToIngredientSchema`: ajout catégories

#### Command Validators (18 tests)
- ✅ `createCommandSchema`: validation avec items, statuts, quantités
- ✅ `updateCommandSchema`: MAJ status/user
- ✅ `commandQuerySchema`: filtres multiples
- ✅ `addIngredientToCommandSchema`: ajout items
- ✅ `updateCommandIngredientSchema`: MAJ quantités

#### Stock Validators (14 tests)
- ✅ `upsertStockSchema`: validation création/MAJ, quantités ≥ 0
- ✅ `updateStockQuantitySchema`: MAJ quantités
- ✅ `stockIdsSchema`: validation paire IDs

### 2. Handlers Tests (28 tests)

Tests de la logique métier avec mocking des repositories.

#### Category Handler (10 tests)
- ✅ Récupération paginée
- ✅ Récupération par ID avec gestion erreurs
- ✅ Création avec validation unicité nom
- ✅ Mise à jour avec vérifications existences
- ✅ Suppression avec validations

#### Command Handler (18 tests)
- ✅ CRUD complet avec validations
- ✅ Création atomique avec items
- ✅ Validation franchises/ingrédients existants
- ✅ Ajout/MAJ/suppression items
- ✅ Gestion erreurs NotFound

## 🚀 Lancer les tests

```bash
# Tous les tests backend
pnpm test:backend

# Mode watch (développement)
pnpm test:backend:watch

# Avec UI
pnpm test:ui

# Avec coverage
pnpm test:coverage
```

## 📁 Structure

```
src/lib/api/__tests__/
├── validators/
│   ├── category.validator.test.ts (18 tests)
│   ├── ingredient.validator.test.ts (17 tests)
│   ├── command.validator.test.ts (18 tests)
│   └── stock.validator.test.ts (14 tests)
├── handlers/
│   ├── category.handler.test.ts (10 tests)
│   └── command.handler.test.ts (18 tests)
└── README.md (ce fichier)
```

## 🛠️ Outils utilisés

- **Vitest**: Framework de test rapide pour TypeScript
- **vitest-mock-extended**: Mocking avancé pour Prisma
- **Test Factories**: Helpers pour créer des données de test

## ✅ Conventions de test

### Nomenclature
- Fichiers: `*.test.ts`
- Describe blocks: Nom de l'entité/fonction testée
- It blocks: Comportement testé (should...)

### Structure
```typescript
describe("EntityHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("methodName", () => {
    it("should do something in normal case", async () => {
      // Arrange
      const mockData = createMockEntity();
      vi.mocked(repository.method).mockResolvedValue(mockData);

      // Act
      const result = await handler.method(params);

      // Assert
      expect(result).toEqual(mockData);
      expect(repository.method).toHaveBeenCalledWith(params);
    });

    it("should throw error in error case", async () => {
      // Arrange
      vi.mocked(repository.method).mockResolvedValue(null);

      // Act & Assert
      await expect(handler.method(params)).rejects.toThrow(NotFoundError);
    });
  });
});
```

## 📈 Prochaines étapes

- [ ] Tests repositories (avec mocking Prisma)
- [ ] Tests d'intégration (routes API)
- [ ] Tests E2E avec base de données de test
- [ ] Augmenter couverture à 80%+

## 🐛 Debugging

Pour debugger un test spécifique :

```bash
# Avec logs
vitest src/lib/api/__tests__/handlers/category.handler.test.ts

# Avec debugger
node --inspect-brk node_modules/.bin/vitest
```

## 📝 Notes

- Les validators testent exhaustivement tous les cas limites (min/max, types, required)
- Les handlers mockent tous les repositories pour isoler la logique métier
- Chaque test suit le pattern AAA (Arrange, Act, Assert)
- Les factories facilitent la création de données de test cohérentes
