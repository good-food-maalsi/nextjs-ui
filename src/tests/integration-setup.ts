import { config } from "dotenv";
import path from "path";

// Charger les variables d'environnement de test
config({ path: path.resolve(__dirname, "../../.env.test") });

// Vérifier que DATABASE_URL est bien définie
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env.test");
}

console.log("✅ Test environment loaded");
console.log(`📦 Database: ${process.env.DATABASE_URL?.split("@")[1]}`);
