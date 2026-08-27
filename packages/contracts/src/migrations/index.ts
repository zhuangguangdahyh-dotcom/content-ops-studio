export type MigrationClassification = "PATCH" | "MINOR" | "MAJOR" | "POTENTIALLY_BREAKING";

export type SchemaChangeKind =
  | "DESCRIPTION_CHANGE"
  | "EXAMPLE_CHANGE"
  | "VALIDATION_NEUTRAL_METADATA"
  | "ADD_OPTIONAL_FIELD"
  | "ADD_OPTIONAL_OBJECT"
  | "ADD_INDEPENDENT_SCHEMA"
  | "ADD_ENUM_VALUE"
  | "REMOVE_FIELD"
  | "CHANGE_FIELD_TYPE"
  | "ADD_REQUIRED_FIELD"
  | "CHANGE_ID_SEMANTICS"
  | "CHANGE_STATE_SEMANTICS"
  | "REMOVE_ENUM_VALUE"
  | "CHANGE_ENUM_MEANING"
  | "CHANGE_RELATIONSHIP";

export interface MigrationOperation {
  operation: "NO_OP" | "ADD_OPTIONAL_FIELD" | "COPY_FIELD" | "RENAME_FIELD" | "TRANSFORM_VALUE";
  path: string;
  target_path: string | null;
  details: string;
}

export interface MigrationDefinition {
  migration_id: string;
  from_version: string;
  to_version: string;
  classification: MigrationClassification;
  description: string;
  operations: MigrationOperation[];
  warnings: string[];
  preserves_history: true;
  default_dry_run: true;
  schema_version: "1.0.0";
}

export interface MigrationExecutionReport {
  migration_id: string;
  from_version: string;
  to_version: string;
  status: "PLANNED" | "NO_OP" | "APPLIED" | "BLOCKED" | "CONFLICT";
  dry_run: boolean;
  changes: Array<{
    path: string;
    operation: string;
    before_present: boolean;
    after_present: boolean;
  }>;
  warnings: string[];
  conflicts: string[];
  unmigrated_items: string[];
  input_unchanged: boolean;
  idempotent: boolean;
  started_at: string;
  completed_at: string;
  run_id: string;
  schema_version: "1.0.0";
}

export class MigrationRegistry {
  private readonly definitions = new Map<string, MigrationDefinition>();

  constructor(definitions: MigrationDefinition[] = []) {
    for (const definition of definitions) this.register(definition);
  }

  register(definition: MigrationDefinition): void {
    if (this.definitions.has(definition.migration_id))
      throw new Error(`Duplicate migration ID: ${definition.migration_id}`);
    this.definitions.set(definition.migration_id, Object.freeze({ ...definition }));
  }

  list(): MigrationDefinition[] {
    return [...this.definitions.values()].sort((a, b) =>
      a.migration_id.localeCompare(b.migration_id),
    );
  }
}

export const BASELINE_MIGRATION: MigrationDefinition = {
  migration_id: "MIG-1.0.0-TO-1.0.0",
  from_version: "1.0.0",
  to_version: "1.0.0",
  classification: "PATCH",
  description: "Honest Phase 1A baseline no-op migration.",
  operations: [{ operation: "NO_OP", path: "/", target_path: null, details: "No data change." }],
  warnings: [],
  preserves_history: true,
  default_dry_run: true,
  schema_version: "1.0.0",
};

export const baselineMigrationRegistry = new MigrationRegistry([BASELINE_MIGRATION]);

export function classifySchemaChange(change: SchemaChangeKind): MigrationClassification {
  if (["DESCRIPTION_CHANGE", "EXAMPLE_CHANGE", "VALIDATION_NEUTRAL_METADATA"].includes(change))
    return "PATCH";
  if (["ADD_OPTIONAL_FIELD", "ADD_OPTIONAL_OBJECT", "ADD_INDEPENDENT_SCHEMA"].includes(change))
    return "MINOR";
  if (change === "ADD_ENUM_VALUE") return "POTENTIALLY_BREAKING";
  return "MAJOR";
}

export function planMigration(
  registry: MigrationRegistry,
  fromVersion: string,
  toVersion: string,
): MigrationDefinition[] {
  if (fromVersion === toVersion) {
    const noOp = registry
      .list()
      .find((item) => item.from_version === fromVersion && item.to_version === toVersion);
    if (!noOp) throw new Error(`MIGRATION_PATH_MISSING: ${fromVersion} -> ${toVersion}`);
    return [noOp];
  }
  const queue: Array<{ version: string; path: MigrationDefinition[] }> = [
    { version: fromVersion, path: [] },
  ];
  const visited = new Set([fromVersion]);
  while (queue.length) {
    const current = queue.shift();
    if (!current) break;
    for (const migration of registry
      .list()
      .filter(
        (item) => item.from_version === current.version && item.to_version !== item.from_version,
      )) {
      const nextPath = [...current.path, migration];
      if (migration.to_version === toVersion) return nextPath;
      if (!visited.has(migration.to_version)) {
        visited.add(migration.to_version);
        queue.push({ version: migration.to_version, path: nextPath });
      }
    }
  }
  throw new Error(`MIGRATION_PATH_MISSING: ${fromVersion} -> ${toVersion}`);
}

export function validateMigrationPath(path: MigrationDefinition[]): string[] {
  const errors: string[] = [];
  for (let index = 1; index < path.length; index += 1) {
    if (path[index - 1]?.to_version !== path[index]?.from_version)
      errors.push(`Migration path gap at index ${index}.`);
  }
  if (path.some((item) => !item.preserves_history)) errors.push("Migration must preserve history.");
  return errors;
}

export function runMigrationDryRun(options: {
  registry: MigrationRegistry;
  input: unknown;
  fromVersion: string;
  toVersion: string;
  runId: string;
  evaluatedAt: string;
}): { output: unknown; report: MigrationExecutionReport } {
  const inputSnapshot = JSON.stringify(options.input);
  const output = JSON.parse(inputSnapshot) as unknown;
  const path = planMigration(options.registry, options.fromVersion, options.toVersion);
  const pathErrors = validateMigrationPath(path);
  const operations = path.flatMap((item) => item.operations);
  const noOp = operations.every((operation) => operation.operation === "NO_OP");
  const report: MigrationExecutionReport = {
    migration_id: path.map((item) => item.migration_id).join("+"),
    from_version: options.fromVersion,
    to_version: options.toVersion,
    status: pathErrors.length ? "BLOCKED" : noOp ? "NO_OP" : "PLANNED",
    dry_run: true,
    changes: operations
      .filter((operation) => operation.operation !== "NO_OP")
      .map((operation) => ({
        path: operation.path,
        operation: operation.operation,
        before_present: false,
        after_present: false,
      })),
    warnings: path.flatMap((item) => item.warnings),
    conflicts: pathErrors,
    unmigrated_items: [],
    input_unchanged: JSON.stringify(options.input) === inputSnapshot,
    idempotent: true,
    started_at: options.evaluatedAt,
    completed_at: options.evaluatedAt,
    run_id: options.runId,
    schema_version: "1.0.0",
  };
  return { output, report };
}
