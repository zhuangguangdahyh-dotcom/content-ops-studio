/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface ContentCreationPlan {
  content_creation_plan_id: string;
  project_id: string;
  painpoint_id: string;
  run_id: string;
  operation: "CREATE_NEW" | "CREATE_ALTERNATE" | "REVISE" | "AUDIT_DUPLICATION";
  requested_content_id: string | null;
  project_profile_version: number;
  painpoint_version: number;
  painpoint_review_status: "PAINPOINT_CONFIRMED";
  platform_pack: {
    id: string;
    version: string;
  };
  industry_pack: {
    id: string;
    version: string;
  };
  /**
   * Confirmed compiled runtime snapshot; each item remains an atomic rule.
   */
  project_rule_snapshot: {
    project_id: string;
    rule_snapshot_version: string;
    compiled_at: string;
    source_rule_ids: string[];
    hard_requirements: string[];
    preferences: string[];
    prohibitions: string[];
    corrections: string[];
    workflow_rules: string[];
    compilation_status: "CONFIRMED_SNAPSHOT";
    schema_version: "1.0.0";
    extensions: {
      [k: string]: unknown;
    };
  };
  content_objective:
    | "AWARENESS"
    | "TRUST"
    | "EDUCATION"
    | "LEAD_GENERATION"
    | "CONSULTATION"
    | "CONVERSION"
    | "RETENTION";
  target_audience_segment: string;
  target_decision_stage: string;
  single_core_problem: string;
  /**
   * @minItems 1
   */
  desired_value_types: [
    (
      | "EMOTIONAL_VALUE"
      | "MONEY_VALUE"
      | "TIME_VALUE"
      | "RISK_REDUCTION"
      | "DECISION_VALUE"
      | "PROFESSIONAL_INSIGHT"
    ),
    ...(
      | "EMOTIONAL_VALUE"
      | "MONEY_VALUE"
      | "TIME_VALUE"
      | "RISK_REDUCTION"
      | "DECISION_VALUE"
      | "PROFESSIONAL_INSIGHT"
    )[],
  ];
  requested_page_count: number | null;
  resolved_page_count: number;
  angle_strategy: string;
  structure_strategy: string;
  evidence_strategy: string;
  claim_strategy: string;
  duplication_strategy: string;
  cta_strategy: string;
  historical_content_scope: string[];
  /**
   * @minItems 1
   */
  constraints: [string, ...string[]];
  user_overrides: string[];
  /**
   * @minItems 1
   */
  expected_artifacts: [string, ...string[]];
  /**
   * @minItems 1
   */
  capability_requirements: [string, ...string[]];
  plan_hash: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
