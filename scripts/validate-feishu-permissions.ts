import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadSchemaRegistry } from "../packages/contracts/src/validation/index.js";

const root = path.resolve("plugins/content-ops-studio");
const manifest = JSON.parse(
  await readFile(path.join(root, "config/feishu-permission-manifest.json"), "utf8"),
) as {
  permissions: Array<{ scope_key: string; official_source: string }>;
  deferred_permissions: string[];
  [key: string]: unknown;
};
const registry = await loadSchemaRegistry(path.join(root, "schemas/1.0"));
registry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/feishu-permission-manifest.schema.json",
  manifest,
);
const scopes = manifest.permissions.map((permission) => permission.scope_key);
if (new Set(scopes).size !== scopes.length) throw new Error("Duplicate Feishu permission scope.");
if (
  manifest.permissions.some(
    (permission) => !permission.official_source.startsWith("https://open.feishu.cn/"),
  )
)
  throw new Error("Permission source must be official Feishu documentation.");
if (!manifest.deferred_permissions.includes("drive:file:upload"))
  throw new Error("Attachment permission must remain deferred.");
console.log(
  `Feishu permission manifest passed: ${scopes.length} scopes, ${manifest.deferred_permissions.length} deferred.`,
);
