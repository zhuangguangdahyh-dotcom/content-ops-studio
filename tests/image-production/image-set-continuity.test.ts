import { describe, expect, it } from "vitest";
import {
  evaluateImageSetContinuity,
  planImageSetProductionStrategy,
  type ImageSetPageEvidence,
  type ImageSetPageStrategyInput,
} from "../../packages/core/src/image-production/index.js";

const anchors = ["SUBJECT-WORLD", "PALETTE-A", "TYPE-SYSTEM-A"];

function plannedPages(): ImageSetPageStrategyInput[] {
  return [
    {
      pageNumber: 1,
      pageRole: "COVER",
      pageDuty: "COVER_CLICK",
      semanticResponsibility: "Create a truthful click reason",
      visualSystemKey: "SYSTEM-A",
      backgroundAssetPolicy: "DISTINCT_BACKGROUND_REQUIRED",
      plannedBackgroundKey: "BG-1",
      shotSignature: "ESTABLISHING-WIDE",
      compositionFamily: "TYPE_DOMINANT_COVER",
      continuityAnchorRefs: anchors,
      differenceFromPrevious: "Open the visual world.",
    },
    {
      pageNumber: 2,
      pageRole: "PROBLEM",
      pageDuty: "VALUE_DELIVERY",
      semanticResponsibility: "Make the problem visible",
      visualSystemKey: "SYSTEM-A",
      backgroundAssetPolicy: "DISTINCT_BACKGROUND_REQUIRED",
      plannedBackgroundKey: "BG-2",
      shotSignature: "TRANSITION-MEDIUM",
      compositionFamily: "EDITORIAL_SPLIT",
      continuityAnchorRefs: anchors.slice(0, 2),
      differenceFromPrevious: "Move from hook to problem.",
    },
    {
      pageNumber: 3,
      pageRole: "ANALYSIS",
      pageDuty: "VALUE_DELIVERY",
      semanticResponsibility: "Explain the mechanism",
      visualSystemKey: "SYSTEM-A",
      backgroundAssetPolicy: "DISTINCT_BACKGROUND_REQUIRED",
      plannedBackgroundKey: "BG-3",
      shotSignature: "DETAIL-CLOSE",
      compositionFamily: "EVIDENCE_DOMINANT",
      continuityAnchorRefs: ["SUBJECT-WORLD", "TYPE-SYSTEM-A"],
      differenceFromPrevious: "Change scale and evidence focus.",
    },
    {
      pageNumber: 4,
      pageRole: "SUMMARY",
      pageDuty: "SUMMARY_CONVERSION",
      semanticResponsibility: "Resolve with a useful next action",
      visualSystemKey: "SYSTEM-A",
      backgroundAssetPolicy: "DISTINCT_BACKGROUND_REQUIRED",
      plannedBackgroundKey: "BG-4",
      shotSignature: "RELATIONSHIP-REVERSE",
      compositionFamily: "SUMMARY_EDITORIAL",
      continuityAnchorRefs: anchors,
      differenceFromPrevious: "Resolve the sequence.",
    },
  ];
}

function evidencePages(): ImageSetPageEvidence[] {
  return plannedPages().map((page, index) => ({
    pageNumber: page.pageNumber,
    pageRole: page.pageRole,
    pageDuty: page.pageDuty,
    semanticResponsibility: page.semanticResponsibility,
    visualSystemKey: page.visualSystemKey,
    backgroundAssetPolicy: page.backgroundAssetPolicy,
    backgroundSourceChecksum: String(index + 1).repeat(64),
    renderedAssetChecksum: String.fromCharCode(97 + index).repeat(64),
    shotSignature: page.shotSignature,
    compositionFamily: page.compositionFamily,
    continuityAnchorsPresent: page.continuityAnchorRefs,
    pageRoleFulfilled: true,
    mobileReadable: true,
    differenceFromPreviousVerified: true,
  }));
}

function pageAt<T>(pages: T[], index: number): T {
  const page = pages[index];
  if (!page) throw new Error(`TEST_PAGE_MISSING:${index}`);
  return page;
}

describe("industry-neutral image-set continuity", () => {
  it("plans one visual system with distinct page duties, backgrounds and shots", () => {
    const plan = planImageSetProductionStrategy({
      visualMotif: "One subject world, distinct editorial views",
      continuityAnchors: anchors,
      pages: plannedPages(),
    });
    expect(plan).toMatchObject({
      distinct_backgrounds_required: 4,
      planned_distinct_backgrounds: 4,
      composition_family_count: 4,
      result: "PLANNED",
    });
  });

  it("rejects using one master background under different crops", () => {
    const pages = plannedPages();
    pages[2] = { ...pageAt(pages, 2), plannedBackgroundKey: "BG-2" };
    expect(() =>
      planImageSetProductionStrategy({
        visualMotif: "One subject world",
        continuityAnchors: anchors,
        pages,
      }),
    ).toThrow("IMAGE_SET_BACKGROUND_REUSE_NOT_ALLOWED");
  });

  it("rejects style drift even when every page uses a different background", () => {
    const pages = plannedPages();
    pages[3] = { ...pageAt(pages, 3), visualSystemKey: "SYSTEM-B" };
    expect(() =>
      planImageSetProductionStrategy({
        visualMotif: "One subject world",
        continuityAnchors: anchors,
        pages,
      }),
    ).toThrow("IMAGE_SET_VISUAL_SYSTEM_DRIFT");
  });

  it("fails actual group QA when repeated source pixels are hidden by different layouts", () => {
    const pages = evidencePages();
    pages[2] = {
      ...pageAt(pages, 2),
      backgroundSourceChecksum: pageAt(pages, 1).backgroundSourceChecksum,
    };
    const result = evaluateImageSetContinuity({ continuityAnchors: anchors, pages });
    expect(result.background_asset_diversity).toBe("FAIL");
    expect(result.duplicate_background_pairs).toEqual([[2, 3]]);
    expect(result.hard_blocks).toContain("IMAGE_SET_DISTINCT_BACKGROUND_REQUIREMENT_FAILED");
    expect(result.result).toBe("FAIL");
  });

  it("passes only after duties, continuity, asset diversity and narrative progression all pass", () => {
    expect(
      evaluateImageSetContinuity({ continuityAnchors: anchors, pages: evidencePages() }),
    ).toEqual(
      expect.objectContaining({
        visual_style_continuity: "PASS",
        page_duty_fulfillment: "PASS",
        background_asset_diversity: "PASS",
        shot_and_composition_diversity: "PASS",
        narrative_progression: "PASS",
        mobile_readability: "PASS",
        hard_blocks: [],
        result: "PASS_PENDING_OPERATOR",
      }),
    );
  });
});
