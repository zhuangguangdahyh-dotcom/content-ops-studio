import { describe, expect, it } from "vitest";
import { evaluateCoverThumbnail } from "../../packages/core/src/cover-conversion/index.js";

describe("true-size cover thumbnail QA", () => {
  it("passes only when both 310x414 and 186x248 renders are legible", () => {
    const result = evaluateCoverThumbnail({
      accountGoal: "LEAD_GENERATION",
      thumbnails: [
        {
          size: "310x414",
          width: 310,
          height: 414,
          primaryEffectiveFontPx: 32,
          secondaryEffectiveFontPx: 15,
          readable: true,
        },
        {
          size: "186x248",
          width: 186,
          height: 248,
          primaryEffectiveFontPx: 19,
          secondaryEffectiveFontPx: 9,
          readable: true,
        },
      ],
      primaryHookLines: 2,
      primaryHookFirstFocus: true,
      singleClickMessage: true,
      audienceOrPainpointOrValueClear: true,
      backgroundCompetes: false,
      smallParagraphPresent: false,
      contrastRatio: 7.1,
      textVisualShare: 0.42,
      businessSceneRecognizable: true,
    });
    expect(result).toEqual({ hard_blocks: [], result: "PASS" });
  });

  it("blocks a dense or unreadable thumbnail", () => {
    const result = evaluateCoverThumbnail({
      accountGoal: "LEAD_GENERATION",
      thumbnails: [
        {
          size: "310x414",
          width: 310,
          height: 414,
          primaryEffectiveFontPx: 18,
          secondaryEffectiveFontPx: 10,
          readable: false,
        },
        {
          size: "186x248",
          width: 186,
          height: 248,
          primaryEffectiveFontPx: 10,
          secondaryEffectiveFontPx: 5,
          readable: false,
        },
      ],
      primaryHookLines: 4,
      primaryHookFirstFocus: false,
      singleClickMessage: false,
      audienceOrPainpointOrValueClear: false,
      backgroundCompetes: true,
      smallParagraphPresent: true,
      contrastRatio: 2.1,
      textVisualShare: 0.2,
      businessSceneRecognizable: false,
    });
    expect(result.result).toBe("BLOCKED");
    expect(result.hard_blocks).toContain("COVER_THUMBNAIL_UNREADABLE");
    expect(result.hard_blocks).toContain("COVER_CLICK_CLARITY_BLOCKED");
  });
});
