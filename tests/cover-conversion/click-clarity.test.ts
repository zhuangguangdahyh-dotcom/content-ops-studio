import { describe, expect, it } from "vitest";
import { evaluateCoverClickClarity } from "../../packages/core/src/cover-conversion/index.js";

describe("cover click clarity", () => {
  it("requires at least 85/100 for lead generation and never auto-approves", () => {
    const result = evaluateCoverClickClarity({
      accountGoal: "LEAD_GENERATION",
      scores: {
        TARGET_CUSTOMER_CLARITY: 23,
        PAINPOINT_OR_VALUE_CLARITY: 24,
        ONE_SECOND_COMPREHENSION: 18,
        THUMBNAIL_LEGIBILITY: 18,
        CONTENT_PROMISE_ALIGNMENT: 9,
      },
    });
    expect(result.total_score).toBe(92);
    expect(result.threshold).toBe(85);
    expect(result.result).toBe("PASS_PENDING_OPERATOR");
    expect(result.operator_approval_required).toBe(true);
  });
});
