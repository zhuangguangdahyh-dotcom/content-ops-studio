import { cp, mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertActionAllowed,
  assertSchemaVersion,
  type ProductionState,
} from "../../packages/core/src/index.js";
import { validateMarketplace } from "../../scripts/lib/marketplace.js";
import { scanText } from "../../scripts/scan-secrets.js";
import { validatePlugin } from "../../scripts/validate-plugin.js";

const blockedState: ProductionState = {
  copy: "COPY_PENDING_APPROVAL",
  firstPage: "FIRST_PAGE_NOT_SUBMITTED",
  images: "IMAGE_NOT_GENERATED",
  qaPassed: false,
  finalApproval: "FINAL_NOT_SUBMITTED",
};

describe("failure injection", () => {
  it("detects a missing manifest", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "content-ops-missing-manifest-"));
    await mkdir(path.join(root, "skills"));
    await expect(validatePlugin(root)).resolves.toMatchObject({
      ok: false,
      errors: [".codex-plugin/plugin.json is missing."],
    });
  });

  it("detects a Skill missing description", async () => {
    const temp = await mkdtemp(path.join(os.tmpdir(), "content-ops-skill-"));
    const plugin = path.join(temp, "content-ops-studio");
    await cp(path.resolve("plugins/content-ops-studio"), plugin, { recursive: true });
    const skillPath = path.join(plugin, "skills", "content-studio-router", "SKILL.md");
    const skill = await readFile(skillPath, "utf8");
    await writeFile(skillPath, skill.replace(/^description:.*$/m, "description:"), "utf8");
    const result = await validatePlugin(plugin);
    expect(result.errors.some((error) => error.includes("requires name and description"))).toBe(
      true,
    );
  });

  it("detects a marketplace pointing to a missing Plugin", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "content-ops-marketplace-"));
    const marketplace = path.join(root, "marketplace.json");
    await writeFile(
      marketplace,
      JSON.stringify({
        plugins: [
          {
            name: "missing",
            source: { source: "local", path: "./plugins/missing" },
            policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
            category: "Productivity",
          },
        ],
      }),
      "utf8",
    );
    expect(
      (await validateMarketplace(root, marketplace)).some((error) =>
        error.includes("does not resolve"),
      ),
    ).toBe(true);
  });

  it("detects illegal state transitions", () => {
    expect(() => assertActionAllowed(blockedState, "GENERATE_REMAINING_PAGES")).toThrow(
      /INVALID_STATE/,
    );
  });

  it("detects secret patterns without returning the matched value", () => {
    const findings = scanText("client_" + "secret=examplevalue123456", "fixture.txt");
    expect(findings).toEqual([
      { file: "fixture.txt", type: "client-secret-value", blocking: true },
    ]);
  });

  it("detects Schema version mismatch", () => {
    expect(() => assertSchemaVersion("2.0.0")).toThrow(/SCHEMA_MISMATCH/);
  });
});
