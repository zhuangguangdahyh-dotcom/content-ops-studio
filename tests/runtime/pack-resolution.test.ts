import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadSchemaRegistry } from "../../packages/contracts/src/validation/index.js";
import {
  detectPackVersionDrift,
  loadIndustryPack,
  loadPlatformPack,
  resolvePacks,
} from "../../packages/runtime/src/packs/index.js";

const pluginRoot = path.resolve("plugins/content-ops-studio");

describe("Pack loading and resolution", () => {
  it("loads normalized scaffold Packs and enforces the priority and safety override", async () => {
    const schemas = await loadSchemaRegistry(path.join(pluginRoot, "schemas/1.0"));
    const platform = await loadPlatformPack(pluginRoot, "xiaohongshu", "1.0.0", schemas);
    const currentPlatform = await loadPlatformPack(pluginRoot, "xiaohongshu", "1.1.0", schemas);
    const industry = await loadIndustryPack(pluginRoot, "generic", "1.0.0", schemas);
    const resolved = resolvePacks(
      {
        resolutionId: "PRES-RUN-20990101-000000-P001",
        projectId: "PRJ-20990101-P001",
        runId: "RUN-20990101-000000-P001",
        resolvedAt: "2099-01-01T00:00:00.000Z",
        platform,
        industry,
        pluginDefaults: { default_page_count: 4, allow_external_network: false },
        projectRules: { default_page_count: 7 },
        runOverrides: { default_page_count: 8, allow_external_network: true },
      },
      schemas,
    );
    expect(resolved.warnings.filter((warning) => warning.code === "SCAFFOLD_PACK")).toHaveLength(2);
    expect(resolved.resolved_values.default_page_count).toBe(8);
    expect(resolved.resolved_values.allow_external_network).toBe(false);
    expect(resolved.conflicts[0]?.code).toBe("SAFETY_OVERRIDE_REJECTED");
    expect(detectPackVersionDrift(resolved.platform_pack, platform)).toEqual([]);
    expect(platform.extensions.source_directory).toContain("versions/1.0.0");
    expect(currentPlatform.extensions.source_directory).toBe("packs/platforms/xiaohongshu");
    const mutated = { ...platform, rules: [...platform.rules, "Changed after snapshot."] };
    expect(detectPackVersionDrift(resolved.platform_pack, mutated)).toContain("PACK_CONTENT_DRIFT");
  });

  it("rejects missing and version-mismatched Packs", async () => {
    const schemas = await loadSchemaRegistry(path.join(pluginRoot, "schemas/1.0"));
    await expect(loadPlatformPack(pluginRoot, "missing", "1.0.0", schemas)).rejects.toMatchObject({
      code: "PACK_NOT_FOUND",
    });
    await expect(loadIndustryPack(pluginRoot, "generic", "9.9.9", schemas)).rejects.toMatchObject({
      code: "PACK_VERSION_MISMATCH",
    });
  });
});
