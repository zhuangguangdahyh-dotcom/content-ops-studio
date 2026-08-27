/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface FeishuReconciliationReport {
  report_id: string;
  project_id: string;
  expected_blueprint: {
    [k: string]: unknown;
  };
  remote_snapshot: {
    [k: string]: unknown;
  };
  matching_tables: string[];
  missing_tables: string[];
  extra_tables: string[];
  conflicting_tables: string[];
  matching_fields: string[];
  missing_fields: string[];
  renamed_fields: string[];
  type_conflicts: string[];
  extra_fields: string[];
  matching_views: string[];
  missing_views: string[];
  view_conflicts: string[];
  relation_conflicts: string[];
  record_conflicts: string[];
  orphan_candidates: string[];
  safe_repairs: string[];
  manual_decisions_required: string[];
  overall_status:
    "MATCH" | "REPAIR_AVAILABLE" | "BLOCKED" | "ORPHAN_CANDIDATE" | "DUPLICATE_CANDIDATES";
  checked_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
