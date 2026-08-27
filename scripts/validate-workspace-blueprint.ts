import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  generateFieldMapTemplate,
  validateBlueprintInvariants,
  type WorkspaceBlueprintDefinition,
  type WorkspaceFieldMapTemplate,
} from "../packages/contracts/src/workspace-blueprint.js";
import { loadSchemaRegistry } from "../packages/contracts/src/validation/index.js";

const blueprintPath = path.resolve("plugins/content-ops-studio/templates/feishu/workspace-v1.json");
const fieldMapPath = path.resolve("plugins/content-ops-studio/config/field-map-template.json");
const [blueprintText, fieldMapText, registry] = await Promise.all([
  readFile(blueprintPath, "utf8"),
  readFile(fieldMapPath, "utf8"),
  loadSchemaRegistry(),
]);
const blueprint = JSON.parse(blueprintText) as WorkspaceBlueprintDefinition;
const fieldMap = JSON.parse(fieldMapText) as WorkspaceFieldMapTemplate;
registry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/workspace-blueprint.schema.json",
  blueprint,
);
registry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/workspace-field-map.schema.json",
  fieldMap,
);
const invariantErrors = validateBlueprintInvariants(blueprint);
if (invariantErrors.length) throw new Error(invariantErrors.join("\n"));
const expected = JSON.stringify(generateFieldMapTemplate(blueprint));
if (JSON.stringify(fieldMap) !== expected)
  throw new Error("field-map-template.json has drifted from workspace-v1.json.");
console.log(`Workspace blueprint passed: ${blueprint.tables.length} tables.`);
