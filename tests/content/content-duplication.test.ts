import { describe, expect, it } from "vitest";
import { buildContentFingerprint } from "../../packages/core/src/content/index.js";

describe("Phase 3B deterministic content duplication", () => {
  it("normalizes NFKC, case, whitespace, line endings and punctuation", () => {
    const base = {
      painpoint_id: "P-0001",
      content_angle: "Decision Checklist",
      core_viewpoint: "Verify identity before trust",
      cover_hook: "How to verify?",
      content_structure_type: "CHECKLIST",
      main_conclusion: "Check evidence, then decide.",
    };
    expect(buildContentFingerprint(base)).toBe(
      buildContentFingerprint({
        ...base,
        content_angle: "ｄｅｃｉｓｉｏｎ   checklist",
        cover_hook: "How to verify！",
        main_conclusion: "Check evidence\r\nthen decide",
      }),
    );
  });

  it("changes when the material angle or conclusion changes", () => {
    const input = {
      painpoint_id: "P-0001",
      content_angle: "decision",
      core_viewpoint: "verify first",
      cover_hook: "verify",
      content_structure_type: "CHECKLIST",
      main_conclusion: "check evidence",
    };
    expect(buildContentFingerprint(input)).not.toBe(
      buildContentFingerprint({ ...input, content_angle: "cost", main_conclusion: "compare cost" }),
    );
  });
});
