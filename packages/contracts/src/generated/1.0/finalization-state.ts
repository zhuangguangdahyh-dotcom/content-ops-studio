/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Evidence-backed current Final Set state with independent Workspace synchronization state.
 */
export interface FinalizationState {
  project_id: string;
  content_id: string;
  final_manifest_id: string | null;
  final_set_fingerprint: string | null;
  status:
    "NOT_ELIGIBLE" | "ELIGIBLE" | "FINALIZING" | "FINALIZED" | "FINALIZATION_FAILED" | "SUPERSEDED";
  current: boolean;
  evidence_refs: string[];
  sync_status:
    | "SYNC_NOT_STARTED"
    | "SYNC_IN_PROGRESS"
    | "SYNC_COMPLETED"
    | "SYNC_PARTIAL"
    | "SYNC_FAILED"
    | "PENDING_RETRY";
  updated_at: string;
  run_id: string;
  schema_version: "1.0.0";
}
