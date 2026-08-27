/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * One atomic confirmed or candidate rule derived from Operator feedback.
 */
export interface FeedbackRecord {
  rule_id: string;
  project_id: string;
  record_unique_key: string;
  entry_title: string;
  entry_type:
    | "USER_FEEDBACK"
    | "PROJECT_LONG_TERM_RULE"
    | "PROJECT_PROHIBITION"
    | "INDUSTRY_RULE_CANDIDATE"
    | "PLATFORM_RULE_CANDIDATE"
    | "PLUGIN_CORE_RULE_CANDIDATE";
  rule_nature: "PREFERENCE" | "HARD_REQUIREMENT" | "PROHIBITION" | "CORRECTION" | "WORKFLOW_RULE";
  original_user_wording: string;
  structured_atomic_rule: string;
  /**
   * @minItems 1
   */
  applicable_modules: [string, ...string[]];
  effective_scope:
    | "THIS_TASK"
    | "CURRENT_PROJECT"
    | "INDUSTRY_PACK_CANDIDATE"
    | "PLATFORM_PACK_CANDIDATE"
    | "PLUGIN_CORE_CANDIDATE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confirmation_status:
    | "RULE_UNCLASSIFIED"
    | "RULE_PENDING_APPROVAL"
    | "RULE_ACTIVE"
    | "RULE_REJECTED"
    | "RULE_DEPRECATED";
  long_term_effective: boolean;
  related_painpoint_ids: string[];
  related_content_ids: string[];
  effective_version: string;
  effective_date: string;
  expiry_date: string | null;
  replaces_rule_ids: string[];
  handling_notes: string;
  source_run_id: string;
  schema_version: "1.0.0";
  created_at: string;
  updated_at: string;
  extensions: {
    [k: string]: unknown;
  };
}
