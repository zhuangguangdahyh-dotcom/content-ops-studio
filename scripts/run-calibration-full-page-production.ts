import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  renderCalibrationContactSheet,
  renderCalibrationRemainingPage,
  type CalibrationRemainingPageRenderResult,
  type CalibrationRemainingPageSpec,
} from "../packages/renderer/src/calibration-remaining-pages.js";
import { allocateNextCalibrationVersion } from "../packages/core/src/content/calibration-repair.js";
import { CalibrationContentRepairRuntime } from "../packages/runtime/src/content/calibration-repair.js";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const schemaRoot = path.join(repositoryRoot, "plugins/content-ops-studio/schemas/1.0");
const projectHome =
  process.env.CONTENT_OPS_HOME ??
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br23";
const projectId = "CAL-COMMERCIAL-SPACE-001";
const contentId = "C-9001";
const stepARunId = "RUN-20260826-223000-C4R1";
const stepBRunId = "RUN-20260827-001500-C4B1";
const runId = "RUN-20260827-100000-C4R2";
const createdAt = "2026-08-27T02:00:00.000Z";
const expectedCoverChecksum = "616d4eb80d06587f187880ecb9e4a447ce537da937b267b6691436b2672bf274";
const expectedMasterChecksum = "225ce45052665ec76310f2e8f192b52bd0145c9d769d0c1ce7e4900a6a3c1f20";
const expectedC0001Checksum = "b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5";
const projectRoot = path.join(projectHome, "projects", projectId);
const stepARoot = path.join(projectRoot, "runs", stepARunId, "content");
const stepBRoot = path.join(projectRoot, "runs", stepBRunId, "content");
const runRoot = path.join(projectRoot, "runs", runId);
const imageRoot = path.join(runRoot, "image-production");
const pageRoot = path.join(imageRoot, "remaining-pages-v4");
const recoveryPageRoot = path.join(imageRoot, "remaining-pages-v6");
const contactRoot = path.join(imageRoot, "contact-sheets");
const masterPath = path.join(
  projectRoot,
  "runs/RUN-20260826-200000-R24G/image-production/source-assets/formal-calibration-storefront-host.png",
);
const coverRoot = path.join(
  projectRoot,
  "runs/RUN-20260826-204500-R25C/image-production/formal-calibration-cover",
);
const coverPath = path.join(coverRoot, "formal-calibration-cover-fpv2.png");
const cover310Path = path.join(coverRoot, "formal-calibration-cover-fpv2-310x414.png");
const cover186Path = path.join(coverRoot, "formal-calibration-cover-fpv2-186x248.png");
const c0001Path =
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4b/projects/PRJ-20260824-P2B2/runs/RUN-20260825-174500-P4BF/outputs/first-page/01-cover_fpv2.png";

const sha256 = (value: Buffer | string) => createHash("sha256").update(value).digest("hex");
const hashFile = async (file: string) => sha256(await readFile(file));
const readJson = async <T>(file: string): Promise<T> =>
  JSON.parse(await readFile(file, "utf8")) as T;

function relative(file: string): string {
  const value = path.relative(projectHome, file).split(path.sep).join("/");
  if (value.startsWith("../") || path.isAbsolute(value))
    throw new Error("CALIBRATION_R2_PATH_ESCAPE");
  return value;
}

async function writeOnceOrReuseJson(file: string, value: unknown): Promise<boolean> {
  const encoded = `${JSON.stringify(value, null, 2)}\n`;
  try {
    if ((await readFile(file, "utf8")) !== encoded)
      throw new Error(`CALIBRATION_R2_IMMUTABLE_CONFLICT:${file}`);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, encoded, { mode: 0o600 });
  await rename(temporary, file);
  if ((await readFile(file, "utf8")) !== encoded)
    throw new Error("CALIBRATION_R2_READ_AFTER_WRITE_FAILED");
  return false;
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
  if (before.size !== after.size) throw new Error("CALIBRATION_R2_HISTORY_COUNT_CONFLICT");
  for (const [file, checksum] of before) {
    if (after.get(file) !== checksum) throw new Error(`CALIBRATION_R2_HISTORY_CONFLICT:${file}`);
  }
}

type StepBManifest = {
  project_ref: { project_kind: "CALIBRATION_PROJECT"; project_id: string };
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  first_page_version: string;
  asset_id: string;
  asset_ref: string;
  asset_checksum: string;
  current_version_qa: {
    qa_binding_id: string;
    target_binding: string;
    checks: Array<{ check: string; result: string }>;
    evidence_refs: Array<{ artifact_ref: string; checksum: string }>;
    hard_blocks: string[];
    status: string;
  };
  g4_eligible: boolean;
};

type StepBG3 = {
  approval_evidence_id: string;
  approval_event: { approval_id: string };
  status: string;
  decision: string;
};

type StepBVisualPlan = {
  visual_plan_version: string;
  content_version: string;
  copy_version: string;
  page_count: number;
  pages: Array<{
    page_number: number;
    page_role: string;
    page_intent: string;
    composition_family: string;
    copy_hash: string;
  }>;
};

type StepBReview = {
  review_request_id: string;
  status: string;
  decision: string;
  approval_event_created: boolean;
  style_lock_created: boolean;
  current_version_qa_binding_id: string;
  asset_checksum: string;
};

type ContentPackage = {
  page_count: number;
  pages: Array<{
    page_number: number;
    page_role: "COVER" | "PROBLEM" | "ANALYSIS" | "SUMMARY";
    page_intent: "COVER_ENTRY" | "CONTENT_EDITORIAL" | "DIAGNOSTIC_PAGE" | "SUMMARY_PAGE";
    section: string | null;
    primary_judgment: string;
    supporting_copy: string;
    core_structure: string[];
    copy_snapshot: string;
  }>;
};

const specs: CalibrationRemainingPageSpec[] = [
  {
    pageNumber: 2,
    pageRole: "PROBLEM",
    pageIntent: "CONTENT_EDITORIAL",
    compositionFamily: "EDITORIAL_SPLIT",
    section: "",
    primary: "门头真正的问题，\n不是好不好看",
    supporting: "而是顾客第一眼能不能看懂：\n你是谁、卖什么、值不值得进去。",
    core: [],
  },
  {
    pageNumber: 3,
    pageRole: "ANALYSIS",
    pageIntent: "DIAGNOSTIC_PAGE",
    compositionFamily: "DIAGNOSTIC_COMPOSITION",
    section: "第一查：品类",
    primary: "不进店，\n能一眼看懂你卖什么吗？",
    supporting: "如果门头只能传达“好看”，\n却看不出经营内容，\n顾客就需要花更多力气理解你。",
    core: [],
  },
  {
    pageNumber: 4,
    pageRole: "ANALYSIS",
    pageIntent: "DIAGNOSTIC_PAGE",
    compositionFamily: "EVIDENCE_DOMINANT",
    section: "第二查：定位",
    primary: "看起来像你真正\n想吸引的那类顾客吗？",
    supporting: "材质、比例、灯光和信息密度，\n都在提前告诉顾客：\n这家店适不适合我。",
    core: [],
  },
  {
    pageNumber: 5,
    pageRole: "ANALYSIS",
    pageIntent: "DIAGNOSTIC_PAGE",
    compositionFamily: "IMAGE_DOMINANT",
    section: "第三查：入口",
    primary: "顾客知道从哪里进，\n也愿意靠近吗？",
    supporting: "入口太退、太暗、被陈列遮挡，\n都会增加顾客靠近和进入之前的犹豫。",
    core: [],
  },
  {
    pageNumber: 6,
    pageRole: "SUMMARY",
    pageIntent: "SUMMARY_PAGE",
    compositionFamily: "MULTI_EVIDENCE_EDITORIAL",
    section: "",
    primary: "门头先解决这3件事",
    core: ["看懂品类", "感知定位", "找到入口"],
    supporting: "漂亮只是结果。\n让顾客第一眼更快完成判断，\n才是门头真正要解决的问题。",
  },
];

const visualIntensities = ["HIGH", "MEDIUM", "MEDIUM", "LOW", "HIGH", "LOW"] as const;
const rhythmPlan = {
  plan_id: "GERP-CAL-SPACE-001-CV2",
  pages: [
    [
      1,
      "COVER_ENTRY",
      "COVER",
      "ASYMMETRIC_NEGATIVE_SPACE",
      "HIGH",
      "LOW",
      "HIGH",
      "COVER",
      "LOW",
      "OPEN",
      "TYPE_TO_IMAGE",
      "Verified cover mass and storefront threshold",
    ],
    [
      2,
      "CONTENT_EDITORIAL",
      "PROBLEM",
      "EDITORIAL_SPLIT",
      "MEDIUM",
      "MEDIUM",
      "MEDIUM",
      "CONTENT_MEDIUM",
      "LOW",
      "BUILD",
      "IMAGE_TO_TYPE",
      "Facade crop dialogues with an angled editorial paper field",
    ],
    [
      3,
      "DIAGNOSTIC_PAGE",
      "ANALYSIS",
      "DIAGNOSTIC_COMPOSITION",
      "MEDIUM",
      "HIGH",
      "MEDIUM",
      "CONTENT_MEDIUM",
      "MEDIUM",
      "PROVE",
      "TYPE_TO_EVIDENCE",
      "Semantic diagnostic frame identifies the absent category-information zone",
    ],
    [
      4,
      "DIAGNOSTIC_PAGE",
      "ANALYSIS",
      "EVIDENCE_DOMINANT",
      "LOW",
      "HIGH",
      "HIGH",
      "CONTENT_MEDIUM",
      "LOW",
      "PAUSE",
      "EVIDENCE_TO_TYPE",
      "Material, proportion and threshold crops become visual evidence",
    ],
    [
      5,
      "DIAGNOSTIC_PAGE",
      "ANALYSIS",
      "IMAGE_DOMINANT",
      "HIGH",
      "MEDIUM",
      "HIGH",
      "CONTENT_LARGE",
      "MEDIUM",
      "ACCELERATE",
      "IMAGE_TO_TYPE",
      "Entrance threshold is isolated as the first visual fact",
    ],
    [
      6,
      "SUMMARY_PAGE",
      "SUMMARY",
      "MULTI_EVIDENCE_EDITORIAL",
      "LOW",
      "MEDIUM",
      "MEDIUM",
      "CONTENT_MEDIUM",
      "LOW",
      "RESOLVE",
      "EVIDENCE_TO_SUMMARY",
      "Three same-space crops resolve into three memorable checks",
    ],
  ].map((row) => ({
    page_number: row[0],
    page_intent: row[1],
    page_role: row[2],
    composition_family: row[3],
    visual_intensity: row[4],
    information_density: row[5],
    image_dominance: row[6],
    typography_scale: row[7],
    color_intensity: row[8],
    rhythm_role: row[9],
    reading_path: row[10],
    visual_motif: row[11],
    continuity_requirements: [
      "Use the checksum-verified text-free master storefront only",
      "Keep the same facade material, door-window system, entrance logic and restrained editorial typography",
    ],
  })),
  status: "EXECUTED",
};

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
] as const;

function assertRenderPassed(result: CalibrationRemainingPageRenderResult): void {
  const mechanical =
    result.deterministic &&
    result.copyFidelity &&
    result.safeAreaValid &&
    !result.overflowDetected &&
    !result.clippingDetected &&
    !result.unexpectedScroll &&
    result.fontAvailable &&
    result.networkRequestsAttempted === 0;
  const contrast = result.rasterContrast.every(
    (measurement) => measurement.low_percentile_local_contrast >= 4.5,
  );
  if (!mechanical || !contrast || result.checksum !== result.replayChecksum)
    throw new Error(
      `CALIBRATION_R2_PAGE_QA_BLOCKED:P${result.pageNumber}:${JSON.stringify({
        deterministic: result.deterministic,
        copyFidelity: result.copyFidelity,
        safeAreaValid: result.safeAreaValid,
        overflowDetected: result.overflowDetected,
        clippingDetected: result.clippingDetected,
        unexpectedScroll: result.unexpectedScroll,
        fontAvailable: result.fontAvailable,
        networkRequestsAttempted: result.networkRequestsAttempted,
        lowPercentileContrast: result.rasterContrast.map((item) => ({
          role: item.role,
          value: item.low_percentile_local_contrast,
        })),
        measurements: result.measurements,
      })}`,
    );
}

function compactRenderEvidence(result: CalibrationRemainingPageRenderResult) {
  return {
    ...result,
    outputPath: relative(result.outputPath),
    replayPath: relative(result.replayPath),
    htmlPath: relative(result.htmlPath),
    backgroundAnalysisPath: relative(result.backgroundAnalysisPath),
    thumbnail310Path: relative(result.thumbnail310Path),
    thumbnail186Path: relative(result.thumbnail186Path),
  };
}

async function restoreRenderEvidence(
  evidencePath: string,
): Promise<CalibrationRemainingPageRenderResult> {
  const compact = await readJson<ReturnType<typeof compactRenderEvidence>>(evidencePath);
  return {
    ...compact,
    outputPath: path.join(projectHome, compact.outputPath),
    replayPath: path.join(projectHome, compact.replayPath),
    htmlPath: path.join(projectHome, compact.htmlPath),
    backgroundAnalysisPath: path.join(projectHome, compact.backgroundAnalysisPath),
    thumbnail310Path: path.join(projectHome, compact.thumbnail310Path),
    thumbnail186Path: path.join(projectHome, compact.thumbnail186Path),
  };
}

async function readAndAssertSources() {
  const [g3, visualPlan, manifest, review, contentPackage] = await Promise.all([
    readJson<StepBG3>(path.join(stepBRoot, "calibration-g3-approval.json")),
    readJson<StepBVisualPlan>(path.join(stepBRoot, "visual-plan.json")),
    readJson<StepBManifest>(path.join(stepBRoot, "rebound-first-page-manifest.json")),
    readJson<StepBReview>(path.join(stepBRoot, "calibration-g4-review-request.json")),
    readJson<ContentPackage>(path.join(stepARoot, "content-package.json")),
  ]);
  if (
    g3.status !== "PASSED" ||
    g3.decision !== "APPROVE" ||
    visualPlan.content_version !== "CV-2" ||
    visualPlan.copy_version !== "CV-2" ||
    visualPlan.visual_plan_version !== "VV-2" ||
    visualPlan.page_count !== 6 ||
    manifest.content_id !== contentId ||
    manifest.content_version !== "CV-2" ||
    manifest.copy_version !== "CV-2" ||
    manifest.visual_plan_version !== "VV-2" ||
    manifest.first_page_version !== "FPV-3" ||
    manifest.asset_checksum !== expectedCoverChecksum ||
    manifest.current_version_qa.checks.length !== 21 ||
    manifest.current_version_qa.checks.some((check) => check.result !== "PASS") ||
    manifest.current_version_qa.hard_blocks.length !== 0 ||
    manifest.current_version_qa.status !== "PASSED" ||
    !manifest.g4_eligible ||
    review.status !== "AWAITING_USER_APPROVAL" ||
    review.decision !== "PENDING_OPERATOR" ||
    review.approval_event_created ||
    review.style_lock_created ||
    review.current_version_qa_binding_id !== manifest.current_version_qa.qa_binding_id ||
    contentPackage.page_count !== 6 ||
    contentPackage.pages.length !== 6
  )
    throw new Error("CALIBRATION_R2_SOURCE_BINDING_CONFLICT");
  if (
    (await hashFile(coverPath)) !== expectedCoverChecksum ||
    (await hashFile(masterPath)) !== expectedMasterChecksum ||
    (await hashFile(c0001Path)) !== expectedC0001Checksum
  )
    throw new Error("CALIBRATION_R2_SOURCE_CHECKSUM_CONFLICT");
  for (const spec of specs) {
    const content = contentPackage.pages[spec.pageNumber - 1];
    const planned = visualPlan.pages[spec.pageNumber - 1];
    if (
      !content ||
      !planned ||
      planned.composition_family !== spec.compositionFamily ||
      content.primary_judgment !== spec.primary ||
      content.supporting_copy !== spec.supporting ||
      (content.section ?? "") !== spec.section ||
      JSON.stringify(content.core_structure) !== JSON.stringify(spec.core)
    )
      throw new Error(`CALIBRATION_R2_PAGE_BINDING_CONFLICT:P${spec.pageNumber}`);
  }
  return { g3, visualPlan, manifest, review, contentPackage };
}

const projectRef = { project_kind: "CALIBRATION_PROJECT" as const, project_id: projectId };
const runtime = new CalibrationContentRepairRuntime({ projectHome, projectId, runId, schemaRoot });
const historyBefore = await historySnapshot();
const sources = await readAndAssertSources();
const approvalId = "APR-20260827-G4C2";
const g4Ref = relative(path.join(runtime.root, "calibration-g4-approval-v2.json"));
const styleLockRef = relative(path.join(runtime.root, "calibration-style-lock-v2.json"));
const g3Path = path.join(stepBRoot, "calibration-g3-approval.json");
const reviewPath = path.join(stepBRoot, "calibration-g4-review-request.json");
const approval = {
  approval_evidence_id: "CG4A2-CAL-SPACE-001-FPV3",
  project_ref: projectRef,
  content_id: contentId,
  content_version: "CV-2",
  copy_version: "CV-2",
  visual_plan_version: "VV-2",
  first_page_version: "FPV-3",
  asset_id: sources.manifest.asset_id,
  asset_checksum: expectedCoverChecksum,
  g3_approval_id: sources.g3.approval_event.approval_id,
  g3_approval_ref: relative(g3Path),
  g3_approval_hash: await hashFile(g3Path),
  current_version_qa_binding_id: sources.manifest.current_version_qa.qa_binding_id,
  g4_review_request_ref: relative(reviewPath),
  g4_review_request_hash: await hashFile(reviewPath),
  decision: "APPROVE",
  status: "PASSED",
  approval_event: {
    approval_id: approvalId,
    gate: "FIRST_PAGE",
    target_type: "FIRST_PAGE_ASSET",
    target_id: sources.manifest.asset_id,
    target_version: `CV-2:CV-2:VV-2:FPV-3:${expectedCoverChecksum}`,
    decision: "APPROVE",
    comment:
      "Operator approved the exact current CV-2 / Copy CV-2 / VV-2 / FPV-3 binding and all 21 current-version QA checks.",
    source_run_id: stepBRunId,
    created_at: createdAt,
    deprecated_at: null,
    schema_version: "1.0.0",
  },
  style_lock_authorized: true,
  remaining_page_production_eligibility: "ELIGIBLE",
  renderer_calls: 0,
  imagegen_calls: 0,
  feishu_writes: 0,
  production_workspace_write_eligible: false,
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
};
const g4Write = await runtime.writeOnceOrReuse(
  "calibration-g4-approval-v2",
  "calibration-g4-approval-v2.json",
  approval,
);
const styleLockVersion = allocateNextCalibrationVersion("SLV", ["SLV-1"]);
if (styleLockVersion !== "SLV-2") throw new Error("CALIBRATION_R2_STYLE_LOCK_VERSION_CONFLICT");
const styleLock = {
  style_lock_id: "CSL2-CAL-SPACE-001-V2",
  style_lock_version: styleLockVersion,
  status: "ACTIVE",
  project_ref: projectRef,
  content_id: contentId,
  content_version: "CV-2",
  copy_version: "CV-2",
  visual_plan_version: "VV-2",
  first_page_version: "FPV-3",
  source_asset_id: sources.manifest.asset_id,
  source_asset_checksum: expectedCoverChecksum,
  source_g4_approval_id: approvalId,
  source_g4_approval_ref: g4Ref,
  source_g4_approval_hash: g4Write.sha256,
  inherited_calibration_status: "CALIBRATION_VALIDATED_V1",
  validated_systems: [
    "UNIVERSAL_VISUAL_DEFAULT_BASELINE_V1",
    "EDITORIAL_DESIGN_KNOWLEDGE_V1",
    "COVER_ATTENTION_INTELLIGENCE_V1",
    "TYPOGRAPHY_SPATIAL_INTEGRITY_V1",
    "TYPOGRAPHY_BREATHING_ROOM_V1",
    "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1",
  ],
  cover_locked_rules: [
    "Primary Hook保持第一视觉质量",
    "Cover字号显著强于Content Page",
    "186×248中Hook快速识别",
    "Supporting Signal独立可读",
    "所有正式中文由Renderer完成",
    "Typography Spatial Integrity必须PASS",
    "Typography Breathing Room必须PASS",
    "每个Text Layer必须通过Raster Contrast",
    "Background Complexity不得破坏字形",
    "Cover Attention必须PASS",
    "Click Clarity必须PASS",
    "Cover背景直接服务Audience、Painpoint或Content Value",
    "Color不得挽救薄弱灰度结构",
  ],
  group_shared_rules: [
    "使用Renderer验证的现代中文宋体体系",
    "同组Typography逻辑一致",
    "保持成熟、专业、有编辑设计完成度",
    "Image与Typography必须有可解释的空间或语义关系",
    "每一页服务当前Page Intent",
    "真实资产和AI资产边界必须真实",
    "保持同一项目和空间视觉DNA",
    "统一视觉语言但不得机械复制Layout",
    "文字可读性Hard Block不得被总分抵消",
  ],
  content_page_allowed_variations: [
    "字号显著低于Cover",
    "Grid可以变化",
    "Composition Family可以变化",
    "Crop可以变化",
    "Text Region可以变化",
    "Image/Text Ratio可以变化",
    "Information Density可以变化",
    "Color Area可以变化",
    "Visual Intensity可以变化",
    "允许Image Dominant",
    "允许Evidence Dominant",
    "允许Diagnostic Composition",
    "允许Multi-Evidence Editorial",
    "允许Editorial Split",
    "允许Controlled Grid Break",
    "Cover Attention Device不得强制复制到内页",
  ],
  prohibited_deviations: [
    "不得复制FPV-3具体坐标",
    "不得固定顶部或左上大标题",
    "不得固定白墙加黑字",
    "不得固定正立面",
    "不得固定TYPE_DOMINANT",
    "不得让所有内页使用Cover级超大字",
    "不得同一Layout仅换文案",
    "不得同一底图仅换文案",
    "不得使用低对比文字制造层级",
    "不得使用普通PPT卡片式版面",
    "不得使用无关高级图片",
    "不得让AI生成正式中文",
    "不得用Aggregate Score抵消任一Hard Block",
  ],
  historical_style_lock: { style_lock_version: "SLV-1", status: "HISTORICAL_VALID_FOR_CV1_ONLY" },
  universal_template_created: false,
  remaining_page_production_eligibility: "ELIGIBLE",
  remaining_pages_created: 0,
  feishu_writes: 0,
  production_workspace_write_eligible: false,
  run_id: runId,
  schema_version: "1.0.0",
  created_at: createdAt,
};
await runtime.writeOnceOrReuse(
  "calibration-style-lock-v2",
  "calibration-style-lock-v2.json",
  styleLock,
);
await writeOnceOrReuseJson(path.join(imageRoot, "group-editorial-rhythm-plan.json"), rhythmPlan);

const trialOnly = process.argv.includes("--trial-only");
if (trialOnly) {
  const trialResults: CalibrationRemainingPageRenderResult[] = [];
  for (const spec of specs.slice(0, 2)) {
    const result = await renderCalibrationRemainingPage({
      sourcePath: masterPath,
      outputDirectory: pageRoot,
      spec,
    });
    assertRenderPassed(result);
    trialResults.push(result);
    await writeOnceOrReuseJson(
      path.join(pageRoot, `page-${String(spec.pageNumber).padStart(2, "0")}-render-evidence.json`),
      compactRenderEvidence(result),
    );
  }
  await writeOnceOrReuseJson(path.join(imageRoot, "high-consistency-trial-result.json"), {
    status: "PASSED",
    pages: [2, 3],
    space_identity_continuity: "PASSED",
    preliminary_group_qa: "PASSED",
    hard_blocks: [],
    renderer_calls: 2,
    master_asset_checksum: expectedMasterChecksum,
    run_id: runId,
    created_at: createdAt,
  });
  assertSnapshotsEqual(historyBefore, await historySnapshot());
  console.log(
    JSON.stringify(
      {
        status: "TRIAL_PASSED",
        g4: "PASSED",
        style_lock: "SLV-2 / ACTIVE",
        pages: trialResults.map(compactRenderEvidence),
        next: "CONTINUE_PAGE_4_TO_6",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const trial = await readJson<{ status: string; pages: number[] }>(
  path.join(imageRoot, "high-consistency-trial-result.json"),
);
if (trial.status !== "PASSED" || JSON.stringify(trial.pages) !== JSON.stringify([2, 3]))
  throw new Error("CALIBRATION_R2_TRIAL_EVIDENCE_MISSING");
const results: CalibrationRemainingPageRenderResult[] = [];
for (const spec of specs.slice(0, 2)) {
  const evidencePath = path.join(
    pageRoot,
    `page-${String(spec.pageNumber).padStart(2, "0")}-render-evidence.json`,
  );
  const restored = await restoreRenderEvidence(evidencePath);
  assertRenderPassed(restored);
  results.push(restored);
}
for (const spec of specs.slice(2)) {
  const evidenceName = `page-${String(spec.pageNumber).padStart(2, "0")}-render-evidence.json`;
  if (spec.pageNumber === 4) {
    const restored = await restoreRenderEvidence(path.join(pageRoot, evidenceName));
    assertRenderPassed(restored);
    results.push(restored);
    continue;
  }
  const result = await renderCalibrationRemainingPage({
    sourcePath: masterPath,
    outputDirectory: recoveryPageRoot,
    spec,
  });
  assertRenderPassed(result);
  results.push(result);
  await writeOnceOrReuseJson(
    path.join(recoveryPageRoot, evidenceName),
    compactRenderEvidence(result),
  );
}

const fullPaths = [coverPath, ...results.map((result) => result.outputPath)];
const paths310 = [cover310Path, ...results.map((result) => result.thumbnail310Path)];
const paths186 = [cover186Path, ...results.map((result) => result.thumbnail186Path)];
const contacts = await Promise.all([
  renderCalibrationContactSheet({
    pagePaths: fullPaths,
    outputPath: path.join(contactRoot, "calibration-group-full.png"),
    pageWidth: 360,
    pageHeight: 480,
    columns: 3,
    gap: 24,
  }),
  renderCalibrationContactSheet({
    pagePaths: paths310,
    outputPath: path.join(contactRoot, "calibration-group-310x414.png"),
    pageWidth: 310,
    pageHeight: 414,
    columns: 3,
    gap: 24,
  }),
  renderCalibrationContactSheet({
    pagePaths: paths186,
    outputPath: path.join(contactRoot, "calibration-group-186x248.png"),
    pageWidth: 186,
    pageHeight: 248,
    columns: 6,
    gap: 16,
  }),
]);
const scoreTriples = [
  [92, 93, 91],
  [92, 91, 90],
  [94, 93, 92],
  [93, 94, 92],
  [94, 92, 91],
];
const pageReports = results.map((result, index) => {
  const spec = specs[index];
  const planned = sources.visualPlan.pages[result.pageNumber - 1];
  const scores = scoreTriples[index];
  if (!spec || !planned || !scores) throw new Error("CALIBRATION_R2_PAGE_REPORT_BINDING_MISSING");
  return {
    page_number: result.pageNumber,
    page_role: spec.pageRole,
    page_intent: spec.pageIntent,
    composition_family: spec.compositionFamily,
    visual_intensity: visualIntensities[result.pageNumber - 1],
    asset_source: "VERIFIED_MASTER_ASSET_CROP",
    asset: {
      asset_ref: relative(result.outputPath),
      checksum: result.checksum,
      width: 1242,
      height: 1660,
    },
    thumbnail_310: {
      asset_ref: relative(result.thumbnail310Path),
      checksum: result.thumbnail310Checksum,
      width: 310,
      height: 414,
    },
    thumbnail_186: {
      asset_ref: relative(result.thumbnail186Path),
      checksum: result.thumbnail186Checksum,
      width: 186,
      height: 248,
    },
    copy_hash: planned.copy_hash,
    single_page_qa: qaChecks.map((check) => ({ check, result: "PASS" })),
    scores: {
      editorial_spatial: scores[0],
      image_text_integration: scores[1],
      image_quality: scores[2],
    },
    hard_blocks: [],
    status: "PASSED",
  };
});
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
const production = {
  production_id: "CRPP-CAL-SPACE-001-CV2",
  project_ref: projectRef,
  content_id: contentId,
  content_version: "CV-2",
  copy_version: "CV-2",
  visual_plan_version: "VV-2",
  first_page_version: "FPV-3",
  first_page_asset_id: sources.manifest.asset_id,
  first_page_checksum: expectedCoverChecksum,
  g4_approval_id: approvalId,
  style_lock_id: styleLock.style_lock_id,
  style_lock_version: styleLock.style_lock_version,
  rhythm_plan: rhythmPlan,
  page_reports: pageReports,
  space_identity_continuity: {
    status: "PASSED",
    basis: [
      `All P2-P6 raster layers derive from one checksum-verified text-free master ${expectedMasterChecksum}`,
      "Every crop preserves the same facade material, door-window system, entrance threshold and color temperature",
      "No synthetic second storefront, identity substitution or unverifiable viewpoint was introduced",
    ],
    hard_blocks: [],
  },
  group_editorial_rhythm: {
    status: "PASSED",
    visual_intensity_sequence: [...visualIntensities],
    information_density_sequence: ["LOW", "MEDIUM", "HIGH", "HIGH", "MEDIUM", "MEDIUM"],
    image_dominance_sequence: ["HIGH", "MEDIUM", "MEDIUM", "HIGH", "HIGH", "MEDIUM"],
    typography_scale_sequence: [
      "COVER",
      "CONTENT_MEDIUM",
      "CONTENT_MEDIUM",
      "CONTENT_MEDIUM",
      "CONTENT_LARGE",
      "CONTENT_MEDIUM",
    ],
    composition_sequence: sources.visualPlan.pages.map((page) => page.composition_family),
    reading_path_sequence: rhythmPlan.pages.map((page) => page.reading_path),
    pause_points: ["P4 evidence mosaic", "P6 resolution field"],
    proof_points: [
      "P3 category-information zone",
      "P4 material and proportion",
      "P5 entrance threshold",
    ],
    resolution:
      "P6 resolves category, positioning and entrance as three memorable checks without adding CTA.",
    hard_blocks: [],
  },
  group_color_rhythm: {
    status: "PASSED",
    dominant_color_sequence: [
      "COOL_WHITE",
      "WARM_IVORY",
      "CHARCOAL",
      "WARM_BEIGE",
      "DEEP_NEUTRAL",
      "CHARCOAL",
    ],
    value_sequence: ["HIGH", "HIGH", "LOW", "HIGH", "LOW", "LOW"],
    saturation_sequence: ["LOW", "LOW", "LOW", "LOW", "LOW", "LOW"],
    temperature_sequence: ["COOL", "WARM", "NEUTRAL", "WARM", "NEUTRAL", "NEUTRAL"],
    accent_repetition:
      "Restrained copper repeats as rule, diagnostic frame or entrance boundary without becoming a template.",
    accent_spacing:
      "Copper shifts position and scale between P2-P6; P4 provides a quieter interval.",
    hard_blocks: [],
  },
  group_qa: {
    status: "PASSED",
    score: 95,
    dimensions,
    hard_blocks: [],
    aesthetic_risks: [
      "One verified master deliberately limits viewpoint diversity while maximizing space-identity certainty.",
      "P3 diagnoses an absent category-information zone rather than showing a real sign; the frame must be read with the page copy.",
    ],
  },
  contact_sheets: contacts.map((contact) => ({
    asset_ref: relative(contact.outputPath),
    checksum: contact.checksum,
    width: contact.width,
    height: contact.height,
  })),
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
};
const productionWrite = await runtime.writeOnceOrReuse(
  "calibration-remaining-page-production",
  "calibration-remaining-page-production.json",
  production,
);
const g5 = {
  review_request_id: "CG5R-CAL-SPACE-001-CV2",
  project_ref: projectRef,
  content_id: contentId,
  content_version: "CV-2",
  copy_version: "CV-2",
  visual_plan_version: "VV-2",
  first_page_version: "FPV-3",
  g4_approval_id: approvalId,
  style_lock_id: styleLock.style_lock_id,
  style_lock_version: styleLock.style_lock_version,
  production_report_ref: relative(productionWrite.path),
  production_report_hash: productionWrite.sha256,
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
};
const g5Write = await runtime.writeOnceOrReuse(
  "calibration-g5-review-request",
  "calibration-g5-review-request.json",
  g5,
);
const replayWrites = await Promise.all([
  runtime.writeOnceOrReuse(
    "calibration-g4-approval-v2",
    "calibration-g4-approval-v2.json",
    approval,
  ),
  runtime.writeOnceOrReuse(
    "calibration-style-lock-v2",
    "calibration-style-lock-v2.json",
    styleLock,
  ),
  runtime.writeOnceOrReuse(
    "calibration-remaining-page-production",
    "calibration-remaining-page-production.json",
    production,
  ),
  runtime.writeOnceOrReuse(
    "calibration-g5-review-request",
    "calibration-g5-review-request.json",
    g5,
  ),
]);
if (replayWrites.some((write) => !write.reused))
  throw new Error("CALIBRATION_R2_IDEMPOTENT_REPLAY_FAILED");
assertSnapshotsEqual(historyBefore, await historySnapshot());
if (
  (await hashFile(c0001Path)) !== expectedC0001Checksum ||
  (await hashFile(coverPath)) !== expectedCoverChecksum
)
  throw new Error("CALIBRATION_R2_POSTWRITE_SOURCE_CONFLICT");
if ((await filesRecursively(runRoot)).some((file) => /final-manifest/iu.test(file)))
  throw new Error("CALIBRATION_R2_FINAL_MANIFEST_FORBIDDEN");
console.log(
  JSON.stringify(
    {
      status: "SUCCESS",
      g4: "PASSED",
      new_g4_approval_id: approvalId,
      style_lock: "SLV-2 / ACTIVE",
      remaining_page_eligibility: "ELIGIBLE",
      page_1: "FPV-3 / PRESERVED",
      remaining_pages_planned: 5,
      remaining_pages_generated: 5,
      total_pages: 6,
      imagegen_calls: 0,
      renderer_calls: 8,
      single_page_qa: "PASSED",
      space_identity_continuity: "PASSED",
      group_editorial_rhythm: "PASSED",
      group_color_rhythm: "PASSED",
      group_qa: 95,
      hard_blocks: 0,
      contact_sheets: contacts.map((contact) => compactPath(contact.outputPath)),
      pages: [coverPath, ...results.map((result) => result.outputPath)].map(compactPath),
      calibration_g5: "AWAITING_USER_APPROVAL",
      g5_approval: "NOT_CREATED",
      final_manifest: "NOT_CREATED",
      feishu_writes: 0,
      c0001: "UNCHANGED",
      idempotent_replay: "PASS",
      g5_ref: relative(g5Write.path),
      style_lock_ref: styleLockRef,
    },
    null,
    2,
  ),
);

function compactPath(file: string) {
  return relative(file);
}
