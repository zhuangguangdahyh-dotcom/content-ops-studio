import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { format } from "prettier";

const root = path.resolve("tests/fixtures/contracts/1.0");
const hash = (character: string) => character.repeat(64);
const projectRef = { project_kind: "CALIBRATION_PROJECT", project_id: "CAL-DEMO-001" };
const runId = "RUN-20990101-030405-C4R2";
const createdAt = "2099-01-01T03:04:05.000Z";

async function fixtures(name: string, valid: unknown): Promise<void> {
  const validRoot = path.join(root, name, "valid");
  const invalidRoot = path.join(root, name, "invalid");
  await mkdir(validRoot, { recursive: true });
  await mkdir(invalidRoot, { recursive: true });
  await writeFile(
    path.join(validRoot, "complete.json"),
    await format(JSON.stringify(valid), { parser: "json", printWidth: 100 }),
  );
  await writeFile(
    path.join(invalidRoot, "missing-required.json"),
    '{ "schema_version": "1.0.0" }\n',
  );
  await writeFile(
    path.join(invalidRoot, "unknown-property.json"),
    '{ "schema_version": "1.0.0", "unexpected": true }\n',
  );
}

const approvalEvent = {
  approval_id: "APR-20990101-G4C2",
  gate: "FIRST_PAGE",
  target_type: "FIRST_PAGE_ASSET",
  target_id: "AST-CAL-DEMO-001-FPV3",
  target_version: `CV-2:CV-2:VV-2:FPV-3:${hash("a")}`,
  decision: "APPROVE",
  comment: "Operator approved the current-version binding.",
  source_run_id: "RUN-20990101-020304-G3B1",
  created_at: createdAt,
  deprecated_at: null,
  schema_version: "1.0.0",
};

await fixtures("calibration-g4-approval-v2", {
  approval_evidence_id: "CG4A2-CAL-DEMO-001-FPV3",
  project_ref: projectRef,
  content_id: "C-9001",
  content_version: "CV-2",
  copy_version: "CV-2",
  visual_plan_version: "VV-2",
  first_page_version: "FPV-3",
  asset_id: "AST-CAL-DEMO-001-FPV3",
  asset_checksum: hash("a"),
  g3_approval_id: "APR-20990101-G3B1",
  g3_approval_ref: "projects/CAL-DEMO-001/runs/RUN-20990101-020304-G3B1/content/g3.json",
  g3_approval_hash: hash("b"),
  current_version_qa_binding_id: "CVQA-CAL-DEMO-001-FPV3",
  g4_review_request_ref: "projects/CAL-DEMO-001/runs/RUN-20990101-020304-G3B1/content/g4.json",
  g4_review_request_hash: hash("c"),
  decision: "APPROVE",
  status: "PASSED",
  approval_event: approvalEvent,
  style_lock_authorized: true,
  remaining_page_production_eligibility: "ELIGIBLE",
  renderer_calls: 0,
  imagegen_calls: 0,
  feishu_writes: 0,
  production_workspace_write_eligible: false,
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
});

const coverRules = Array.from({ length: 13 }, (_, index) => `Cover rule ${index + 1}`);
const sharedRules = Array.from({ length: 9 }, (_, index) => `Shared rule ${index + 1}`);
const variations = Array.from({ length: 14 }, (_, index) => `Allowed variation ${index + 1}`);
const prohibitions = Array.from({ length: 13 }, (_, index) => `Prohibited deviation ${index + 1}`);
await fixtures("calibration-style-lock-v2", {
  style_lock_id: "CSL2-CAL-DEMO-001-V2",
  style_lock_version: "SLV-2",
  status: "ACTIVE",
  project_ref: projectRef,
  content_id: "C-9001",
  content_version: "CV-2",
  copy_version: "CV-2",
  visual_plan_version: "VV-2",
  first_page_version: "FPV-3",
  source_asset_id: "AST-CAL-DEMO-001-FPV3",
  source_asset_checksum: hash("a"),
  source_g4_approval_id: "APR-20990101-G4C2",
  source_g4_approval_ref: "projects/CAL-DEMO-001/runs/RUN-20990101-030405-C4R2/content/g4.json",
  source_g4_approval_hash: hash("d"),
  inherited_calibration_status: "CALIBRATION_VALIDATED_V1",
  validated_systems: ["BASELINE", "EDITORIAL", "ATTENTION", "SPATIAL", "BREATHING", "CONTRAST"],
  cover_locked_rules: coverRules,
  group_shared_rules: sharedRules,
  content_page_allowed_variations: variations,
  prohibited_deviations: prohibitions,
  historical_style_lock: { style_lock_version: "SLV-1", status: "HISTORICAL_VALID_FOR_CV1_ONLY" },
  universal_template_created: false,
  remaining_page_production_eligibility: "ELIGIBLE",
  remaining_pages_created: 0,
  feishu_writes: 0,
  production_workspace_write_eligible: false,
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
});

const roles = ["COVER", "PROBLEM", "ANALYSIS", "ANALYSIS", "ANALYSIS", "SUMMARY"];
const intents = [
  "COVER_ENTRY",
  "CONTENT_EDITORIAL",
  "DIAGNOSTIC_PAGE",
  "DIAGNOSTIC_PAGE",
  "DIAGNOSTIC_PAGE",
  "SUMMARY_PAGE",
];
const compositions = [
  "ASYMMETRIC_NEGATIVE_SPACE",
  "EDITORIAL_SPLIT",
  "DIAGNOSTIC_COMPOSITION",
  "EVIDENCE_DOMINANT",
  "IMAGE_DOMINANT",
  "MULTI_EVIDENCE_EDITORIAL",
];
const intensities = ["HIGH", "MEDIUM", "MEDIUM", "LOW", "HIGH", "LOW"];
const rhythmRoles = ["OPEN", "BUILD", "PROVE", "PAUSE", "ACCELERATE", "RESOLVE"];
const qaChecks = [
  "AUTHENTICITY",
  "MECHANICAL_QA",
  "COPY_FIDELITY",
  "TYPOGRAPHY_POLICY",
  "TYPOGRAPHY_SPATIAL_INTEGRITY",
  "TYPOGRAPHY_BREATHING_ROOM",
  "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY",
  "CONTRAST_STABILITY",
  "BACKGROUND_COMPLEXITY",
  "SEMANTIC_RELEVANCE",
  "PAGE_INTENT_FIT",
  "EDITORIAL_SPATIAL",
  "IMAGE_TEXT_INTEGRATION",
  "IMAGE_QUALITY",
  "ACTUAL_PIXEL_INSPECTION",
];
const asset = (page: number, suffix: string, width: number, height: number) => ({
  asset_ref: `projects/CAL-DEMO-001/runs/${runId}/image-production/page-${page}-${suffix}.png`,
  checksum: hash(String((page % 9) + 1)),
  width,
  height,
});
const rhythmPages = roles.map((role, index) => ({
  page_number: index + 1,
  page_intent: intents[index],
  page_role: role,
  composition_family: compositions[index],
  visual_intensity: intensities[index],
  information_density: index === 0 ? "LOW" : "MEDIUM",
  image_dominance: index === 4 ? "HIGH" : "MEDIUM",
  typography_scale: index === 0 ? "COVER" : "CONTENT_MEDIUM",
  color_intensity: index === 4 ? "HIGH" : "MEDIUM",
  rhythm_role: rhythmRoles[index],
  reading_path: `Reading path ${index + 1}`,
  visual_motif: `Motif ${index + 1}`,
  continuity_requirements: ["Same verified master space", "Same typography logic"],
}));
const pageReports = [2, 3, 4, 5, 6].map((page, index) => ({
  page_number: page,
  page_role: roles[page - 1],
  page_intent: intents[page - 1],
  composition_family: compositions[page - 1],
  visual_intensity: intensities[page - 1],
  asset_source: "VERIFIED_MASTER_ASSET_CROP",
  asset: asset(page, "full", 1242, 1660),
  thumbnail_310: asset(page, "310", 310, 414),
  thumbnail_186: asset(page, "186", 186, 248),
  copy_hash: hash(String(index + 1)),
  single_page_qa: qaChecks.map((check) => ({ check, result: "PASS" })),
  scores: { editorial_spatial: 90, image_text_integration: 91, image_quality: 92 },
  hard_blocks: [],
  status: "PASSED",
}));
const sequence = (values: string[]) => values;
const dimensions = [
  ["VISUAL_SYSTEM_COHERENCE", 14, 15],
  ["SPACE_IDENTITY_CONTINUITY", 15, 15],
  ["PAGE_DIFFERENCE", 14, 15],
  ["EDITORIAL_RHYTHM", 14, 15],
  ["TYPOGRAPHY_COHERENCE", 9, 10],
  ["COLOR_RHYTHM", 9, 10],
  ["IMAGE_TREATMENT", 5, 5],
  ["CONTENT_PROGRESSION", 10, 10],
  ["GROUP_COMPLETION", 5, 5],
].map(([dimension, score, maximum]) => ({ dimension, score, maximum }));
await fixtures("calibration-remaining-page-production", {
  production_id: "CRPP-CAL-DEMO-001-CV2",
  project_ref: projectRef,
  content_id: "C-9001",
  content_version: "CV-2",
  copy_version: "CV-2",
  visual_plan_version: "VV-2",
  first_page_version: "FPV-3",
  first_page_asset_id: "AST-CAL-DEMO-001-FPV3",
  first_page_checksum: hash("a"),
  g4_approval_id: "APR-20990101-G4C2",
  style_lock_id: "CSL2-CAL-DEMO-001-V2",
  style_lock_version: "SLV-2",
  rhythm_plan: { plan_id: "GERP-CAL-DEMO-001-CV2", pages: rhythmPages, status: "EXECUTED" },
  page_reports: pageReports,
  space_identity_continuity: {
    status: "PASSED",
    basis: ["One master", "Verified crops", "One material system"],
    hard_blocks: [],
  },
  group_editorial_rhythm: {
    status: "PASSED",
    visual_intensity_sequence: sequence(intensities),
    information_density_sequence: sequence(["LOW", "MEDIUM", "MEDIUM", "HIGH", "LOW", "MEDIUM"]),
    image_dominance_sequence: sequence(["HIGH", "MEDIUM", "MEDIUM", "HIGH", "HIGH", "MEDIUM"]),
    typography_scale_sequence: sequence([
      "COVER",
      "CONTENT_MEDIUM",
      "CONTENT_MEDIUM",
      "CONTENT_MEDIUM",
      "CONTENT_LARGE",
      "CONTENT_MEDIUM",
    ]),
    composition_sequence: sequence(compositions),
    reading_path_sequence: sequence([
      "TYPE_TO_IMAGE",
      "IMAGE_TO_TYPE",
      "TYPE_TO_EVIDENCE",
      "EVIDENCE_TO_TYPE",
      "IMAGE_TO_TYPE",
      "EVIDENCE_TO_SUMMARY",
    ]),
    pause_points: ["P4", "P6"],
    proof_points: ["P3", "P4", "P5"],
    resolution: "P6 resolves the three checks.",
    hard_blocks: [],
  },
  group_color_rhythm: {
    status: "PASSED",
    dominant_color_sequence: sequence([
      "COOL_WHITE",
      "WARM_IVORY",
      "CHARCOAL",
      "WARM_BEIGE",
      "DEEP_NEUTRAL",
      "CHARCOAL",
    ]),
    value_sequence: sequence(["HIGH", "HIGH", "LOW", "HIGH", "LOW", "LOW"]),
    saturation_sequence: sequence(["LOW", "LOW", "LOW", "LOW", "LOW", "LOW"]),
    temperature_sequence: sequence(["COOL", "WARM", "NEUTRAL", "WARM", "NEUTRAL", "NEUTRAL"]),
    accent_repetition: "Restrained copper repeats on P2-P6.",
    accent_spacing: "Accent is separated by composition and scale.",
    hard_blocks: [],
  },
  group_qa: {
    status: "PASSED",
    score: 95,
    dimensions,
    hard_blocks: [],
    aesthetic_risks: ["One master asset intentionally limits viewpoint diversity."],
  },
  contact_sheets: [
    asset(1, "contact-full", 1242, 1112),
    asset(1, "contact-310", 1030, 930),
    asset(1, "contact-186", 1228, 294),
  ],
  remaining_pages_planned: 5,
  remaining_pages_generated: 5,
  total_pages: 6,
  imagegen_calls: 0,
  renderer_calls: 8,
  feishu_writes: 0,
  production_workspace_write_eligible: false,
  status: "G5_READY",
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
});

await fixtures("calibration-g5-review-request", {
  review_request_id: "CG5R-CAL-DEMO-001-CV2",
  project_ref: projectRef,
  content_id: "C-9001",
  content_version: "CV-2",
  copy_version: "CV-2",
  visual_plan_version: "VV-2",
  first_page_version: "FPV-3",
  g4_approval_id: "APR-20990101-G4C2",
  style_lock_id: "CSL2-CAL-DEMO-001-V2",
  style_lock_version: "SLV-2",
  production_report_ref: `projects/CAL-DEMO-001/runs/${runId}/content/remaining-page-production.json`,
  production_report_hash: hash("f"),
  group_qa_score: 95,
  hard_blocks: [],
  feedback_classes: [
    "SINGLE_PAGE_REVISION",
    "GROUP_VISUAL_REVISION",
    "CONTENT_REVISION",
    "STYLE_LOCK_REVISION",
  ],
  status: "AWAITING_USER_APPROVAL",
  decision: "PENDING_OPERATOR",
  approval_event_created: false,
  final_manifest_created: false,
  feishu_writes: 0,
  production_workspace_write_eligible: false,
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
});
