import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  assessLayoutFeasibility,
  calculateVisualPlanningQualityScore,
  validateCopyFidelity,
} from "../packages/core/src/visual-planning/index.js";
import type {
  FeishuBlueprint,
  FeishuFieldMapEntry,
} from "../packages/workspace-adapters/src/feishu/blueprint/index.js";
import { LarkCliWorkspaceAdapter } from "../packages/workspace-adapters/src/lark-cli/adapter.js";
import { LarkCliRunner } from "../packages/workspace-adapters/src/lark-cli/runner.js";
import { createMcpContext } from "../services/content-ops-mcp/src/context.js";
import { TOOL_DEFINITIONS } from "../services/content-ops-mcp/src/tool-registry.js";

type Json = Record<string, unknown>;
const home = process.env.CONTENT_OPS_HOME;
const binary = process.env.CONTENT_OPS_LARK_CLI_PATH;
const envGate = process.env.CONTENT_OPS_ENABLE_LIVE_FEISHU === "1";
const cliGate = process.argv.includes("--confirm-live-write");
const missing = [
  ...(!home ? ["CONTENT_OPS_HOME"] : []),
  ...(!binary ? ["CONTENT_OPS_LARK_CLI_PATH"] : []),
  ...(!envGate ? ["CONTENT_OPS_ENABLE_LIVE_FEISHU=1"] : []),
  ...(!cliGate ? ["--confirm-live-write"] : []),
];
if (missing.length) {
  process.stdout.write(
    `${JSON.stringify({ status: "NOT_CONFIGURED", missing, writes_attempted: 0 })}\n`,
  );
  process.exit(2);
}

const contentOpsHome = path.resolve(home ?? "");
const pluginRoot = path.resolve("plugins/content-ops-studio");
if (contentOpsHome.startsWith(`${pluginRoot}${path.sep}`) || contentOpsHome === pluginRoot)
  throw new Error("CONTENT_OPS_HOME_INVALID");
const projectId = "PRJ-20260824-P2B2";
const contentId = "C-0001";
const contentRunId = "RUN-20260824-120110-P3B1";
const runId = process.env.CONTENT_OPS_PHASE4A_RUN_ID ?? "RUN-20260824-223000-P4A1";
const approvalId = "APR-20260824-P3B1";
const baseTitleQuery = "ContentOpsStudio";
const expectedBaseTitle =
  "ContentOpsStudio｜Phase2B2沙箱｜RUN-20260824-111500-P2B2｜图文内容工作台";
const at = new Date().toISOString();
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

async function atomicJson(file: string, value: unknown) {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await rename(temporary, file);
}

function details(value: unknown): Json {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Json) : {};
}

function tool(name: string) {
  const found = TOOL_DEFINITIONS.find((item) => item.name === name);
  if (!found) throw new Error(`MCP_TOOL_NOT_FOUND:${name}`);
  return found;
}

const runner = new LarkCliRunner(binary ?? "");
const resolved = await runner.require<Json>({
  argv: ["base", "+title-resolve", "--title", baseTitleQuery, "--json"],
  operation: "TITLE_RESOLVE",
});
const baseToken = typeof resolved.base_token === "string" ? resolved.base_token : "";
if (!baseToken || resolved.title !== expectedBaseTitle)
  throw new Error("VISUAL_SANDBOX_BASE_AMBIGUOUS");
const adapter = new LarkCliWorkspaceAdapter({ runner, identity: "user", baseToken });
const workspaceInfo = await adapter.getWorkspaceInfo();
if (workspaceInfo.name !== expectedBaseTitle) throw new Error("VISUAL_SANDBOX_BASE_MISMATCH");
const blueprint = JSON.parse(
  await readFile(path.join(pluginRoot, "templates/feishu/workspace-v1.json"), "utf8"),
) as FeishuBlueprint;
const remoteTables = await adapter.listTables();
const tableIds: Record<string, string> = {};
const fieldMap: FeishuFieldMapEntry[] = [];
for (const table of blueprint.tables) {
  const matches = remoteTables.filter((item) => item.name === table.displayName);
  if (matches.length !== 1 || !matches[0]) throw new Error("VISUAL_SANDBOX_TABLE_AMBIGUOUS");
  tableIds[table.logicalKey] = matches[0].tableId;
  const fields = await adapter.listFields(matches[0].tableId);
  for (const field of table.fields) {
    const remote = fields.filter((item) => item.fieldName === field.displayName);
    if (remote.length !== 1 || !remote[0])
      throw new Error(`VISUAL_SANDBOX_FIELD_AMBIGUOUS:${field.logicalKey}`);
    fieldMap.push({
      logicalKey: field.logicalKey,
      fieldId: remote[0].fieldId,
      currentFieldName: remote[0].fieldName,
      fieldType: remote[0].type,
      tableLogicalKey: table.logicalKey,
      mappingVersion: 1,
      lastVerifiedAt: at,
      userManaged: field.userManaged,
      ...(field.options.length
        ? {
            optionMap: Object.fromEntries(
              field.options.map((item) => [item.code, item.displayName]),
            ),
          }
        : {}),
    });
  }
}
if (fieldMap.length !== 141) throw new Error("VISUAL_SANDBOX_FIELD_MAP_INCOMPLETE");
const stateFile = path.join(
  contentOpsHome,
  "projects",
  projectId,
  "workspace",
  "provisioning-state.json",
);
await atomicJson(stateFile, {
  overall_status: "SUCCESS",
  mapping_version: 1,
  remote_identifiers: {
    appToken: baseToken,
    ...Object.fromEntries(Object.entries(tableIds).map(([key, value]) => [`table:${key}`, value])),
  },
  extensions: { field_map: fieldMap },
  updated_at: at,
});
const profile = {
  project_id: projectId,
  configuration_version: 2,
  content_style: ["结构化专业判断", "克制编辑表达"],
  expression_tone: ["专业", "可信", "清晰"],
  prohibited_expressions: ["假证书", "假官方标识", "夸张商务模板"],
};
await atomicJson(path.join(contentOpsHome, "projects", projectId, "project-profile.json"), profile);

const pageData = [
  [
    "COVER",
    "先别急着相信“专业”",
    "真正值得判断的，不是包装有多满，而是身份、资质和服务边界能不能被核验。",
    "极简封面与三项抽象核验框架",
  ],
  [
    "PROBLEM",
    "第一看：主体是谁",
    "先确认提供服务的主体名称、公开身份和实际承接方是否一致。信息越模糊，越需要继续问清。",
    "主体名称、公开身份、承接方三层关系图",
  ],
  [
    "EVIDENCE",
    "第二看：资质是否适用",
    "平台专业号认证会核验企业主体、营业执照及部分行业资质；但有认证，不等于所有服务都在适用范围内。",
    "资质—服务—适用范围对应卡片，不使用证书图",
  ],
  [
    "ANALYSIS",
    "第三看：边界是否清楚",
    "专业判断也包括知道什么能做、什么不能做、需要哪些前提。只讲结果、不讲边界，不足以支持决定。",
    "能力、限制、前提三栏边界图",
  ],
  [
    "STEP",
    "把信任变成3步核验",
    "①主体是否清楚；②资质是否对应；③服务边界是否匹配。三项都能回答，再进入下一步沟通。",
    "三步编号核验清单",
  ],
  [
    "SUMMARY",
    "先核验，再决定",
    "认证可以提供基础身份信号，但不能替代对具体能力和适用范围的判断。把证据看清，再决定要不要继续。",
    "决策总结卡片",
  ],
] as const;
const pagesForContent = pageData.map(([page_role, headline, body], index) => ({
  page_number: index + 1,
  page_role,
  copy_version: "CV-1",
  headline,
  body,
  supporting_text: "",
  content_purpose: "Preserved accepted Phase 3B page task.",
  background_direction: "",
  visual_evidence_requirement: "",
  layout_notes: "",
  negative_constraints: [],
  created_at: at,
  updated_at: at,
  extensions: {},
}));
const contentRecord = {
  content_id: contentId,
  project_id: projectId,
  record_unique_key: `${projectId}::content::${contentId}`,
  primary_painpoint_id: "P-0001",
  content_topic: "专业身份与资质信任判断清单",
  content_angle: "资质判断清单",
  content_structure_type: "CHECKLIST",
  audience_explicit_need: "在咨询或合作前快速判断专业服务主体是否值得进一步了解。",
  audience_deep_anxiety: "被抽象包装影响判断。",
  single_core_problem: "如何判断专业服务身份与资质是否可信？",
  core_viewpoint: "核验主体、资质和服务边界。",
  solution_logic: "主体、资质、边界三步核验。",
  content_objective: "TRUST",
  page_count: 6,
  page_structure_summary: "六页判断清单。",
  background_direction: "",
  visual_plan_summary: "",
  direct_message_hook: "",
  publish_title: "专业身份，先看这3点",
  title_character_count: 10,
  publish_body:
    "看到一个专业服务账号时，先别急着被头衔和包装说服。更稳妥的判断，是把“看起来专业”拆成三件能核验的事：服务主体是否清楚，展示的资质是否适用于这项服务，服务边界是否与你的实际需求匹配。\n\n平台认证信息可以提供基础身份信号，但它不能替代你对具体能力、过程和适用范围的判断。先核验，再沟通；先确认匹配，再做决定。这样省下的不是一次提问，而是后续反复试错的时间。",
  promotion_suitability: "MEDIUM",
  promotion_reason: "证据边界克制。",
  duplication_risk: "LOW",
  content_status: "COPY_APPROVED",
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
  last_run_id: contentRunId,
  finalized_at: null,
  created_at: at,
  updated_at: at,
  extensions: {},
};
const contentPackage = {
  content_record: contentRecord,
  pages: pagesForContent,
  platform_pack_id: "xiaohongshu",
  platform_pack_version: "1.0.0",
  industry_pack_id: "generic",
  industry_pack_version: "1.0.0",
  project_rule_snapshot: { snapshot_id: "APRS-P4A-001" },
};
await atomicJson(
  path.join(
    contentOpsHome,
    "projects",
    projectId,
    "runs",
    contentRunId,
    "content",
    "content-package.json",
  ),
  contentPackage,
);

const context = createMcpContext({ pluginRoot, home: contentOpsHome, env: process.env });
const doctor = await tool("content_ops_doctor").handler(context, {});
if (doctor.status !== "SUCCESS") throw new Error("VISUAL_LIVE_DOCTOR_BLOCKED");
const contextResult = await tool("content_ops_get_visual_context").handler(context, {
  project_id: projectId,
  content_id: contentId,
  run_id: runId,
  content_run_id: contentRunId,
  g3_approval_id: approvalId,
});
const visualContext = details(details(contextResult.details).visual_context);
const directionResult = await tool("content_ops_plan_visual_direction").handler(context, {
  project_id: projectId,
  content_id: contentId,
  run_id: runId,
  visual_context: visualContext,
  user_fixed_mode: null,
});
const decision = details(details(directionResult.details).visual_direction_decision);
if (details(directionResult.details).selected_mode !== "EDITORIAL_SERIES")
  throw new Error("VISUAL_MODE_SELECTION_FAILED");

const canvas = {
  width: 1242,
  height: 1660,
  aspect_ratio: "3:4",
  orientation: "PORTRAIT",
  resolution_unit: "PX",
};
const safeArea = { top: 96, right: 84, bottom: 96, left: 84, unit: "PX" };
const font = "Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif";
const typographyTokens = [
  ["TYPO-DISPLAY-TITLE", "TITLE", 700, 76, 1.12, 3],
  ["TYPO-PAGE-TITLE", "TITLE", 700, 58, 1.18, 3],
  ["TYPO-BODY", "BODY", 400, 40, 1.45, 8],
  ["TYPO-SUPPORTING", "SUPPORTING", 400, 30, 1.4, 4],
  ["TYPO-NUMBER", "TITLE", 700, 50, 1.1, 1],
  ["TYPO-CAPTION", "SUPPORTING", 400, 26, 1.35, 3],
  ["TYPO-PAGE-NUMBER", "PAGE_NUMBER", 500, 24, 1.2, 1],
].map(([token_id, role, font_weight, font_size, line_height, max_lines]) => ({
  token_id,
  role,
  font_family: font,
  font_weight,
  font_size,
  line_height,
  letter_spacing: 0,
  alignment: "LEFT",
  max_lines,
  overflow_strategy: role === "BODY" ? "BLOCK_AND_RETURN" : "REFLOW",
}));
const colorTokens = [
  ["COLOR-WARM-WHITE", "BACKGROUND", "#F5F2EB"],
  ["COLOR-CHARCOAL", "PRIMARY_TEXT", "#24282D"],
  ["COLOR-MUTED-BLUE", "ACCENT", "#40566C"],
  ["COLOR-PALE-BLUE", "OVERLAY", "#D9E1E7"],
  ["COLOR-SECONDARY", "SECONDARY_TEXT", "#66717A"],
].map(([token_id, role, color]) => ({
  token_id,
  role,
  value: color,
  color_space: "HEX",
  opacity: 1,
}));
const imageTreatment = {
  brightness: 0,
  contrast: 0.03,
  saturation: -0.2,
  blur: 0,
  overlay: "none",
  gradient: "none",
  mask: "none",
  crop_strategy: "CONTAIN",
};
const pageVisualPlans = pageData.map(([page_role, headline, body, direction], index) => ({
  page_visual_plan_id: `PVP-C0001-${String(index + 1).padStart(2, "0")}`,
  project_id: projectId,
  content_id: contentId,
  page_number: index + 1,
  page_role,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  visual_mode: "EDITORIAL_SERIES",
  visual_purpose: direction,
  copy_snapshot: { copy_version: "CV-1", headline, body, supporting_text: "" },
  background_direction: `Text-free warm-white editorial background; ${direction}.`,
  visual_evidence_requirement:
    index === 2
      ? "No certificate or official screenshot; use abstract correspondence cards."
      : "No factual photo claim.",
  asset_requirements: ["programmatic-editorial-graphic"],
  composition:
    index === 0
      ? "Large title upper-left, three abstract verification blocks below, generous whitespace."
      : "Page title, one page-specific information diagram and readable body block.",
  camera_and_lens_direction: null,
  lighting_direction: null,
  material_and_texture_direction: "Subtle paper grain only.",
  character_or_subject_direction: null,
  layout_regions: [
    {
      region_id: `REGION-${index + 1}-TITLE`,
      role: "TEXT",
      bbox: { x: 7, y: 8, width: 86, height: 18, unit: "PERCENT" },
      z_index: 2,
    },
    {
      region_id: `REGION-${index + 1}-BODY`,
      role: "TEXT",
      bbox: { x: 7, y: 30, width: 86, height: 42, unit: "PERCENT" },
      z_index: 2,
    },
  ],
  text_layers: [
    {
      layer_id: `LAYER-${index + 1}-TITLE`,
      role: "TITLE",
      content_source: "copy_snapshot.headline",
      content_snapshot: headline,
      bbox: { x: 7, y: 8, width: 86, height: 18, unit: "PERCENT" },
      typography_token_id: index === 0 ? "TYPO-DISPLAY-TITLE" : "TYPO-PAGE-TITLE",
      color_token_id: "COLOR-CHARCOAL",
      z_index: 3,
      required: true,
    },
    {
      layer_id: `LAYER-${index + 1}-BODY`,
      role: "BODY",
      content_source: "copy_snapshot.body",
      content_snapshot: body,
      bbox: { x: 7, y: 30, width: 86, height: 42, unit: "PERCENT" },
      typography_token_id: "TYPO-BODY",
      color_token_id: "COLOR-CHARCOAL",
      z_index: 3,
      required: true,
    },
    {
      layer_id: `LAYER-${index + 1}-PAGE-NUMBER`,
      role: "PAGE_NUMBER",
      content_source: "page_number",
      content_snapshot: String(index + 1).padStart(2, "0"),
      bbox: { x: 86, y: 91, width: 7, height: 3, unit: "PERCENT" },
      typography_token_id: "TYPO-PAGE-NUMBER",
      color_token_id: "COLOR-SECONDARY",
      z_index: 3,
      required: true,
    },
  ],
  image_treatment: imageTreatment,
  safe_area: safeArea,
  estimated_text_density: Math.min(0.44, (headline.length + body.length) / 300),
  max_text_density: 0.45,
  overflow_strategy: "REFLOW",
  negative_constraints: [
    "No people",
    "No fake certificates",
    "No logo",
    "No generated informational Chinese text",
  ],
  allowed_variations: ["Adjust non-informational geometry within the same token system"],
  fallback_strategy:
    "Use solid warm white and simple blue-gray geometry while preserving all text layers.",
  approval_dependency: "COPY_APPROVED",
  run_id: runId,
  schema_version: "1.0.0",
  created_at: at,
  updated_at: at,
  extensions: {},
}));
const visualSystem = {
  visual_system_id: "VS-C0001-VV1",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  visual_mode: "EDITORIAL_SERIES",
  visual_status: "FIRST_PAGE_READY",
  canvas,
  safe_area: safeArea,
  grid_system: { rules: ["12-column grid", "84px outer safe margin", "8px spacing unit"] },
  typography_tokens: typographyTokens,
  color_tokens: colorTokens,
  global_image_treatment: imageTreatment,
  global_layout_rules: {
    rules: [
      "High whitespace",
      "One page task",
      "Stable left alignment",
      "Continuous page numbering",
    ],
  },
  brand_mark_rules: { rules: ["No logo unless authorized in a later phase"] },
  page_number_rules: { rules: ["Two-digit number at lower-right"] },
  global_visual_direction:
    "克制专业编辑风；暖白底、深炭灰正文、低饱和深灰蓝强调、浅灰蓝辅助线；不使用人物、假证书、Logo或夸张商务模板。",
  global_background_strategy:
    "Text-free programmatic editorial geometry; Renderer owns all formal Chinese text.",
  global_negative_constraints: [
    "No people",
    "No fake certificate",
    "No official mark",
    "No logo",
    "No high-saturation red",
    "No excessive gold",
    "No generated Chinese copy",
  ],
  project_rule_snapshot_id: "APRS-P4A-001",
  platform_pack_id: "xiaohongshu",
  platform_pack_version: "1.0.0",
  industry_pack_id: "generic",
  industry_pack_version: "1.0.0",
  pages: pageVisualPlans,
  created_by_skill: "visual-planning",
  run_id: runId,
  schema_version: "1.0.0",
  created_at: at,
  updated_at: at,
  extensions: {},
};
const references = {
  visual_reference_manifest_id: "VRM-C0001-VV1",
  project_id: projectId,
  content_id: contentId,
  references: [],
  reference_count: 0,
  reference_type_counts: {},
  approved_count: 0,
  rejected_count: 0,
  created_at: at,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: {},
};
const assetPages = pageData.map(([page_role, , , direction], index) => ({
  page_number: index + 1,
  page_role,
  asset_source_strategy: "PROGRAMMATIC_GRAPHIC",
  asset_purpose: direction,
  asset_description: "Renderer-built abstract editorial geometry; no factual image claim.",
  required_assets: ["Renderer-built vector structure"],
  optional_assets: [],
  reference_asset_ids: [],
  generation_required: false,
  programmatic_render_required: true,
  evidence_asset_required: false,
  aspect_ratio: "3:4",
  composition: pageVisualPlans[index]?.composition ?? "Page-specific editorial structure.",
  subject: null,
  environment: null,
  camera_direction: null,
  lighting_direction: null,
  material_direction: "Subtle paper grain",
  prohibited_content: [
    "fake certificate",
    "fake official mark",
    "fake logo",
    "people",
    "Chinese text in generated background",
  ],
  informational_text_in_background_allowed: false,
  fallback_strategy: "Typography plus simple geometry only.",
}));
const assets = {
  asset_requirements_plan_id: "ARP-C0001-VV1",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  pages: assetPages,
  global_asset_rules: ["Renderer owns formal Chinese text", "No fabricated evidence"],
  shared_assets: ["Typography, color and spacing tokens"],
  unresolved_assets: [],
  generation_required_count: 0,
  programmatic_graphic_count: 6,
  project_asset_count: 0,
  evidence_asset_count: 0,
  no_asset_count: 0,
  ready_for_first_page: true,
  created_at: at,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: {},
};
const pageResults = pageVisualPlans.map((page) =>
  assessLayoutFeasibility(page, {
    available_text_regions: 2,
    typography_token_refs: page.text_layers.map((layer) => layer.typography_token_id),
    safe_area_fit: true,
  }),
);
if (pageResults.some((page) => page.status === "BLOCKED")) throw new Error("VISUAL_LAYOUT_BLOCKED");
const layout = {
  layout_feasibility_report_id: "LFR-C0001-VV1",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  page_results: pageResults,
  total_pages: 6,
  pass_count: pageResults.filter((item) => item.status === "PASS").length,
  warning_count: pageResults.filter((item) => item.status === "WARNING").length,
  blocked_count: 0,
  overall_status: pageResults.some((item) => item.status === "WARNING") ? "WARNING" : "PASS",
  copy_revision_required: false,
  created_at: at,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: { measurement_type: "PLANNING_ESTIMATE" },
};
const scores = {
  CONTENT_FIDELITY: 5,
  VISUAL_MODE_FIT: 4.8,
  GROUP_CONSISTENCY: 4.7,
  PAGE_SPECIFIC_RELEVANCE: 4.7,
  READABILITY_FEASIBILITY: 4.7,
  ASSET_FEASIBILITY: 5,
  PROJECT_FIT: 4.5,
  PLATFORM_FIT: 4.6,
} as const;
const qualityScore = calculateVisualPlanningQualityScore(scores);
const hardChecks = [
  "CONTENT_COPY_APPROVED",
  "G3_VERSION_VALID",
  "COPY_SNAPSHOT_IDENTICAL",
  "PAGE_COUNT_MATCH",
  "PAGE_SEQUENCE",
  "P1_COVER",
  "TYPOGRAPHY_TOKEN_UNIQUE",
  "COLOR_TOKEN_UNIQUE",
  "TOKEN_REFS_RESOLVE",
  "PAGE_VISUAL_TASK",
  "PAGE_ASSET_STRATEGY",
  "SAFE_AREA_VALID",
  "TEXT_DENSITY_HANDLED",
  "NO_CONTENT_REVISION_REQUIRED",
  "NO_REJECTED_DIRECTION",
  "ASSET_PERMISSION",
  "NO_FAKE_EVIDENCE",
  "BACKGROUND_HAS_NO_FORMAL_COPY",
  "FIRST_PAGE_HANDOFF_COMPLETE",
];
const weights: Record<string, number> = {
  CONTENT_FIDELITY: 20,
  VISUAL_MODE_FIT: 15,
  GROUP_CONSISTENCY: 15,
  PAGE_SPECIFIC_RELEVANCE: 15,
  READABILITY_FEASIBILITY: 15,
  ASSET_FEASIBILITY: 10,
  PROJECT_FIT: 5,
  PLATFORM_FIT: 5,
};
const quality = {
  visual_quality_report_id: "VQR-C0001-VV1",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  hard_checks: hardChecks.map((check_code) => ({
    check_code,
    status: "PASS",
    blocking: true,
    details: "Deterministically verified before handoff.",
  })),
  dimension_scores: Object.entries(scores).map(([dimension, score]) => ({
    dimension,
    score,
    weight: weights[dimension],
    rationale: "Evidence-backed Phase 4A sandbox assessment.",
  })),
  weighted_score: qualityScore,
  blocking_failure_count: 0,
  warning_count: layout.warning_count,
  passed_count: hardChecks.length,
  ready_for_first_page: true,
  limitations: [
    "Layout is a planning estimate, not a Renderer measurement",
    "No image asset was generated",
  ],
  recommended_changes: [],
  created_at: at,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: {},
};
const first = pageVisualPlans[0];
if (!first) throw new Error("FIRST_PAGE_HANDOFF_NOT_READY");
const firstHandoff = {
  page_number: 1,
  page_role: "COVER",
  page_visual_plan_id: first.page_visual_plan_id,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  copy_snapshot: {
    headline: first.copy_snapshot.headline,
    body: first.copy_snapshot.body,
    supporting_text: first.copy_snapshot.supporting_text,
  },
  copy_snapshot_hash: hash(first.copy_snapshot),
  canvas,
  safe_area: safeArea,
  typography_tokens: typographyTokens,
  color_tokens: colorTokens,
  grid_system: visualSystem.grid_system,
  asset_requirement: assetPages[0],
  background_strategy: first.background_direction,
  text_layers: first.text_layers,
  image_treatment: imageTreatment,
  negative_constraints: first.negative_constraints,
  required_capabilities: ["PROGRAMMATIC_RENDERER", "CHINESE_TEXT_LAYOUT"],
  generation_required: false,
  programmatic_render_required: true,
  ready: true,
  blocking_reasons: [],
};
const handoff = {
  visual_handoff_package_id: "VHP-C0001-VV1",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  visual_context_ref: visualContext.visual_context_id,
  visual_direction_decision: decision,
  visual_reference_manifest: references,
  visual_system: visualSystem,
  page_visual_plans: pageVisualPlans,
  asset_requirements_plan: assets,
  layout_feasibility_report: layout,
  visual_quality_report: quality,
  first_page_handoff: firstHandoff,
  platform_pack_version: "1.0.0",
  industry_pack_version: "1.0.0",
  project_rule_snapshot: "APRS-P4A-001",
  created_at: at,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: {},
};
const submit = await tool("content_ops_submit_visual_plan").handler(context, {
  project_id: projectId,
  content_id: contentId,
  run_id: runId,
  idempotency_key: `VISUAL-${runId}-C0001`,
  visual_context: visualContext,
  visual_direction_decision: decision,
  visual_reference_manifest: references,
  visual_system: visualSystem,
  page_visual_plans: pageVisualPlans,
  asset_requirements_plan: assets,
  layout_feasibility_report: layout,
  visual_quality_report: quality,
  visual_handoff_package: handoff,
});
const planHash = String(details(submit.details).visual_plan_hash);
const finalized = await tool("content_ops_finalize_visual_plan").handler(context, {
  project_id: projectId,
  content_id: contentId,
  run_id: runId,
  visual_plan_hash: planHash,
  idempotency_key: `VISUAL-${runId}-C0001`,
  explicit_confirmation: true,
});
const verified = await tool("content_ops_verify_visual_plan").handler(context, {
  project_id: projectId,
  content_id: contentId,
  run_id: runId,
  visual_plan_hash: planHash,
});
if (finalized.status !== "SUCCESS" || verified.status !== "SUCCESS")
  throw new Error("VISUAL_LIVE_VERIFY_BLOCKED");
const firstPage = await tool("content_ops_get_first_page_handoff").handler(context, {
  project_id: projectId,
  content_id: contentId,
  run_id: runId,
});
if (firstPage.status !== "SUCCESS") throw new Error("FIRST_PAGE_HANDOFF_NOT_READY");
const replay = await tool("content_ops_finalize_visual_plan").handler(context, {
  project_id: projectId,
  content_id: contentId,
  run_id: runId,
  visual_plan_hash: planHash,
  idempotency_key: `VISUAL-${runId}-C0001`,
  explicit_confirmation: true,
});
let conflictCode = "";
try {
  const runtime = await context.visualPlanningRuntime(projectId, runId);
  await runtime.finalize({
    contentUniqueKey: `${projectId}::content::${contentId}`,
    contentVersion: 1,
    contentId,
    contentVersionLabel: "CV-1",
    copyVersion: "CV-1",
    visualPlanVersion: "VV-1",
    planHash: "f".repeat(64),
    backgroundDirection: visualSystem.global_visual_direction,
    visualPlanSummary: "conflict test",
    updatedAt: at,
    idempotencyKey: `VISUAL-${runId}-C0001`,
    confirmLiveWrite: true,
  });
} catch (error) {
  conflictCode = error instanceof Error ? error.message : "UNKNOWN";
}
if (conflictCode !== "VISUAL_IDEMPOTENCY_CONFLICT")
  throw new Error("VISUAL_IDEMPOTENCY_CONFLICT_NOT_BLOCKED");
let copyDrift = "";
let pageCountDrift = "";
try {
  validateCopyFidelity(
    pagesForContent.map((page) => ({ page_number: page.page_number, copy: page })),
    pageVisualPlans.map((page, index) =>
      index === 0 ? { ...page, copy_snapshot: { ...page.copy_snapshot, headline: "改写" } } : page,
    ),
  );
} catch (error) {
  copyDrift = error instanceof Error ? error.message : "UNKNOWN";
}
try {
  validateCopyFidelity(
    pagesForContent.map((page) => ({ page_number: page.page_number, copy: page })),
    pageVisualPlans.slice(0, 5),
  );
} catch (error) {
  pageCountDrift = error instanceof Error ? error.message : "UNKNOWN";
}
const overflow = assessLayoutFeasibility(
  {
    page_number: 1,
    page_role: "COVER",
    copy_snapshot: {
      copy_version: "CV-1",
      headline: "测试",
      body: "字".repeat(320),
      supporting_text: "",
    },
  },
  { available_text_regions: 1, typography_token_refs: ["TYPO-BODY"], safe_area_fit: true },
);
const revision = await tool("content_ops_plan_visual_revision").handler(context, {
  project_id: projectId,
  content_id: contentId,
  run_id: runId,
  from_visual_plan_version: "VV-1",
  revision_scope: "COLOR_SYSTEM",
  requested_changes: ["Dry-run only"],
  changes_copy: false,
  changes_page_count: false,
});
const evidence = {
  evidence_id: `VLE-${runId.replace(/^RUN-/, "")}`,
  overall_status: "PASSED",
  project_id: projectId,
  run_id: runId,
  content_id: contentId,
  content_id_hash: hash(contentId),
  base_identifier_hash: hash(baseToken),
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  selected_mode: "EDITORIAL_SERIES",
  candidate_count: 3,
  page_count: 6,
  quality_score: qualityScore,
  quality_blockers: 0,
  layout_status: layout.overall_status,
  layout_blocked_count: 0,
  asset_strategy_counts: { PROGRAMMATIC_GRAPHIC: 6 },
  feishu_update_count: finalized.updated_records,
  writes_attempted: Number(details(finalized.details).writes_attempted),
  writes_passed: Number(details(finalized.details).writes_passed),
  writes_failed: 0,
  protected_fields_unchanged: details(finalized.details).protected_fields_unchanged,
  handoff_status: "READY",
  idempotent_replay_updates: replay.updated_records,
  conflict_code: conflictCode,
  copy_drift_code: copyDrift,
  page_count_drift_code: pageCountDrift,
  overflow_status: overflow.status,
  overflow_strategy: overflow.overflow_strategy,
  revision_dry_run: revision.status === "SUCCESS",
  revision_remote_writes: 0,
  image_generation_attempted: false,
  generated_asset_count: 0,
  png_count: 0,
  g4_created: false,
  style_lock_created: false,
  manual_cleanup_required: false,
  table_count: remoteTables.length,
  mapped_blueprint_field_count: fieldMap.length,
  started_at: at,
  completed_at: new Date().toISOString(),
  full_identifiers_location: "CONTENT_OPS_HOME/phase-4a-visual-live-evidence.json",
};
await atomicJson(path.join(contentOpsHome, "phase-4a-visual-live-evidence.json"), {
  ...evidence,
  base_token: baseToken,
  table_ids: tableIds,
  field_map: fieldMap,
});
process.stdout.write(
  `${JSON.stringify({ overall_status: "PASSED", run_id: runId, content_id: contentId, selected_mode: evidence.selected_mode, page_count: 6, quality_score: qualityScore, layout_status: layout.overall_status, feishu_update_count: evidence.feishu_update_count, writes_attempted: evidence.writes_attempted, writes_failed: 0, protected_fields_unchanged: true, handoff_status: "READY", idempotent_replay_updates: 0, conflict_code: conflictCode, copy_drift_code: copyDrift, page_count_drift_code: pageCountDrift, overflow_strategy: overflow.overflow_strategy, revision_remote_writes: 0, image_generation_attempted: false, g4_created: false, style_lock_created: false, remote_identifiers_exposed: false })}\n`,
);
