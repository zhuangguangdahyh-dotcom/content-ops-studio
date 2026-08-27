import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

async function pack(name: string): Promise<Record<string, unknown>> {
  return JSON.parse(
    await readFile(`plugins/content-ops-studio/packs/visual-industries/${name}/pack.json`, "utf8"),
  ) as Record<string, unknown>;
}

describe("commercial-space visual baseline isolation", () => {
  it("keeps the Songti preference out of every Industry Pack", async () => {
    for (const name of [
      "generic",
      "professional-services",
      "personal-ip-creator",
      "medical-aesthetics-health",
      "product-consumer",
      "commercial-space-hospitality",
    ]) {
      expect(JSON.stringify(await pack(name))).not.toMatch(/Songti|宋体/u);
    }
  });

  it("marks commercial-only rules as excluded rather than active universal rules", async () => {
    const universal = JSON.parse(
      await readFile("plugins/content-ops-studio/config/universal-visual-default-v1.json", "utf8"),
    ) as { industry_specific_rules_excluded: string[] };
    expect(universal.industry_specific_rules_excluded).toEqual(
      expect.arrayContaining(["200_SQUARE_METERS", "NO_PEOPLE", "MITUNDAO_BRAND_SIGNATURE"]),
    );
  });

  it("keeps mature spatial identity constraints in the commercial Pack and overlay", async () => {
    const commercial = await pack("commercial-space-hospitality");
    const overlay = JSON.parse(
      await readFile(
        "plugins/content-ops-studio/packs/visual-overlays/space-identity.json",
        "utf8",
      ),
    ) as Record<string, unknown>;
    const commercialText = JSON.stringify(commercial);
    const overlayText = JSON.stringify(overlay);
    expect(commercial.pack_version).toBe("1.1.0");
    expect(commercialText).toContain("spatial DNA");
    expect(commercialText).toContain("Unauthorized design change");
    expect(commercialText).toContain("First-page approval");
    expect(overlay.overlay_version).toBe("1.1.0");
    expect(overlayText).toContain("Door, window, furniture or circulation identity drift");
    expect(overlayText).toContain("Real-photography feel");
  });

  it("does not leak commercial-space aesthetics into unrelated Industry Packs", async () => {
    for (const name of [
      "generic",
      "professional-services",
      "personal-ip-creator",
      "medical-aesthetics-health",
      "product-consumer",
    ]) {
      const unrelated = JSON.stringify(await pack(name));
      expect(unrelated).not.toContain("spatial DNA");
      expect(unrelated).not.toContain("fixed space background");
      expect(unrelated).not.toContain("fixed photography style");
    }
  });
});
