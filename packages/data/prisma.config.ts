import "dotenv/config";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";
import { sqliteFileUrl } from "./src/sqlite-url";

const dataRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx seed.ts",
  },
  datasource: {
    url: sqliteFileUrl(dataRoot, process.env.DATABASE_URL),
  },
});
