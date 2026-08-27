import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  loadImplementedSchemas,
  loadSchemaCatalog,
} from "../../packages/contracts/src/schema-catalog.js";
import {
  ContractValidationError,
  SchemaRegistry,
  loadSchemaRegistry,
} from "../../packages/contracts/src/validation/index.js";

const fixtureRoot = path.resolve("tests/fixtures/contracts/1.0");

describe("JSON Schema contracts", () => {
  it("catalogs every source schema as implemented", async () => {
    const catalog = await loadSchemaCatalog();
    const schemaFiles = (
      await readdir(path.resolve("plugins/content-ops-studio/schemas/1.0"))
    ).filter((file) => file.endsWith(".schema.json"));
    expect(catalog.entries.filter((entry) => entry.status === "implemented")).toHaveLength(
      schemaFiles.length,
    );
    expect(catalog.entries.filter((entry) => entry.status === "planned")).toHaveLength(0);
    expect(catalog.entries.every((entry) => entry.contractVersion === "1.0.0")).toBe(true);
  });

  it("uses unique Draft 2020-12 IDs and compiles every implemented schema in strict mode", async () => {
    const schemas = await loadImplementedSchemas();
    const ids = schemas.map((schema) => schema.$id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(
      schemas.every((schema) => schema.$schema === "https://json-schema.org/draft/2020-12/schema"),
    ).toBe(true);
    expect(schemas.every((schema) => typeof schema.$comment === "string")).toBe(true);
    const registry = new SchemaRegistry(schemas);
    for (const id of ids) expect(() => registry.get(id as string)).not.toThrow();
  });

  it("accepts all valid fixtures and rejects every committed invalid fixture", async () => {
    const [catalog, registry] = await Promise.all([loadSchemaCatalog(), loadSchemaRegistry()]);
    for (const entry of catalog.entries.filter((item) => item.status === "implemented")) {
      const root = path.join(fixtureRoot, entry.logicalName);
      const validFiles = await readdir(path.join(root, "valid"));
      const invalidFiles = await readdir(path.join(root, "invalid"));
      expect(validFiles.length, entry.logicalName).toBeGreaterThanOrEqual(1);
      expect(invalidFiles.length, entry.logicalName).toBeGreaterThanOrEqual(2);
      for (const file of validFiles) {
        const value = JSON.parse(await readFile(path.join(root, "valid", file), "utf8")) as unknown;
        expect(
          registry.validateBySchemaId(entry.schemaId, value),
          `${entry.logicalName}/${file}`,
        ).toEqual({ valid: true, errors: [] });
      }
      for (const file of invalidFiles) {
        const value = JSON.parse(
          await readFile(path.join(root, "invalid", file), "utf8"),
        ) as unknown;
        expect(
          registry.validateBySchemaId(entry.schemaId, value).valid,
          `${entry.logicalName}/${file}`,
        ).toBe(false);
      }
    }
  });

  it("enforces real formats, closed roots, and controlled extensions", async () => {
    const registry = await loadSchemaRegistry();
    const schemaId = "https://content-ops-studio.local/schemas/1.0/evidence-record.schema.json";
    const fixture = JSON.parse(
      await readFile(path.join(fixtureRoot, "evidence-record/valid/complete.json"), "utf8"),
    ) as Record<string, unknown>;
    expect(
      registry.validateBySchemaId(schemaId, { ...fixture, source_date: "not-a-date" }).valid,
    ).toBe(false);
    expect(registry.validateBySchemaId(schemaId, { ...fixture, undeclared: true }).valid).toBe(
      false,
    );
    expect(
      registry.validateBySchemaId(schemaId, { ...fixture, extensions: { future_key: true } }).valid,
    ).toBe(true);
    expect(
      registry.validateBySchemaId(schemaId, {
        ...fixture,
        source_type: "MODEL_HYPOTHESIS",
        confidence: "A_DIRECT_STRONG",
      }).valid,
    ).toBe(false);
    expect(
      registry.validateBySchemaId(schemaId, {
        ...fixture,
        confidence: "D_HYPOTHESIS",
        limitations: "",
      }).valid,
    ).toBe(false);
  });

  it("returns stable redacted errors without echoing instance values", async () => {
    const registry = await loadSchemaRegistry();
    const schemaId =
      "https://content-ops-studio.local/schemas/1.0/workspace-connection.schema.json";
    const fixture = JSON.parse(
      await readFile(path.join(fixtureRoot, "workspace-connection/valid/complete.json"), "utf8"),
    ) as Record<string, unknown>;
    const forbiddenKey = ["access", "token"].join("_");
    const sensitiveValue = ["fictional", "sensitive", "value"].join("-");
    const result = registry.validateBySchemaId(schemaId, {
      ...fixture,
      [forbiddenKey]: sensitiveValue,
    });
    expect(result.valid).toBe(false);
    const firstError = result.errors[0];
    expect(firstError).toBeDefined();
    if (!firstError) throw new Error("Expected a validation error.");
    expect(firstError.schema_id).toBe(schemaId);
    expect(typeof firstError.instance_path).toBe("string");
    expect(typeof firstError.schema_path).toBe("string");
    expect(typeof firstError.keyword).toBe("string");
    expect(typeof firstError.message).toBe("string");
    expect(typeof firstError.params).toBe("object");
    expect(JSON.stringify(result.errors)).not.toContain(sensitiveValue);
    expect(() =>
      registry.assertValid(schemaId, { ...fixture, [forbiddenKey]: sensitiveValue }),
    ).toThrow(ContractValidationError);
  });

  it("fails on duplicate IDs and unresolved references", async () => {
    const schemas = await loadImplementedSchemas();
    const firstSchema = schemas[0];
    if (!firstSchema) throw new Error("Expected at least one implemented schema.");
    expect(() => new SchemaRegistry([firstSchema, firstSchema])).toThrow(/Duplicate schema \$id/);
    expect(
      () =>
        new SchemaRegistry([
          {
            $schema: "https://json-schema.org/draft/2020-12/schema",
            $id: "https://content-ops-studio.local/schemas/1.0/broken.schema.json",
            $ref: "missing.schema.json",
          },
        ]),
    ).toThrow(/resolve reference|can't resolve reference/i);
  });

  it("keeps the cross-object workflow fixture referentially consistent", async () => {
    const fixture = JSON.parse(
      await readFile(path.join(fixtureRoot, "cross-object/valid/full-workflow.json"), "utf8"),
    ) as Record<string, Record<string, unknown>>;
    expect(fixture.workspace?.project_id).toBe(fixture.project?.project_id);
    expect(fixture.evidence?.project_id).toBe(fixture.project?.project_id);
    expect(fixture.painpoint?.evidence_refs).toContain(fixture.evidence?.evidence_id);
    expect(fixture.content?.primary_painpoint_id).toBe(fixture.painpoint?.painpoint_id);
    expect(fixture.feedback?.related_content_ids).toContain(fixture.content?.content_id);
    expect(fixture.approval?.target_id).toBe(fixture.content?.content_id);
    expect(fixture.run?.run_id).toBe(fixture.approval?.source_run_id);
  });
});
