import { loadSchemaCatalog } from "../packages/contracts/src/schema-catalog.js";
import { loadSchemaRegistry } from "../packages/contracts/src/validation/index.js";

const [catalog, registry] = await Promise.all([loadSchemaCatalog(), loadSchemaRegistry()]);
const implemented = catalog.entries.filter((entry) => entry.status === "implemented");
for (const entry of implemented) registry.get(entry.schemaId);
console.log(`Strict Ajv validation passed for ${implemented.length} implemented schemas.`);
