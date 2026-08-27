/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualPlanningQualityReport {
  visual_quality_report_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  /**
   * @minItems 18
   */
  hard_checks: [
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    {
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    },
    ...{
      check_code: string;
      status: "PASS" | "WARNING" | "FAIL";
      blocking: boolean;
      details: string;
    }[],
  ];
  /**
   * @minItems 8
   * @maxItems 8
   */
  dimension_scores: [
    {
      dimension:
        | "CONTENT_FIDELITY"
        | "VISUAL_MODE_FIT"
        | "GROUP_CONSISTENCY"
        | "PAGE_SPECIFIC_RELEVANCE"
        | "READABILITY_FEASIBILITY"
        | "ASSET_FEASIBILITY"
        | "PROJECT_FIT"
        | "PLATFORM_FIT";
      score: number;
      weight: number;
      rationale: string;
    },
    {
      dimension:
        | "CONTENT_FIDELITY"
        | "VISUAL_MODE_FIT"
        | "GROUP_CONSISTENCY"
        | "PAGE_SPECIFIC_RELEVANCE"
        | "READABILITY_FEASIBILITY"
        | "ASSET_FEASIBILITY"
        | "PROJECT_FIT"
        | "PLATFORM_FIT";
      score: number;
      weight: number;
      rationale: string;
    },
    {
      dimension:
        | "CONTENT_FIDELITY"
        | "VISUAL_MODE_FIT"
        | "GROUP_CONSISTENCY"
        | "PAGE_SPECIFIC_RELEVANCE"
        | "READABILITY_FEASIBILITY"
        | "ASSET_FEASIBILITY"
        | "PROJECT_FIT"
        | "PLATFORM_FIT";
      score: number;
      weight: number;
      rationale: string;
    },
    {
      dimension:
        | "CONTENT_FIDELITY"
        | "VISUAL_MODE_FIT"
        | "GROUP_CONSISTENCY"
        | "PAGE_SPECIFIC_RELEVANCE"
        | "READABILITY_FEASIBILITY"
        | "ASSET_FEASIBILITY"
        | "PROJECT_FIT"
        | "PLATFORM_FIT";
      score: number;
      weight: number;
      rationale: string;
    },
    {
      dimension:
        | "CONTENT_FIDELITY"
        | "VISUAL_MODE_FIT"
        | "GROUP_CONSISTENCY"
        | "PAGE_SPECIFIC_RELEVANCE"
        | "READABILITY_FEASIBILITY"
        | "ASSET_FEASIBILITY"
        | "PROJECT_FIT"
        | "PLATFORM_FIT";
      score: number;
      weight: number;
      rationale: string;
    },
    {
      dimension:
        | "CONTENT_FIDELITY"
        | "VISUAL_MODE_FIT"
        | "GROUP_CONSISTENCY"
        | "PAGE_SPECIFIC_RELEVANCE"
        | "READABILITY_FEASIBILITY"
        | "ASSET_FEASIBILITY"
        | "PROJECT_FIT"
        | "PLATFORM_FIT";
      score: number;
      weight: number;
      rationale: string;
    },
    {
      dimension:
        | "CONTENT_FIDELITY"
        | "VISUAL_MODE_FIT"
        | "GROUP_CONSISTENCY"
        | "PAGE_SPECIFIC_RELEVANCE"
        | "READABILITY_FEASIBILITY"
        | "ASSET_FEASIBILITY"
        | "PROJECT_FIT"
        | "PLATFORM_FIT";
      score: number;
      weight: number;
      rationale: string;
    },
    {
      dimension:
        | "CONTENT_FIDELITY"
        | "VISUAL_MODE_FIT"
        | "GROUP_CONSISTENCY"
        | "PAGE_SPECIFIC_RELEVANCE"
        | "READABILITY_FEASIBILITY"
        | "ASSET_FEASIBILITY"
        | "PROJECT_FIT"
        | "PLATFORM_FIT";
      score: number;
      weight: number;
      rationale: string;
    },
  ];
  weighted_score: number;
  blocking_failure_count: number;
  warning_count: number;
  passed_count: number;
  ready_for_first_page: boolean;
  limitations: string[];
  recommended_changes: string[];
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
