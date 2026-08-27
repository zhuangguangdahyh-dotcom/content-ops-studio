/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface TypographyAsFormReport {
  report_id: string;
  candidate_id: string;
  line_break_shape: number;
  text_block_shape: number;
  edge_relation: number;
  scale_relation: number;
  vertical_rhythm: number;
  mass_distribution: number;
  total_score: number;
  threshold: 85;
  spatial_integrity_bypass: false;
  result: "PASS" | "FAIL";
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
