/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface ContentDuplicationReport {
  duplication_report_id: string;
  project_id: string;
  painpoint_id: string;
  candidate_content_id: string;
  exact_fingerprint: string;
  exact_matches: string[];
  same_painpoint_matches: string[];
  recent_project_matches: string[];
  near_semantic_assessments: {
    content_id: string;
    similarities: string[];
    differences: string[];
    worth_continuing: boolean;
    rationale: string;
    alternative_angle: string | null;
  }[];
  title_overlap: number;
  hook_overlap: number;
  structure_overlap: number;
  viewpoint_overlap: number;
  conclusion_overlap: number;
  overall_risk: "LOW" | "MEDIUM" | "HIGH";
  blocking: boolean;
  recommended_alternatives: string[];
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
