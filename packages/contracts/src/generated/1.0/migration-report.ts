/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Dry-run or applied migration outcome without destructive mutation.
 */
export interface MigrationReport {
  migration_id: string;
  from_version: string;
  to_version: string;
  status: "PLANNED" | "NO_OP" | "APPLIED" | "BLOCKED" | "CONFLICT";
  dry_run: boolean;
  changes: {
    path: string;
    operation: string;
    before_present: boolean;
    after_present: boolean;
  }[];
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
