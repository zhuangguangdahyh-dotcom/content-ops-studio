/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Atomic recovery cache bound to the verified Journal head.
 */
export interface RunCheckpoint {
  checkpoint_id: string;
  run_id: string;
  project_id: string;
  workflow_id: string;
  workflow_version: string;
  journal_head_sequence: number;
  journal_head_hash: string;
  current_step_id: string | null;
  run_status:
    | "RUN_CREATED"
    | "RUN_PREFLIGHT"
    | "RUNNING"
    | "AWAITING_APPROVAL"
    | "RUN_PARTIAL"
    | "RUN_BLOCKED"
    | "RUN_CONFLICT"
    | "RUN_FAILED"
    | "RUN_CANCELLED"
    | "RUN_SUCCEEDED"
    | "RUN_RESUMING";
  completed_steps: string[];
  failed_steps: string[];
  pending_approval: {
    [k: string]: unknown;
  } | null;
  artifact_index: {
    [k: string]: string;
  };
  write_log_head: {
    entry_count: number;
    last_write_id: string | null;
  };
  idempotency_snapshot: {
    [k: string]: string;
  };
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
