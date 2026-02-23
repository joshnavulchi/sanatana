import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Allow Node scripts in `scripts/` to use CommonJS `require()` and
  // avoid TypeScript-eslint errors that are intended for TS/ESM code.
  {
    files: ["scripts/**"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }
  ,
  // Temporary relaxed rules for large legacy codebase to reduce CI noise.
  // These are reversible and scoped to source files; we'll incrementally
  // tighten them later as we fix types across the repo.
  {
    files: ["app/**", "lib/**", "types/**", "jest.setup.ts", "**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
  ,
  // Allow `require()` style imports in server-side tooling and library helpers
  // that need synchronous filesystem access during SSR.
  {
    files: ["lib/**", "next.config.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  }
]);

export default eslintConfig;
