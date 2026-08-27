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

  it("rejects a Run ID that the image-production evidence schemas cannot retain", () => {
    const tool = IMAGE_PRODUCTION_TOOL_DEFINITIONS.find(
      (item) => item.name === "content_ops_get_visual_direction_candidates",
    );
    expect(tool).toBeDefined();
    expect(
      tool?.inputSchema.safeParse({
        project_id: "PRJ-20990101-DEMO",
        content_id: "C-0001",
        run_id: "RUN-20990101-010203-C001",
      }).success,
    ).toBe(true);
    expect(
      tool?.inputSchema.safeParse({
        project_id: "PRJ-20990101-DEMO",
        content_id: "C-0001",
        run_id: "RUN-20990101-010203-C001X",
      }).success,
    ).toBe(false);
  });
});
