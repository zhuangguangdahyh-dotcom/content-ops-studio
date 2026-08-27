import { readFile } from "node:fs/promises";
import path from "node:path";
import { compilePainpointFeishuFields } from "../packages/core/src/research/index.js";
import { FeishuRecordCompiler } from "../packages/workspace-adapters/src/feishu/blueprint/index.js";
import { larkRecordValuesEquivalent } from "../packages/workspace-adapters/src/lark-cli/adapter.js";
import { LarkCliRunner } from "../packages/workspace-adapters/src/lark-cli/runner.js";
import { createMcpContext } from "../services/content-ops-mcp/src/context.js";

type JsonRecord = Record<string, unknown>;

const home = process.env.CONTENT_OPS_HOME;
const binary = process.env.CONTENT_OPS_LARK_CLI_PATH;
if (!home || !binary) {
  process.stdout.write(
    `${JSON.stringify({
      status: "NOT_CONFIGURED",
      missing: [
        ...(!home ? ["CONTENT_OPS_HOME"] : []),
        ...(!binary ? ["CONTENT_OPS_LARK_CLI_PATH"] : []),
      ],
    })}\n`,
  );
  process.exit(0);
}
const profile = JSON.parse(
  await readFile(path.join(home, "project-profile.json"), "utf8"),
) as JsonRecord;
const projectId = String(profile.project_id);
const runState = JSON.parse(
  await readFile(path.join(home, "phase-3a-research-live-run.json"), "utf8"),
) as JsonRecord;
const runId = String(runState.run_id);
const root = path.join(home, "projects", projectId, "runs", runId, "research");
const submittedPainpoints = JSON.parse(
  await readFile(path.join(root, "painpoint-candidates.json"), "utf8"),
) as Array<JsonRecord & { evidence_refs: string[] }>;
const reviewedBatch = JSON.parse(
  await readFile(path.join(root, "painpoint-batch.json"), "utf8"),
) as JsonRecord;
const painpoints = Array.isArray(reviewedBatch.painpoints)
  ? (reviewedBatch.painpoints as Array<JsonRecord & { evidence_refs: string[] }>)
  : submittedPainpoints;
const evidence = JSON.parse(
  await readFile(path.join(root, "evidence-records.json"), "utf8"),
) as Array<JsonRecord & { evidence_id: string }>;
const evidenceById = new Map(evidence.map((item) => [item.evidence_id, item]));
const context = createMcpContext({
  pluginRoot: path.resolve("plugins/content-ops-studio"),
  pluginData: path.join(home, "plugin-data-phase3a-inspect"),
  home,
  env: {
    PATH: process.env.PATH ?? "",
    CONTENT_OPS_HOME: home,
    CONTENT_OPS_LARK_CLI_PATH: binary,
  },
});
const workspace = await context.painpointWorkspace(projectId);
const provisioningState = JSON.parse(
  await readFile(
    path.join(home, "projects", projectId, "workspace", "provisioning-state.json"),
    "utf8",
  ),
) as JsonRecord;
const remote = provisioningState.remote_identifiers as JsonRecord;
const baseToken = String(remote.appToken);
const runner = new LarkCliRunner(binary);
const recordList = await runner.require<JsonRecord>({
  argv: [
    "base",
    "+record-list",
    "--base-token",
    baseToken,
    "--table-id",
    workspace.tableId,
    "--field-id",
    "痛点ID",
    "--field-id",
    "记录唯一键",
    "--limit",
    "200",
    "--as",
    "user",
    "--format",
    "json",
  ],
  operation: "LIST_RESEARCH_RECORDS",
});
const matrixRows = Array.isArray(recordList.data) ? recordList.data : null;
const objectRows = Array.isArray(recordList.records)
  ? recordList.records
  : Array.isArray(recordList.items)
    ? recordList.items
    : null;
const projectedRows = matrixRows ?? objectRows ?? [];
const blankProjectedCount = projectedRows.filter((row) => {
  if (Array.isArray(row)) return row.every((value) => value === null || value === "");
  if (!row || typeof row !== "object") return true;
  const fields = (row as JsonRecord).fields;
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) return true;
  return Object.values(fields as JsonRecord).every((value) => value === null || value === "");
}).length;
const compiler = new FeishuRecordCompiler();
const results: Array<JsonRecord> = [];

function shape(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value))
    return `array<${[...new Set(value.map((item) => shape(item)))].sort().join("|")}>`;
  if (typeof value === "object") return `object<${Object.keys(value).sort().join(",")}>`;
  return typeof value;
}

function safeScalar(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length === 1 && typeof value[0] === "string") return value[0];
  return null;
}

for (const painpoint of painpoints) {
  const uniqueKey = String(painpoint.record_unique_key);
  const row = await workspace.adapter.findRecordByUniqueKey(uniqueKey, {
    tableId: workspace.tableId,
    tableLogicalKey: "painpoints",
    uniqueFieldLogicalKey: "painpointsRecordUniqueKey",
  });
  if (!row) {
    results.push({ painpoint_id: painpoint.painpoint_id, found: false, mismatch_count: null });
    continue;
  }
  const selectedEvidence = painpoint.evidence_refs.flatMap((reference) => {
    const item = evidenceById.get(reference);
    return item ? [item] : [];
  });
  const logical = compilePainpointFeishuFields(painpoint as never, selectedEvidence as never);
  const expected = compiler.compile(
    logical,
    workspace.fieldMap,
    workspace.fieldMap[0]?.mappingVersion ?? 1,
    { allowUserManaged: true },
  );
  const mappingByName = new Map(
    workspace.fieldMap
      .filter((item) => item.tableLogicalKey === "painpoints")
      .map((item) => [item.currentFieldName, item]),
  );
  const reviewStatusMapping = workspace.fieldMap.find(
    (item) => item.logicalKey === "painpointsReviewStatus",
  );
  const updatedAtMapping = workspace.fieldMap.find(
    (item) => item.logicalKey === "painpointsUpdatedAt",
  );
  const mismatches = Object.entries(expected).flatMap(([name, value]) => {
    const mapping = mappingByName.get(name);
    const actual = row.fields[name];
    return larkRecordValuesEquivalent(mapping?.fieldType, actual, value)
      ? []
      : [
          {
            logical_key: mapping?.logicalKey ?? "UNMAPPED",
            field_type: mapping?.fieldType ?? null,
            expected_shape: shape(value),
            actual_shape: shape(actual),
            ...(mapping?.fieldType === 5 && typeof value === "string" && typeof actual === "string"
              ? {
                  expected_date_parseable: Number.isFinite(Date.parse(value)),
                  actual_date_parseable: Number.isFinite(Date.parse(actual)),
                  date_delta_seconds: Math.abs(Date.parse(value) - Date.parse(actual)) / 1000,
                }
              : {}),
          },
        ];
  });
  results.push({
    painpoint_id: painpoint.painpoint_id,
    found: true,
    current_review_status: reviewStatusMapping
      ? safeScalar(row.fields[reviewStatusMapping.currentFieldName])
      : null,
    current_updated_at: updatedAtMapping
      ? safeScalar(row.fields[updatedAtMapping.currentFieldName])
      : null,
    mismatch_count: mismatches.length,
    mismatches,
  });
}
process.stdout.write(
  `${JSON.stringify({
    status: "SUCCESS",
    project_id: "[REDACTED]",
    run_id: "[REDACTED]",
    found_count: results.filter((item) => item.found === true).length,
    remote_projected_record_count: projectedRows.length,
    remote_blank_projected_count: blankProjectedCount,
    results,
    remote_identifiers_exposed: false,
  })}\n`,
);
