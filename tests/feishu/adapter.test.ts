import { describe, expect, it } from "vitest";
import {
  FeishuWorkspaceAdapter,
  type FeishuTransport,
  type FeishuTransportRequest,
} from "../../packages/workspace-adapters/src/index.js";

function transport(handler: (request: FeishuTransportRequest) => unknown): FeishuTransport {
  return {
    request<T>(request: FeishuTransportRequest) {
      return Promise.resolve({
        status: 200,
        requestId: "req-demo",
        data: handler(request) as T,
        attempts: 1,
      });
    },
  };
}

describe("FeishuWorkspaceAdapter", () => {
  it("creates a Base, captures its default table, and read-verifies metadata", async () => {
    const calls: string[] = [];
    const adapter = new FeishuWorkspaceAdapter({
      transport: transport((request) => {
        calls.push(`${request.method} ${request.path}`);
        if (request.operation === "CREATE_WORKSPACE")
          return {
            app: { app_token: "app-demo", name: "Fixture", default_table_id: "table-default" },
          };
        if (request.operation === "GET_WORKSPACE")
          return { app: { app_token: "app-demo", name: "Fixture", revision: 1 } };
        throw new Error(request.operation);
      }),
    });
    await expect(adapter.createWorkspace("Fixture", "folder-demo")).resolves.toEqual({
      workspaceId: "app-demo",
      appToken: "app-demo",
      defaultTableId: "table-default",
    });
    await expect(adapter.getWorkspaceInfo()).resolves.toEqual({
      appToken: "app-demo",
      name: "Fixture",
      revision: 1,
    });
    expect(calls).toEqual([
      "POST /open-apis/bitable/v1/apps",
      "GET /open-apis/bitable/v1/apps/app-demo",
    ]);
  });

  it("paginates tables, fields and views and compiles official names", async () => {
    const adapter = new FeishuWorkspaceAdapter({
      appToken: "app-demo",
      transport: transport((request) => {
        if (request.operation === "LIST_TABLES")
          return {
            items: [{ table_id: "table-1", name: "01 项目配置", revision: 2 }],
            has_more: false,
          };
        if (request.operation === "LIST_FIELDS")
          return {
            items: [{ field_id: "field-1", field_name: "项目名称", type: 1 }],
            has_more: false,
          };
        if (request.operation === "LIST_VIEWS")
          return {
            items: [{ view_id: "view-1", view_name: "当前项目配置", view_type: "grid" }],
            has_more: false,
          };
        throw new Error(request.operation);
      }),
    });
    await expect(adapter.listTables()).resolves.toEqual([
      { tableId: "table-1", name: "01 项目配置", revision: 2 },
    ]);
    await expect(adapter.listFields("table-1")).resolves.toEqual([
      { fieldId: "field-1", fieldName: "项目名称", type: 1 },
    ]);
    await expect(adapter.listViews("table-1")).resolves.toEqual([
      { viewId: "view-1", viewName: "当前项目配置", viewType: "grid" },
    ]);
  });

  it("uses the Search API for unique keys and current field names for record writes", async () => {
    let createdBody: unknown;
    const adapter = new FeishuWorkspaceAdapter({
      appToken: "app-demo",
      mappingVersion: 1,
      fieldMap: [
        {
          logicalKey: "unique",
          fieldId: "field-1",
          currentFieldName: "用户改名后的唯一键",
          fieldType: 1,
          tableLogicalKey: "contents",
          mappingVersion: 1,
          lastVerifiedAt: "2099-01-01T00:00:00.000Z",
          userManaged: false,
        },
        {
          logicalKey: "title",
          fieldId: "field-2",
          currentFieldName: "当前标题",
          fieldType: 1,
          tableLogicalKey: "contents",
          mappingVersion: 1,
          lastVerifiedAt: "2099-01-01T00:00:00.000Z",
          userManaged: false,
        },
      ],
      transport: transport((request) => {
        if (request.operation === "SEARCH_RECORDS")
          return createdBody
            ? {
                items: [
                  {
                    record_id: "record-1",
                    fields: { 当前标题: "Hello", 用户改名后的唯一键: "KEY-1" },
                  },
                ],
                has_more: false,
              }
            : { items: [], has_more: false };
        if (request.operation === "CREATE_RECORD") {
          createdBody = request.body;
          return {
            record: {
              record_id: "record-1",
              fields: { 当前标题: "Hello", 用户改名后的唯一键: "KEY-1" },
            },
          };
        }
        if (request.operation === "READ_RECORD")
          return {
            record: {
              record_id: "record-1",
              fields: { 当前标题: "Hello", 用户改名后的唯一键: "KEY-1" },
            },
          };
        throw new Error(request.operation);
      }),
    });
    await adapter.createRecord({
      uniqueKey: "KEY-1",
      version: 1,
      fields: { unique: "KEY-1", title: "Hello" },
      tableId: "table-1",
      tableLogicalKey: "contents",
      uniqueFieldLogicalKey: "unique",
    });
    expect(createdBody).toEqual({ fields: { 用户改名后的唯一键: "KEY-1", 当前标题: "Hello" } });
  });

  it("uses official batch endpoints and retries only an unverified item", async () => {
    const remote = new Map<string, { record_id: string; fields: Record<string, unknown> }>();
    const operations: string[] = [];
    const adapter = new FeishuWorkspaceAdapter({
      appToken: "app-demo",
      fieldMap: [
        {
          logicalKey: "unique",
          fieldId: "field-1",
          currentFieldName: "唯一键",
          fieldType: 1,
          tableLogicalKey: "contents",
          mappingVersion: 1,
          lastVerifiedAt: "2099-01-01T00:00:00.000Z",
          userManaged: false,
        },
        {
          logicalKey: "title",
          fieldId: "field-2",
          currentFieldName: "标题",
          fieldType: 1,
          tableLogicalKey: "contents",
          mappingVersion: 1,
          lastVerifiedAt: "2099-01-01T00:00:00.000Z",
          userManaged: false,
        },
      ],
      transport: transport((request) => {
        operations.push(request.operation);
        if (request.operation === "SEARCH_RECORDS") {
          const body = request.body as {
            filter: { conditions: Array<{ value: string[] }> };
          };
          const key = body.filter.conditions[0]?.value[0] ?? "";
          const found = remote.get(key);
          return { items: found ? [found] : [], has_more: false };
        }
        if (request.operation === "BATCH_CREATE_RECORDS") {
          const body = request.body as { records: Array<{ fields: Record<string, unknown> }> };
          const successful = body.records.slice(0, 2).map(({ fields }, index) => {
            const key = String(fields["唯一键"]);
            const record = { record_id: `record-${index + 1}`, fields };
            remote.set(key, record);
            return record;
          });
          return { records: successful };
        }
        if (request.operation === "CREATE_RECORD") {
          const fields = (request.body as { fields: Record<string, unknown> }).fields;
          const key = String(fields["唯一键"]);
          const record = { record_id: "record-3", fields };
          remote.set(key, record);
          return { record };
        }
        if (request.operation === "BATCH_UPDATE_RECORDS") {
          const body = request.body as {
            records: Array<{ record_id: string; fields: Record<string, unknown> }>;
          };
          return {
            records: body.records.map(({ record_id, fields }) => {
              const key = String(fields["唯一键"]);
              const record = { record_id, fields };
              remote.set(key, record);
              return record;
            }),
          };
        }
        if (request.operation === "READ_RECORD") {
          const recordId = request.path.split("/").at(-1);
          return { record: [...remote.values()].find((record) => record.record_id === recordId) };
        }
        throw new Error(request.operation);
      }),
    });
    const result = await adapter.batchUpsertRecords(
      ["KEY-1", "KEY-2", "KEY-3"].map((uniqueKey) => ({
        uniqueKey,
        version: 1,
        fields: { unique: uniqueKey, title: uniqueKey },
        tableId: "table-1",
        tableLogicalKey: "contents",
        uniqueFieldLogicalKey: "unique",
      })),
      "IDEMPOTENCY",
    );
    expect(result).toMatchObject({ failed: [] });
    expect(result.succeeded).toHaveLength(3);
    expect(operations.filter((operation) => operation === "BATCH_CREATE_RECORDS")).toHaveLength(1);
    expect(operations.filter((operation) => operation === "CREATE_RECORD")).toHaveLength(1);
    const updated = await adapter.batchUpsertRecords(
      ["KEY-1", "KEY-2", "KEY-3"].map((uniqueKey) => ({
        uniqueKey,
        version: 1,
        fields: { unique: uniqueKey, title: `${uniqueKey}-UPDATED` },
        tableId: "table-1",
        tableLogicalKey: "contents",
        uniqueFieldLogicalKey: "unique",
      })),
      "IDEMPOTENCY-UPDATE",
    );
    expect(updated.failed).toEqual([]);
    expect(updated.succeeded).toHaveLength(3);
    expect(operations.filter((operation) => operation === "BATCH_UPDATE_RECORDS")).toHaveLength(1);
  });

  it("explicitly defers attachment upload", async () => {
    const adapter = new FeishuWorkspaceAdapter({ transport: transport(() => ({})) });
    await expect(adapter.uploadAttachment()).rejects.toMatchObject({
      code: "FEISHU_ATTACHMENT_UPLOAD_DEFERRED",
    });
  });
});
