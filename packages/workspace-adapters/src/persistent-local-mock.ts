import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { WorkspaceBlueprintDefinition } from "../../contracts/src/workspace-blueprint.js";
import type { WorkspaceRecord } from "./index.js";

export interface MockTable {
  tableId: string;
  logicalKey: string;
  primaryFieldLogicalKey: string;
}

export interface MockField {
  fieldId: string;
  tableLogicalKey: string;
  logicalKey: string;
  displayName: string;
  fieldType: string;
}

export interface MockView {
  viewId: string;
  tableLogicalKey: string;
  name: string;
}

export interface PersistentRecord extends WorkspaceRecord {
  tableLogicalKey: string;
  recordId: string;
}

export interface BatchUpsertResult {
  succeeded: PersistentRecord[];
  failed: Array<{ uniqueKey: string; code: string; message: string }>;
}

interface MockState {
  formatVersion: "1.0.0";
  workspaceId: string | null;
  workspaceName: string | null;
  tables: MockTable[];
  fields: MockField[];
  views: MockView[];
  records: PersistentRecord[];
  idempotency: Record<string, unknown>;
}

export interface PersistentLocalMockOptions {
  stateFile: string;
  blueprint: WorkspaceBlueprintDefinition;
  failureInjector?: (operation: string, itemIndex: number | null) => boolean;
}

const EMPTY: MockState = {
  formatVersion: "1.0.0",
  workspaceId: null,
  workspaceName: null,
  tables: [],
  fields: [],
  views: [],
  records: [],
  idempotency: {},
};

function hash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function mockId(kind: string, value: unknown): string {
  return `MOCK-${kind}-${hash([kind, value]).slice(0, 16).toUpperCase()}`;
}

function same(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

/** A file-backed, deterministic test double. It never represents a Feishu write. */
export class PersistentLocalMockWorkspaceAdapter {
  constructor(private readonly options: PersistentLocalMockOptions) {}

  async #load(): Promise<MockState> {
    try {
      const state = JSON.parse(await readFile(this.options.stateFile, "utf8")) as MockState;
      if (state.formatVersion !== "1.0.0") throw new Error("MOCK_WORKSPACE_CORRUPT");
      return state;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return structuredClone(EMPTY);
      throw error;
    }
  }

  async #save(state: MockState): Promise<void> {
    await mkdir(path.dirname(this.options.stateFile), { recursive: true });
    const temporary = `${this.options.stateFile}.tmp`;
    await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
    await rename(temporary, this.options.stateFile);
  }

  async #write<T>(
    operation: string,
    idempotencyKey: string,
    change: (state: MockState) => T,
    itemIndex: number | null = null,
  ): Promise<T> {
    if (!idempotencyKey) throw new Error("MOCK_IDEMPOTENCY_KEY_REQUIRED");
    if (this.options.failureInjector?.(operation, itemIndex))
      throw new Error(`MOCK_PARTIAL_FAILURE:${operation}:${itemIndex ?? "single"}`);
    const state = await this.#load();
    if (Object.hasOwn(state.idempotency, idempotencyKey))
      return structuredClone(state.idempotency[idempotencyKey] as T);
    const result = change(state);
    state.idempotency[idempotencyKey] = structuredClone(result);
    await this.#save(state);
    return structuredClone(result);
  }

  probeConnection(): Promise<{
    ready: true;
    implementation: "persistent-local-mock";
    capability: "MOCK_ONLY";
  }> {
    return Promise.resolve({
      ready: true,
      implementation: "persistent-local-mock",
      capability: "MOCK_ONLY",
    });
  }

  async createWorkspace(name: string, idempotencyKey: string): Promise<{ workspaceId: string }> {
    const created = await this.#write("createWorkspace", idempotencyKey, (state) => {
      const workspaceId = mockId("WS", name);
      if (state.workspaceId && state.workspaceId !== workspaceId)
        throw new Error("CONFLICT_DETECTED:workspace");
      state.workspaceId = workspaceId;
      state.workspaceName = name;
      return { workspaceId };
    });
    for (const table of this.options.blueprint.tables) {
      await this.createTable(
        table.logicalKey,
        table.primaryFieldLogicalKey,
        `BLUEPRINT:${this.options.blueprint.blueprint_version}:TABLE:${table.logicalKey}`,
      );
      for (const field of table.fields)
        await this.createField(
          table.logicalKey,
          {
            logicalKey: field.logicalKey,
            displayName: field.displayName,
            fieldType: field.fieldType,
          },
          `BLUEPRINT:${this.options.blueprint.blueprint_version}:FIELD:${field.logicalKey}`,
        );
    }
    return created;
  }

  async listTables(): Promise<MockTable[]> {
    return structuredClone((await this.#load()).tables);
  }

  async createTable(
    logicalKey: string,
    primaryFieldLogicalKey: string,
    idempotencyKey: string,
  ): Promise<MockTable> {
    const result = await this.#write("createTable", idempotencyKey, (state) => {
      const existing = state.tables.find((table) => table.logicalKey === logicalKey);
      if (existing) {
        if (existing.primaryFieldLogicalKey !== primaryFieldLogicalKey)
          throw new Error("CONFLICT_DETECTED:table");
        return existing;
      }
      const table = { tableId: mockId("TBL", logicalKey), logicalKey, primaryFieldLogicalKey };
      state.tables.push(table);
      return table;
    });
    if (!(await this.listTables()).some((table) => same(table, result)))
      throw new Error("MOCK_VERIFY_FAILED:table");
    return result;
  }

  async listFields(tableLogicalKey: string): Promise<MockField[]> {
    return structuredClone(
      (await this.#load()).fields.filter((field) => field.tableLogicalKey === tableLogicalKey),
    );
  }

  async createField(
    tableLogicalKey: string,
    field: Omit<MockField, "fieldId" | "tableLogicalKey">,
    idempotencyKey: string,
  ): Promise<MockField> {
    const result = await this.#write("createField", idempotencyKey, (state) => {
      if (!state.tables.some((table) => table.logicalKey === tableLogicalKey))
        throw new Error("WORKSPACE_NOT_READY:table");
      const existing = state.fields.find((item) => item.logicalKey === field.logicalKey);
      if (existing) {
        if (existing.tableLogicalKey !== tableLogicalKey || existing.fieldType !== field.fieldType)
          throw new Error("CONFLICT_DETECTED:field");
        return existing;
      }
      const created = {
        fieldId: mockId("FLD", [tableLogicalKey, field.logicalKey]),
        tableLogicalKey,
        ...field,
      };
      state.fields.push(created);
      return created;
    });
    if (!(await this.listFields(tableLogicalKey)).some((fieldItem) => same(fieldItem, result)))
      throw new Error("MOCK_VERIFY_FAILED:field");
    return result;
  }

  async createView(
    tableLogicalKey: string,
    name: string,
    idempotencyKey: string,
  ): Promise<MockView> {
    const result = await this.#write("createView", idempotencyKey, (state) => {
      if (!state.tables.some((table) => table.logicalKey === tableLogicalKey))
        throw new Error("WORKSPACE_NOT_READY:table");
      const existing = state.views.find(
        (view) => view.tableLogicalKey === tableLogicalKey && view.name === name,
      );
      if (existing) return existing;
      const view = { viewId: mockId("VIEW", [tableLogicalKey, name]), tableLogicalKey, name };
      state.views.push(view);
      return view;
    });
    if (!(await this.#load()).views.some((view) => same(view, result)))
      throw new Error("MOCK_VERIFY_FAILED:view");
    return result;
  }

  async findRecordByUniqueKey(
    uniqueKey: string,
    tableLogicalKey?: string,
  ): Promise<PersistentRecord | null> {
    const record = (await this.#load()).records.find(
      (item) =>
        item.uniqueKey === uniqueKey &&
        (tableLogicalKey === undefined || item.tableLogicalKey === tableLogicalKey),
    );
    return record ? structuredClone(record) : null;
  }

  async createRecord(
    record: WorkspaceRecord & { tableLogicalKey?: string },
    idempotencyKey: string,
  ): Promise<PersistentRecord> {
    const normalized: PersistentRecord = {
      uniqueKey: record.uniqueKey,
      version: record.version,
      fields: structuredClone(record.fields),
      tableLogicalKey: record.tableLogicalKey ?? "projectConfig",
      recordId: mockId("REC", [record.tableLogicalKey ?? "projectConfig", record.uniqueKey]),
    };
    const result = await this.#write("createRecord", idempotencyKey, (state) => {
      if (state.records.some((item) => item.uniqueKey === normalized.uniqueKey))
        throw new Error("CONFLICT_DETECTED:record");
      state.records.push(normalized);
      return normalized;
    });
    if (!(await this.verifyWrite(result.uniqueKey, result.fields)))
      throw new Error("MOCK_VERIFY_FAILED:record");
    return result;
  }

  async updateRecord(
    uniqueKey: string,
    expectedVersion: number,
    fields: Record<string, unknown>,
    idempotencyKey: string,
  ): Promise<PersistentRecord> {
    const result = await this.#write("updateRecord", idempotencyKey, (state) => {
      const index = state.records.findIndex((record) => record.uniqueKey === uniqueKey);
      const current = state.records[index];
      if (!current) throw new Error("WORKSPACE_NOT_READY:record");
      if (current.version !== expectedVersion) throw new Error("CONFLICT_DETECTED:version");
      const updated = {
        ...current,
        version: current.version + 1,
        fields: { ...current.fields, ...structuredClone(fields) },
      };
      state.records[index] = updated;
      return updated;
    });
    if (!(await this.verifyWrite(uniqueKey, fields))) throw new Error("MOCK_VERIFY_FAILED:update");
    return result;
  }

  async batchUpsertRecords(
    records: Array<WorkspaceRecord & { tableLogicalKey?: string }>,
    idempotencyKey: string,
  ): Promise<BatchUpsertResult> {
    const succeeded: PersistentRecord[] = [];
    const failed: BatchUpsertResult["failed"] = [];
    for (const [index, record] of records.entries()) {
      try {
        if (this.options.failureInjector?.("batchUpsertRecords", index))
          throw new Error(`MOCK_PARTIAL_FAILURE:batchUpsertRecords:${index}`);
        const existing = await this.findRecordByUniqueKey(record.uniqueKey, record.tableLogicalKey);
        const itemKey = `${idempotencyKey}:${record.uniqueKey}`;
        succeeded.push(
          existing
            ? await this.updateRecord(record.uniqueKey, existing.version, record.fields, itemKey)
            : await this.createRecord(record, itemKey),
        );
      } catch (error) {
        const message = (error as Error).message;
        failed.push({
          uniqueKey: record.uniqueKey,
          code: message.split(":")[0] ?? "FAILED",
          message,
        });
      }
    }
    return { succeeded, failed };
  }

  async readRecord(uniqueKey: string, tableLogicalKey?: string): Promise<PersistentRecord | null> {
    return this.findRecordByUniqueKey(uniqueKey, tableLogicalKey);
  }

  async searchRecords(query: {
    tableLogicalKey?: string;
    fields?: Record<string, unknown>;
  }): Promise<PersistentRecord[]> {
    return structuredClone(
      (await this.#load()).records.filter((record) => {
        if (query.tableLogicalKey && record.tableLogicalKey !== query.tableLogicalKey) return false;
        return Object.entries(query.fields ?? {}).every(([key, value]) =>
          same(record.fields[key], value),
        );
      }),
    );
  }

  async verifyWrite(uniqueKey: string, expectedFields: Record<string, unknown>): Promise<boolean> {
    const record = await this.readRecord(uniqueKey);
    return Boolean(
      record &&
      Object.entries(expectedFields).every(([key, value]) => same(record.fields[key], value)),
    );
  }
}
