import { describe, expect, it } from "vitest";
import {
  createCalibrationStyleLockPreview,
  evaluateFormalCalibrationReadiness,
  FORMAL_CALIBRATION_TEXT_BACKGROUND_PRIORITY,
  resolveFormalTextBackgroundStrategy,
  type FormalCalibrationReadinessInput,
} from "../../packages/core/src/visual-baseline/index.js";

const base = (): FormalCalibrationReadinessInput => ({
  selectedCandidateChecksum: "a".repeat(64),
  formalAssetChecksum: "b".repeat(64),
  selectedCandidatePath: "candidate-I.png",
  formalAssetPath: "formal-FPV-1.png",
  fullTitleFontPx: 196,
  effectiveTitleFontPxAt186: 29.4,
  contentPageReferenceFontPx: 56,
  primaryHookMassScore: 94,
  materialAdvertisementRisk: 18,
  selectedTextBackgroundStrategy: "NATURAL_NEGATIVE_SPACE",
  viableTextBackgroundStrategies: ["NATURAL_NEGATIVE_SPACE", "VISIBLE_PANEL"],
  grayscaleStructureScore: 93,
  scores: {
    coverAttention: 94,
    clickClarity: 94,
    semanticRelevance: 92,
    painpointScene: 93,
    editorialSpatial: 92,
    imageTextIntegration: 91,
    imageQuality: 92,
  },
  actual186Inspected: true,
  deterministicReplay: true,
  historicalAssetsImmutable: true,
  c0001Immutable: true,
  feishuWrites: 0,
  remainingPagesCreated: 0,
});

describe("formal calibration cover", () => {
  it("passes a complete formal pipeline only pending Operator approval", () => {
    expect(evaluateFormalCalibrationReadiness(base())).toMatchObject({
      result: "PASS_PENDING_OPERATOR",
      ready_for_calibration_g4: true,
      calibration_g4_decision: "PENDING_OPERATOR",
      formal_style_lock_created: false,
    });
  });
  it("blocks direct Candidate I checksum reuse", () => {
    const input = base();
    input.formalAssetChecksum = input.selectedCandidateChecksum;
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).toContain(
      "FORMAL_CANDIDATE_ASSET_REUSE",
    );
  });
  it("blocks direct Candidate I path reuse", () => {
    const input = base();
    input.formalAssetPath = input.selectedCandidatePath;
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).toContain(
      "FORMAL_CANDIDATE_ASSET_REUSE",
    );
  });
  it("requires formal Cover scale to differ from Content pages", () => {
    const input = base();
    input.fullTitleFontPx = 110;
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).toContain(
      "COVER_CONTENT_SCALE_UNDIFFERENTIATED",
    );
  });
  it("blocks a readable but weak 186 title", () => {
    const input = base();
    input.effectiveTitleFontPxAt186 = 24;
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).toContain(
      "PRIMARY_HOOK_TOO_WEAK",
    );
  });
  it("blocks weak primary visual mass", () => {
    const input = base();
    input.primaryHookMassScore = 80;
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).toContain(
      "PRIMARY_HOOK_TOO_WEAK",
    );
  });
  it("reduces fit when the background reads as a material advertisement", () => {
    const input = base();
    input.materialAdvertisementRisk = 55;
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).toContain(
      "MATERIAL_ADVERTISEMENT_FIT_WEAK",
    );
  });
  it("selects natural negative space before every fallback", () => {
    expect(resolveFormalTextBackgroundStrategy(["VISIBLE_PANEL", "NATURAL_NEGATIVE_SPACE"])).toBe(
      "NATURAL_NEGATIVE_SPACE",
    );
  });
  it("selects crop before text-region adjustment", () => {
    expect(
      resolveFormalTextBackgroundStrategy(["TEXT_REGION_ADJUSTMENT", "IMAGE_CROP_OR_COMPOSITION"]),
    ).toBe("IMAGE_CROP_OR_COMPOSITION");
  });
  it("keeps panel as the lowest priority", () => {
    expect(FORMAL_CALIBRATION_TEXT_BACKGROUND_PRIORITY.at(-1)).toBe("VISIBLE_PANEL");
  });
  it("blocks a visible panel when natural negative space is viable", () => {
    const input = base();
    input.selectedTextBackgroundStrategy = "VISIBLE_PANEL";
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).toContain(
      "TEXT_BACKGROUND_PRIORITY_BYPASSED",
    );
  });
  it("allows a panel only when every earlier strategy is unavailable", () => {
    const input = base();
    input.selectedTextBackgroundStrategy = "VISIBLE_PANEL";
    input.viableTextBackgroundStrategies = ["VISIBLE_PANEL"];
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).not.toContain(
      "TEXT_BACKGROUND_PRIORITY_BYPASSED",
    );
  });
  it("blocks color rescuing weak grayscale structure", () => {
    const input = base();
    input.grayscaleStructureScore = 74;
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).toContain(
      "COLOR_RESCUES_WEAK_STRUCTURE",
    );
  });
  it("blocks missing actual 186 inspection", () => {
    const input = base();
    input.actual186Inspected = false;
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).toContain(
      "ACTUAL_186_INSPECTION_MISSING",
    );
  });
  it("recalculates and enforces the formal Cover score threshold", () => {
    const input = base();
    input.scores.coverAttention = 89;
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).toContain(
      "FORMAL_SCORE_THRESHOLD_NOT_MET",
    );
  });
  it("blocks a failed deterministic replay", () => {
    const input = base();
    input.deterministicReplay = false;
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).toContain(
      "DETERMINISTIC_REPLAY_FAILED",
    );
  });
  it("keeps A through K immutable", () => {
    const input = base();
    input.historicalAssetsImmutable = false;
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).toContain(
      "HISTORICAL_ASSET_MUTATION",
    );
  });
  it("keeps C-0001 immutable", () => {
    const input = base();
    input.c0001Immutable = false;
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).toContain("C0001_MUTATION");
  });
  it("blocks Feishu writes and remaining pages", () => {
    const input = base();
    input.feishuWrites = 1;
    input.remainingPagesCreated = 1;
    expect(evaluateFormalCalibrationReadiness(input).hard_blocks).toContain(
      "DOWNSTREAM_WRITE_FORBIDDEN",
    );
  });
  it("creates only a Style Lock preview", () => {
    const preview = createCalibrationStyleLockPreview();
    expect(preview.creates_style_lock).toBe(false);
    expect(preview.cover_locked_rules.length).toBeGreaterThan(0);
    expect(preview.group_shared_rules.length).toBeGreaterThan(0);
    expect(preview.content_page_allowed_variations.length).toBeGreaterThan(0);
  });
});
