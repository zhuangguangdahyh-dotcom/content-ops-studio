/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualMassHierarchyReport {
  report_id: string;
  candidate_id: string;
  page_design_intent:
    | "COVER_ENTRY"
    | "CONTENT_EDITORIAL"
    | "EVIDENCE_PAGE"
    | "DIAGNOSTIC_PAGE"
    | "SUMMARY_PAGE"
    | "CTA_PAGE";
  primary: {
    id: string;
    mass_score: number;
  };
  secondary: {
    id: string;
    mass_score: number;
  };
  tertiary: {
    id: string;
    mass_score: number;
  };
  clear_primary: boolean;
  hard_blocks: (
    | "COVER_ATTENTION_DOMINANCE_BLOCKED"
    | "PRIMARY_HOOK_TOO_WEAK"
    | "MULTIPLE_PRIMARY_FOCI"
    | "ONE_SECOND_RECOGNITION_FAILED"
    | "THUMBNAIL_IMPACT_WEAK"
    | "VISUAL_MASS_HIERARCHY_WEAK"
    | "COVER_INFORMATION_OVERLOADED"
    | "COVER_SILHOUETTE_GENERIC"
    | "SCROLL_STOPPING_CONTRAST_WEAK"
    | "EDITORIAL_TENSION_WEAK"
    | "COLOR_RESCUES_WEAK_STRUCTURE"
    | "COLOR_HIERARCHY_CONFLICT"
    | "COVER_INNER_PAGE_UNDIFFERENTIATED"
  )[];
  result: "PASS" | "BLOCKED";
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
