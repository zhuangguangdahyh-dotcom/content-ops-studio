import { createMcpContext } from "../services/content-ops-mcp/src/context.js";
import { TOOL_DEFINITIONS } from "../services/content-ops-mcp/src/tool-registry.js";

const args = new Set(process.argv.slice(2));
const confirmed = args.has("--confirm-live-write");
const home = process.env.CONTENT_OPS_HOME;
const liveEnabled = process.env.CONTENT_OPS_ENABLE_LIVE_FEISHU === "1";
const binary = process.env.CONTENT_OPS_LARK_CLI_PATH;

if (!home || !binary || !liveEnabled || !confirmed) {
  process.stdout.write(
    `${JSON.stringify({ status: "NOT_CONFIGURED", configured: Boolean(home && binary && liveEnabled), cli_confirmed: confirmed, writes_attempted: 0 })}\n`,
  );
  process.exit(2);
}

const projectId = "PRJ-20260824-P2B2";
const researchRunId = "RUN-20260824-085455-P3A1";
const painpointId = "P-0001";
const now = new Date();
const compact = now.toISOString().replaceAll(/[-:]/g, "").replace("T", "-").slice(0, 15);
const runId = process.env.CONTENT_OPS_PHASE3B_RUN_ID ?? `RUN-${compact}-P3B1`;
const at = process.env.CONTENT_OPS_PHASE3B_AT ?? now.toISOString();
const context = createMcpContext({
  pluginRoot: new URL("../plugins/content-ops-studio", import.meta.url).pathname,
  home,
  env: process.env,
});

function tool(name: string) {
  const definition = TOOL_DEFINITIONS.find((item) => item.name === name);
  if (!definition) throw new Error(`MCP_TOOL_NOT_FOUND:${name}`);
  return definition;
}

const doctor = await tool("content_ops_doctor").handler(context, {});
if (doctor.status !== "SUCCESS") throw new Error("CONTENT_LIVE_DOCTOR_BLOCKED");
const contentContext = await tool("content_ops_get_content_context").handler(context, {
  project_id: projectId,
  painpoint_id: painpointId,
  research_run_id: researchRunId,
});
if (contentContext.status !== "SUCCESS") throw new Error("CONTENT_CONTEXT_BLOCKED");

const planned = await tool("content_ops_plan_content_creation").handler(context, {
  project_id: projectId,
  painpoint_id: painpointId,
  research_run_id: researchRunId,
  run_id: runId,
  operation: "CREATE_NEW",
  requested_content_id: "C-0001",
  requested_page_count: 6,
  single_core_problem: "决策者如何在咨询前判断专业服务主体的身份与资质是否值得信任？",
  user_fixed_angle: null,
});
const planDetails = planned.details as Record<string, unknown>;
const plan = planDetails.plan as Record<string, unknown>;
const angleDecision = planDetails.angle_decision as Record<string, unknown>;
if (!plan || !angleDecision) throw new Error("CONTENT_PLAN_INVALID");

const content = {
  content_id: "C-0001",
  project_id: projectId,
  record_unique_key: `${projectId}::content::C-0001`,
  primary_painpoint_id: painpointId,
  content_topic: "专业身份与资质信任判断清单",
  content_angle: "资质判断清单",
  content_structure_type: "CHECKLIST",
  audience_explicit_need: "在咨询或合作前快速判断专业服务主体是否值得进一步了解。",
  audience_deep_anxiety: "被抽象包装影响判断，投入时间和沟通成本后才发现主体或服务并不匹配。",
  single_core_problem: "决策者如何在咨询前判断专业服务主体的身份与资质是否值得信任？",
  core_viewpoint: "与其相信抽象的专业感，不如核验主体身份、适用资质和服务边界三类可验证信息。",
  solution_logic: "先确认服务主体，再核对资质适用范围，最后确认服务边界与实际需求是否匹配。",
  content_objective: "TRUST",
  page_count: 6,
  page_structure_summary: "封面提出判断问题；主体、资质、边界三项核验；汇总三步；给出克制结论。",
  background_direction: "",
  visual_plan_summary: "",
  direct_message_hook: "",
  publish_title: "专业身份，先看这3点",
  title_character_count: 10,
  publish_body:
    "看到一个专业服务账号时，先别急着被头衔和包装说服。更稳妥的判断，是把“看起来专业”拆成三件能核验的事：服务主体是否清楚，展示的资质是否适用于这项服务，服务边界是否与你的实际需求匹配。\n\n平台认证信息可以提供基础身份信号，但它不能替代你对具体能力、过程和适用范围的判断。先核验，再沟通；先确认匹配，再做决定。这样省下的不是一次提问，而是后续反复试错的时间。",
  promotion_suitability: "MEDIUM",
  promotion_reason:
    "主题和目标客户明确，具备决策价值；但现有证据只支持身份与资质属于基础信号，不能外推为咨询或成交效果，因此不评为HIGH。",
  duplication_risk: "LOW",
  content_status: "COPY_PENDING_APPROVAL",
  image_status: "IMAGE_NOT_GENERATED",
  first_page_approval_status: "FIRST_PAGE_NOT_SUBMITTED",
  final_approval_status: "FINAL_NOT_SUBMITTED",
  sync_status: "SYNC_NOT_STARTED",
  output_relative_path: null,
  creation_source: "RESEARCH",
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: null,
  style_lock_version: null,
  schema_version: "1.0.0",
  last_run_id: runId,
  finalized_at: null,
  created_at: at,
  updated_at: at,
  extensions: {},
};

const pageData = [
  [
    "COVER",
    "先别急着相信“专业”",
    "真正值得判断的，不是包装有多满，而是身份、资质和服务边界能不能被核验。",
    "建立点击理由并提出唯一问题。",
  ],
  [
    "PROBLEM",
    "第一看：主体是谁",
    "先确认提供服务的主体名称、公开身份和实际承接方是否一致。信息越模糊，越需要继续问清。",
    "把抽象信任拆成主体核验。",
  ],
  [
    "EVIDENCE",
    "第二看：资质是否适用",
    "平台专业号认证会核验企业主体、营业执照及部分行业资质；但有认证，不等于所有服务都在适用范围内。",
    "使用保留证据说明资质只是基础信号。",
  ],
  [
    "ANALYSIS",
    "第三看：边界是否清楚",
    "专业判断也包括知道什么能做、什么不能做、需要哪些前提。只讲结果、不讲边界，不足以支持决定。",
    "提供明确的专业判断标准。",
  ],
  [
    "STEP",
    "把信任变成3步核验",
    "①主体是否清楚；②资质是否对应；③服务边界是否匹配。三项都能回答，再进入下一步沟通。",
    "把观点转成可执行动作。",
  ],
  [
    "SUMMARY",
    "先核验，再决定",
    "认证可以提供基础身份信号，但不能替代对具体能力和适用范围的判断。把证据看清，再决定要不要继续。",
    "克制收束并说明证据边界。",
  ],
] as const;
const pages = pageData.map(([page_role, headline, body, content_purpose], index) => ({
  page_number: index + 1,
  page_role,
  copy_version: "CV-1",
  headline,
  body,
  supporting_text: "",
  content_purpose,
  background_direction: "",
  visual_evidence_requirement:
    index === 2 ? "后续视觉规划如需展示认证信息，只能使用虚构示意且不得伪造真实认证截图。" : "",
  layout_notes: "",
  negative_constraints: ["不使用真实客户资料", "不生成正式视觉方案"],
  created_at: at,
  updated_at: at,
  extensions: { preliminary_visual_handoff_notes: "Phase 3B only; no formal visual field." },
}));

const claims = [
  {
    claim_id: "CL-0001",
    page_number: 3,
    claim_type: "FACTUAL_EXTERNAL",
    claim_text: "平台专业号认证会核验企业主体、营业执照及部分行业资质。",
    evidence_refs: ["E-0001"],
    support_status: "SUPPORTED_WITH_LIMITATIONS",
    support_rationale: "保留的平台文档证据直接覆盖企业主体、营业执照和部分行业资质作为认证要素。",
    limitations: ["认证要求不能单独证明内容一定带来咨询或成交。"],
    rewrite_requirement: null,
  },
  ...[1, 2, 4, 5, 6].map((pageNumber, index) => ({
    claim_id: `CL-${String(index + 2).padStart(4, "0")}`,
    page_number: pageNumber,
    claim_type: "PROFESSIONAL_JUDGMENT",
    claim_text: [
      "专业信任应优先依靠可核验信息，而不是抽象包装。",
      "服务主体信息模糊时，应继续核验再决定。",
      "清楚说明能力与服务边界是专业判断的一部分。",
      "主体、资质、边界可以组成一个实用的三步核验框架。",
      "认证是基础身份信号，不能替代具体能力和适用范围判断。",
    ][index],
    evidence_refs: [],
    support_status: "JUDGMENT_NO_EXTERNAL_EVIDENCE_REQUIRED",
    support_rationale: "明确作为本内容的专业判断和决策建议，不表述为统计事实或行业普遍结论。",
    limitations: ["这是通用判断框架，具体行业仍需核对适用规则。"],
    rewrite_requirement: null,
  })),
];
const claimMap = {
  claim_map_id: `CLM-${runId.replace(/^RUN-/, "")}`,
  project_id: projectId,
  content_id: "C-0001",
  content_version: "CV-1",
  copy_version: "CV-1",
  claims,
  supported_claim_count: 1,
  unsupported_claim_count: 0,
  judgment_claim_count: 5,
  opinion_claim_count: 0,
  ready_for_copy_review: true,
  created_at: at,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: {},
};

const submitted = await tool("content_ops_submit_content_draft").handler(context, {
  project_id: projectId,
  run_id: runId,
  research_run_id: researchRunId,
  painpoint_id: painpointId,
  plan_hash: plan.plan_hash,
  painpoint_version: plan.painpoint_version,
  project_rule_snapshot: plan.project_rule_snapshot,
  idempotency_key: `CONTENT-${runId}-C0001`,
  plan,
  angle_decision: angleDecision,
  content,
  pages,
  claim_map: claimMap,
  dimension_scores: {
    FOCUS: 5,
    AUDIENCE_RELEVANCE: 4.5,
    VALUE_DELIVERY: 4.5,
    EVIDENCE_SUPPORT: 4.5,
    SUBJECT_FIT: 4,
    PLATFORM_FIT: 4,
    READABILITY: 4.5,
    ORIGINALITY: 4,
    CTA_RELEVANCE: 5,
  },
  near_semantic_assessments: [],
});
const hashes = submitted.details as Record<string, unknown>;
const finalized = await tool("content_ops_finalize_content_copy").handler(context, {
  project_id: projectId,
  run_id: runId,
  content_creation_plan_hash: hashes.content_creation_plan_hash,
  content_draft_hash: hashes.content_draft_hash,
  claim_map_hash: hashes.claim_map_hash,
  idempotency_key: `CONTENT-${runId}-C0001`,
  explicit_confirmation: true,
});
if (finalized.status !== "AWAITING_APPROVAL") {
  throw new Error(`CONTENT_FINALIZE_UNEXPECTED_STATUS:${finalized.status}`);
}
const verified = await tool("content_ops_verify_content").handler(context, {
  project_id: projectId,
  run_id: runId,
  content_id: "C-0001",
});
if (verified.status !== "SUCCESS") throw new Error("CONTENT_REMOTE_VERIFY_BLOCKED");

process.stdout.write(
  `${JSON.stringify({ status: finalized.status, run_id: runId, content_id: "C-0001", content_version: "CV-1", copy_version: "CV-1", title: content.publish_title, title_character_count: content.title_character_count, page_count: pages.length, core_problem: content.single_core_problem, core_viewpoint: content.core_viewpoint, structure: content.content_structure_type, promotion_suitability: content.promotion_suitability, duplicate_risk: (finalized.details as Record<string, unknown>).duplicate_risk, quality_score: (finalized.details as Record<string, unknown>).quality_score, blocking_failures: (finalized.details as Record<string, unknown>).blocking_failures, writes_attempted: (finalized.details as Record<string, unknown>).writes_attempted, remote_verification: verified.status, painpoint_status_match: (verified.details as Record<string, unknown>).painpoint_status_match, remote_identifiers_exposed: false })}\n`,
);
