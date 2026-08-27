import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import {
  EXPECTED_NODE_MAJOR,
  EXPECTED_NODE_RANGE,
  loadRuntimeSupportPolicy,
} from "../packages/runtime/src/runtime-policy/index.js";

const root = path.resolve(process.cwd());
const read = (relative: string) => readFile(path.join(root, relative), "utf8");
const issues: string[] = [];
const packageJson = JSON.parse(await read("package.json")) as {
  version?: string;
  engines?: { node?: string };
  scripts?: Record<string, string>;
};
const policy = await loadRuntimeSupportPolicy(
  path.join(root, "plugins/content-ops-studio/config/runtime-support-policy.json"),
);

if (packageJson.engines?.node !== EXPECTED_NODE_RANGE) issues.push("PACKAGE_ENGINE_MISMATCH");
if ((await read(".node-version")).trim() !== String(EXPECTED_NODE_MAJOR))
  issues.push("NODE_VERSION_FILE_MISMATCH");
if ((await read(".nvmrc")).trim() !== String(EXPECTED_NODE_MAJOR)) issues.push("NVMRC_MISMATCH");
if (packageJson.version !== policy.pluginVersion) issues.push("POLICY_PLUGIN_VERSION_MISMATCH");
if (packageJson.scripts?.["node20:probe"]) issues.push("OBSOLETE_NODE20_COMMAND_PRESENT");
for (const required of [
  "runtime-policy:validate",
  "runtime-evidence:collect",
  "runtime-evidence:validate",
])
  if (!packageJson.scripts?.[required]) issues.push(`SCRIPT_MISSING:${required}`);

for (const directory of await readdir(path.join(root, "packages"), { withFileTypes: true })) {
  if (!directory.isDirectory()) continue;
  try {
    const manifest = JSON.parse(await read(`packages/${directory.name}/package.json`)) as {
      engines?: { node?: string };
    };
    if (manifest.engines?.node && manifest.engines.node !== EXPECTED_NODE_RANGE)
      issues.push(`WORKSPACE_ENGINE_MISMATCH:${directory.name}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

const workflowNames = await readdir(path.join(root, ".github/workflows"));
for (const workflowName of workflowNames.filter((name) => name.endsWith(".yml"))) {
  const workflow = await read(`.github/workflows/${workflowName}`);
  if (/node-version:\s*(?:20|22|25|26|latest|current|node|\*)\b/i.test(workflow))
    issues.push(`CI_RUNTIME_DRIFT:${workflowName}`);
  if (!/node-version:[^\n]*(?:24|matrix\.node-version)/.test(workflow))
    issues.push(`CI_NODE24_MISSING:${workflowName}`);
  if (!workflow.includes("actions/checkout@v7"))
    issues.push(`CHECKOUT_VERSION_DRIFT:${workflowName}`);
  if (!workflow.includes("actions/setup-node@v7"))
    issues.push(`SETUP_NODE_VERSION_DRIFT:${workflowName}`);
}
const ci = await read(".github/workflows/ci.yml");
if (!ci.includes("os: [ubuntu-latest, macos-latest]")) issues.push("CI_OS_MATRIX_MISMATCH");
if (!ci.includes("node-version: [24]")) issues.push("CI_NODE_MATRIX_MISMATCH");

const currentPolicyDocs = [
  "README.md",
  "docs/09-testing-and-evals.md",
  "docs/10-installation.md",
  "docs/11-release-and-distribution.md",
  "packages/runtime/README.md",
  "packages/cli/README.md",
];
for (const document of currentPolicyDocs) {
  const content = await read(document);
  if (!content.includes(EXPECTED_NODE_RANGE)) issues.push(`DOCUMENT_RANGE_MISSING:${document}`);
}

try {
  await access(path.join(root, "scripts/probe-node20-evidence.ts"));
  issues.push("OBSOLETE_NODE20_PROBE_PRESENT");
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}

if (issues.length) {
  console.error(JSON.stringify({ status: "FAILED", code: "RUNTIME_VERSION_MISMATCH", issues }));
  process.exitCode = 1;
} else {
  console.log(
    JSON.stringify({
      status: "PASSED",
      runtime: "node",
      major: EXPECTED_NODE_MAJOR,
      range: EXPECTED_NODE_RANGE,
      workflows: workflowNames.filter((name) => name.endsWith(".yml")).length,
    }),
  );
}
