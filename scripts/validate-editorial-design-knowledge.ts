import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadSchemaRegistry } from "../packages/contracts/src/validation/index.js";
import {
  EDITORIAL_DESIGN_KNOWLEDGE_VERSION,
  EDITORIAL_DESIGN_PRINCIPLES,
} from "../packages/core/src/visual-baseline/index.js";

const configRoot = path.resolve("plugins/content-ops-studio/config");
const parseJson = (source: string): unknown => JSON.parse(source) as unknown;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const [registry, manifest, knowledge] = await Promise.all([
  loadSchemaRegistry(),
  readFile(path.join(configRoot, "editorial-design-knowledge-source-manifest.json"), "utf8").then(
    parseJson,
  ),
  readFile(path.join(configRoot, "editorial-design-knowledge-v1.json"), "utf8").then(parseJson),
]);
registry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/editorial-design-knowledge-source-manifest.schema.json",
  manifest,
);
registry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/editorial-design-knowledge-layer.schema.json",
  knowledge,
);
if (!isRecord(manifest) || !isRecord(knowledge))
  throw new Error("EDITORIAL_KNOWLEDGE_CONFIG_INVALID");
if (knowledge.knowledge_version !== EDITORIAL_DESIGN_KNOWLEDGE_VERSION)
  throw new Error("EDITORIAL_KNOWLEDGE_VERSION_MISMATCH");
if (JSON.stringify(knowledge.principles) !== JSON.stringify(EDITORIAL_DESIGN_PRINCIPLES))
  throw new Error("EDITORIAL_KNOWLEDGE_PRINCIPLE_DRIFT");
if (manifest.runtime_browsing !== false || knowledge.runtime_browsing !== false)
  throw new Error("EDITORIAL_RUNTIME_BROWSING_FORBIDDEN");
if (!Array.isArray(manifest.sources)) throw new Error("EDITORIAL_SOURCE_LIST_INVALID");
console.log(
  `Editorial design knowledge ${knowledge.knowledge_version}: ${manifest.sources.length} verified public sources, runtime browsing disabled.`,
);
