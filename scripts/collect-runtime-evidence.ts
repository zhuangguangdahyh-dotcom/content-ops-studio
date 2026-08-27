import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { RuntimeEvidence } from "../packages/contracts/src/generated/1.0/index.js";
import {
  assertRuntimeSupported,
  loadRuntimeSupportPolicy,
  parseRuntimeVersion,
} from "../packages/runtime/src/runtime-policy/index.js";

const root = path.resolve(process.cwd());
const reportPath = "reports/verification/runtime-evidence-node24.json";
const outputFile = path.join(root, reportPath);
const policy = await loadRuntimeSupportPolicy(
  path.join(root, "plugins/content-ops-studio/config/runtime-support-policy.json"),
);
const runtime = parseRuntimeVersion(process.version);
const evaluation = assertRuntimeSupported(policy, runtime.version);
const pnpmVersionResult = spawnSync("pnpm", ["--version"], { cwd: root, encoding: "utf8" });
if (pnpmVersionResult.status !== 0) throw new Error("pnpm version could not be determined.");
const packageManagerVersion = String(pnpmVersionResult.stdout).trim();
const startedAt = new Date().toISOString();
const commandResults = policy.requiredEvidenceCommands.map((command) => {
  const [binary, ...args] = command.split(" ");
  const result = spawnSync(binary ?? "pnpm", args, {
    cwd: root,
    encoding: "utf8",
    timeout: 180_000,
    env: { ...process.env, CI: "true" },
  });
  return {
    command,
    status: result.status === 0 ? ("PASSED" as const) : ("FAILED" as const),
    exit_code: result.status ?? 1,
  };
});
const passed = commandResults.every((result) => result.status === "PASSED");
const evidence: RuntimeEvidence = {
  evidence_id: "RTE-NODE24-LOCAL-20260824",
  runtime_name: "node",
  runtime_version: runtime.version,
  runtime_major: runtime.major,
  runtime_range: policy.primaryRuntime.range,
  support_policy_status: evaluation.status,
  policy_reason_code: evaluation.reasonCode,
  execution_status: passed ? "PASSED" : "FAILED",
  commands: [...policy.requiredEvidenceCommands],
  command_results: commandResults,
  environment: {
    package_manager: "pnpm",
    package_manager_version: packageManagerVersion,
    ci: false,
  },
  platform: process.platform,
  architecture: process.arch,
  started_at: startedAt,
  completed_at: new Date().toISOString(),
  evidence_source: "LOCAL",
  report_path: reportPath,
  limitations: [
    "Local execution evidence only.",
    "No remote or cross-platform CI execution is claimed.",
    "Production integrations are outside Runtime compatibility evidence.",
  ],
  schema_version: "1.0.0",
  extensions: {},
};
await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(evidence, null, 2)}\n`, { mode: 0o644 });
console.log(
  JSON.stringify({
    status: evidence.execution_status,
    runtime_version: evidence.runtime_version,
    commands: evidence.command_results,
    report_path: reportPath,
  }),
);
if (!passed) process.exitCode = 1;
