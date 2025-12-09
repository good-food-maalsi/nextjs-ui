import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/tests/integration-setup.ts"],
    include: ["**/*.integration.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    testTimeout: 30000,
    hookTimeout: 30000,
    // Isolation maximale : chaque fichier de test dans son propre processus
    isolate: true,
    // Exécution strictement séquentielle - UN SEUL fichier à la fois
    fileParallelism: false,
    pool: "forks",
    // @ts-expect-error - maxForks existe à l'exécution mais n'est pas dans les types
    maxForks: 1, // Un seul fork pour éviter les conflits DB
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "src/tests/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/generated/**",
        "src/app/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
