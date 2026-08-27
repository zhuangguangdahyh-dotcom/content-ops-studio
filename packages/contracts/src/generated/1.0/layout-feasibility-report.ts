/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface LayoutFeasibilityReport {
  layout_feasibility_report_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  /**
   * @minItems 1
   */
  page_results: [
    {
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      headline_codepoints: number;
      body_codepoints: number;
      supporting_codepoints: number;
      total_codepoints: number;
      estimated_density: "LOW" | "MEDIUM" | "HIGH" | "EXCESSIVE";
      estimated_line_count: number;
      available_text_regions: number;
      /**
       * @minItems 1
       */
      typography_token_refs: [string, ...string[]];
      safe_area_fit: boolean;
      max_lines_fit: boolean;
      hierarchy_fit: boolean;
      contrast_feasibility: boolean;
      overflow_strategy:
        | "REFLOW"
        | "CHANGE_LAYOUT"
        | "MOVE_SUPPORTING_TEXT"
        | "REDUCE_DECORATION"
        | "CONTENT_REVISION_REQUIRED"
        | "BLOCK_AND_RETURN";
      status: "PASS" | "WARNING" | "BLOCKED";
      warnings: string[];
      blocking_reason: string | null;
    },
    ...{
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      headline_codepoints: number;
      body_codepoints: number;
      supporting_codepoints: number;
      total_codepoints: number;
      estimated_density: "LOW" | "MEDIUM" | "HIGH" | "EXCESSIVE";
      estimated_line_count: number;
      available_text_regions: number;
      /**
       * @minItems 1
       */
      typography_token_refs: [string, ...string[]];
      safe_area_fit: boolean;
      max_lines_fit: boolean;
      hierarchy_fit: boolean;
      contrast_feasibility: boolean;
      overflow_strategy:
        | "REFLOW"
        | "CHANGE_LAYOUT"
        | "MOVE_SUPPORTING_TEXT"
        | "REDUCE_DECORATION"
        | "CONTENT_REVISION_REQUIRED"
        | "BLOCK_AND_RETURN";
      status: "PASS" | "WARNING" | "BLOCKED";
      warnings: string[];
      blocking_reason: string | null;
    }[],
  ];
  total_pages: number;
  pass_count: number;
  warning_count: number;
  blocked_count: number;
  overall_status: "PASS" | "WARNING" | "BLOCKED";
  copy_revision_required: boolean;
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
