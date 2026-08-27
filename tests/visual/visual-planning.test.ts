import { describe, expect, it } from "vitest";
import {
  assessLayoutFeasibility,
  assertFirstPageHandoff,
  calculateVisualPlanningQualityScore,
  hashApprovedCopy,
  planVisualRevision,
  validateCopyFidelity,
  validateVisualDirectionDecision,
  validateVisualPlanningContext,
  visualPlanReadyForFirstPage,
} from "../../packages/core/src/visual-planning/index.js";

const copy = {
  copy_version: "CV-1",
  headline: "专业身份，先看这3点",
  body: "核对主体、资质和边界。",
  supporting_text: "",
};

describe("Phase 4A visual planning core", () => {
  it("requires COPY_APPROVED, current G3 and exact page count", () => {
    expect(() =>
      validateVisualPlanningContext({
        content_status: "COPY_APPROVED",
        content_version: "CV-1",
        copy_version: "CV-1",
        g3_target_version: "CV-1:CV-1",
        expected_page_count: 4,
        page_copy_hashes: [1, 2, 3, 4].map((page_number) => ({
          page_number,
          copy_hash: hashApprovedCopy(copy),
        })),
      }),
    ).not.toThrow();
    expect(() =>
      validateVisualPlanningContext({
        content_status: "COPY_PENDING_APPROVAL",
        content_version: "CV-1",
        copy_version: "CV-1",
        g3_target_version: "CV-1:CV-1",
        expected_page_count: 4,
        page_copy_hashes: [],
      }),
    ).toThrow("CONTENT_NOT_COPY_APPROVED");
  });

  it("retains three default direction candidates and blocks rejected selections", () => {
    const candidates = ["EDITORIAL_SERIES", "EVIDENCE_LED", "MIXED"].map((visual_mode, index) => ({
      candidate_id: `VDC-${index + 1}`,
      visual_mode,
      blocking_risks: [],
    }));
    expect(
      validateVisualDirectionDecision({
        candidates,
        selected_candidate_id: "VDC-1",
        user_fixed_mode: null,
        rejected_modes: [],
        rejected_directions: [],
      }).visual_mode,
    ).toBe("EDITORIAL_SERIES");
    expect(() =>
      validateVisualDirectionDecision({
        candidates,
        selected_candidate_id: "VDC-1",
        user_fixed_mode: null,
        rejected_modes: ["EDITORIAL_SERIES"],
        rejected_directions: [],
      }),
    ).toThrow("VISUAL_DIRECTION_PROHIBITED");
  });

  it("detects copy and page-count drift without accepting visual rewrites", () => {
    const approved = [{ page_number: 1, copy }];
    const visual = [{ page_number: 1, page_role: "COVER", copy_snapshot: copy }];
    expect(() => validateCopyFidelity(approved, visual)).not.toThrow();
    expect(() =>
      validateCopyFidelity(approved, [
        { page_number: 1, page_role: "COVER", copy_snapshot: { ...copy, headline: "改写" } },
      ]),
    ).toThrow("VISUAL_COPY_DRIFT");
    expect(() => validateCopyFidelity(approved, [])).toThrow("VISUAL_PAGE_COUNT_MISMATCH");
  });

  it("returns content revision rather than unreadable overflow", () => {
    const result = assessLayoutFeasibility(
      { page_number: 1, page_role: "COVER", copy_snapshot: { ...copy, body: "字".repeat(320) } },
      { available_text_regions: 1, typography_token_refs: ["TYPO-TITLE"], safe_area_fit: true },
    );
    expect(result).toMatchObject({
      estimated_density: "EXCESSIVE",
      status: "BLOCKED",
      overflow_strategy: "CONTENT_REVISION_REQUIRED",
    });
  });

  it("uses the fixed 100-weight readiness gate", () => {
    const scores = {
      CONTENT_FIDELITY: 5,
      VISUAL_MODE_FIT: 4,
      GROUP_CONSISTENCY: 4,
      PAGE_SPECIFIC_RELEVANCE: 4,
      READABILITY_FEASIBILITY: 4,
      ASSET_FEASIBILITY: 4,
      PROJECT_FIT: 4,
      PLATFORM_FIT: 4,
    } as const;
    expect(calculateVisualPlanningQualityScore(scores)).toBe(84);
    expect(visualPlanReadyForFirstPage(84, 0)).toBe(true);
    expect(visualPlanReadyForFirstPage(90, 1)).toBe(false);
  });

  it("keeps first-page handoff free of G4, Style Lock and generated assets", () => {
    expect(() =>
      assertFirstPageHandoff({
        page_number: 1,
        page_role: "COVER",
        ready: true,
        quality_ready: true,
        layout_blocked_count: 0,
      }),
    ).not.toThrow();
    expect(() =>
      assertFirstPageHandoff({
        page_number: 1,
        page_role: "COVER",
        ready: true,
        quality_ready: true,
        layout_blocked_count: 0,
        style_lock: {},
      }),
    ).toThrow("FIRST_PAGE_HANDOFF_PHASE_BOUNDARY_VIOLATION");
  });

  it("separates visual revision from content revision", () => {
    expect(
      planVisualRevision({
        from_version: "VV-1",
        changes_copy: false,
        changes_page_count: false,
        first_page_exists: false,
        g4_exists: false,
      }),
    ).toEqual({
      to_version: "VV-2",
      requires_content_revision: false,
      requires_new_g3: false,
      requires_first_page_regeneration: false,
      requires_new_g4: false,
    });
    expect(
      planVisualRevision({
        from_version: "VV-1",
        changes_copy: false,
        changes_page_count: true,
        first_page_exists: false,
        g4_exists: false,
      }).requires_content_revision,
    ).toBe(true);
  });
});
