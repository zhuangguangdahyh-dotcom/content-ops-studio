import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadSchemaRegistry } from "../../packages/contracts/src/validation/index.js";
import {
  FeishuBlueprintCompiler,
  feishuError,
  FeishuProjectProvisioner,
  FeishuRecoveryCoordinator,
  applySafeFeishuRepairs,
  planSafeFeishuRepairs,
  type FeishuBlueprint,
  type FeishuFieldMapEntry,
  type FeishuFieldRequest,
  type FeishuProvisioningAdapter,
  type FeishuProvisioningState,
  type FeishuProvisioningStateStore,
  type FeishuRemoteField,
  type FeishuStoredRecord,
  FileFeishuProvisioningStateStore,
} from "../../packages/workspace-adapters/src/index.js";

async function blueprint(): Promise<FeishuBlueprint> {
  return JSON.parse(
    await readFile(
      path.resolve("plugins/content-ops-studio/templates/feishu/workspace-v1.json"),
      "utf8",
    ),
  ) as FeishuBlueprint;
}
class MemoryStateStore implements FeishuProvisioningStateStore {
  value: FeishuProvisioningState | null = null;
  load() {
    return Promise.resolve(this.value ? structuredClone(this.value) : null);
  }
  save(state: FeishuProvisioningState) {
    this.value = structuredClone(state);
    return Promise.resolve();
  }
}
class MemoryProvisioningAdapter implements FeishuProvisioningAdapter {
  createWorkspaceCount = 0;
  createWorkspaceFailure: Error | null = null;
  appToken = "app-fixture";
  title = "";
  tables: Array<{ tableId: string; name: string; revision: number | null }> = [];
  fields = new Map<string, FeishuRemoteField[]>();
  views = new Map<string, Array<{ viewId: string; viewName: string; viewType: string }>>();
  records = new Map<string, FeishuStoredRecord>();
  fieldMap: FeishuFieldMapEntry[] = [];
  failAfterFields: number | null = null;
  createdFields = 0;
  platformDefaultExtras = false;
  createWorkspace(name: string) {
    this.createWorkspaceCount += 1;
    if (this.createWorkspaceFailure) return Promise.reject(this.createWorkspaceFailure);
    this.title = name;
    this.tables = [{ tableId: "table-default", name: "多维表格", revision: 1 }];
    this.fields.set("table-default", [
      { fieldId: "field-default", fieldName: "文本", type: 1 },
      ...(this.platformDefaultExtras
        ? [
            { fieldId: "field-default-select", fieldName: "单选", type: 3 },
            { fieldId: "field-default-date", fieldName: "日期", type: 5 },
            { fieldId: "field-default-attachment", fieldName: "附件", type: 17 },
          ]
        : []),
    ]);
    this.views.set("table-default", [
      { viewId: "view-default", viewName: "表格", viewType: "grid" },
    ]);
    return Promise.resolve({
      workspaceId: this.appToken,
      appToken: this.appToken,
      defaultTableId: "table-default",
    });
  }
  setWorkspace(appToken: string) {
    this.appToken = appToken;
  }
  getWorkspaceInfo() {
    return Promise.resolve({ appToken: this.appToken, name: this.title, revision: 1 });
  }
  listTables() {
    return Promise.resolve(structuredClone(this.tables));
  }
  getPrimaryFieldId(tableId: string) {
    return Promise.resolve(this.fields.get(tableId)?.[0]?.fieldId ?? null);
  }
  adoptDefaultTable(tableId: string, name: string) {
    const table = this.tables.find((item) => item.tableId === tableId);
    if (!table) return Promise.reject(new Error("Fixture table is missing."));
    table.name = name;
    return Promise.resolve();
  }
  createTable(name: string, primary: FeishuFieldRequest) {
    const tableId = `table-${this.tables.length + 1}`;
    const fieldId = `field-${tableId}-primary`;
    this.tables.push({ tableId, name, revision: 1 });
    this.fields.set(tableId, [{ fieldId, fieldName: primary.field_name, type: primary.type }]);
    this.views.set(tableId, [
      { viewId: `view-${tableId}-default`, viewName: "默认视图", viewType: "grid" },
    ]);
    return Promise.resolve({
      tableId,
      defaultViewId: `view-${tableId}-default`,
      fieldIds: [fieldId],
    });
  }
  listFields(tableId: string) {
    return Promise.resolve(structuredClone(this.fields.get(tableId) ?? []));
  }
  createField(tableId: string, request: FeishuFieldRequest) {
    this.createdFields += 1;
    if (this.failAfterFields !== null && this.createdFields > this.failAfterFields)
      return Promise.reject(new Error("INJECTED_FIELD_FAILURE"));
    const field = {
      fieldId: `field-${tableId}-${request.logicalKey}`,
      fieldName: request.field_name,
      type: request.type,
      ...(request.property ? { property: request.property } : {}),
    };
    const fields = this.fields.get(tableId);
    if (!fields) return Promise.reject(new Error("Fixture field collection is missing."));
    fields.push(field);
    return Promise.resolve(structuredClone(field));
  }
  deleteField(tableId: string, fieldId: string) {
    const fields = this.fields.get(tableId);
    if (!fields) return Promise.reject(new Error("Fixture field collection is missing."));
    const index = fields.findIndex((field) => field.fieldId === fieldId);
    if (index < 0) return Promise.reject(new Error("Fixture field is missing."));
    fields.splice(index, 1);
    return Promise.resolve();
  }
  updateField(tableId: string, fieldId: string, request: FeishuFieldRequest) {
    const field = this.fields.get(tableId)?.find((item) => item.fieldId === fieldId);
    if (!field) return Promise.reject(new Error("Fixture field is missing."));
    field.fieldName = request.field_name;
    field.type = request.type;
    return Promise.resolve(structuredClone(field));
  }
  listViews(tableId: string) {
    return Promise.resolve(structuredClone(this.views.get(tableId) ?? []));
  }
  createView(tableId: string, name: string) {
    const view = { viewId: `view-${tableId}-${name}`, viewName: name, viewType: "grid" };
    const views = this.views.get(tableId);
    if (!views) return Promise.reject(new Error("Fixture view collection is missing."));
    views.push(view);
    return Promise.resolve({
      viewId: view.viewId,
      viewName: name,
      configuration: "NAME_ONLY" as const,
    });
  }
  setFieldMap(entries: FeishuFieldMapEntry[]) {
    this.fieldMap = structuredClone(entries);
  }
  findRecordByUniqueKey(uniqueKey: string) {
    return Promise.resolve(this.records.get(uniqueKey) ?? null);
  }
  createRecord(record: Parameters<FeishuProvisioningAdapter["createRecord"]>[0]) {
    const stored = { ...record, recordId: "record-project" };
    this.records.set(record.uniqueKey, stored);
    return Promise.resolve(stored);
  }
  updateRecord(record: Parameters<FeishuProvisioningAdapter["updateRecord"]>[0]) {
    const stored = { ...record, version: record.version + 1 };
    this.records.set(record.uniqueKey, stored);
    return Promise.resolve(stored);
  }
  verifyWorkspace(source: FeishuBlueprint) {
    const snapshot = {
      appTokenHash: null,
      name: this.title,
      tables: this.tables.map((table) => ({
        tableId: table.tableId,
        name: table.name,
        fields: this.fields.get(table.tableId) ?? [],
        views: this.views.get(table.tableId) ?? [],
      })),
    };
    const plan = new FeishuBlueprintCompiler().compile(source, snapshot, "REPAIR_ADD_ONLY");
    return Promise.resolve({
      verified:
        plan.conflicts.length === 0 &&
        [
          ...plan.tableOperations,
          ...plan.fieldOperations,
          ...plan.relationOperations,
          ...plan.viewOperations,
        ].every((operation) => operation.operation === "SKIP_VERIFIED"),
      plan,
    });
  }
}

describe("Feishu provisioning and recovery", () => {
  it("adopts the explicit primary field and removes only the three seeded platform defaults", async () => {
    const source = await blueprint();
    const adapter = new MemoryProvisioningAdapter();
    adapter.platformDefaultExtras = true;
    const store = new MemoryStateStore();
    const result = await new FeishuProjectProvisioner({
      adapter,
      stateStore: store,
      blueprint: source,
      projectId: "PRJ-PLATFORM-DEFAULTS",
      projectName: "Fictional Platform Defaults",
      runId: "RUN-PLATFORM-DEFAULTS",
      parentFolderToken: "folder-fixture",
      now: () => "2099-01-01T00:00:00.000Z",
    }).provision();
    expect(result.overallStatus).toBe("AWAITING_APPROVAL");
    expect(result.fieldMap).toHaveLength(141);
    expect([...adapter.fields.values()].flat()).toHaveLength(141);
    expect(adapter.fields.get("table-default")).toEqual(
      expect.arrayContaining([expect.objectContaining({ fieldName: "项目名称" })]),
    );
    expect(adapter.fields.get("table-default")).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fieldName: "单选" }),
        expect.objectContaining({ fieldName: "日期" }),
        expect.objectContaining({ fieldName: "附件" }),
      ]),
    );
    expect(store.value?.completedOperations).toEqual(
      expect.arrayContaining([
        "DELETE_PLATFORM_DEFAULT_FIELD:单选",
        "DELETE_PLATFORM_DEFAULT_FIELD:日期",
        "DELETE_PLATFORM_DEFAULT_FIELD:附件",
      ]),
    );
  });

  it("provisions 4/141/5/4, pauses at G1, and replays without duplicates", async () => {
    const source = await blueprint();
    const adapter = new MemoryProvisioningAdapter();
    const store = new MemoryStateStore();
    const provisioner = new FeishuProjectProvisioner({
      adapter,
      stateStore: store,
      blueprint: source,
      projectId: "PRJ-FIXTURE",
      projectName: "Fictional Project",
      runId: "RUN-FIXTURE",
      parentFolderToken: "folder-fixture",
      now: () => "2099-01-01T00:00:00.000Z",
    });
    const first = await provisioner.provision();
    expect(first.overallStatus).toBe("AWAITING_APPROVAL");
    expect(adapter.tables).toHaveLength(4);
    expect([...adapter.fields.values()].flat()).toHaveLength(141);
    expect(
      [...adapter.fields.values()].flat().filter((field) => [18, 21].includes(field.type)),
    ).toHaveLength(5);
    expect(
      [...adapter.views.values()]
        .flat()
        .filter((view) => view.viewName !== "默认视图" && view.viewName !== "表格"),
    ).toHaveLength(4);
    await provisioner.provision();
    expect(adapter.createWorkspaceCount).toBe(1);
    expect(adapter.tables).toHaveLength(4);
    expect(adapter.records).toHaveLength(1);
    await expect(provisioner.activateAfterG1(true)).resolves.toMatchObject({
      overallStatus: "SUCCESS",
      currentPhase: 13,
    });
    expect(adapter.records.get("PRJ-FIXTURE::project-config")?.fields).toMatchObject({
      projectConfigProjectStatus: "PROJECT_ACTIVE",
      projectConfigConfigConfirmationStatus: "CONFIG_CONFIRMED",
    });
    await expect(provisioner.provision()).resolves.toMatchObject({
      overallStatus: "SUCCESS",
      currentPhase: 13,
    });
    expect(adapter.createWorkspaceCount).toBe(1);
    expect(adapter.tables).toHaveLength(4);
    expect(adapter.records).toHaveLength(1);
    expect(adapter.records.get("PRJ-FIXTURE::project-config")?.fields).toMatchObject({
      projectConfigProjectStatus: "PROJECT_ACTIVE",
      projectConfigConfigConfirmationStatus: "CONFIG_CONFIRMED",
    });
  });

  it("writes schema-valid state and complete project-local connection maps", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "feishu-provisioning-artifacts-"));
    try {
      const workspaceDirectory = path.join(root, "workspace");
      const stateFile = path.join(workspaceDirectory, "provisioning-state.json");
      const provisioner = new FeishuProjectProvisioner({
        adapter: new MemoryProvisioningAdapter(),
        stateStore: new FileFeishuProvisioningStateStore(stateFile),
        blueprint: await blueprint(),
        projectId: "PRJ-ARTIFACTS",
        projectName: "Artifact Project",
        runId: "RUN-ARTIFACTS",
        parentFolderToken: "folder",
        workspaceDirectory,
        now: () => "2099-01-01T00:00:00.000Z",
      });
      await provisioner.provision();
      const serialized = JSON.parse(await readFile(stateFile, "utf8")) as Record<string, unknown>;
      (await loadSchemaRegistry()).assertValid(
        "https://content-ops-studio.local/schemas/1.0/feishu-provisioning-state.schema.json",
        serialized,
      );
      expect(serialized.remote_identifiers).toMatchObject({
        "table:projectConfig": "table-default",
        "record:projectConfig": "record-project",
      });
      for (const name of [
        "connections.json",
        "schema-state.json",
        "field-map.json",
        "view-map.json",
      ])
        await expect(readFile(path.join(workspaceDirectory, name), "utf8")).resolves.toContain(
          "2099-01-01T00:00:00.000Z",
        );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("fails closed after an unknown Base-create result instead of creating a duplicate", async () => {
    class CrashStore extends MemoryStateStore {
      saves = 0;
      override save(state: FeishuProvisioningState) {
        this.saves += 1;
        if (this.saves === 2) return Promise.reject(new Error("INJECTED_LOCAL_SAVE_CRASH"));
        return super.save(state);
      }
    }
    const adapter = new MemoryProvisioningAdapter();
    const store = new CrashStore();
    const options = {
      adapter,
      stateStore: store,
      blueprint: await blueprint(),
      projectId: "PRJ-CRASH",
      projectName: "Crash Project",
      runId: "RUN-CRASH",
      parentFolderToken: "folder",
    };
    await expect(new FeishuProjectProvisioner(options).provision()).rejects.toThrow(
      "INJECTED_LOCAL_SAVE_CRASH",
    );
    await expect(new FeishuProjectProvisioner(options).provision()).rejects.toMatchObject({
      code: "FEISHU_ORPHAN_WORKSPACE",
    });
    expect(adapter.createWorkspaceCount).toBe(1);
  });

  it("clears the create intent after a definitive remote rejection and permits a safe retry", async () => {
    const adapter = new MemoryProvisioningAdapter();
    adapter.createWorkspaceFailure = feishuError(
      "FEISHU_PERMISSION_DENIED",
      "DriveNodePermNotAllow",
      { scope: "base.create" },
    );
    const store = new MemoryStateStore();
    const options = {
      adapter,
      stateStore: store,
      blueprint: await blueprint(),
      projectId: "PRJ-DEFINITIVE-REJECTION",
      projectName: "Definitive Rejection Project",
      runId: "RUN-DEFINITIVE-REJECTION",
      parentFolderToken: "folder",
    };

    await expect(new FeishuProjectProvisioner(options).provision()).rejects.toMatchObject({
      code: "FEISHU_PERMISSION_DENIED",
    });
    expect(store.value).toMatchObject({
      baseCreationStatus: "FAILED",
      overallStatus: "FAILED",
      pendingOperations: [],
      failedOperations: ["CREATE_WORKSPACE:FEISHU_PERMISSION_DENIED"],
    });

    adapter.createWorkspaceFailure = null;
    await expect(new FeishuProjectProvisioner(options).provision()).resolves.toMatchObject({
      overallStatus: "AWAITING_APPROVAL",
    });
    expect(adapter.createWorkspaceCount).toBe(2);
  });

  it("resumes after a partial field failure", async () => {
    const adapter = new MemoryProvisioningAdapter();
    adapter.failAfterFields = 5;
    const store = new MemoryStateStore();
    const source = await blueprint();
    const make = () =>
      new FeishuProjectProvisioner({
        adapter,
        stateStore: store,
        blueprint: source,
        projectId: "PRJ-RESUME",
        projectName: "Resume Project",
        runId: "RUN-RESUME",
        parentFolderToken: "folder",
      });
    await expect(make().provision()).rejects.toThrow("INJECTED_FIELD_FAILURE");
    expect(store.value?.completedOperations.some((operation) => operation.includes("FIELD"))).toBe(
      true,
    );
    adapter.failAfterFields = null;
    await expect(make().provision()).resolves.toMatchObject({ overallStatus: "AWAITING_APPROVAL" });
    expect(adapter.createWorkspaceCount).toBe(1);
  });

  it("blocks orphan and duplicate candidates instead of creating a second Base", () => {
    const recovery = new FeishuRecoveryCoordinator();
    expect(() =>
      recovery.recoverBaseCandidate(
        [{ appToken: "a", title: "Project｜图文内容工作台", projectId: null }],
        "Project｜图文内容工作台",
        "PRJ",
      ),
    ).toThrow(/same-title Base/);
    expect(() =>
      recovery.recoverBaseCandidate(
        [
          { appToken: "a", title: "Project｜图文内容工作台", projectId: "PRJ" },
          { appToken: "b", title: "Project｜图文内容工作台", projectId: "PRJ" },
        ],
        "Project｜图文内容工作台",
        "PRJ",
      ),
    ).toThrow(/Multiple candidate/);
  });

  it("allows add-only repair and rejects destructive operations", async () => {
    const report = {
      matchingTables: [],
      missingTables: ["contents"],
      extraTables: ["user-table"],
      matchingFields: [],
      missingFields: [],
      renamedFields: [],
      typeConflicts: [],
      extraFields: ["user-field"],
      matchingViews: [],
      missingViews: [],
      relationConflicts: [],
      safeRepairs: ["CREATE_TABLE:contents"],
      manualDecisionsRequired: [],
      overallStatus: "REPAIR_AVAILABLE" as const,
    };
    expect(planSafeFeishuRepairs(report)).toEqual(["CREATE_TABLE:contents"]);
    const applied: string[] = [];
    await applySafeFeishuRepairs(["CREATE_TABLE:contents"], (operation) => {
      applied.push(operation);
      return Promise.resolve();
    });
    expect(applied).toEqual(["CREATE_TABLE:contents"]);
    await expect(
      applySafeFeishuRepairs(["DELETE_TABLE:user-table"], () => Promise.resolve()),
    ).rejects.toMatchObject({ code: "FEISHU_SCHEMA_DRIFT" });
  });
});
