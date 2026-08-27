import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  generateFieldMapTemplate,
  validateBlueprintInvariants,
  type WorkspaceBlueprintDefinition,
} from "../../packages/contracts/src/workspace-blueprint.js";

async function loadBlueprint(): Promise<WorkspaceBlueprintDefinition> {
  return JSON.parse(
    await readFile(
      path.resolve("plugins/content-ops-studio/templates/feishu/workspace-v1.json"),
      "utf8",
    ),
  ) as WorkspaceBlueprintDefinition;
}

describe("workspace blueprint", () => {
  it("contains the complete four-table, 141-field logical model", async () => {
    const blueprint = await loadBlueprint();
    expect(blueprint.tables.map((table) => table.logicalKey)).toEqual([
      "projectConfig",
      "painpoints",
      "contents",
      "rulesAndFeedback",
    ]);
    expect(blueprint.tables.flatMap((table) => table.fields)).toHaveLength(141);
    expect(validateBlueprintInvariants(blueprint)).toEqual([]);
  });

  it("has one primary field per table, valid relations, and no ownership conflicts", async () => {
    const blueprint = await loadBlueprint();
    const tableKeys = new Set(blueprint.tables.map((table) => table.logicalKey));
    const fields = blueprint.tables.flatMap((table) => table.fields);
    for (const table of blueprint.tables)
      expect(table.fields.filter((field) => field.primary)).toHaveLength(1);
    expect(new Set(fields.map((field) => field.logicalKey)).size).toBe(fields.length);
    for (const field of fields) {
      expect(field.displayName.length).toBeGreaterThan(0);
      expect(field.systemManaged).not.toBe(field.userManaged);
      if (field.relationship !== "NONE")
        expect(tableKeys.has(field.targetTableLogicalKey)).toBe(true);
      expect(new Set(field.options.map((option) => option.code)).size).toBe(field.options.length);
    }
  });

  it("derives the committed field-map template exactly from the blueprint", async () => {
    const blueprint = await loadBlueprint();
    const actual = JSON.parse(
      await readFile(
        path.resolve("plugins/content-ops-studio/config/field-map-template.json"),
        "utf8",
      ),
    ) as unknown;
    expect(actual).toEqual(generateFieldMapTemplate(blueprint));
  });

  it("contains no external workspace IDs, Feishu URLs, or credentials", async () => {
    const text = await readFile(
      path.resolve("plugins/content-ops-studio/templates/feishu/workspace-v1.json"),
      "utf8",
    );
    expect(text).not.toMatch(/https?:\/\/(?:[^\s]*\.)?(?:feishu\.cn|larksuite\.com)/i);
    expect(text).not.toMatch(
      /(?:access_token|refresh_token|app_secret|client_secret|private_key)/i,
    );
    expect(text).not.toMatch(/\b(?:tbl|fld|viw)[A-Za-z0-9]{12,}\b/);
  });
});
