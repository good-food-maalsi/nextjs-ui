import { config } from "dotenv";
import path from "path";

// Load test environment variables
config({ path: path.resolve(__dirname, "../../.env.test") });

// Verify that DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env.test");
}

console.log("✅ Test environment loaded");
console.log(`📦 Database: ${process.env.DATABASE_URL?.split("@")[1]}`);
