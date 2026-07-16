import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: dirname
});

const config = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      ".next/**",
      ".next-*/**",
      ".next-corrupt-*/**",
      "node_modules/**",
      "content-source/**",
      "tsconfig.tsbuildinfo"
    ]
  }
];

export default config;
