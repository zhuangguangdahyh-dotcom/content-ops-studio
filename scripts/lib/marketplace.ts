import { readFile } from "node:fs/promises";
import path from "node:path";
import { isPathInside } from "./files.js";

interface MarketplaceEntry {
  name?: unknown;
  source?: { source?: unknown; path?: unknown };
  policy?: { installation?: unknown; authentication?: unknown };
  category?: unknown;
}

export async function validateMarketplace(
  repositoryRoot: string,
  marketplacePath: string,
): Promise<string[]> {
  const errors: string[] = [];
  let marketplace: { plugins?: unknown };
  try {
    marketplace = JSON.parse(await readFile(marketplacePath, "utf8")) as { plugins?: unknown };
  } catch {
    return ["Marketplace is missing or not valid JSON."];
  }
  if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0)
    return ["Marketplace requires at least one plugin entry."];
  for (const rawEntry of marketplace.plugins) {
    const entry = rawEntry as MarketplaceEntry;
    if (typeof entry.name !== "string") errors.push("Marketplace entry name is required.");
    if (entry.source?.source !== "local" || typeof entry.source.path !== "string") {
      errors.push("Marketplace local source and path are required.");
      continue;
    }
    if (!entry.source.path.startsWith("./"))
      errors.push(`Marketplace path must start with ./: ${entry.source.path}`);
    const resolved = path.resolve(repositoryRoot, entry.source.path);
    if (!isPathInside(repositoryRoot, resolved))
      errors.push(`Marketplace path escapes repository root: ${entry.source.path}`);
    try {
      await readFile(path.join(resolved, ".codex-plugin", "plugin.json"), "utf8");
    } catch {
      errors.push(`Marketplace path does not resolve to a Plugin: ${entry.source.path}`);
    }
    if (
      entry.policy?.installation !== "AVAILABLE" &&
      entry.policy?.installation !== "NOT_AVAILABLE" &&
      entry.policy?.installation !== "INSTALLED_BY_DEFAULT"
    )
      errors.push("Marketplace installation policy is invalid.");
    if (entry.policy?.authentication !== "ON_INSTALL" && entry.policy?.authentication !== "ON_USE")
      errors.push("Marketplace authentication policy is invalid.");
    if (typeof entry.category !== "string" || entry.category.length === 0)
      errors.push("Marketplace category is required.");
  }
  return errors;
}
