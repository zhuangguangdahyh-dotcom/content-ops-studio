/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Run-bound plan for evidence-backed painpoint research.
 */
export interface PainpointResearchPlan {
  research_plan_id: string;
  project_id: string;
  run_id: string;
  project_profile_version: number;
  platform_pack: {
    id: string;
    version: string;
  };
  industry_pack: {
    id: string;
    version: string;
  };
  requested_count: number;
  minimum_acceptable_count: number;
  allow_hypothesis_candidates: boolean;
  research_objective: string;
  /**
   * @minItems 1
   */
  audience_segments: [string, ...string[]];
  /**
   * @minItems 1
   */
  decision_stages: [
    (
      | "PROBLEM_AWARENESS"
      | "ACTIVE_SEARCH"
      | "SOLUTION_COMPARISON"
      | "RISK_EVALUATION"
      | "PURCHASE_DECISION"
      | "USAGE_EXPERIENCE"
      | "REPURCHASE_REFERRAL"
    ),
    ...(
      | "PROBLEM_AWARENESS"
      | "ACTIVE_SEARCH"
      | "SOLUTION_COMPARISON"
      | "RISK_EVALUATION"
      | "PURCHASE_DECISION"
      | "USAGE_EXPERIENCE"
      | "REPURCHASE_REFERRAL"
    )[],
  ];
  /**
   * @minItems 1
   */
  business_scenarios: [string, ...string[]];
  /**
   * @minItems 1
   */
  region_scope: [string, ...string[]];
  date_scope: {
    from: string | null;
    to: string | null;
  };
  /**
   * @minItems 1
   */
  language_scope: [string, ...string[]];
  /**
   * @minItems 1
   */
  source_strategy: [string, ...string[]];
  /**
   * @minItems 1
   */
  query_plan: [
    {
      query_id: string;
      query: string;
      purpose: string;
      /**
       * @minItems 1
       */
      source_types: [string, ...string[]];
    },
    ...{
      query_id: string;
      query: string;
      purpose: string;
      /**
       * @minItems 1
       */
      source_types: [string, ...string[]];
    }[],
  ];
  user_material_refs: string[];
  required_source_mix: {
    minimum_sources: number;
    minimum_source_types: number;
    require_official_or_first_party: boolean;
  };
  /**
   * @minItems 1
   */
  evidence_requirements: [string, ...string[]];
  /**
   * @minItems 1
   */
  deduplication_policy: [string, ...string[]];
  scoring_policy: {
    policy_id: string;
    policy_version: string;
    core_threshold: number;
    important_threshold: number;
  };
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
