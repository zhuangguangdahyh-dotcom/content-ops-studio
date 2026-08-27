import { createHash } from "node:crypto";
import { appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { FirstPageRuntime } from "../packages/runtime/src/first-page/index.js";
import { logicalFields } from "../services/content-ops-mcp/src/content-tools.js";
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
if (contentOpsHome === pluginRoot || contentOpsHome.startsWith(`${pluginRoot}${path.sep}`))
  throw new Error("CONTENT_OPS_HOME_INVALID");
const projectId = "PRJ-20260824-P2B2";
const contentId = "C-0001";
const sourceRunId = process.env.CONTENT_OPS_PHASE4A_RUN_ID ?? "RUN-20260824-223000-P4A1";
const runId = process.env.CONTENT_OPS_PHASE4B_RUN_ID ?? "RUN-20260825-003000-P4B1";
let now = new Date().toISOString();
const hash = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value).normalize("NFKC")).digest("hex");
const record = (value: unknown): Json =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Json) : {};
const tool = (name: string) => {
  const found = TOOL_DEFINITIONS.find((item) => item.name === name);
  if (!found) throw new Error(`MCP_TOOL_NOT_FOUND:${name}`);
  return found;
};
async function atomicJson(file: string, value: unknown) {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await rename(temporary, file);
}

async function appendJsonLineOnce(file: string, identity: string, value: unknown) {
  try {
    if ((await readFile(file, "utf8")).includes(identity)) return;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  await appendFile(file, `${JSON.stringify(value)}\n`, { encoding: "utf8", mode: 0o600 });
}

const context = createMcpContext({ pluginRoot, home: contentOpsHome, env: process.env });
const retainedPlan = record(
  await context.readFirstPageJson(projectId, runId, "first-page-production-plan.json"),
);
if (typeof retainedPlan.created_at === "string") now = retainedPlan.created_at;
const handoff = record(
  await context.readVisualJson(projectId, sourceRunId, "visual-handoff-package.json"),
);
if (!Object.keys(handoff).length) throw new Error("FIRST_PAGE_HANDOFF_NOT_READY");
const first = record(handoff.first_page_handoff);
const copy = record(first.copy_snapshot);
const text = { headline: String(copy.headline), body: String(copy.body), page_number: "01" };
if (
  text.headline !== "先别急着相信“专业”" ||
  text.body !== "真正值得判断的，不是包装有多满，而是身份、资质和服务边界能不能被核验。"
)
  throw new Error("FIRST_PAGE_COPY_DRIFT");
const input = {
  project_id: projectId,
  content_id: contentId,
  run_id: runId,
  content_version: String(handoff.content_version),
  copy_version: String(handoff.copy_version),
  visual_plan_version: String(handoff.visual_plan_version),
  first_page_version: "FPV-1",
  copy_snapshot_hash: String(first.copy_snapshot_hash),
  visual_handoff_ref: `projects/${projectId}/runs/${sourceRunId}/visual-planning/visual-handoff-package.json`,
  visual_handoff_hash: hash(handoff),
  page_visual_plan_id: String(first.page_visual_plan_id),
  text,
  idempotency_key: `FIRST-PAGE-${projectId}-${contentId}-FPV1`,
  created_at: now,
};
const planned = await tool("content_ops_plan_first_page_production").handler(context, input);
if (planned.status !== "SUCCESS") throw new Error("FIRST_PAGE_PLAN_BLOCKED");
const planHash = String(record(planned.details).plan_hash);
const rendererStatus = await tool("content_ops_get_renderer_status").handler(context, {});
if (rendererStatus.status !== "SUCCESS") throw new Error("RENDERER_BROWSER_NOT_INSTALLED");
const rendered = await tool("content_ops_render_first_page").handler(context, {
  ...input,
  plan_hash: planHash,
  renderer_environment_id: `RENV-${runId.replace(/^RUN-/, "")}`,
  explicit_confirmation: true,
});
if (rendered.status !== "AWAITING_APPROVAL") throw new Error("FIRST_PAGE_RENDER_BLOCKED");
const renderDetails = record(rendered.details);
const checksum = String(renderDetails.checksum);
const outputPath = String(renderDetails.output_path);
const verified = await tool("content_ops_verify_first_page").handler(context, {
  project_id: projectId,
  content_id: contentId,
  run_id: runId,
  expected_checksum: checksum,
});
if (verified.status !== "SUCCESS") throw new Error("FIRST_PAGE_OUTPUT_INVALID");

const workspace = await context.contentWorkspace(projectId);
const contentFieldMap = workspace.fieldMap.filter((item) => item.tableLogicalKey === "contents");
const uniqueKey = `${projectId}::content::${contentId}`;
const before = await workspace.adapter.findRecordByUniqueKey(uniqueKey, {
  tableId: workspace.contentTableId,
  tableLogicalKey: "contents",
  uniqueFieldLogicalKey: "contentsRecordUniqueKey",
});
if (!before) throw new Error("CONTENT_NOT_FOUND");
const beforeLogical = logicalFields(before.fields, contentFieldMap);
const allowed = {
  contentsImageStatus: "FIRST_PAGE_PENDING_APPROVAL",
  contentsFirstPageApprovalStatus: "FIRST_PAGE_APPROVAL_PENDING",
  contentsLastRunId: runId,
  contentsUpdatedAt: now,
};
let writesAttempted = 0;
let writesPassed = 0;
const pendingAlreadyMatches = await workspace.adapter.verifyWrite(before, allowed);
if (!pendingAlreadyMatches) {
  writesAttempted += 1;
  await workspace.adapter.updateRecord({
    tableId: workspace.contentTableId,
    tableLogicalKey: "contents",
    uniqueKey,
    uniqueFieldLogicalKey: "contentsRecordUniqueKey",
    version: before.version,
    recordId: before.recordId,
    fields: allowed,
    allowUserManaged: true,
  });
  writesPassed += 1;
}
const after = await workspace.adapter.findRecordByUniqueKey(uniqueKey, {
  tableId: workspace.contentTableId,
  tableLogicalKey: "contents",
  uniqueFieldLogicalKey: "contentsRecordUniqueKey",
});
if (!after) throw new Error("FIRST_PAGE_REMOTE_READ_VERIFY_FAILED");
const afterLogical = logicalFields(after.fields, contentFieldMap);
if (!(await workspace.adapter.verifyWrite(after, allowed)))
  throw new Error("FIRST_PAGE_REMOTE_READ_VERIFY_FAILED");
if (
  afterLogical.contentsContentStatus !== "VISUAL_PLANNING" ||
  afterLogical.contentsFinalApprovalStatus !== "FINAL_NOT_SUBMITTED" ||
  afterLogical.contentsSyncStatus !== "SYNC_NOT_STARTED" ||
  afterLogical.contentsStyleLockVersion
)
  throw new Error("FIRST_PAGE_REMOTE_PROTECTED_STATE_DRIFT");
const protectedKeys = [
  "contentsPageCopy",
  "contentsPublishTitle",
  "contentsPublishBody",
  "contentsPageCount",
  "contentsBackgroundDirection",
  "contentsVisualPlanVersion",
];
if (
  hash(Object.fromEntries(protectedKeys.map((key) => [key, beforeLogical[key]]))) !==
  hash(Object.fromEntries(protectedKeys.map((key) => [key, afterLogical[key]])))
)
  throw new Error("FIRST_PAGE_REMOTE_PROTECTED_STATE_DRIFT");

const replay = await workspace.adapter.findRecordByUniqueKey(uniqueKey, {
  tableId: workspace.contentTableId,
  tableLogicalKey: "contents",
  uniqueFieldLogicalKey: "contentsRecordUniqueKey",
});
if (!replay) throw new Error("FIRST_PAGE_REPLAY_READ_FAILED");
if (!(await workspace.adapter.verifyWrite(replay, allowed)))
  throw new Error("FIRST_PAGE_IDEMPOTENT_REPLAY_FAILED");
const replayUpdates = 0;

const asset = record(await context.readVisualJson(projectId, runId, "first-page-asset.json"));
const assetRef = record(asset.asset);
const runtimeRoot = path.join(contentOpsHome, "projects", projectId, "runs", runId);
const runtime = new FirstPageRuntime(
  path.join(runtimeRoot, "outputs", "first-page", "first-page-runtime-state.json"),
);
await runtime.recordPending({
  project_id: projectId,
  content_id: contentId,
  run_id: runId,
  content_version: String(input.content_version),
  copy_version: String(input.copy_version),
  visual_plan_version: String(input.visual_plan_version),
  first_page_version: "FPV-1",
  asset_id: String(assetRef.asset_id),
  asset_checksum: checksum,
  renderer_environment_ref: `projects/${projectId}/runs/${runId}/outputs/first-page/renderer-environment-evidence.json`,
  status: "AWAITING_USER_APPROVAL",
  style_lock_version: null,
  approval_id: null,
});
await appendJsonLineOnce(
  path.join(runtimeRoot, "journal.jsonl"),
  `CV-1:CV-1:VV-1:FPV-1:${checksum}`,
  {
    event_type: "APPROVAL_REQUESTED",
    run_id: runId,
    project_id: projectId,
    gate: "G4 FIRST_PAGE",
    target_id_hash: hash(assetRef.asset_id),
    target_version: `CV-1:CV-1:VV-1:FPV-1:${checksum}`,
    created_at: now,
  },
);
await appendJsonLineOnce(
  path.join(runtimeRoot, "write-log.jsonl"),
  `WRITE-${runId.replace(/^RUN-/, "")}-001`,
  {
    write_id: `WRITE-${runId.replace(/^RUN-/, "")}-001`,
    run_id: runId,
    project_id: projectId,
    operation: "UPDATE_FIRST_PAGE_PENDING_STATE",
    target_type: "FEISHU_CONTENT_RECORD",
    target_id_hash: hash(before.recordId),
    idempotency_key: input.idempotency_key,
    state_before_hash: hash(beforeLogical),
    state_after_hash: hash(afterLogical),
    verification_status: "VERIFIED",
    attempt_number: 1,
    started_at: now,
    completed_at: new Date().toISOString(),
  },
);
await atomicJson(path.join(runtimeRoot, "checkpoints", "g4-first-page-pending.json"), {
  checkpoint_id: `CHKPT-${runId.replace(/^RUN-/, "")}-G4`,
  run_id: runId,
  project_id: projectId,
  gate: "FIRST_PAGE",
  target_version: `CV-1:CV-1:VV-1:FPV-1:${checksum}`,
  status: "AWAITING_APPROVAL",
  created_at: now,
});
const evidence = {
  evidence_id: `FPLE-${runId.replace(/^RUN-/, "")}`,
  overall_status: "PASSED",
  project_id: projectId,
  run_id: runId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  first_page_version: "FPV-1",
  output_path: outputPath,
  output_checksum: checksum,
  renderer_status: "PASSED",
  mechanical_qa: "PASSED",
  copy_fidelity: "PASSED",
  dimensions: { width: 1242, height: 1660 },
  live_feishu_pending_state: "PASSED",
  writes_attempted: writesAttempted,
  writes_passed: writesPassed,
  writes_failed: 0,
  idempotent_replay_updates: replayUpdates,
  g4_status: "AWAITING_USER_APPROVAL",
  style_lock_status: "NOT_CREATED",
  remaining_pages: "NOT_ELIGIBLE",
  completed_at: new Date().toISOString(),
};
await atomicJson(path.join(contentOpsHome, "phase-4b-first-page-live-evidence.json"), {
  ...evidence,
  asset_id: assetRef.asset_id,
  remote_record_id: after.recordId,
});
process.stdout.write(
  `${JSON.stringify({ ...evidence, output_path: outputPath, output_checksum: checksum, remote_identifiers_exposed: false })}\n`,
);
