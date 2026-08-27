/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface PainpointSceneCongruenceReport {
  report_id: string;
  project_id: string;
  content_id: string;
  candidate_id: string;
  conversion_strategy:
    | "TARGET_AUDIENCE_FIRST"
    | "PAINPOINT_FIRST"
    | "VALUE_FIRST"
    | "RISK_FIRST"
    | "DECISION_FIRST"
    | "RESULT_FIRST"
    | "CONTRAST_FIRST"
    | "QUESTION_FIRST";
  relation:
    | "DIRECTLY_SUPPORTS_PAINPOINT"
    | "DIRECTLY_SUPPORTS_VALUE"
    | "SUPPORTS_CONTRAST"
    | "NEUTRAL_CATEGORY_RELEVANCE"
    | "CONTRADICTS_PAINPOINT"
    | "DECORATIVE_ONLY";
  painpoint_statement: string;
  /**
   * @minItems 1
   */
  visible_scene_evidence: [string, ...string[]];
  diagnostic_markers: {
    marker: string;
    target_region: string;
    evidence_meaning: string;
    explained: true;
  }[];
  /**
   * @minItems 4
   * @maxItems 4
   */
  dimensions: [
    {
      dimension:
        | "VISIBLE_PAINPOINT_EVIDENCE"
        | "COPY_SCENE_RELATION"
        | "BUSINESS_SCENE_RECOGNITION"
        | "CONTRAST_OR_DIAGNOSTIC_VALIDITY";
      weight: 20 | 25 | 30;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "VISIBLE_PAINPOINT_EVIDENCE"
        | "COPY_SCENE_RELATION"
        | "BUSINESS_SCENE_RECOGNITION"
        | "CONTRAST_OR_DIAGNOSTIC_VALIDITY";
      weight: 20 | 25 | 30;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "VISIBLE_PAINPOINT_EVIDENCE"
        | "COPY_SCENE_RELATION"
        | "BUSINESS_SCENE_RECOGNITION"
        | "CONTRAST_OR_DIAGNOSTIC_VALIDITY";
      weight: 20 | 25 | 30;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "VISIBLE_PAINPOINT_EVIDENCE"
        | "COPY_SCENE_RELATION"
        | "BUSINESS_SCENE_RECOGNITION"
        | "CONTRAST_OR_DIAGNOSTIC_VALIDITY";
      weight: 20 | 25 | 30;
      score: number;
      reason: string;
    },
  ];
  total_score: number;
  threshold: 85;
  hard_blocks: string[];
  result: "PASS_PENDING_OPERATOR" | "FAIL" | "BLOCKED";
  operator_approval_required: true;
  run_id: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
