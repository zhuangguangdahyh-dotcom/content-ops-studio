import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const required = [
  "AGENTS.md",
  "PLANS.md",
  "README.md",
  "CHANGELOG.md",
  "SECURITY.md",
  "PRIVACY.md",
  "CONTRIBUTING.md",
  "LICENSE-DECISION.md",
  "docs/00-product-definition.md",
  "docs/01-system-architecture.md",
  "docs/02-data-model.md",
  "docs/03-state-machines.md",
  "docs/04-skill-contracts.md",
  "docs/05-repository-architecture.md",
  "docs/06-feishu-workspace-adapter.md",
  "docs/07-image-production-pipeline.md",
  "docs/08-security-and-privacy.md",
  "docs/09-testing-and-evals.md",
  "docs/10-installation.md",
  "docs/11-release-and-distribution.md",
  "docs/12-roadmap.md",
  "docs/decisions/ADR-0001-plugin-boundary.md",
  "docs/decisions/ADR-0002-typescript-runtime.md",
  "docs/decisions/ADR-0003-schema-contracts.md",
  "docs/decisions/ADR-0004-no-hooks-in-v1.md",
  "docs/decisions/ADR-0005-adapter-boundaries.md",
  "docs/decisions/ADR-0006-project-data-location.md",
  ".agents/plugins/marketplace.json",
  "plugins/content-ops-studio/.codex-plugin/plugin.json",
  "plugins/content-ops-studio/AGENTS.md",
  "plugins/content-ops-studio/references/shared-execution-protocol.md",
  "plugins/content-ops-studio/references/shared-state-machine.md",
  "plugins/content-ops-studio/references/field-ownership.md",
  "plugins/content-ops-studio/references/approval-protocol.md",
  "plugins/content-ops-studio/references/error-codes.md",
  "plugins/content-ops-studio/references/rule-priority.md",
  "plugins/content-ops-studio/schemas/1.0/common-definitions.schema.json",
  "plugins/content-ops-studio/schemas/1.0/task-envelope.schema.json",
  "plugins/content-ops-studio/schemas/1.0/task-result.schema.json",
  "plugins/content-ops-studio/schemas/1.0/error.schema.json",
  "plugins/content-ops-studio/schemas/1.0/approval-event.schema.json",
  "plugins/content-ops-studio/schemas/1.0/run-manifest.schema.json",
  "plugins/content-ops-studio/packs/platforms/xiaohongshu/pack.json",
  "plugins/content-ops-studio/packs/industries/generic/pack.json",
  "plugins/content-ops-studio/packs/industries/commercial-interior/pack.json",
  "examples/generic-service-project/README.md",
  "examples/generic-service-project/project-profile.example.json",
  "examples/commercial-interior-project/README.md",
  "examples/commercial-interior-project/project-profile.example.json",
  "reports/bootstrap-report.md",
  "reports/architecture-diff-report.md",
] as const;

async function exists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export async function verifyBootstrap(repositoryRoot: string): Promise<string[]> {
  const errors: string[] = [];
  for (const relative of required) {
    const absolute = path.join(repositoryRoot, relative);
    if (!(await exists(absolute))) {
      errors.push(`Missing required path: ${relative}`);
      continue;
    }
    if (path.extname(relative) === ".md" && (await readFile(absolute, "utf8")).trim().length < 20)
      errors.push(`Required document is empty: ${relative}`);
  }
  const packages = [
    "contracts",
    "core",
    "cli",
    "renderer",
    "workspace-adapters",
    "research-adapters",
    "image-adapters",
    "test-support",
  ];
  for (const packageName of packages) {
    for (const file of ["package.json", "tsconfig.json", "README.md", "src/index.ts"]) {
      if (!(await exists(path.join(repositoryRoot, "packages", packageName, file))))
        errors.push(`Missing package file: packages/${packageName}/${file}`);
    }
  }
  return errors;
}

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = await verifyBootstrap(repositoryRoot);
if (errors.length > 0) {
  for (const error of errors) console.error(`BLOCKING: ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Bootstrap verification passed: ${required.length} required paths plus package skeletons.`,
  );
}
