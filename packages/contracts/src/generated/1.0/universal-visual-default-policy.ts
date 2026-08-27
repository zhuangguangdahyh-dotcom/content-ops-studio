/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface UniversalVisualDefaultPolicy {
  policy_id: "UNIVERSAL-VISUAL-DEFAULT";
  policy_version: "UVDPV-1";
  fallback_only: true;
  /**
   * @minItems 9
   */
  decision_precedence: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    ...string[],
  ];
  /**
   * @minItems 6
   */
  cold_start_conditions: [string, string, string, string, string, string, ...string[]];
  typography_policy_ref: string;
  /**
   * @minItems 10
   */
  composition_families: [
    (
      | "FULL_BLEED_ANCHORED"
      | "ASYMMETRIC_NEGATIVE_SPACE"
      | "IMAGE_TEXT_INTERLOCK"
      | "CROP_LAYERED"
      | "MULTI_EVIDENCE_EDITORIAL"
      | "TYPOGRAPHIC_FIELD"
      | "DIAGNOSTIC_COMPOSITION"
      | "SPLIT_DEPTH"
      | "EDGE_ANCHORED"
      | "SUBJECT_OVERLAP"
    ),
    (
      | "FULL_BLEED_ANCHORED"
      | "ASYMMETRIC_NEGATIVE_SPACE"
      | "IMAGE_TEXT_INTERLOCK"
      | "CROP_LAYERED"
      | "MULTI_EVIDENCE_EDITORIAL"
      | "TYPOGRAPHIC_FIELD"
      | "DIAGNOSTIC_COMPOSITION"
      | "SPLIT_DEPTH"
      | "EDGE_ANCHORED"
      | "SUBJECT_OVERLAP"
    ),
    (
      | "FULL_BLEED_ANCHORED"
      | "ASYMMETRIC_NEGATIVE_SPACE"
      | "IMAGE_TEXT_INTERLOCK"
      | "CROP_LAYERED"
      | "MULTI_EVIDENCE_EDITORIAL"
      | "TYPOGRAPHIC_FIELD"
      | "DIAGNOSTIC_COMPOSITION"
      | "SPLIT_DEPTH"
      | "EDGE_ANCHORED"
      | "SUBJECT_OVERLAP"
    ),
    (
      | "FULL_BLEED_ANCHORED"
      | "ASYMMETRIC_NEGATIVE_SPACE"
      | "IMAGE_TEXT_INTERLOCK"
      | "CROP_LAYERED"
      | "MULTI_EVIDENCE_EDITORIAL"
      | "TYPOGRAPHIC_FIELD"
      | "DIAGNOSTIC_COMPOSITION"
      | "SPLIT_DEPTH"
      | "EDGE_ANCHORED"
      | "SUBJECT_OVERLAP"
    ),
    (
      | "FULL_BLEED_ANCHORED"
      | "ASYMMETRIC_NEGATIVE_SPACE"
      | "IMAGE_TEXT_INTERLOCK"
      | "CROP_LAYERED"
      | "MULTI_EVIDENCE_EDITORIAL"
      | "TYPOGRAPHIC_FIELD"
      | "DIAGNOSTIC_COMPOSITION"
      | "SPLIT_DEPTH"
      | "EDGE_ANCHORED"
      | "SUBJECT_OVERLAP"
    ),
    (
      | "FULL_BLEED_ANCHORED"
      | "ASYMMETRIC_NEGATIVE_SPACE"
      | "IMAGE_TEXT_INTERLOCK"
      | "CROP_LAYERED"
      | "MULTI_EVIDENCE_EDITORIAL"
      | "TYPOGRAPHIC_FIELD"
      | "DIAGNOSTIC_COMPOSITION"
      | "SPLIT_DEPTH"
      | "EDGE_ANCHORED"
      | "SUBJECT_OVERLAP"
    ),
    (
      | "FULL_BLEED_ANCHORED"
      | "ASYMMETRIC_NEGATIVE_SPACE"
      | "IMAGE_TEXT_INTERLOCK"
      | "CROP_LAYERED"
      | "MULTI_EVIDENCE_EDITORIAL"
      | "TYPOGRAPHIC_FIELD"
      | "DIAGNOSTIC_COMPOSITION"
      | "SPLIT_DEPTH"
      | "EDGE_ANCHORED"
      | "SUBJECT_OVERLAP"
    ),
    (
      | "FULL_BLEED_ANCHORED"
      | "ASYMMETRIC_NEGATIVE_SPACE"
      | "IMAGE_TEXT_INTERLOCK"
      | "CROP_LAYERED"
      | "MULTI_EVIDENCE_EDITORIAL"
      | "TYPOGRAPHIC_FIELD"
      | "DIAGNOSTIC_COMPOSITION"
      | "SPLIT_DEPTH"
      | "EDGE_ANCHORED"
      | "SUBJECT_OVERLAP"
    ),
    (
      | "FULL_BLEED_ANCHORED"
      | "ASYMMETRIC_NEGATIVE_SPACE"
      | "IMAGE_TEXT_INTERLOCK"
      | "CROP_LAYERED"
      | "MULTI_EVIDENCE_EDITORIAL"
      | "TYPOGRAPHIC_FIELD"
      | "DIAGNOSTIC_COMPOSITION"
      | "SPLIT_DEPTH"
      | "EDGE_ANCHORED"
      | "SUBJECT_OVERLAP"
    ),
    (
      | "FULL_BLEED_ANCHORED"
      | "ASYMMETRIC_NEGATIVE_SPACE"
      | "IMAGE_TEXT_INTERLOCK"
      | "CROP_LAYERED"
      | "MULTI_EVIDENCE_EDITORIAL"
      | "TYPOGRAPHIC_FIELD"
      | "DIAGNOSTIC_COMPOSITION"
      | "SPLIT_DEPTH"
      | "EDGE_ANCHORED"
      | "SUBJECT_OVERLAP"
    ),
    ...(
      | "FULL_BLEED_ANCHORED"
      | "ASYMMETRIC_NEGATIVE_SPACE"
      | "IMAGE_TEXT_INTERLOCK"
      | "CROP_LAYERED"
      | "MULTI_EVIDENCE_EDITORIAL"
      | "TYPOGRAPHIC_FIELD"
      | "DIAGNOSTIC_COMPOSITION"
      | "SPLIT_DEPTH"
      | "EDGE_ANCHORED"
      | "SUBJECT_OVERLAP"
    )[],
  ];
  required_spatial_relationship_count: 2;
  /**
   * @minItems 10
   */
  spatial_relationships: [
    (
      | "ASYMMETRIC_BALANCE"
      | "PROPORTIONAL_CONTRAST"
      | "IMAGE_TEXT_INTERLOCK"
      | "SUBJECT_CROP_TENSION"
      | "FOREGROUND_BACKGROUND_LAYERING"
      | "EDGE_TENSION"
      | "PRIMARY_SECONDARY_AXIS"
      | "CROSS_REGION_ALIGNMENT"
      | "PURPOSEFUL_NEGATIVE_SPACE"
      | "VISUAL_DEPTH_RELATION"
    ),
    (
      | "ASYMMETRIC_BALANCE"
      | "PROPORTIONAL_CONTRAST"
      | "IMAGE_TEXT_INTERLOCK"
      | "SUBJECT_CROP_TENSION"
      | "FOREGROUND_BACKGROUND_LAYERING"
      | "EDGE_TENSION"
      | "PRIMARY_SECONDARY_AXIS"
      | "CROSS_REGION_ALIGNMENT"
      | "PURPOSEFUL_NEGATIVE_SPACE"
      | "VISUAL_DEPTH_RELATION"
    ),
    (
      | "ASYMMETRIC_BALANCE"
      | "PROPORTIONAL_CONTRAST"
      | "IMAGE_TEXT_INTERLOCK"
      | "SUBJECT_CROP_TENSION"
      | "FOREGROUND_BACKGROUND_LAYERING"
      | "EDGE_TENSION"
      | "PRIMARY_SECONDARY_AXIS"
      | "CROSS_REGION_ALIGNMENT"
      | "PURPOSEFUL_NEGATIVE_SPACE"
      | "VISUAL_DEPTH_RELATION"
    ),
    (
      | "ASYMMETRIC_BALANCE"
      | "PROPORTIONAL_CONTRAST"
      | "IMAGE_TEXT_INTERLOCK"
      | "SUBJECT_CROP_TENSION"
      | "FOREGROUND_BACKGROUND_LAYERING"
      | "EDGE_TENSION"
      | "PRIMARY_SECONDARY_AXIS"
      | "CROSS_REGION_ALIGNMENT"
      | "PURPOSEFUL_NEGATIVE_SPACE"
      | "VISUAL_DEPTH_RELATION"
    ),
    (
      | "ASYMMETRIC_BALANCE"
      | "PROPORTIONAL_CONTRAST"
      | "IMAGE_TEXT_INTERLOCK"
      | "SUBJECT_CROP_TENSION"
      | "FOREGROUND_BACKGROUND_LAYERING"
      | "EDGE_TENSION"
      | "PRIMARY_SECONDARY_AXIS"
      | "CROSS_REGION_ALIGNMENT"
      | "PURPOSEFUL_NEGATIVE_SPACE"
      | "VISUAL_DEPTH_RELATION"
    ),
    (
      | "ASYMMETRIC_BALANCE"
      | "PROPORTIONAL_CONTRAST"
      | "IMAGE_TEXT_INTERLOCK"
      | "SUBJECT_CROP_TENSION"
      | "FOREGROUND_BACKGROUND_LAYERING"
      | "EDGE_TENSION"
      | "PRIMARY_SECONDARY_AXIS"
      | "CROSS_REGION_ALIGNMENT"
      | "PURPOSEFUL_NEGATIVE_SPACE"
      | "VISUAL_DEPTH_RELATION"
    ),
    (
      | "ASYMMETRIC_BALANCE"
      | "PROPORTIONAL_CONTRAST"
      | "IMAGE_TEXT_INTERLOCK"
      | "SUBJECT_CROP_TENSION"
      | "FOREGROUND_BACKGROUND_LAYERING"
      | "EDGE_TENSION"
      | "PRIMARY_SECONDARY_AXIS"
      | "CROSS_REGION_ALIGNMENT"
      | "PURPOSEFUL_NEGATIVE_SPACE"
      | "VISUAL_DEPTH_RELATION"
    ),
    (
      | "ASYMMETRIC_BALANCE"
      | "PROPORTIONAL_CONTRAST"
      | "IMAGE_TEXT_INTERLOCK"
      | "SUBJECT_CROP_TENSION"
      | "FOREGROUND_BACKGROUND_LAYERING"
      | "EDGE_TENSION"
      | "PRIMARY_SECONDARY_AXIS"
      | "CROSS_REGION_ALIGNMENT"
      | "PURPOSEFUL_NEGATIVE_SPACE"
      | "VISUAL_DEPTH_RELATION"
    ),
    (
      | "ASYMMETRIC_BALANCE"
      | "PROPORTIONAL_CONTRAST"
      | "IMAGE_TEXT_INTERLOCK"
      | "SUBJECT_CROP_TENSION"
      | "FOREGROUND_BACKGROUND_LAYERING"
      | "EDGE_TENSION"
      | "PRIMARY_SECONDARY_AXIS"
      | "CROSS_REGION_ALIGNMENT"
      | "PURPOSEFUL_NEGATIVE_SPACE"
      | "VISUAL_DEPTH_RELATION"
    ),
    (
      | "ASYMMETRIC_BALANCE"
      | "PROPORTIONAL_CONTRAST"
      | "IMAGE_TEXT_INTERLOCK"
      | "SUBJECT_CROP_TENSION"
      | "FOREGROUND_BACKGROUND_LAYERING"
      | "EDGE_TENSION"
      | "PRIMARY_SECONDARY_AXIS"
      | "CROSS_REGION_ALIGNMENT"
      | "PURPOSEFUL_NEGATIVE_SPACE"
      | "VISUAL_DEPTH_RELATION"
    ),
    ...(
      | "ASYMMETRIC_BALANCE"
      | "PROPORTIONAL_CONTRAST"
      | "IMAGE_TEXT_INTERLOCK"
      | "SUBJECT_CROP_TENSION"
      | "FOREGROUND_BACKGROUND_LAYERING"
      | "EDGE_TENSION"
      | "PRIMARY_SECONDARY_AXIS"
      | "CROSS_REGION_ALIGNMENT"
      | "PURPOSEFUL_NEGATIVE_SPACE"
      | "VISUAL_DEPTH_RELATION"
    )[],
  ];
  lead_generation_cover_text_area: {
    minimum: number;
    maximum: number;
    hard_coded: false;
  };
  content_page_text_area: {
    minimum: number;
    maximum: number;
    hard_coded: false;
  };
  /**
   * @minItems 1
   */
  industry_specific_rules_excluded: [string, ...string[]];
  run_id: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
