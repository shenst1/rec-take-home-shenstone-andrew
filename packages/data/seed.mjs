import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const dataDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(dataDir, { recursive: true });

const dbPath = join(dataDir, "rec.db");
const db = new DatabaseSync(dbPath);

db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

console.log(`SQLite ready at ${dbPath}`);

db.close();
