import { execSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll } from "vitest";

const testsDir = dirname(fileURLToPath(import.meta.url));
const dataRoot = resolve(testsDir, "..");
const testDir = resolve(testsDir, ".tmp");
const testDatabasePath = resolve(testDir, "test.db");

rmSync(testDir, { recursive: true, force: true });
mkdirSync(testDir, { recursive: true });

process.env.DATABASE_URL = `file:${testDatabasePath}`;

execSync("pnpm exec prisma migrate deploy", {
  cwd: dataRoot,
  stdio: "inherit",
  env: process.env,
});

afterAll(async () => {
  const { prisma } = await import("../src/client");
  await prisma.$disconnect();
  rmSync(testDir, { recursive: true, force: true });
});
