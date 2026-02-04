import { config } from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client.js";

// Charger les variables d'environnement
config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seed...");

  // Créer une franchise de démo
  const franchise = await prisma.franchise.create({
    data: {
      name: "Franchise Demo Paris",
      latitude: 48.8566,
      longitude: 2.3522,
      street: "123 Rue de la Demo",
      city: "Paris",
      state: "Île-de-France",
      zip: "75001",
      owner_id: "00000000-0000-0000-0000-000000000001",
      email: "demo@franchise.com",
      phone: "+33 1 23 45 67 89",
    },
  });

  console.log("✅ Franchise créée:", franchise.id);

  // Créer des suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: "UNION PRIMEURS",
      email: "contact@union-primeurs.fr",
      phone: "+33 1 11 11 11 11",
      latitude: 48.8,
      longitude: 2.3,
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: "BOUCHERIE MODERNE",
      email: "contact@boucherie-moderne.fr",
      phone: "+33 1 22 22 22 22",
    },
  });

  const supplier3 = await prisma.supplier.create({
    data: {
      name: "FROMAGERIE ARTISANALE",
      email: "contact@fromagerie.fr",
      phone: "+33 1 33 33 33 33",
    },
  });

  console.log("✅ 3 Suppliers créés");

  // Créer des catégories
  const legumes = await prisma.category.create({
    data: {
      name: "Légumes",
      description: "Produits frais",
    },
  });

  const viandes = await prisma.category.create({
    data: {
      name: "Viandes",
      description: "Viandes et volailles",
    },
  });

  const produits_laitiers = await prisma.category.create({
    data: {
      name: "Produits laitiers",
      description: "Fromages et produits laitiers",
    },
  });

  console.log("✅ 3 Catégories créées");

  // Créer des ingrédients avec catégories
  const tomate = await prisma.ingredient.create({
    data: {
      name: "Tomate",
      description: "Tomate fraîche",
      supplier_id: supplier1.id,
      unit_price: 2.5,
    },
  });

  await prisma.ingredientCategory.create({
    data: {
      ingredient_id: tomate.id,
      category_id: legumes.id,
    },
  });

  const salade = await prisma.ingredient.create({
    data: {
      name: "Salade",
      description: "Salade verte",
      supplier_id: supplier1.id,
      unit_price: 1.8,
    },
  });

  await prisma.ingredientCategory.create({
    data: {
      ingredient_id: salade.id,
      category_id: legumes.id,
    },
  });

  const boeuf = await prisma.ingredient.create({
    data: {
      name: "Bœuf haché",
      description: "Viande de bœuf hachée",
      supplier_id: supplier2.id,
      unit_price: 12.0,
    },
  });

  await prisma.ingredientCategory.create({
    data: {
      ingredient_id: boeuf.id,
      category_id: viandes.id,
    },
  });

  const poulet = await prisma.ingredient.create({
    data: {
      name: "Poulet",
      description: "Blanc de poulet",
      supplier_id: supplier2.id,
      unit_price: 8.5,
    },
  });

  await prisma.ingredientCategory.create({
    data: {
      ingredient_id: poulet.id,
      category_id: viandes.id,
    },
  });

  const fromage = await prisma.ingredient.create({
    data: {
      name: "Fromage râpé",
      description: "Mélange de fromages râpés",
      supplier_id: supplier3.id,
      unit_price: 5.5,
    },
  });

  await prisma.ingredientCategory.create({
    data: {
      ingredient_id: fromage.id,
      category_id: produits_laitiers.id,
    },
  });

  console.log("✅ 5 Ingrédients créés avec catégories");

  // Créer des stocks pour la franchise
  await prisma.stockFranchise.createMany({
    data: [
      {
        franchise_id: franchise.id,
        ingredient_id: tomate.id,
        quantity: 50,
      },
      {
        franchise_id: franchise.id,
        ingredient_id: salade.id,
        quantity: 30,
      },
      {
        franchise_id: franchise.id,
        ingredient_id: boeuf.id,
        quantity: 20,
      },
      {
        franchise_id: franchise.id,
        ingredient_id: poulet.id,
        quantity: 25,
      },
      {
        franchise_id: franchise.id,
        ingredient_id: fromage.id,
        quantity: 15,
      },
    ],
  });

  console.log("✅ 5 Stocks créés pour la franchise");

  console.log("\n🎉 Seed terminé avec succès!");
  console.log("📍 Franchise ID:", franchise.id);
  console.log(
    "\n💡 Pensez à ajouter ce franchise_id dans la session de l'utilisateur pour tester le frontend"
  );
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
