# Good Food - Next.js UI

Application de gestion de restaurant pour la gestion des franchises, commandes, stocks, et ingrédients.

## Stack Technique

- **Framework**: Next.js 15.3.5 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript 5
- **Database**: PostgreSQL avec Prisma ORM
- **Authentification**: JWT (RS256)
- **State Management**: TanStack Query + Legend App State
- **Forms**: React Hook Form + Zod
- **UI**: Tailwind CSS v4 + Radix UI + shadcn/ui
- **HTTP Client**: Axios

## Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env

# Générer le client Prisma
npx prisma generate

# Lancer les migrations
npx prisma migrate dev

# Démarrer le serveur de développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## Variables d'Environnement

```env
DATABASE_URL="postgresql://user:password@localhost:5432/goodfood"
JWT_PUBLIC_KEY="votre_clé_publique"
JWT_PRIVATE_KEY="votre_clé_privée"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Architecture du Projet

### Structure des Dossiers

```
nextjs-ui/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── dashboard/
│   │   │   ├── (auth)/              # Routes d'authentification (grouped)
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── reset-password/
│   │   │   └── (dashboard-layout)/  # Routes principales (grouped)
│   │   │       ├── analyses/
│   │   │       ├── commandes/       # Gestion des commandes
│   │   │       ├── finance/
│   │   │       ├── membres/         # Gestion des utilisateurs
│   │   │       └── plats/           # Produits, stocks, fournisseurs
│   │   └── api/                     # API Routes (voir structure ci-dessous)
│   ├── components/                   # Composants React réutilisables
│   │   ├── ui/                      # Composants shadcn/ui
│   │   └── ...                      # Autres composants métier
│   ├── hooks/                        # Custom React Hooks
│   ├── lib/                          # Utilitaires et configurations
│   │   ├── api/                     # Logique métier API
│   │   ├── config/                  # Configurations (axios, session, etc.)
│   │   └── utils/                   # Fonctions utilitaires
│   ├── services/                     # Services pour API externes
│   ├── providers/                    # React Context Providers
│   ├── generated/                    # Types Prisma générés
│   └── tests/                        # Configuration des tests
├── prisma/
│   ├── schema.prisma                 # Modèle de données
│   └── migrations/                   # Migrations de base de données
└── public/                           # Fichiers statiques
```

## Architecture API Next.js

### Structure Recommandée

```
src/app/api/
├── auth/                             # Authentification
│   ├── login/route.ts               # POST /api/auth/login
│   ├── register/route.ts            # POST /api/auth/register
│   ├── refresh/route.ts             # POST /api/auth/refresh
│   ├── logout/route.ts              # POST /api/auth/logout
│   └── reset-password/route.ts      # POST /api/auth/reset-password
│
├── users/                            # Gestion utilisateurs
│   ├── route.ts                     # GET /api/users, POST /api/users
│   ├── [id]/route.ts                # GET/PUT/DELETE /api/users/:id
│   └── [id]/avatar/route.ts         # PUT /api/users/:id/avatar
│
├── franchises/                       # Gestion franchises
│   ├── route.ts                     # GET /api/franchises, POST /api/franchises
│   ├── [id]/route.ts                # GET/PUT/DELETE /api/franchises/:id
│   └── [id]/stock/route.ts          # GET /api/franchises/:id/stock
│
├── commands/                         # Gestion commandes
│   ├── route.ts                     # GET /api/commands, POST /api/commands
│   ├── [id]/route.ts                # GET/PUT/DELETE /api/commands/:id
│   └── [id]/ingredients/route.ts    # GET/POST /api/commands/:id/ingredients
│
├── ingredients/                      # Gestion ingrédients
│   ├── route.ts                     # GET /api/ingredients, POST /api/ingredients
│   ├── [id]/route.ts                # GET/PUT/DELETE /api/ingredients/:id
│   └── categories/route.ts          # GET /api/ingredients/categories
│
├── suppliers/                        # Gestion fournisseurs
│   ├── route.ts                     # GET /api/suppliers, POST /api/suppliers
│   └── [id]/route.ts                # GET/PUT/DELETE /api/suppliers/:id
│
└── _middleware/                      # Middleware partagés (préfixe _ = non-route)
    ├── auth.middleware.ts           # Vérification JWT
    ├── role.middleware.ts           # Contrôle d'accès basé sur les rôles
    └── error.middleware.ts          # Gestion globale des erreurs
```

### Logique Métier API

```
src/lib/api/
├── handlers/                         # Handlers métier (Business Logic Layer)
│   ├── auth.handler.ts              # Logique authentification
│   ├── user.handler.ts              # Logique utilisateurs
│   ├── franchise.handler.ts         # Logique franchises
│   ├── command.handler.ts           # Logique commandes
│   └── ingredient.handler.ts        # Logique ingrédients
│
├── validators/                       # Schémas de validation Zod
│   ├── auth.validator.ts            # Validation auth (login, register)
│   ├── user.validator.ts            # Validation utilisateurs
│   ├── command.validator.ts         # Validation commandes
│   └── ingredient.validator.ts      # Validation ingrédients
│
├── repositories/                     # Data Access Layer (Prisma)
│   ├── user.repository.ts           # Requêtes BDD utilisateurs
│   ├── franchise.repository.ts      # Requêtes BDD franchises
│   ├── command.repository.ts        # Requêtes BDD commandes
│   └── ingredient.repository.ts     # Requêtes BDD ingrédients
│
└── errors/                           # Gestion des erreurs
    ├── api-error.ts                 # Classes d'erreurs custom
    └── error-handler.ts             # Handler global d'erreurs
```

### Exemple de Structure de Route API

```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/api/_middleware/auth.middleware";
import { userValidator } from "@/lib/api/validators/user.validator";
import { userHandler } from "@/lib/api/handlers/user.handler";

export async function GET(request: NextRequest) {
  // Vérifier l'authentification
  const user = await authMiddleware(request);

  // Récupérer les utilisateurs
  const users = await userHandler.getUsers();

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  // Vérifier l'authentification
  const user = await authMiddleware(request);

  // Parser et valider le body
  const body = await request.json();
  const validatedData = userValidator.create.parse(body);

  // Créer l'utilisateur
  const newUser = await userHandler.createUser(validatedData);

  return NextResponse.json(newUser, { status: 201 });
}
```

### Principes d'Architecture

#### 1. Séparation en Couches

- **Routes** (`api/*/route.ts`) : Gestion HTTP (requête/réponse)
- **Handlers** (`lib/api/handlers/`) : Logique métier
- **Repositories** (`lib/api/repositories/`) : Accès aux données
- **Validators** (`lib/api/validators/`) : Validation des données

#### 2. Avantages

- **Maintenabilité** : Code organisé par domaine fonctionnel
- **Réutilisabilité** : Handlers et repositories partagés
- **Testabilité** : Chaque couche testable indépendamment
- **Type-safety** : Validation Zod + TypeScript
- **Scalabilité** : Facile d'ajouter de nouveaux endpoints

#### 3. Patterns Utilisés

- **Repository Pattern** : Abstraction de l'accès aux données
- **Service Layer Pattern** : Logique métier isolée
- **Middleware Pattern** : Authentification et validation
- **Validation Pattern** : Schémas Zod pour type-safety

## Conventions de Code

### Organisation des Composants Page

Chaque page suit cette structure :

```
src/app/dashboard/(dashboard-layout)/exemple/
├── page.tsx                  # Composant principal de la page
├── _components/              # Composants spécifiques à cette page
│   ├── exemple-table.tsx
│   └── exemple-form.tsx
├── _hooks/                   # Hooks spécifiques à cette page
│   └── use-exemple-data.ts
└── _types/                   # Types spécifiques à cette page
    └── exemple.types.ts
```

### Nomenclature

- **Composants** : PascalCase (`UserProfile.tsx`)
- **Fichiers utilitaires** : kebab-case (`token.utils.ts`)
- **Hooks** : use-prefixe + kebab-case (`use-auth-interceptor.ts`)
- **Types** : PascalCase avec suffixe (`UserType`, `CommandStatus`)

### Validation des Données

Toutes les entrées utilisateur doivent être validées avec Zod :

```typescript
import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(50),
});

export type UserInput = z.infer<typeof userSchema>;
```

## Base de Données

### Modèles Principaux

- **Franchise** : Restaurants avec géolocalisation
- **Command** : Commandes avec statuts (draft, confirmed, in_progress, delivered, canceled)
- **Ingredient** : Produits avec prix unitaires
- **Supplier** : Fournisseurs d'ingrédients
- **StockFranchise** : Inventaire par franchise
- **Category** : Catégories de produits

### Commandes Prisma Utiles

```bash
# Générer le client Prisma
npx prisma generate

# Créer une migration
npx prisma migrate dev --name nom_migration

# Ouvrir Prisma Studio
npx prisma studio

# Réinitialiser la base de données
npx prisma migrate reset
```

## Authentification

### JWT avec RS256

- Token stocké dans des cookies HTTP-only
- Refresh automatique via intercepteur Axios
- Vérification avec clé publique RSA
- Durée de vie configurable

### Utilisation

```typescript
import { authService } from "@/services/auth.service";

// Login
const { accessToken, refreshToken } = await authService.login({
  email: "user@example.com",
  password: "password123",
});

// Vérifier le token
const payload = await authService.verifyToken(accessToken);
```

## Scripts Disponibles

```bash
# Développement
npm run dev              # Démarre le serveur de développement

# Build
npm run build            # Build de production
npm start                # Démarre le serveur de production

# Base de données
npm run db:generate      # Génère le client Prisma
npm run db:migrate       # Lance les migrations
npm run db:studio        # Ouvre Prisma Studio
npm run db:seed          # Seed la base de données

# Tests
npm run test             # Lance les tests
npm run test:watch       # Tests en mode watch

# Linting
npm run lint             # Vérifie le code avec ESLint
npm run lint:fix         # Corrige automatiquement les erreurs
```

## Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev)
- [shadcn/ui](https://ui.shadcn.com)
