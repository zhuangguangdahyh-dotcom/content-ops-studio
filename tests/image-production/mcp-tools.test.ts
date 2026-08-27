import { describe, expect, it } from "vitest";
import { IMAGE_PRODUCTION_TOOL_DEFINITIONS } from "../../services/content-ops-mcp/src/image-production-tools.js";

describe("Image Production MCP tools", () => {
  it("exposes every named narrow tool with strict schemas and closed annotations", () => {
    const names = IMAGE_PRODUCTION_TOOL_DEFINITIONS.map((tool) => tool.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toEqual(
      expect.arrayContaining([
        "content_ops_plan_cover_conversion",
        "content_ops_submit_cover_copy_revision",
        "content_ops_evaluate_cover_thumbnail",
        "content_ops_evaluate_cover_click_clarity",
        "content_ops_evaluate_visual_semantic_relevance",
        "content_ops_get_cover_concept_candidates",
      ]),
    );
    for (const tool of IMAGE_PRODUCTION_TOOL_DEFINITIONS) {
      expect(tool.annotations.destructiveHint).toBe(false);
      expect(tool.annotations.openWorldHint).toBe(false);
      expect(tool.inputSchema.safeParse({ unexpected: true }).success).toBe(false);
    }
  });
});
