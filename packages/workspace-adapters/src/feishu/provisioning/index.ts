import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  FeishuCreatedWorkspace,
  FeishuCreatedTable,
  FeishuRecordInput,
  FeishuStoredRecord,
} from "../adapter.js";
import type { FeishuFieldRequest, FeishuRemoteField } from "../blueprint/index.js";
import type {
  FeishuBlueprint,
  FeishuFieldMapEntry,
  FeishuWorkspaceSnapshot,
} from "../blueprint/index.js";
import {
  FeishuBlueprintCompiler,
  FeishuFieldTypeMapper,
  FeishuRelationCompiler,
} from "../blueprint/index.js";
import { FeishuAdapterError, feishuError } from "../errors.js";

const DEFINITIVE_WORKSPACE_CREATE_REJECTIONS = new Set([
  "FEISHU_CONFIG_MISSING",
  "FEISHU_CREDENTIALS_MISSING",
  "FEISHU_AUTH_FAILED",
  "FEISHU_TOKEN_INVALID",
  "FEISHU_PERMISSION_DENIED",
  "FEISHU_PERMISSION_MISSING",
  "FEISHU_LIVE_WRITE_DISABLED",
  "FEISHU_LIVE_WRITE_NOT_CONFIRMED",
  "FEISHU_LIVE_TEST_NOT_CONFIGURED",
]);

function isDefinitiveWorkspaceCreateRejection(error: unknown): error is FeishuAdapterError {
  return (
    error instanceof FeishuAdapterError && DEFINITIVE_WORKSPACE_CREATE_REJECTIONS.has(error.code)
  );
}

export type ProvisioningOverallStatus =
  "PLANNED" | "IN_PROGRESS" | "AWAITING_APPROVAL" | "SUCCESS" | "BLOCKED" | "FAILED" | "CONFLICT";

export interface FeishuProvisioningState {
  provisioningId: string;
  projectId: string;
  runId: string;
  baseCreationStatus:
    "NOT_STARTED" | "CREATED_UNVERIFIED" | "VERIFIED" | "ADOPTED" | "ORPHAN_CANDIDATE" | "FAILED";
  currentPhase: number;
  completedOperations: string[];
  failedOperations: string[];
  pendingOperations: string[];
  remoteIdentifiers: Record<string, string>;
  fieldMap: FeishuFieldMapEntry[];
  mappingVersion: number;
  inputFingerprint: string;
  overallStatus: ProvisioningOverallStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FeishuProvisioningStateStore {
  load(): Promise<FeishuProvisioningState | null>;
  save(state: FeishuProvisioningState): Promise<void>;
}

export class FileFeishuProvisioningStateStore implements FeishuProvisioningStateStore {
  constructor(private readonly file: string) {}
  async load(): Promise<FeishuProvisioningState | null> {
    try {
      const value = JSON.parse(await readFile(this.file, "utf8")) as Record<string, unknown>;
      if ("provisioningId" in value) return value as unknown as FeishuProvisioningState;
      const extensions = (value.extensions ?? {}) as Record<string, unknown>;
      return {
        provisioningId: String(value.provisioning_id),
        projectId: String(value.project_id),
        runId: String(value.run_id),
        baseCreationStatus:
          value.base_creation_status as FeishuProvisioningState["baseCreationStatus"],
        currentPhase: Number(value.current_phase),
        completedOperations: (value.completed_operations ?? []) as string[],
        failedOperations: (value.failed_operations ?? []) as string[],
        pendingOperations: (value.pending_operations ?? []) as string[],
        remoteIdentifiers: (value.remote_identifiers ?? {}) as Record<string, string>,
        fieldMap: (extensions.field_map ?? []) as FeishuFieldMapEntry[],
        mappingVersion: Number(value.mapping_version),
        inputFingerprint:
          typeof extensions.input_fingerprint === "string"
            ? extensions.input_fingerprint
            : "LEGACY_UNVERIFIED",
        overallStatus: value.overall_status as ProvisioningOverallStatus,
        createdAt: String(value.created_at),
        updatedAt: String(value.updated_at),
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }
  async save(state: FeishuProvisioningState): Promise<void> {
    await mkdir(path.dirname(this.file), { recursive: true });
    const temporary = `${this.file}.tmp`;
    const mappedStates = (type: "field" | "relation") =>
      state.fieldMap
        .filter((field) => (type === "relation") === [18, 21].includes(field.fieldType))
        .map((field) => ({
          logical_key: field.logicalKey,
          status: "VERIFIED",
          remote_reference: field.fieldId,
        }));
    const referenceStates = (prefix: string) =>
      Object.entries(state.remoteIdentifiers)
        .filter(([key]) => key.startsWith(`${prefix}:`))
        .map(([key, value]) => ({
          logical_key: key.slice(prefix.length + 1),
          status: "VERIFIED",
          remote_reference: value,
        }));
    const serialized = {
      provisioning_id: state.provisioningId,
      project_id: state.projectId,
      run_id: state.runId,
      base_creation_status: state.baseCreationStatus,
      app_token_reference: state.remoteIdentifiers.appToken
        ? "project-secret-reference:workspace/provisioning-state.json#remote_identifiers.appToken"
        : null,
      table_states: referenceStates("table"),
      field_states: mappedStates("field"),
      relation_states: mappedStates("relation"),
      view_states: referenceStates("view"),
      record_states: referenceStates("record"),
      current_phase: state.currentPhase,
      completed_operations: state.completedOperations,
      failed_operations: state.failedOperations,
      pending_operations: state.pendingOperations,
      remote_identifiers: state.remoteIdentifiers,
      mapping_version: state.mappingVersion,
      journal_head: null,
      write_log_head: null,
      checkpoint_id: state.completedOperations.at(-1) ?? null,
      overall_status: state.overallStatus,
      created_at: state.createdAt,
      updated_at: state.updatedAt,
      schema_version: "1.0.0",
      extensions: {
        field_map: state.fieldMap,
        input_fingerprint: state.inputFingerprint,
      },
    };
    await writeFile(temporary, `${JSON.stringify(serialized, null, 2)}\n`, { mode: 0o600 });
    await rename(temporary, this.file);
  }
}

export interface FeishuProvisioningOptions {
  adapter: FeishuProvisioningAdapter;
  stateStore: FeishuProvisioningStateStore;
  blueprint: FeishuBlueprint;
  projectId: string;
  projectName: string;
  baseTitle?: string;
  runId: string;
  parentFolderToken: string;
  workspaceDirectory?: string;
  projectDraft?: Record<string, unknown>;
  now?: () => string;
  onOperation?: (event: {
    operation: string;
    phase: number;
    outcome: "STARTED" | "VERIFIED" | "FAILED";
  }) => void | Promise<void>;
}

export interface FeishuProvisioningAdapter {
  createWorkspace(name: string, parentFolderToken?: string): Promise<FeishuCreatedWorkspace>;
  setWorkspace(appToken: string): void;
  getWorkspaceInfo(): Promise<{ appToken: string; name: string; revision: number | null }>;
  listTables(): Promise<Array<{ tableId: string; name: string; revision: number | null }>>;
  getPrimaryFieldId?(tableId: string): Promise<string | null>;
  adoptDefaultTable(tableId: string, name: string): Promise<void>;
  createTable(name: string, primaryField: FeishuFieldRequest): Promise<FeishuCreatedTable>;
  listFields(tableId: string): Promise<FeishuRemoteField[]>;
  createField(tableId: string, request: FeishuFieldRequest): Promise<FeishuRemoteField>;
  deleteField(tableId: string, fieldId: string): Promise<void>;
  updateField(
    tableId: string,
    fieldId: string,
    request: FeishuFieldRequest,
  ): Promise<FeishuRemoteField>;
  listViews(
    tableId: string,
  ): Promise<Array<{ viewId: string; viewName: string; viewType: string }>>;
  createView(
    tableId: string,
    name: string,
    type?: "grid",
  ): Promise<{ viewId: string; viewName: string; configuration: "NAME_ONLY" }>;
  setFieldMap(entries: FeishuFieldMapEntry[], mappingVersion: number): void;
  findRecordByUniqueKey(
    uniqueKey: string,
    input: Pick<FeishuRecordInput, "tableId" | "tableLogicalKey" | "uniqueFieldLogicalKey">,
  ): Promise<FeishuStoredRecord | null>;
  createRecord(record: FeishuRecordInput, clientToken?: string): Promise<FeishuStoredRecord>;
  updateRecord(
    record: FeishuRecordInput & { recordId: string },
    clientToken?: string,
  ): Promise<FeishuStoredRecord>;
  verifyWorkspace(
    blueprint: FeishuBlueprint,
  ): Promise<{ verified: boolean; plan: ReturnType<FeishuBlueprintCompiler["compile"]> }>;
}

export class FeishuProjectProvisioner {
  readonly #mapper = new FeishuFieldTypeMapper();
  readonly #relations = new FeishuRelationCompiler();
  constructor(private readonly options: FeishuProvisioningOptions) {}

  async provision(): Promise<FeishuProvisioningState> {
    const now = this.options.now ?? (() => new Date().toISOString());
    const inputFingerprint = createHash("sha256")
      .update(
        JSON.stringify({
          projectId: this.options.projectId,
          projectName: this.options.projectName,
          runId: this.options.runId,
          blueprintVersion: this.options.blueprint.blueprint_version,
          projectDraft: this.options.projectDraft ?? {},
        }),
      )
      .digest("hex");
    let state = await this.options.stateStore.load();
    if (state && (state.projectId !== this.options.projectId || state.runId !== this.options.runId))
      throw feishuError(
        "FEISHU_RECORD_CONFLICT",
        "Provisioning state belongs to another project or run.",
        { scope: "provisioning" },
      );
    if (
      state &&
      state.inputFingerprint !== "LEGACY_UNVERIFIED" &&
      state.inputFingerprint !== inputFingerprint
    )
      throw feishuError(
        "FEISHU_RECORD_CONFLICT",
        "The same provisioning idempotency scope was reused with different input.",
        { scope: "provisioning" },
      );
    const baseTitle = this.options.baseTitle ?? `${this.options.projectName}｜图文内容工作台`;
    if (state?.overallStatus === "SUCCESS" && state.remoteIdentifiers.appToken) {
      this.options.adapter.setWorkspace(state.remoteIdentifiers.appToken);
      this.options.adapter.setFieldMap(state.fieldMap, state.mappingVersion);
      const info = await this.options.adapter.getWorkspaceInfo();
      if (info.name !== baseTitle)
        throw feishuError(
          "FEISHU_ORPHAN_WORKSPACE",
          "Stored Base reference does not match the planned project title.",
          { scope: "provisioning" },
        );
      const verified = await this.options.adapter.verifyWorkspace(this.options.blueprint);
      if (!verified.verified)
        throw feishuError(
          "FEISHU_SCHEMA_DRIFT",
          "Completed workspace failed idempotent replay verification.",
          { scope: "provisioning" },
        );
      await this.options.onOperation?.({
        operation: "VERIFY_COMPLETED_WORKSPACE_REPLAY",
        phase: 13,
        outcome: "VERIFIED",
      });
      return state;
    }
    state ??= {
      provisioningId: `FPS-${this.options.runId}`,
      projectId: this.options.projectId,
      runId: this.options.runId,
      baseCreationStatus: "NOT_STARTED",
      currentPhase: 1,
      completedOperations: [],
      failedOperations: [],
      pendingOperations: [],
      remoteIdentifiers: {},
      fieldMap: [],
      mappingVersion: 1,
      inputFingerprint,
      overallStatus: "PLANNED",
      createdAt: now(),
      updatedAt: now(),
    };
    const save = async (phase: number, operation: string) => {
      state.currentPhase = phase;
      if (!state.completedOperations.includes(operation)) state.completedOperations.push(operation);
      state.updatedAt = now();
      state.overallStatus = "IN_PROGRESS";
      await this.options.stateStore.save(state);
      await this.#persistWorkspaceArtifacts(state);
      await this.options.onOperation?.({ operation, phase, outcome: "VERIFIED" });
    };
    let appToken = state.remoteIdentifiers.appToken;
    let defaultTableId = state.remoteIdentifiers.defaultTableId;
    if (!appToken) {
      if (state.pendingOperations.includes("CREATE_WORKSPACE:REMOTE_RESULT_UNKNOWN")) {
        state.baseCreationStatus = "ORPHAN_CANDIDATE";
        state.overallStatus = "BLOCKED";
        await this.options.stateStore.save(state);
        throw feishuError(
          "FEISHU_ORPHAN_WORKSPACE",
          "A prior Base create attempt has an unknown remote result; Operator reconciliation is required before retry.",
          { scope: "provisioning" },
        );
      }
      state.pendingOperations.push("CREATE_WORKSPACE:REMOTE_RESULT_UNKNOWN");
      state.currentPhase = 3;
      state.overallStatus = "IN_PROGRESS";
      state.updatedAt = now();
      await this.options.stateStore.save(state);
      await this.options.onOperation?.({
        operation: "CREATE_WORKSPACE",
        phase: 3,
        outcome: "STARTED",
      });
      let created: FeishuCreatedWorkspace;
      try {
        created = await this.options.adapter.createWorkspace(
          baseTitle,
          this.options.parentFolderToken,
        );
      } catch (error) {
        if (isDefinitiveWorkspaceCreateRejection(error)) {
          state.pendingOperations = state.pendingOperations.filter(
            (operation) => operation !== "CREATE_WORKSPACE:REMOTE_RESULT_UNKNOWN",
          );
          state.baseCreationStatus = "FAILED";
          state.overallStatus = "FAILED";
          const failedOperation = `CREATE_WORKSPACE:${error.code}`;
          if (!state.failedOperations.includes(failedOperation))
            state.failedOperations.push(failedOperation);
          state.updatedAt = now();
          await this.options.stateStore.save(state);
          await this.#persistWorkspaceArtifacts(state);
          await this.options.onOperation?.({
            operation: "CREATE_WORKSPACE",
            phase: 3,
            outcome: "FAILED",
          });
        }
        throw error;
      }
      appToken = created.appToken;
      defaultTableId = created.defaultTableId;
      state.remoteIdentifiers.appToken = appToken;
      state.remoteIdentifiers.defaultTableId = defaultTableId;
      state.pendingOperations = state.pendingOperations.filter(
        (operation) => operation !== "CREATE_WORKSPACE:REMOTE_RESULT_UNKNOWN",
      );
      state.baseCreationStatus = "CREATED_UNVERIFIED";
      await save(3, "CREATE_WORKSPACE:REMOTE_SUCCEEDED_LOCAL_SAVED");
    } else this.options.adapter.setWorkspace(appToken);
    const info = await this.options.adapter.getWorkspaceInfo();
    if (info.name !== baseTitle)
      throw feishuError(
        "FEISHU_ORPHAN_WORKSPACE",
        "Stored Base reference does not match the planned project title.",
        { scope: "provisioning" },
      );
    state.baseCreationStatus = "VERIFIED";
    await save(3, "VERIFY_WORKSPACE");

    const tableIds: Record<string, string> = {};
    const tables = await this.options.adapter.listTables();
    const firstTable = this.options.blueprint.tables[0];
    if (!firstTable)
      throw feishuError("FEISHU_CONFIG_MISSING", "Workspace Blueprint has no tables.", {
        scope: "provisioning",
      });
    let defaultTable = tables.find((table) => table.name === firstTable.displayName);
    if (!defaultTable && defaultTableId) {
      const candidate = tables.find((table) => table.tableId === defaultTableId);
      if (!candidate || tables.length !== 1)
        throw feishuError(
          "FEISHU_ORPHAN_WORKSPACE",
          "The default table cannot be safely adopted.",
          { scope: "provisioning" },
        );
      await this.options.adapter.adoptDefaultTable(candidate.tableId, firstTable.displayName);
      defaultTable = { ...candidate, name: firstTable.displayName };
      state.baseCreationStatus = "ADOPTED";
      await save(4, `ADOPT_DEFAULT_TABLE:${firstTable.logicalKey}`);
    }
    if (!defaultTable)
      throw feishuError(
        "FEISHU_SCHEMA_DRIFT",
        "Project configuration table is missing after default-table reconciliation.",
        { scope: "provisioning" },
      );
    tableIds[firstTable.logicalKey] = defaultTable.tableId;
    state.remoteIdentifiers[`table:${firstTable.logicalKey}`] = defaultTable.tableId;
    await save(4, `VERIFY_TABLE:${firstTable.logicalKey}`);

    // A newly created Feishu Base currently seeds three non-primary helper fields.
    // They are not user data and are removed only from the exact default table
    // created and persisted by this provisioning Run. Existing workspaces, renamed
    // fields, type mismatches and every other extra field remain untouched.
    if (
      state.remoteIdentifiers.defaultTableId === defaultTable.tableId &&
      state.completedOperations.includes("CREATE_WORKSPACE:REMOTE_SUCCEEDED_LOCAL_SAVED")
    ) {
      const defaultAuxiliaryFields = [
        { fieldName: "单选", type: 3 },
        { fieldName: "日期", type: 5 },
        { fieldName: "附件", type: 17 },
      ] as const;
      for (const expected of defaultAuxiliaryFields) {
        if (
          state.completedOperations.includes(`DELETE_PLATFORM_DEFAULT_FIELD:${expected.fieldName}`)
        )
          continue;
        const fields = await this.options.adapter.listFields(defaultTable.tableId);
        const matches = fields.filter(
          (field) => field.fieldName === expected.fieldName && field.type === expected.type,
        );
        if (matches.length > 1)
          throw feishuError(
            "FEISHU_SCHEMA_DRIFT",
            `Multiple platform default fields matched ${expected.fieldName}; cleanup is ambiguous.`,
            { scope: "provisioning" },
          );
        const match = matches[0];
        if (!match) continue;
        const primaryFieldId = await this.options.adapter.getPrimaryFieldId?.(defaultTable.tableId);
        if (primaryFieldId === match.fieldId)
          throw feishuError(
            "FEISHU_SCHEMA_DRIFT",
            `Platform default cleanup refused to delete primary field ${expected.fieldName}.`,
            { scope: "provisioning" },
          );
        await this.options.adapter.deleteField(defaultTable.tableId, match.fieldId);
        await save(4, `DELETE_PLATFORM_DEFAULT_FIELD:${expected.fieldName}`);
      }
    }

    for (const table of this.options.blueprint.tables.slice(1)) {
      const existing = (await this.options.adapter.listTables()).find(
        (candidate) => candidate.name === table.displayName,
      );
      if (existing) tableIds[table.logicalKey] = existing.tableId;
      else {
        const primary = table.fields.find(
          (field) => field.logicalKey === table.primaryFieldLogicalKey,
        );
        if (!primary)
          throw feishuError(
            "FEISHU_SCHEMA_DRIFT",
            `Primary field is missing for ${table.logicalKey}.`,
            { scope: "provisioning" },
          );
        const created = await this.options.adapter.createTable(
          table.displayName,
          this.#mapper.map(primary),
        );
        tableIds[table.logicalKey] = created.tableId;
        await save(5, `CREATE_TABLE:${table.logicalKey}`);
      }
      state.remoteIdentifiers[`table:${table.logicalKey}`] = tableIds[table.logicalKey] ?? "";
      await save(5, `VERIFY_TABLE:${table.logicalKey}`);
    }
    if (Object.keys(tableIds).length !== this.options.blueprint.tables.length)
      throw feishuError("FEISHU_SCHEMA_DRIFT", "Not all Blueprint tables were resolved.", {
        scope: "provisioning",
      });

    for (const table of this.options.blueprint.tables) {
      const tableId = tableIds[table.logicalKey];
      if (!tableId) continue;
      let remoteFields = await this.options.adapter.listFields(tableId);
      const primary = table.fields.find(
        (field) => field.logicalKey === table.primaryFieldLogicalKey,
      );
      if (!primary) continue;
      let remotePrimary = remoteFields.find((field) => field.fieldName === primary.displayName);
      if (!remotePrimary && table.logicalKey === firstTable.logicalKey) {
        const primaryFieldId = await this.options.adapter.getPrimaryFieldId?.(tableId);
        const existingPrimary = primaryFieldId
          ? remoteFields.find((field) => field.fieldId === primaryFieldId)
          : remoteFields.length === 1
            ? remoteFields[0]
            : undefined;
        if (!existingPrimary)
          throw feishuError(
            "FEISHU_SCHEMA_DRIFT",
            "Default table primary field cannot be resolved safely.",
            { scope: "provisioning" },
          );
        const primaryRequest = this.#mapper.map(primary);
        if (existingPrimary.type !== primaryRequest.type)
          throw feishuError(
            "FEISHU_SCHEMA_DRIFT",
            "Default table primary field type does not match the Blueprint.",
            { scope: "provisioning" },
          );
        remotePrimary = await this.options.adapter.updateField(
          tableId,
          existingPrimary.fieldId,
          primaryRequest,
        );
        remoteFields = await this.options.adapter.listFields(tableId);
      }
      if (!remotePrimary)
        remotePrimary = remoteFields.find((field) => field.fieldName === primary.displayName);
      if (!remotePrimary)
        throw feishuError(
          "FEISHU_SCHEMA_DRIFT",
          `Primary field ${primary.logicalKey} was not resolved.`,
          { scope: "provisioning" },
        );
      this.#map(
        state,
        table.logicalKey,
        primary,
        remotePrimary.fieldId,
        remotePrimary.fieldName,
        remotePrimary.type,
        now(),
      );
      for (const field of table.fields.filter(
        (candidate) => !candidate.primary && candidate.fieldType !== "RELATION",
      )) {
        const request = this.#mapper.map(field);
        const sameName = remoteFields.find(
          (candidate) => candidate.fieldName === field.displayName,
        );
        if (sameName && sameName.type !== request.type)
          throw feishuError("FEISHU_SCHEMA_DRIFT", `Field type conflict for ${field.logicalKey}.`, {
            scope: "provisioning",
          });
        const remote = sameName ?? (await this.options.adapter.createField(tableId, request));
        this.#map(
          state,
          table.logicalKey,
          field,
          remote.fieldId,
          remote.fieldName,
          remote.type,
          now(),
        );
        await save(6, `${sameName ? "VERIFY" : "CREATE"}_FIELD:${field.logicalKey}`);
      }
    }

    for (const table of this.options.blueprint.tables) {
      const tableId = tableIds[table.logicalKey];
      if (!tableId) continue;
      const relationFields = table.fields.filter((field) => field.fieldType === "RELATION");
      for (const request of this.#relations.compile(relationFields, tableIds)) {
        const source = relationFields.find((field) => field.logicalKey === request.logicalKey);
        if (!source) continue;
        const fields = await this.options.adapter.listFields(tableId);
        const sameName = fields.find((candidate) => candidate.fieldName === request.field_name);
        if (sameName && sameName.type !== request.type)
          throw feishuError(
            "FEISHU_RELATION_CONFLICT",
            `Relation type conflict for ${request.logicalKey}.`,
            { scope: "provisioning" },
          );
        const remote = sameName ?? (await this.options.adapter.createField(tableId, request));
        this.#map(
          state,
          table.logicalKey,
          source,
          remote.fieldId,
          remote.fieldName,
          remote.type,
          now(),
        );
        await save(7, `${sameName ? "VERIFY" : "CREATE"}_RELATION:${request.logicalKey}`);
      }
    }

    for (const table of this.options.blueprint.tables) {
      const tableId = tableIds[table.logicalKey];
      if (!tableId) continue;
      for (const view of table.views) {
        const existing = (await this.options.adapter.listViews(tableId)).find(
          (candidate) => candidate.viewName === view.displayName,
        );
        const resolved =
          existing ?? (await this.options.adapter.createView(tableId, view.displayName));
        state.remoteIdentifiers[`view:${view.logicalKey}`] = resolved.viewId;
        await save(8, `${existing ? "VERIFY" : "CREATE"}_VIEW:${view.logicalKey}`);
      }
    }

    this.options.adapter.setFieldMap(state.fieldMap, state.mappingVersion);
    const projectTableId = tableIds.projectConfig;
    if (!projectTableId)
      throw feishuError("FEISHU_SCHEMA_DRIFT", "Project configuration table mapping is missing.", {
        scope: "provisioning",
      });
    const draftFields = {
      projectConfigProjectName: this.options.projectName,
      projectConfigProjectId: this.options.projectId,
      projectConfigProjectStatus: "PROJECT_PENDING_CONFIRMATION",
      projectConfigConfigConfirmationStatus: "CONFIG_PENDING",
      projectConfigRecordUniqueKey: `${this.options.projectId}::project-config`,
      projectConfigSchemaVersion: "1.0.0",
      projectConfigLastRunId: this.options.runId,
      ...(this.options.projectDraft ?? {}),
    };
    const input = {
      uniqueKey: `${this.options.projectId}::project-config`,
      version: 1,
      fields: draftFields,
      tableId: projectTableId,
      tableLogicalKey: "projectConfig",
      uniqueFieldLogicalKey: "projectConfigRecordUniqueKey",
      allowUserManaged: true,
    };
    const existing = await this.options.adapter.findRecordByUniqueKey(input.uniqueKey, input);
    const resolvedRecord =
      existing ??
      (await this.options.adapter.createRecord(input, `${this.options.runId}:PROJECT_CONFIG`));
    state.remoteIdentifiers["record:projectConfig"] = resolvedRecord.recordId;
    await save(9, `${existing ? "VERIFY" : "CREATE"}_PROJECT_CONFIG_DRAFT`);

    const verified = await this.options.adapter.verifyWorkspace(this.options.blueprint);
    if (!verified.verified) {
      state.overallStatus = "BLOCKED";
      state.failedOperations.push(...verified.plan.conflicts);
      await this.options.stateStore.save(state);
      return state;
    }
    state.currentPhase = 12;
    state.overallStatus = "AWAITING_APPROVAL";
    state.updatedAt = now();
    await this.options.stateStore.save(state);
    await this.#persistWorkspaceArtifacts(state);
    return state;
  }

  async activateAfterG1(approved: boolean): Promise<FeishuProvisioningState> {
    const state = await this.options.stateStore.load();
    if (!state || state.overallStatus !== "AWAITING_APPROVAL")
      throw feishuError("FEISHU_RECORD_CONFLICT", "Project is not awaiting G1 approval.", {
        scope: "provisioning",
      });
    if (!approved) return state;
    const tableId = state.remoteIdentifiers["table:projectConfig"];
    if (!tableId)
      throw feishuError("FEISHU_SCHEMA_DRIFT", "Project configuration table is not mapped.", {
        scope: "G1",
      });
    this.options.adapter.setWorkspace(state.remoteIdentifiers.appToken ?? "");
    this.options.adapter.setFieldMap(state.fieldMap, state.mappingVersion);
    const uniqueKey = `${this.options.projectId}::project-config`;
    const record = await this.options.adapter.findRecordByUniqueKey(uniqueKey, {
      tableId,
      tableLogicalKey: "projectConfig",
      uniqueFieldLogicalKey: "projectConfigRecordUniqueKey",
    });
    if (!record)
      throw feishuError("FEISHU_RECORD_CONFLICT", "Project configuration record is missing.", {
        scope: "G1",
      });
    const remoteMatches = (logicalKey: string, expectedLogicalValue: string) => {
      const mapping = state.fieldMap.find((entry) => entry.logicalKey === logicalKey);
      if (!mapping) return false;
      const expected = mapping.optionMap?.[expectedLogicalValue] ?? expectedLogicalValue;
      const actual = record.fields[mapping.currentFieldName];
      const values = Array.isArray(actual) ? (actual as unknown[]) : null;
      const normalized = values?.length === 1 ? values[0] : actual;
      return normalized === expected;
    };
    const alreadyActive =
      remoteMatches("projectConfigProjectStatus", "PROJECT_ACTIVE") &&
      remoteMatches("projectConfigConfigConfirmationStatus", "CONFIG_CONFIRMED");
    if (!alreadyActive)
      await this.options.adapter.updateRecord(
        {
          uniqueKey,
          version: record.version,
          fields: {
            projectConfigProjectStatus: "PROJECT_ACTIVE",
            projectConfigConfigConfirmationStatus: "CONFIG_CONFIRMED",
          },
          tableId,
          tableLogicalKey: "projectConfig",
          uniqueFieldLogicalKey: "projectConfigRecordUniqueKey",
          allowUserManaged: true,
          recordId: record.recordId,
        },
        `${this.options.runId}:G1_ACTIVATE`,
      );
    const verified = await this.options.adapter.verifyWorkspace(this.options.blueprint);
    if (!verified.verified)
      throw feishuError("FEISHU_SCHEMA_DRIFT", "Workspace verification failed after G1.", {
        scope: "G1",
      });
    state.currentPhase = 13;
    state.overallStatus = "SUCCESS";
    state.completedOperations.push("G1_APPROVED_PROJECT_ACTIVE");
    state.updatedAt = (this.options.now ?? (() => new Date().toISOString()))();
    await this.options.stateStore.save(state);
    await this.#persistWorkspaceArtifacts(state);
    return state;
  }

  async #persistWorkspaceArtifacts(state: FeishuProvisioningState): Promise<void> {
    const directory = this.options.workspaceDirectory;
    if (!directory) return;
    await mkdir(directory, { recursive: true });
    const write = async (name: string, value: unknown) => {
      const file = path.join(directory, name);
      const temporary = `${file}.tmp`;
      await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
      await rename(temporary, file);
    };
    await Promise.all([
      write("connections.json", {
        provider: "FEISHU",
        app_token: state.remoteIdentifiers.appToken ?? null,
        parent_folder_reference: "env:FEISHU_PARENT_FOLDER_TOKEN",
        updated_at: state.updatedAt,
      }),
      write("schema-state.json", {
        blueprint_version: this.options.blueprint.blueprint_version,
        schema_version: "1.0.0",
        mapping_version: state.mappingVersion,
        tables: Object.fromEntries(
          Object.entries(state.remoteIdentifiers).filter(([key]) => key.startsWith("table:")),
        ),
        updated_at: state.updatedAt,
      }),
      write("field-map.json", {
        mapping_version: state.mappingVersion,
        fields: state.fieldMap,
        updated_at: state.updatedAt,
      }),
      write("view-map.json", {
        views: Object.fromEntries(
          Object.entries(state.remoteIdentifiers).filter(([key]) => key.startsWith("view:")),
        ),
        updated_at: state.updatedAt,
      }),
    ]);
  }

  #map(
    state: FeishuProvisioningState,
    tableLogicalKey: string,
    field: FeishuBlueprint["tables"][number]["fields"][number],
    fieldId: string,
    currentFieldName: string,
    fieldType: number,
    checkedAt: string,
  ): void {
    const entry: FeishuFieldMapEntry = {
      logicalKey: field.logicalKey,
      fieldId,
      currentFieldName,
      fieldType,
      tableLogicalKey,
      mappingVersion: state.mappingVersion,
      lastVerifiedAt: checkedAt,
      userManaged: field.userManaged,
      ...(field.options.length
        ? {
            optionMap: Object.fromEntries(
              field.options.map((option) => [option.code, option.displayName]),
            ),
          }
        : {}),
    };
    const index = state.fieldMap.findIndex(
      (candidate) => candidate.logicalKey === field.logicalKey,
    );
    if (index >= 0) state.fieldMap[index] = entry;
    else state.fieldMap.push(entry);
  }
}

export interface FeishuReconciliationReport {
  matchingTables: string[];
  missingTables: string[];
  extraTables: string[];
  matchingFields: string[];
  missingFields: string[];
  renamedFields: string[];
  typeConflicts: string[];
  extraFields: string[];
  matchingViews: string[];
  missingViews: string[];
  relationConflicts: string[];
  safeRepairs: string[];
  manualDecisionsRequired: string[];
  overallStatus: "MATCH" | "REPAIR_AVAILABLE" | "BLOCKED";
}

export function buildFeishuReconciliationReport(
  blueprint: FeishuBlueprint,
  snapshot: FeishuWorkspaceSnapshot,
  fieldMap: FeishuFieldMapEntry[] = [],
): FeishuReconciliationReport {
  const report: FeishuReconciliationReport = {
    matchingTables: [],
    missingTables: [],
    extraTables: [],
    matchingFields: [],
    missingFields: [],
    renamedFields: [],
    typeConflicts: [],
    extraFields: [],
    matchingViews: [],
    missingViews: [],
    relationConflicts: [],
    safeRepairs: [],
    manualDecisionsRequired: [],
    overallStatus: "MATCH",
  };
  const mapper = new FeishuFieldTypeMapper();
  const blueprintTableNames = new Set(blueprint.tables.map((table) => table.displayName));
  for (const remote of snapshot.tables)
    if (!blueprintTableNames.has(remote.name)) report.extraTables.push(remote.name);
  for (const table of blueprint.tables) {
    const remote = snapshot.tables.find((candidate) => candidate.name === table.displayName);
    if (!remote) {
      report.missingTables.push(table.logicalKey);
      report.safeRepairs.push(`CREATE_TABLE:${table.logicalKey}`);
      continue;
    }
    report.matchingTables.push(table.logicalKey);
    const expectedNames = new Set(table.fields.map((field) => field.displayName));
    for (const extra of remote.fields.filter(
      (field) =>
        !expectedNames.has(field.fieldName) &&
        !fieldMap.some((mapped) => mapped.fieldId === field.fieldId),
    ))
      report.extraFields.push(`${table.logicalKey}:${extra.fieldName}`);
    for (const field of table.fields) {
      const mapped = fieldMap.find((entry) => entry.logicalKey === field.logicalKey);
      const current = mapped
        ? remote.fields.find((candidate) => candidate.fieldId === mapped.fieldId)
        : remote.fields.find((candidate) => candidate.fieldName === field.displayName);
      if (!current) {
        report.missingFields.push(field.logicalKey);
        report.safeRepairs.push(`CREATE_FIELD:${field.logicalKey}`);
        continue;
      }
      if (current.fieldName !== field.displayName) report.renamedFields.push(field.logicalKey);
      let expectedType: number;
      try {
        expectedType = mapper.map(
          field,
          field.fieldType === "RELATION" ? { [field.targetTableLogicalKey]: "TARGET" } : {},
        ).type;
      } catch {
        expectedType = current.type;
      }
      if (current.type !== expectedType) {
        report.typeConflicts.push(field.logicalKey);
        report.manualDecisionsRequired.push(`FIELD_TYPE:${field.logicalKey}`);
      } else report.matchingFields.push(field.logicalKey);
    }
    for (const view of table.views) {
      if (remote.views.some((candidate) => candidate.viewName === view.displayName))
        report.matchingViews.push(view.logicalKey);
      else {
        report.missingViews.push(view.logicalKey);
        report.safeRepairs.push(`CREATE_VIEW:${view.logicalKey}`);
      }
    }
  }
  report.overallStatus =
    report.typeConflicts.length || report.relationConflicts.length
      ? "BLOCKED"
      : report.safeRepairs.length
        ? "REPAIR_AVAILABLE"
        : "MATCH";
  return report;
}

export class FeishuRecoveryCoordinator {
  recoverBaseCandidate(
    candidates: Array<{ appToken: string; title: string; projectId: string | null }>,
    expectedTitle: string,
    projectId: string,
  ): { action: "ADOPT"; appToken: string } | { action: "CREATE" } {
    const matching = candidates.filter(
      (candidate) =>
        candidate.title === expectedTitle &&
        (candidate.projectId === null || candidate.projectId === projectId),
    );
    if (matching.length > 1)
      throw feishuError(
        "FEISHU_DUPLICATE_WORKSPACE_CANDIDATES",
        "Multiple candidate Bases require an Operator decision.",
        { scope: "recovery" },
      );
    const only = matching[0];
    if (only && only.projectId === null)
      throw feishuError(
        "FEISHU_ORPHAN_WORKSPACE",
        "A same-title Base exists without a verifiable project identity.",
        { scope: "recovery" },
      );
    return only ? { action: "ADOPT", appToken: only.appToken } : { action: "CREATE" };
  }
}

export function planSafeFeishuRepairs(report: FeishuReconciliationReport): string[] {
  if (report.overallStatus === "BLOCKED") return [];
  return report.safeRepairs.filter((repair) =>
    /^(CREATE_TABLE|CREATE_FIELD|CREATE_VIEW|CREATE_RELATION|REFRESH_MAPPING):/.test(repair),
  );
}

export async function applySafeFeishuRepairs(
  plan: string[],
  apply: (operation: string) => Promise<void>,
): Promise<void> {
  if (plan.some((operation) => /DELETE|DROP|REPLACE|RENAME/.test(operation)))
    throw feishuError("FEISHU_SCHEMA_DRIFT", "Destructive repair operation was rejected.", {
      scope: "repair",
    });
  await plan.reduce<Promise<void>>(
    (pending, operation) => pending.then(() => apply(operation)),
    Promise.resolve(),
  );
}

export function compileFeishuWorkspacePlan(
  blueprint: FeishuBlueprint,
  snapshot: FeishuWorkspaceSnapshot | null,
  mode: "PROVISION" | "REPAIR_ADD_ONLY" = "PROVISION",
) {
  return new FeishuBlueprintCompiler().compile(blueprint, snapshot, mode);
}
