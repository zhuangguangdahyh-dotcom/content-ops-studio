/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Deterministic versioned workflow DAG with handlers, gates, capabilities, and recovery policy.
 */
export interface WorkflowDefinition {
  workflow_id: string;
  workflow_version: string;
  display_name: string;
  description: string;
  /**
   * @minItems 1
   */
  supported_runtime_modes: [
    "MOCK" | "DRY_RUN" | "PRODUCTION",
    ...("MOCK" | "DRY_RUN" | "PRODUCTION")[],
  ];
  /**
   * @minItems 1
   */
  task_types: [string, ...string[]];
  input_schema_id: string;
  output_schema_id: string;
  /**
   * @minItems 1
   */
  steps: [
    {
      step_id: string;
      sequence: number;
      owner_skill:
        | "content-studio-router"
        | "project-initialization"
        | "painpoint-research"
        | "content-creation"
        | "visual-planning"
        | "image-set-production"
        | "content-finalization"
        | "project-learning";
      handler: string;
      depends_on: string[];
      required_capabilities: string[];
      input_artifacts: string[];
      output_artifacts: string[];
      state_transition: string | null;
      idempotency_scope: "RUN" | "PROJECT" | "STEP" | "APPROVAL" | "RESULT";
      retry_policy: {
        max_attempts: number;
        retry_failed_only: true;
      };
      checkpoint_after: boolean;
      approval_gate:
        ("PROJECT_PROFILE" | "PAINPOINTS" | "CONTENT_COPY" | "FIRST_PAGE" | "FINAL_SET") | null;
      failure_policy: "BLOCK" | "FAIL" | "AWAIT_APPROVAL" | "RETRY";
    },
    ...{
      step_id: string;
      sequence: number;
      owner_skill:
        | "content-studio-router"
        | "project-initialization"
        | "painpoint-research"
        | "content-creation"
        | "visual-planning"
        | "image-set-production"
        | "content-finalization"
        | "project-learning";
      handler: string;
      depends_on: string[];
      required_capabilities: string[];
      input_artifacts: string[];
      output_artifacts: string[];
      state_transition: string | null;
      idempotency_scope: "RUN" | "PROJECT" | "STEP" | "APPROVAL" | "RESULT";
      retry_policy: {
        max_attempts: number;
        retry_failed_only: true;
      };
      checkpoint_after: boolean;
      approval_gate:
        ("PROJECT_PROFILE" | "PAINPOINTS" | "CONTENT_COPY" | "FIRST_PAGE" | "FINAL_SET") | null;
      failure_policy: "BLOCK" | "FAIL" | "AWAIT_APPROVAL" | "RETRY";
    }[],
  ];
  approval_gates: (
    "PROJECT_PROFILE" | "PAINPOINTS" | "CONTENT_COPY" | "FIRST_PAGE" | "FINAL_SET"
  )[];
  capability_requirements: string[];
  /**
   * @minItems 1
   */
  terminal_conditions: [string, ...string[]];
  recovery_policy: {
    resume_verified_steps: false;
    retry_failed_steps: true;
    block_on_journal_corruption: true;
  };
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
