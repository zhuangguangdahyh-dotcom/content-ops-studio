/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface ImageQualityReport {
  report_id: string;
  project_id: string;
  content_id: string;
  asset_id: string;
  asset_role: "DIRECTION_CANDIDATE" | "FORMAL_FIRST_PAGE" | "FORMAL_INNER_PAGE";
  layers: {
    authenticity_and_integrity: "PASS" | "FAIL" | "BLOCKED";
    mechanical: "PASS" | "FAIL" | "BLOCKED";
    visual: "PASS" | "FAIL" | "BLOCKED";
    mode_and_project_fit: "PASS" | "FAIL" | "BLOCKED";
    operator_aesthetic: "PENDING" | "APPROVED" | "REVISE" | "REJECTED";
  };
  /**
   * @minItems 8
   * @maxItems 8
   */
  dimensions: [
    {
      dimension:
        | "CONTENT_SEMANTIC_FIT"
        | "COMPOSITION_FOCUS"
        | "HIERARCHY_READABILITY"
        | "ASSET_QUALITY_INTEGRITY"
        | "PROJECT_AUDIENCE_FIT"
        | "UNIQUENESS_ANTI_TEMPLATE"
        | "VISUAL_MODE_EXECUTION"
        | "PLATFORM_MOBILE_PERFORMANCE";
      weight: number;
      rating: number;
      weighted_score: number;
    },
    {
      dimension:
        | "CONTENT_SEMANTIC_FIT"
        | "COMPOSITION_FOCUS"
        | "HIERARCHY_READABILITY"
        | "ASSET_QUALITY_INTEGRITY"
        | "PROJECT_AUDIENCE_FIT"
        | "UNIQUENESS_ANTI_TEMPLATE"
        | "VISUAL_MODE_EXECUTION"
        | "PLATFORM_MOBILE_PERFORMANCE";
      weight: number;
      rating: number;
      weighted_score: number;
    },
    {
      dimension:
        | "CONTENT_SEMANTIC_FIT"
        | "COMPOSITION_FOCUS"
        | "HIERARCHY_READABILITY"
        | "ASSET_QUALITY_INTEGRITY"
        | "PROJECT_AUDIENCE_FIT"
        | "UNIQUENESS_ANTI_TEMPLATE"
        | "VISUAL_MODE_EXECUTION"
        | "PLATFORM_MOBILE_PERFORMANCE";
      weight: number;
      rating: number;
      weighted_score: number;
    },
    {
      dimension:
        | "CONTENT_SEMANTIC_FIT"
        | "COMPOSITION_FOCUS"
        | "HIERARCHY_READABILITY"
        | "ASSET_QUALITY_INTEGRITY"
        | "PROJECT_AUDIENCE_FIT"
        | "UNIQUENESS_ANTI_TEMPLATE"
        | "VISUAL_MODE_EXECUTION"
        | "PLATFORM_MOBILE_PERFORMANCE";
      weight: number;
      rating: number;
      weighted_score: number;
    },
    {
      dimension:
        | "CONTENT_SEMANTIC_FIT"
        | "COMPOSITION_FOCUS"
        | "HIERARCHY_READABILITY"
        | "ASSET_QUALITY_INTEGRITY"
        | "PROJECT_AUDIENCE_FIT"
        | "UNIQUENESS_ANTI_TEMPLATE"
        | "VISUAL_MODE_EXECUTION"
        | "PLATFORM_MOBILE_PERFORMANCE";
      weight: number;
      rating: number;
      weighted_score: number;
    },
    {
      dimension:
        | "CONTENT_SEMANTIC_FIT"
        | "COMPOSITION_FOCUS"
        | "HIERARCHY_READABILITY"
        | "ASSET_QUALITY_INTEGRITY"
        | "PROJECT_AUDIENCE_FIT"
        | "UNIQUENESS_ANTI_TEMPLATE"
        | "VISUAL_MODE_EXECUTION"
        | "PLATFORM_MOBILE_PERFORMANCE";
      weight: number;
      rating: number;
      weighted_score: number;
    },
    {
      dimension:
        | "CONTENT_SEMANTIC_FIT"
        | "COMPOSITION_FOCUS"
        | "HIERARCHY_READABILITY"
        | "ASSET_QUALITY_INTEGRITY"
        | "PROJECT_AUDIENCE_FIT"
        | "UNIQUENESS_ANTI_TEMPLATE"
        | "VISUAL_MODE_EXECUTION"
        | "PLATFORM_MOBILE_PERFORMANCE";
      weight: number;
      rating: number;
      weighted_score: number;
    },
    {
      dimension:
        | "CONTENT_SEMANTIC_FIT"
        | "COMPOSITION_FOCUS"
        | "HIERARCHY_READABILITY"
        | "ASSET_QUALITY_INTEGRITY"
        | "PROJECT_AUDIENCE_FIT"
        | "UNIQUENESS_ANTI_TEMPLATE"
        | "VISUAL_MODE_EXECUTION"
        | "PLATFORM_MOBILE_PERFORMANCE";
      weight: number;
      rating: number;
      weighted_score: number;
    },
  ];
  total_score: number;
  threshold: number;
  hard_blocks: string[];
  core_dimension_floor_met: boolean;
  operator_approval_required: true;
  result: "PASS_PENDING_OPERATOR" | "FAIL" | "BLOCKED";
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
