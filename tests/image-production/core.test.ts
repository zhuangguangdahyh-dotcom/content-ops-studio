import { describe, expect, it } from "vitest";
import {
  evaluateGroupQuality,
  evaluateImageQuality,
  planAssetRoute,
  planDirectionCandidates,
  proposeVisualRule,
} from "../../packages/core/src/image-production/index.js";

const ratings = {
  CONTENT_SEMANTIC_FIT: 4,
  COMPOSITION_FOCUS: 4,
  HIERARCHY_READABILITY: 4,
  ASSET_QUALITY_INTEGRITY: 4,
  PROJECT_AUDIENCE_FIT: 4,
  UNIQUENESS_ANTI_TEMPLATE: 4,
  VISUAL_MODE_EXECUTION: 4,
  PLATFORM_MOBILE_PERFORMANCE: 4,
} as const;

describe("Phase 4B-R image production core", () => {
  it("routes evidence and precise information before aesthetic defaults", () => {
    expect(
      planAssetRoute({
        projectId: "PRJ-DEMO-001",
        contentId: "C-0001",
        pageNumber: 1,
        evidenceRequired: true,
        accurateStructureRequired: false,
        operatorRequestedChannel: "AI_GENERATED_VISUAL",
        hostImagegenAvailable: true,
      }).asset_channel,
    ).toBe("EVIDENCE_ASSET");
    expect(
      planAssetRoute({
        projectId: "PRJ-DEMO-001",
        contentId: "C-0001",
        pageNumber: 2,
        evidenceRequired: false,
        accurateStructureRequired: true,
        hostImagegenAvailable: true,
      }).asset_channel,
    ).toBe("PROGRAMMATIC_GRAPHIC");
  });
  it("never falls back from unavailable Host ImageGen to Mock", () => {
    const route = planAssetRoute({
      projectId: "PRJ-DEMO-001",
      contentId: "C-0001",
      pageNumber: 1,
      evidenceRequired: false,
      accurateStructureRequired: false,
      operatorRequestedChannel: "AI_GENERATED_VISUAL",
      hostImagegenAvailable: false,
    });
    expect(route.asset_channel).toBe("PURE_TYPOGRAPHY");
    expect(route.warnings).toContain("HOST_IMAGEGEN_UNAVAILABLE_NO_MOCK_FALLBACK");
  });
  it("plans three materially different candidates for an immature profile", () => {
    const result = planDirectionCandidates({
      contentId: "C-0001",
      profileMaturity: "UNMATURE",
      explicitDirection: false,
      hostImagegenAvailable: true,
    });
    expect(result.candidates).toHaveLength(3);
    expect(new Set(result.candidates.map((item) => item.asset_channel)).size).toBe(3);
  });
  it("hard blocks override score and quality never auto-approves", () => {
    expect(
      evaluateImageQuality({ ratings, hardBlocks: [], role: "DIRECTION_CANDIDATE" }),
    ).toMatchObject({
      total_score: 80,
      result: "PASS_PENDING_OPERATOR",
      operator_approval_required: true,
    });
    expect(
      evaluateImageQuality({
        ratings: { ...ratings, CONTENT_SEMANTIC_FIT: 5 },
        hardBlocks: ["FAKE_EVIDENCE"],
        role: "FORMAL_ASSET",
      }).result,
    ).toBe("BLOCKED");
  });
  it("finds exact-source reuse and keeps defects out of learning", () => {
    const group = evaluateGroupQuality({
      assetIds: ["AST-A", "AST-B"],
      visualSignatures: ["left", "right"],
      subjectIdentityKeys: ["subject", "subject"],
      sourceChecksums: ["a", "a"],
    });
    expect(group.result).toBe("FAIL");
    expect(group.near_duplicate_pairs).toEqual([["AST-A", "AST-B"]]);
    expect(
      proposeVisualRule({
        eventId: "VFE-A",
        feedbackClass: "QUALITY_DEFECT",
        isToolOrSystemDefect: false,
        statement: "Fix overflow",
      }).eligible,
    ).toBe(false);
  });

  it("keeps current-set production feedback out of long-term rule candidacy", () => {
    expect(
      proposeVisualRule({
        eventId: "VFE-C-0001-COMPARISON",
        feedbackClass: "PRODUCTION_FEEDBACK",
        requestedScope: "CURRENT_SET",
        isToolOrSystemDefect: false,
        statement: "Complete the Renderer comparison before direction selection.",
      }),
    ).toEqual({
      eligible: false,
      status: "REJECTED",
      scope: "CURRENT_SET",
      reason: "PRODUCTION_FEEDBACK_CURRENT_WORK_ONLY",
    });
  });
});
