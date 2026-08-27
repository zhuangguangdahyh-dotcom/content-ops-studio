import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  FeishuBlueprintCompiler,
  FeishuFieldTypeMapper,
  FeishuRecordCompiler,
  buildFeishuReconciliationReport,
  type FeishuBlueprint,
} from "../../packages/workspace-adapters/src/index.js";

async function blueprint(): Promise<FeishuBlueprint> {
  return JSON.parse(
    await readFile(
      path.resolve("plugins/content-ops-studio/templates/feishu/workspace-v1.json"),
      "utf8",
    ),
  ) as FeishuBlueprint;
}

function required<T>(value: T | undefined, label: string): T {
  if (value === undefined) throw new Error(`Fixture omits ${label}.`);
  return value;
}

describe("Feishu Blueprint compiler", () => {
  it("compiles all four tables, 141 fields, five relations and four views", async () => {
    const plan = new FeishuBlueprintCompiler().compile(await blueprint(), null);
    expect(plan.expected).toEqual({
      tables: 4,
      fields: 141,
      relations: 5,
      views: 4,
      unsupportedFields: 0,
    });
    expect(plan.fieldOperations).toHaveLength(136);
    expect(plan.relationOperations).toHaveLength(5);
    expect(plan.viewOperations.every((view) => view.configuration === "NAME_ONLY")).toBe(true);
  });

  it("maps every current field type and stages relations after table IDs", async () => {
    const source = await blueprint();
    const mapper = new FeishuFieldTypeMapper();
    const types = new Map(
      source.tables.flatMap((table) =>
        table.fields
          .filter((field) => field.fieldType !== "RELATION")
          .map((field) => [field.fieldType, mapper.map(field).type]),
      ),
    );
    expect(Object.fromEntries(types)).toMatchObject({
      TEXT: 1,
      LONG_TEXT: 1,
      NUMBER: 2,
      SINGLE_SELECT: 3,
      MULTI_SELECT: 4,
      DATE: 5,
      DATETIME: 5,
      BOOLEAN: 7,
      ATTACHMENT: 17,
    });
    const relation = source.tables
      .flatMap((table) => table.fields)
      .find((field) => field.fieldType === "RELATION");
    const resolvedRelation = required(relation, "relation field");
    expect(() => mapper.map(resolvedRelation)).toThrow(/not resolved/);
    expect(
      mapper.map(resolvedRelation, {
        [resolvedRelation.targetTableLogicalKey]: "table-target",
      }).type,
    ).toBe(resolvedRelation.bidirectional ? 21 : 18);
  });

  it("uses current field names by stable IDs and protects user-managed fields", () => {
    const compiler = new FeishuRecordCompiler();
    const map = [
      {
        logicalKey: "name",
        fieldId: "fld-1",
        currentFieldName: "用户改过的名称",
        fieldType: 1,
        tableLogicalKey: "table",
        mappingVersion: 2,
        lastVerifiedAt: "2099-01-01T00:00:00.000Z",
        userManaged: false,
      },
      {
        logicalKey: "notes",
        fieldId: "fld-2",
        currentFieldName: "备注",
        fieldType: 1,
        tableLogicalKey: "table",
        mappingVersion: 2,
        lastVerifiedAt: "2099-01-01T00:00:00.000Z",
        userManaged: true,
      },
    ];
    expect(compiler.compile({ name: "value", notes: "do not overwrite" }, map, 2)).toEqual({
      用户改过的名称: "value",
    });
    expect(() => compiler.compile({ name: "value" }, map, 1)).toThrow(/stale/);
  });

  it("preserves extra remote fields and blocks type drift", async () => {
    const source = await blueprint();
    const first = required(source.tables[0], "first table");
    const firstField = required(first.fields[0], "first field");
    const report = buildFeishuReconciliationReport(source, {
      appTokenHash: null,
      name: "fixture",
      tables: [
        {
          tableId: "t1",
          name: first.displayName,
          fields: [
            { fieldId: "f1", fieldName: firstField.displayName, type: 2 },
            { fieldId: "extra", fieldName: "用户新增字段", type: 1 },
          ],
          views: [],
        },
      ],
    });
    expect(report.extraFields).toContain("projectConfig:用户新增字段");
    expect(report.typeConflicts).toContain(firstField.logicalKey);
    expect(report.overallStatus).toBe("BLOCKED");
  });
});
