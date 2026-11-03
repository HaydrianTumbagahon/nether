import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  ...eslintPluginAstro.configs["flat/recommended"],
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: config.files ?? ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
  })),
];
