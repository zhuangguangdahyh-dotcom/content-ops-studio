import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseSkillFrontmatter } from "../../packages/contracts/src/index.js";
import { validateMarketplace } from "../../scripts/lib/marketplace.js";
import { EXPECTED_SKILLS, validatePlugin } from "../../scripts/validate-plugin.js";

const root = path.resolve(".");
const pluginRoot = path.join(root, "plugins", "content-ops-studio");

describe("Plugin contract", () => {
  it("validates the manifest, bundled MCP path, forbidden files, and eight Skills", async () => {
    const result = await validatePlugin(pluginRoot);
    expect(result.errors).toEqual([]);
    expect(result.skillNames).toHaveLength(8);
  });

  it("resolves the repo marketplace path", async () => {
    await expect(
      validateMarketplace(root, path.join(root, ".agents", "plugins", "marketplace.json")),
    ).resolves.toEqual([]);
  });

  it("has unique folder-matching Skill frontmatter", async () => {
    const names: string[] = [];
    for (const folder of EXPECTED_SKILLS) {
      const frontmatter = parseSkillFrontmatter(
        await readFile(path.join(pluginRoot, "skills", folder, "SKILL.md"), "utf8"),
      );
      expect(frontmatter.name).toBe(folder);
      expect(frontmatter.description.length).toBeGreaterThan(20);
      names.push(frontmatter.name);
    }
    expect(new Set(names).size).toBe(names.length);
  });
});
