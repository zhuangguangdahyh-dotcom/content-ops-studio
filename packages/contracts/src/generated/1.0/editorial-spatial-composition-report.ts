/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface EditorialSpatialCompositionReport {
  report_id: string;
  project_id: string;
  content_id: string;
  candidate_id: string;
  composition_family:
    | "FULL_BLEED_ANCHORED"
    | "ASYMMETRIC_NEGATIVE_SPACE"
    | "IMAGE_TEXT_INTERLOCK"
    | "CROP_LAYERED"
    | "MULTI_EVIDENCE_EDITORIAL"
    | "TYPOGRAPHIC_FIELD"
    | "DIAGNOSTIC_COMPOSITION"
    | "SPLIT_DEPTH"
    | "EDGE_ANCHORED"
    | "SUBJECT_OVERLAP";
  /**
   * @minItems 2
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
  /**
   * @minItems 10
   * @maxItems 10
   */
  dimensions: [
    {
      dimension:
        | "HIERARCHY"
        | "SPATIAL_AXIS"
        | "ASYMMETRY"
        | "PROPORTION"
        | "NEGATIVE_SPACE_PURPOSE"
        | "SUBJECT_CROP"
        | "DEPTH"
        | "IMAGE_TEXT_RELATION"
        | "TENSION"
        | "READING_PATH";
      weight: 10;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "HIERARCHY"
        | "SPATIAL_AXIS"
        | "ASYMMETRY"
        | "PROPORTION"
        | "NEGATIVE_SPACE_PURPOSE"
        | "SUBJECT_CROP"
        | "DEPTH"
        | "IMAGE_TEXT_RELATION"
        | "TENSION"
        | "READING_PATH";
      weight: 10;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "HIERARCHY"
        | "SPATIAL_AXIS"
        | "ASYMMETRY"
        | "PROPORTION"
        | "NEGATIVE_SPACE_PURPOSE"
        | "SUBJECT_CROP"
        | "DEPTH"
        | "IMAGE_TEXT_RELATION"
        | "TENSION"
        | "READING_PATH";
      weight: 10;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "HIERARCHY"
        | "SPATIAL_AXIS"
        | "ASYMMETRY"
        | "PROPORTION"
        | "NEGATIVE_SPACE_PURPOSE"
        | "SUBJECT_CROP"
        | "DEPTH"
        | "IMAGE_TEXT_RELATION"
        | "TENSION"
        | "READING_PATH";
      weight: 10;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "HIERARCHY"
        | "SPATIAL_AXIS"
        | "ASYMMETRY"
        | "PROPORTION"
        | "NEGATIVE_SPACE_PURPOSE"
        | "SUBJECT_CROP"
        | "DEPTH"
        | "IMAGE_TEXT_RELATION"
        | "TENSION"
        | "READING_PATH";
      weight: 10;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "HIERARCHY"
        | "SPATIAL_AXIS"
        | "ASYMMETRY"
        | "PROPORTION"
        | "NEGATIVE_SPACE_PURPOSE"
        | "SUBJECT_CROP"
        | "DEPTH"
        | "IMAGE_TEXT_RELATION"
        | "TENSION"
        | "READING_PATH";
      weight: 10;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "HIERARCHY"
        | "SPATIAL_AXIS"
        | "ASYMMETRY"
        | "PROPORTION"
        | "NEGATIVE_SPACE_PURPOSE"
        | "SUBJECT_CROP"
        | "DEPTH"
        | "IMAGE_TEXT_RELATION"
        | "TENSION"
        | "READING_PATH";
      weight: 10;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "HIERARCHY"
        | "SPATIAL_AXIS"
        | "ASYMMETRY"
        | "PROPORTION"
        | "NEGATIVE_SPACE_PURPOSE"
        | "SUBJECT_CROP"
        | "DEPTH"
        | "IMAGE_TEXT_RELATION"
        | "TENSION"
        | "READING_PATH";
      weight: 10;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "HIERARCHY"
        | "SPATIAL_AXIS"
        | "ASYMMETRY"
        | "PROPORTION"
        | "NEGATIVE_SPACE_PURPOSE"
        | "SUBJECT_CROP"
        | "DEPTH"
        | "IMAGE_TEXT_RELATION"
        | "TENSION"
        | "READING_PATH";
      weight: 10;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "HIERARCHY"
        | "SPATIAL_AXIS"
        | "ASYMMETRY"
        | "PROPORTION"
        | "NEGATIVE_SPACE_PURPOSE"
        | "SUBJECT_CROP"
        | "DEPTH"
        | "IMAGE_TEXT_RELATION"
        | "TENSION"
        | "READING_PATH";
      weight: 10;
      score: number;
      reason: string;
    },
  ];
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
