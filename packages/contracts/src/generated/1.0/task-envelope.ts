/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Versioned resumable input passed from Router to a specialist Skill.
 */
export interface TaskEnvelope {
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
}
