/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualRuleCandidate {
  candidate_id: string;
  project_id: string;
  source_event_id: string;
  rule_statement: string;
  rationale: string;
  scope:
    | "CURRENT_ELEMENT"
    | "CURRENT_PAGE"
    | "CURRENT_SET"
    | "CURRENT_PROJECT"
    | "INDUSTRY_PACK"
    | "GLOBAL_USER_PREFERENCE";
  rule_type: "MUST" | "MUST_NOT" | "PREFER" | "AVOID" | "REFERENCE_POSITIVE" | "REFERENCE_NEGATIVE";
  positive_examples: string[];
  negative_examples: string[];
  allowed_exceptions: string[];
  confirmed_by_user: false;
  status: "CANDIDATE" | "STALE_CANDIDATE" | "REJECTED";
  version: 1;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
