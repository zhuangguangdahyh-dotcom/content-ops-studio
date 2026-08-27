import { describe, expect, it } from "vitest";
import { TOOL_DEFINITIONS } from "../../services/content-ops-mcp/src/tool-registry.js";

const tool = (name: string) => {
  const value = TOOL_DEFINITIONS.find((item) => item.name === name);
  if (!value) throw new Error(`Missing ${name}`);
  return value;
};

describe("Phase 4B Renderer MCP tools", () => {
  it("registers five read tools and three bounded write tools", () => {
    const names = [
      "content_ops_get_renderer_status",
      "content_ops_setup_renderer",
      "content_ops_plan_first_page_production",
      "content_ops_render_first_page",
      "content_ops_get_first_page_asset",
      "content_ops_verify_first_page",
      "content_ops_plan_first_page_revision",
      "content_ops_submit_first_page_review",
    ];
    const tools = names.map(tool);
    expect(tools.filter((item) => item.annotations.readOnlyHint)).toHaveLength(5);
    expect(tools.filter((item) => !item.annotations.readOnlyHint)).toHaveLength(3);
    expect(tool("content_ops_setup_renderer").annotations.openWorldHint).toBe(true);
    expect(tool("content_ops_render_first_page").annotations.openWorldHint).toBe(true);
    expect(tool("content_ops_submit_first_page_review").annotations.openWorldHint).toBe(false);
  });

  it("rejects setup without explicit confirmation at schema boundary", () => {
    expect(tool("content_ops_setup_renderer").inputSchema.safeParse({}).success).toBe(false);
    expect(
      tool("content_ops_setup_renderer").inputSchema.safeParse({ explicit_confirmation: true })
        .success,
    ).toBe(true);
  });
});
