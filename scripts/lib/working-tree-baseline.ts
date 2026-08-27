import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export const BASELINE_RELATIVE_PATH = "reports/baselines/phase-1b-working-tree-baseline.json";

export interface BaselineFile {
  relative_path: string;
  sha256: string;
  size: number;
  category: string;
}

export interface WorkingTreeBaseline {
  baseline_id: string;
  created_at: string;
  repository_root_label: string;
  source_phase: string;
  file_count: number;
  files: BaselineFile[];
  excluded_patterns: string[];
  aggregate_hash: string;
}

export interface BaselineDifference {
  added_files: string[];
  removed_files: string[];
  changed_files: string[];
  unchanged_files: string[];
  aggregate_hash_changed: boolean;
  baseline_aggregate_hash: string;
  current_aggregate_hash: string;
}

export const BASELINE_EXCLUDED_PATTERNS = [
  ".git/",
  "node_modules/",
  ".pnpm-store/",
  "coverage/",
  "dist/* except dist/README.md",
  "release/artifacts/",
  "release/staging/",
  "tmp/",
  ".cache/",
  "playwright-report/",
  "test-results/",
  ".env and .env.* except .env.example",
  "content-projects/",
  "user-projects/",
  "runtime-data/",
  "ContentOpsStudio/",
  ".DS_Store",
  "*.log",
  "plugins/content-ops-studio/runtime/dist/",
  "reports/baselines/",
  "reports/phase-2a-working-tree-change-report.md",
  "reports/phase-2a1-working-tree-change-report.md",
  "reports/phase-2b-working-tree-change-report.md",
  "reports/phase-2b2-working-tree-change-report.md",
  "reports/phase-2c-working-tree-change-report.md",
  "reports/phase-3a-working-tree-change-report.md",
  "reports/phase-3b-working-tree-change-report.md",
  "reports/phase-4a-working-tree-change-report.md",
  "reports/phase-4b-working-tree-change-report.md",
  "reports/phase-4b-r-working-tree-change-report.md",
  "reports/phase-4b-r1-working-tree-change-report.md",
  "reports/phase-4b-r2-working-tree-change-report.md",
  "reports/phase-4b-r21-working-tree-change-report.md",
  "reports/phase-4b-r22-working-tree-change-report.md",
  "reports/phase-4b-r23-working-tree-change-report.md",
  "reports/phase-4b-r24-working-tree-change-report.md",
  "reports/phase-4b-r25-working-tree-change-report.md",
  "reports/phase-4b-r26-working-tree-change-report.md",
  "reports/stage-11-working-tree-change-report.md",
] as const;

function isExcluded(relativePath: string): boolean {
  const first = relativePath.split("/")[0];
  if (relativePath.split("/").at(-1) === ".DS_Store" || relativePath.endsWith(".log")) return true;
  if (relativePath.startsWith("plugins/content-ops-studio/runtime/dist/")) return true;
  if (relativePath.startsWith("release/artifacts/") || relativePath.startsWith("release/staging/"))
    return true;
  if (
    [
      ".git",
      "node_modules",
      ".pnpm-store",
      "coverage",
      "tmp",
      ".cache",
      "playwright-report",
      "test-results",
      "content-projects",
      "user-projects",
      "runtime-data",
      "ContentOpsStudio",
    ].includes(first ?? "")
  )
    return true;
  if (relativePath.startsWith("reports/baselines/")) return true;
  if (relativePath === "reports/phase-2a-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-2a1-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-2b-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-2b2-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-2c-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-3a-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-3b-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-4a-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-4b-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-4b-r-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-4b-r1-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-4b-r2-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-4b-r21-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-4b-r22-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-4b-r23-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-4b-r24-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-4b-r25-working-tree-change-report.md") return true;
  if (relativePath === "reports/phase-4b-r26-working-tree-change-report.md") return true;
  if (relativePath === "reports/stage-11-working-tree-change-report.md") return true;
  if (relativePath.startsWith("dist/") && relativePath !== "dist/README.md") return true;
  if (
    (relativePath === ".env" || relativePath.startsWith(".env.")) &&
    relativePath !== ".env.example"
  )
    return true;
  return false;
}

function categoryFor(relativePath: string): string {
  if (relativePath.startsWith("plugins/content-ops-studio/schemas/")) return "schema";
  if (relativePath.startsWith("packages/contracts/src/generated/")) return "generated-type";
  if (relativePath.startsWith("tests/fixtures/")) return "fixture";
  if (relativePath.startsWith("tests/")) return "test";
  if (
    relativePath.startsWith("docs/") ||
    relativePath.startsWith("reports/") ||
    relativePath.endsWith("README.md")
  )
    return "documentation";
  if (relativePath.startsWith(".github/")) return "ci";
  if (relativePath.startsWith("plugins/")) return "plugin";
  if (
    relativePath.startsWith("packages/") ||
    relativePath.startsWith("services/") ||
    relativePath.startsWith("scripts/")
  )
    return "source";
  if (
    relativePath.endsWith(".json") ||
    relativePath.endsWith(".yml") ||
    relativePath.endsWith(".yaml") ||
    relativePath.endsWith(".mjs")
  )
    return "configuration";
  return "repository";
}

async function walk(root: string, directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute).split(path.sep).join("/");
    if (isExcluded(relative)) continue;
    if (entry.isDirectory()) files.push(...(await walk(root, absolute)));
    else if (entry.isFile()) files.push(relative);
  }
  return files;
}

export function calculateAggregateHash(files: BaselineFile[]): string {
  const canonical = [...files]
    .sort((left, right) => left.relative_path.localeCompare(right.relative_path, "en"))
    .map((file) => `${file.relative_path}\0${file.sha256}\0${file.size}\n`)
    .join("");
  return createHash("sha256").update(canonical).digest("hex");
}

export async function scanWorkingTree(root: string): Promise<BaselineFile[]> {
  const paths = (await walk(root, root)).sort((left, right) => left.localeCompare(right, "en"));
  return Promise.all(
    paths.map(async (relativePath) => {
      const absolute = path.join(root, relativePath);
      const [bytes, metadata] = await Promise.all([readFile(absolute), stat(absolute)]);
      return {
        relative_path: relativePath,
        sha256: createHash("sha256").update(bytes).digest("hex"),
        size: metadata.size,
        category: categoryFor(relativePath),
      };
    }),
  );
}

export async function readBaseline(root: string): Promise<WorkingTreeBaseline> {
  const value = JSON.parse(
    await readFile(path.join(root, BASELINE_RELATIVE_PATH), "utf8"),
  ) as WorkingTreeBaseline;
  if (value.repository_root_label !== "content-ops-studio")
    throw new Error("Baseline repository label is invalid.");
  if (value.file_count !== value.files.length)
    throw new Error("Baseline file_count does not match files.");
  if (calculateAggregateHash(value.files) !== value.aggregate_hash)
    throw new Error("Baseline aggregate hash is invalid.");
  if (value.files.some((file) => path.isAbsolute(file.relative_path)))
    throw new Error("Baseline contains an absolute path.");
  return value;
}

export async function createBaseline(root: string): Promise<WorkingTreeBaseline> {
  try {
    return await readBaseline(root);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const files = await scanWorkingTree(root);
  const baseline: WorkingTreeBaseline = {
    baseline_id: "BASELINE-PHASE-1B-WORKING-TREE-20260823",
    created_at: new Date().toISOString(),
    repository_root_label: "content-ops-studio",
    source_phase: "PHASE_1B",
    file_count: files.length,
    files,
    excluded_patterns: [...BASELINE_EXCLUDED_PATTERNS],
    aggregate_hash: calculateAggregateHash(files),
  };
  const output = path.join(root, BASELINE_RELATIVE_PATH);
  await mkdir(path.dirname(output), { recursive: true, mode: 0o700 });
  await writeFile(output, `${JSON.stringify(baseline, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
    mode: 0o644,
  });
  return baseline;
}

export async function compareWithBaseline(root: string): Promise<BaselineDifference> {
  const [baseline, current] = await Promise.all([readBaseline(root), scanWorkingTree(root)]);
  const baselineMap = new Map(baseline.files.map((file) => [file.relative_path, file]));
  const currentMap = new Map(current.map((file) => [file.relative_path, file]));
  const addedFiles = [...currentMap.keys()].filter((file) => !baselineMap.has(file)).sort();
  const removedFiles = [...baselineMap.keys()].filter((file) => !currentMap.has(file)).sort();
  const changedFiles: string[] = [];
  const unchangedFiles: string[] = [];
  for (const [relativePath, original] of baselineMap) {
    const present = currentMap.get(relativePath);
    if (!present) continue;
    if (present.sha256 === original.sha256 && present.size === original.size)
      unchangedFiles.push(relativePath);
    else changedFiles.push(relativePath);
  }
  const currentHash = calculateAggregateHash(current);
  return {
    added_files: addedFiles,
    removed_files: removedFiles,
    changed_files: changedFiles.sort(),
    unchanged_files: unchangedFiles.sort(),
    aggregate_hash_changed: currentHash !== baseline.aggregate_hash,
    baseline_aggregate_hash: baseline.aggregate_hash,
    current_aggregate_hash: currentHash,
  };
}
