import {
  FeishuBlueprintCompiler,
  FeishuRecordCompiler,
  type FeishuBlueprint,
  type FeishuFieldMapEntry,
  type FeishuFieldRequest,
  type FeishuRemoteField,
  type FeishuRemoteTable,
  type FeishuWorkspaceSnapshot,
} from "../feishu/blueprint/index.js";
import type {
  FeishuBatchUpsertResult,
  FeishuCreatedTable,
  FeishuCreatedWorkspace,
  FeishuRecordInput,
  FeishuStoredRecord,
} from "../feishu/adapter.js";
import { LarkCliError, type LarkCliIdentity } from "./types.js";
import type { LarkCliRunner } from "./runner.js";

function object(value: unknown, operation: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new LarkCliError("LARK_CLI_RESPONSE_INVALID", `${operation} returned an invalid object.`);
  return value as Record<string, unknown>;
}

function textValue(value: unknown, name: string, operation: string): string {
  if (typeof value !== "string" || !value)
    throw new LarkCliError("LARK_CLI_RESPONSE_INVALID", `${operation} omitted ${name}.`);
  return value;
}

function firstObject(value: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  for (const key of keys) {
    const candidate = value[key];
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate))
      return candidate as Record<string, unknown>;
  }
  return value;
}

function listFrom(value: unknown): Record<string, unknown>[] {
  const root = object(value, "LIST");
  const candidate =
    root.items ??
    root.records ??
    root.tables ??
    root.fields ??
    root.views ??
    firstObject(root, ["data"]).items;
  return Array.isArray(candidate)
    ? candidate.filter(
        (entry): entry is Record<string, unknown> =>
          !!entry && typeof entry === "object" && !Array.isArray(entry),
      )
    : [];
}

function recordsFrom(value: unknown): Record<string, unknown>[] {
  const root = object(value, "RECORD_LIST");
  if (
    Array.isArray(root.data) &&
    Array.isArray(root.fields) &&
    Array.isArray(root.record_id_list)
  ) {
    const names = (root.fields as unknown[]).map((field) => {
      if (typeof field === "string") return field;
      if (!field || typeof field !== "object" || Array.isArray(field)) return "";
      const fieldObject = field as Record<string, unknown>;
      const name = fieldObject.name ?? fieldObject.field_name;
      return typeof name === "string" ? name : "";
    });
    return (root.data as unknown[]).flatMap((row, index) => {
      const recordId = (root.record_id_list as unknown[])[index];
      if (!Array.isArray(row) || typeof recordId !== "string" || !recordId) return [];
      const fields = Object.fromEntries(
        names.flatMap((name, fieldIndex) => (name ? [[name, row[fieldIndex]]] : [])),
      );
      return [{ record_id: recordId, fields }];
    });
  }
  return listFrom(value);
}

function firstRecordFrom(value: unknown, operation: string): Record<string, unknown> {
  const records = recordsFrom(value);
  if (records.length) return records[0] as Record<string, unknown>;
  return firstObject(object(value, operation), ["record"]);
}

async function shortDelay(milliseconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function compileLarkRecordFilter(filter: Record<string, unknown>): Record<string, unknown> {
  if (typeof filter.logic === "string" && Array.isArray(filter.conditions))
    return structuredClone(filter);
  const logic = filter.conjunction === "or" ? "or" : "and";
  const source = Array.isArray(filter.conditions) ? filter.conditions : [];
  const conditions = source.map((entry) => {
    const condition = object(entry, "RECORD_FILTER");
    const field = textValue(condition.field_name, "field_name", "RECORD_FILTER");
    const operator = condition.operator === "is" ? "==" : condition.operator;
    if (typeof operator !== "string" || !operator)
      throw new LarkCliError(
        "LARK_CLI_FILTER_UNSUPPORTED",
        "Record filter operator is unsupported.",
      );
    const rawValue = condition.value;
    const values = Array.isArray(rawValue) ? (rawValue as unknown[]) : null;
    const value: unknown = values?.length === 1 ? values[0] : rawValue;
    return [field, operator, value] as [string, string, unknown];
  });
  return { logic, conditions };
}

export function compileLarkRecordSearchBody(
  filter: Record<string, unknown>,
): Record<string, unknown> {
  const compiled = compileLarkRecordFilter(filter);
  const conditions = compiled.conditions as Array<[string, string, unknown]>;
  const first = conditions[0];
  if (!first || typeof first[0] !== "string" || typeof first[2] !== "string" || !first[2])
    throw new LarkCliError(
      "LARK_CLI_FILTER_UNSUPPORTED",
      "Record search requires one string field/value condition.",
    );
  return {
    keyword: first[2],
    search_fields: [first[0]],
    filter: compiled,
    offset: 0,
    limit:
      typeof filter.limit === "number" &&
      Number.isInteger(filter.limit) &&
      filter.limit >= 1 &&
      filter.limit <= 200
        ? filter.limit
        : 2,
  };
}

export function larkRecordValuesEquivalent(
  fieldType: number | undefined,
  actual: unknown,
  expected: unknown,
): boolean {
  if (actual === null && (expected === "" || (Array.isArray(expected) && expected.length === 0)))
    return true;
  if ((fieldType === 18 || fieldType === 21) && Array.isArray(actual) && Array.isArray(expected)) {
    const relationIds = (value: unknown[]): unknown[] =>
      value.map((item) =>
        item && typeof item === "object" && !Array.isArray(item) && "id" in item ? item.id : item,
      );
    return JSON.stringify(relationIds(actual)) === JSON.stringify(relationIds(expected));
  }
  const values: readonly unknown[] | null = Array.isArray(actual) ? actual : null;
  const normalized = fieldType === 3 && values?.length === 1 ? values[0] : actual;
  if (JSON.stringify(normalized) === JSON.stringify(expected)) return true;
  if (fieldType !== 5 || typeof normalized !== "string" || typeof expected !== "string")
    return false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(expected))
    return normalized.replaceAll("/", "-").slice(0, 10) === expected;
  const expectedTime = Date.parse(expected);
  const actualTime = Date.parse(normalized);
  if (Number.isFinite(expectedTime) && Number.isFinite(actualTime))
    return Math.abs(expectedTime - actualTime) <= 1000;
  return false;
}

const NUMERIC_TYPE: Record<string, number> = {
  text: 1,
  number: 2,
  select: 3,
  datetime: 5,
  checkbox: 7,
  attachment: 17,
  link: 18,
};

export function compileLarkFieldJson(request: FeishuFieldRequest): Record<string, unknown> {
  const property = request.property ?? {};
  switch (request.type) {
    case 1:
      return { type: "text", name: request.field_name };
    case 2:
      return { type: "number", name: request.field_name };
    case 3:
    case 4:
      return {
        type: "select",
        name: request.field_name,
        multiple: request.type === 4,
        options: Array.isArray(property.options)
          ? property.options.map((item) => ({
              name: textValue(object(item, "FIELD_OPTION").name, "name", "FIELD_OPTION"),
            }))
          : [],
      };
    case 5:
      return {
        type: "datetime",
        name: request.field_name,
        style: { format: property.date_formatter ?? "yyyy/MM/dd" },
      };
    case 7:
      return { type: "checkbox", name: request.field_name };
    case 17:
      return { type: "attachment", name: request.field_name };
    case 18:
    case 21:
      return {
        type: "link",
        name: request.field_name,
        link_table: textValue(property.table_id, "table_id", "RELATION_FIELD"),
        bidirectional: request.type === 21,
        ...(request.type === 21 && typeof property.back_field_name === "string"
          ? { bidirectional_link_field_name: property.back_field_name }
          : {}),
      };
    default:
      throw new LarkCliError(
        "LARK_CLI_FIELD_TYPE_UNSUPPORTED",
        `Field type ${request.type} is unsupported.`,
      );
  }
}

export interface LarkCliWorkspaceAdapterOptions {
  runner: LarkCliRunner;
  identity?: LarkCliIdentity;
  baseToken?: string;
  fieldMap?: FeishuFieldMapEntry[];
  mappingVersion?: number;
  recordBatchSize?: number;
}

export class LarkCliWorkspaceAdapter {
  readonly #recordCompiler = new FeishuRecordCompiler();
  readonly #blueprintCompiler = new FeishuBlueprintCompiler();
  readonly #identity: LarkCliIdentity;
  readonly #batchSize: number;
  #baseToken: string | null;
  #fieldMap: FeishuFieldMapEntry[];
  #mappingVersion: number;

  constructor(private readonly options: LarkCliWorkspaceAdapterOptions) {
    this.#identity = options.identity ?? "user";
    this.#baseToken = options.baseToken ?? null;
    this.#fieldMap = structuredClone(options.fieldMap ?? []);
    this.#mappingVersion = options.mappingVersion ?? 1;
    this.#batchSize = options.recordBatchSize ?? 200;
    if (this.#batchSize < 1 || this.#batchSize > 200)
      throw new LarkCliError(
        "LARK_CLI_BATCH_SIZE_INVALID",
        "Official Base batch size must be between 1 and 200.",
        5,
      );
  }

  setWorkspace(baseToken: string): void {
    this.#baseToken = baseToken;
  }
  setFieldMap(entries: FeishuFieldMapEntry[], mappingVersion: number): void {
    this.#fieldMap = structuredClone(entries);
    this.#mappingVersion = mappingVersion;
  }
  #token(): string {
    if (!this.#baseToken)
      throw new LarkCliError(
        "LARK_CLI_WORKSPACE_NOT_READY",
        "No project-local Base reference is resolved.",
        5,
      );
    return this.#baseToken;
  }
  #common(): string[] {
    return ["--as", this.#identity, "--format", "json"];
  }
  async #run<T>(operation: string, args: string[], allowHighRiskUpdate = false): Promise<T> {
    return await this.options.runner.require<T>({
      argv: ["base", ...args],
      operation,
      allowHighRiskUpdate,
    });
  }

  async probeConnection(): Promise<{ ready: boolean; implementation: string }> {
    await this.options.runner.require({
      argv: ["auth", "status", "--json"],
      operation: "AUTH_STATUS",
    });
    if (this.#baseToken) await this.getWorkspaceInfo();
    return { ready: true, implementation: "official-lark-cli-user-oauth" };
  }

  async createWorkspace(name: string, parentFolderToken?: string): Promise<FeishuCreatedWorkspace> {
    const data = object(
      await this.#run("CREATE_WORKSPACE", [
        "+base-create",
        "--name",
        name,
        ...(parentFolderToken ? ["--folder-token", parentFolderToken] : []),
        ...this.#common(),
      ]),
      "CREATE_WORKSPACE",
    );
    const base = firstObject(data, ["base", "app"]);
    const baseToken = textValue(
      base.base_token ?? base.app_token ?? data.base_token ?? data.app_token,
      "base_token",
      "CREATE_WORKSPACE",
    );
    this.#baseToken = baseToken;
    let defaultTableId =
      typeof base.default_table_id === "string"
        ? base.default_table_id
        : typeof data.default_table_id === "string"
          ? data.default_table_id
          : null;
    if (!defaultTableId) {
      const tables = await this.listTables();
      if (tables.length !== 1 || !tables[0])
        throw new LarkCliError(
          "LARK_CLI_RESPONSE_INVALID",
          "CREATE_WORKSPACE could not resolve the single default table.",
        );
      defaultTableId = tables[0].tableId;
    }
    return { workspaceId: baseToken, appToken: baseToken, defaultTableId };
  }

  async getWorkspaceInfo(): Promise<{ appToken: string; name: string; revision: number | null }> {
    const data = object(
      await this.#run("GET_WORKSPACE", [
        "+base-get",
        "--base-token",
        this.#token(),
        ...this.#common(),
      ]),
      "GET_WORKSPACE",
    );
    const base = firstObject(data, ["base", "app"]);
    return {
      appToken: textValue(
        base.base_token ?? base.app_token ?? this.#token(),
        "base_token",
        "GET_WORKSPACE",
      ),
      name: textValue(base.name, "name", "GET_WORKSPACE"),
      revision: typeof base.revision === "number" ? base.revision : null,
    };
  }

  async listTables(): Promise<Array<{ tableId: string; name: string; revision: number | null }>> {
    const data = await this.#run("LIST_TABLES", [
      "+table-list",
      "--base-token",
      this.#token(),
      "--limit",
      "100",
      ...this.#common(),
    ]);
    return listFrom(data).map((table) => ({
      tableId: textValue(table.table_id ?? table.id, "table_id", "LIST_TABLES"),
      name: textValue(table.name, "name", "LIST_TABLES"),
      revision:
        typeof table.revision === "number"
          ? table.revision
          : typeof table.rev === "number"
            ? table.rev
            : null,
    }));
  }

  async getPrimaryFieldId(tableId: string): Promise<string | null> {
    const data = object(
      await this.#run("GET_TABLE", [
        "+table-get",
        "--base-token",
        this.#token(),
        "--table-id",
        tableId,
        ...this.#common(),
      ]),
      "GET_TABLE",
    );
    const table = firstObject(data, ["table"]);
    const primary = table.primary_field ?? table.primary_field_id;
    return typeof primary === "string" && primary ? primary : null;
  }

  async adoptDefaultTable(tableId: string, name: string): Promise<void> {
    await this.#run("ADOPT_DEFAULT_TABLE", [
      "+table-update",
      "--base-token",
      this.#token(),
      "--table-id",
      tableId,
      "--name",
      name,
      ...this.#common(),
    ]);
    const found = (await this.listTables()).find((table) => table.tableId === tableId);
    if (!found || found.name !== name)
      throw new LarkCliError(
        "LARK_CLI_READ_AFTER_WRITE_FAILED",
        "Default table rename was not verified.",
      );
  }

  async createTable(name: string, primaryField: FeishuFieldRequest): Promise<FeishuCreatedTable> {
    const data = object(
      await this.#run("CREATE_TABLE", [
        "+table-create",
        "--base-token",
        this.#token(),
        "--name",
        name,
        "--fields",
        JSON.stringify([compileLarkFieldJson(primaryField)]),
        ...this.#common(),
      ]),
      "CREATE_TABLE",
    );
    const table = firstObject(data, ["table"]);
    return {
      tableId: textValue(table.table_id ?? table.id ?? data.table_id, "table_id", "CREATE_TABLE"),
      defaultViewId: typeof table.default_view_id === "string" ? table.default_view_id : null,
      fieldIds: Array.isArray(table.field_ids)
        ? table.field_ids.filter((item): item is string => typeof item === "string")
        : [],
    };
  }

  async listFields(tableId: string): Promise<FeishuRemoteField[]> {
    const data = await this.#run("LIST_FIELDS", [
      "+field-list",
      "--base-token",
      this.#token(),
      "--table-id",
      tableId,
      "--limit",
      "100",
      ...this.#common(),
    ]);
    return listFrom(data).map((field) => {
      const typeName = typeof field.type === "string" ? field.type : "";
      const multiple = field.multiple === true;
      return {
        fieldId: textValue(field.field_id ?? field.id, "field_id", "LIST_FIELDS"),
        fieldName: textValue(field.name ?? field.field_name, "name", "LIST_FIELDS"),
        type:
          typeName === "select" && multiple
            ? 4
            : typeName === "link" && field.bidirectional === true
              ? 21
              : (NUMERIC_TYPE[typeName] ?? (typeof field.type === "number" ? field.type : -1)),
        property: field,
      };
    });
  }

  async createField(tableId: string, request: FeishuFieldRequest): Promise<FeishuRemoteField> {
    const data = object(
      await this.#run("CREATE_FIELD", [
        "+field-create",
        "--base-token",
        this.#token(),
        "--table-id",
        tableId,
        "--json",
        JSON.stringify(compileLarkFieldJson(request)),
        "--as",
        this.#identity,
      ]),
      "CREATE_FIELD",
    );
    const field = firstObject(data, ["field"]);
    return {
      fieldId: textValue(field.field_id ?? field.id ?? data.field_id, "field_id", "CREATE_FIELD"),
      fieldName: textValue(
        field.name ?? field.field_name ?? request.field_name,
        "name",
        "CREATE_FIELD",
      ),
      type: request.type,
      property: field,
    };
  }

  async deleteField(tableId: string, fieldId: string): Promise<void> {
    await this.#run(
      "DELETE_FIELD",
      [
        "+field-delete",
        "--base-token",
        this.#token(),
        "--table-id",
        tableId,
        "--field-id",
        fieldId,
        "--as",
        this.#identity,
        "--format",
        "json",
        "--yes",
      ],
      true,
    );
    if ((await this.listFields(tableId)).some((field) => field.fieldId === fieldId))
      throw new LarkCliError(
        "LARK_CLI_READ_AFTER_WRITE_FAILED",
        "Default field deletion was not verified.",
      );
  }

  async updateField(
    tableId: string,
    fieldId: string,
    request: FeishuFieldRequest,
  ): Promise<FeishuRemoteField> {
    await this.#run("GET_FIELD_BEFORE_UPDATE", [
      "+field-get",
      "--base-token",
      this.#token(),
      "--table-id",
      tableId,
      "--field-id",
      fieldId,
      ...this.#common(),
    ]);
    await this.#run(
      "UPDATE_PRIMARY_FIELD",
      [
        "+field-update",
        "--base-token",
        this.#token(),
        "--table-id",
        tableId,
        "--field-id",
        fieldId,
        "--json",
        JSON.stringify(compileLarkFieldJson(request)),
        "--as",
        this.#identity,
        "--yes",
      ],
      true,
    );
    const verified = (await this.listFields(tableId)).find((entry) => entry.fieldId === fieldId);
    if (!verified || verified.fieldName !== request.field_name)
      throw new LarkCliError(
        "LARK_CLI_READ_AFTER_WRITE_FAILED",
        "Primary field update was not verified.",
      );
    return verified;
  }

  async listViews(
    tableId: string,
  ): Promise<Array<{ viewId: string; viewName: string; viewType: string }>> {
    const data = await this.#run("LIST_VIEWS", [
      "+view-list",
      "--base-token",
      this.#token(),
      "--table-id",
      tableId,
      ...this.#common(),
    ]);
    return listFrom(data).map((view) => ({
      viewId: textValue(view.view_id ?? view.id, "view_id", "LIST_VIEWS"),
      viewName: textValue(view.name ?? view.view_name, "name", "LIST_VIEWS"),
      viewType:
        typeof view.type === "string"
          ? view.type
          : typeof view.view_type === "string"
            ? view.view_type
            : "grid",
    }));
  }

  async createView(
    tableId: string,
    name: string,
  ): Promise<{ viewId: string; viewName: string; configuration: "NAME_ONLY" }> {
    const data = object(
      await this.#run("CREATE_VIEW", [
        "+view-create",
        "--base-token",
        this.#token(),
        "--table-id",
        tableId,
        "--json",
        JSON.stringify({ name, type: "grid" }),
        "--as",
        this.#identity,
      ]),
      "CREATE_VIEW",
    );
    const returned = listFrom(data).find((entry) => (entry.name ?? entry.view_name) === name);
    const view = returned ?? firstObject(data, ["view"]);
    let viewId =
      typeof view.view_id === "string"
        ? view.view_id
        : typeof view.id === "string"
          ? view.id
          : typeof data.view_id === "string"
            ? data.view_id
            : null;
    if (!viewId) {
      let resolved: { viewId: string; viewName: string; viewType: string } | null = null;
      for (let attempt = 0; attempt < 4; attempt += 1) {
        const matches = (await this.listViews(tableId)).filter((entry) => entry.viewName === name);
        if (matches.length === 1 && matches[0]) {
          resolved = matches[0];
          break;
        }
        if (attempt < 3) await shortDelay(250 * (attempt + 1));
      }
      if (!resolved)
        throw new LarkCliError(
          "LARK_CLI_RESPONSE_INVALID",
          "CREATE_VIEW could not resolve a unique created view.",
        );
      viewId = resolved.viewId;
    }
    return {
      viewId,
      viewName: textValue(view.name ?? view.view_name ?? name, "name", "CREATE_VIEW"),
      configuration: "NAME_ONLY",
    };
  }

  async searchRecords(
    tableId: string,
    tableLogicalKey: string,
    filter: Record<string, unknown>,
  ): Promise<FeishuStoredRecord[]> {
    const data = await this.#run("SEARCH_RECORDS", [
      "+record-search",
      "--base-token",
      this.#token(),
      "--table-id",
      tableId,
      "--json",
      JSON.stringify(compileLarkRecordSearchBody(filter)),
      ...this.#common(),
    ]);
    return recordsFrom(data).map((record) =>
      this.#stored(record, tableId, tableLogicalKey, "REMOTE", 1),
    );
  }

  async findRecordByUniqueKey(
    uniqueKey: string,
    input: Pick<FeishuRecordInput, "tableId" | "tableLogicalKey" | "uniqueFieldLogicalKey">,
  ): Promise<FeishuStoredRecord | null> {
    const mapping = this.#fieldMap.find(
      (entry) =>
        entry.logicalKey === input.uniqueFieldLogicalKey &&
        entry.tableLogicalKey === input.tableLogicalKey,
    );
    if (!mapping)
      throw new LarkCliError(
        "LARK_CLI_FIELD_MAPPING_MISSING",
        "Unique-field mapping is unavailable.",
      );
    const records = await this.searchRecords(input.tableId, input.tableLogicalKey, {
      conjunction: "and",
      conditions: [{ field_name: mapping.currentFieldName, operator: "is", value: [uniqueKey] }],
    });
    if (records.length > 1)
      throw new LarkCliError("LARK_CLI_RECORD_CONFLICT", "Unique key matched multiple records.");
    return records[0] ? { ...records[0], uniqueKey } : null;
  }

  async createRecord(record: FeishuRecordInput): Promise<FeishuStoredRecord> {
    if (await this.findRecordByUniqueKey(record.uniqueKey, record))
      throw new LarkCliError("LARK_CLI_RECORD_CONFLICT", "Record already exists.");
    const fields = this.#compileFields(record);
    const data = object(
      await this.#run("CREATE_RECORD", [
        "+record-upsert",
        "--base-token",
        this.#token(),
        "--table-id",
        record.tableId,
        "--json",
        JSON.stringify(fields),
        ...this.#common(),
      ]),
      "CREATE_RECORD",
    );
    let stored: FeishuStoredRecord | null = null;
    try {
      stored = this.#stored(
        firstRecordFrom(data, "CREATE_RECORD"),
        record.tableId,
        record.tableLogicalKey,
        record.uniqueKey,
        record.version,
      );
    } catch (error) {
      if (!(error instanceof LarkCliError) || error.code !== "LARK_CLI_RESPONSE_INVALID")
        throw error;
    }
    for (let attempt = 0; !stored && attempt < 4; attempt += 1) {
      const found = await this.findRecordByUniqueKey(record.uniqueKey, record);
      if (found) stored = found;
      else if (attempt < 3) await shortDelay(250 * (attempt + 1));
    }
    if (!stored)
      throw new LarkCliError(
        "LARK_CLI_READ_AFTER_WRITE_FAILED",
        "Record create could not be resolved by its unique key.",
      );
    if (!(await this.verifyWrite(stored, record.fields)))
      throw new LarkCliError(
        "LARK_CLI_READ_AFTER_WRITE_FAILED",
        "Record create verification failed.",
      );
    return stored;
  }

  async updateRecord(
    record: FeishuRecordInput & { recordId: string },
  ): Promise<FeishuStoredRecord> {
    const fields = this.#compileFields(record);
    await this.#run("UPDATE_RECORD", [
      "+record-upsert",
      "--base-token",
      this.#token(),
      "--table-id",
      record.tableId,
      "--record-id",
      record.recordId,
      "--json",
      JSON.stringify(fields),
      ...this.#common(),
    ]);
    let read: FeishuStoredRecord | null = null;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      read = await this.readRecord(
        record.recordId,
        record.tableId,
        record.tableLogicalKey,
        record.uniqueKey,
      );
      if (read) {
        const stored = { ...read, version: record.version + 1 };
        if (await this.verifyWrite(stored, record.fields)) return stored;
      }
      if (attempt < 3) await shortDelay(250 * (attempt + 1));
    }
    throw new LarkCliError(
      "LARK_CLI_READ_AFTER_WRITE_FAILED",
      read
        ? "Record update verification failed after bounded retries."
        : "Record update could not be read by its known ID after bounded retries.",
    );
  }

  async batchUpsertRecords(
    records: FeishuRecordInput[],
    idempotencyKey: string,
  ): Promise<FeishuBatchUpsertResult> {
    void idempotencyKey;
    const result: FeishuBatchUpsertResult = { succeeded: [], failed: [] };
    for (let offset = 0; offset < records.length; offset += this.#batchSize) {
      for (const record of records.slice(offset, offset + this.#batchSize)) {
        try {
          const existing = await this.findRecordByUniqueKey(record.uniqueKey, record);
          result.succeeded.push(
            existing
              ? await this.updateRecord({
                  ...record,
                  recordId: existing.recordId,
                  version: existing.version,
                })
              : await this.createRecord(record),
          );
        } catch (error) {
          result.failed.push({
            uniqueKey: record.uniqueKey,
            code: error instanceof LarkCliError ? error.code : "LARK_CLI_ERROR",
            message: (error as Error).message,
          });
        }
      }
    }
    return result;
  }

  async readRecord(
    recordId: string,
    tableId: string,
    tableLogicalKey: string,
    uniqueKey: string,
  ): Promise<FeishuStoredRecord | null> {
    const data = object(
      await this.#run("READ_RECORD", [
        "+record-get",
        "--base-token",
        this.#token(),
        "--table-id",
        tableId,
        "--record-id",
        recordId,
        ...this.#common(),
      ]),
      "READ_RECORD",
    );
    return this.#stored(
      firstRecordFrom(data, "READ_RECORD"),
      tableId,
      tableLogicalKey,
      uniqueKey,
      1,
    );
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
      this.#mapFor(record.tableLogicalKey),
      this.#mappingVersion,
      { allowUserManaged: true },
    );
    const mappingByName = new Map(
      this.#mapFor(record.tableLogicalKey).map((entry) => [entry.currentFieldName, entry]),
    );
    return Object.entries(expected).every(([key, value]) => {
      const mapping = mappingByName.get(key);
      const actual = read.fields[key];
      return larkRecordValuesEquivalent(mapping?.fieldType, actual, value);
    });
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

  async verifyWorkspace(blueprint: FeishuBlueprint) {
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
    ].some((entry) => entry.operation !== "SKIP_VERIFIED" && entry.operation !== "UPDATE_MAPPING");
    return { verified: !pending && plan.conflicts.length === 0, plan };
  }

  uploadAttachment(): Promise<never> {
    return Promise.reject(
      new LarkCliError(
        "LARK_CLI_ATTACHMENT_UPLOAD_DEFERRED",
        "Attachment upload is DEFERRED_TO_FUTURE_PHASE.",
      ),
    );
  }

  #mapFor(tableLogicalKey: string): FeishuFieldMapEntry[] {
    return this.#fieldMap.filter((entry) => entry.tableLogicalKey === tableLogicalKey);
  }
  #compileFields(record: FeishuRecordInput): Record<string, unknown> {
    return this.#recordCompiler.compile(
      record.fields,
      this.#mapFor(record.tableLogicalKey),
      this.#mappingVersion,
      {
        ...(record.approvedLogicalKeys ? { approvedLogicalKeys: record.approvedLogicalKeys } : {}),
        ...(record.allowUserManaged ? { allowUserManaged: true } : {}),
      },
    );
  }
  #stored(
    remote: Record<string, unknown>,
    tableId: string,
    tableLogicalKey: string,
    uniqueKey: string,
    version: number,
  ): FeishuStoredRecord {
    return {
      recordId: textValue(remote.record_id ?? remote.id, "record_id", "RECORD"),
      tableId,
      tableLogicalKey,
      uniqueKey,
      version,
      fields:
        remote.fields && typeof remote.fields === "object" && !Array.isArray(remote.fields)
          ? (remote.fields as Record<string, unknown>)
          : {},
    };
  }
}
