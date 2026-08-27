import type { WorkspaceRecord } from "../index.js";
import type { FeishuTransport } from "./transport/index.js";
import {
  FeishuBlueprintCompiler,
  FeishuRecordCompiler,
  type FeishuBlueprint,
  type FeishuFieldMapEntry,
  type FeishuFieldRequest,
  type FeishuRemoteField,
  type FeishuRemoteTable,
  type FeishuWorkspaceSnapshot,
} from "./blueprint/index.js";
import { FeishuAdapterError, feishuError, redactFeishuText } from "./errors.js";

function segment(value: string): string {
  return encodeURIComponent(value);
}
function requireObject(value: unknown, operation: string): Record<string, unknown> {
  if (!value || typeof value !== "object")
    throw feishuError("FEISHU_RESPONSE_INVALID", `${operation} response data was invalid.`, {
      scope: operation,
    });
  return value as Record<string, unknown>;
}
function stringValue(value: unknown, name: string, operation: string): string {
  if (typeof value !== "string" || !value)
    throw feishuError("FEISHU_RESPONSE_INVALID", `${operation} response omitted ${name}.`, {
      scope: operation,
    });
  return value;
}

export interface FeishuWorkspaceAdapterOptions {
  transport: FeishuTransport;
  appToken?: string;
  fieldMap?: FeishuFieldMapEntry[];
  mappingVersion?: number;
  recordBatchSize?: number;
}

export interface FeishuCreatedWorkspace {
  workspaceId: string;
  appToken: string;
  defaultTableId: string;
}
export interface FeishuCreatedTable {
  tableId: string;
  defaultViewId: string | null;
  fieldIds: string[];
}
export interface FeishuRecordInput extends WorkspaceRecord {
  tableId: string;
  tableLogicalKey: string;
  uniqueFieldLogicalKey: string;
  approvedLogicalKeys?: string[];
  allowUserManaged?: boolean;
}
export interface FeishuStoredRecord extends WorkspaceRecord {
  recordId: string;
  tableId: string;
  tableLogicalKey: string;
}
export interface FeishuBatchUpsertResult {
  succeeded: FeishuStoredRecord[];
  failed: Array<{ uniqueKey: string; code: string; message: string }>;
}

export class FeishuWorkspaceAdapter {
  readonly #transport: FeishuTransport;
  readonly #recordCompiler = new FeishuRecordCompiler();
  readonly #blueprintCompiler = new FeishuBlueprintCompiler();
  readonly #recordBatchSize: number;
  #appToken: string | null;
  #fieldMap: FeishuFieldMapEntry[];
  #mappingVersion: number;

  constructor(options: FeishuWorkspaceAdapterOptions) {
    this.#transport = options.transport;
    this.#appToken = options.appToken ?? null;
    this.#fieldMap = options.fieldMap ?? [];
    this.#mappingVersion = options.mappingVersion ?? 1;
    this.#recordBatchSize = options.recordBatchSize ?? 1000;
    if (this.#recordBatchSize < 1 || this.#recordBatchSize > 1000)
      throw feishuError(
        "FEISHU_CONFIG_MISSING",
        "Record batch size must use the documented limit of at most 1000.",
        { scope: "adapter" },
      );
  }

  setWorkspace(appToken: string): void {
    this.#appToken = appToken;
  }
  setFieldMap(entries: FeishuFieldMapEntry[], mappingVersion: number): void {
    this.#fieldMap = structuredClone(entries);
    this.#mappingVersion = mappingVersion;
  }
  #token(): string {
    if (!this.#appToken)
      throw feishuError("FEISHU_CONFIG_MISSING", "No project app_token reference is resolved.", {
        scope: "adapter",
      });
    return this.#appToken;
  }

  async probeConnection(): Promise<{ ready: boolean; implementation: string }> {
    if (this.#appToken) await this.getWorkspaceInfo();
    else
      await this.#transport
        .request({
          operation: "PROBE_CONNECTION",
          method: "GET",
          path: "/open-apis/bitable/v1/apps/__credential_probe__",
        })
        .catch((error) => {
          if (error instanceof FeishuAdapterError && error.code === "FEISHU_PERMISSION_DENIED")
            return;
          throw error;
        });
    return { ready: true, implementation: "feishu-node24-fetch" };
  }

  async createWorkspace(name: string, parentFolderToken?: string): Promise<FeishuCreatedWorkspace> {
    const response = await this.#transport.request<Record<string, unknown>>({
      operation: "CREATE_WORKSPACE",
      method: "POST",
      path: "/open-apis/bitable/v1/apps",
      body: { name, ...(parentFolderToken ? { folder_token: parentFolderToken } : {}) },
    });
    const app = requireObject(
      requireObject(response.data, "CREATE_WORKSPACE").app,
      "CREATE_WORKSPACE",
    );
    const appToken = stringValue(app.app_token, "app_token", "CREATE_WORKSPACE");
    const defaultTableId = stringValue(
      app.default_table_id,
      "default_table_id",
      "CREATE_WORKSPACE",
    );
    this.#appToken = appToken;
    return { workspaceId: appToken, appToken, defaultTableId };
  }

  async getWorkspaceInfo(): Promise<{ appToken: string; name: string; revision: number | null }> {
    const token = this.#token();
    const response = await this.#transport.request<Record<string, unknown>>({
      operation: "GET_WORKSPACE",
      method: "GET",
      path: `/open-apis/bitable/v1/apps/${segment(token)}`,
    });
    const app = requireObject(requireObject(response.data, "GET_WORKSPACE").app, "GET_WORKSPACE");
    return {
      appToken: stringValue(app.app_token, "app_token", "GET_WORKSPACE"),
      name: stringValue(app.name, "name", "GET_WORKSPACE"),
      revision: typeof app.revision === "number" ? app.revision : null,
    };
  }

  async listTables(): Promise<Array<{ tableId: string; name: string; revision: number | null }>> {
    const token = this.#token();
    const items = await this.#paginate(
      "LIST_TABLES",
      `/open-apis/bitable/v1/apps/${segment(token)}/tables`,
    );
    return items.map((item) => ({
      tableId: stringValue(item.table_id, "table_id", "LIST_TABLES"),
      name: stringValue(item.name, "name", "LIST_TABLES"),
      revision: typeof item.revision === "number" ? item.revision : null,
    }));
  }

  async adoptDefaultTable(tableId: string, name: string): Promise<void> {
    const token = this.#token();
    await this.#transport.request({
      operation: "ADOPT_DEFAULT_TABLE",
      method: "PATCH",
      path: `/open-apis/bitable/v1/apps/${segment(token)}/tables/${segment(tableId)}`,
      body: { name },
    });
    const found = (await this.listTables()).find((table) => table.tableId === tableId);
    if (!found || found.name !== name)
      throw feishuError("FEISHU_SCHEMA_DRIFT", "Default table rename was not verified.", {
        scope: "ADOPT_DEFAULT_TABLE",
      });
  }

  async createTable(name: string, primaryField: FeishuFieldRequest): Promise<FeishuCreatedTable> {
    const token = this.#token();
    const response = await this.#transport.request<Record<string, unknown>>({
      operation: "CREATE_TABLE",
      method: "POST",
      path: `/open-apis/bitable/v1/apps/${segment(token)}/tables`,
      body: {
        table: {
          name,
          default_view_name: "默认视图",
          fields: [
            {
              field_name: primaryField.field_name,
              type: primaryField.type,
              ui_type: primaryField.ui_type,
              ...(primaryField.property ? { property: primaryField.property } : {}),
            },
          ],
        },
      },
    });
    const data = requireObject(response.data, "CREATE_TABLE");
    return {
      tableId: stringValue(data.table_id, "table_id", "CREATE_TABLE"),
      defaultViewId: typeof data.default_view_id === "string" ? data.default_view_id : null,
      fieldIds: Array.isArray(data.field_id_list)
        ? data.field_id_list.filter((value): value is string => typeof value === "string")
        : [],
    };
  }

  async listFields(tableId: string): Promise<FeishuRemoteField[]> {
    const token = this.#token();
    const items = await this.#paginate(
      "LIST_FIELDS",
      `/open-apis/bitable/v1/apps/${segment(token)}/tables/${segment(tableId)}/fields`,
    );
    return items.map((item) => ({
      fieldId: stringValue(item.field_id, "field_id", "LIST_FIELDS"),
      fieldName: stringValue(item.field_name, "field_name", "LIST_FIELDS"),
      type: typeof item.type === "number" ? item.type : -1,
      ...(item.property && typeof item.property === "object"
        ? { property: item.property as Record<string, unknown> }
        : {}),
    }));
  }

  async createField(tableId: string, request: FeishuFieldRequest): Promise<FeishuRemoteField> {
    const token = this.#token();
    const response = await this.#transport.request<Record<string, unknown>>({
      operation: "CREATE_FIELD",
      method: "POST",
      path: `/open-apis/bitable/v1/apps/${segment(token)}/tables/${segment(tableId)}/fields`,
      body: {
        field_name: request.field_name,
        type: request.type,
        ui_type: request.ui_type,
        ...(request.property ? { property: request.property } : {}),
      },
    });
    const field = requireObject(requireObject(response.data, "CREATE_FIELD").field, "CREATE_FIELD");
    return {
      fieldId: stringValue(field.field_id, "field_id", "CREATE_FIELD"),
      fieldName: stringValue(field.field_name, "field_name", "CREATE_FIELD"),
      type: typeof field.type === "number" ? field.type : request.type,
      ...(field.property && typeof field.property === "object"
        ? { property: field.property as Record<string, unknown> }
        : {}),
    };
  }

  async updateField(
    tableId: string,
    fieldId: string,
    request: FeishuFieldRequest,
  ): Promise<FeishuRemoteField> {
    const token = this.#token();
    const response = await this.#transport.request<Record<string, unknown>>({
      operation: "UPDATE_FIELD",
      method: "PUT",
      path: `/open-apis/bitable/v1/apps/${segment(token)}/tables/${segment(tableId)}/fields/${segment(fieldId)}`,
      body: {
        field_name: request.field_name,
        type: request.type,
        ...(request.property ? { property: request.property } : {}),
      },
    });
    const field = requireObject(requireObject(response.data, "UPDATE_FIELD").field, "UPDATE_FIELD");
    return {
      fieldId: stringValue(field.field_id, "field_id", "UPDATE_FIELD"),
      fieldName: stringValue(field.field_name, "field_name", "UPDATE_FIELD"),
      type: typeof field.type === "number" ? field.type : request.type,
    };
  }

  async listViews(
    tableId: string,
  ): Promise<Array<{ viewId: string; viewName: string; viewType: string }>> {
    const token = this.#token();
    const items = await this.#paginate(
      "LIST_VIEWS",
      `/open-apis/bitable/v1/apps/${segment(token)}/tables/${segment(tableId)}/views`,
    );
    return items.map((item) => ({
      viewId: stringValue(item.view_id, "view_id", "LIST_VIEWS"),
      viewName: stringValue(item.view_name, "view_name", "LIST_VIEWS"),
      viewType: typeof item.view_type === "string" ? item.view_type : "grid",
    }));
  }

  async createView(
    tableId: string,
    name: string,
    type: "grid" = "grid",
  ): Promise<{ viewId: string; viewName: string; configuration: "NAME_ONLY" }> {
    const token = this.#token();
    const response = await this.#transport.request<Record<string, unknown>>({
      operation: "CREATE_VIEW",
      method: "POST",
      path: `/open-apis/bitable/v1/apps/${segment(token)}/tables/${segment(tableId)}/views`,
      body: { view_name: name, view_type: type },
    });
    const view = requireObject(requireObject(response.data, "CREATE_VIEW").view, "CREATE_VIEW");
    return {
      viewId: stringValue(view.view_id, "view_id", "CREATE_VIEW"),
      viewName: stringValue(view.view_name, "view_name", "CREATE_VIEW"),
      configuration: "NAME_ONLY",
    };
  }

  async findRecordByUniqueKey(
    uniqueKey: string,
    input: Pick<FeishuRecordInput, "tableId" | "tableLogicalKey" | "uniqueFieldLogicalKey">,
  ): Promise<FeishuStoredRecord | null> {
    const field = this.#field(input.uniqueFieldLogicalKey, input.tableLogicalKey);
    const records = await this.searchRecords(input.tableId, input.tableLogicalKey, {
      conjunction: "and",
      conditions: [{ field_name: field.currentFieldName, operator: "is", value: [uniqueKey] }],
    });
    if (records.length > 1)
      throw feishuError(
        "FEISHU_RECORD_CONFLICT",
        `Unique key ${uniqueKey} matched multiple records.`,
        { scope: "SEARCH_RECORDS" },
      );
    return records[0] ?? null;
  }

  async createRecord(record: FeishuRecordInput, clientToken?: string): Promise<FeishuStoredRecord> {
    if (await this.findRecordByUniqueKey(record.uniqueKey, record))
      throw feishuError("FEISHU_RECORD_CONFLICT", `Record ${record.uniqueKey} already exists.`, {
        scope: "CREATE_RECORD",
      });
    const token = this.#token();
    const fields = this.#recordCompiler.compile(
      record.fields,
      this.#fieldMapForTable(record.tableLogicalKey),
      this.#mappingVersion,
      {
        ...(record.approvedLogicalKeys ? { approvedLogicalKeys: record.approvedLogicalKeys } : {}),
        ...(record.allowUserManaged ? { allowUserManaged: true } : {}),
      },
    );
    const response = await this.#transport.request<Record<string, unknown>>({
      operation: "CREATE_RECORD",
      method: "POST",
      path: `/open-apis/bitable/v1/apps/${segment(token)}/tables/${segment(record.tableId)}/records`,
      query: clientToken ? { client_token: clientToken } : {},
      body: { fields },
    });
    const remote = requireObject(
      requireObject(response.data, "CREATE_RECORD").record,
      "CREATE_RECORD",
    );
    const stored = this.#stored(
      remote,
      record.tableId,
      record.tableLogicalKey,
      record.uniqueKey,
      record.version,
    );
    if (!(await this.verifyWrite(stored, record.fields)))
      throw feishuError(
        "FEISHU_RESPONSE_INVALID",
        "Record create read-after-write verification failed.",
        { scope: "CREATE_RECORD" },
      );
    return stored;
  }

  async updateRecord(
    record: FeishuRecordInput & { recordId: string },
    clientToken?: string,
  ): Promise<FeishuStoredRecord> {
    const token = this.#token();
    const fields = this.#recordCompiler.compile(
      record.fields,
      this.#fieldMapForTable(record.tableLogicalKey),
      this.#mappingVersion,
      {
        ...(record.approvedLogicalKeys ? { approvedLogicalKeys: record.approvedLogicalKeys } : {}),
        ...(record.allowUserManaged ? { allowUserManaged: true } : {}),
      },
    );
    const response = await this.#transport.request<Record<string, unknown>>({
      operation: "UPDATE_RECORD",
      method: "PUT",
      path: `/open-apis/bitable/v1/apps/${segment(token)}/tables/${segment(record.tableId)}/records/${segment(record.recordId)}`,
      query: clientToken ? { client_token: clientToken } : {},
      body: { fields },
    });
    const remote = requireObject(
      requireObject(response.data, "UPDATE_RECORD").record,
      "UPDATE_RECORD",
    );
    const stored = this.#stored(
      remote,
      record.tableId,
      record.tableLogicalKey,
      record.uniqueKey,
      record.version + 1,
    );
    if (!(await this.verifyWrite(stored, record.fields)))
      throw feishuError(
        "FEISHU_RESPONSE_INVALID",
        "Record update read-after-write verification failed.",
        { scope: "UPDATE_RECORD" },
      );
    return stored;
  }

  async batchUpsertRecords(
    records: FeishuRecordInput[],
    idempotencyKey: string,
  ): Promise<FeishuBatchUpsertResult> {
    const result: FeishuBatchUpsertResult = { succeeded: [], failed: [] };
    for (let offset = 0; offset < records.length; offset += this.#recordBatchSize) {
      const chunk = records.slice(offset, offset + this.#recordBatchSize);
      const creates: FeishuRecordInput[] = [];
      const updates: Array<{ input: FeishuRecordInput; existing: FeishuStoredRecord }> = [];
      for (const record of chunk) {
        try {
          const existing = await this.findRecordByUniqueKey(record.uniqueKey, record);
          if (existing) updates.push({ input: record, existing });
          else creates.push(record);
        } catch (error) {
          result.failed.push({
            uniqueKey: record.uniqueKey,
            code: error instanceof FeishuAdapterError ? error.code : "FEISHU_API_ERROR",
            message: (error as Error).message,
          });
        }
      }
      await this.#executeBatchCreate(creates, idempotencyKey, result);
      await this.#executeBatchUpdate(updates, idempotencyKey, result);
    }
    return result;
  }

  async #executeBatchCreate(
    records: FeishuRecordInput[],
    idempotencyKey: string,
    result: FeishuBatchUpsertResult,
  ): Promise<void> {
    if (!records.length) return;
    const first = records[0];
    if (!first) return;
    if (records.some((record) => record.tableId !== first.tableId))
      throw feishuError("FEISHU_RECORD_CONFLICT", "A batch must target exactly one table.", {
        scope: "BATCH_CREATE_RECORDS",
      });
    const compiled = records.map((record) => ({
      fields: this.#recordCompiler.compile(
        record.fields,
        this.#fieldMapForTable(record.tableLogicalKey),
        this.#mappingVersion,
        {
          ...(record.approvedLogicalKeys
            ? { approvedLogicalKeys: record.approvedLogicalKeys }
            : {}),
          ...(record.allowUserManaged ? { allowUserManaged: true } : {}),
        },
      ),
    }));
    try {
      const response = await this.#transport.request<Record<string, unknown>>({
        operation: "BATCH_CREATE_RECORDS",
        method: "POST",
        path: `/open-apis/bitable/v1/apps/${segment(this.#token())}/tables/${segment(first.tableId)}/records/batch_create`,
        query: { client_token: `${idempotencyKey}:create` },
        body: { records: compiled },
      });
      const remote = requireObject(response.data, "BATCH_CREATE_RECORDS").records;
      const returned: unknown[] = Array.isArray(remote) ? (remote as unknown[]) : [];
      for (const [index, input] of records.entries()) {
        const item = returned[index];
        if (!item || typeof item !== "object") {
          await this.#retrySingleBatchItem(input, null, idempotencyKey, result);
          continue;
        }
        const stored = this.#stored(
          item as Record<string, unknown>,
          input.tableId,
          input.tableLogicalKey,
          input.uniqueKey,
          input.version,
        );
        if (await this.verifyWrite(stored, input.fields)) result.succeeded.push(stored);
        else await this.#retrySingleBatchItem(input, null, idempotencyKey, result);
      }
    } catch (error) {
      for (const input of records)
        await this.#retrySingleBatchItem(input, null, idempotencyKey, result, error);
    }
  }

  async #executeBatchUpdate(
    records: Array<{ input: FeishuRecordInput; existing: FeishuStoredRecord }>,
    idempotencyKey: string,
    result: FeishuBatchUpsertResult,
  ): Promise<void> {
    if (!records.length) return;
    const first = records[0];
    if (!first) return;
    if (records.some(({ input }) => input.tableId !== first.input.tableId))
      throw feishuError("FEISHU_RECORD_CONFLICT", "A batch must target exactly one table.", {
        scope: "BATCH_UPDATE_RECORDS",
      });
    const compiled = records.map(({ input, existing }) => ({
      record_id: existing.recordId,
      fields: this.#recordCompiler.compile(
        input.fields,
        this.#fieldMapForTable(input.tableLogicalKey),
        this.#mappingVersion,
        {
          ...(input.approvedLogicalKeys ? { approvedLogicalKeys: input.approvedLogicalKeys } : {}),
          ...(input.allowUserManaged ? { allowUserManaged: true } : {}),
        },
      ),
    }));
    try {
      const response = await this.#transport.request<Record<string, unknown>>({
        operation: "BATCH_UPDATE_RECORDS",
        method: "POST",
        path: `/open-apis/bitable/v1/apps/${segment(this.#token())}/tables/${segment(first.input.tableId)}/records/batch_update`,
        query: { client_token: `${idempotencyKey}:update` },
        body: { records: compiled },
      });
      const remote = requireObject(response.data, "BATCH_UPDATE_RECORDS").records;
      const returned: unknown[] = Array.isArray(remote) ? (remote as unknown[]) : [];
      for (const [index, entry] of records.entries()) {
        const item = returned[index];
        if (!item || typeof item !== "object") {
          await this.#retrySingleBatchItem(entry.input, entry.existing, idempotencyKey, result);
          continue;
        }
        const stored = this.#stored(
          item as Record<string, unknown>,
          entry.input.tableId,
          entry.input.tableLogicalKey,
          entry.input.uniqueKey,
          entry.existing.version + 1,
        );
        if (await this.verifyWrite(stored, entry.input.fields)) result.succeeded.push(stored);
        else await this.#retrySingleBatchItem(entry.input, entry.existing, idempotencyKey, result);
      }
    } catch (error) {
      for (const entry of records)
        await this.#retrySingleBatchItem(
          entry.input,
          entry.existing,
          idempotencyKey,
          result,
          error,
        );
    }
  }

  async #retrySingleBatchItem(
    input: FeishuRecordInput,
    existing: FeishuStoredRecord | null,
    idempotencyKey: string,
    result: FeishuBatchUpsertResult,
    initialError?: unknown,
  ): Promise<void> {
    try {
      if (!existing) {
        const adopted = await this.findRecordByUniqueKey(input.uniqueKey, input);
        if (adopted && (await this.verifyWrite(adopted, input.fields))) {
          result.succeeded.push(adopted);
          return;
        }
      }
      result.succeeded.push(
        existing
          ? await this.updateRecord(
              { ...input, recordId: existing.recordId, version: existing.version },
              `${idempotencyKey}:${input.uniqueKey}:retry`,
            )
          : await this.createRecord(input, `${idempotencyKey}:${input.uniqueKey}:retry`),
      );
    } catch (error) {
      const finalError = error ?? initialError;
      result.failed.push({
        uniqueKey: input.uniqueKey,
        code: finalError instanceof FeishuAdapterError ? finalError.code : "FEISHU_API_ERROR",
        message: redactFeishuText((finalError as Error).message),
      });
    }
  }

  async readRecord(
    recordId: string,
    tableId: string,
    tableLogicalKey: string,
    uniqueKey: string,
  ): Promise<FeishuStoredRecord | null> {
    const token = this.#token();
    try {
      const response = await this.#transport.request<Record<string, unknown>>({
        operation: "READ_RECORD",
        method: "GET",
        path: `/open-apis/bitable/v1/apps/${segment(token)}/tables/${segment(tableId)}/records/${segment(recordId)}`,
      });
      const record = requireObject(
        requireObject(response.data, "READ_RECORD").record,
        "READ_RECORD",
      );
      return this.#stored(record, tableId, tableLogicalKey, uniqueKey, 1);
    } catch (error) {
      if (error instanceof FeishuAdapterError && error.redacted_remote_code === "1254043")
        return null;
      throw error;
    }
  }

  async searchRecords(
    tableId: string,
    tableLogicalKey: string,
    filter: Record<string, unknown>,
  ): Promise<FeishuStoredRecord[]> {
    const token = this.#token();
    const records: FeishuStoredRecord[] = [];
    let pageToken: string | undefined;
    do {
      const response = await this.#transport.request<Record<string, unknown>>({
        operation: "SEARCH_RECORDS",
        method: "POST",
        path: `/open-apis/bitable/v1/apps/${segment(token)}/tables/${segment(tableId)}/records/search`,
        query: { page_size: 500, ...(pageToken ? { page_token: pageToken } : {}) },
        body: { filter },
      });
      const data = requireObject(response.data, "SEARCH_RECORDS");
      for (const item of Array.isArray(data.items) ? data.items : [])
        if (item && typeof item === "object")
          records.push(
            this.#stored(item as Record<string, unknown>, tableId, tableLogicalKey, "REMOTE", 1),
          );
      pageToken =
        data.has_more === true && typeof data.page_token === "string" ? data.page_token : undefined;
    } while (pageToken);
    return records;
  }

  async inspectSchema(): Promise<FeishuWorkspaceSnapshot> {
    const info = await this.getWorkspaceInfo();
    const tables: FeishuRemoteTable[] = [];
    for (const table of await this.listTables())
      tables.push({
        tableId: table.tableId,
        name: table.name,
        fields: await this.listFields(table.tableId),
        views: await this.listViews(table.tableId),
      });
    return { appTokenHash: null, name: info.name, tables };
  }

  async reconcileSchema(
    blueprint: FeishuBlueprint,
    mode: "PROVISION" | "REPAIR_ADD_ONLY" = "REPAIR_ADD_ONLY",
  ) {
    return this.#blueprintCompiler.compile(blueprint, await this.inspectSchema(), mode);
  }

  async verifyWrite(
    record: FeishuStoredRecord,
    expectedLogicalFields: Record<string, unknown>,
  ): Promise<boolean> {
    const read = await this.readRecord(
      record.recordId,
      record.tableId,
      record.tableLogicalKey,
      record.uniqueKey,
    );
    if (!read) return false;
    const expected = this.#recordCompiler.compile(
      expectedLogicalFields,
      this.#fieldMapForTable(record.tableLogicalKey),
      this.#mappingVersion,
      { allowUserManaged: true },
    );
    return Object.entries(expected).every(
      ([name, value]) => JSON.stringify(read.fields[name]) === JSON.stringify(value),
    );
  }

  async verifyWorkspace(
    blueprint: FeishuBlueprint,
  ): Promise<{ verified: boolean; plan: ReturnType<FeishuBlueprintCompiler["compile"]> }> {
    const plan = this.#blueprintCompiler.compile(
      blueprint,
      await this.inspectSchema(),
      "REPAIR_ADD_ONLY",
    );
    const pending = [
      ...plan.tableOperations,
      ...plan.fieldOperations,
      ...plan.relationOperations,
      ...plan.viewOperations,
    ].some(
      (operation) =>
        operation.operation !== "SKIP_VERIFIED" && operation.operation !== "UPDATE_MAPPING",
    );
    return { verified: !pending && plan.conflicts.length === 0, plan };
  }

  uploadAttachment(): Promise<never> {
    return Promise.reject(
      feishuError(
        "FEISHU_ATTACHMENT_UPLOAD_DEFERRED",
        "Attachment upload is NOT_IMPLEMENTED and DEFERRED_TO_FUTURE_PHASE.",
        {
          scope: "attachment",
          recommended_action: "Use a future explicitly approved attachment phase.",
        },
      ),
    );
  }

  async #paginate(operation: string, path: string): Promise<Record<string, unknown>[]> {
    const items: Record<string, unknown>[] = [];
    let pageToken: string | undefined;
    do {
      const response = await this.#transport.request<Record<string, unknown>>({
        operation,
        method: "GET",
        path,
        query: { page_size: 100, ...(pageToken ? { page_token: pageToken } : {}) },
      });
      const data = requireObject(response.data, operation);
      for (const item of Array.isArray(data.items) ? data.items : [])
        if (item && typeof item === "object") items.push(item as Record<string, unknown>);
      pageToken =
        data.has_more === true && typeof data.page_token === "string" ? data.page_token : undefined;
    } while (pageToken);
    return items;
  }

  #field(logicalKey: string, tableLogicalKey: string): FeishuFieldMapEntry {
    const field = this.#fieldMap.find(
      (entry) => entry.logicalKey === logicalKey && entry.tableLogicalKey === tableLogicalKey,
    );
    if (!field)
      throw feishuError(
        "FEISHU_SCHEMA_DRIFT",
        `No verified field mapping for ${tableLogicalKey}.${logicalKey}.`,
        { scope: "field-map" },
      );
    return field;
  }
  #fieldMapForTable(tableLogicalKey: string): FeishuFieldMapEntry[] {
    return this.#fieldMap.filter((entry) => entry.tableLogicalKey === tableLogicalKey);
  }
  #stored(
    remote: Record<string, unknown>,
    tableId: string,
    tableLogicalKey: string,
    uniqueKey: string,
    version: number,
  ): FeishuStoredRecord {
    return {
      recordId: stringValue(remote.record_id, "record_id", "RECORD"),
      tableId,
      tableLogicalKey,
      uniqueKey,
      version,
      fields:
        remote.fields && typeof remote.fields === "object"
          ? (remote.fields as Record<string, unknown>)
          : {},
    };
  }
}
