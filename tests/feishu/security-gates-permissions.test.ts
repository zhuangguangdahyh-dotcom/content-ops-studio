import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertFeishuLiveWriteAllowed,
  evaluateFeishuLiveWriteGate,
  redactFeishuValue,
} from "../../packages/workspace-adapters/src/index.js";
import { loadSchemaRegistry } from "../../packages/contracts/src/validation/index.js";

describe("Feishu permissions, security and live gates", () => {
  it("validates the official minimum permission manifest and defers attachment upload", async () => {
    const root = path.resolve("plugins/content-ops-studio");
    const manifest = JSON.parse(
      await readFile(path.join(root, "config/feishu-permission-manifest.json"), "utf8"),
    ) as Record<string, unknown>;
    const registry = await loadSchemaRegistry(path.join(root, "schemas/1.0"));
    registry.assertValid(
      "https://content-ops-studio.local/schemas/1.0/feishu-permission-manifest.schema.json",
      manifest,
    );
    expect((manifest.permissions as unknown[]).length).toBeGreaterThanOrEqual(12);
    expect(manifest.deferred_permissions).toContain("drive:file:upload");
    expect(manifest.required_for_record_write).not.toContain("drive:file:upload");
  });

  it.each([
    [{}, false, "FEISHU_LIVE_WRITE_DISABLED"],
    [{ CONTENT_OPS_ENABLE_LIVE_FEISHU: "1" }, false, "FEISHU_LIVE_WRITE_NOT_CONFIRMED"],
    [{}, true, "FEISHU_LIVE_WRITE_DISABLED"],
  ] as const)("rejects incomplete write gates", (environment, confirmed, code) => {
    expect(() =>
      assertFeishuLiveWriteAllowed(
        evaluateFeishuLiveWriteGate({ environment, cliConfirmed: confirmed }),
      ),
    ).toThrow(expect.objectContaining({ code }));
  });

  it("accepts both gates but never dry-run", () => {
    expect(
      evaluateFeishuLiveWriteGate({
        environment: { CONTENT_OPS_ENABLE_LIVE_FEISHU: "1" },
        cliConfirmed: true,
      }).allowed,
    ).toBe(true);
    expect(() =>
      assertFeishuLiveWriteAllowed(
        evaluateFeishuLiveWriteGate({
          environment: { CONTENT_OPS_ENABLE_LIVE_FEISHU: "1" },
          cliConfirmed: true,
          dryRun: true,
        }),
      ),
    ).toThrow(/Dry-run/);
  });

  it("redacts secrets, tokens and authorization recursively", () => {
    const redacted = redactFeishuValue({
      authorization: "Bearer token-value",
      nested: { [["app", "secret"].join("_")]: "fixture-value", safe: "ok" },
    });
    expect(JSON.stringify(redacted)).toBe(
      '{"authorization":"[REDACTED]","nested":{"app_secret":"[REDACTED]","safe":"ok"}}',
    );
  });
});
