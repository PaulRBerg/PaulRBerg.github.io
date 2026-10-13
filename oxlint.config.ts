import { defineConfig } from "oxlint";
import astro from "ultracite/oxlint/astro";
import core from "ultracite/oxlint/core";

export default defineConfig({
  extends: [core, astro],
  ignorePatterns: [".ai/", ".vercel/", "reveal-js/"],
  options: {
    typeAware: true,
    typeCheck: true
  },
  overrides: [
    {
      files: ["**/*.astro"],
      rules: {
        "unicorn/consistent-function-scoping": "off"
      }
    }
  ],
  rules: {
    "import/no-relative-parent-imports": "off",
    "unicorn/filename-case": "off"
  }
});
