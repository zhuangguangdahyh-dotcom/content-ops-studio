import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadSchemaRegistry } from "../packages/contracts/src/validation/index.js";
import { FirstPageRuntime } from "../packages/runtime/src/first-page/index.js";
import { GlobalVisualPreferenceRuntime } from "../packages/runtime/src/image-production/index.js";
import type {
  ApprovalEvent,
  FirstPageReview,
} from "../packages/contracts/src/generated/1.0/index.js";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const schemaRoot = path.join(repositoryRoot, "plugins/content-ops-studio/schemas/1.0");
const sourceHome = "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4b";
const learningHome = "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br2";
const projectId = "PRJ-20260824-P2B2";
const contentId = "C-0001";
const sourceRunId = "RUN-20260825-174500-P4BF";
const revisionRunId = "RUN-20260826-120000-R2RV";
const at = "2026-08-26T04:00:00.000Z";
const checksum = "b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5";
const sourceRun = path.join(sourceHome, "projects", projectId, "runs", sourceRunId);
const sourcePng = path.join(sourceRun, "outputs/first-page/01-cover_fpv2.png");
const stateFile = path.join(sourceRun, "outputs/first-page/first-page-runtime-state.json");
const revisionRoot = path.join(sourceHome, "projects", projectId, "runs", revisionRunId);

function sha256(data: Uint8Array | string): string {
  return createHash("sha256").update(data).digest("hex");
}

async function immutableJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const encoded = `${JSON.stringify(value, null, 2)}\n`;
  try {
    await writeFile(file, encoded, { encoding: "utf8", mode: 0o600, flag: "wx" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    if ((await readFile(file, "utf8")) !== encoded)
      throw new Error(`PHASE4BR2_ARTIFACT_CONFLICT:${path.basename(file)}`, { cause: error });
  }
  if ((await readFile(file, "utf8")) !== encoded)
    throw new Error(`PHASE4BR2_READ_VERIFY_FAILED:${path.basename(file)}`);
}

async function atomicJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const encoded = `${JSON.stringify(value, null, 2)}\n`;
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, encoded, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, file);
  if ((await readFile(file, "utf8")) !== encoded)
    throw new Error(`PHASE4BR2_READ_VERIFY_FAILED:${path.basename(file)}`);
}

const originalBytes = await readFile(sourcePng);
if (sha256(originalBytes) !== checksum) throw new Error("ARTIFACT_CONFLICT:FPV2_CHECKSUM");
const stateBefore = JSON.parse(await readFile(stateFile, "utf8")) as Record<string, unknown>;
if (
  stateBefore.content_version !== "CV-1" ||
  stateBefore.copy_version !== "CV-1" ||
  stateBefore.visual_plan_version !== "VV-2" ||
  stateBefore.first_page_version !== "FPV-2" ||
  stateBefore.asset_checksum !== checksum ||
  stateBefore.status !== "AWAITING_USER_APPROVAL" ||
  stateBefore.style_lock_version !== null
)
  throw new Error("ARTIFACT_CONFLICT:FPV2_STATE_BINDING");

const registry = await loadSchemaRegistry(schemaRoot);
const overallComment =
  "当前FPV-2机械质量通过，但不符合小红书获客封面的核心要求。封面文字不够精简，手机信息流中的文字占比和识别效率不足，不能直接筛选精准客户，也没有清楚指出Painpoint或价值。当前抽象材质底图与具体行业、业务场景、目标客户和内容缺少直接关联，呈现为通用装饰海报。需要先修订封面转化文案，再重新规划与行业和内容直接相关的视觉方向。";
const review: FirstPageReview = {
  first_page_review_id: "FPR-C0001-P4BR2-001",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-2",
  first_page_version: "FPV-2",
  asset_checksum: checksum,
  decision: "REVISE",
  overall_comment: overallComment,
  layout_feedback: "当前模板在手机信息流中无法形成足够强的单一点击焦点。",
  typography_feedback: "现有文字密度、字号和信息占比不足以承担获客封面筛选。",
  color_feedback: "当前配色本身不是主要缺陷，不得据此建立Style Lock。",
  hierarchy_feedback: "封面需优先表达精准客户、Painpoint、价值、风险或判断中的至少一项。",
  graphic_feedback: "抽象材质与行业、业务场景、Audience及内容缺少直接语义关联。",
  copy_feedback: "先建立独立的Cover Conversion Copy，再进入新G3和新视觉方向。",
  requested_changes: [
    "创建独立Cover Copy Package并重新执行G3。",
    "重新规划与具体行业、业务场景、Audience和内容直接相关的视觉方向。",
    "保留FPV-2为CURRENT_SET负向参考，不创建Style Lock或第2—6页。",
  ],
  revision_classification: "CONTENT_COPY",
  revision_routes: ["CONTENT_COPY", "GLOBAL_VISUAL_DIRECTION"],
  reviewer_role: "OPERATOR",
  source_run_id: revisionRunId,
  created_at: at,
  schema_version: "1.0.0",
  extensions: {
    scope: "CURRENT_SET",
    long_term_rule_candidate_for_asset: false,
    source_asset_disposition: "PRESERVED_NEGATIVE_CURRENT_SET_REFERENCE",
  },
};
const approval: ApprovalEvent = {
  approval_id: "APR-20260826-G4R2",
  gate: "FIRST_PAGE",
  target_type: "FIRST_PAGE_ASSET",
  target_id: String(stateBefore.asset_id),
  target_version: `CV-1:CV-1:VV-2:FPV-2:${checksum}`,
  decision: "REVISE",
  comment: overallComment,
  source_run_id: revisionRunId,
  created_at: at,
  deprecated_at: null,
  schema_version: "1.0.0",
};
const revisionPlan = {
  revision_plan_id: "CRP-C0001-P4BR2-001",
  project_id: projectId,
  content_id: contentId,
  source_content_version: "CV-1",
  source_copy_version: "CV-1",
  source_visual_plan_version: "VV-2",
  source_first_page_version: "FPV-2",
  source_asset_checksum: checksum,
  revision_routes: ["CONTENT_COPY", "GLOBAL_VISUAL_DIRECTION"],
  next_content_version: "CV-2",
  next_copy_version: "CV-2",
  next_cover_copy_version: "CCV-1",
  requires_new_g3: true,
  preserve_source_asset: true,
  negative_reference_scope: "CURRENT_SET",
  next_action: "COVER_COPY_REVISION_REQUIRED",
  run_id: revisionRunId,
  created_at: at,
  schema_version: "1.0.0",
  extensions: { formal_first_page_regeneration_authorized: false },
};
const negativeReference = {
  event_id: "VFE-C0001-FPV2-NEGATIVE",
  project_id: projectId,
  content_id: contentId,
  feedback_class: "PRODUCTION_FEEDBACK",
  scope: "CURRENT_SET",
  target_type: "ELEMENT",
  target_id: String(stateBefore.asset_id),
  statement: overallComment,
  is_tool_or_system_defect: false,
  long_term_rule_candidate: false,
  creates_long_term_rule: false,
  source: "OPERATOR_FEEDBACK",
  run_id: revisionRunId,
  schema_version: "1.0.0",
  created_at: at,
};
registry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/first-page-review.schema.json",
  review,
);
registry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/approval-event.schema.json",
  approval,
);
registry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/cover-revision-plan.schema.json",
  revisionPlan,
);
registry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/visual-feedback-event.schema.json",
  negativeReference,
);

await immutableJson(path.join(revisionRoot, "approvals/first-page-review.json"), review);
await immutableJson(path.join(revisionRoot, "approvals/g4-revise-approval.json"), approval);
await immutableJson(path.join(revisionRoot, "revision/cover-revision-plan.json"), revisionPlan);
await immutableJson(
  path.join(revisionRoot, "revision/fpv2-negative-current-set-reference.json"),
  negativeReference,
);

const runtime = new FirstPageRuntime(stateFile);
const finalized = await runtime.finalizeG4({
  review,
  approval,
  styleLockId: "SL-NOT-CREATED",
  styleLockVersion: "SLV-1",
  sourceFirstPagePlanId: "FPPP-C0001-FPV2",
  sourceAsset: {} as never,
  canvas: {} as never,
  safeArea: {} as never,
  typography: [] as never,
  colors: [] as never,
  grid: {},
  imageTreatment: {} as never,
  visualMode: "EDITORIAL_SERIES",
  createdAt: at,
});
if (finalized.styleLock !== null || finalized.state.status !== "REVISION_REQUIRED")
  throw new Error("G4_REVISE_STATE_UPDATE_FAILED");
const stateAfter = await runtime.read();
if (
  stateAfter?.status !== "REVISION_REQUIRED" ||
  stateAfter.style_lock_version !== null ||
  stateAfter.approval_id !== approval.approval_id
)
  throw new Error("G4_REVISE_READ_VERIFY_FAILED");

const globalEvent = {
  event_id: "VFE-GLOBAL-COVER-P4BR2",
  project_id: projectId,
  content_id: null,
  feedback_class: "VISUAL_PREFERENCE",
  scope: "GLOBAL_USER_PREFERENCE",
  target_type: "GLOBAL",
  target_id: "GLOBAL-COVER-CONVERSION-AND-SEMANTIC-PREFERENCE",
  statement:
    "小红书获客封面需要快速识别、点击筛选、内容与场景直接相关，并支持动态排版与版本化视觉学习。",
  is_tool_or_system_defect: false,
  long_term_rule_candidate: true,
  creates_long_term_rule: false,
  source: "OPERATOR_FEEDBACK",
  run_id: revisionRunId,
  schema_version: "1.0.0",
  created_at: at,
};
const ruleInputs = [
  {
    id: "VR-GLOBAL-COVER-CLICK",
    type: "MUST",
    statement:
      "小红书获客型封面必须在手机信息流中快速识别，并通过精准客户、现实痛点、明确价值、风险、结果或判断中的至少一项完成点击筛选。",
    rationale: "封面不是普通内容页，需要承担精准客户识别和点击决策。",
    positives: ["手机缩略图一秒内能识别客户或Painpoint"],
    negatives: ["只展示正文摘要但没有点击理由"],
    exceptions: ["非获客型Account Goal按其明确目标使用不同阈值。"],
  },
  {
    id: "VR-GLOBAL-COVER-NO-DECORATIVE",
    type: "MUST_NOT",
    statement:
      "不得将与行业、业务场景、客户情境、Painpoint、内容价值、项目主体或证据无直接关联的通用装饰图片作为默认封面底图。",
    rationale: "仅‘看起来高级’的无关底图不能支持获客、内容理解和项目识别。",
    positives: ["与业务场景直接相关的项目图、人物、空间、产品或证据"],
    negatives: ["只承担装饰作用的无关高级静物或抽象材质"],
    exceptions: ["经Project允许、关系可解释并通过语义与缩略图QA的抽象视觉。"],
  },
  {
    id: "VR-GLOBAL-COVER-AVOID-POSTER",
    type: "AVOID",
    statement: "避免传统‘左侧小比例文字 + 右侧无关高级静物或抽象装置’的通用海报模板。",
    rationale: "固定模板容易削弱业务识别、内容语义和缩略图点击效率。",
    positives: ["由当前内容决定的文字占比、视线焦点和场景关系"],
    negatives: ["机械复用左小字右无关静物"],
    exceptions: [
      "只有当该构图与当前行业、内容语义和用户明确审美要求高度相关，并通过Semantic Relevance与Thumbnail QA时才允许。",
    ],
  },
  {
    id: "VR-GLOBAL-COVER-DYNAMIC-ASSET",
    type: "PREFER",
    statement:
      "根据行业、项目、用户习惯、Painpoint、内容价值和可用资产，动态使用高质量实拍、真实项目图、人物、空间、产品、证据、业务场景、编辑设计、AI生成视觉或混合素材。",
    rationale: "视觉资产来源必须服务具体内容，不预设单一风格。",
    positives: ["依据内容语义动态选择真实或生成资产"],
    negatives: ["所有项目固定同一种素材通道"],
    exceptions: ["安全、授权、真实性与证据要求始终优先。"],
  },
  {
    id: "VR-GLOBAL-COVER-DYNAMIC-TYPE",
    type: "MUST",
    statement:
      "封面文字的字体、字号、字重、行距、字距、对齐、颜色、留白和特效必须由项目视觉档案与单篇内容策略动态决定，并在长期使用中支持显式学习、覆盖、撤销和版本化。",
    rationale: "排版既要适应项目身份，也要适应单篇内容的点击与阅读任务。",
    positives: ["Profile与Per-Content Strategy共同决定Renderer参数"],
    negatives: ["跨项目机械套用一组固定排版参数"],
    exceptions: ["平台安全区与可访问性底线不得被覆盖。"],
  },
] as const;
const rules = ruleInputs.map((input) => ({
  rule_id: input.id,
  project_id: null,
  source_event_id: globalEvent.event_id,
  source_candidate_id: null,
  global_preference_version: "GUVPV-1",
  rule_statement: input.statement,
  rationale: input.rationale,
  scope: "GLOBAL_USER_PREFERENCE",
  rule_type: input.type,
  positive_examples: [...input.positives],
  negative_examples: [...input.negatives],
  allowed_exceptions: [...input.exceptions],
  confirmed_by_user: true,
  status: "ACTIVE",
  version: 1,
  supersedes_version: null,
  run_id: revisionRunId,
  schema_version: "1.0.0",
  created_at: at,
  updated_at: at,
}));
const preference = {
  preference_id: "GUVP-DEFAULT",
  preference_version: "GUVPV-1",
  active_rule_refs: rules.map((rule) => `${rule.rule_id}@1`),
  supersedes_version: null,
  confirmed_by_operator: true,
  source_event_id: globalEvent.event_id,
  run_id: revisionRunId,
  created_at: at,
  updated_at: at,
  schema_version: "1.0.0",
  extensions: { industry_pack_mutated: false },
};
const globalRuntime = new GlobalVisualPreferenceRuntime({ dataHome: learningHome, schemaRoot });
await globalRuntime.writeVersion("visual-feedback-event", globalEvent.event_id, globalEvent);
for (const rule of rules)
  await globalRuntime.writeVersion("visual-rule", `${rule.rule_id}-V1`, rule);
await globalRuntime.writeVersion(
  "global-user-visual-preference",
  preference.preference_version,
  preference,
);
await globalRuntime.activate(preference.preference_version, preference);
const globalReadback = await globalRuntime.readActive();
if (globalReadback?.artifact_key !== "GUVPV-1")
  throw new Error("GLOBAL_VISUAL_PREFERENCE_READ_VERIFY_FAILED");

const afterBytes = await readFile(sourcePng);
if (sha256(afterBytes) !== checksum || !afterBytes.equals(originalBytes))
  throw new Error("ARTIFACT_CONFLICT:FPV2_CHANGED_DURING_REVISION");
const checkpoint = {
  run_id: revisionRunId,
  project_id: projectId,
  gate: "G4 FIRST_PAGE",
  decision: "REVISE",
  target_version: approval.target_version,
  status: "REVISION_REQUIRED",
  next_action: "COVER_COPY_REVISION_REQUIRED",
  style_lock_created: false,
  remaining_pages_created: 0,
  fpv2_preserved: true,
  fpv2_checksum: checksum,
  global_visual_preference_version: "GUVPV-1",
  read_after_write: "VERIFIED",
  created_at: at,
};
await atomicJson(path.join(revisionRoot, "checkpoints/g4-revise-complete.json"), checkpoint);
await immutableJson(path.join(revisionRoot, "journal.json"), {
  events: [
    {
      event_type: "APPROVAL_RECORDED",
      gate: "G4 FIRST_PAGE",
      decision: "REVISE",
      target_version: approval.target_version,
      created_at: at,
    },
    {
      event_type: "STATE_TRANSITION",
      from: "AWAITING_USER_APPROVAL",
      to: "REVISION_REQUIRED",
      created_at: at,
    },
    {
      event_type: "GLOBAL_VISUAL_PREFERENCE_ACTIVATED",
      version: "GUVPV-1",
      rule_count: 5,
      created_at: at,
    },
  ],
});
await immutableJson(path.join(revisionRoot, "write-log.json"), {
  write_id: "WRITE-20260826-P4BR2-001",
  run_id: revisionRunId,
  operation: "LOCAL_G4_REVISE_AND_GLOBAL_VISUAL_PREFERENCE",
  idempotency_key: sha256(`${approval.target_version}:GUVPV-1`),
  state_before_hash: sha256(JSON.stringify(stateBefore)),
  state_after_hash: sha256(JSON.stringify(stateAfter)),
  verification_status: "VERIFIED",
  remote_write: false,
  feishu_write_count: 0,
  created_at: at,
});

process.stdout.write(
  `${JSON.stringify({
    status: "SUCCESS",
    g4: "REVISE",
    revision_routes: review.revision_routes,
    state: stateAfter?.status,
    fpv2_preserved: true,
    fpv2_checksum: checksum,
    style_lock_created: false,
    remaining_pages_created: 0,
    global_visual_preference_version: "GUVPV-1",
    global_rule_count: rules.length,
    industry_pack_mutated: false,
    feishu_write_count: 0,
    revision_root: revisionRoot,
    global_learning_root: globalRuntime.root,
  })}\n`,
);
