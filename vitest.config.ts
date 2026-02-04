import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/tests/setup.ts"],
    // Les tests unitaires mockent les repositories ; prisma est tout de même importé au load.
    // DATABASE_URL évite le throw dans src/lib/db/prisma.ts (aucune connexion réelle en unit).
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ??
        "postgresql://localhost:5432/vitest_unit?schema=public",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "src/tests/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/generated/**",
        "src/app/**", // Exclude Next.js routes (tested via e2e)
      ],
    },
    // Backend tests only (lib/api)
    include: ["src/lib/api/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    // Exclude integration tests (they have their own config)
    exclude: ["**/*.integration.test.ts", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
