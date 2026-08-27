/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface LocaleSceneFitReport {
  report_id: string;
  project_id: string;
  content_id: string;
  candidate_id: string;
  audience_locale: string;
  project_region: string | null;
  resolved_scene_locale: string;
  /**
   * @minItems 2
   */
  locale_evidence: [string, string, ...string[]];
  region_question_required: boolean;
  total_score: number;
  threshold: 80;
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
