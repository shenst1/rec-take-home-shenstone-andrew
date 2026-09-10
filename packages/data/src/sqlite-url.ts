import { isAbsolute, resolve } from "node:path";

export function sqliteFileUrl(dataRoot: string, envUrl?: string) {
  const raw = envUrl ?? "file:./rec.db";
  const withoutProtocol = raw.startsWith("file:")
    ? raw.slice("file:".length).replace(/^\/\//, "")
    : raw;
  const filePath = isAbsolute(withoutProtocol)
    ? withoutProtocol
    : resolve(dataRoot, withoutProtocol);

  return `file://${filePath}`;
}
