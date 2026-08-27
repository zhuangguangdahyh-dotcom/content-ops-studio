/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Non-destructive migration definition.
 */
export interface SchemaMigration {
  migration_id: string;
  from_version: string;
  to_version: string;
  classification: "PATCH" | "MINOR" | "MAJOR" | "POTENTIALLY_BREAKING";
  description: string;
  operations: {
    operation: "NO_OP" | "ADD_OPTIONAL_FIELD" | "COPY_FIELD" | "RENAME_FIELD" | "TRANSFORM_VALUE";
    path: string;
    target_path: string | null;
    details: string;
  }[];
  warnings: string[];
  preserves_history: true;
  default_dry_run: true;
  schema_version: "1.0.0";
}
