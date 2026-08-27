/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * One versioned evidence-linked audience painpoint.
 */
export interface PainpointRecord {
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
}
