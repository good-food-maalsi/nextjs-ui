import next from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
const config = [
  // Ignorer le dossier .next
  {
    ignores: [".next/**/*"],
  },

  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "@next/next": next,
      prettier,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
      ...prettier.rules,

      // Custom rules
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-unneeded-ternary": "off",
    },
  },
];

export default config;
