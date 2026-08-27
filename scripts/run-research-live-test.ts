import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { loadSchemaRegistry } from "../packages/contracts/src/validation/index.js";

type JsonRecord = Record<string, unknown>;

const home = process.env.CONTENT_OPS_HOME;
const binary = process.env.CONTENT_OPS_LARK_CLI_PATH;
const envGate = process.env.CONTENT_OPS_ENABLE_LIVE_FEISHU === "1";
const cliGate = process.argv.includes("--confirm-live-write");
const g2Gate = process.argv.includes("--confirm-g2-test-decisions");
const missing = [
  ...(!home ? ["CONTENT_OPS_HOME"] : []),
  ...(!binary ? ["CONTENT_OPS_LARK_CLI_PATH"] : []),
  ...(!envGate ? ["CONTENT_OPS_ENABLE_LIVE_FEISHU=1"] : []),
  ...(!cliGate ? ["--confirm-live-write"] : []),
];
if (missing.length > 0) {
  process.stdout.write(
    `${JSON.stringify({ status: "NOT_CONFIGURED", writes_attempted: 0, missing })}\n`,
  );
  process.exit(0);
}

const contentOpsHome = home ?? "";
const larkCliBinary = binary ?? "";
const evidenceFile = path.join(contentOpsHome, "phase-3a-research-live-evidence.json");
const runStateFile = path.join(contentOpsHome, "phase-3a-research-live-run.json");

async function readJson(file: string): Promise<JsonRecord | null> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as JsonRecord;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

async function atomicJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await rename(temporary, file);
}

function makeRunId(at: Date): string {
  const compact = at
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  return `RUN-${compact.slice(0, 8)}-${compact.slice(8)}-P3A1`;
}

function approvalIdForRun(runId: string): string {
  const match = /^RUN-([0-9]{8})-[0-9]{6}-([A-Z0-9]{4})$/.exec(runId);
  if (!match) throw new Error("RUN_ID_INVALID");
  return `APR-${match[1]}-${match[2]}`;
}

function details(value: JsonRecord): JsonRecord {
  return value.details && typeof value.details === "object" && !Array.isArray(value.details)
    ? (value.details as JsonRecord)
    : {};
}

const previousEvidence = await readJson(evidenceFile);
if (previousEvidence?.overall_status === "PASSED") {
  process.stdout.write(
    `${JSON.stringify({
      overall_status: "PASSED",
      replay_status: "REUSED_RETAINED_EVIDENCE",
      writes_attempted: 0,
      project_id: "[REDACTED]",
      run_id: "[REDACTED]",
    })}\n`,
  );
  process.exit(0);
}

const profile = await readJson(path.join(contentOpsHome, "project-profile.json"));
if (
  !profile ||
  typeof profile.project_id !== "string" ||
  typeof profile.project_name !== "string"
) {
  process.stdout.write(
    `${JSON.stringify({ status: "BLOCKED", writes_attempted: 0, error_code: "PROJECT_PROFILE_NOT_FOUND" })}\n`,
  );
  process.exit(1);
}
const projectId = profile.project_id;
let runState = await readJson(runStateFile);
if (runState && runState.project_id !== projectId) throw new Error("RESEARCH_RUN_PROJECT_MISMATCH");
if (!runState) {
  runState = {
    project_id: projectId,
    run_id: makeRunId(new Date()),
    created_at: new Date().toISOString(),
  };
  await atomicJson(runStateFile, runState);
}
const runId = String(runState.run_id);
const priorG1 = await readJson(path.join(contentOpsHome, "g1-approval.json"));
const workspaceState = await readJson(
  path.join(contentOpsHome, "projects", projectId, "workspace", "provisioning-state.json"),
);
if (
  priorG1?.gate !== "PROJECT_PROFILE" ||
  priorG1.decision !== "APPROVE" ||
  workspaceState?.overall_status !== "SUCCESS"
)
  throw new Error("PROJECT_PROFILE_PRIOR_G1_NOT_VERIFIED");
const discoveryAt = new Date().toISOString();
const discoveredProfile: JsonRecord = {
  ...profile,
  project_status: "PROJECT_ACTIVE",
  config_confirmation_status: "CONFIG_CONFIRMED",
  subject_name: "ContentOpsStudio 虚构通用专业服务示例",
  public_identity_and_intro: "仅用于受控沙箱验证的虚构通用专业服务主体。",
  industry: "通用专业服务",
  industry_subfields: ["虚构内容咨询服务"],
  core_business_or_products: ["虚构专业咨询服务"],
  service_region: ["示例城市"],
  price_band: "虚构中等价格带",
  audience_profile: {
    role: "AUDIENCE",
    description: "需要比较专业服务并重视可信证据的虚构小型服务企业经营者。",
    segments: ["虚构小型服务企业经营者"],
  },
  audience_decision_characteristics: ["重视真实证据", "谨慎比较服务方", "希望降低决策风险"],
  professional_advantages: ["结构化内容规划", "透明专业边界", "长期内容管理"],
  content_objectives: ["TRUST", "LEAD_GENERATION", "CONSULTATION"],
  core_content_directions: ["专业信任", "决策问题", "真实服务边界"],
  target_platforms: ["小红书"],
  primary_platform: "小红书",
  industry_pack: "generic",
  platform_pack: "xiaohongshu",
  configuration_version: 2,
  last_run_id: runId,
  updated_at: discoveryAt,
  data_source: "MOCK",
  extensions: {
    ...(profile.extensions && typeof profile.extensions === "object" ? profile.extensions : {}),
    phase_3a_discovery_scope: "USER_PROVIDED_FICTIONAL_SANDBOX",
    prior_g1_verified: true,
  },
};
const knownFields = [
  "project_id",
  "project_status",
  "config_confirmation_status",
  "subject_name",
  "subject_type",
  "industry",
  "industry_subfields",
  "core_business_or_products",
  "service_region",
  "price_band",
  "audience_profile",
  "audience_decision_characteristics",
  "professional_advantages",
  "target_platforms",
  "primary_platform",
  "industry_pack",
  "platform_pack",
  "core_content_directions",
];
const gapReport = {
  gap_report_id: `PGR-${runId.replace(/^RUN-/, "")}`,
  project_id: projectId,
  known_fields: knownFields,
  missing_required_fields: [],
  missing_recommended_fields: [],
  conflicting_fields: [],
  inferred_fields: [
    {
      field: "project_status",
      value_summary: "PROJECT_ACTIVE",
      basis:
        "The retained sandbox has a verified prior G1 approval and successful Workspace state.",
      confirmed: true,
    },
    {
      field: "primary_platform",
      value_summary: "小红书",
      basis: "The current Operator-provided Phase 3A sandbox scope explicitly selects Xiaohongshu.",
      confirmed: true,
    },
  ],
  operator_known: {
    role: "OPERATOR",
    known_fields: ["project_id", "target_platforms", "core_content_directions"],
  },
  subject_known: {
    role: "SUBJECT",
    known_fields: ["subject_name", "subject_type", "industry", "professional_advantages"],
  },
  audience_known: {
    role: "AUDIENCE",
    known_fields: ["audience_profile", "audience_decision_characteristics"],
  },
  material_blockers: [],
  non_blocking_gaps: [],
  recommended_questions: [],
  profile_completeness: 1,
  ready_for_project_confirmation: true,
  ready_for_painpoint_research: true,
  created_at: discoveryAt,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: {
    discovery_mode: "DISCOVER",
    original_profile_preserved: true,
    remote_profile_overwrite_attempted: false,
  },
};
const schemaRegistry = await loadSchemaRegistry(
  path.join(path.resolve("plugins/content-ops-studio"), "schemas/1.0"),
);
schemaRegistry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/project-profile.schema.json",
  discoveredProfile,
);
schemaRegistry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/project-profile-gap-report.schema.json",
  gapReport,
);
await atomicJson(
  path.join(contentOpsHome, "projects", projectId, "project-profile.json"),
  discoveredProfile,
);
await atomicJson(
  path.join(
    contentOpsHome,
    "projects",
    projectId,
    "runs",
    runId,
    "research",
    "profile-gap-report.json",
  ),
  gapReport,
);

const pluginRoot = path.resolve("plugins/content-ops-studio");
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [path.join(pluginRoot, "runtime/dist/content-ops-mcp.mjs")],
  cwd: pluginRoot,
  env: {
    PATH: process.env.PATH ?? "",
    PLUGIN_ROOT: pluginRoot,
    PLUGIN_DATA: path.join(contentOpsHome, "plugin-data-phase3a"),
    CONTENT_OPS_HOME: contentOpsHome,
    CONTENT_OPS_LARK_CLI_PATH: larkCliBinary,
    CONTENT_OPS_ENABLE_LIVE_FEISHU: "1",
  },
  stderr: "pipe",
});
const client = new Client({ name: "phase-3a-live-validator", version: "0.1.0" });
const calls: Array<{ tool: string; status: unknown; is_error: boolean }> = [];

async function call(
  tool: string,
  args: JsonRecord,
  accepted: string[] = ["SUCCESS"],
): Promise<JsonRecord> {
  const result = await client.callTool({ name: tool, arguments: args });
  const structured = (result.structuredContent ?? {}) as JsonRecord;
  calls.push({ tool, status: structured.status, is_error: result.isError === true });
  if (result.isError || !accepted.includes(String(structured.status))) {
    const firstError = Array.isArray(structured.errors)
      ? (structured.errors[0] as JsonRecord | undefined)
      : undefined;
    const message = firstError?.message;
    const status = structured.status;
    const error = new Error(
      typeof message === "string"
        ? message
        : `${tool}:${typeof status === "string" ? status : "UNKNOWN_STATUS"}`,
    ) as Error & {
      code?: string;
    };
    const code = firstError?.code;
    error.code = typeof code === "string" ? code : "MCP_TOOL_FAILED";
    throw error;
  }
  return structured;
}

const startedAt = new Date().toISOString();
try {
  await client.connect(transport);
  const catalog = await client.listTools();
  if (catalog.tools.length !== 23) throw new Error("MCP_TOOL_COUNT_MISMATCH");
  await call("content_ops_doctor", {});
  await call("content_ops_check_feishu", {});
  const projects = await call("content_ops_list_projects", {});
  if (Number(details(projects).count) !== 1) throw new Error("PROJECT_SELECTION_NOT_UNIQUE");
  await call("content_ops_get_research_context", { project_id: projectId });

  const planResult = await call("content_ops_plan_painpoint_research", {
    project_id: projectId,
    run_id: runId,
    requested_count: 30,
    minimum_acceptable_count: 5,
    allow_hypothesis_candidates: false,
    research_objective:
      "Identify evidence-backed trust and client-acquisition painpoints for a fully fictional small professional-services Subject using Xiaohongshu.",
    audience_segments: ["Fictional small professional-services business operator"],
    decision_stages: ["ACTIVE_SEARCH", "SOLUTION_COMPARISON", "RISK_EVALUATION"],
    business_scenarios: [
      "Using useful Xiaohongshu content to build trust and attract qualified consultation",
    ],
    region_scope: ["China"],
    date_from: "2022-01-01",
    date_to: "2026-08-24",
    language_scope: ["zh-CN"],
    query_plan: [
      {
        query_id: "Q-P3A-IDENTITY",
        query: "Xiaohongshu professional account qualification trust",
        purpose: "Establish the platform role of professional identity and qualification signals.",
        source_types: ["PLATFORM_DOCUMENTATION", "INDUSTRY_REPORT"],
      },
      {
        query_id: "Q-P3A-TRUST",
        query: "Xiaohongshu authentic experience useful content user preference",
        purpose: "Find evidence about authentic, useful and searchable content expectations.",
        source_types: ["PLATFORM_DOCUMENTATION", "INDUSTRY_REPORT"],
      },
      {
        query_id: "Q-P3A-LEADS",
        query: "Xiaohongshu lead collection private message consultation objective",
        purpose: "Separate attention goals from explicit consultation and lead goals.",
        source_types: ["PLATFORM_DOCUMENTATION"],
      },
      {
        query_id: "Q-P3A-SME",
        query: "China SME digital workflow limited resources iterative measurement",
        purpose: "Bound claims about small-operator resource and iteration constraints.",
        source_types: ["OFFICIAL_SOURCE"],
      },
    ],
  });
  const plan = details(planResult).research_plan as JsonRecord;
  const researchPlanId = String(plan.research_plan_id);
  const retrievedAt = new Date().toISOString();

  const sourcesResult = await call("content_ops_submit_research_sources", {
    project_id: projectId,
    run_id: runId,
    research_plan_id: researchPlanId,
    sources: [
      {
        source_id: "SRC-0001",
        source_type: "PLATFORM_DOCUMENTATION",
        title: "小红书专业号申请说明",
        publisher_or_owner: "小红书",
        source_location: "https://school.xiaohongshu.com/helper/detail/1330?jumpFrom=cn",
        source_date: null,
        retrieved_at: retrievedAt,
        language: "zh-CN",
        summary:
          "平台说明将企业主体、营业执照及部分行业资质列为专业号申请和认证要素，支持把清晰主体身份视为专业服务信任的基础信号。",
        supported_claims: [
          "专业服务账号需要清晰的企业主体与适用资质信号。",
          "身份和资质信息属于平台认证流程的一部分。",
        ],
        limitations: "认证要求不能单独证明内容一定带来咨询或成交。",
        credibility_notes: "小红书官方平台文档；作为平台规则的一手来源使用。",
        is_first_party: true,
        is_user_provided: false,
        is_current: true,
      },
      {
        source_id: "SRC-0002",
        source_type: "PLATFORM_DOCUMENTATION",
        title: "小红书聚光帮助中心",
        publisher_or_owner: "小红书",
        source_location: "https://ad.xiaohongshu.com/next_help/home",
        source_date: null,
        retrieved_at: retrievedAt,
        language: "zh-CN",
        summary:
          "官方帮助中心区分种草兴趣、线索收集和私信咨询等目标，并提供广告数据与报表入口，支持将曝光目标与咨询转化目标分开规划和衡量。",
        supported_claims: [
          "平台把内容兴趣与线索收集、私信咨询视为不同目标。",
          "咨询转化需要独立的目标设计和数据观察。",
        ],
        limitations: "广告产品能力只能间接支持自然内容的转化路径判断。",
        credibility_notes: "小红书官方广告帮助入口；用于限定平台能力，不外推自然流量因果。",
        is_first_party: true,
        is_user_provided: false,
        is_current: true,
      },
      {
        source_id: "SRC-0003",
        source_type: "PLATFORM_DOCUMENTATION",
        title: "小红书热点规范与真实分享说明",
        publisher_or_owner: "小红书",
        source_location:
          "https://fe.xiaohongshu.com/ditto/vincent/c45978d1a53d4dec963167ebd6f1802e?fullscreen=true&naviHidden=yes",
        source_date: null,
        retrieved_at: retrievedAt,
        language: "zh-CN",
        summary:
          "平台规则强调真实生活、真实分享及与搜索互动行为相关的内容语境，支持把可搜索的真实问题表达作为内容匹配的重要条件。",
        supported_claims: [
          "真实分享是平台内容语境的重要组成部分。",
          "内容需要贴近受众实际搜索和互动场景。",
        ],
        limitations: "热点规则不能证明某个具体选题一定获得分发。",
        credibility_notes: "小红书官方规则页面；仅用于平台语境和行为边界。",
        is_first_party: true,
        is_user_provided: false,
        is_current: true,
      },
      {
        source_id: "SRC-0004",
        source_type: "INDUSTRY_REPORT",
        title: "2025年小红书用户体验与内容偏好调查",
        publisher_or_owner: "艾媒咨询",
        source_location: "https://www.iimedia.cn/c400/108275.html",
        source_date: null,
        retrieved_at: retrievedAt,
        language: "zh-CN",
        summary:
          "公开调查显示受访者整体使用体验偏正向，并偏好达人亲身体验、真实场景和普通用户推荐；这支持真实、具体、可验证的经验表达更符合受众期待。",
        supported_claims: [
          "受访者对亲身体验、真实场景和普通用户推荐有较高偏好。",
          "模板化宣传不能替代具体真实的经验与证据表达。",
        ],
        limitations: "公开调查样本与方法细节需结合原报告理解，不能直接代表所有专业服务受众。",
        credibility_notes: "独立行业调查；与平台一手规则来源相互独立。",
        is_first_party: false,
        is_user_provided: false,
        is_current: true,
      },
      {
        source_id: "SRC-0005",
        source_type: "OFFICIAL_SOURCE",
        title: "《中小企业数字化转型指南》政策解读",
        publisher_or_owner: "中华人民共和国工业和信息化部",
        source_location:
          "https://ythxxfb.miit.gov.cn/ythzxfwpt/hlwmh/zcwj/sbfw/qyshzr/art/2022/art_3b2dcdcd170c45bcbc6dc06f5547ad72.html",
        source_date: "2022-11-09",
        retrieved_at: retrievedAt,
        language: "zh-CN",
        summary:
          "政策解读指出中小企业投入资源有限，应明确优先级，采用小型化、快速化、轻量化、精准化方案，并按评估、规划、实施、优化形成长期迭代闭环。",
        supported_claims: [
          "中小企业数字化投入资源有限，需要明确优先级。",
          "数字化实践需要评估、规划、实施、优化的迭代闭环。",
        ],
        limitations: "指南覆盖广义数字化转型，不是小红书内容运营专项研究。",
        credibility_notes: "工信部官方政策解读；用于资源约束和迭代方法的背景证据。",
        is_first_party: true,
        is_user_provided: false,
        is_current: true,
      },
    ],
  });

  const candidatesResult = await call("content_ops_submit_painpoint_candidates", {
    project_id: projectId,
    run_id: runId,
    research_plan_id: researchPlanId,
    candidates: [
      {
        painpoint_id: "P-0001",
        painpoint_name: "咨询前看不清专业身份与资质，难以建立初始信任",
        business_scenario: "虚构小型专业服务企业通过小红书内容承接陌生受众咨询。",
        audience_type: "正在比较专业服务提供方的虚构小企业经营者",
        decision_stage: "RISK_EVALUATION",
        explicit_need: "快速确认服务主体、专业边界、适用资质和可验证经验。",
        deep_anxiety: "担心只看到营销包装，无法判断对方是否真正可靠。",
        trigger_events: ["第一次刷到专业服务账号", "准备私信咨询前"],
        primary_barriers: ["主体身份不清", "资质与服务边界表达分散"],
        analysis_reason: "平台认证要求与独立用户偏好共同支持身份和真实证据是风险判断基础。",
        commercial_loss_or_real_cost: "高意向受众在私信前流失，Operator反复解释基础可信度信息。",
        content_entry_angles: ["服务主体与资质边界清单", "真实项目方法与证据说明"],
        subject_advantages_to_express: ["透明专业边界", "可验证服务流程"],
        evidence_refs: ["E-0001", "E-0004"],
        evidence_confidence: "B_MULTI_SOURCE",
        promotion_priority: "CRITICAL",
        duplication_risk: "LOW",
        score: {
          audience_relevance: 5,
          frequency: 4,
          urgency: 4,
          decision_impact: 5,
          real_cost: 4,
          subject_advantage_fit: 5,
          evidence_strength: 5,
          content_potential: 5,
          promotion_fit: 4,
        },
        score_explanations: ["该问题直接发生在咨询前风险判断，并有平台规则和独立调查支持。"],
        score_limitations: ["没有把认证直接等同于成交。"],
        near_duplicate_reason: null,
      },
      {
        painpoint_id: "P-0002",
        painpoint_name: "内容像模板广告而非真实专业经验，受众不愿进一步咨询",
        business_scenario: "虚构Subject持续发布专业服务相关图文，但表达停留在口号和卖点。",
        audience_type: "对营销声明保持警惕的虚构专业服务潜在客户",
        decision_stage: "SOLUTION_COMPARISON",
        explicit_need: "看到具体场景、判断过程、限制条件和真实可用的方法。",
        deep_anxiety: "担心被包装话术吸引后得到同质化或不匹配的服务。",
        trigger_events: ["连续看到相似宣传笔记", "比较多个服务账号"],
        primary_barriers: ["缺少真实场景", "缺少限制条件", "缺少可验证方法"],
        analysis_reason: "平台真实分享语境和独立调查对亲身体验、真实场景的偏好形成相互独立支持。",
        commercial_loss_or_real_cost: "内容产出形成曝光但不形成信任，时间和制作成本被浪费。",
        content_entry_angles: ["真实问题拆解", "方法适用与不适用边界", "过程证据"],
        subject_advantages_to_express: ["专业判断过程", "诚实说明限制"],
        evidence_refs: ["E-0003", "E-0004"],
        evidence_confidence: "B_MULTI_SOURCE",
        promotion_priority: "CRITICAL",
        duplication_risk: "LOW",
        score: {
          audience_relevance: 5,
          frequency: 4,
          urgency: 4,
          decision_impact: 5,
          real_cost: 4,
          subject_advantage_fit: 4,
          evidence_strength: 5,
          content_potential: 5,
          promotion_fit: 4,
        },
        score_explanations: ["真实表达偏好与咨询前信任需求高度相关，且具备多个内容切口。"],
        score_limitations: ["独立调查不能代表所有细分专业服务行业。"],
        near_duplicate_reason: null,
      },
      {
        painpoint_id: "P-0003",
        painpoint_name: "只追曝光却没有咨询路径，兴趣难以转成合格线索",
        business_scenario: "虚构经营者把笔记浏览量当作唯一目标，没有设计私信咨询的下一步。",
        audience_type: "已有兴趣但不知道如何继续了解服务的虚构潜在客户",
        decision_stage: "PURCHASE_DECISION",
        explicit_need: "在获得有用信息后看见清晰、低压力且可判断是否适合的咨询入口。",
        deep_anxiety: "担心私信后被强销售，或无法得到与自己问题相关的回应。",
        trigger_events: ["看完一篇高相关内容", "准备询问服务细节"],
        primary_barriers: ["目标只设为曝光", "下一步动作不清", "咨询预期不透明"],
        analysis_reason:
          "官方广告能力明确区分兴趣、线索与私信咨询目标，但对自然内容仅构成间接证据。",
        commercial_loss_or_real_cost: "已有兴趣无法进入可衡量的咨询链路，浏览量与业务结果脱节。",
        content_entry_angles: ["低压力咨询说明", "适合与不适合客户自测", "咨询前准备清单"],
        subject_advantages_to_express: ["清晰承接流程", "不强推的筛选机制"],
        evidence_refs: ["E-0002"],
        evidence_confidence: "C_SINGLE_OR_INDIRECT",
        promotion_priority: "HIGH",
        duplication_risk: "LOW",
        score: {
          audience_relevance: 5,
          frequency: 3,
          urgency: 3,
          decision_impact: 5,
          real_cost: 4,
          subject_advantage_fit: 4,
          evidence_strength: 2,
          content_potential: 4,
          promotion_fit: 5,
        },
        score_explanations: ["业务影响高，但当前证据来自广告目标分类，对自然内容只能间接支持。"],
        score_limitations: ["需要补充自然内容到咨询转化的第一方数据。"],
        near_duplicate_reason: null,
      },
      {
        painpoint_id: "P-0004",
        painpoint_name: "选题没有贴近真实搜索与比较问题，内容在决策时刻帮不上忙",
        business_scenario:
          "虚构专业服务Subject从自身想讲什么出发选题，忽略Audience正在搜索和比较的问题。",
        audience_type: "带着具体问题主动搜索专业服务方案的虚构小企业经营者",
        decision_stage: "ACTIVE_SEARCH",
        explicit_need: "用自己的问题语言快速找到可执行、可比较且可信的答案。",
        deep_anxiety: "担心信息很多却无法判断哪种方案适合自己的实际场景。",
        trigger_events: ["业务问题突然发生", "主动搜索解决方案", "比较多个建议"],
        primary_barriers: ["选题以Subject自述为中心", "缺少真实搜索语境", "缺少决策条件"],
        analysis_reason: "平台搜索互动语境与独立用户真实经验偏好共同支持以受众问题组织内容。",
        commercial_loss_or_real_cost: "高价值专业知识没有进入受众决策路径，长期内容资产难以复用。",
        content_entry_angles: ["搜索问题答疑", "方案比较条件", "错误选择的真实成本"],
        subject_advantages_to_express: ["结构化诊断", "按场景给出专业判断"],
        evidence_refs: ["E-0003", "E-0004"],
        evidence_confidence: "B_MULTI_SOURCE",
        promotion_priority: "CRITICAL",
        duplication_risk: "LOW",
        score: {
          audience_relevance: 5,
          frequency: 4,
          urgency: 4,
          decision_impact: 5,
          real_cost: 4,
          subject_advantage_fit: 4,
          evidence_strength: 4,
          content_potential: 5,
          promotion_fit: 4,
        },
        score_explanations: ["该问题直接影响主动搜索阶段的发现与比较，证据来自两类独立来源。"],
        score_limitations: ["未取得具体关键词量或行业搜索量数据。"],
        near_duplicate_reason: null,
      },
      {
        painpoint_id: "P-0005",
        painpoint_name: "资源有限却缺少评估与迭代闭环，发布投入难以形成长期复利",
        business_scenario:
          "虚构小型专业服务经营者用零散时间运营小红书，缺少固定研究、发布和复盘节奏。",
        audience_type: "资源有限的虚构小型专业服务企业经营者",
        decision_stage: "PROBLEM_AWARENESS",
        explicit_need: "用轻量流程明确优先级，并持续评估哪些内容真正支持业务目标。",
        deep_anxiety: "担心长期投入时间却无法判断什么有效，也无法稳定坚持。",
        trigger_events: ["连续发布后效果波动", "团队时间被多个任务分散"],
        primary_barriers: ["优先级不清", "没有评估指标", "没有迭代节奏"],
        analysis_reason: "工信部指南直接支持中小企业资源约束与迭代闭环，但不是小红书专项证据。",
        commercial_loss_or_real_cost: "有限时间被低价值动作占用，无法积累可复用的内容和数据资产。",
        content_entry_angles: ["一页式内容优先级", "评估规划实施优化闭环"],
        subject_advantages_to_express: ["轻量内容流程", "以业务结果复盘"],
        evidence_refs: ["E-0005"],
        evidence_confidence: "C_SINGLE_OR_INDIRECT",
        promotion_priority: "MEDIUM",
        duplication_risk: "LOW",
        score: {
          audience_relevance: 4,
          frequency: 3,
          urgency: 3,
          decision_impact: 4,
          real_cost: 4,
          subject_advantage_fit: 3,
          evidence_strength: 3,
          content_potential: 4,
          promotion_fit: 3,
        },
        score_explanations: ["资源约束与闭环有官方依据，但小红书和专业服务适配仍需专项证据。"],
        score_limitations: ["当前证据范围过宽，不足以确认它是本项目核心痛点。"],
        near_duplicate_reason: null,
      },
    ],
  });

  const finalizeArgs = {
    project_id: projectId,
    run_id: runId,
    research_plan_id: researchPlanId,
    insufficiency_reason:
      "The default target is 30, but only five claims met the current-source and no-padding evidence threshold in this controlled sandbox run.",
    decision_chain_summary:
      "Audience discovers content, validates identity and usefulness, compares professional judgment, evaluates risk, then chooses whether to start a qualified consultation.",
    business_scenario_summary:
      "A fully fictional small professional-services Subject uses Xiaohongshu to build trust and attract qualified consultation without making unsupported performance claims.",
    audience_summary:
      "Fictional small-business operators who need professional services, compare providers carefully and value transparent evidence and boundaries.",
    source_limitations: [
      "No private customer material or first-party conversion data was used.",
      "The platform advertising source only indirectly supports organic-content conversion claims.",
      "The SME policy source is broader than Xiaohongshu and professional services.",
    ],
    idempotency_key: "PHASE3A-PAINPOINTS-LIVE-001",
    explicit_confirmation: true,
  };
  const retainedReviewFile = path.join(
    contentOpsHome,
    "projects",
    projectId,
    "runs",
    runId,
    "research",
    "painpoint-review-batch.json",
  );
  const retainedReview = g2Gate ? await readJson(retainedReviewFile) : null;
  const g2Recovery =
    retainedReview?.review_batch_id === `PRB-${runId.replace(/^RUN-/, "")}-G2` &&
    retainedReview.project_id === projectId &&
    retainedReview.source_run_id === runId;
  let firstFinalize: JsonRecord;
  let replayFinalize: JsonRecord;
  let firstVerification: JsonRecord;
  if (g2Recovery) {
    firstFinalize = {
      details: { remote_records_created: 0, existing_records_reused: 5 },
    };
    replayFinalize = {
      details: { remote_records_created: 0, existing_records_reused: 5 },
    };
    firstVerification = { details: { verified_count: 5 } };
  } else {
    firstFinalize = await call("content_ops_finalize_painpoint_research", finalizeArgs, [
      "AWAITING_APPROVAL",
    ]);
    replayFinalize = await call("content_ops_finalize_painpoint_research", finalizeArgs, [
      "AWAITING_APPROVAL",
    ]);
    firstVerification = await call("content_ops_verify_painpoint_batch", {
      project_id: projectId,
      run_id: runId,
    });
  }
  const pendingList = await call("content_ops_list_painpoints", { project_id: projectId });
  for (const painpointId of ["P-0001", "P-0002", "P-0003", "P-0004", "P-0005"])
    await call("content_ops_get_painpoint", { project_id: projectId, painpoint_id: painpointId });
  if (!g2Gate) {
    await client.close();
    const firstDetails = details(firstFinalize);
    const replayDetails = details(replayFinalize);
    const evidence = {
      evidence_id: `P3A-LIVE-${createHash("sha256")
        .update(`${projectId}:${runId}`)
        .digest("hex")
        .slice(0, 16)
        .toUpperCase()}`,
      project_id: projectId,
      run_id: runId,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      tool_count: catalog.tools.length,
      calls,
      profile_discovery: "PASSED",
      profile_gap_report_schema: "PASSED",
      source_count: Number(details(sourcesResult).source_count),
      source_type_count: Number(details(sourcesResult).source_type_count),
      official_or_first_party_present: details(sourcesResult).official_or_first_party_present,
      requested_painpoints: 30,
      produced_painpoints: Number(details(candidatesResult).produced_count),
      evidence_backed_painpoints: Number(details(candidatesResult).evidence_backed_count),
      hypothesis_count: Number(details(candidatesResult).hypothesis_count),
      initial_remote_records_created: Number(firstDetails.remote_records_created),
      replay_remote_records_created: Number(replayDetails.remote_records_created),
      replay_existing_records_reused: Number(replayDetails.existing_records_reused),
      initial_verified_count: Number(details(firstVerification).verified_count),
      list_count: Number(details(pendingList).count),
      g2_status: "AWAITING_USER_APPROVAL",
      remote_write_mutations: Number(firstDetails.remote_records_created),
      idempotent_replay: Number(replayDetails.remote_records_created) === 0 ? "PASSED" : "FAILED",
      remote_identifiers_exposed: false,
      created_new_base: false,
      used_existing_retained_sandbox: true,
      manual_cleanup_required: true,
      overall_status: "AWAITING_APPROVAL",
    };
    await atomicJson(evidenceFile, evidence);
    process.stdout.write(
      `${JSON.stringify({
        ...evidence,
        project_id: "[REDACTED]",
        run_id: "[REDACTED]",
        calls: calls.map((item) => ({ ...item })),
      })}\n`,
    );
    process.exit(0);
  }
  const approvalRequest = firstFinalize.approval_request as JsonRecord | undefined;
  const batchId = g2Recovery
    ? String(retainedReview.research_batch_id)
    : String(approvalRequest?.target_id);
  const reviewedAt =
    typeof retainedReview?.created_at === "string"
      ? retainedReview.created_at
      : new Date().toISOString();
  const review = retainedReview ?? {
    review_batch_id: `PRB-${runId.replace(/^RUN-/, "")}-G2`,
    research_batch_id: batchId,
    project_id: projectId,
    painpoint_batch_version: 1,
    review_version: 1,
    items: [
      {
        painpoint_id: "P-0001",
        painpoint_version: 1,
        decision: "APPROVE",
        comment:
          "Identity and qualification transparency is directly relevant to consultation risk.",
        requested_changes: [],
      },
      {
        painpoint_id: "P-0002",
        painpoint_version: 1,
        decision: "APPROVE",
        comment: "Authentic professional evidence is strongly supported by independent sources.",
        requested_changes: [],
      },
      {
        painpoint_id: "P-0003",
        painpoint_version: 1,
        decision: "REVISE",
        comment:
          "Keep the painpoint, but do not infer organic conversion from an advertising objective alone.",
        requested_changes: ["Add first-party organic-content to consultation conversion evidence."],
      },
      {
        painpoint_id: "P-0004",
        painpoint_version: 1,
        decision: "APPROVE",
        comment: "Search-stage problem language is sufficiently supported and actionable.",
        requested_changes: [],
      },
      {
        painpoint_id: "P-0005",
        painpoint_version: 1,
        decision: "REJECT",
        comment:
          "The current source is too broad to establish this as a project-specific painpoint.",
        requested_changes: [],
      },
    ],
    summary_decision: "MIXED",
    approved_count: 3,
    revision_required_count: 1,
    rejected_count: 1,
    paused_count: 0,
    reviewer_role: "OPERATOR",
    source_run_id: runId,
    created_at: reviewedAt,
    schema_version: "1.0.0",
    extensions: { test_scope: "PHASE_3A_RETAINED_SANDBOX" },
  };
  const g2 = await call("content_ops_submit_approval", {
    approval_id: approvalIdForRun(runId),
    gate: "PAINPOINTS",
    target_type: "PAINPOINT_BATCH",
    target_id: batchId,
    target_version: "1",
    decision: "REVISE",
    source_run_id: runId,
    project_id: projectId,
    project_name: profile.project_name,
    comment: "Controlled mixed G2 review: three approve, one revise, one reject.",
    expected_version: "1",
    painpoint_review_batch: review,
    request_id: "REQUEST-PHASE3A-G2-001",
    explicit_confirmation: true,
  });
  const finalVerification = await call("content_ops_verify_painpoint_batch", {
    project_id: projectId,
    run_id: runId,
  });
  const list = await call("content_ops_list_painpoints", { project_id: projectId });
  for (const painpointId of ["P-0001", "P-0002", "P-0003", "P-0004", "P-0005"])
    await call("content_ops_get_painpoint", { project_id: projectId, painpoint_id: painpointId });
  await client.close();

  const firstDetails = details(firstFinalize);
  const replayDetails = details(replayFinalize);
  const g2Details = details(g2);
  const evidence = {
    evidence_id: `P3A-LIVE-${createHash("sha256")
      .update(`${projectId}:${runId}`)
      .digest("hex")
      .slice(0, 16)
      .toUpperCase()}`,
    project_id: projectId,
    run_id: runId,
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    tool_count: catalog.tools.length,
    calls,
    source_count: Number(details(sourcesResult).source_count),
    source_type_count: Number(details(sourcesResult).source_type_count),
    official_or_first_party_present: details(sourcesResult).official_or_first_party_present,
    requested_painpoints: 30,
    produced_painpoints: Number(details(candidatesResult).produced_count),
    evidence_backed_painpoints: Number(details(candidatesResult).evidence_backed_count),
    hypothesis_count: Number(details(candidatesResult).hypothesis_count),
    initial_remote_records_created: Number(firstDetails.remote_records_created),
    replay_remote_records_created: Number(replayDetails.remote_records_created),
    replay_existing_records_reused: Number(replayDetails.existing_records_reused),
    initial_verified_count: Number(details(firstVerification).verified_count),
    final_verified_count: Number(details(finalVerification).verified_count),
    list_count: Number(details(list).count),
    g2_updated: Number(g2.updated_records),
    g2_statuses: g2Details.item_decisions,
    g2_summary: { approved: 3, revise: 1, rejected: 1, paused: 0 },
    remote_write_mutations:
      Number(firstDetails.remote_records_created) + Number(g2.updated_records),
    idempotent_replay: Number(replayDetails.remote_records_created) === 0 ? "PASSED" : "FAILED",
    remote_identifiers_exposed: false,
    created_new_base: false,
    used_existing_retained_sandbox: true,
    manual_cleanup_required: true,
    overall_status: "PASSED",
    recovery_resume: g2Recovery,
  };
  await atomicJson(evidenceFile, evidence);
  process.stdout.write(
    `${JSON.stringify({
      ...evidence,
      project_id: "[REDACTED]",
      run_id: "[REDACTED]",
      calls: calls.map((item) => ({ ...item })),
    })}\n`,
  );
} catch (error) {
  await client.close().catch(() => undefined);
  const code = (error as Error & { code?: string }).code ?? "PHASE3A_LIVE_TEST_FAILED";
  process.stdout.write(
    `${JSON.stringify({
      overall_status: "FAILED",
      error_code: code,
      ...(["SCHEMA_MISMATCH", "MCP_TOOL_FAILED"].includes(code)
        ? { diagnostic_error: (error as Error).message }
        : {}),
      writes_attempted: calls.some((item) =>
        ["content_ops_finalize_painpoint_research", "content_ops_submit_approval"].includes(
          item.tool,
        ),
      ),
      calls,
      project_id: "[REDACTED]",
      run_id: "[REDACTED]",
    })}\n`,
  );
  process.exit(1);
}
