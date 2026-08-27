/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Auditable project write-lock state without raw device identity.
 */
export interface ProjectLock {
  lock_id: string;
  project_id: string;
  run_id: string;
  owner_process_id: string;
  owner_host_label: string;
  acquired_at: string;
  expires_at: string;
  last_heartbeat_at: string;
  lock_version: number;
  status: "LOCK_ACTIVE" | "LOCK_RELEASED" | "LOCK_STALE" | "LOCK_RECOVERED";
  recovery_reason: string | null;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
