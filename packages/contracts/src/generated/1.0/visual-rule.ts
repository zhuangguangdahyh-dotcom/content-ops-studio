/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualRule {
  rule_id: string;
  project_id: string | null;
  source_event_id: string;
  source_candidate_id: string | null;
  global_preference_version?: string | null;
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
  confirmed_by_user: true;
  status: "ACTIVE" | "SUPERSEDED" | "DISABLED" | "FORGOTTEN";
  version: number;
  supersedes_version: number | null;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
  updated_at: string;
}
