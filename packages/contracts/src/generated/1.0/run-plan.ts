/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Immutable workflow binding and mutable deterministic execution cursor for one run.
 */
export interface RunPlan {
  run_id: string;
  project_id: string;
  workflow_id: string;
  workflow_version: string;
  /**
   * Versioned resumable input passed from Router to a specialist Skill.
   */
  task_envelope: {
    contract_version: "1.0.0";
    schema_version: "1.0.0";
    run_id: string;
    project_id: string;
    task_type: string;
    operation: string;
    source: "conversation" | "resume" | "system" | "mock";
    raw_instruction: string;
    targets: {
      painpoint_ids: string[];
      content_ids: string[];
      page_numbers: number[];
    };
    overrides: {
      [k: string]: unknown;
    };
    approval_event: {
      approval_id: string;
      gate: "PROJECT_PROFILE" | "PAINPOINTS" | "CONTENT_COPY" | "FIRST_PAGE" | "FINAL_SET";
      target_type:
        | "PROJECT"
        | "PAINPOINT_BATCH"
        | "CONTENT"
        | "CONTENT_PACKAGE"
        | "FIRST_PAGE_ASSET"
        | "IMAGE_SET";
      target_id: string;
      target_version: string;
      decision: "APPROVE" | "REVISE" | "REJECT" | "PAUSE";
      comment: string;
      source_run_id: string;
      created_at: string;
      deprecated_at?: string | null;
      schema_version: "1.0.0";
    } | null;
    resume: {
      from_run_id: string | null;
      from_step: string | null;
    };
    dry_run: boolean;
  };
  runtime_mode: "MOCK" | "DRY_RUN" | "PRODUCTION";
  project_snapshot_id: string;
  pack_resolution_id: string;
  /**
   * @minItems 1
   */
  steps: [
    {
      step_id: string;
      sequence: number;
      status:
        | "PENDING"
        | "RUNNING"
        | "COMPLETED"
        | "FAILED"
        | "SKIPPED"
        | "INVALIDATED"
        | "AWAITING_APPROVAL";
      attempts: number;
    },
    ...{
      step_id: string;
      sequence: number;
      status:
        | "PENDING"
        | "RUNNING"
        | "COMPLETED"
        | "FAILED"
        | "SKIPPED"
        | "INVALIDATED"
        | "AWAITING_APPROVAL";
      attempts: number;
    }[],
  ];
  current_step_id: string | null;
  completed_step_ids: string[];
  failed_step_ids: string[];
  skipped_step_ids: string[];
  pending_approval: {
    gate: "PROJECT_PROFILE" | "PAINPOINTS" | "CONTENT_COPY" | "FIRST_PAGE" | "FINAL_SET";
    target_type: string;
    target_id: string;
    target_version: string;
  } | null;
  capability_report: {
    capability: string;
    status: "AVAILABLE" | "MOCK_ONLY" | "NOT_IMPLEMENTED" | "UNAVAILABLE" | "BLOCKED" | "UNKNOWN";
  }[];
  idempotency_key: string;
  parent_run_id: string | null;
  resume_from_run_id: string | null;
  plan_status:
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
  created_at: string;
  updated_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
