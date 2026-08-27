import { createHash } from "node:crypto";
import { feishuError } from "../errors.js";

export interface FeishuBlueprintField {
  logicalKey: string;
  displayName: string;
  tableLogicalKey: string;
  fieldType: string;
  primary: boolean;
  systemManaged: boolean;
  userManaged: boolean;
  hiddenByDefault: boolean;
  options: Array<{ code: string; displayName: string }>;
  targetTableLogicalKey: string;
  relationship: string;
  bidirectional: boolean;
}
export interface FeishuBlueprintView {
  logicalKey: string;
  displayName: string;
  tableLogicalKey: string;
}
export interface FeishuBlueprintTable {
  logicalKey: string;
  displayName: string;
  primaryFieldLogicalKey: string;
  fields: FeishuBlueprintField[];
  views: FeishuBlueprintView[];
}
export interface FeishuBlueprint {
  blueprint_version: string;
  tables: FeishuBlueprintTable[];
}

export interface FeishuRemoteField {
  fieldId: string;
  fieldName: string;
  type: number;
  property?: Record<string, unknown>;
}
export interface FeishuRemoteTable {
  tableId: string;
  name: string;
  fields: FeishuRemoteField[];
  views: Array<{ viewId: string; viewName: string; viewType: string }>;
}
export interface FeishuWorkspaceSnapshot {
  appTokenHash: string | null;
  name: string | null;
  tables: FeishuRemoteTable[];
}

export interface FeishuFieldRequest {
  logicalKey: string;
  field_name: string;
  type: number;
  ui_type: string;
  property?: Record<string, unknown>;
  protectedFromAutomaticOverwrite: boolean;
}

export interface FeishuFieldMapEntry {
  logicalKey: string;
  fieldId: string;
  currentFieldName: string;
  fieldType: number;
  tableLogicalKey: string;
  mappingVersion: number;
  lastVerifiedAt: string;
  userManaged: boolean;
  optionMap?: Record<string, string>;
}

const TYPE_MAP: Record<string, { type: number; ui: string }> = {
  TEXT: { type: 1, ui: "Text" },
  LONG_TEXT: { type: 1, ui: "Text" },
  NUMBER: { type: 2, ui: "Number" },
  SINGLE_SELECT: { type: 3, ui: "SingleSelect" },
  MULTI_SELECT: { type: 4, ui: "MultiSelect" },
  DATE: { type: 5, ui: "DateTime" },
  DATETIME: { type: 5, ui: "DateTime" },
  BOOLEAN: { type: 7, ui: "Checkbox" },
  ATTACHMENT: { type: 17, ui: "Attachment" },
  RELATION: { type: 18, ui: "SingleLink" },
};

export class FeishuFieldTypeMapper {
  map(field: FeishuBlueprintField, tableIds: Record<string, string> = {}): FeishuFieldRequest {
    const mapped = TYPE_MAP[field.fieldType];
    if (!mapped)
      throw feishuError(
        "FEISHU_FIELD_TYPE_UNSUPPORTED",
        `Unsupported Blueprint field type ${field.fieldType} for ${field.logicalKey}.`,
        { scope: "blueprint" },
      );
    const property: Record<string, unknown> = {};
    if (["SINGLE_SELECT", "MULTI_SELECT"].includes(field.fieldType))
      property.options = field.options.map((option) => ({ name: option.displayName }));
    if (field.fieldType === "DATE") property.date_formatter = "yyyy/MM/dd";
    if (field.fieldType === "DATETIME") property.date_formatter = "yyyy/MM/dd HH:mm";
    let type = mapped.type;
    let ui = mapped.ui;
    if (field.fieldType === "RELATION") {
      const tableId = tableIds[field.targetTableLogicalKey];
      if (!tableId)
        throw feishuError(
          "FEISHU_RELATION_CONFLICT",
          `Target table ${field.targetTableLogicalKey} is not resolved for ${field.logicalKey}.`,
          { scope: "blueprint" },
        );
      type = field.bidirectional ? 21 : 18;
      ui = field.bidirectional ? "DuplexLink" : "SingleLink";
      property.table_id = tableId;
      if (field.bidirectional) property.back_field_name = `${field.displayName}（反向）`;
    }
    return {
      logicalKey: field.logicalKey,
      field_name: field.displayName,
      type,
      ui_type: ui,
      ...(Object.keys(property).length ? { property } : {}),
      protectedFromAutomaticOverwrite: field.userManaged,
    };
  }
}

export class FeishuViewCompiler {
  compile(view: FeishuBlueprintView): {
    logicalKey: string;
    view_name: string;
    view_type: "grid";
    configuration: "NAME_ONLY";
  } {
    return {
      logicalKey: view.logicalKey,
      view_name: view.displayName,
      view_type: "grid",
      configuration: "NAME_ONLY",
    };
  }
}

export class FeishuRelationCompiler {
  constructor(private readonly mapper = new FeishuFieldTypeMapper()) {}
  compile(fields: FeishuBlueprintField[], tableIds: Record<string, string>): FeishuFieldRequest[] {
    return fields
      .filter((field) => field.fieldType === "RELATION")
      .map((field) => this.mapper.map(field, tableIds));
  }
}

export class FeishuRecordCompiler {
  compile(
    logicalFields: Record<string, unknown>,
    fieldMap: FeishuFieldMapEntry[],
    expectedMappingVersion: number,
    options: { allowUserManaged?: boolean; approvedLogicalKeys?: string[] } = {},
  ): Record<string, unknown> {
    const byLogicalKey = new Map(fieldMap.map((entry) => [entry.logicalKey, entry]));
    const output: Record<string, unknown> = {};
    for (const [logicalKey, value] of Object.entries(logicalFields)) {
      const mapped = byLogicalKey.get(logicalKey);
      if (!mapped || !mapped.fieldId)
        throw feishuError("FEISHU_SCHEMA_DRIFT", `Field mapping is missing for ${logicalKey}.`, {
          scope: "record-compiler",
        });
      if (mapped.mappingVersion !== expectedMappingVersion)
        throw feishuError(
          "FEISHU_SCHEMA_DRIFT",
          `Field mapping version is stale for ${logicalKey}.`,
          { scope: "record-compiler" },
        );
      if (mapped.userManaged && !options.allowUserManaged) continue;
      if (options.approvedLogicalKeys?.includes(logicalKey)) continue;
      const normalizeOption = (item: unknown) =>
        typeof item === "string" && mapped.optionMap ? (mapped.optionMap[item] ?? item) : item;
      output[mapped.currentFieldName] = Array.isArray(value)
        ? value.map(normalizeOption)
        : normalizeOption(value);
    }
    return output;
  }
}

export interface FeishuCompiledWorkspacePlan {
  planId: string;
  blueprintVersion: string;
  tableOperations: Array<{
    operation: "CREATE" | "ADOPT" | "SKIP_VERIFIED" | "BLOCK_CONFLICT" | "REPAIR_ADD_ONLY";
    logicalKey: string;
    displayName: string;
  }>;
  fieldOperations: Array<{
    operation: "CREATE" | "SKIP_VERIFIED" | "BLOCK_CONFLICT" | "REPAIR_ADD_ONLY" | "UPDATE_MAPPING";
    tableLogicalKey: string;
    request: FeishuFieldRequest;
  }>;
  relationOperations: Array<{
    operation: "CREATE" | "SKIP_VERIFIED" | "BLOCK_CONFLICT" | "REPAIR_ADD_ONLY";
    tableLogicalKey: string;
    fieldLogicalKey: string;
  }>;
  viewOperations: Array<{
    operation: "CREATE" | "SKIP_VERIFIED" | "REPAIR_ADD_ONLY";
    tableLogicalKey: string;
    logicalKey: string;
    view_name: string;
    view_type: "grid";
    configuration: "NAME_ONLY";
  }>;
  expected: {
    tables: number;
    fields: number;
    relations: number;
    views: number;
    unsupportedFields: number;
  };
  conflicts: string[];
}

function stableId(value: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex")
    .slice(0, 16)
    .toUpperCase();
}

export class FeishuBlueprintCompiler {
  constructor(
    private readonly fieldMapper = new FeishuFieldTypeMapper(),
    private readonly viewCompiler = new FeishuViewCompiler(),
  ) {}

  compile(
    blueprint: FeishuBlueprint,
    remote: FeishuWorkspaceSnapshot | null,
    mode: "PROVISION" | "REPAIR_ADD_ONLY" = "PROVISION",
  ): FeishuCompiledWorkspacePlan {
    const tableOperations: FeishuCompiledWorkspacePlan["tableOperations"] = [];
    const fieldOperations: FeishuCompiledWorkspacePlan["fieldOperations"] = [];
    const relationOperations: FeishuCompiledWorkspacePlan["relationOperations"] = [];
    const viewOperations: FeishuCompiledWorkspacePlan["viewOperations"] = [];
    const conflicts: string[] = [];
    const remoteByName = new Map((remote?.tables ?? []).map((table) => [table.name, table]));
    const remoteTableIds = Object.fromEntries(
      blueprint.tables.flatMap((table) => {
        const found = remoteByName.get(table.displayName);
        return found ? [[table.logicalKey, found.tableId]] : [];
      }),
    );
    for (const [tableIndex, table] of blueprint.tables.entries()) {
      const existing = remoteByName.get(table.displayName);
      tableOperations.push({
        operation: existing
          ? "SKIP_VERIFIED"
          : tableIndex === 0 && remote?.tables.length === 1
            ? "ADOPT"
            : mode === "REPAIR_ADD_ONLY"
              ? "REPAIR_ADD_ONLY"
              : "CREATE",
        logicalKey: table.logicalKey,
        displayName: table.displayName,
      });
      const remoteFields = new Map(
        (existing?.fields ?? []).map((field) => [field.fieldName, field]),
      );
      for (const field of table.fields.filter((candidate) => candidate.fieldType !== "RELATION")) {
        const request = this.fieldMapper.map(field);
        const current = remoteFields.get(field.displayName);
        if (current && current.type !== request.type) {
          conflicts.push(`FIELD_TYPE:${table.logicalKey}:${field.logicalKey}`);
          fieldOperations.push({
            operation: "BLOCK_CONFLICT",
            tableLogicalKey: table.logicalKey,
            request,
          });
        } else
          fieldOperations.push({
            operation: current
              ? "SKIP_VERIFIED"
              : mode === "REPAIR_ADD_ONLY"
                ? "REPAIR_ADD_ONLY"
                : "CREATE",
            tableLogicalKey: table.logicalKey,
            request,
          });
      }
      for (const field of table.fields.filter((candidate) => candidate.fieldType === "RELATION")) {
        const current = remoteFields.get(field.displayName);
        let expectedType = field.bidirectional ? 21 : 18;
        if (remoteTableIds[field.targetTableLogicalKey])
          expectedType = this.fieldMapper.map(field, remoteTableIds).type;
        if (current && current.type !== expectedType) {
          conflicts.push(`RELATION_TYPE:${table.logicalKey}:${field.logicalKey}`);
          relationOperations.push({
            operation: "BLOCK_CONFLICT",
            tableLogicalKey: table.logicalKey,
            fieldLogicalKey: field.logicalKey,
          });
        } else
          relationOperations.push({
            operation: current
              ? "SKIP_VERIFIED"
              : mode === "REPAIR_ADD_ONLY"
                ? "REPAIR_ADD_ONLY"
                : "CREATE",
            tableLogicalKey: table.logicalKey,
            fieldLogicalKey: field.logicalKey,
          });
      }
      for (const view of table.views) {
        const compiled = this.viewCompiler.compile(view);
        const exists =
          existing?.views.some((remoteView) => remoteView.viewName === view.displayName) ?? false;
        viewOperations.push({
          operation: exists
            ? "SKIP_VERIFIED"
            : mode === "REPAIR_ADD_ONLY"
              ? "REPAIR_ADD_ONLY"
              : "CREATE",
          tableLogicalKey: table.logicalKey,
          ...compiled,
        });
      }
    }
    const fields = blueprint.tables.flatMap((table) => table.fields);
    return {
      planId: `FWP-${stableId([blueprint.blueprint_version, remote, mode])}`,
      blueprintVersion: blueprint.blueprint_version,
      tableOperations,
      fieldOperations,
      relationOperations,
      viewOperations,
      expected: {
        tables: blueprint.tables.length,
        fields: fields.length,
        relations: fields.filter((field) => field.fieldType === "RELATION").length,
        views: blueprint.tables.flatMap((table) => table.views).length,
        unsupportedFields: 0,
      },
      conflicts,
    };
  }
}
