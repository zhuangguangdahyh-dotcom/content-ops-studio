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
const projectName = "ContentOpsStudio｜Phase2B2沙箱｜RUN-20260824-111500-P2B2";
const runId = "RUN-20260824-120110-P3B1";
const researchRunId = "RUN-20260824-085455-P3A1";
const contentId = "C-0001";
const targetVersion = "CV-1:CV-1";
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

function details(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function errorCode(error: unknown): string {
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string")
    return error.code;
  return error instanceof Error ? error.message : "UNKNOWN_ERROR";
}

const before = await tool("content_ops_verify_content").handler(context, {
  project_id: projectId,
  run_id: runId,
  content_id: contentId,
});
if (before.status !== "SUCCESS") throw new Error("G3_PREFLIGHT_VERIFY_BLOCKED");

const retainedReview = details(
  await context.readContentJson(projectId, runId, "content-copy-review.json"),
);
const reviewedAt =
  typeof retainedReview.created_at === "string"
    ? retainedReview.created_at
    : new Date().toISOString();
const review = {
  copy_review_id: "CCR-20260824-P3B1-G3",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  decision: "APPROVE",
  overall_comment: "Operator explicitly approved the exact presented CV-1:CV-1 package.",
  title_feedback: "Approved as presented.",
  body_feedback: "Approved as presented.",
  cta_feedback: "Approved with the intentionally empty direct-message hook.",
  page_feedback: [],
  requested_changes: [],
  reviewer_role: "OPERATOR",
  source_run_id: runId,
  created_at: reviewedAt,
  schema_version: "1.0.0",
  extensions: { visual_planning_started: false },
};
const approvalInput = {
  approval_id: "APR-20260824-P3B1",
  gate: "CONTENT_COPY",
  target_type: "CONTENT_PACKAGE",
  target_id: contentId,
  target_version: targetVersion,
  decision: "APPROVE",
  source_run_id: runId,
  project_id: projectId,
  project_name: projectName,
  comment: "Explicit Operator approval for the exact presented CV-1:CV-1 package.",
  expected_version: targetVersion,
  content_copy_review: review,
  request_id: "G3-APPROVE-RUN-20260824-120110-P3B1",
  explicit_confirmation: true,
};

const approval = await tool("content_ops_submit_approval").handler(context, approvalInput);
if (approval.status !== "SUCCESS") throw new Error("G3_APPROVAL_BLOCKED");
const verified = await tool("content_ops_verify_content").handler(context, {
  project_id: projectId,
  run_id: runId,
  content_id: contentId,
});
if (verified.status !== "SUCCESS") throw new Error("G3_REMOTE_VERIFY_BLOCKED");
const resumed = await tool("content_ops_resume_run").handler(context, {
  project_id: projectId,
  run_id: runId,
  expected_version: targetVersion,
  request_id: "G3-RESUME-RUN-20260824-120110-P3B1",
  explicit_confirmation: true,
});
if (resumed.status !== "SUCCESS") throw new Error("G3_RESUME_BLOCKED");

const approvalReplay = await tool("content_ops_submit_approval").handler(context, approvalInput);
if (approvalReplay.status !== "SUCCESS") throw new Error("G3_APPROVAL_REPLAY_BLOCKED");

const plan = details(await context.readContentJson(projectId, runId, "content-creation-plan.json"));
const draft = details(await context.readContentJson(projectId, runId, "content-draft.json"));
const claimMap = details(await context.readContentJson(projectId, runId, "content-claim-map.json"));
const finalizeReplay = await tool("content_ops_finalize_content_copy").handler(context, {
  project_id: projectId,
  run_id: runId,
  content_creation_plan_hash: plan.plan_hash,
  content_draft_hash: context.hash(draft),
  claim_map_hash: context.hash(claimMap),
  idempotency_key: `CONTENT-${runId}-C0001`,
  explicit_confirmation: true,
});
if (finalizeReplay.status !== "SUCCESS") throw new Error("CONTENT_REPLAY_BLOCKED");

const alternate = await tool("content_ops_plan_content_creation").handler(context, {
  project_id: projectId,
  painpoint_id: "P-0001",
  research_run_id: researchRunId,
  run_id: "RUN-20260824-120111-P3BA",
  operation: "CREATE_ALTERNATE",
  requested_content_id: "C-0002",
  requested_page_count: 6,
  single_core_problem: "为什么只看头衔容易误判专业服务是否匹配？",
  user_fixed_angle: "专业信任误区拆解",
});
if (alternate.status !== "SUCCESS") throw new Error("ALTERNATE_DRY_PLAN_BLOCKED");

const duplicateRunId = "RUN-20260824-120112-P3BD";
const duplicatePlanned = await tool("content_ops_plan_content_creation").handler(context, {
  project_id: projectId,
  painpoint_id: "P-0001",
  research_run_id: researchRunId,
  run_id: duplicateRunId,
  operation: "CREATE_NEW",
  requested_content_id: "C-0002",
  requested_page_count: 6,
  single_core_problem: "决策者如何在咨询前判断专业服务主体的身份与资质是否值得信任？",
  user_fixed_angle: null,
});
const duplicatePlanDetails = details(duplicatePlanned.details);
const duplicatePlan = details(duplicatePlanDetails.plan);
const originalContent = details(draft.content);
const duplicateAt = new Date().toISOString();
const duplicateContent = {
  ...originalContent,
  content_id: "C-0002",
  record_unique_key: `${projectId}::content::C-0002`,
  last_run_id: duplicateRunId,
  created_at: duplicateAt,
  updated_at: duplicateAt,
};
const duplicatePages = Array.isArray(draft.pages)
  ? draft.pages.map((page) => ({
      ...details(page),
      created_at: duplicateAt,
      updated_at: duplicateAt,
    }))
  : [];
const duplicateClaimMap = {
  ...claimMap,
  claim_map_id: "CLM-20260824-120110-P3B1-DUP",
  content_id: "C-0002",
  created_at: duplicateAt,
  run_id: duplicateRunId,
};
const duplicateSubmitted = await tool("content_ops_submit_content_draft").handler(context, {
  project_id: projectId,
  run_id: duplicateRunId,
  research_run_id: researchRunId,
  painpoint_id: "P-0001",
  plan_hash: duplicatePlan.plan_hash,
  painpoint_version: duplicatePlan.painpoint_version,
  project_rule_snapshot: duplicatePlan.project_rule_snapshot,
  idempotency_key: `CONTENT-${duplicateRunId}-C0002`,
  plan: duplicatePlan,
  angle_decision: duplicatePlanDetails.angle_decision,
  content: duplicateContent,
  pages: duplicatePages,
  claim_map: duplicateClaimMap,
  dimension_scores: draft.dimension_scores,
  near_semantic_assessments: [],
});
let duplicateBlocked = false;
let duplicateCode = "";
try {
  await tool("content_ops_finalize_content_copy").handler(context, {
    project_id: projectId,
    run_id: duplicateRunId,
    content_creation_plan_hash: duplicatePlan.plan_hash,
    content_draft_hash: details(duplicateSubmitted.details).content_draft_hash,
    claim_map_hash: details(duplicateSubmitted.details).claim_map_hash,
    idempotency_key: `CONTENT-${duplicateRunId}-C0002`,
    explicit_confirmation: true,
  });
} catch (error) {
  duplicateCode = errorCode(error);
  duplicateBlocked = duplicateCode === "CONTENT_DUPLICATION_BLOCKED";
}
if (!duplicateBlocked) throw new Error("EXACT_DUPLICATE_WAS_NOT_BLOCKED");

const blockedPainpoints: Record<string, string> = {};
const blockedPainpointRuns: Array<[string, string]> = [
  ["P-0003", "RUN-20260824-120113-P3B3"],
  ["P-0005", "RUN-20260824-120114-P3B5"],
];
for (const [painpointId, boundaryRunId] of blockedPainpointRuns) {
  try {
    await tool("content_ops_plan_content_creation").handler(context, {
      project_id: projectId,
      painpoint_id: painpointId,
      research_run_id: researchRunId,
      run_id: boundaryRunId,
      operation: "CREATE_NEW",
      requested_content_id: null,
      requested_page_count: 6,
      single_core_problem: "该未确认痛点不得进入内容创作。",
      user_fixed_angle: null,
    });
  } catch (error) {
    blockedPainpoints[painpointId] = errorCode(error);
  }
}
if (Object.values(blockedPainpoints).some((code) => code !== "PAINPOINT_NOT_CONFIRMED"))
  throw new Error("UNCONFIRMED_PAINPOINT_BOUNDARY_FAILED");

const contents = await tool("content_ops_list_contents").handler(context, {
  project_id: projectId,
});
const contentCount = Number(details(contents.details).count);
if (contentCount !== 1) throw new Error("CONTENT_RECORD_COUNT_MISMATCH");

const evidence = {
  status: "PASSED",
  run_id: runId,
  content_id: contentId,
  target_version: targetVersion,
  g3_decision: "APPROVE",
  g3_remote_update: details(approval.details).remote_update,
  g3_content_status: details(verified.details).content_status,
  g3_read_verification: verified.status,
  painpoint_status_match: details(verified.details).painpoint_status_match,
  resume_status: details(resumed.details).resume_status,
  approval_replay_updated_records: approvalReplay.updated_records ?? 0,
  finalize_replay_remote_mutations: details(finalizeReplay.details).remote_mutations,
  content_record_count: contentCount,
  exact_duplicate_result: duplicateCode,
  alternate_plan_status: alternate.status,
  alternate_plan_remote_write_attempted: false,
  blocked_painpoints: blockedPainpoints,
  visual_planning_eligible: details(approval.details).eligible_for_visual_planning,
  visual_planning_started: false,
  remote_identifiers_exposed: false,
  completed_at: new Date().toISOString(),
};
await context.writeContentJson(projectId, runId, "phase-3b-post-g3-evidence.json", evidence);
process.stdout.write(`${JSON.stringify(evidence)}\n`);
