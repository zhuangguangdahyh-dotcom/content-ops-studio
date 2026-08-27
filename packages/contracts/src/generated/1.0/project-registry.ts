/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Local non-secret project registry entry.
 */
export interface ProjectRegistry {
  project_id: string;
  display_name: string;
  subject_name: string;
  project_root: string;
  project_status:
    | "PROJECT_INITIALIZING"
    | "PROJECT_PENDING_CONFIRMATION"
    | "PROJECT_ACTIVE"
    | "PROJECT_PAUSED"
    | "PROJECT_ARCHIVED";
  last_active_at: string;
  schema_version: "1.0.0";
  connection_status: "NOT_CONFIGURED" | "UNVERIFIED" | "VERIFIED" | "FAILED";
  latest_run_id: string | null;
  created_at: string;
  updated_at: string;
}
