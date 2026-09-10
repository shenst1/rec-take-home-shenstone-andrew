import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../generated/client";
import { sqliteFileUrl } from "./sqlite-url";

const dataRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: sqliteFileUrl(dataRoot, process.env.DATABASE_URL),
    }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
