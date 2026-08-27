/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CoverAttentionDominanceReport {
  report_id: string;
  project_id: string;
  content_id: string;
  candidate_id: string;
  mode:
    | "TYPE_DOMINANT"
    | "IMAGE_DOMINANT"
    | "TYPE_IMAGE_COLLISION"
    | "CROP_DOMINANT"
    | "COLOR_DOMINANT"
    | "EVIDENCE_DOMINANT"
    | "CONTRAST_DOMINANT"
    | "HYBRID_ATTENTION";
  page_design_intent: "COVER_ENTRY";
  primary_attention: string;
  secondary_attention: string;
  one_second_inspection: string;
  thumbnail_inspection: "ACTUAL_186x248_ONE_SECOND";
  /**
   * @minItems 10
   * @maxItems 10
   */
  dimensions: [
    {
      dimension:
        | "PRIMARY_HOOK_DOMINANCE"
        | "ONE_SECOND_RECOGNITION"
        | "THUMBNAIL_IMPACT"
        | "VISUAL_MASS_HIERARCHY"
        | "INFORMATION_COMPRESSION"
        | "DISTINCTIVE_SILHOUETTE"
        | "SCROLL_STOPPING_CONTRAST"
        | "EDITORIAL_TENSION"
        | "CONTENT_PROMISE_ALIGNMENT"
        | "TARGET_AUDIENCE_SIGNAL";
      score: number;
      maximum: 10;
    },
    {
      dimension:
        | "PRIMARY_HOOK_DOMINANCE"
        | "ONE_SECOND_RECOGNITION"
        | "THUMBNAIL_IMPACT"
        | "VISUAL_MASS_HIERARCHY"
        | "INFORMATION_COMPRESSION"
        | "DISTINCTIVE_SILHOUETTE"
        | "SCROLL_STOPPING_CONTRAST"
        | "EDITORIAL_TENSION"
        | "CONTENT_PROMISE_ALIGNMENT"
        | "TARGET_AUDIENCE_SIGNAL";
      score: number;
      maximum: 10;
    },
    {
      dimension:
        | "PRIMARY_HOOK_DOMINANCE"
        | "ONE_SECOND_RECOGNITION"
        | "THUMBNAIL_IMPACT"
        | "VISUAL_MASS_HIERARCHY"
        | "INFORMATION_COMPRESSION"
        | "DISTINCTIVE_SILHOUETTE"
        | "SCROLL_STOPPING_CONTRAST"
        | "EDITORIAL_TENSION"
        | "CONTENT_PROMISE_ALIGNMENT"
        | "TARGET_AUDIENCE_SIGNAL";
      score: number;
      maximum: 10;
    },
    {
      dimension:
        | "PRIMARY_HOOK_DOMINANCE"
        | "ONE_SECOND_RECOGNITION"
        | "THUMBNAIL_IMPACT"
        | "VISUAL_MASS_HIERARCHY"
        | "INFORMATION_COMPRESSION"
        | "DISTINCTIVE_SILHOUETTE"
        | "SCROLL_STOPPING_CONTRAST"
        | "EDITORIAL_TENSION"
        | "CONTENT_PROMISE_ALIGNMENT"
        | "TARGET_AUDIENCE_SIGNAL";
      score: number;
      maximum: 10;
    },
    {
      dimension:
        | "PRIMARY_HOOK_DOMINANCE"
        | "ONE_SECOND_RECOGNITION"
        | "THUMBNAIL_IMPACT"
        | "VISUAL_MASS_HIERARCHY"
        | "INFORMATION_COMPRESSION"
        | "DISTINCTIVE_SILHOUETTE"
        | "SCROLL_STOPPING_CONTRAST"
        | "EDITORIAL_TENSION"
        | "CONTENT_PROMISE_ALIGNMENT"
        | "TARGET_AUDIENCE_SIGNAL";
      score: number;
      maximum: 10;
    },
    {
      dimension:
        | "PRIMARY_HOOK_DOMINANCE"
        | "ONE_SECOND_RECOGNITION"
        | "THUMBNAIL_IMPACT"
        | "VISUAL_MASS_HIERARCHY"
        | "INFORMATION_COMPRESSION"
        | "DISTINCTIVE_SILHOUETTE"
        | "SCROLL_STOPPING_CONTRAST"
        | "EDITORIAL_TENSION"
        | "CONTENT_PROMISE_ALIGNMENT"
        | "TARGET_AUDIENCE_SIGNAL";
      score: number;
      maximum: 10;
    },
    {
      dimension:
        | "PRIMARY_HOOK_DOMINANCE"
        | "ONE_SECOND_RECOGNITION"
        | "THUMBNAIL_IMPACT"
        | "VISUAL_MASS_HIERARCHY"
        | "INFORMATION_COMPRESSION"
        | "DISTINCTIVE_SILHOUETTE"
        | "SCROLL_STOPPING_CONTRAST"
        | "EDITORIAL_TENSION"
        | "CONTENT_PROMISE_ALIGNMENT"
        | "TARGET_AUDIENCE_SIGNAL";
      score: number;
      maximum: 10;
    },
    {
      dimension:
        | "PRIMARY_HOOK_DOMINANCE"
        | "ONE_SECOND_RECOGNITION"
        | "THUMBNAIL_IMPACT"
        | "VISUAL_MASS_HIERARCHY"
        | "INFORMATION_COMPRESSION"
        | "DISTINCTIVE_SILHOUETTE"
        | "SCROLL_STOPPING_CONTRAST"
        | "EDITORIAL_TENSION"
        | "CONTENT_PROMISE_ALIGNMENT"
        | "TARGET_AUDIENCE_SIGNAL";
      score: number;
      maximum: 10;
    },
    {
      dimension:
        | "PRIMARY_HOOK_DOMINANCE"
        | "ONE_SECOND_RECOGNITION"
        | "THUMBNAIL_IMPACT"
        | "VISUAL_MASS_HIERARCHY"
        | "INFORMATION_COMPRESSION"
        | "DISTINCTIVE_SILHOUETTE"
        | "SCROLL_STOPPING_CONTRAST"
        | "EDITORIAL_TENSION"
        | "CONTENT_PROMISE_ALIGNMENT"
        | "TARGET_AUDIENCE_SIGNAL";
      score: number;
      maximum: 10;
    },
    {
      dimension:
        | "PRIMARY_HOOK_DOMINANCE"
        | "ONE_SECOND_RECOGNITION"
        | "THUMBNAIL_IMPACT"
        | "VISUAL_MASS_HIERARCHY"
        | "INFORMATION_COMPRESSION"
        | "DISTINCTIVE_SILHOUETTE"
        | "SCROLL_STOPPING_CONTRAST"
        | "EDITORIAL_TENSION"
        | "CONTENT_PROMISE_ALIGNMENT"
        | "TARGET_AUDIENCE_SIGNAL";
      score: number;
      maximum: 10;
    },
  ];
  total_score: number;
  threshold: 85;
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
  result: "PASS_PENDING_OPERATOR" | "FAIL" | "BLOCKED";
  operator_selection_required: true;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
