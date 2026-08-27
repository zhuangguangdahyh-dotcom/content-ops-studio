import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SCHEMA_ROOT = fileURLToPath(
  new URL("../../../plugins/content-ops-studio/schemas/1.0/", import.meta.url),
);

export interface SchemaCatalogEntry {
  logicalName: string;
  schemaId: string;
  file: string | null;
  contractVersion: string;
  schemaVersion: string;
  status: "implemented" | "planned";
  generatedTypeFile: string | null;
  fixtureDirectory: string | null;
  ownerDomain: string;
  description: string;
}

export interface SchemaCatalog {
  catalogVersion: string;
  contractVersion: string;
  schemaVersion: string;
  entries: SchemaCatalogEntry[];
}

export async function loadSchemaCatalog(schemaRoot = SCHEMA_ROOT): Promise<SchemaCatalog> {
  return JSON.parse(
    await readFile(path.join(schemaRoot, "schema-catalog.json"), "utf8"),
  ) as SchemaCatalog;
}

export async function loadImplementedSchemas(
  schemaRoot = SCHEMA_ROOT,
): Promise<Array<Record<string, unknown>>> {
  const catalog = await loadSchemaCatalog(schemaRoot);
  return Promise.all(
    catalog.entries
      .filter((entry) => entry.status === "implemented")
      .map(async (entry) => {
        if (!entry.file) throw new Error(`Implemented schema ${entry.logicalName} has no file.`);
        return JSON.parse(await readFile(path.join(schemaRoot, entry.file), "utf8")) as Record<
          string,
          unknown
        >;
      }),
  );
}
