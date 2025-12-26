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
    // Maximum isolation: each test file in its own process
    isolate: true,
    // Strictly sequential execution - ONE file at a time
    fileParallelism: false,
    pool: "forks",
    // @ts-expect-error - maxForks exists at runtime but is not in the types
    maxForks: 1, // Single fork to avoid DB conflicts
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
