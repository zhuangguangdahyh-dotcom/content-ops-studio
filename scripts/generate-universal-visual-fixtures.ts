import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("tests/fixtures/contracts/1.0");
const runId = "RUN-20990101-010203-R021";
const at = "2099-01-01T01:02:03.000Z";
const common = { run_id: runId, created_at: at, schema_version: "1.0.0", extensions: {} };

async function write(name: string, value: Record<string, unknown>): Promise<void> {
  const directory = path.join(root, name);
  await mkdir(path.join(directory, "valid"), { recursive: true });
  await mkdir(path.join(directory, "invalid"), { recursive: true });
  await writeFile(
    path.join(directory, "valid/complete.json"),
    `${JSON.stringify(value, null, 2)}\n`,
  );
  const missing = { ...value };
  delete missing.run_id;
  await writeFile(
    path.join(directory, "invalid/missing-required.json"),
    `${JSON.stringify(missing, null, 2)}\n`,
  );
  await writeFile(
    path.join(directory, "invalid/additional-property.json"),
    `${JSON.stringify({ ...value, forbidden_extra: true }, null, 2)}\n`,
  );
}

const spatial = [
  "ASYMMETRIC_BALANCE",
  "PROPORTIONAL_CONTRAST",
  "IMAGE_TEXT_INTERLOCK",
  "SUBJECT_CROP_TENSION",
  "FOREGROUND_BACKGROUND_LAYERING",
  "EDGE_TENSION",
  "PRIMARY_SECONDARY_AXIS",
  "CROSS_REGION_ALIGNMENT",
  "PURPOSEFUL_NEGATIVE_SPACE",
  "VISUAL_DEPTH_RELATION",
];
const families = [
  "FULL_BLEED_ANCHORED",
  "ASYMMETRIC_NEGATIVE_SPACE",
  "IMAGE_TEXT_INTERLOCK",
  "CROP_LAYERED",
  "MULTI_EVIDENCE_EDITORIAL",
  "TYPOGRAPHIC_FIELD",
  "DIAGNOSTIC_COMPOSITION",
  "SPLIT_DEPTH",
  "EDGE_ANCHORED",
  "SUBJECT_OVERLAP",
];
await write("universal-visual-default-policy", {
  policy_id: "UNIVERSAL-VISUAL-DEFAULT",
  policy_version: "UVDPV-1",
  fallback_only: true,
  decision_precedence: [
    "SAFETY_AUTHENTICITY_AUTHORIZATION",
    "OPERATOR_CURRENT_REQUEST",
    "APPROVED_STYLE_LOCK",
    "PROJECT_VISUAL_PROFILE",
    "GLOBAL_USER_PREFERENCE",
    "PER_CONTENT_PAINPOINT_CONTENT_EVIDENCE_ASSETS",
    "INDUSTRY_PACK_AND_OVERLAY",
    "PLATFORM_PACK",
    "UNIVERSAL_DEFAULT_VISUAL_BASELINE",
  ],
  cold_start_conditions: [
    "NO_OPERATOR_VISUAL_REQUEST",
    "NO_STYLE_LOCK",
    "NO_PROJECT_RULE",
    "NO_GLOBAL_RULE",
    "NO_INDUSTRY_RULE",
    "NO_PLATFORM_RULE",
  ],
  typography_policy_ref: "TDPV-1",
  composition_families: families,
  required_spatial_relationship_count: 2,
  spatial_relationships: spatial,
  lead_generation_cover_text_area: { minimum: 0.35, maximum: 0.55, hard_coded: false },
  content_page_text_area: { minimum: 0.25, maximum: 0.45, hard_coded: false },
  industry_specific_rules_excluded: [
    "200_SQUARE_METERS",
    "COMMERCIAL_SPACE_ONLY",
    "NO_PEOPLE",
    "MITUNDAO_BRAND",
  ],
  ...common,
});
const typeRole = (weights: number[], min: number, max: number, bold: boolean) => ({
  family_class: "MODERN_CHINESE_SERIF",
  preferred_weights: weights,
  relative_size_min: min,
  relative_size_max: max,
  default_bold: bold,
});
await write("typography-default-policy", {
  policy_id: "UNIVERSAL-TYPOGRAPHY-DEFAULT",
  policy_version: "TDPV-1",
  fallback_only: true,
  chinese_serif_candidates: [
    "Songti SC",
    "Source Han Serif SC",
    "Noto Serif CJK SC",
    "Noto Serif SC",
    "STSong",
  ],
  title: typeRole([800, 700], 1, 1, true),
  subtitle: typeRole([500, 400], 0.45, 0.6, false),
  body: typeRole([400], 0.4, 0.55, false),
  geometry: {
    title_line_height: { minimum: 0.92, maximum: 1.08, hard_coded: false },
    title_letter_spacing_em: { minimum: -0.04, maximum: 0, hard_coded: false },
    subtitle_line_height: { minimum: 1.1, maximum: 1.35, hard_coded: false },
    subtitle_letter_spacing_em: { minimum: 0, maximum: 0.03, hard_coded: false },
    body_line_height: { minimum: 1.3, maximum: 1.6, hard_coded: false },
    body_letter_spacing_em: { minimum: 0, maximum: 0.04, hard_coded: false },
  },
  silent_pingfang_fallback_forbidden: true,
  font_download_forbidden: true,
  renderer_probe_required: true,
  ...common,
});
const reportBase = {
  project_id: "CAL-COMMERCIAL-SPACE-001",
  content_id: "C-9001",
  candidate_id: "CCC-CAL-SPACE-001-D",
};
const editorialDimensions = [
  "HIERARCHY",
  "SPATIAL_AXIS",
  "ASYMMETRY",
  "PROPORTION",
  "NEGATIVE_SPACE_PURPOSE",
  "SUBJECT_CROP",
  "DEPTH",
  "IMAGE_TEXT_RELATION",
  "TENSION",
  "READING_PATH",
].map((dimension) => ({
  dimension,
  weight: 10,
  score: 9,
  reason: `${dimension} is grounded in the rendered composition.`,
}));
await write("editorial-spatial-composition-report", {
  report_id: "ESCR-CAL-SPACE-001-D",
  ...reportBase,
  composition_family: "IMAGE_TEXT_INTERLOCK",
  spatial_relationships: ["IMAGE_TEXT_INTERLOCK", "EDGE_TENSION"],
  dimensions: editorialDimensions,
  total_score: 90,
  threshold: 80,
  hard_blocks: [],
  result: "PASS_PENDING_OPERATOR",
  operator_approval_required: true,
  ...common,
});
const integrationDimensions = [
  "SUBJECT_OR_EDGE_RELATION",
  "NEGATIVE_SPACE_RELATION",
  "FOCUS_COOPERATION",
  "EVIDENCE_VISIBILITY",
  "READING_PATH_INTEGRATION",
].map((dimension) => ({
  dimension,
  weight: 20,
  score: 18,
  reason: `${dimension} is visible in the output.`,
}));
await write("image-text-integration-report", {
  report_id: "ITIR-CAL-SPACE-001-D",
  ...reportBase,
  integration_strategy: "Title interlocks with the storefront edge and natural negative space.",
  image_responsibility: "PAINPOINT",
  anchor_relationships: ["Storefront fascia edge", "Recessed entrance axis"],
  key_evidence_obscured: false,
  generic_text_over_photo: false,
  dimensions: integrationDimensions,
  total_score: 90,
  threshold: 85,
  hard_blocks: [],
  result: "PASS_PENDING_OPERATOR",
  operator_approval_required: true,
  ...common,
});
const diversityWeights = {
  COMPOSITION_FAMILY_DIVERSITY: 15,
  TEXT_REGION_DIVERSITY: 10,
  SHOT_SCALE_DIVERSITY: 10,
  CAMERA_VIEWPOINT_DIVERSITY: 10,
  ASSET_STRUCTURE_DIVERSITY: 15,
  SEMANTIC_ROLE_DIVERSITY: 10,
  VISUAL_READING_PATH_DIVERSITY: 10,
  IMAGE_TEXT_INTEGRATION_DIVERSITY: 10,
  NEAR_TEMPLATE_DUPLICATE_RISK: 10,
};
await write("candidate-set-visual-diversity-report", {
  report_id: "CSVDR-CAL-SPACE-001-R2",
  project_id: "CAL-COMMERCIAL-SPACE-001",
  content_id: "C-9001",
  candidate_set_id: "CCCS-CAL-SPACE-001-R2",
  candidate_ids: ["CCC-CAL-SPACE-001-D", "CCC-CAL-SPACE-001-E", "CCC-CAL-SPACE-001-F"],
  composition_families: [
    "IMAGE_TEXT_INTERLOCK",
    "DIAGNOSTIC_COMPOSITION",
    "MULTI_EVIDENCE_EDITORIAL",
  ],
  text_regions: ["RIGHT_EDGE", "LOWER_LEFT", "TOP_BAND"],
  shot_scales: ["WHOLE_STOREFRONT", "APPROACH_VIEW", "MASTER_PLUS_CROPS"],
  camera_viewpoints: ["FRONTAL_STREET", "OBLIQUE_APPROACH", "EDITORIAL_CROPS"],
  asset_structures: ["SINGLE_PAINPOINT", "DIAGNOSTIC_MARKERS", "MASTER_PLUS_THREE_CROPS"],
  semantic_roles: ["DIRECT_PAINPOINT_SCENE", "DIRECT_BUSINESS_SCENE", "EVIDENCE_ASSET"],
  reading_paths: ["EVIDENCE_TO_TITLE", "TITLE_TO_MARKERS", "MASTER_TO_CROPS_TO_COPY"],
  dimensions: Object.entries(diversityWeights).map(([dimension, weight]) => ({
    dimension,
    weight,
    score: weight === 15 ? 14 : 9,
    reason: `${dimension} is materially distinct.`,
  })),
  near_template_duplicate_risk: "LOW",
  total_score: 88,
  threshold: 85,
  hard_blocks: [],
  result: "PASS_PENDING_OPERATOR",
  operator_approval_required: true,
  ...common,
});
const painpointDimensions = [
  { dimension: "VISIBLE_PAINPOINT_EVIDENCE", weight: 30, score: 28 },
  { dimension: "COPY_SCENE_RELATION", weight: 25, score: 23 },
  { dimension: "BUSINESS_SCENE_RECOGNITION", weight: 20, score: 19 },
  { dimension: "CONTRAST_OR_DIAGNOSTIC_VALIDITY", weight: 25, score: 22 },
].map((item) => ({
  ...item,
  reason: `${item.dimension} is visible and not inferred after the fact.`,
}));
await write("painpoint-scene-congruence-report", {
  report_id: "PSCR-CAL-SPACE-001-D",
  ...reportBase,
  conversion_strategy: "PAINPOINT_FIRST",
  relation: "DIRECTLY_SUPPORTS_PAINPOINT",
  painpoint_statement:
    "The storefront fails to communicate category, positioning and entrance at first glance.",
  visible_scene_evidence: [
    "Weak category identification",
    "Recessed entrance",
    "Low-presence fascia",
  ],
  diagnostic_markers: [],
  dimensions: painpointDimensions,
  total_score: 92,
  threshold: 85,
  hard_blocks: [],
  result: "PASS_PENDING_OPERATOR",
  operator_approval_required: true,
  ...common,
});
await write("locale-scene-fit-report", {
  report_id: "LSFR-CAL-SPACE-001-D",
  ...reportBase,
  audience_locale: "中国",
  project_region: "中国新一线或二线城市",
  resolved_scene_locale: "中国新一线或二线城市",
  locale_evidence: [
    "Contemporary Chinese urban commercial street",
    "Chinese storefront proportions and streetscape",
  ],
  region_question_required: false,
  total_score: 95,
  threshold: 80,
  hard_blocks: [],
  result: "PASS_PENDING_OPERATOR",
  operator_approval_required: true,
  ...common,
});

const typographyMeasurement = (
  layerId: string,
  role: "TITLE" | "SECONDARY",
  text: string,
  lines: string[],
  box: { x: number; y: number; width: number; height: number },
  fontSize: number,
  weight: number,
  lineHeight: number,
) => ({
  layer_id: layerId,
  role,
  text,
  lines,
  bounding_box: box,
  container_box: null,
  container_padding_px: null,
  computed_font_family: '"Songti SC", "STSong", serif',
  computed_font_size_px: fontSize,
  computed_font_weight: weight,
  computed_line_height_px: lineHeight,
  computed_letter_spacing_px: role === "TITLE" ? -3 : 0,
  z_index: 3,
  visibility: "VISIBLE",
});
await write("typography-spatial-integrity-report", {
  report_id: "TSIR-CAL-SPACE-001-G",
  project_id: "CAL-COMMERCIAL-SPACE-001",
  content_id: "C-9001",
  candidate_id: "CCC-CAL-SPACE-001-G",
  typography_policy_result: "PASS",
  title_measurement: typographyMeasurement(
    "title",
    "TITLE",
    "门店老板，\n你的门头在劝退顾客吗",
    ["门店老板，", "你的门头在劝退顾客吗"],
    { x: 72, y: 226, width: 820, height: 224 },
    112,
    700,
    112,
  ),
  secondary_measurement: typographyMeasurement(
    "secondary",
    "SECONDARY",
    "先查品类、定位、入口这3处",
    ["先查品类、定位、入口这3处"],
    { x: 104, y: 526, width: 630, height: 72 },
    56,
    400,
    70,
  ),
  minimum_text_layer_gap_px: 76,
  findings: [],
  hard_blocks: [],
  mechanical_geometry_checked: true,
  visual_spatial_qa_result: "PASS",
  result: "PASS",
  visual_quality_eligible: true,
  ...common,
});
await write("typographic-breathing-room-report", {
  report_id: "TBRR-CAL-SPACE-001-G",
  project_id: "CAL-COMMERCIAL-SPACE-001",
  content_id: "C-9001",
  candidate_id: "CCC-CAL-SPACE-001-G",
  title_to_secondary_distance_px: 76,
  title_to_secondary_ratio: 0.679,
  reference_soft_range: { minimum: 0.5, maximum: 1, fixed_pixel_rule: false },
  minimum_container_padding_px: null,
  minimum_text_to_image_distance_px: 58,
  text_to_image_distance_ratio: 0.518,
  information_groups_visually_distinct: true,
  visual_pressure_detected: false,
  score: 96,
  hard_blocks: [],
  result: "PASS",
  ...common,
});
