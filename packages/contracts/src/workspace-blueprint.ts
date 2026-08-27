export const WORKSPACE_TABLE_KEYS = [
  "projectConfig",
  "painpoints",
  "contents",
  "rulesAndFeedback",
] as const;

export const OWNER_SKILLS = [
  "content-studio-router",
  "project-initialization",
  "painpoint-research",
  "content-creation",
  "visual-planning",
  "image-set-production",
  "content-finalization",
  "project-learning",
] as const;

export interface BlueprintField {
  logicalKey: string;
  displayName: string;
  tableLogicalKey: string;
  fieldType: string;
  required: boolean;
  primary: boolean;
  hiddenByDefault: boolean;
  systemManaged: boolean;
  userManaged: boolean;
  immutableAfterCreate: boolean;
  ownerSkill: string;
  options: Array<{ code: string; displayName: string }>;
  targetTableLogicalKey: string;
  relationship: string;
  bidirectional: boolean;
}

export interface WorkspaceBlueprintDefinition {
  blueprint_version: string;
  tables: Array<{
    logicalKey: string;
    primaryFieldLogicalKey: string;
    fields: BlueprintField[];
  }>;
}

export interface WorkspaceFieldMapTemplate {
  provider: "FEISHU";
  project_id: string;
  blueprint_version: string;
  projectConfig: FieldMapEntry[];
  painpoints: FieldMapEntry[];
  contents: FieldMapEntry[];
  rulesAndFeedback: FieldMapEntry[];
  generated_at: string;
  schema_version: "1.0.0";
}

export interface FieldMapEntry {
  logicalKey: string;
  externalFieldId: string;
  displayNameSnapshot: string;
  fieldTypeSnapshot: string;
  lastVerifiedAt: string;
}

export function generateFieldMapTemplate(
  blueprint: WorkspaceBlueprintDefinition,
): WorkspaceFieldMapTemplate {
  const groups = Object.fromEntries(
    blueprint.tables.map((table) => [
      table.logicalKey,
      table.fields.map((field) => ({
        logicalKey: field.logicalKey,
        externalFieldId: `${field.logicalKey}__EXTERNAL_FIELD_ID`,
        displayNameSnapshot: field.displayName,
        fieldTypeSnapshot: field.fieldType,
        lastVerifiedAt: "1970-01-01T00:00:00.000Z",
      })),
    ]),
  ) as Record<string, FieldMapEntry[]>;
  return {
    provider: "FEISHU",
    project_id: "PRJ-20990101-DEMO",
    blueprint_version: blueprint.blueprint_version,
    projectConfig: groups.projectConfig ?? [],
    painpoints: groups.painpoints ?? [],
    contents: groups.contents ?? [],
    rulesAndFeedback: groups.rulesAndFeedback ?? [],
    generated_at: "1970-01-01T00:00:00.000Z",
    schema_version: "1.0.0",
  };
}

export function validateBlueprintInvariants(blueprint: WorkspaceBlueprintDefinition): string[] {
  const errors: string[] = [];
  const tableKeys = new Set(blueprint.tables.map((table) => table.logicalKey));
  const fieldKeys = new Set<string>();
  if (blueprint.tables.length !== WORKSPACE_TABLE_KEYS.length)
    errors.push("Expected exactly four tables.");
  for (const key of WORKSPACE_TABLE_KEYS)
    if (!tableKeys.has(key)) errors.push(`Missing table ${key}.`);
  for (const table of blueprint.tables) {
    const primaryFields = table.fields.filter((field) => field.primary);
    if (primaryFields.length !== 1)
      errors.push(`${table.logicalKey} must have exactly one primary field.`);
    if (primaryFields[0]?.logicalKey !== table.primaryFieldLogicalKey)
      errors.push(`${table.logicalKey} primary field reference does not match.`);
    for (const field of table.fields) {
      if (fieldKeys.has(field.logicalKey))
        errors.push(`Duplicate field logicalKey ${field.logicalKey}.`);
      fieldKeys.add(field.logicalKey);
      if (field.tableLogicalKey !== table.logicalKey)
        errors.push(`${field.logicalKey} references the wrong table.`);
      if (!OWNER_SKILLS.includes(field.ownerSkill as (typeof OWNER_SKILLS)[number]))
        errors.push(`${field.logicalKey} has unknown owner Skill ${field.ownerSkill}.`);
      if (field.systemManaged === field.userManaged)
        errors.push(`${field.logicalKey} must be either system-managed or user-managed.`);
      if (field.userManaged && field.systemManaged)
        errors.push(`${field.logicalKey} allows system overwrite of a user field.`);
      if (field.relationship !== "NONE" && !tableKeys.has(field.targetTableLogicalKey))
        errors.push(`${field.logicalKey} targets an unknown relation table.`);
      const optionCodes = field.options.map((option) => option.code);
      if (new Set(optionCodes).size !== optionCodes.length)
        errors.push(`${field.logicalKey} contains duplicate option codes.`);
    }
  }
  return errors;
}
