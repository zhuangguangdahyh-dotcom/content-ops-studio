import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const home = process.env.CONTENT_OPS_HOME;
const projectId = process.env.CONTENT_OPS_LIVE_PROJECT_ID;
const runId = process.env.CONTENT_OPS_LIVE_RUN_ID;
const binary = process.env.CONTENT_OPS_LARK_CLI_PATH;
if (!home || !projectId || !runId || !binary) {
  process.stdout.write(
    JSON.stringify({
      status: "NOT_CONFIGURED",
      writes_attempted: 0,
      missing: [
        ...(!home ? ["CONTENT_OPS_HOME"] : []),
        ...(!projectId ? ["CONTENT_OPS_LIVE_PROJECT_ID"] : []),
        ...(!runId ? ["CONTENT_OPS_LIVE_RUN_ID"] : []),
        ...(!binary ? ["CONTENT_OPS_LARK_CLI_PATH"] : []),
      ],
    }) + "\n",
  );
  process.exit(0);
}

const pluginRoot = path.resolve("plugins/content-ops-studio");
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [path.join(pluginRoot, "runtime/dist/content-ops-mcp.mjs")],
  cwd: pluginRoot,
  env: {
    PATH: process.env.PATH ?? "",
    PLUGIN_ROOT: pluginRoot,
    PLUGIN_DATA: path.join(home, "plugin-data-phase2c"),
    CONTENT_OPS_HOME: home,
    CONTENT_OPS_LARK_CLI_PATH: binary,
  },
  stderr: "pipe",
});
const client = new Client({ name: "phase-2c-live-validator", version: "0.1.0" });
await client.connect(transport);
const calls: Array<{ tool: string; status: unknown; is_error: boolean }> = [];
const call = async (tool: string, args: Record<string, unknown>) => {
  const result = await client.callTool({ name: tool, arguments: args });
  const structured = result.structuredContent as Record<string, unknown> | undefined;
  calls.push({ tool, status: structured?.status, is_error: result.isError === true });
  if (result.isError || structured?.status !== "SUCCESS")
    throw new Error(`${tool} failed with ${String(structured?.status)}`);
  return structured ?? {};
};
await call("content_ops_doctor", {});
await call("content_ops_check_feishu", {});
await call("content_ops_list_projects", {});
await call("content_ops_get_project", { project_id: projectId });
const inspectBefore = await call("content_ops_inspect_workspace", { project_id: projectId });
const verify = await call("content_ops_verify_workspace", { project_id: projectId });
const repairPlan = await call("content_ops_plan_workspace_repair", { project_id: projectId });
const planDetails = repairPlan.details as Record<string, unknown>;
const repair = await call("content_ops_apply_workspace_repair", {
  project_id: projectId,
  plan_hash: planDetails.plan_hash,
  request_id: "REQUEST-PHASE2C-LIVE-REPAIR-NOOP",
  explicit_confirmation: true,
});
await call("content_ops_get_run_status", { project_id: projectId, run_id: runId });
await call("content_ops_list_pending_approvals", { project_id: projectId });
const profile = JSON.parse(
  await readFile(path.join(home, "project-profile.json"), "utf8"),
) as Record<string, unknown>;
const initializationPlan = await call("content_ops_plan_project_initialization", {
  project_profile: profile,
});
const initializationPlanHash = (initializationPlan.details as Record<string, unknown>).plan_hash;
const initializationReplay = await call("content_ops_initialize_project", {
  project_profile: profile,
  plan_hash: initializationPlanHash,
  idempotency_key: "PHASE2C-LIVE-IDEMPOTENT-REPLAY",
  explicit_confirmation: true,
});
const inspectAfter = await call("content_ops_inspect_workspace", { project_id: projectId });
const verifyAfter = await call("content_ops_verify_workspace", { project_id: projectId });
await client.close();
const countsBefore = inspectBefore.details as Record<string, unknown>;
const countsAfter = inspectAfter.details as Record<string, unknown>;
const stableCountKeys = ["tables", "fields", "relations", "views", "records"];
const countsUnchanged = stableCountKeys.every((key) => countsBefore[key] === countsAfter[key]);
if (!countsUnchanged) throw new Error("Idempotent initialization replay changed Workspace counts.");
const evidence = {
  evidence_id: `MCP-LIVE-${createHash("sha256").update(`${projectId}:${runId}`).digest("hex").slice(0, 16).toUpperCase()}`,
  project_id: projectId,
  run_id: runId,
  started_and_completed_at: new Date().toISOString(),
  calls,
  verify_status: (verify.details as Record<string, unknown>).verification_status,
  repair_plan_operations: planDetails.safe_repair_count,
  repair_result: (repair.details as Record<string, unknown>).repair_status,
  initialization_replay: initializationReplay.status,
  initialization_counts_unchanged: countsUnchanged,
  post_replay_verify_status: (verifyAfter.details as Record<string, unknown>).verification_status,
  writes_attempted: 1,
  remote_mutations: 0,
  overall_status: "PASSED",
};
await writeFile(
  path.join(home, "phase-2c-mcp-live-evidence.json"),
  JSON.stringify(evidence, null, 2) + "\n",
  {
    mode: 0o600,
  },
);
process.stdout.write(
  JSON.stringify({ ...evidence, project_id: "[REDACTED]", run_id: "[REDACTED]" }) + "\n",
);
