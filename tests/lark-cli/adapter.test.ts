import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  FeishuFieldTypeMapper,
  LarkCliWorkspaceAdapter,
  compileLarkFieldJson,
  compileLarkRecordFilter,
  compileLarkRecordSearchBody,
  larkRecordValuesEquivalent,
  type FeishuBlueprint,
} from "../../packages/workspace-adapters/src/index.js";
import { LarkCliRunner } from "../../packages/workspace-adapters/src/lark-cli/index.js";

describe("LarkCliWorkspaceAdapter", () => {
  it("normalizes Lark empty values and date representations during read verification", () => {
    expect(larkRecordValuesEquivalent(1, null, "")).toBe(true);
    expect(larkRecordValuesEquivalent(18, null, [])).toBe(true);
    expect(larkRecordValuesEquivalent(18, [{ id: "rec-example" }], ["rec-example"])).toBe(true);
    expect(larkRecordValuesEquivalent(21, [{ id: "rec-example" }], ["rec-example"])).toBe(true);
    expect(larkRecordValuesEquivalent(3, ["待确认"], "待确认")).toBe(true);
    expect(larkRecordValuesEquivalent(5, "2022-11-09T00:00:00.000Z", "2022-11-09")).toBe(true);
    expect(larkRecordValuesEquivalent(5, "2022-11-09T00:00:00+08:00", "2022-11-09")).toBe(true);
    expect(
      larkRecordValuesEquivalent(5, "2026-08-24T09:00:00.000Z", "2026-08-24T09:00:00.500Z"),
    ).toBe(true);
    expect(larkRecordValuesEquivalent(1, "actual", "expected")).toBe(false);
  });

  it("translates the Direct Adapter equality filter into the official CLI DSL", () => {
    expect(
      compileLarkRecordFilter({
        conjunction: "and",
        conditions: [{ field_name: "记录唯一键", operator: "is", value: ["UNIQUE-1"] }],
      }),
    ).toEqual({ logic: "and", conditions: [["记录唯一键", "==", "UNIQUE-1"]] });
    expect(
      compileLarkRecordSearchBody({
        conjunction: "and",
        conditions: [{ field_name: "记录唯一键", operator: "is", value: ["UNIQUE-1"] }],
      }),
    ).toMatchObject({
      keyword: "UNIQUE-1",
      search_fields: ["记录唯一键"],
      offset: 0,
      limit: 2,
    });
  });

  it("resolves the platform default table when base-create omits its ID", async () => {
    const calls: string[][] = [];
    const runner = new LarkCliRunner("lark-cli", (_binary, argv) => {
      calls.push(argv);
      if (argv[1] === "+base-create")
        return Promise.resolve({
          exitCode: 0,
          stdout: JSON.stringify({
            ok: true,
            data: { base: { base_token: "base_fixture" } },
          }),
          stderr: "",
        });
      return Promise.resolve({
        exitCode: 0,
        stdout: JSON.stringify({
          ok: true,
          data: { tables: [{ id: "tbl_default", name: "数据表", rev: 0 }] },
        }),
        stderr: "",
      });
    });
    const adapter = new LarkCliWorkspaceAdapter({ runner });
    await expect(adapter.createWorkspace("Sandbox")).resolves.toMatchObject({
      appToken: "base_fixture",
      defaultTableId: "tbl_default",
    });
    expect(calls.map((call) => call[1])).toEqual(["+base-create", "+table-list"]);
  });

  it("reads the primary field ID from table-get without inferring from field count", async () => {
    const runner = new LarkCliRunner("lark-cli", () =>
      Promise.resolve({
        exitCode: 0,
        stdout: JSON.stringify({
          ok: true,
          data: { table: { id: "tbl_default", primary_field: "fld_primary" } },
        }),
        stderr: "",
      }),
    );
    const adapter = new LarkCliWorkspaceAdapter({ runner, baseToken: "base_fixture" });
    await expect(adapter.getPrimaryFieldId("tbl_default")).resolves.toBe("fld_primary");
  });

  it("resolves a created view by exact name when view-create omits its ID", async () => {
    const calls: string[][] = [];
    const runner = new LarkCliRunner("lark-cli", (_binary, argv) => {
      calls.push(argv);
      if (argv[1] === "+view-create")
        return Promise.resolve({
          exitCode: 0,
          stdout: JSON.stringify({ ok: true, data: { created: true } }),
          stderr: "",
        });
      return Promise.resolve({
        exitCode: 0,
        stdout: JSON.stringify({
          ok: true,
          data: { views: [{ id: "view_created", name: "当前项目配置", type: "grid" }] },
        }),
        stderr: "",
      });
    });
    const adapter = new LarkCliWorkspaceAdapter({ runner, baseToken: "base_fixture" });
    await expect(adapter.createView("tbl_default", "当前项目配置")).resolves.toMatchObject({
      viewId: "view_created",
      viewName: "当前项目配置",
    });
    expect(calls.map((call) => call[1])).toEqual(["+view-create", "+view-list"]);
  });

  it("uses the created views array without an additional eventually-consistent read", async () => {
    const calls: string[][] = [];
    const runner = new LarkCliRunner("lark-cli", (_binary, argv) => {
      calls.push(argv);
      return Promise.resolve({
        exitCode: 0,
        stdout: JSON.stringify({
          ok: true,
          data: { views: [{ id: "view_created", name: "待审核痛点", type: "grid" }] },
        }),
        stderr: "",
      });
    });
    const adapter = new LarkCliWorkspaceAdapter({ runner, baseToken: "base_fixture" });
    await expect(adapter.createView("tbl_default", "待审核痛点")).resolves.toMatchObject({
      viewId: "view_created",
    });
    expect(calls.map((call) => call[1])).toEqual(["+view-create"]);
  });

  it("compiles the unchanged 4/141/5/4 Blueprint into official field JSON", async () => {
    const blueprint = JSON.parse(
      await readFile("plugins/content-ops-studio/templates/feishu/workspace-v1.json", "utf8"),
    ) as FeishuBlueprint;
    const tableIds = Object.fromEntries(
      blueprint.tables.map((table, index) => [table.logicalKey, `tbl_fixture_${index}`]),
    );
    const mapper = new FeishuFieldTypeMapper();
    const requests = blueprint.tables.flatMap((table) =>
      table.fields.map((field) => mapper.map(field, tableIds)),
    );
    const compiled = requests.map(compileLarkFieldJson);
    expect(blueprint.tables).toHaveLength(4);
    expect(requests).toHaveLength(141);
    expect(
      blueprint.tables
        .flatMap((table) => table.fields)
        .filter((field) => field.fieldType === "RELATION"),
    ).toHaveLength(5);
    expect(blueprint.tables.flatMap((table) => table.views)).toHaveLength(4);
    expect(
      compiled.every((field) => typeof field.type === "string" && typeof field.name === "string"),
    ).toBe(true);
    expect(compiled.filter((field) => field.type === "link")).toHaveLength(5);
  });

  it("uses explicit user identity and reads records back after writes", async () => {
    const calls: string[][] = [];
    const runner = new LarkCliRunner("lark-cli", (_binary, argv) => {
      calls.push(argv);
      if (argv[1] === "+record-search")
        return Promise.resolve({
          exitCode: 0,
          stdout: JSON.stringify({ ok: true, data: { items: [] } }),
          stderr: "",
        });
      if (argv[1] === "+record-upsert")
        return Promise.resolve({
          exitCode: 0,
          stdout: JSON.stringify({
            ok: true,
            data: {
              record: { record_id: "rec_fixture", fields: { 唯一键: "UNIQUE-1", 状态: "READY" } },
            },
          }),
          stderr: "",
        });
      if (argv[1] === "+record-get")
        return Promise.resolve({
          exitCode: 0,
          stdout: JSON.stringify({
            ok: true,
            data: {
              records: [
                {
                  record_id: "rec_fixture",
                  fields: { 唯一键: "UNIQUE-1", 状态: ["READY"] },
                },
              ],
            },
          }),
          stderr: "",
        });
      return Promise.resolve({
        exitCode: 0,
        stdout: JSON.stringify({ ok: true, data: {} }),
        stderr: "",
      });
    });
    const adapter = new LarkCliWorkspaceAdapter({
      runner,
      baseToken: "base_fixture",
      fieldMap: [
        {
          logicalKey: "unique",
          fieldId: "fld_unique",
          currentFieldName: "唯一键",
          fieldType: 1,
          tableLogicalKey: "table",
          mappingVersion: 1,
          lastVerifiedAt: "2026-08-24T00:00:00.000Z",
          userManaged: false,
        },
        {
          logicalKey: "status",
          fieldId: "fld_status",
          currentFieldName: "状态",
          fieldType: 3,
          tableLogicalKey: "table",
          mappingVersion: 1,
          lastVerifiedAt: "2026-08-24T00:00:00.000Z",
          userManaged: false,
          optionMap: { READY: "READY" },
        },
      ],
    });
    const stored = await adapter.createRecord({
      uniqueKey: "UNIQUE-1",
      version: 1,
      tableId: "tbl_fixture",
      tableLogicalKey: "table",
      uniqueFieldLogicalKey: "unique",
      fields: { unique: "UNIQUE-1", status: "READY" },
    });
    expect(stored.recordId).toBe("rec_fixture");
    expect(
      calls
        .filter((call) => call.includes("--as"))
        .every((call) => call[call.indexOf("--as") + 1] === "user"),
    ).toBe(true);
    expect(calls.some((call) => call[1] === "+record-get")).toBe(true);
    const search = calls.find((call) => call[1] === "+record-search");
    const body = JSON.parse(search?.[search.indexOf("--json") + 1] ?? "{}") as {
      filter?: unknown;
    };
    expect(body.filter).toEqual({
      logic: "and",
      conditions: [["唯一键", "==", "UNIQUE-1"]],
    });
    expect(body).toMatchObject({ keyword: "UNIQUE-1", search_fields: ["唯一键"] });
    await expect(
      adapter.updateRecord({
        uniqueKey: "UNIQUE-1",
        version: 1,
        recordId: "rec_fixture",
        tableId: "tbl_fixture",
        tableLogicalKey: "table",
        uniqueFieldLogicalKey: "unique",
        fields: { status: "READY" },
      }),
    ).resolves.toMatchObject({ recordId: "rec_fixture", version: 2 });
    await expect(adapter.uploadAttachment()).rejects.toMatchObject({
      code: "LARK_CLI_ATTACHMENT_UPLOAD_DEFERRED",
    });
  });

  it("parses the official columnar record response", async () => {
    const runner = new LarkCliRunner("lark-cli", () =>
      Promise.resolve({
        exitCode: 0,
        stdout: JSON.stringify({
          ok: true,
          data: {
            fields: ["记录唯一键", "状态"],
            data: [["UNIQUE-1", "READY"]],
            record_id_list: ["rec_fixture"],
          },
        }),
        stderr: "",
      }),
    );
    const adapter = new LarkCliWorkspaceAdapter({ runner, baseToken: "base_fixture" });
    await expect(
      adapter.searchRecords("tbl_fixture", "table", {
        conjunction: "and",
        conditions: [{ field_name: "记录唯一键", operator: "is", value: ["UNIQUE-1"] }],
      }),
    ).resolves.toEqual([
      expect.objectContaining({
        recordId: "rec_fixture",
        fields: { 记录唯一键: "UNIQUE-1", 状态: "READY" },
      }),
    ]);
  });

  it("retries update read verification while the official CLI returns stale record values", async () => {
    let getCalls = 0;
    const runner = new LarkCliRunner("lark-cli", (_binary, argv) => {
      if (argv[1] === "+record-upsert")
        return Promise.resolve({
          exitCode: 0,
          stdout: JSON.stringify({ ok: true, data: { updated: true } }),
          stderr: "",
        });
      if (argv[1] === "+record-get") {
        getCalls += 1;
        const current = getCalls >= 3;
        return Promise.resolve({
          exitCode: 0,
          stdout: JSON.stringify({
            ok: true,
            data: {
              records: [
                {
                  record_id: "rec_fixture",
                  fields: {
                    审核状态: [current ? "已确认" : "待确认"],
                    更新时间: current
                      ? "2026-08-24T18:41:13.135+08:00"
                      : "2026-08-24T17:00:00.000+08:00",
                  },
                },
              ],
            },
          }),
          stderr: "",
        });
      }
      return Promise.reject(new Error(`Unexpected command ${argv[1] ?? "unknown"}`));
    });
    const adapter = new LarkCliWorkspaceAdapter({
      runner,
      baseToken: "base_fixture",
      fieldMap: [
        {
          logicalKey: "reviewStatus",
          fieldId: "fld_status",
          currentFieldName: "审核状态",
          fieldType: 3,
          tableLogicalKey: "table",
          mappingVersion: 1,
          lastVerifiedAt: "2026-08-24T00:00:00.000Z",
          userManaged: true,
          optionMap: { PAINPOINT_CONFIRMED: "已确认" },
        },
        {
          logicalKey: "updatedAt",
          fieldId: "fld_updated",
          currentFieldName: "更新时间",
          fieldType: 5,
          tableLogicalKey: "table",
          mappingVersion: 1,
          lastVerifiedAt: "2026-08-24T00:00:00.000Z",
          userManaged: false,
        },
      ],
    });
    await expect(
      adapter.updateRecord({
        uniqueKey: "UNIQUE-1",
        version: 1,
        recordId: "rec_fixture",
        tableId: "tbl_fixture",
        tableLogicalKey: "table",
        uniqueFieldLogicalKey: "unique",
        allowUserManaged: true,
        fields: {
          reviewStatus: "PAINPOINT_CONFIRMED",
          updatedAt: "2026-08-24T10:41:13.135Z",
        },
      }),
    ).resolves.toMatchObject({ recordId: "rec_fixture", version: 2 });
    expect(getCalls).toBe(4);
  });
});
