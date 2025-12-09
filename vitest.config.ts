import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "src/tests/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/generated/**",
        "src/app/**", // Exclure les routes Next.js (testées via e2e)
      ],
    },
    // Uniquement les tests backend (lib/api)
    include: ["src/lib/api/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    // Exclure les tests d'intégration (ils ont leur propre config)
    exclude: ["**/*.integration.test.ts", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
