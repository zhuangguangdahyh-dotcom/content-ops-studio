import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createMcpContext } from "../../services/content-ops-mcp/src/context.js";
import { TOOL_DEFINITIONS } from "../../services/content-ops-mcp/src/tool-registry.js";
import { createFinalizationE2eFixture } from "./fixture.js";

function tool(name: string) {
  const found = TOOL_DEFINITIONS.find((definition) => definition.name === name);
  if (!found) throw new Error(`Missing tool ${name}.`);
  return found;
}

describe("Finalization MCP tools", () => {
  it("exposes clear read/write boundaries and rejects credential-style extra input", () => {
    expect(tool("content_ops_plan_finalization").annotations).toMatchObject({
      readOnlyHint: true,
      openWorldHint: false,
    });
    expect(tool("content_ops_finalize_delivery").annotations).toMatchObject({
      readOnlyHint: false,
      openWorldHint: false,
    });
    expect(tool("content_ops_get_finalization_status").annotations.readOnlyHint).toBe(true);
    expect(tool("content_ops_verify_final_delivery").annotations.readOnlyHint).toBe(true);
    expect(
      tool("content_ops_finalize_delivery").inputSchema.safeParse({
        [["app_", "secret"].join("")]: "forbidden",
      }).success,
    ).toBe(false);
  });

  it("plans, finalizes, verifies and replays the isolated fixture through installed tool wiring", async () => {
    const home = await mkdtemp(path.join(os.tmpdir(), "final-mcp-home-"));
    const pluginData = await mkdtemp(path.join(os.tmpdir(), "final-mcp-data-"));
    const context = createMcpContext({
      pluginRoot: path.resolve("plugins/content-ops-studio"),
      pluginData,
      home,
      env: {},
    });
    const fixture = await createFinalizationE2eFixture(home);
    const plan = await tool("content_ops_plan_finalization").handler(context, { context: fixture });
    expect(plan).toMatchObject({
      status: "SUCCESS",
      details: { final_manifest_created: false, feishu_writes: 0 },
    });
    const first = await tool("content_ops_finalize_delivery").handler(context, {
      context: fixture,
      request_id: "FINALIZE-FIXTURE-0001",
      explicit_confirmation: true,
    });
    expect(first).toMatchObject({
      status: "SUCCESS",
      details: { status: "FINALIZED", feishu_writes: 0, attachment_uploads: 0 },
    });
    const second = await tool("content_ops_finalize_delivery").handler(context, {
      context: fixture,
      request_id: "FINALIZE-FIXTURE-0002",
      explicit_confirmation: true,
    });
    expect(second).toMatchObject({
      status: "SUCCESS",
      details: { reused_manifest: true, reused_delivery: true },
    });
    const verify = await tool("content_ops_verify_final_delivery").handler(context, {
      context: fixture,
    });
    expect(verify).toMatchObject({
      status: "SUCCESS",
      details: { current: true, remote_writes: 0 },
    });
  });
});
