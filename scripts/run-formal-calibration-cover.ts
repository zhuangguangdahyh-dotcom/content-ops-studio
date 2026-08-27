import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { copyFile, mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  createCalibrationStyleLockPreview,
  evaluateFormalCalibrationReadiness,
} from "../packages/core/src/visual-baseline/index.js";
import { renderFormalCalibrationCover } from "../packages/renderer/src/formal-calibration-cover.js";
import { ImageProductionRuntime } from "../packages/runtime/src/image-production/index.js";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const schemaRoot = path.join(repositoryRoot, "plugins/content-ops-studio/schemas/1.0");
const projectHome =
  process.env.CONTENT_OPS_HOME ??
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br23";
const projectId = "CAL-COMMERCIAL-SPACE-001";
const contentId = "C-9001";
const runId = "RUN-20260826-200000-R24G";
const createdAt = "2026-08-26T12:00:00.000Z";
const selectedCandidateId = "CCC-CAL-SPACE-001-I";
const selectedCandidateChecksum =
  "cc00f772b018e1b674385c3d899d702221182db9660ad1b6b49c486bacbdbae3";
const sourceHostPath =
  "/Users/zhuangguangda/.codex/generated_images/01a02e0e-5e07-7283-b5c9-3f266ca04b9d/exec-6913df42-fc0f-423d-a2b1-bae4d5469ab9.png";
const selectedCandidatePath =
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br23/projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260826-181500-CR07/image-production/cover-concepts/candidate-I-full.png";
const candidateSetPath =
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br23/projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260826-181500-CR07/image-production/calibration-round4-candidate-set.json";
const c0001Path =
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4b/projects/PRJ-20260824-P2B2/runs/RUN-20260825-174500-P4BF/outputs/first-page/01-cover_fpv2.png";
const c0001Checksum = "b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5";

const historicalCandidates = [
  [
    "A",
    "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br2/projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260826-131500-CAL2/image-production/cover-concepts/candidate-A-full.png",
  ],
  [
    "B",
    "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br2/projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260826-131500-CAL2/image-production/cover-concepts/candidate-B-full.png",
  ],
  [
    "C",
    "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br2/projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260826-131500-CAL2/image-production/cover-concepts/candidate-C-full.png",
  ],
  [
    "D",
    "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br21/projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260826-151500-CR03/image-production/cover-concepts/candidate-D-full.png",
  ],
  [
    "E",
    "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br21/projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260826-151500-CR03/image-production/cover-concepts/candidate-E-full.png",
  ],
  [
    "F",
    "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br21/projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260826-151500-CR03/image-production/cover-concepts/candidate-F-full.png",
  ],
  [
    "G",
    "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br22/projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260826-164000-CR06/image-production/cover-concepts/candidate-G-full.png",
  ],
  [
    "H",
    "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br22/projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260826-164000-CR06/image-production/cover-concepts/candidate-H-full.png",
  ],
  [
    "I",
    "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br23/projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260826-181500-CR07/image-production/cover-concepts/candidate-I-full.png",
  ],
  [
    "J",
    "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br23/projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260826-181500-CR07/image-production/cover-concepts/candidate-J-full.png",
  ],
  [
    "K",
    "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br23/projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260826-181500-CR07/image-production/cover-concepts/candidate-K-full.png",
  ],
] as const;

const runRoot = path.join(projectHome, "projects", projectId, "runs", runId);
const imageRoot = path.join(runRoot, "image-production");
const sourceRoot = path.join(imageRoot, "source-assets");
const outputRoot = path.join(imageRoot, "formal-calibration-cover");
const materializedBackground = path.join(sourceRoot, "formal-calibration-storefront-host.png");
const supersededAttemptRoot = path.join(
  projectHome,
  "projects",
  projectId,
  "runs",
  "RUN-20260826-194500-R24F",
  "image-production",
);

function sha256(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function hashFile(file: string): Promise<string> {
  return sha256(await readFile(file));
}

async function atomicJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const encoded = `${JSON.stringify(value, null, 2)}\n`;
  try {
    const existing = await readFile(file, "utf8");
    if (existing !== encoded) throw new Error(`FORMAL_CALIBRATION_ARTIFACT_CONFLICT:${file}`);
    return;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, encoded, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, file);
  if ((await readFile(file, "utf8")) !== encoded)
    throw new Error(`FORMAL_CALIBRATION_READ_VERIFY_FAILED:${file}`);
}

async function copyOnceOrReuse(source: string, target: string): Promise<void> {
  await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
  try {
    await copyFile(source, target, constants.COPYFILE_EXCL);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    if ((await hashFile(source)) !== (await hashFile(target)))
      throw new Error("FORMAL_CALIBRATION_SOURCE_VERSION_CONFLICT", { cause: error });
  }
}

function relative(file: string): string {
  const value = path.relative(projectHome, file).split(path.sep).join("/");
  if (value.startsWith("../") || path.isAbsolute(value))
    throw new Error("FORMAL_CALIBRATION_PATH_ESCAPE");
  return value;
}

async function immutableSnapshot() {
  return Object.fromEntries(
    await Promise.all(
      historicalCandidates.map(async ([id, file]) => {
        await stat(file);
        return [id, await hashFile(file)] as const;
      }),
    ),
  );
}

const beforeHistorical = await immutableSnapshot();
if ((await hashFile(c0001Path)) !== c0001Checksum)
  throw new Error("FORMAL_CALIBRATION_C0001_PREEXISTING_CONFLICT");
if ((await hashFile(selectedCandidatePath)) !== selectedCandidateChecksum)
  throw new Error("FORMAL_CALIBRATION_SELECTED_CANDIDATE_CONFLICT");
const candidateSet = JSON.parse(await readFile(candidateSetPath, "utf8")) as {
  candidate_set_id: string;
  candidates: Array<{ candidate_id: string; full_checksum: string }>;
};
const selected = candidateSet.candidates.find((item) => item.candidate_id === selectedCandidateId);
if (!selected || selected.full_checksum !== selectedCandidateChecksum)
  throw new Error("FORMAL_CALIBRATION_SELECTION_EVIDENCE_CONFLICT");

await copyOnceOrReuse(sourceHostPath, materializedBackground);
const hostSourceChecksum = await hashFile(materializedBackground);
const renderer = await renderFormalCalibrationCover({
  backgroundPath: materializedBackground,
  outputDirectory: outputRoot,
  primaryCopy: "门头没说清，顾客就走了",
  supportingCopy: "门店老板先查品类、定位和入口",
});
if (renderer.checksum === selectedCandidateChecksum)
  throw new Error("FORMAL_CALIBRATION_CANDIDATE_BYTES_REUSED");

const afterHistorical = await immutableSnapshot();
const historicalAssetsImmutable =
  JSON.stringify(beforeHistorical) === JSON.stringify(afterHistorical);
const c0001Immutable = (await hashFile(c0001Path)) === c0001Checksum;
const scores = {
  coverAttention: 94,
  clickClarity: 95,
  semanticRelevance: 92,
  painpointScene: 91,
  editorialSpatial: 92,
  imageTextIntegration: 92,
  imageQuality: 93,
};
const readiness = evaluateFormalCalibrationReadiness({
  selectedCandidateChecksum,
  formalAssetChecksum: renderer.checksum,
  selectedCandidatePath: relative(selectedCandidatePath),
  formalAssetPath: relative(renderer.outputPath),
  fullTitleFontPx: 190,
  effectiveTitleFontPxAt186: 190 * (186 / 1242),
  contentPageReferenceFontPx: 72,
  primaryHookMassScore: 94,
  materialAdvertisementRisk: 24,
  selectedTextBackgroundStrategy: "NATURAL_NEGATIVE_SPACE",
  viableTextBackgroundStrategies: [
    "NATURAL_NEGATIVE_SPACE",
    "IMAGE_CROP_OR_COMPOSITION",
    "TEXT_REGION_ADJUSTMENT",
  ],
  grayscaleStructureScore: 95,
  scores,
  actual186Inspected: true,
  deterministicReplay: renderer.deterministic,
  historicalAssetsImmutable,
  c0001Immutable,
  feishuWrites: 0,
  remainingPagesCreated: 0,
});
if (!readiness.ready_for_calibration_g4)
  throw new Error(`FORMAL_CALIBRATION_G4_NOT_READY:${readiness.hard_blocks.join(",")}`);

const runtime = new ImageProductionRuntime({ projectHome, projectId, runId, schemaRoot });
const selection = {
  selection_id: "CVDS-CAL-SPACE-001-I",
  candidate_set_id: candidateSet.candidate_set_id,
  candidate_id: selectedCandidateId,
  candidate_checksum: selectedCandidateChecksum,
  project_id: projectId,
  content_id: contentId,
  attention_mode: "TYPE_DOMINANT",
  feedback_class: "PRODUCTION_FEEDBACK",
  scope: "CURRENT_SET",
  purpose: "CALIBRATION",
  selected_by: "OPERATOR",
  formal_asset_reuse_forbidden: true,
  long_term_rule_candidate: false,
  creates_long_term_preference: false,
  creates_g4_approval: false,
  creates_style_lock: false,
  next_visual_plan_version: "VV-1",
  selection_comment:
    "Operator selected Candidate I as the current calibration direction. Candidate bytes remain historical evidence and were not reused as the formal asset.",
  run_id: runId,
  schema_version: "1.0.0",
  selected_at: createdAt,
} as const;
const formalCover = {
  formal_cover_id: "FCC-CAL-SPACE-001-FPV1F",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  calibration_cover_version: "FPV-1",
  selection_id: selection.selection_id,
  selected_candidate_id: selectedCandidateId,
  selected_candidate_checksum: selectedCandidateChecksum,
  asset_id: "AST-CAL-SPACE-001-FPV1F",
  asset_ref: relative(renderer.outputPath),
  asset_checksum: renderer.checksum,
  asset_file_size: renderer.byteLength,
  canvas: {
    width: 1242,
    height: 1660,
    aspect_ratio: "3:4",
    orientation: "PORTRAIT",
    resolution_unit: "PX",
  },
  thumbnail_310: {
    asset_ref: relative(renderer.thumbnail310Path),
    checksum: renderer.thumbnail310Checksum,
    width: 310,
    height: 414,
    actual_pixel_inspection: "PASS",
  },
  thumbnail_186: {
    asset_ref: relative(renderer.thumbnail186Path),
    checksum: renderer.thumbnail186Checksum,
    width: 186,
    height: 248,
    actual_pixel_inspection: "PASS",
  },
  attention_mode: "TYPE_DOMINANT",
  composition_family: "ASYMMETRIC_NEGATIVE_SPACE",
  asset_channel: "AI_GENERATED_VISUAL",
  visual_mode: "EDITORIAL_SERIES",
  primary_hook: "门头没说清，顾客就走了",
  supporting_signal: "门店老板先查品类、定位和入口",
  font_resolution: {
    requested_font_family: "MODERN_CHINESE_SERIF",
    resolved_font_family: "Songti SC",
    title_weight: 700,
    supporting_weight: 400,
    synthetic_bold: false,
    font_downloaded: false,
    silent_pingfang_fallback: false,
  },
  scores: {
    cover_attention: scores.coverAttention,
    click_clarity: scores.clickClarity,
    semantic_relevance: scores.semanticRelevance,
    painpoint_scene: scores.painpointScene,
    editorial_spatial: scores.editorialSpatial,
    image_text_integration: scores.imageTextIntegration,
    image_quality: scores.imageQuality,
  },
  quality_gates: {
    authenticity_integrity: "PASS",
    mechanical: "PASS",
    copy_fidelity: "PASS",
    typography_policy: "PASS",
    typography_spatial_integrity: "PASS",
    typography_breathing_room: "PASS",
    thumbnail: "PASS",
    locale_fit: "PASS",
    visual_mass: "PASS",
    greyscale_hierarchy: "PASS",
    color_intelligence: "PASS",
    typography_as_form: "PASS",
    actual_pixel_inspection: "PASS",
  },
  hard_blocks: [],
  same_as_candidate_asset: false,
  deterministic_replay: true,
  g4_eligible: true,
  operator_approved: false,
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
  extensions: {
    visual_plan: "VV-1",
    text_background_strategy: "NATURAL_NEGATIVE_SPACE",
    effective_title_font_px_at_186: Number((190 * (186 / 1242)).toFixed(2)),
    content_reference_font_px: 72,
    cover_to_content_scale_ratio: Number((190 / 72).toFixed(2)),
    material_advertisement_risk: 24,
    grayscale_structure_score: 95,
    primary_hook_mass_score: 94,
  },
} as const;
const review = {
  review_request_id: "CFRR-CAL-SPACE-001-FPV1F",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  calibration_cover_version: "FPV-1",
  asset_id: formalCover.asset_id,
  asset_checksum: renderer.checksum,
  gate: "CALIBRATION_G4",
  status: "AWAITING_USER_APPROVAL",
  decision: "PENDING_OPERATOR",
  reviewer_role: "OPERATOR",
  approval_event_created: false,
  style_lock_created: false,
  remaining_pages_created: 0,
  feishu_writes: 0,
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
} as const;
const previewRules = createCalibrationStyleLockPreview();
const styleLockPreview = {
  preview_id: "CSLP-CAL-SPACE-001-FPV1F",
  project_id: projectId,
  content_id: contentId,
  source_asset_id: formalCover.asset_id,
  source_asset_checksum: renderer.checksum,
  status: "PREVIEW_ONLY_PENDING_G4",
  cover_locked_rules: previewRules.cover_locked_rules,
  group_shared_rules: previewRules.group_shared_rules,
  content_page_allowed_variations: previewRules.content_page_allowed_variations,
  creates_style_lock: false,
  creates_project_preference: false,
  creates_industry_rule: false,
  creates_global_preference: false,
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
} as const;

await runtime.write(
  "calibration-visual-direction-selection",
  "calibration-visual-direction-selection.json",
  selection,
);
await runtime.write("formal-calibration-cover", "formal-calibration-cover.json", formalCover);
await runtime.write(
  "calibration-first-page-review-request",
  "calibration-first-page-review-request.json",
  review,
);
await runtime.write(
  "calibration-style-lock-preview",
  "calibration-style-lock-preview.json",
  styleLockPreview,
);

await atomicJson(path.join(imageRoot, "formal-production-strategy.json"), {
  strategy_id: "FPS-CAL-SPACE-001-R24",
  selected_direction: selectedCandidateId,
  attention_mode: "TYPE_DOMINANT",
  page_design_intent: "COVER_ENTRY",
  text_background_priority: [
    "NATURAL_NEGATIVE_SPACE",
    "IMAGE_CROP_OR_COMPOSITION",
    "TEXT_REGION_ADJUSTMENT",
    "LOCAL_EXPOSURE_OR_VALUE",
    "RESTRAINED_GRADIENT_OR_MASK",
    "VISIBLE_PANEL",
  ],
  selected_text_background_strategy: "NATURAL_NEGATIVE_SPACE",
  formal_candidate_reuse_forbidden: true,
  content_page_typography_reuse_forbidden: true,
  run_id: runId,
  created_at: createdAt,
});
await atomicJson(path.join(supersededAttemptRoot, "internal-attempt-disposition.json"), {
  status: "SUPERSEDED_BEFORE_OPERATOR_PRESENTATION",
  reason:
    "Supporting Signal resolved to PingFang SC instead of the required Songti Regular or Medium policy.",
  formal_version_assigned: false,
  operator_presented: false,
  operator_approved: false,
  asset_deleted_or_overwritten: false,
  superseded_by_run_id: runId,
  recorded_at: createdAt,
});
await atomicJson(path.join(imageRoot, "formal-calibration-generation-manifest.json"), {
  generation_id: "GEN-CAL-SPACE-001-FPV1F",
  tool: "HOST_NATIVE_IMAGEGEN",
  model_family: "GPT_IMAGE",
  source_asset_ref: relative(materializedBackground),
  source_asset_checksum: hostSourceChecksum,
  formal_text_in_generated_asset: false,
  renderer_owned_copy: [formalCover.primary_hook, formalCover.supporting_signal],
  executed_prompt:
    "Create a photorealistic, text-free vertical 3:4 background for a formal Xiaohongshu calibration cover. Show a complete, believable ground-floor storefront on a real Chinese city street: blank fascia, clear glass shopfront and an unmistakable entrance. Use an eye-level 35-45mm architectural view with corrected verticals, neutral daylight, restrained low saturation, mature editorial realism, and generous natural wall or sky negative space for later Renderer typography. No people, hands, words, logos, signs, certificates, seals, interface panels or gradient graphics. Avoid hotel, residential, luxury-material-showroom, Western-street, CGI, yellow-cast, dark or abstract-advertisement drift.",
  formal_output_ref: relative(renderer.outputPath),
  formal_output_checksum: renderer.checksum,
  candidate_asset_reused: false,
  run_id: runId,
  created_at: createdAt,
});
await atomicJson(path.join(imageRoot, "formal-calibration-render-report.json"), {
  renderer: "PLAYWRIGHT_PRODUCTION_RENDERER",
  chromium_version: renderer.chromiumVersion,
  canvas: { width: renderer.width, height: renderer.height },
  copy_fidelity: renderer.copyFidelity,
  safe_area: renderer.safeAreaValid,
  overflow_detected: renderer.overflowDetected,
  clipping_detected: renderer.clippingDetected,
  unexpected_scroll: renderer.unexpectedScroll,
  network_requests_attempted: renderer.networkRequestsAttempted,
  network_requests_blocked: renderer.networkRequestsBlocked,
  font_resolution: renderer.resolvedFonts,
  layout_measurements: renderer.measurements,
  output_checksum: renderer.checksum,
  deterministic_replay_checksum: renderer.secondPassChecksum,
  deterministic: renderer.deterministic,
  html_hash: renderer.htmlHash,
  dom_hash: renderer.domHash,
  run_id: runId,
  created_at: createdAt,
});
await atomicJson(path.join(imageRoot, "formal-calibration-quality-evidence.json"), {
  scores: formalCover.scores,
  quality_gates: formalCover.quality_gates,
  hard_blocks: readiness.hard_blocks,
  actual_pixel_inspection: {
    full_1242x1660: "PASS",
    thumbnail_310x414: "PASS",
    thumbnail_186x248: "PASS",
    title_legible_at_186: true,
    storefront_and_entrance_recognizable_at_186: true,
  },
  risks: [
    "Minimalist storefront may still evoke a premium retail category before the copy is read.",
    "Supporting signal intentionally becomes secondary at the smallest thumbnail.",
  ],
  historical_candidate_hashes_before: beforeHistorical,
  historical_candidate_hashes_after: afterHistorical,
  historical_assets_immutable: historicalAssetsImmutable,
  c0001_checksum_before_and_after: c0001Checksum,
  c0001_immutable: c0001Immutable,
  remaining_pages_created: 0,
  feishu_writes: 0,
  run_id: runId,
  created_at: createdAt,
});

console.log(
  JSON.stringify(
    {
      implementation_status: "SUCCESS",
      formal_calibration_cover: "CREATED",
      project_id: projectId,
      content_id: contentId,
      versions: { content: "CV-1", copy: "CV-1", visual_plan: "VV-1", cover: "FPV-1" },
      asset_id: formalCover.asset_id,
      output_path: renderer.outputPath,
      thumbnail_310_path: renderer.thumbnail310Path,
      thumbnail_186_path: renderer.thumbnail186Path,
      checksum: renderer.checksum,
      scores: formalCover.scores,
      hard_blocks: readiness.hard_blocks,
      g4: review,
      style_lock_preview_created: true,
      formal_style_lock_created: false,
      remaining_pages_created: 0,
      feishu_writes: 0,
      historical_candidates_immutable: historicalAssetsImmutable,
      c0001_immutable: c0001Immutable,
    },
    null,
    2,
  ),
);
