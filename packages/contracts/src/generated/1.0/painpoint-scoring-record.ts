/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Deterministic weighted scoring and priority classification for one candidate.
 */
export type PainpointScoringRecord = {
  [k: string]: unknown;
} & {
  scoring_id: string;
  painpoint_candidate_id: string;
  audience_relevance: number;
  frequency: number;
  urgency: number;
  decision_impact: number;
  real_cost: number;
  subject_advantage_fit: number;
  evidence_strength: number;
  content_potential: number;
  promotion_fit: number;
  weights: {
    audience_relevance: 15;
    frequency: 10;
    urgency: 10;
    decision_impact: 15;
    real_cost: 10;
    subject_advantage_fit: 10;
    evidence_strength: 15;
    content_potential: 10;
    promotion_fit: 5;
  };
  weighted_score: number;
  evidence_confidence:
    "A_DIRECT_STRONG" | "B_MULTI_SOURCE" | "C_SINGLE_OR_INDIRECT" | "D_HYPOTHESIS";
  painpoint_priority: "CORE" | "IMPORTANT" | "SUPPLEMENTARY";
  promotion_priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  /**
   * @minItems 1
   */
  score_explanations: [string, ...string[]];
  score_limitations: string[];
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
};
