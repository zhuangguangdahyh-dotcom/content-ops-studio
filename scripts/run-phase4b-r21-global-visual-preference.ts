import { readFile } from "node:fs/promises";
import path from "node:path";
import { GlobalVisualPreferenceRuntime } from "../packages/runtime/src/image-production/index.js";

const dataHome = path.resolve(
  process.env.CONTENT_OPS_R21_LEARNING_HOME ??
    "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br2",
);
const schemaRoot = path.resolve("plugins/content-ops-studio/schemas/1.0");
const runtime = new GlobalVisualPreferenceRuntime({ dataHome, schemaRoot });
const current = await runtime.readActive();
if (current?.artifact_key !== "GUVPV-1") {
  throw new Error("GLOBAL_VISUAL_PREFERENCE_BASE_VERSION_CONFLICT");
}
const currentPreference = current.preference as { active_rule_refs: string[] };
const runId = "RUN-20260826-144500-R21G";
const at = "2026-08-26T06:45:00.000Z";
const event = {
  event_id: "VFE-GLOBAL-UNIVERSAL-VISUAL-R21",
  project_id: "PRJ-20990101-GLBL",
  content_id: null,
  feedback_class: "VISUAL_PREFERENCE",
  scope: "GLOBAL_USER_PREFERENCE",
  target_type: "GLOBAL",
  target_id: "UNIVERSAL-VISUAL-DEFAULT-V1",
  statement:
    "Confirm modern Chinese serif defaults, dynamic typography/color/effects, editorial spatial composition and anti-template behavior as global fallback preferences.",
  is_tool_or_system_defect: false,
  long_term_rule_candidate: true,
  creates_long_term_rule: false,
  source: "OPERATOR_FEEDBACK",
  run_id: runId,
  schema_version: "1.0.0",
  created_at: at,
};

const inputs = [
  {
    id: "VR-GLOBAL-DEFAULT-CHINESE-SERIF",
    type: "PREFER",
    statement: "当用户、项目、品牌或行业没有指定字体时，中文默认优先使用现代宋体体系。",
    positive: ["Renderer验证的Songti SC", "Renderer验证的现代中文宋体"],
    negative: ["静默使用PingFang SC", "下载或复制字体文件"],
    exceptions: ["用户、项目、品牌或行业明确指定其他字体。"],
  },
  {
    id: "VR-GLOBAL-DEFAULT-CHINESE-TITLE-WEIGHT",
    type: "PREFER",
    statement: "中文大标题默认使用宋体真实粗体或当前字体可用的最重正式字重，形成明确第一视觉。",
    positive: ["真实700或800字重", "字体实际可用的最重正式字重"],
    negative: ["描边模拟粗体", "叠字或廉价阴影模拟粗体"],
    exceptions: ["更高优先级的品牌、项目或当前Operator规则明确要求其他层级。"],
  },
  {
    id: "VR-GLOBAL-DEFAULT-CHINESE-SUPPORTING-TYPE",
    type: "PREFER",
    statement: "小标题默认使用宋体Regular或Medium，不默认加粗；正文默认使用宋体Regular。",
    positive: ["小标题Regular或Medium", "正文Regular"],
    negative: ["小标题无理由与主标题同粗", "正文作为不可读杂志小注"],
    exceptions: ["品牌、项目、内容、Visual Mode或当前Operator要求明确覆盖。"],
  },
  {
    id: "VR-GLOBAL-DYNAMIC-TYPOGRAPHY-AND-EFFECTS",
    type: "MUST",
    statement:
      "字号、颜色、行距、字距、对齐、文字占比、强调方式、阴影、渐变、蒙版和其他视觉效果必须根据当前底图、内容、平台、项目档案和视觉策略动态决定，不使用固定万能模板。",
    positive: ["根据底图负空间与内容层级动态排版"],
    negative: ["固定颜色公式", "固定文字图片区和固定效果"],
    exceptions: [],
  },
  {
    id: "VR-GLOBAL-EDITORIAL-SPATIAL-COMPOSITION",
    type: "PREFER",
    statement:
      "在没有其他明确视觉规范时，成品默认应具备高级编辑、杂志海报和品牌视觉的空间构成感，包括明确层级、比例、轴线、非对称张力、图文关系和有目的的留白。",
    positive: ["至少两种真实空间关系", "文字和图像共同建立阅读路径"],
    negative: ["一张照片加一个机械文字框", "只有干净而没有设计张力"],
    exceptions: ["当前内容语义或明确项目规则要求可解释的极简结构。"],
  },
  {
    id: "VR-GLOBAL-ANTI-GENERIC-TEMPLATE",
    type: "AVOID",
    statement:
      "默认避免普通PPT汇报、普通居中、大字报、固定左文右图、固定左上标题、圆角信息卡、大白卡、四宫格、网页组件式排版以及“很干净但没有设计张力”的通用模板。",
    positive: ["内容驱动的编辑空间", "具有主体、边缘或负空间关系的排版"],
    negative: ["固定左上文字覆盖", "圆角卡片堆叠", "网页组件式四宫格"],
    exceptions: ["只有当该结构明确服务当前内容语义和用户明确视觉要求时可以使用。"],
  },
] as const;

const rules = inputs.map((input) => ({
  rule_id: input.id,
  project_id: null,
  source_event_id: event.event_id,
  source_candidate_id: null,
  global_preference_version: "GUVPV-2",
  rule_statement: input.statement,
  rationale: "The Operator explicitly confirmed this as a global fallback visual preference.",
  scope: "GLOBAL_USER_PREFERENCE",
  rule_type: input.type,
  positive_examples: [...input.positive],
  negative_examples: [...input.negative],
  allowed_exceptions: [...input.exceptions],
  confirmed_by_user: true,
  status: "ACTIVE",
  version: 1,
  supersedes_version: null,
  run_id: runId,
  schema_version: "1.0.0",
  created_at: at,
  updated_at: at,
}));

const preference = {
  preference_id: "GUVP-DEFAULT",
  preference_version: "GUVPV-2",
  active_rule_refs: [
    ...currentPreference.active_rule_refs,
    ...rules.map((rule) => `${rule.rule_id}@1`),
  ],
  supersedes_version: "GUVPV-1",
  confirmed_by_operator: true,
  source_event_id: event.event_id,
  run_id: runId,
  created_at: at,
  updated_at: at,
  schema_version: "1.0.0",
  extensions: {
    industry_pack_mutated: false,
    universal_visual_default_version: "UVDPV-1",
    typography_default_policy_version: "TDPV-1",
  },
};

await runtime.writeVersion("visual-feedback-event", event.event_id, event);
for (const rule of rules) await runtime.writeVersion("visual-rule", `${rule.rule_id}-V1`, rule);
await runtime.writeVersion(
  "global-user-visual-preference",
  preference.preference_version,
  preference,
);
await runtime.activate(preference.preference_version, preference);
const readback = await runtime.readActive();
if (readback?.artifact_key !== "GUVPV-2")
  throw new Error("GLOBAL_VISUAL_PREFERENCE_READ_VERIFY_FAILED");
const disk = JSON.parse(
  await readFile(
    path.join(dataHome, "global-user-visual-learning/preferences/GUVPV-2.json"),
    "utf8",
  ),
) as { active_rule_refs: string[] };
if (disk.active_rule_refs.length !== 11)
  throw new Error("GLOBAL_VISUAL_PREFERENCE_RULE_COUNT_MISMATCH");
process.stdout.write(
  `${JSON.stringify({ status: "PASSED", preference_version: "GUVPV-2", active_rule_count: 11, industry_pack_mutated: false })}\n`,
);
