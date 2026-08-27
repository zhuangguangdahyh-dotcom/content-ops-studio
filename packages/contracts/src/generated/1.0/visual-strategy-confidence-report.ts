/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualStrategyConfidenceReport {
  report_id: string;
  strategy_plan_id: string;
  overall_confidence: number;
  confidence_level: "LOW" | "MEDIUM" | "HIGH";
  /**
   * @minItems 1
   */
  dimensions: [
    {
      dimension: string;
      score: number;
      reason: string;
    },
    ...{
      dimension: string;
      score: number;
      reason: string;
    }[],
  ];
  source_coverage: {
    required_source_count: number;
    available_source_count: number;
    missing_sources: string[];
  };
  review_required: boolean;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
