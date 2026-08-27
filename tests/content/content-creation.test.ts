import { describe, expect, it } from "vitest";
import {
  assertTitleLength,
  calculateContentQualityScore,
  contentReadyForG3,
  validateAngleSelection,
  validateClaimMap,
  validateConfirmedPainpoint,
  validateContentPages,
  type ContentPageDraft,
} from "../../packages/core/src/content/index.js";
import {
  DEFAULT_FIXED_ANGLE_STRUCTURE,
  normalizeMappedValue,
} from "../../services/content-ops-mcp/src/content-tools.js";

const at = "2099-01-01T00:00:00.000Z";
function page(
  pageNumber: number,
  role = pageNumber === 1 ? "COVER" : "ANALYSIS",
): ContentPageDraft {
  return {
    page_number: pageNumber,
    page_role: role,
    copy_version: "CV-1",
    headline: `第${pageNumber}页`,
    body: "一条明确、虚构且可审核的信息。",
    supporting_text: "",
    content_purpose: "承担一个信息任务。",
    background_direction: "",
    visual_evidence_requirement: "仅说明证据需求，不生产视觉。",
    layout_notes: "",
    negative_constraints: [],
    created_at: at,
    updated_at: at,
    extensions: {},
  };
}

describe("Phase 3B content creation core", () => {
  it("requires a confirmed painpoint and at least three default angles", () => {
    expect(() =>
      validateConfirmedPainpoint({ review_status: "PAINPOINT_CONFIRMED" }),
    ).not.toThrow();
    expect(() => validateConfirmedPainpoint({ review_status: "PAINPOINT_REJECTED" })).toThrow(
      "PAINPOINT_NOT_CONFIRMED",
    );
    expect(() =>
      validateAngleSelection({
        candidates: [{ candidate_id: "AC-01" }, { candidate_id: "AC-02" }],
        selected_candidate_id: "AC-01",
        user_fixed_angle: null,
      }),
    ).toThrow("CONTENT_ANGLE_CANDIDATES_INSUFFICIENT");
  });

  it("normalizes official Lark CLI single-select labels back to stable codes", () => {
    expect(
      normalizeMappedValue(["已确认"], {
        fieldType: 3,
        optionMap: { PAINPOINT_CONFIRMED: "已确认" },
      }),
    ).toBe("PAINPOINT_CONFIRMED");
  });

  it("uses the canonical structure enum for an Operator-fixed angle", () => {
    expect(DEFAULT_FIXED_ANGLE_STRUCTURE).toBe("DECISION_GUIDANCE");
  });

  it("enforces 4-8 contiguous pages with a Cover first and one task per page", () => {
    expect(
      validateContentPages(
        [1, 2, 3, 4, 5, 6].map((item) => page(item)),
        6,
      ),
    ).toEqual([]);
    const invalid = [page(1, "ANALYSIS"), page(3), page(4), page(5)];
    expect(validateContentPages(invalid, 4)).toEqual(
      expect.arrayContaining(["FIRST_PAGE_NOT_COVER", "PAGE_NUMBER_NOT_CONTIGUOUS:2"]),
    );
  });

  it("counts visible Unicode code points deterministically", () => {
    expect(assertTitleLength("专业身份怎么判断")).toBe(8);
    expect(assertTitleLength("信任判断✅")).toBe(5);
    expect(() =>
      assertTitleLength("这是一条超过二十个可见字符并且必须被确定性程序阻止的标题"),
    ).toThrow("CONTENT_TITLE_LENGTH_INVALID");
  });

  it("blocks unsupported and unknown-evidence factual claims", () => {
    const base = {
      claim_id: "CL-0001",
      page_number: 1,
      claim_type: "FACTUAL_EXTERNAL",
      claim_text: "虚构事实主张。",
      evidence_refs: ["E-0001"],
      support_status: "SUPPORTED",
      support_rationale: "直接支持。",
      limitations: [],
      rewrite_requirement: null,
    };
    expect(validateClaimMap([base], ["E-0001"])).toEqual([]);
    expect(validateClaimMap([{ ...base, support_status: "UNSUPPORTED" }], ["E-0001"])).toContain(
      "CL-0001:CLAIM_UNSUPPORTED",
    );
    expect(validateClaimMap([base], [])).toContain("CL-0001:EVIDENCE_UNKNOWN:E-0001");
  });

  it("uses the fixed 100-weight score and requires 75 with zero blockers", () => {
    const scores = {
      FOCUS: 4,
      AUDIENCE_RELEVANCE: 4,
      VALUE_DELIVERY: 4,
      EVIDENCE_SUPPORT: 4,
      SUBJECT_FIT: 4,
      PLATFORM_FIT: 4,
      READABILITY: 4,
      ORIGINALITY: 4,
      CTA_RELEVANCE: 4,
    } as const;
    expect(calculateContentQualityScore(scores)).toBe(80);
    expect(contentReadyForG3(80, 0)).toBe(true);
    expect(contentReadyForG3(74.99, 0)).toBe(false);
    expect(contentReadyForG3(90, 1)).toBe(false);
  });
});
