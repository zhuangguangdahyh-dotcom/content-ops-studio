import { describe, expect, it } from "vitest";
import { evaluateVisualSemanticRelevance } from "../../packages/core/src/cover-conversion/index.js";

const scores = {
  INDUSTRY_RELEVANCE: 19,
  BUSINESS_SCENE_RELEVANCE: 19,
  PAINPOINT_RELEVANCE: 18,
  CONTENT_VALUE_RELEVANCE: 13,
  PROJECT_OR_SUBJECT_RELEVANCE: 13,
  AUDIENCE_RECOGNITION: 9,
};

describe("visual semantic relevance", () => {
  it("passes a direct commercial scene above 80 without auto-approval", () => {
    const result = evaluateVisualSemanticRelevance({
      semanticRole: "DIRECT_PAINPOINT_SCENE",
      directRelationStatement: "The storefront directly shows the first-impression problem.",
      scores,
      accountGoal: "LEAD_GENERATION",
      projectProfileAllowsAbstract: false,
      operatorRejected: false,
      targetAudienceCanRecognize: true,
    });
    expect(result.total_score).toBe(91);
    expect(result.result).toBe("PASS_PENDING_OPERATOR");
  });

  it("blocks decorative-only and weak abstract backgrounds for lead generation", () => {
    const decorative = evaluateVisualSemanticRelevance({
      semanticRole: "DECORATIVE_ONLY",
      directRelationStatement: "Decorative texture only.",
      scores,
      accountGoal: "LEAD_GENERATION",
      projectProfileAllowsAbstract: false,
      operatorRejected: false,
      targetAudienceCanRecognize: true,
    });
    const abstract = evaluateVisualSemanticRelevance({
      semanticRole: "ABSTRACT_SEMANTIC",
      directRelationStatement: "",
      scores,
      accountGoal: "LEAD_GENERATION",
      projectProfileAllowsAbstract: false,
      operatorRejected: true,
      targetAudienceCanRecognize: false,
    });
    expect(decorative.hard_blocks).toContain("DECORATIVE_BACKGROUND_NOT_ALLOWED");
    expect(abstract.hard_blocks).toContain("ABSTRACT_METAPHOR_TOO_WEAK");
  });
});
