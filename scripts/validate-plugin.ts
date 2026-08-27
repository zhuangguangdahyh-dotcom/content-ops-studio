import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseSkillFrontmatter } from "../packages/contracts/src/index.js";
import { isPathInside, listFiles } from "./lib/files.js";
import { validateMarketplace } from "./lib/marketplace.js";

export const EXPECTED_SKILLS = [
  "content-studio-router",
  "project-initialization",
  "painpoint-research",
  "content-creation",
  "visual-planning",
  "image-set-production",
  "content-finalization",
  "project-learning",
] as const;

export interface PluginValidationResult {
  ok: boolean;
  errors: string[];
  skillNames: string[];
}

async function exists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export async function validatePlugin(pluginRoot: string): Promise<PluginValidationResult> {
  const errors: string[] = [];
  const skillNames: string[] = [];
  const root = path.resolve(pluginRoot);
  if (!(await exists(root)))
    return { ok: false, errors: ["Plugin directory is missing."], skillNames };

  const manifestPath = path.join(root, ".codex-plugin", "plugin.json");
  if (!(await exists(manifestPath)))
    return { ok: false, errors: [".codex-plugin/plugin.json is missing."], skillNames };

  let manifest: Record<string, unknown>;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Record<string, unknown>;
  } catch {
    return { ok: false, errors: ["Plugin manifest is not valid JSON."], skillNames };
  }
  if (manifest.name !== "content-ops-studio")
    errors.push("Manifest name must be content-ops-studio.");
  if (typeof manifest.version !== "string" || !/^\d+\.\d+\.\d+$/.test(manifest.version))
    errors.push("Manifest version must be strict SemVer.");
  if (typeof manifest.description !== "string" || manifest.description.length === 0)
    errors.push("Manifest description is required.");
  if (typeof manifest.skills !== "string") errors.push("Manifest skills path is required.");
  if (manifest.mcpServers !== "./.mcp.json")
    errors.push("Manifest mcpServers must point to ./.mcp.json.");

  const skillsPath =
    typeof manifest.skills === "string"
      ? path.resolve(root, manifest.skills)
      : path.join(root, "skills");
  if (!isPathInside(root, skillsPath)) errors.push("Manifest skills path escapes the Plugin root.");
  if (!(await exists(skillsPath))) errors.push("Manifest skills path does not exist.");

  const mcpConfigPath = path.resolve(
    root,
    typeof manifest.mcpServers === "string" ? manifest.mcpServers : "",
  );
  if (!isPathInside(root, mcpConfigPath)) errors.push("Manifest MCP path escapes the Plugin root.");
  if (!(await exists(mcpConfigPath))) errors.push("Manifest MCP path does not exist.");

  for (const expected of EXPECTED_SKILLS) {
    const skillFile = path.join(skillsPath, expected, "SKILL.md");
    if (!(await exists(skillFile))) {
      errors.push(`Missing Skill: ${expected}.`);
      continue;
    }
    try {
      const frontmatter = parseSkillFrontmatter(await readFile(skillFile, "utf8"));
      skillNames.push(frontmatter.name);
      if (frontmatter.name !== expected) errors.push(`Skill folder/name mismatch: ${expected}.`);
    } catch (error) {
      errors.push(`${expected}: ${error instanceof Error ? error.message : "invalid frontmatter"}`);
    }
  }
  if (skillNames.length === 0) errors.push("At least one Skill is required.");
  if (new Set(skillNames).size !== skillNames.length) errors.push("Skill names must be unique.");

  for (const file of await listFiles(root)) {
    const relative = path.relative(root, file).replaceAll(path.sep, "/");
    if (relative.endsWith("/.app.json") || relative === ".app.json")
      errors.push("Forbidden .app.json exists.");
    if (relative === "hooks/hooks.json" || relative === "hooks.json")
      errors.push("Forbidden Hooks configuration exists.");
  }
  return { ok: errors.length === 0, errors, skillNames };
}

async function main(): Promise<void> {
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const result = await validatePlugin(path.join(repositoryRoot, "plugins", "content-ops-studio"));
  const marketplaceErrors = await validateMarketplace(
    repositoryRoot,
    path.join(repositoryRoot, ".agents", "plugins", "marketplace.json"),
  );
  const errors = [...result.errors, ...marketplaceErrors];
  if (errors.length > 0) {
    for (const error of errors) console.error(`BLOCKING: ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Plugin and marketplace validation passed: ${result.skillNames.length} Skills validated.`,
  );
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) await main();
