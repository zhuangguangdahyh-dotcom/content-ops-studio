/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CandidateSetVisualDiversityReport {
  report_id: string;
  project_id: string;
  content_id: string;
  candidate_set_id: string;
  /**
   * @minItems 2
   * @maxItems 3
   */
  candidate_ids: [string, string] | [string, string, string];
  /**
   * @minItems 2
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
  /**
   * @minItems 2
   */
  text_regions: [string, string, ...string[]];
  /**
   * @minItems 2
   */
  shot_scales: [string, string, ...string[]];
  /**
   * @minItems 2
   */
  camera_viewpoints: [string, string, ...string[]];
  /**
   * @minItems 2
   */
  asset_structures: [string, string, ...string[]];
  /**
   * @minItems 2
   */
  semantic_roles: [string, string, ...string[]];
  /**
   * @minItems 2
   */
  reading_paths: [string, string, ...string[]];
  /**
   * @minItems 9
   * @maxItems 9
   */
  dimensions: [
    {
      dimension:
        | "COMPOSITION_FAMILY_DIVERSITY"
        | "TEXT_REGION_DIVERSITY"
        | "SHOT_SCALE_DIVERSITY"
        | "CAMERA_VIEWPOINT_DIVERSITY"
        | "ASSET_STRUCTURE_DIVERSITY"
        | "SEMANTIC_ROLE_DIVERSITY"
        | "VISUAL_READING_PATH_DIVERSITY"
        | "IMAGE_TEXT_INTEGRATION_DIVERSITY"
        | "NEAR_TEMPLATE_DUPLICATE_RISK";
      weight: number;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "COMPOSITION_FAMILY_DIVERSITY"
        | "TEXT_REGION_DIVERSITY"
        | "SHOT_SCALE_DIVERSITY"
        | "CAMERA_VIEWPOINT_DIVERSITY"
        | "ASSET_STRUCTURE_DIVERSITY"
        | "SEMANTIC_ROLE_DIVERSITY"
        | "VISUAL_READING_PATH_DIVERSITY"
        | "IMAGE_TEXT_INTEGRATION_DIVERSITY"
        | "NEAR_TEMPLATE_DUPLICATE_RISK";
      weight: number;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "COMPOSITION_FAMILY_DIVERSITY"
        | "TEXT_REGION_DIVERSITY"
        | "SHOT_SCALE_DIVERSITY"
        | "CAMERA_VIEWPOINT_DIVERSITY"
        | "ASSET_STRUCTURE_DIVERSITY"
        | "SEMANTIC_ROLE_DIVERSITY"
        | "VISUAL_READING_PATH_DIVERSITY"
        | "IMAGE_TEXT_INTEGRATION_DIVERSITY"
        | "NEAR_TEMPLATE_DUPLICATE_RISK";
      weight: number;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "COMPOSITION_FAMILY_DIVERSITY"
        | "TEXT_REGION_DIVERSITY"
        | "SHOT_SCALE_DIVERSITY"
        | "CAMERA_VIEWPOINT_DIVERSITY"
        | "ASSET_STRUCTURE_DIVERSITY"
        | "SEMANTIC_ROLE_DIVERSITY"
        | "VISUAL_READING_PATH_DIVERSITY"
        | "IMAGE_TEXT_INTEGRATION_DIVERSITY"
        | "NEAR_TEMPLATE_DUPLICATE_RISK";
      weight: number;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "COMPOSITION_FAMILY_DIVERSITY"
        | "TEXT_REGION_DIVERSITY"
        | "SHOT_SCALE_DIVERSITY"
        | "CAMERA_VIEWPOINT_DIVERSITY"
        | "ASSET_STRUCTURE_DIVERSITY"
        | "SEMANTIC_ROLE_DIVERSITY"
        | "VISUAL_READING_PATH_DIVERSITY"
        | "IMAGE_TEXT_INTEGRATION_DIVERSITY"
        | "NEAR_TEMPLATE_DUPLICATE_RISK";
      weight: number;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "COMPOSITION_FAMILY_DIVERSITY"
        | "TEXT_REGION_DIVERSITY"
        | "SHOT_SCALE_DIVERSITY"
        | "CAMERA_VIEWPOINT_DIVERSITY"
        | "ASSET_STRUCTURE_DIVERSITY"
        | "SEMANTIC_ROLE_DIVERSITY"
        | "VISUAL_READING_PATH_DIVERSITY"
        | "IMAGE_TEXT_INTEGRATION_DIVERSITY"
        | "NEAR_TEMPLATE_DUPLICATE_RISK";
      weight: number;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "COMPOSITION_FAMILY_DIVERSITY"
        | "TEXT_REGION_DIVERSITY"
        | "SHOT_SCALE_DIVERSITY"
        | "CAMERA_VIEWPOINT_DIVERSITY"
        | "ASSET_STRUCTURE_DIVERSITY"
        | "SEMANTIC_ROLE_DIVERSITY"
        | "VISUAL_READING_PATH_DIVERSITY"
        | "IMAGE_TEXT_INTEGRATION_DIVERSITY"
        | "NEAR_TEMPLATE_DUPLICATE_RISK";
      weight: number;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "COMPOSITION_FAMILY_DIVERSITY"
        | "TEXT_REGION_DIVERSITY"
        | "SHOT_SCALE_DIVERSITY"
        | "CAMERA_VIEWPOINT_DIVERSITY"
        | "ASSET_STRUCTURE_DIVERSITY"
        | "SEMANTIC_ROLE_DIVERSITY"
        | "VISUAL_READING_PATH_DIVERSITY"
        | "IMAGE_TEXT_INTEGRATION_DIVERSITY"
        | "NEAR_TEMPLATE_DUPLICATE_RISK";
      weight: number;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "COMPOSITION_FAMILY_DIVERSITY"
        | "TEXT_REGION_DIVERSITY"
        | "SHOT_SCALE_DIVERSITY"
        | "CAMERA_VIEWPOINT_DIVERSITY"
        | "ASSET_STRUCTURE_DIVERSITY"
        | "SEMANTIC_ROLE_DIVERSITY"
        | "VISUAL_READING_PATH_DIVERSITY"
        | "IMAGE_TEXT_INTEGRATION_DIVERSITY"
        | "NEAR_TEMPLATE_DUPLICATE_RISK";
      weight: number;
      score: number;
      reason: string;
    },
  ];
  near_template_duplicate_risk: "LOW" | "MEDIUM" | "HIGH" | "BLOCKING";
  total_score: number;
  threshold: 85;
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
