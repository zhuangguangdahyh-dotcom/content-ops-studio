export interface WorkspaceRecord {
  uniqueKey: string;
  version: number;
  fields: Record<string, unknown>;
}

export interface WorkspaceAdapter {
  probeConnection(): Promise<{ ready: boolean; implementation: string }>;
  createWorkspace(name: string): Promise<{ workspaceId: string }>;
  findRecordByUniqueKey(uniqueKey: string): Promise<WorkspaceRecord | null>;
  createRecord(record: WorkspaceRecord): Promise<WorkspaceRecord>;
  updateRecord(
    uniqueKey: string,
    expectedVersion: number,
    fields: Record<string, unknown>,
  ): Promise<WorkspaceRecord>;
  readRecord(uniqueKey: string): Promise<WorkspaceRecord | null>;
  verifyWrite(uniqueKey: string, expectedFields: Record<string, unknown>): Promise<boolean>;
}

export class LocalMockWorkspaceAdapter implements WorkspaceAdapter {
  readonly #records = new Map<string, WorkspaceRecord>();

  async probeConnection(): Promise<{ ready: boolean; implementation: string }> {
    return Promise.resolve({ ready: true, implementation: "local-mock" });
  }

  async createWorkspace(name: string): Promise<{ workspaceId: string }> {
    return Promise.resolve({ workspaceId: `mock:${name}` });
  }

  async findRecordByUniqueKey(uniqueKey: string): Promise<WorkspaceRecord | null> {
    return Promise.resolve(this.#records.get(uniqueKey) ?? null);
  }

  async createRecord(record: WorkspaceRecord): Promise<WorkspaceRecord> {
    if (this.#records.has(record.uniqueKey))
      throw new Error("CONFLICT_DETECTED: duplicate unique key.");
    const stored = structuredClone(record);
    this.#records.set(stored.uniqueKey, stored);
    return Promise.resolve(structuredClone(stored));
  }

  async updateRecord(
    uniqueKey: string,
    expectedVersion: number,
    fields: Record<string, unknown>,
  ): Promise<WorkspaceRecord> {
    const current = this.#records.get(uniqueKey);
    if (!current) throw new Error("WORKSPACE_NOT_READY: record not found.");
    if (current.version !== expectedVersion)
      throw new Error("CONFLICT_DETECTED: record version changed.");
    const updated = {
      uniqueKey,
      version: current.version + 1,
      fields: { ...current.fields, ...structuredClone(fields) },
    };
    this.#records.set(uniqueKey, updated);
    return Promise.resolve(structuredClone(updated));
  }

  async readRecord(uniqueKey: string): Promise<WorkspaceRecord | null> {
    const record = this.#records.get(uniqueKey);
    return Promise.resolve(record ? structuredClone(record) : null);
  }

  async verifyWrite(uniqueKey: string, expectedFields: Record<string, unknown>): Promise<boolean> {
    const record = this.#records.get(uniqueKey);
    if (!record) return Promise.resolve(false);
    return Promise.resolve(
      Object.entries(expectedFields).every(([key, value]) => Object.is(record.fields[key], value)),
    );
  }
}

export interface AssetStoreAdapter {
  writeArtifact(
    relativePath: string,
    contents: Uint8Array,
  ): Promise<{ relativePath: string; hash: string }>;
}

export interface CredentialProvider {
  getCredential(name: string): Promise<string | null>;
}

export * from "./feishu/adapter.js";
export * from "./feishu/errors.js";
export * from "./feishu/live-gates.js";
export * from "./feishu/credentials/index.js";
export * from "./feishu/token/index.js";
export * from "./feishu/transport/index.js";
export * from "./feishu/blueprint/index.js";
export * from "./feishu/provisioning/index.js";
export * from "./lark-cli/index.js";
