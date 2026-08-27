import { readFile } from "node:fs/promises";
import path from "node:path";

const config = JSON.parse(
  await readFile(
    path.resolve("plugins/content-ops-studio/config/feishu-api-capabilities.json"),
    "utf8",
  ),
) as {
  snapshot_date: string;
  capabilities: Array<[string, string, string, string, number | string | null, string, string]>;
};
const operations = new Set<string>();
for (const [
  operation,
  method,
  endpoint,
  sdkMethod,
  batchLimit,
  retry,
  status,
] of config.capabilities) {
  if (operations.has(operation)) throw new Error(`Duplicate Feishu operation ${operation}.`);
  operations.add(operation);
  if (!(["GET", "POST", "PUT", "PATCH", "DELETE"] as string[]).includes(method))
    throw new Error(`Invalid method for ${operation}.`);
  if (endpoint !== "DEFERRED" && !endpoint.startsWith("/open-apis/"))
    throw new Error(`Invalid endpoint for ${operation}.`);
  if (!sdkMethod || !retry || !(["IMPLEMENTED_OFFLINE", "DEFERRED"] as string[]).includes(status))
    throw new Error(`Incomplete capability ${operation}.`);
  if (typeof batchLimit === "number" && batchLimit > 1000)
    throw new Error(`Unsafe batch limit for ${operation}.`);
}
for (const operation of [
  "CREATE_WORKSPACE",
  "LIST_TABLES",
  "CREATE_FIELD",
  "CREATE_VIEW",
  "SEARCH_RECORDS",
  "UPDATE_RECORD",
  "UPLOAD_ATTACHMENT",
])
  if (!operations.has(operation)) throw new Error(`Missing capability ${operation}.`);
console.log(
  `Feishu capability snapshot passed: ${config.capabilities.length} operations at ${config.snapshot_date}.`,
);
