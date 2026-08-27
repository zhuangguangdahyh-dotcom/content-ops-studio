/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Research batch that reports produced evidence-backed and hypothesis counts honestly.
 */
export interface PainpointBatch {
  research_batch_id: string;
  project_id: string;
  requested_count: number;
  produced_count: number;
  evidence_backed_count: number;
  hypothesis_count: number;
  research_scope: string;
  date_range: {
    from: string | null;
    to: string | null;
  };
  region_scope: string[];
  painpoints: {
    painpoint_id: string;
    project_id: string;
    record_unique_key: string;
    painpoint_name: string;
    review_status:
      | "PAINPOINT_PENDING"
      | "PAINPOINT_CONFIRMED"
      | "PAINPOINT_REVISION_REQUIRED"
      | "PAINPOINT_REJECTED"
      | "PAINPOINT_PAUSED";
    business_scenario: string;
    audience_type: string;
    decision_stage:
      | "PROBLEM_AWARENESS"
      | "ACTIVE_SEARCH"
      | "SOLUTION_COMPARISON"
      | "RISK_EVALUATION"
      | "PURCHASE_DECISION"
      | "USAGE_EXPERIENCE"
      | "REPURCHASE_REFERRAL";
    explicit_need: string;
    deep_anxiety: string;
    trigger_events: string[];
    primary_barriers: string[];
    analysis_reason: string;
    commercial_loss_or_real_cost: string;
    content_entry_angles: string[];
    subject_advantages_to_express: string[];
    /**
     * @minItems 1
     */
    evidence_refs: [string, ...string[]];
    evidence_confidence:
      "A_DIRECT_STRONG" | "B_MULTI_SOURCE" | "C_SINGLE_OR_INDIRECT" | "D_HYPOTHESIS";
    painpoint_priority: "CORE" | "IMPORTANT" | "SUPPLEMENTARY";
    promotion_priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    contentization_status:
      | "PAINPOINT_NOT_CONTENTIZED"
      | "PAINPOINT_CONTENT_IN_PROGRESS"
      | "PAINPOINT_CONTENT_AVAILABLE"
      | "PAINPOINT_COVERED"
      | "PAINPOINT_PAUSED";
    related_content_ids: string[];
    finalized_content_count: number;
    latest_content_date: string | null;
    duplication_risk: "LOW" | "MEDIUM" | "HIGH";
    version: number;
    research_batch_id: string;
    schema_version: "1.0.0";
    last_run_id: string;
    created_at: string;
    updated_at: string;
    extensions: {
      [k: string]: unknown;
    };
  }[];
  evidence_records: {
    [k: string]: unknown;
  }[];
  deduplication_summary: string;
  partial_failures: {
    code:
      | "INPUT_MISSING"
      | "PROJECT_NOT_RESOLVED"
      | "PROJECT_NOT_CONFIRMED"
      | "WORKSPACE_NOT_READY"
      | "SCHEMA_MISMATCH"
      | "INVALID_STATE"
      | "LOCKED_FIELD"
      | "CONFLICT_DETECTED"
      | "TOOL_UNAVAILABLE"
      | "PERMISSION_DENIED"
      | "INSUFFICIENT_EVIDENCE"
      | "DUPLICATE_RISK"
      | "UNSUPPORTED_CLAIM"
      | "GENERATION_FAILED"
      | "RENDER_FAILED"
      | "QA_FAILED"
      | "SYNC_PARTIAL"
      | "USER_APPROVAL_REQUIRED"
      | "UNSUPPORTED_REQUEST"
      | "APPROVAL_REQUIRED"
      | "APPROVAL_MISMATCH"
      | "APPROVAL_STALE"
      | "INVARIANT_VIOLATION"
      | "OWNER_SKILL_MISMATCH"
      | "MIGRATION_PATH_MISSING";
    message: string;
    retryable: boolean;
    scope: string;
    recommended_action: string;
    extensions: {
      [k: string]: unknown;
    };
  }[];
  write_summary: string;
  approval_request: {
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
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
  completion_status: "COMPLETE" | "PARTIAL" | "EMPTY_WITH_REASON";
}
