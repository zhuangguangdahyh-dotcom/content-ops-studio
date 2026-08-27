import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import {
  allocateNextCalibrationVersion,
  assertCalibrationG3Binding,
  assertCalibrationPageOneReuseEligibility,
  calibrationG3TargetVersion,
  type CalibrationG3Binding,
} from "../packages/core/src/content/calibration-repair.js";
import { CalibrationContentRepairRuntime } from "../packages/runtime/src/content/calibration-repair.js";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const schemaRoot = path.join(repositoryRoot, "plugins/content-ops-studio/schemas/1.0");
const projectHome =
  process.env.CONTENT_OPS_HOME ??
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br23";
const projectId = "CAL-COMMERCIAL-SPACE-001";
const contentId = "C-9001";
const stepARunId = "RUN-20260826-223000-C4R1";
const runId = "RUN-20260827-001500-C4B1";
const createdAt = "2026-08-26T16:15:00.000Z";
const expectedPackageHash = "3d81f3dae06285c104067b3dfd653c1cfe9c43f5182942635dbe071e3080f3cb";
const expectedFingerprint = "53cfb132afef348a2cf1aac4a46640129cac3e6caeeee038bc62bd9ce7a43855";
const expectedAssetChecksum = "616d4eb80d06587f187880ecb9e4a447ce537da937b267b6691436b2672bf274";
const expectedC0001Checksum = "b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5";
const projectRoot = path.join(projectHome, "projects", projectId);
const stepARoot = path.join(projectRoot, "runs", stepARunId, "content");
const currentRoot = path.join(projectRoot, "runs", runId, "content");
const formalRunId = "RUN-20260826-204500-R25C";
const formalRoot = path.join(projectRoot, "runs", formalRunId, "image-production");
const formalCoverPath = path.join(formalRoot, "formal-calibration-cover.json");
const contrastPath = path.join(formalRoot, "fpv2-text-background-contrast-report.json");
const validationPath = path.join(
  projectRoot,
  "runs/RUN-20260826-213000-G4A1/image-production/universal-visual-calibration-validation-v1.json",
);
const legacyStyleLockPath = path.join(
  projectRoot,
  "runs/RUN-20260826-213000-G4A1/image-production/calibration-style-lock-v1.json",
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

async function filesRecursively(root: string): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...(await filesRecursively(file)));
    else if (entry.isFile()) result.push(file);
  }
  return result.sort();
}

function relative(file: string): string {
  const value = path.relative(projectHome, file).split(path.sep).join("/");
  if (value.startsWith("../") || path.isAbsolute(value))
    throw new Error("CALIBRATION_REBINDING_PATH_ESCAPE");
  return value;
}

async function historySnapshot(): Promise<Map<string, string>> {
  const currentSegment = `${path.sep}${runId}${path.sep}`;
  const files = (await filesRecursively(projectRoot)).filter(
    (file) => !file.includes(currentSegment),
  );
  return new Map(
    await Promise.all(files.map(async (file) => [relative(file), await hashFile(file)] as const)),
  );
}

function assertSnapshotsEqual(before: Map<string, string>, after: Map<string, string>): void {
  if (before.size !== after.size)
    throw new Error("CALIBRATION_REBINDING_HISTORY_FILE_COUNT_CONFLICT");
  for (const [file, checksum] of before) {
    if (after.get(file) !== checksum)
      throw new Error(`CALIBRATION_REBINDING_HISTORY_CONFLICT:${file}`);
  }
}

function readPngCanvas(buffer: Buffer): { width: number; height: number } {
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a" || buffer.subarray(12, 16).toString("ascii") !== "IHDR")
    throw new Error("CALIBRATION_REBINDING_PNG_INVALID");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

type ContentPage = {
  page_number: number;
  page_role: string;
  page_intent: string;
  primary_judgment: string;
  supporting_copy: string;
  copy_snapshot: string;
};

type ContentPackage = {
  package_id: string;
  project_ref: { project_kind: "CALIBRATION_PROJECT"; project_id: string };
  content_id: string;
  content_version: string;
  copy_version: string;
  page_count: number;
  pages: ContentPage[];
  audience: string;
  painpoint: string;
  content_promise: string;
  content_value: { statement: string };
  narrative_structure: Array<{ page_number: number; purpose: string }>;
  content_fingerprint: string;
  source_run_id: string;
};

type QualityReport = {
  quality_report_id: string;
  weighted_score: number;
  blocking_failures: string[];
  ready_for_g3: boolean;
};

type G3ReviewRequest = {
  review_request_id: string;
  content_package_hash: string;
  content_fingerprint: string;
  quality_report_ref: string;
  source_run_id: string;
  status: string;
  decision: string;
  approval_created: boolean;
};

type FormalCover = {
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
  canvas: {
    width: number;
    height: number;
    aspect_ratio: string;
    orientation: string;
    resolution_unit: string;
  };
  thumbnail_310: { asset_ref: string; checksum: string; actual_pixel_inspection: string };
  thumbnail_186: { asset_ref: string; checksum: string; actual_pixel_inspection: string };
  attention_mode: string;
  primary_hook: string;
  supporting_signal: string;
  scores: Record<string, number>;
  quality_gates: Record<string, string>;
  hard_blocks: string[];
  deterministic_replay: boolean;
  g4_eligible: boolean;
};

type ContrastReport = {
  asset_checksum: string;
  contrast_stability: { result: string };
  background_complexity: { result: string };
  actual_pixel_visual_qa: { result: string };
  hard_blocks: string[];
  result: string;
};

const [contentPackage, qualityReport, reviewRequest, formalCover, contrastReport, validation] =
  await Promise.all([
    readJson<ContentPackage>(path.join(stepARoot, "content-package.json")),
    readJson<QualityReport>(path.join(stepARoot, "content-quality-report.json")),
    readJson<G3ReviewRequest>(path.join(stepARoot, "calibration-g3-review-request.json")),
    readJson<FormalCover>(formalCoverPath),
    readJson<ContrastReport>(contrastPath),
    readJson<{
      status: string;
      validated_systems: Array<{ system: string; status: string }>;
      universal_template_created: boolean;
    }>(validationPath),
  ]);

const packagePath = path.join(stepARoot, "content-package.json");
const qualityPath = path.join(stepARoot, "content-quality-report.json");
const reviewPath = path.join(stepARoot, "calibration-g3-review-request.json");
const packageHash = await hashFile(packagePath);
const qualityHash = await hashFile(qualityPath);
const reviewHash = await hashFile(reviewPath);
if (
  packageHash !== expectedPackageHash ||
  contentPackage.content_fingerprint !== expectedFingerprint ||
  reviewRequest.content_package_hash !== expectedPackageHash ||
  reviewRequest.content_fingerprint !== expectedFingerprint ||
  contentPackage.page_count !== 6 ||
  contentPackage.pages.length !== 6 ||
  qualityReport.weighted_score !== 97 ||
  qualityReport.blocking_failures.length !== 0 ||
  !qualityReport.ready_for_g3 ||
  reviewRequest.status !== "AWAITING_USER_APPROVAL" ||
  reviewRequest.decision !== "PENDING_OPERATOR" ||
  reviewRequest.approval_created
)
  throw new Error("CALIBRATION_G3_SOURCE_EVIDENCE_CONFLICT");

const historyBefore = await historySnapshot();
if ((await hashFile(c0001Path)) !== expectedC0001Checksum)
  throw new Error("CALIBRATION_REBINDING_C0001_CONFLICT");
const imageBuffer = await readFile(path.join(projectHome, formalCover.asset_ref));
const imageChecksum = sha256(imageBuffer);
const pngCanvas = readPngCanvas(imageBuffer);
if (
  imageChecksum !== expectedAssetChecksum ||
  formalCover.asset_checksum !== expectedAssetChecksum ||
  pngCanvas.width !== 1242 ||
  pngCanvas.height !== 1660 ||
  formalCover.canvas.width !== pngCanvas.width ||
  formalCover.canvas.height !== pngCanvas.height
)
  throw new Error("CALIBRATION_REBINDING_ASSET_CONFLICT");

const runtime = new CalibrationContentRepairRuntime({
  projectHome,
  projectId,
  runId,
  schemaRoot,
});
const existingVisualPlan = (await runtime.read("visual-plan.json")) as {
  visual_plan_version: string;
} | null;
const existingFirstPage = (await runtime.read("rebound-first-page-manifest.json")) as {
  first_page_version: string;
} | null;
const visualPlanVersion =
  existingVisualPlan?.visual_plan_version ??
  allocateNextCalibrationVersion("VV", [formalCover.visual_plan_version]);
const firstPageVersion =
  existingFirstPage?.first_page_version ??
  allocateNextCalibrationVersion("FPV", ["FPV-1", formalCover.calibration_cover_version]);
const versionToken = firstPageVersion.replace("-", "");
const visualToken = visualPlanVersion.replace("-", "");
const g3ApprovalId = "APR-20260827-G3B1";
const g3ApprovalEvidenceId = "CG3A-CAL-SPACE-001-CV2";
const newAssetId = `AST-CAL-SPACE-001-${versionToken}-REBIND`;
const qaBindingId = `CVQA-CAL-SPACE-001-${versionToken}`;
const projectRef = { project_kind: "CALIBRATION_PROJECT" as const, project_id: projectId };
const packageRef = relative(packagePath);
const qualityRef = relative(qualityPath);
const reviewRef = relative(reviewPath);
const g3ApprovalRef = relative(path.join(currentRoot, "calibration-g3-approval.json"));
const visualPlanRef = relative(path.join(currentRoot, "visual-plan.json"));
const manifestRef = relative(path.join(currentRoot, "rebound-first-page-manifest.json"));

const expectedG3Binding: CalibrationG3Binding = {
  projectId,
  contentId,
  contentVersion: "CV-2",
  copyVersion: "CV-2",
  packageId: "CCP-CAL-COMMERCIAL-SPACE-001-CV2",
  packageHash,
  contentFingerprint: expectedFingerprint,
  qualityReportHash: qualityHash,
  reviewRequestHash: reviewHash,
  sourceRunId: stepARunId,
  pageCount: 6,
};
assertCalibrationG3Binding(expectedG3Binding, {
  projectId: contentPackage.project_ref.project_id,
  contentId: contentPackage.content_id,
  contentVersion: contentPackage.content_version,
  copyVersion: contentPackage.copy_version,
  packageId: contentPackage.package_id,
  packageHash: reviewRequest.content_package_hash,
  contentFingerprint: reviewRequest.content_fingerprint,
  qualityReportHash: qualityHash,
  reviewRequestHash: reviewHash,
  sourceRunId: reviewRequest.source_run_id,
  pageCount: contentPackage.page_count,
});

const g3Approval = {
  approval_evidence_id: g3ApprovalEvidenceId,
  project_ref: projectRef,
  content_id: contentId,
  content_version: "CV-2",
  copy_version: "CV-2",
  page_count: 6,
  content_package_id: contentPackage.package_id,
  content_package_ref: packageRef,
  content_package_hash: packageHash,
  content_fingerprint: expectedFingerprint,
  quality_report_ref: qualityRef,
  quality_report_hash: qualityHash,
  review_request_ref: reviewRef,
  review_request_hash: reviewHash,
  reviewed_source_run_id: stepARunId,
  decision: "APPROVE",
  status: "PASSED",
  approval_event: {
    approval_id: g3ApprovalId,
    gate: "CONTENT_COPY",
    target_type: "CONTENT_PACKAGE",
    target_id: contentPackage.package_id,
    target_version: calibrationG3TargetVersion(expectedG3Binding),
    decision: "APPROVE",
    comment:
      "Operator approved the immutable C-9001 CV-2 / Copy CV-2 six-page Calibration Content Package.",
    source_run_id: stepARunId,
    created_at: createdAt,
    deprecated_at: null,
    schema_version: "1.0.0",
  },
  visual_rebinding_authorized: true,
  production_workspace_write_eligible: false,
  feishu_writes: 0,
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
};
const g3Write = await runtime.writeOnceOrReuse(
  "calibration-g3-approval",
  "calibration-g3-approval.json",
  g3Approval,
);

const pagePurposes = [
  [
    "Approved Cover entry with verified TYPE_DOMINANT attention.",
    "ASYMMETRIC_NEGATIVE_SPACE",
    "REUSED_VERIFIED_ASSET",
    "TYPE_DOMINANT",
    "PENDING_G4_REVIEW",
  ],
  [
    "Reframe aesthetics as first-impression information judgment.",
    "EDITORIAL_SPLIT",
    "PLANNED_NOT_PRODUCED",
    "CONTENT_READING",
    "NOT_CREATED",
  ],
  [
    "Make category recognition diagnosable.",
    "DIAGNOSTIC_COMPOSITION",
    "PLANNED_NOT_PRODUCED",
    "CONTENT_READING",
    "NOT_CREATED",
  ],
  [
    "Make target-customer positioning diagnosable.",
    "EVIDENCE_DOMINANT",
    "PLANNED_NOT_PRODUCED",
    "CONTENT_READING",
    "NOT_CREATED",
  ],
  [
    "Make approach and entrance friction diagnosable.",
    "IMAGE_DOMINANT",
    "PLANNED_NOT_PRODUCED",
    "CONTENT_READING",
    "NOT_CREATED",
  ],
  [
    "Resolve the sequence into three memorable checks.",
    "MULTI_EVIDENCE_EDITORIAL",
    "PLANNED_NOT_PRODUCED",
    "SUMMARY_HIERARCHY",
    "NOT_CREATED",
  ],
] as const;
const visualPlan = {
  visual_plan_id: `CVP-CAL-SPACE-001-${visualToken}`,
  project_ref: projectRef,
  content_id: contentId,
  content_version: "CV-2",
  copy_version: "CV-2",
  visual_plan_version: visualPlanVersion,
  page_count: 6,
  content_package_ref: packageRef,
  content_package_hash: packageHash,
  g3_approval_id: g3ApprovalId,
  g3_approval_ref: g3ApprovalRef,
  g3_approval_hash: g3Write.sha256,
  audience: contentPackage.audience,
  painpoint: contentPackage.painpoint,
  content_value: contentPackage.content_value.statement,
  narrative: contentPackage.narrative_structure.map((item) => item.purpose),
  calibration_systems: [
    "UNIVERSAL_VISUAL_CALIBRATION_V1",
    "EDITORIAL_DESIGN_KNOWLEDGE_V1",
    "COVER_ATTENTION_INTELLIGENCE_V1",
    "TYPOGRAPHY_SPATIAL_INTEGRITY_V1",
    "TYPOGRAPHY_BREATHING_ROOM_V1",
    "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1",
  ],
  historical_style_reference: {
    style_lock_version: "SLV-1",
    usage: "HISTORICAL_CALIBRATION_STYLE_REFERENCE",
  },
  active_style_lock_for_current_version: null,
  pages: contentPackage.pages.map((page, index) => {
    const strategy = pagePurposes[index];
    if (!strategy) throw new Error(`CALIBRATION_VISUAL_PLAN_PAGE_MISSING:${index + 1}`);
    return {
      page_number: page.page_number,
      page_role: page.page_role,
      page_intent: page.page_intent,
      copy_hash: sha256(Buffer.from(page.copy_snapshot, "utf8")),
      visual_purpose: strategy[0],
      composition_family: strategy[1],
      asset_strategy: strategy[2],
      typography_role: strategy[3],
      production_status: strategy[4],
    };
  }),
  status: "CREATED",
  remaining_pages_created: 0,
  imagegen_calls: 0,
  renderer_calls: 0,
  feishu_writes: 0,
  production_workspace_write_eligible: false,
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
};
const visualWrite = await runtime.writeOnceOrReuse(
  "calibration-visual-plan",
  "visual-plan.json",
  visualPlan,
);

const pageOne = contentPackage.pages[0];
if (!pageOne) throw new Error("CALIBRATION_REBINDING_PAGE_ONE_MISSING");
assertCalibrationPageOneReuseEligibility({
  currentPrimaryHook: pageOne.primary_judgment,
  currentSupportingSignal: pageOne.supporting_copy,
  historicalPrimaryHook: formalCover.primary_hook,
  historicalSupportingSignal: formalCover.supporting_signal,
  currentPageRole: pageOne.page_role,
  historicalPageRole: "COVER",
  currentPageIntent: pageOne.page_intent,
  historicalPageIntent: "COVER_ENTRY",
  contentPromiseEquivalent:
    ["品类", "定位", "入口"].every((value) => pageOne.supporting_copy.includes(value)) &&
    ["品类", "定位", "入口"].every((value) => contentPackage.content_promise.includes(value)),
  assetChecksum: imageChecksum,
  expectedAssetChecksum,
  canvas: formalCover.canvas,
  attentionMode: formalCover.attention_mode,
  universalCalibrationStatus: validation.status,
  coverConstraintConflict: false,
});
if (
  validation.universal_template_created ||
  validation.validated_systems.some((system) => system.status !== "CALIBRATION_VALIDATED_V1") ||
  formalCover.hard_blocks.length > 0 ||
  !formalCover.g4_eligible ||
  !formalCover.deterministic_replay ||
  contrastReport.result !== "PASS" ||
  contrastReport.hard_blocks.length > 0 ||
  contrastReport.asset_checksum !== imageChecksum
)
  throw new Error("CALIBRATION_REBINDING_CURRENT_VERSION_QA_BLOCKED");

const qualityGateChecks: Array<[string, boolean, string]> = [
  [
    "COPY_FIDELITY",
    true,
    "CV-2 Page 1 bytes were compared with the rendered historical Cover copy.",
  ],
  [
    "TYPOGRAPHY_POLICY",
    formalCover.quality_gates.typography_policy === "PASS",
    "Renderer-resolved Songti evidence remains attached to the unchanged pixels.",
  ],
  [
    "TYPOGRAPHY_SPATIAL_INTEGRITY",
    formalCover.quality_gates.typography_spatial_integrity === "PASS",
    "Current Page 1 copy is byte-equivalent and uses the verified raster geometry.",
  ],
  [
    "TYPOGRAPHY_BREATHING_ROOM",
    formalCover.quality_gates.typography_breathing_room === "PASS",
    "The unchanged raster retains verified breathing room.",
  ],
  [
    "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY",
    contrastReport.result === "PASS",
    "The unchanged PNG was rebound to the current version with the raster contrast report checksum.",
  ],
  [
    "CONTRAST_STABILITY",
    contrastReport.contrast_stability.result === "PASS",
    "Current binding references the verified local contrast distribution.",
  ],
  [
    "BACKGROUND_COMPLEXITY",
    contrastReport.background_complexity.result === "PASS",
    "Current binding references the verified background-complexity inspection.",
  ],
  [
    "THUMBNAIL_QA",
    formalCover.thumbnail_186.actual_pixel_inspection === "PASS" &&
      formalCover.thumbnail_310.actual_pixel_inspection === "PASS",
    "Both actual thumbnails remain bound to the unchanged full PNG.",
  ],
  [
    "COVER_CLICK_CLARITY",
    (formalCover.scores.click_clarity ?? 0) >= 90,
    "Current Content Promise and unchanged 186x248 Cover remain aligned.",
  ],
  [
    "SEMANTIC_RELEVANCE",
    (formalCover.scores.semantic_relevance ?? 0) >= 85,
    "CV-2 keeps the same Page 1 promise and storefront painpoint.",
  ],
  [
    "PAINPOINT_SCENE_CONGRUENCE",
    (formalCover.scores.painpoint_scene ?? 0) >= 85,
    "The unchanged storefront scene still serves the current painpoint.",
  ],
  [
    "EDITORIAL_SPATIAL",
    (formalCover.scores.editorial_spatial ?? 0) >= 85,
    "Actual pixel composition evidence remains valid for the equivalent Cover.",
  ],
  [
    "IMAGE_TEXT_INTEGRATION",
    (formalCover.scores.image_text_integration ?? 0) >= 85,
    "Identical text and identical pixels preserve the verified relationship.",
  ],
  [
    "COVER_ATTENTION",
    (formalCover.scores.cover_attention ?? 0) >= 90,
    "TYPE_DOMINANT attention remains valid for VV-2 Page 1.",
  ],
  [
    "VISUAL_MASS",
    formalCover.quality_gates.visual_mass === "PASS",
    "Actual-pixel visual mass evidence is checksum-bound.",
  ],
  [
    "GREYSCALE_HIERARCHY",
    formalCover.quality_gates.greyscale_hierarchy === "PASS",
    "Actual-pixel grayscale evidence is checksum-bound.",
  ],
  [
    "COLOR_INTELLIGENCE",
    formalCover.quality_gates.color_intelligence === "PASS",
    "Actual-pixel color evidence is checksum-bound.",
  ],
  [
    "TYPOGRAPHY_AS_FORM",
    formalCover.quality_gates.typography_as_form === "PASS",
    "Actual-pixel typography-form evidence is checksum-bound.",
  ],
  [
    "IMAGE_QUALITY",
    (formalCover.scores.image_quality ?? 0) >= 85,
    "PNG signature, dimensions, file size and checksum were re-read.",
  ],
  [
    "ACTUAL_PIXEL_QA",
    contrastReport.actual_pixel_visual_qa.result === "PASS" &&
      formalCover.quality_gates.actual_pixel_inspection === "PASS",
    "Full, 310 and 186 pixel evidence was rebound to the current version.",
  ],
  [
    "DETERMINISTIC_ASSET_VERIFICATION",
    imageChecksum === expectedAssetChecksum,
    "Source PNG and deterministic replay retain the exact expected checksum.",
  ],
];
const failedChecks = qualityGateChecks.filter(([, passed]) => !passed).map(([check]) => check);
if (failedChecks.length > 0)
  throw new Error(`CALIBRATION_REBINDING_CURRENT_VERSION_QA_BLOCKED:${failedChecks.join(",")}`);

const evidenceFiles = [
  formalCoverPath,
  contrastPath,
  path.join(projectHome, formalCover.asset_ref),
  path.join(projectHome, formalCover.thumbnail_186.asset_ref),
  path.join(projectHome, formalCover.thumbnail_310.asset_ref),
  path.join(
    formalRoot,
    "formal-calibration-cover/formal-calibration-cover-fpv2-deterministic-replay.png",
  ),
  validationPath,
] as const;
const evidenceRefs = await Promise.all(
  evidenceFiles.map(async (file) => ({
    artifact_ref: relative(file),
    checksum: await hashFile(file),
  })),
);
const targetBinding = `CV-2:CV-2:${visualPlanVersion}:${firstPageVersion}:${imageChecksum}`;
const reboundManifest = {
  manifest_id: `CRFPM-CAL-SPACE-001-${versionToken}`,
  project_ref: projectRef,
  content_id: contentId,
  content_version: "CV-2",
  copy_version: "CV-2",
  visual_plan_version: visualPlanVersion,
  first_page_version: firstPageVersion,
  asset_id: newAssetId,
  asset_source_type: "REUSED_VERIFIED_ASSET",
  source_asset_id: formalCover.asset_id,
  source_asset_ref: formalCover.asset_ref,
  source_asset_checksum: imageChecksum,
  asset_ref: formalCover.asset_ref,
  asset_checksum: imageChecksum,
  asset_file_size: (await stat(path.join(projectHome, formalCover.asset_ref))).size,
  canvas: formalCover.canvas,
  copy_equivalence: {
    copy_byte_equivalence: "PASS",
    content_promise_equivalence: "PASS",
    page_role_equivalence: "PASS",
    page_intent_equivalence: "PASS",
  },
  asset_byte_reuse_eligibility: "PASSED",
  image_bytes: "UNCHANGED",
  current_version_qa: {
    qa_binding_id: qaBindingId,
    target_binding: targetBinding,
    checks: qualityGateChecks.map(([check, , bindingBasis]) => ({
      check,
      result: "PASS",
      binding_basis: bindingBasis,
    })),
    evidence_refs: evidenceRefs,
    hard_blocks: [],
    status: "PASSED",
  },
  historical_manifest_modified: false,
  operator_approved: false,
  g4_eligible: true,
  imagegen_calls: 0,
  renderer_calls: 0,
  feishu_writes: 0,
  production_workspace_write_eligible: false,
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
};
const manifestWrite = await runtime.writeOnceOrReuse(
  "calibration-rebound-first-page",
  "rebound-first-page-manifest.json",
  reboundManifest,
);

const g4Review = {
  review_request_id: `CGRR-CAL-SPACE-001-${versionToken}`,
  project_ref: projectRef,
  content_id: contentId,
  content_version: "CV-2",
  copy_version: "CV-2",
  visual_plan_version: visualPlanVersion,
  first_page_version: firstPageVersion,
  asset_id: newAssetId,
  asset_checksum: imageChecksum,
  content_package_ref: packageRef,
  content_package_hash: packageHash,
  g3_approval_id: g3ApprovalId,
  g3_approval_ref: g3ApprovalRef,
  visual_plan_ref: visualPlanRef,
  visual_plan_hash: visualWrite.sha256,
  first_page_manifest_ref: manifestRef,
  first_page_manifest_hash: manifestWrite.sha256,
  current_version_qa_binding_id: qaBindingId,
  gate: "CALIBRATION_G4",
  status: "AWAITING_USER_APPROVAL",
  decision: "PENDING_OPERATOR",
  approval_event_created: false,
  style_lock_created: false,
  remaining_pages_created: 0,
  imagegen_calls: 0,
  renderer_calls: 0,
  feishu_writes: 0,
  production_workspace_write_eligible: false,
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
};
const g4Write = await runtime.writeOnceOrReuse(
  "calibration-g4-review-request",
  "calibration-g4-review-request.json",
  g4Review,
);

const replay = await Promise.all([
  runtime.writeOnceOrReuse("calibration-g3-approval", "calibration-g3-approval.json", g3Approval),
  runtime.writeOnceOrReuse("calibration-visual-plan", "visual-plan.json", visualPlan),
  runtime.writeOnceOrReuse(
    "calibration-rebound-first-page",
    "rebound-first-page-manifest.json",
    reboundManifest,
  ),
  runtime.writeOnceOrReuse(
    "calibration-g4-review-request",
    "calibration-g4-review-request.json",
    g4Review,
  ),
]);
if (replay.some((item) => !item.reused))
  throw new Error("CALIBRATION_REBINDING_IDEMPOTENT_REPLAY_FAILED");

assertSnapshotsEqual(historyBefore, await historySnapshot());
if ((await hashFile(c0001Path)) !== expectedC0001Checksum)
  throw new Error("CALIBRATION_REBINDING_C0001_CHANGED");
if ((await hashFile(legacyStyleLockPath)) !== historyBefore.get(relative(legacyStyleLockPath)))
  throw new Error("CALIBRATION_REBINDING_LEGACY_STYLE_LOCK_CHANGED");

process.stdout.write(
  `${JSON.stringify({
    phase_status: "SUCCESS",
    g3: "PASSED",
    g3_approval_id: g3ApprovalId,
    content_id: contentId,
    content_version: "CV-2",
    copy_version: "CV-2",
    visual_plan_version: visualPlanVersion,
    first_page_version: firstPageVersion,
    first_page_asset: newAssetId,
    existing_cover_asset_reuse: "PASSED",
    image_bytes: "UNCHANGED",
    image_sha256: imageChecksum,
    current_version_qa: "PASSED",
    qa_checks: qualityGateChecks.length,
    new_g4: "AWAITING_USER_APPROVAL",
    new_g4_approval: "NOT_CREATED",
    slv2: "NOT_CREATED",
    remaining_page_production_eligibility: "NOT_YET_ELIGIBLE",
    remaining_pages: 0,
    renderer_calls: 0,
    imagegen_calls: 0,
    feishu_writes: 0,
    legacy_chain: "PRESERVED_HISTORICAL_VALID_NOT_CURRENT_FOR_CV2",
    idempotent_replay: "PASSED",
    writes: {
      g3_approval_reused: g3Write.reused,
      visual_plan_reused: visualWrite.reused,
      first_page_manifest_reused: manifestWrite.reused,
      g4_review_reused: g4Write.reused,
    },
    artifact_hashes: {
      g3_approval: g3Write.sha256,
      visual_plan: visualWrite.sha256,
      first_page_manifest: manifestWrite.sha256,
      g4_review: g4Write.sha256,
    },
    output_root: runtime.root,
  })}\n`,
);
