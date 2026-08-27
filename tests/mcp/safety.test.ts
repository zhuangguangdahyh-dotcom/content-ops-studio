import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createMcpContext } from "../../services/content-ops-mcp/src/context.js";
import { errorEnvelope, redactMessage } from "../../services/content-ops-mcp/src/errors.js";
import { TOOL_NAMES } from "../../services/content-ops-mcp/src/tool-registry.js";

describe("Phase 3A MCP safety", () => {
  it("has no generic, shell, raw, delete or credential tool", () => {
    expect(TOOL_NAMES.join(" ")).not.toMatch(
      /shell|exec|command|raw|delete|token|keychain|secret|set_content_ops_home|web_fetch|browser|search_web/,
    );
  });

  it("keeps default Home in Plugin Data and outside Plugin Root", async () => {
    const data = await mkdtemp(path.join(os.tmpdir(), "content-ops-mcp-data-"));
    const context = createMcpContext({
      pluginRoot: path.resolve("plugins/content-ops-studio"),
      pluginData: data,
      env: {},
    });
    expect(context.home.startsWith(data)).toBe(true);
    expect(context.home.startsWith(context.pluginRoot)).toBe(false);
  });

  it("rejects Home inside immutable Plugin Root", () => {
    const pluginRoot = path.resolve("plugins/content-ops-studio");
    expect(() =>
      createMcpContext({
        pluginRoot,
        pluginData: path.resolve("/tmp/plugin-data"),
        home: pluginRoot,
      }),
    ).toThrow(/outside immutable Plugin Root/);
  });

  it("redacts credential-shaped diagnostics and maps a structured error", () => {
    const redacted = redactMessage("authorization=Bearer-abc secret=my-secret token=tok_123");
    expect(redacted).not.toContain("Bearer-abc");
    expect(redacted).not.toContain("my-secret");
    expect(redacted).not.toContain("tok_123");
    const mapped = errorEnvelope(
      Object.assign(new Error("blocked"), { code: "CAPABILITY_BLOCKED" }),
    );
    expect(mapped.status).toBe("BLOCKED");
    expect(mapped.errors[0]?.code).toBe("CAPABILITY_BLOCKED");
  });
});
