import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import {
  assertCalibrationContentReadyForG3,
  calibrationContentFingerprint,
  evaluateCalibrationContentQa,
  type CalibrationContentPackageInput,
  type CalibrationContentPage,
} from "../packages/core/src/content/calibration-repair.js";
import { CalibrationContentRepairRuntime } from "../packages/runtime/src/content/calibration-repair.js";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const schemaRoot = path.join(repositoryRoot, "plugins/content-ops-studio/schemas/1.0");
const projectHome =
  process.env.CONTENT_OPS_HOME ??
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br23";
const projectId = "CAL-COMMERCIAL-SPACE-001";
const contentId = "C-9001";
const runId = "RUN-20260826-223000-C4R1";
const createdAt = "2026-08-26T14:30:00.000Z";
const expectedCoverChecksum = "616d4eb80d06587f187880ecb9e4a447ce537da937b267b6691436b2672bf274";
const expectedC0001Checksum = "b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5";
const legacyRun = "RUN-20260826-213000-G4A1";
const projectRoot = path.join(projectHome, "projects", projectId);
const legacyRoot = path.join(projectRoot, "runs", legacyRun, "image-production");
const coverPath = path.join(
  projectRoot,
  "runs/RUN-20260826-204500-R25C/image-production/formal-calibration-cover/formal-calibration-cover-fpv2.png",
);
const formalCoverPath = path.join(
  projectRoot,
  "runs/RUN-20260826-204500-R25C/image-production/formal-calibration-cover.json",
);
const legacyG4Path = path.join(legacyRoot, "calibration-g4-approval.json");
const legacyStyleLockPath = path.join(legacyRoot, "calibration-style-lock-v1.json");
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

function projectRelative(file: string): string {
  const relative = path.relative(projectHome, file).split(path.sep).join("/");
  if (relative.startsWith("../") || path.isAbsolute(relative))
    throw new Error("CALIBRATION_CONTENT_PATH_ESCAPE");
  return relative;
}

async function legacySnapshot(): Promise<Map<string, string>> {
  const currentSegment = `${path.sep}${runId}${path.sep}`;
  const files = (await filesRecursively(projectRoot)).filter(
    (file) => !file.includes(currentSegment),
  );
  return new Map(
    await Promise.all(
      files.map(async (file) => [projectRelative(file), await hashFile(file)] as const),
    ),
  );
}

function assertSnapshotsEqual(before: Map<string, string>, after: Map<string, string>): void {
  if (before.size !== after.size)
    throw new Error("CALIBRATION_CONTENT_HISTORY_FILE_COUNT_CONFLICT");
  for (const [file, checksum] of before) {
    if (after.get(file) !== checksum)
      throw new Error(`CALIBRATION_CONTENT_HISTORY_CONFLICT:${file}`);
  }
}

function snapshot(page: Omit<CalibrationContentPage, "copy_snapshot">): string {
  return [page.section, page.primary_judgment, page.supporting_copy, ...page.core_structure]
    .filter((value) => typeof value === "string" && value.length > 0)
    .join("\n");
}

function page(value: Omit<CalibrationContentPage, "copy_snapshot">): CalibrationContentPage {
  return { ...value, copy_snapshot: snapshot(value) };
}

const pages: CalibrationContentPage[] = [
  page({
    page_number: 1,
    page_role: "COVER",
    page_intent: "COVER_ENTRY",
    section: null,
    primary_judgment: "门头没说清，\n顾客就走了",
    supporting_copy: "门店老板先查品类、定位和入口",
    core_structure: [],
    content_function: "作为信息流入口，筛选门店老板，明确门头信息表达Painpoint。",
    primary_information_task: "说明为什么门店老板值得继续阅读。",
    negative_constraints: ["不得修改既有正式封面文案"],
  }),
  page({
    page_number: 2,
    page_role: "PROBLEM",
    page_intent: "CONTENT_EDITORIAL",
    section: null,
    primary_judgment: "门头真正的问题，\n不是好不好看",
    supporting_copy: "而是顾客第一眼能不能看懂：\n你是谁、卖什么、值不值得进去。",
    core_structure: [],
    content_function: "将认知从门头审美转向门头作为经营判断入口。",
    primary_information_task: "重新定义门头问题。",
    negative_constraints: ["不得扩展成泛装修知识"],
  }),
  page({
    page_number: 3,
    page_role: "ANALYSIS",
    page_intent: "DIAGNOSTIC_PAGE",
    section: "第一查：品类",
    primary_judgment: "不进店，\n能一眼看懂你卖什么吗？",
    supporting_copy: "如果门头只能传达“好看”，\n却看不出经营内容，\n顾客就需要花更多力气理解你。",
    core_structure: [],
    content_function: "检查品类识别。",
    primary_information_task: "判断门头是否完成品类识别。",
    negative_constraints: ["不得增加未经支持的经营结果"],
  }),
  page({
    page_number: 4,
    page_role: "ANALYSIS",
    page_intent: "DIAGNOSTIC_PAGE",
    section: "第二查：定位",
    primary_judgment: "看起来像你真正\n想吸引的那类顾客吗？",
    supporting_copy: "材质、比例、灯光和信息密度，\n都在提前告诉顾客：\n这家店适不适合我。",
    core_structure: [],
    content_function: "检查目标客户定位。",
    primary_information_task: "判断门头视觉定位是否匹配目标客户。",
    negative_constraints: ["不得增加未经支持的经营结果"],
  }),
  page({
    page_number: 5,
    page_role: "ANALYSIS",
    page_intent: "DIAGNOSTIC_PAGE",
    section: "第三查：入口",
    primary_judgment: "顾客知道从哪里进，\n也愿意靠近吗？",
    supporting_copy: "入口太退、太暗、被陈列遮挡，\n都会增加顾客靠近和进入之前的犹豫。",
    core_structure: [],
    content_function: "检查进入判断阻力。",
    primary_information_task: "判断入口是否增加靠近和进入前的犹豫。",
    negative_constraints: ["不得扩写转化率、进店率、营收或具体经营数据"],
  }),
  page({
    page_number: 6,
    page_role: "SUMMARY",
    page_intent: "SUMMARY_PAGE",
    section: null,
    primary_judgment: "门头先解决这3件事",
    supporting_copy: "漂亮只是结果。\n让顾客第一眼更快完成判断，\n才是门头真正要解决的问题。",
    core_structure: ["看懂品类", "感知定位", "找到入口"],
    content_function: "形成三项可记忆自查方法。",
    primary_information_task: "收束并复述三项门头自查方法。",
    negative_constraints: ["不得增加CTA、私信口令、咨询命令、金额或第7页"],
  }),
];

const input: CalibrationContentPackageInput = {
  project_ref: { project_kind: "CALIBRATION_PROJECT", project_id: projectId },
  content_id: contentId,
  content_version: "CV-2",
  copy_version: "CV-2",
  page_count: 6,
  pages,
  audience: "准备开店、升级门店或改善门头的门店老板",
  painpoint: "顾客第一眼不能快速识别门店的品类、定位和入口。",
  content_promise: "通过品类、定位、入口三个维度完成一次基础门头自查。",
  content_value: {
    statement:
      "帮助准备开店、升级门店或改善门头的门店老板，从“门头好不好看”转向“顾客第一眼能不能快速完成经营信息识别”，并通过品类、定位、入口完成一次基础门头自查。",
    value_types: ["DECISION_VALUE", "RISK_REDUCTION", "SELF_DIAGNOSIS"],
  },
  narrative_structure: [
    "为什么值得点开",
    "重新定义问题",
    "检查品类",
    "检查定位",
    "检查入口",
    "形成三项自查",
  ].map((purpose, index) => ({ page_number: index + 1, purpose })),
};

const historyBefore = await legacySnapshot();
const c0001Before = await hashFile(c0001Path);
if (c0001Before !== expectedC0001Checksum) throw new Error("CALIBRATION_CONTENT_C0001_CONFLICT");
if ((await hashFile(coverPath)) !== expectedCoverChecksum)
  throw new Error("CALIBRATION_CONTENT_LEGACY_COVER_CONFLICT");

const [formalCover, legacyG4, legacyStyleLock] = await Promise.all([
  readJson<{
    primary_hook: string;
    supporting_signal: string;
    content_version: string;
    copy_version: string;
    visual_plan_version: string;
    calibration_cover_version: string;
    asset_checksum: string;
  }>(formalCoverPath),
  readJson<{
    content_version: string;
    copy_version: string;
    visual_plan_version: string;
    first_page_version: string;
    asset_checksum: string;
    approval_event: { approval_id: string };
    status: string;
  }>(legacyG4Path),
  readJson<{
    content_version: string;
    copy_version: string;
    visual_plan_version: string;
    first_page_version: string;
    source_asset_checksum: string;
    style_lock_version: string;
    status: string;
  }>(legacyStyleLockPath),
]);

const legacyBinding = [
  legacyG4.content_version,
  legacyG4.copy_version,
  legacyG4.visual_plan_version,
  legacyG4.first_page_version,
  legacyG4.approval_event.approval_id,
  legacyStyleLock.style_lock_version,
].join(" / ");
if (legacyBinding !== "CV-1 / CV-1 / VV-1 / FPV-2 / APR-20260826-G4A1 / SLV-1")
  throw new Error("CALIBRATION_CONTENT_LEGACY_BINDING_CONFLICT");
if (
  legacyG4.status !== "PASSED" ||
  legacyStyleLock.status !== "CREATED" ||
  legacyG4.asset_checksum !== expectedCoverChecksum ||
  legacyStyleLock.source_asset_checksum !== expectedCoverChecksum
)
  throw new Error("CALIBRATION_CONTENT_LEGACY_STATE_CONFLICT");

const normalizeCopy = (value: string): string => value.replace(/\s+/gu, "");
if (
  normalizeCopy(formalCover.primary_hook) !== normalizeCopy(pages[0]?.primary_judgment ?? "") ||
  normalizeCopy(formalCover.supporting_signal) !== normalizeCopy(pages[0]?.supporting_copy ?? "")
)
  throw new Error("CALIBRATION_CONTENT_COVER_COPY_CONFLICT");

assertCalibrationContentReadyForG3(input);
const qa = evaluateCalibrationContentQa(input);
const fingerprint = calibrationContentFingerprint(input);
const runtime = new CalibrationContentRepairRuntime({
  projectHome,
  projectId,
  runId,
  schemaRoot,
});
const qualityReportRef = `projects/${projectId}/runs/${runId}/content/content-quality-report.json`;
const packageRef = `projects/${projectId}/runs/${runId}/content/content-package.json`;
const qualityReport = {
  quality_report_id: "CCQR-CAL-COMMERCIAL-SPACE-001-CV2",
  project_ref: input.project_ref,
  content_id: contentId,
  content_version: "CV-2",
  copy_version: "CV-2",
  page_count: 6,
  checks: qa.checks,
  weighted_score: qa.weighted_score,
  blocking_failures: qa.blocking_failures,
  ready_for_g3: qa.ready_for_g3,
  revision_suggestions: [],
  production_workspace_write_eligible: false,
  run_id: runId,
  created_at: createdAt,
  schema_version: "1.0.0",
  extensions: {
    one_primary_painpoint: true,
    copy_modified_by_runtime: false,
    prohibited_claims_present: false,
  },
};
const qualityWrite = await runtime.writeOnceOrReuse(
  "calibration-content-quality-report",
  "content-quality-report.json",
  qualityReport,
);
const contentPackage = {
  package_id: "CCP-CAL-COMMERCIAL-SPACE-001-CV2",
  ...input,
  content_fingerprint: fingerprint,
  quality_report_ref: qualityReportRef,
  source_run_id: runId,
  version_binding: {
    current: "CV-2:CV-2",
    legacy: legacyBinding,
    legacy_status: "HISTORICAL_VALID_NOT_CURRENT_FOR_CV2",
  },
  status: "G3_PENDING",
  production_workspace_write_eligible: false,
  imagegen_calls: 0,
  renderer_calls: 0,
  feishu_writes: 0,
  generated_at: createdAt,
  schema_version: "1.0.0",
  extensions: {
    legacy_cover_copy_equivalence: "PASS",
    historical_calibration_style_reference: "SLV-1",
    active_style_lock_for_cv2: null,
    operator_draft_copy_preserved_exactly: true,
  },
};
const packageWrite = await runtime.writeOnceOrReuse(
  "calibration-content-package",
  "content-package.json",
  contentPackage,
);
const reviewRequest = {
  review_request_id: "CG3R-CAL-COMMERCIAL-SPACE-001-CV2",
  project_ref: input.project_ref,
  content_id: contentId,
  content_version: "CV-2",
  copy_version: "CV-2",
  page_count: 6,
  content_package_ref: packageRef,
  content_package_hash: packageWrite.sha256,
  content_fingerprint: fingerprint,
  quality_report_ref: qualityReportRef,
  quality_score: qa.weighted_score,
  blocking_failures: [],
  source_run_id: runId,
  status: "AWAITING_USER_APPROVAL",
  decision: "PENDING_OPERATOR",
  approval_created: false,
  legacy_chain: {
    binding: legacyBinding,
    status: "PRESERVED_VALID_FOR_CV1_ONLY",
  },
  new_visual_plan: "NOT_CREATED",
  new_first_page: "NOT_CREATED",
  new_g4: "NOT_CREATED",
  slv2: "NOT_CREATED",
  remaining_pages: 0,
  imagegen_calls: 0,
  renderer_calls: 0,
  feishu_writes: 0,
  production_workspace_write_eligible: false,
  created_at: createdAt,
  schema_version: "1.0.0",
  extensions: {
    g3_approval_id: null,
    visual_rebinding_authorized: false,
  },
};
const reviewWrite = await runtime.writeOnceOrReuse(
  "calibration-g3-review-request",
  "calibration-g3-review-request.json",
  reviewRequest,
);

const replay = await Promise.all([
  runtime.writeOnceOrReuse(
    "calibration-content-quality-report",
    "content-quality-report.json",
    qualityReport,
  ),
  runtime.writeOnceOrReuse("calibration-content-package", "content-package.json", contentPackage),
  runtime.writeOnceOrReuse(
    "calibration-g3-review-request",
    "calibration-g3-review-request.json",
    reviewRequest,
  ),
]);
if (replay.some((result) => !result.reused))
  throw new Error("CALIBRATION_CONTENT_IDEMPOTENT_REPLAY_FAILED");

const historyAfter = await legacySnapshot();
assertSnapshotsEqual(historyBefore, historyAfter);
if ((await hashFile(c0001Path)) !== c0001Before)
  throw new Error("CALIBRATION_CONTENT_C0001_CHANGED");

process.stdout.write(
  `${JSON.stringify({
    status: "AWAITING_USER_APPROVAL",
    phase_status: "SUCCESS",
    compatibility: "PASSED",
    project_id: projectId,
    content_id: contentId,
    content_version: "CV-2",
    copy_version: "CV-2",
    page_count: 6,
    content_fingerprint: fingerprint,
    content_package_hash: packageWrite.sha256,
    quality_score: qa.weighted_score,
    blocking_failures: 0,
    package_created: !packageWrite.reused,
    package_reused: packageWrite.reused,
    quality_created: !qualityWrite.reused,
    review_created: !reviewWrite.reused,
    g3_decision: "PENDING_OPERATOR",
    g3_approval_created: false,
    legacy_chain: "PRESERVED_VALID_FOR_CV1_ONLY",
    new_visual_plan: "NOT_CREATED",
    new_first_page: "NOT_CREATED",
    new_g4: "NOT_CREATED",
    slv2: "NOT_CREATED",
    remaining_pages: 0,
    imagegen_calls: 0,
    renderer_calls: 0,
    feishu_writes: 0,
    output_root: runtime.root,
  })}\n`,
);
