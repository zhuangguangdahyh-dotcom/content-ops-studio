import { readFile } from "node:fs/promises";
import path from "node:path";
import type { RuntimeEvidence } from "../packages/contracts/src/generated/1.0/index.js";
import { loadSchemaRegistry } from "../packages/contracts/src/validation/index.js";
import {
  assertRuntimeEvidence,
  assertRuntimeSupported,
  loadRuntimeSupportPolicy,
  parseRuntimeVersion,
} from "../packages/runtime/src/runtime-policy/index.js";
import { RuntimeFailure } from "../packages/runtime/src/types.js";

const root = path.resolve(process.cwd());
const evidenceFile = path.join(root, "reports/verification/runtime-evidence-node24.json");
try {
  const [policy, registry, raw] = await Promise.all([
    loadRuntimeSupportPolicy(
      path.join(root, "plugins/content-ops-studio/config/runtime-support-policy.json"),
    ),
    loadSchemaRegistry(path.join(root, "plugins/content-ops-studio/schemas/1.0")),
    readFile(evidenceFile, "utf8"),
  ]);
  const evidence = JSON.parse(raw) as RuntimeEvidence;
  registry.assertValid(
    "https://content-ops-studio.local/schemas/1.0/runtime-evidence.schema.json",
    evidence,
  );
  assertRuntimeEvidence(evidence, policy);
  const current = parseRuntimeVersion(process.version);
  assertRuntimeSupported(policy, current.version);
  if (evidence.execution_status !== "PASSED")
    throw new RuntimeFailure(
      "RUNTIME_EVIDENCE_MISSING",
      "Current Runtime evidence did not pass.",
      2,
    );
  console.log(
    JSON.stringify({
      status: "PASSED",
      evidence_id: evidence.evidence_id,
      runtime_version: evidence.runtime_version,
      current_runtime_version: current.version,
      command_count: evidence.command_results.length,
    }),
  );
} catch (error) {
  const code =
    (error as NodeJS.ErrnoException).code === "ENOENT"
      ? "RUNTIME_EVIDENCE_MISSING"
      : error instanceof RuntimeFailure
        ? error.code
        : "RUNTIME_EVIDENCE_MISSING";
  console.error(JSON.stringify({ status: "FAILED", code, message: (error as Error).message }));
  process.exitCode = 1;
}
