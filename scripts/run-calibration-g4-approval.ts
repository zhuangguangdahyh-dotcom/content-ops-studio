import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import type {
  ApprovalEvent,
  CalibrationG4Approval,
  CalibrationStyleLock,
  FirstPageReview,
  StyleLock,
  UniversalVisualCalibrationValidation,
} from "../packages/contracts/src/generated/1.0/index.js";
import {
  CALIBRATION_CONTENT_PAGE_ALLOWED_VARIATIONS,
  CALIBRATION_COVER_LOCKED_RULES,
  CALIBRATION_GROUP_SHARED_RULES,
  CALIBRATION_PROHIBITED_DEVIATIONS,
  CALIBRATION_UNIVERSAL_TEMPLATE_EXCLUSIONS,
  CALIBRATION_VALIDATED_SYSTEMS,
  assertCalibrationG4Ready,
  calibrationG4TargetVersion,
  type CalibrationG4Binding,
} from "../packages/core/src/visual-baseline/calibration-g4.js";
import { FirstPageRuntime } from "../packages/runtime/src/first-page/index.js";
import { ImageProductionRuntime } from "../packages/runtime/src/image-production/index.js";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const schemaRoot = path.join(repositoryRoot, "plugins/content-ops-studio/schemas/1.0");
const projectHome =
  process.env.CONTENT_OPS_HOME ??
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br23";
const projectId = "CAL-COMMERCIAL-SPACE-001";
const contentId = "C-9001";
const formalRunId = "RUN-20260826-204500-R25C";
const approvalRunId = "RUN-20260826-213000-G4A1";
const createdAt = "2026-08-26T13:30:00.000Z";
const assetId = "AST-CAL-SPACE-001-FPV2C";
const expectedAssetChecksum = "616d4eb80d06587f187880ecb9e4a447ce537da937b267b6691436b2672bf274";
const fpv1Checksum = "e4e55909c01a4e72ce4ea897d9bed14aa62dd2e5836f91a65eebb171d5e6133c";
const c0001Checksum = "b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5";
const formalImageRoot = path.join(
  projectHome,
  "projects",
  projectId,
  "runs",
  formalRunId,
  "image-production",
);
const formalCoverPath = path.join(formalImageRoot, "formal-calibration-cover.json");
const contrastPath = path.join(formalImageRoot, "fpv2-text-background-contrast-report.json");
const reviewRequestPath = path.join(formalImageRoot, "calibration-first-page-review-request.json");
const fpv1Path = path.join(
  projectHome,
  "projects",
  projectId,
  "runs",
  "RUN-20260826-200000-R24G",
  "image-production/formal-calibration-cover/formal-calibration-cover-fpv1.png",
);
const c0001Path =
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4b/projects/PRJ-20260824-P2B2/runs/RUN-20260825-174500-P4BF/outputs/first-page/01-cover_fpv2.png";

function sha256(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function hashFile(file: string): Promise<string> {
  return sha256(await readFile(file));
}

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(file, "utf8")) as T;
}

function relative(file: string): string {
  const value = path.relative(projectHome, file).split(path.sep).join("/");
  if (value.startsWith("../") || path.isAbsolute(value))
    throw new Error("CALIBRATION_G4_PATH_ESCAPE");
  return value;
}

async function filesRecursively(root: string): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...(await filesRecursively(file)));
    else if (entry.isFile()) result.push(file);
  }
  return result.sort();
}

async function priorRunSnapshot(): Promise<Map<string, string>> {
  const runsRoot = path.join(projectHome, "projects", projectId, "runs");
  const files = await filesRecursively(runsRoot);
  const currentSegment = `${path.sep}${approvalRunId}${path.sep}`;
  const priorFiles = files.filter((file) => !file.includes(currentSegment));
  return new Map(
    await Promise.all(
      priorFiles.map(async (file) => [relative(file), await hashFile(file)] as const),
    ),
  );
}

function assertSnapshotsEqual(before: Map<string, string>, after: Map<string, string>): void {
  if (before.size !== after.size) throw new Error("CALIBRATION_G4_HISTORY_FILE_COUNT_CONFLICT");
  for (const [file, checksum] of before) {
    if (after.get(file) !== checksum) throw new Error(`CALIBRATION_G4_HISTORY_CONFLICT:${file}`);
  }
}

interface FormalCoverEvidence {
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  calibration_cover_version: string;
  asset_id: string;
  asset_ref: string;
  asset_checksum: string;
  asset_file_size: number;
  canvas: StyleLock["locked_canvas"];
  thumbnail_310: { asset_ref: string; checksum: string };
  thumbnail_186: { asset_ref: string; checksum: string };
  attention_mode: string;
  asset_channel: string;
  visual_mode: StyleLock["locked_visual_mode"];
  font_resolution: {
    resolved_font_family: string;
    title_weight: number;
    supporting_weight: number;
  };
  quality_gates: Record<string, string>;
  hard_blocks: string[];
  deterministic_replay: boolean;
  g4_eligible: boolean;
  run_id: string;
}

interface ContrastEvidence {
  asset_checksum: string;
  result: string;
  hard_blocks: string[];
}

interface ReviewRequestEvidence {
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  calibration_cover_version: string;
  asset_id: string;
  asset_checksum: string;
  status: string;
  decision: string;
  run_id: string;
}

const historicalBefore = await priorRunSnapshot();
if ((await hashFile(fpv1Path)) !== fpv1Checksum) throw new Error("CALIBRATION_G4_FPV1_CONFLICT");
if ((await hashFile(c0001Path)) !== c0001Checksum) throw new Error("CALIBRATION_G4_C0001_CONFLICT");

const formalCover = await readJson<FormalCoverEvidence>(formalCoverPath);
const contrast = await readJson<ContrastEvidence>(contrastPath);
const reviewRequest = await readJson<ReviewRequestEvidence>(reviewRequestPath);
const fpv2Path = path.join(projectHome, formalCover.asset_ref);
const replayPath = path.join(
  path.dirname(fpv2Path),
  "formal-calibration-cover-fpv2-deterministic-replay.png",
);
const backgroundAnalysisPath = path.join(
  path.dirname(fpv2Path),
  "formal-calibration-cover-fpv2-background-analysis.png",
);
const actualAssetChecksum = await hashFile(fpv2Path);
const replayChecksum = await hashFile(replayPath);
if (actualAssetChecksum !== expectedAssetChecksum || replayChecksum !== expectedAssetChecksum)
  throw new Error("CALIBRATION_G4_FPV2_CHECKSUM_CONFLICT");
if (contrast.asset_checksum !== expectedAssetChecksum)
  throw new Error("CALIBRATION_G4_CONTRAST_BINDING_CONFLICT");
if (Object.values(formalCover.quality_gates).some((result) => result !== "PASS"))
  throw new Error("CALIBRATION_G4_QUALITY_GATE_BLOCKED");

const binding: CalibrationG4Binding = {
  projectId,
  contentId,
  contentVersion: "CV-1",
  copyVersion: "CV-1",
  visualPlanVersion: "VV-1",
  firstPageVersion: "FPV-2",
  assetId,
  assetChecksum: expectedAssetChecksum,
  formalRunId,
};
assertCalibrationG4Ready({
  expected: binding,
  actual: {
    projectId: reviewRequest.project_id,
    contentId: reviewRequest.content_id,
    contentVersion: reviewRequest.content_version,
    copyVersion: reviewRequest.copy_version,
    visualPlanVersion: reviewRequest.visual_plan_version,
    firstPageVersion: reviewRequest.calibration_cover_version,
    assetId: reviewRequest.asset_id,
    assetChecksum: reviewRequest.asset_checksum,
    formalRunId: reviewRequest.run_id,
  },
  attentionMode: formalCover.attention_mode,
  reviewStatus: reviewRequest.status,
  reviewDecision: reviewRequest.decision,
  formalCoverEligible: formalCover.g4_eligible,
  formalHardBlocks: formalCover.hard_blocks,
  contrastResult: contrast.result,
  contrastHardBlocks: contrast.hard_blocks,
});

const approvalId = "APR-20260826-G4A1";
const approvalEvent: ApprovalEvent = {
  approval_id: approvalId,
  gate: "FIRST_PAGE",
  target_type: "FIRST_PAGE_ASSET",
  target_id: assetId,
  target_version: calibrationG4TargetVersion(binding),
  decision: "APPROVE",
  comment:
    "Operator approved the existing verified FPV-2 for Universal Visual Calibration; accepted risks are non-blocking.",
  source_run_id: formalRunId,
  created_at: createdAt,
  deprecated_at: null,
  schema_version: "1.0.0",
};
const review: FirstPageReview = {
  first_page_review_id: "FPR-CAL-SPACE-001-FPV2",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  first_page_version: "FPV-2",
  asset_checksum: expectedAssetChecksum,
  decision: "APPROVE",
  overall_comment:
    "Operator confirms that FPV-2 meets the formal Universal Visual Calibration first-page requirements.",
  layout_feedback: "The current composition is approved for this calibration object only.",
  typography_feedback: "Typography hierarchy, breathing room and raster contrast are approved.",
  color_feedback: "The restrained upper-right local value correction is accepted as non-blocking.",
  hierarchy_feedback:
    "Primary Hook and Supporting Signal remain clear at the actual 186x248 thumbnail.",
  graphic_feedback:
    "A slight premium-retail association before reading copy is accepted as non-blocking.",
  copy_feedback: "The approved calibration copy is unchanged.",
  requested_changes: [],
  revision_classification: "NONE",
  reviewer_role: "OPERATOR",
  source_run_id: formalRunId,
  created_at: createdAt,
  schema_version: "1.0.0",
  extensions: {
    calibration_gate: "CALIBRATION_G4",
    accepted_non_blocking_risks: [
      "Premium-retail association remains possible before copy is read.",
      "Restrained local value correction remains visible in the upper-right region.",
    ],
  },
};

const approvalRuntime = new ImageProductionRuntime({
  projectHome,
  projectId,
  runId: approvalRunId,
  schemaRoot,
});
await mkdir(approvalRuntime.root, { recursive: true, mode: 0o700 });
const firstPageRuntime = new FirstPageRuntime(
  path.join(approvalRuntime.root, "calibration-g4-runtime-state.json"),
);
const pending = {
  project_id: projectId,
  content_id: contentId,
  run_id: formalRunId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  first_page_version: "FPV-2",
  asset_id: assetId,
  asset_checksum: expectedAssetChecksum,
  renderer_environment_ref: relative(formalCoverPath),
  status: "AWAITING_USER_APPROVAL" as const,
  style_lock_version: null,
  approval_id: null,
};
const stateBefore = await firstPageRuntime.read();
if (!stateBefore) await firstPageRuntime.recordPending(pending);
else if (stateBefore.status !== "APPROVED") await firstPageRuntime.recordPending(pending);

const finalizationInput: Parameters<FirstPageRuntime["finalizeG4"]>[0] = {
  review,
  approval: approvalEvent,
  styleLockId: "SL-CAL-SPACE-001-V1",
  styleLockVersion: "SLV-1",
  sourceFirstPagePlanId: "PVP-CAL-SPACE-001-FPV2",
  sourceAsset: {
    asset_id: assetId,
    asset_role: "RENDERED_PAGE",
    asset_type: "IMAGE",
    mime_type: "image/png",
    relative_path: formalCover.asset_ref,
    source_type: "RENDERED",
    source_adapter: "PlaywrightHtmlCssRendererAdapter",
    source_run_id: formalRunId,
    source_generation_id: "GEN-CAL-SPACE-001-FPV2C",
    version: 2,
    width: formalCover.canvas.width,
    height: formalCover.canvas.height,
    file_size: (await stat(fpv2Path)).size,
    checksum: expectedAssetChecksum,
    created_at: createdAt,
    extensions: { host_asset_channel: formalCover.asset_channel },
  },
  canvas: formalCover.canvas,
  safeArea: { top: 70, right: 70, bottom: 70, left: 70, unit: "PX" },
  typography: [
    {
      token_id: "TYPO-CALIBRATION-COVER-PRIMARY",
      role: "TITLE",
      font_family: formalCover.font_resolution.resolved_font_family,
      font_weight: formalCover.font_resolution.title_weight,
      font_size: 172,
      line_height: 1.15,
      letter_spacing: 0,
      alignment: "LEFT",
      max_lines: 2,
      overflow_strategy: "REFLOW",
    },
    {
      token_id: "TYPO-CALIBRATION-COVER-SUPPORTING",
      role: "SUPPORTING",
      font_family: formalCover.font_resolution.resolved_font_family,
      font_weight: formalCover.font_resolution.supporting_weight,
      font_size: 96,
      line_height: 1.3,
      letter_spacing: 0,
      alignment: "LEFT",
      max_lines: 2,
      overflow_strategy: "REFLOW",
    },
  ],
  colors: [
    {
      token_id: "COLOR-CALIBRATION-PRIMARY",
      role: "PRIMARY_TEXT",
      value: "#101010",
      color_space: "HEX",
      opacity: 1,
    },
    {
      token_id: "COLOR-CALIBRATION-SUPPORTING",
      role: "SECONDARY_TEXT",
      value: "#111111",
      color_space: "HEX",
      opacity: 1,
    },
  ],
  grid: { system: "CALIBRATION_EDITORIAL", columns: 12, gutter: 24 },
  imageTreatment: {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
    overlay: "restrained-local-value-correction",
    gradient: "none",
    mask: "none",
    crop_strategy: "COVER",
  },
  visualMode: formalCover.visual_mode,
  createdAt,
};
const finalized = await firstPageRuntime.finalizeG4(finalizationInput);
let genericStyleLock = finalized.styleLock;
if (!genericStyleLock) {
  genericStyleLock = await readJson<StyleLock>(path.join(approvalRuntime.root, "style-lock.json"));
}

const evidenceFiles = [
  ["FORMAL_COVER", formalCoverPath],
  ["RASTER_CONTRAST", contrastPath],
  ["FULL_PNG", fpv2Path],
  ["DETERMINISTIC_REPLAY", replayPath],
  ["THUMBNAIL_310", path.join(projectHome, formalCover.thumbnail_310.asset_ref)],
  ["THUMBNAIL_186", path.join(projectHome, formalCover.thumbnail_186.asset_ref)],
  ["BACKGROUND_ANALYSIS", backgroundAnalysisPath],
] as const;
const qaEvidence = await Promise.all(
  evidenceFiles.map(async ([evidenceType, file]) => ({
    evidence_type: evidenceType,
    artifact_ref: relative(file),
    checksum: await hashFile(file),
    result: "PASS" as const,
  })),
);
const idempotencyKey = sha256(
  JSON.stringify({ binding, decision: "APPROVE", qaEvidence, acceptedRisks: review.extensions }),
);
const approvalEvidence: CalibrationG4Approval = {
  approval_evidence_id: "CG4A-CAL-SPACE-001-FPV2",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  first_page_version: "FPV-2",
  asset_id: assetId,
  asset_checksum: expectedAssetChecksum,
  attention_mode: "TYPE_DOMINANT",
  formal_run_id: formalRunId,
  decision: "APPROVE",
  status: "PASSED",
  approval_event: approvalEvent,
  qa_evidence: qaEvidence as CalibrationG4Approval["qa_evidence"],
  hard_blocks: [],
  requested_changes: [],
  accepted_non_blocking_risks: [
    "Premium-retail association remains possible before copy is read.",
    "Restrained local value correction remains visible in the upper-right region.",
  ],
  style_lock_authorized: true,
  remaining_page_production_eligibility: "ELIGIBLE",
  remaining_pages_created: 0,
  image_generation_calls: 0,
  feishu_writes: 0,
  idempotency_key: idempotencyKey,
  run_id: approvalRunId,
  schema_version: "1.0.0",
  created_at: createdAt,
};
const calibrationStyleLock: CalibrationStyleLock = {
  style_lock_id: "CSL-CAL-SPACE-001-V1",
  style_lock_version: "SLV-1",
  status: "CREATED",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  first_page_version: "FPV-2",
  source_asset_id: assetId,
  source_asset_checksum: expectedAssetChecksum,
  source_approval_id: approvalId,
  source_approval_evidence_id: approvalEvidence.approval_evidence_id,
  cover_locked_rules: [...CALIBRATION_COVER_LOCKED_RULES],
  group_shared_rules: [...CALIBRATION_GROUP_SHARED_RULES],
  content_page_allowed_variations: [...CALIBRATION_CONTENT_PAGE_ALLOWED_VARIATIONS],
  prohibited_deviations: [...CALIBRATION_PROHIBITED_DEVIATIONS],
  lock_scope: "CALIBRATION_DESIGN_QA_LOGIC",
  universal_template_created: false,
  universal_template_exclusions: [...CALIBRATION_UNIVERSAL_TEMPLATE_EXCLUSIONS],
  remaining_page_production_eligibility: "ELIGIBLE",
  remaining_pages_created: 0,
  feishu_writes: 0,
  idempotency_key: idempotencyKey,
  run_id: approvalRunId,
  schema_version: "1.0.0",
  created_at: createdAt,
  invalidated_at: null,
};
const validation: UniversalVisualCalibrationValidation = {
  validation_id: "UVCV-CAL-SPACE-001-V1",
  status: "CALIBRATION_VALIDATED_V1",
  validation_scope: "RULES_KNOWLEDGE_QA_AND_DECISION_SYSTEMS_ONLY",
  project_id: projectId,
  content_id: contentId,
  source_approval_id: approvalId,
  source_style_lock_id: calibrationStyleLock.style_lock_id,
  validated_systems: CALIBRATION_VALIDATED_SYSTEMS.map((system) => ({
    system,
    status: "CALIBRATION_VALIDATED_V1" as const,
  })) as UniversalVisualCalibrationValidation["validated_systems"],
  universal_template_created: false,
  universal_template_exclusions: [...CALIBRATION_UNIVERSAL_TEMPLATE_EXCLUSIONS],
  project_profile_mutated: false,
  industry_pack_mutated: false,
  universal_default_mutated: false,
  c0001_unchanged: true,
  historical_assets_preserved: true,
  remaining_page_production_eligibility: "ELIGIBLE",
  remaining_pages_created: 0,
  image_generation_calls: 0,
  feishu_writes: 0,
  idempotency_key: idempotencyKey,
  run_id: approvalRunId,
  schema_version: "1.0.0",
  created_at: createdAt,
};

const artifacts = [
  ["first-page-review", "first-page-review.json", review],
  ["approval-event", "approval-event.json", approvalEvent],
  ["style-lock", "style-lock.json", genericStyleLock],
  ["calibration-g4-approval", "calibration-g4-approval.json", approvalEvidence],
  ["calibration-style-lock", "calibration-style-lock-v1.json", calibrationStyleLock],
  [
    "universal-visual-calibration-validation",
    "universal-visual-calibration-validation-v1.json",
    validation,
  ],
] as const;
const firstWrites = await Promise.all(
  artifacts.map(([logicalName, filename, value]) =>
    approvalRuntime.writeOnceOrReuse(logicalName, filename, value),
  ),
);
const replayWrites = await Promise.all(
  artifacts.map(([logicalName, filename, value]) =>
    approvalRuntime.writeOnceOrReuse(logicalName, filename, value),
  ),
);
if (replayWrites.some((entry) => !entry.reused))
  throw new Error("CALIBRATION_G4_IDEMPOTENT_ARTIFACT_REPLAY_FAILED");
const stateReplay = await firstPageRuntime.finalizeG4(finalizationInput);
if (!stateReplay.reused || stateReplay.styleLock !== null)
  throw new Error("CALIBRATION_G4_IDEMPOTENT_STATE_REPLAY_FAILED");

assertSnapshotsEqual(historicalBefore, await priorRunSnapshot());
if ((await hashFile(fpv1Path)) !== fpv1Checksum)
  throw new Error("CALIBRATION_G4_FPV1_POSTWRITE_CONFLICT");
if ((await hashFile(fpv2Path)) !== expectedAssetChecksum)
  throw new Error("CALIBRATION_G4_FPV2_POSTWRITE_CONFLICT");
if ((await hashFile(c0001Path)) !== c0001Checksum)
  throw new Error("CALIBRATION_G4_C0001_POSTWRITE_CONFLICT");
const approvalRunFiles = await filesRecursively(approvalRuntime.root);
if (approvalRunFiles.some((file) => /\.(?:png|jpe?g|webp|gif)$/iu.test(file)))
  throw new Error("CALIBRATION_G4_UNEXPECTED_IMAGE_OUTPUT");

console.log(
  JSON.stringify(
    {
      status: "SUCCESS",
      calibration_g4: "PASSED",
      calibration_style_lock: "CREATED",
      style_lock_version: "SLV-1",
      universal_visual_calibration: "CALIBRATION_VALIDATED_V1",
      remaining_page_production_eligibility: "ELIGIBLE",
      remaining_pages_created: 0,
      image_generation_calls: 0,
      feishu_writes: 0,
      fpv1: "PRESERVED / QUALITY_DEFECT_REFERENCE",
      fpv2_checksum: expectedAssetChecksum,
      formal_run_id: formalRunId,
      approval_run_id: approvalRunId,
      approval_id: approvalId,
      approval_evidence_id: approvalEvidence.approval_evidence_id,
      style_lock_id: calibrationStyleLock.style_lock_id,
      validation_id: validation.validation_id,
      qa_evidence_count: qaEvidence.length,
      first_write_reused: firstWrites.every((entry) => entry.reused),
      idempotent_artifact_replay: "PASS",
      idempotent_state_replay: "PASS",
      historical_assets_preserved: true,
      c0001_unchanged: true,
      output_root: approvalRuntime.root,
    },
    null,
    2,
  ),
);
