import { describe, expect, it } from "vitest";
import { CONTENT_TOOL_DEFINITIONS } from "../../services/content-ops-mcp/src/content-tools.js";

describe("Content MCP tools", () => {
  it("rejects stale near-semantic field names before retaining a draft", () => {
    const tool = CONTENT_TOOL_DEFINITIONS.find(
      (item) => item.name === "content_ops_submit_content_draft",
    );
    expect(tool).toBeDefined();
    const base = {
      project_id: "PRJ-20990101-DEMO",
      run_id: "RUN-20990101-010203-C001",
      research_run_id: "RUN-20990101-010203-R001",
      painpoint_id: "P-0001",
      plan_hash: "a".repeat(64),
      painpoint_version: 1,
      project_rule_snapshot: {},
      idempotency_key: "CONTENT-DEMO-0001",
      plan: {},
      angle_decision: {},
      content: {},
      pages: [{}, {}, {}, {}],
      claim_map: {},
      dimension_scores: {},
    };
    expect(
      tool?.inputSchema.safeParse({
        ...base,
        near_semantic_assessments: [
          {
            content_id: "C-0002",
            similarities: ["same audience"],
            differences: ["different decision"],
            worth_continuing: true,
            rationale: "The core problem and conclusion differ.",
            alternative_angle: null,
          },
        ],
      }).success,
    ).toBe(true);
    expect(
      tool?.inputSchema.safeParse({
        ...base,
        near_semantic_assessments: [
          {
            compared_content_id: "C-0002",
            shared_elements: ["same audience"],
            material_differences: ["different decision"],
            worth_continuing: true,
            rationale: "The core problem and conclusion differ.",
          },
        ],
      }).success,
    ).toBe(false);
  });
});
