import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const dataDir = import.meta.dir;
mkdirSync(dataDir, { recursive: true });

const dbPath = join(dataDir, "rec.db");
const db = new Database(dbPath);

db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA foreign_keys = ON;");

console.log(`SQLite ready at ${dbPath}`);

db.close();
