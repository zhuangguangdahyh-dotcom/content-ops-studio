import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  generateFieldMapTemplate,
  type WorkspaceBlueprintDefinition,
} from "../packages/contracts/src/workspace-blueprint.js";

const blueprintPath = path.resolve("plugins/content-ops-studio/templates/feishu/workspace-v1.json");
const outputPath = path.resolve("plugins/content-ops-studio/config/field-map-template.json");
const blueprint = JSON.parse(await readFile(blueprintPath, "utf8")) as WorkspaceBlueprintDefinition;
await writeFile(
  outputPath,
  `${JSON.stringify(generateFieldMapTemplate(blueprint), null, 2)}\n`,
  "utf8",
);
console.log("Generated field-map-template.json from workspace-v1.json.");
