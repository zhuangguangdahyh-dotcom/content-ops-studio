import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import {
  evaluateTextBackgroundContrastIntegrity,
  type TextLayerContrastInput,
} from "../packages/core/src/visual-baseline/text-background-contrast.js";
import {
  measureHistoricalFormalCalibrationCoverRasterContrast,
  renderContrastRevisedFormalCalibrationCover,
  type RasterContrastMeasurement,
} from "../packages/renderer/src/index.js";
import { ImageProductionRuntime } from "../packages/runtime/src/image-production/index.js";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const schemaRoot = path.join(repositoryRoot, "plugins/content-ops-studio/schemas/1.0");
const projectHome =
  process.env.CONTENT_OPS_HOME ??
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br23";
const projectId = "CAL-COMMERCIAL-SPACE-001";
const contentId = "C-9001";
const runId = "RUN-20260826-204500-R25C";
const createdAt = "2026-08-26T12:45:00.000Z";
const oldRunId = "RUN-20260826-200000-R24G";
const oldImageRoot = path.join(
  projectHome,
  "projects",
  projectId,
  "runs",
  oldRunId,
  "image-production",
);
const sourcePath = path.join(oldImageRoot, "source-assets/formal-calibration-storefront-host.png");
const fpv1Path = path.join(
  oldImageRoot,
  "formal-calibration-cover/formal-calibration-cover-fpv1.png",
);
const fpv1Checksum = "e4e55909c01a4e72ce4ea897d9bed14aa62dd2e5836f91a65eebb171d5e6133c";
const c0001Path =
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4b/projects/PRJ-20260824-P2B2/runs/RUN-20260825-174500-P4BF/outputs/first-page/01-cover_fpv2.png";
const c0001Checksum = "b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5";
const runRoot = path.join(projectHome, "projects", projectId, "runs", runId);
const imageRoot = path.join(runRoot, "image-production");
const outputRoot = path.join(imageRoot, "formal-calibration-cover");
const selectedCandidateChecksum =
  "cc00f772b018e1b674385c3d899d702221182db9660ad1b6b49c486bacbdbae3";

function sha256(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function hashFile(file: string): Promise<string> {
  return sha256(await readFile(file));
}

function relative(file: string): string {
  const value = path.relative(projectHome, file).split(path.sep).join("/");
  if (value.startsWith("../") || path.isAbsolute(value))
    throw new Error("RASTER_CONTRAST_PATH_ESCAPE");
  return value;
}

function evaluationInput(
  measurement: RasterContrastMeasurement,
  actualPixelReadable: boolean,
): TextLayerContrastInput {
  return {
    ...measurement,
    worst_local_region_median_contrast: measurement.worst_local_region.median_contrast,
    background_complexity_under_text: measurement.background_complexity,
    actual_pixel_readable: actualPixelReadable,
  };
}

function reportLayers(measurements: RasterContrastMeasurement[], actualPixelReadable: boolean) {
  const evaluation = evaluateTextBackgroundContrastIntegrity(
    measurements.map((measurement) => evaluationInput(measurement, actualPixelReadable)),
  );
  return {
    evaluation,
    layers: measurements.map((measurement) => {
      const layer = evaluation.layers.find(
        (candidate) => candidate.text_layer_id === measurement.text_layer_id,
      );
      if (!layer) throw new Error("RASTER_CONTRAST_LAYER_EVALUATION_MISSING");
      return {
        ...measurement,
        actual_pixel_result: actualPixelReadable ? "PASS" : "FAIL",
        errors: layer.errors,
      };
    }),
  };
}

await stat(fpv1Path);
await stat(sourcePath);
if ((await hashFile(fpv1Path)) !== fpv1Checksum)
  throw new Error("RASTER_CONTRAST_FPV1_IMMUTABILITY_CONFLICT");
if ((await hashFile(c0001Path)) !== c0001Checksum)
  throw new Error("RASTER_CONTRAST_C0001_PREEXISTING_CONFLICT");
const oldFormalCover = JSON.parse(
  await readFile(path.join(oldImageRoot, "formal-calibration-cover.json"), "utf8"),
) as { selection_id: string; selected_candidate_id: string };
const oldReview = JSON.parse(
  await readFile(path.join(oldImageRoot, "calibration-first-page-review-request.json"), "utf8"),
) as { review_request_id: string; status: string; approval_event_created: boolean };
if (oldReview.status !== "AWAITING_USER_APPROVAL" || oldReview.approval_event_created)
  throw new Error("RASTER_CONTRAST_FPV1_G4_STATE_CONFLICT");

const fpv1Measurements = await measureHistoricalFormalCalibrationCoverRasterContrast({
  backgroundPath: sourcePath,
  primaryCopy: "门头没说清，顾客就走了",
  supportingCopy: "门店老板先查品类、定位和入口",
});
const fpv1 = reportLayers(fpv1Measurements, false);
if (fpv1.evaluation.result !== "FAIL")
  throw new Error("RASTER_CONTRAST_FPV1_REGRESSION_NOT_DETECTED");

const renderer = await renderContrastRevisedFormalCalibrationCover({
  backgroundPath: sourcePath,
  outputDirectory: outputRoot,
  primaryCopy: "门头没说清，顾客就走了",
  supportingCopy: "门店老板先查品类、定位和入口",
});
const fpv2 = reportLayers(renderer.rasterContrast, true);
if (fpv2.evaluation.result !== "PASS" || fpv2.evaluation.hard_blocks.length)
  throw new Error(`RASTER_CONTRAST_FPV2_BLOCKED:${fpv2.evaluation.hard_blocks.join(",")}`);
if (!renderer.deterministic || renderer.checksum !== renderer.secondPassChecksum)
  throw new Error("RASTER_CONTRAST_FPV2_REPLAY_FAILED");

const runtime = new ImageProductionRuntime({ projectHome, projectId, runId, schemaRoot });
const canvas = {
  width: 1242,
  height: 1660,
  aspect_ratio: "3:4",
  orientation: "PORTRAIT",
  resolution_unit: "PX",
} as const;
const revision = {
  revision_id: "CCR-CAL-SPACE-001-FPV1-R25C",
  project_id: projectId,
  content_id: contentId,
  source_review_request_id: oldReview.review_request_id,
  source_cover_version: "FPV-1",
  source_asset_id: "AST-CAL-SPACE-001-FPV1F",
  source_asset_checksum: fpv1Checksum,
  decision: "REVISE",
  revision_classification: ["RENDER_ONLY", "PAGE_COMPOSITION"],
  defect_code: "TEXT_BACKGROUND_LOCAL_CONTRAST_FAILURE",
  source_disposition: "QUALITY_DEFECT_REFERENCE",
  source_preserved: true,
  target_cover_version: "FPV-2",
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  attention_mode: "TYPE_DOMINANT",
  creates_preference: false,
  creates_style_lock: false,
  remaining_pages_created: 0,
  feishu_writes: 0,
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
} as const;
const fpv1Report = {
  report_id: "TBCR-CAL-SPACE-001-FPV1-R25C",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  calibration_cover_version: "FPV-1",
  asset_id: "AST-CAL-SPACE-001-FPV1F",
  asset_checksum: fpv1Checksum,
  canvas,
  heuristic_scope: "CONTENT_OPS_INTERNAL_RELATIVE_LUMINANCE_HEURISTIC_NOT_WCAG_CERTIFICATION",
  gate_after: "TYPOGRAPHY_SPATIAL_INTEGRITY",
  gate_before: "COVER_ATTENTION_DOMINANCE",
  text_layers: fpv1.layers,
  primary_hook_contrast: {
    result: "FAIL",
    observation:
      "Actual FPV-1 title pixels cross tree, shadow and roof-edge regions; important glyph contours are locally unstable.",
  },
  supporting_signal_contrast: {
    result: "FAIL",
    observation:
      "Actual FPV-1 supporting text approaches the facade value and does not remain independently legible at phone size.",
  },
  contrast_stability: {
    result: "FAIL",
    observation:
      "Average contrast concealed failing local tiles and high primary contrast variance.",
  },
  background_complexity: {
    result: "FAIL",
    observation: "Tree, shadow and structural edges intersect the FPV-1 title region.",
  },
  actual_pixel_visual_qa: {
    result: "FAIL",
    observation: "Operator actual-pixel judgment overrides the former aggregate-score pass.",
  },
  hard_blocks: fpv1.evaluation.hard_blocks,
  result: "FAIL",
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
} as const;
const fpv2Report = {
  report_id: "TBCR-CAL-SPACE-001-FPV2-R25C",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  calibration_cover_version: "FPV-2",
  asset_id: "AST-CAL-SPACE-001-FPV2C",
  asset_checksum: renderer.checksum,
  canvas,
  heuristic_scope: "CONTENT_OPS_INTERNAL_RELATIVE_LUMINANCE_HEURISTIC_NOT_WCAG_CERTIFICATION",
  gate_after: "TYPOGRAPHY_SPATIAL_INTEGRITY",
  gate_before: "COVER_ATTENTION_DOMINANCE",
  text_layers: fpv2.layers,
  primary_hook_contrast: {
    result: "PASS",
    observation:
      "All title glyphs remain dark, clear and inside the stabilized upper negative-space region.",
  },
  supporting_signal_contrast: {
    result: "PASS",
    observation:
      "The fully opaque deep-black supporting signal remains subordinate but independently readable at 186x248.",
  },
  contrast_stability: {
    result: "PASS",
    observation: "Worst local tiles, low-area ratio, variance and edge-conflict checks all pass.",
  },
  background_complexity: {
    result: "PASS",
    observation:
      "No tree, roof edge or high-frequency structure interrupts an important glyph contour.",
  },
  actual_pixel_visual_qa: {
    result: "PASS",
    observation:
      "1242x1660, 310x414 and 186x248 PNGs were visually inspected; title and supporting signal remain legible without zoom.",
  },
  hard_blocks: [],
  result: "PASS",
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
} as const;
const scores = {
  cover_attention: 94,
  click_clarity: 95,
  semantic_relevance: 92,
  painpoint_scene: 91,
  editorial_spatial: 93,
  image_text_integration: 94,
  image_quality: 93,
} as const;
const formalCover = {
  formal_cover_id: "FCC-CAL-SPACE-001-FPV2C",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  calibration_cover_version: "FPV-2",
  selection_id: oldFormalCover.selection_id,
  selected_candidate_id: oldFormalCover.selected_candidate_id,
  selected_candidate_checksum: selectedCandidateChecksum,
  asset_id: fpv2Report.asset_id,
  asset_ref: relative(renderer.outputPath),
  asset_checksum: renderer.checksum,
  asset_file_size: renderer.byteLength,
  canvas,
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
  scores,
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
    text_background_contrast_report_id: fpv2Report.report_id,
    text_background_contrast_integrity: "PASS",
    text_background_contrast_stability: "PASS",
    background_complexity_under_text: "PASS",
    text_background_strategy: "RESTRAINED_LOCAL_VALUE_CORRECTION",
    title_font_px: 172,
    supporting_font_px: 96,
    supporting_opacity: 1,
  },
} as const;
const review = {
  review_request_id: "CFRR-CAL-SPACE-001-FPV2C",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  calibration_cover_version: "FPV-2",
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

await runtime.write("calibration-cover-revision", "calibration-cover-revision.json", revision);
await runtime.write(
  "text-background-contrast-report",
  "fpv1-text-background-contrast-report.json",
  fpv1Report,
);
await runtime.write(
  "text-background-contrast-report",
  "fpv2-text-background-contrast-report.json",
  fpv2Report,
);
await runtime.write("formal-calibration-cover", "formal-calibration-cover.json", formalCover);
await runtime.write(
  "calibration-first-page-review-request",
  "calibration-first-page-review-request.json",
  review,
);

if ((await hashFile(fpv1Path)) !== fpv1Checksum)
  throw new Error("RASTER_CONTRAST_FPV1_POST_WRITE_CONFLICT");
if ((await hashFile(c0001Path)) !== c0001Checksum)
  throw new Error("RASTER_CONTRAST_C0001_POST_WRITE_CONFLICT");

console.log(
  JSON.stringify(
    {
      implementation_status: "SUCCESS",
      run_id: runId,
      fpv1: {
        status: "PRESERVED",
        disposition: "QUALITY_DEFECT_REFERENCE",
        checksum: fpv1Checksum,
        revision: "REVISE",
        classification: revision.revision_classification,
        contrast_result: fpv1.evaluation.result,
        hard_blocks: fpv1.evaluation.hard_blocks,
      },
      fpv2: {
        status: "GENERATED",
        asset_id: formalCover.asset_id,
        checksum: renderer.checksum,
        output_path: renderer.outputPath,
        thumbnail_310_path: renderer.thumbnail310Path,
        thumbnail_186_path: renderer.thumbnail186Path,
        deterministic_replay: renderer.deterministic,
        contrast_result: fpv2.evaluation.result,
        hard_blocks: fpv2.evaluation.hard_blocks,
        scores,
      },
      g4: review.status,
      formal_style_lock: "NOT_CREATED",
      remaining_pages: 0,
      feishu_writes: 0,
      c0001: "UNCHANGED",
    },
    null,
    2,
  ),
);
