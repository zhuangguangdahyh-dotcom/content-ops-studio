import { mkdir, realpath, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { resolveSafePath, rejectSymlinkEscape } from "../storage/index.js";
import { RuntimeFailure } from "../types.js";

export const PROJECT_HOME_DIRECTORIES = ["registry", "logs", "cache", "locks", "projects"];
export const PROJECT_DIRECTORIES = ["packs", "rules", "cache", "runs", "outputs"];
export const RUN_FILES = [
  "request.json",
  "plan.json",
  "manifest.json",
  "events.jsonl",
  "write-log.jsonl",
  "approvals.jsonl",
  "checkpoint.json",
  "artifacts.json",
  "errors.json",
  "result.json",
] as const;

export function resolveProjectHome(
  explicitHome?: string,
  environment: NodeJS.ProcessEnv = process.env,
): string {
  return path.resolve(
    explicitHome ?? environment.CONTENT_OPS_HOME ?? path.join(os.homedir(), "ContentOpsStudio"),
  );
}

export function validateProjectHome(home: string): string[] {
  const issues: string[] = [];
  if (!path.isAbsolute(home)) issues.push("HOME_NOT_ABSOLUTE");
  if (home.includes("\0")) issues.push("HOME_CONTAINS_NUL");
  if (path.resolve(home) === path.parse(path.resolve(home)).root) issues.push("HOME_TOO_BROAD");
  return issues;
}

export async function initializeProjectHome(home: string): Promise<void> {
  const issues = validateProjectHome(home);
  if (issues.length) throw new RuntimeFailure("PROJECT_HOME_INVALID", issues.join("; "), 5);
  await mkdir(home, { recursive: true, mode: 0o700 });
  for (const directory of PROJECT_HOME_DIRECTORIES)
    await mkdir(resolveSafePath(home, directory), { recursive: true, mode: 0o700 });
}

function safeProjectName(name: string): string {
  const normalized = name
    .normalize("NFKC")
    .replace(/[\\/:*?"<>|\u0000-\u001f]+/g, "-")
    .trim();
  if (!normalized || normalized === "." || normalized === "..")
    throw new RuntimeFailure("PROJECT_NAME_INVALID", "Project name is not path-safe.", 5);
  return normalized;
}

export function resolveProjectDirectory(home: string, name: string, projectId: string): string {
  return resolveSafePath(home, `projects/${safeProjectName(name)}__${projectId}`);
}

export function resolveRunDirectory(projectDirectory: string, runId: string): string {
  return resolveSafePath(projectDirectory, `runs/${runId}`);
}

export async function initializeProjectDirectory(
  home: string,
  name: string,
  projectId: string,
): Promise<string> {
  const directory = resolveProjectDirectory(home, name, projectId);
  await rejectSymlinkEscape(home, path.dirname(directory));
  await mkdir(directory, { recursive: true, mode: 0o700 });
  for (const child of PROJECT_DIRECTORIES)
    await mkdir(resolveSafePath(directory, child), { recursive: true, mode: 0o700 });
  return directory;
}

export async function validateExistingProjectHome(home: string): Promise<void> {
  await stat(home);
  const canonical = await realpath(home);
  if (canonical !== path.resolve(home))
    throw new RuntimeFailure("PROJECT_HOME_SYMLINK", "Project Home must not be a symlink.", 5);
}

export const ensurePathWithinHome = resolveSafePath;
export { rejectSymlinkEscape };
