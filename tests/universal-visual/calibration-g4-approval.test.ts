import { describe, expect, it } from "vitest";
import {
  CALIBRATION_CONTENT_PAGE_ALLOWED_VARIATIONS,
  CALIBRATION_COVER_LOCKED_RULES,
  CALIBRATION_GROUP_SHARED_RULES,
  CALIBRATION_PROHIBITED_DEVIATIONS,
  CALIBRATION_UNIVERSAL_TEMPLATE_EXCLUSIONS,
  CALIBRATION_VALIDATED_SYSTEMS,
  assertCalibrationG4Ready,
  calibrationG4TargetVersion,
} from "../../packages/core/src/visual-baseline/calibration-g4.js";

const binding = {
  projectId: "CAL-COMMERCIAL-SPACE-001",
  contentId: "C-9001",
  contentVersion: "CV-1",
  copyVersion: "CV-1",
  visualPlanVersion: "VV-1",
  firstPageVersion: "FPV-2",
  assetId: "AST-CAL-SPACE-001-FPV2C",
  assetChecksum: "616d4eb80d06587f187880ecb9e4a447ce537da937b267b6691436b2672bf274",
  formalRunId: "RUN-20260826-204500-R25C",
};

describe("Calibration G4 approval", () => {
  it("binds the decision to every formal version and the full raster checksum", () => {
    expect(calibrationG4TargetVersion(binding)).toBe(
      `CV-1:CV-1:VV-1:FPV-2:${binding.assetChecksum}`,
    );
    expect(() =>
      assertCalibrationG4Ready({
        expected: binding,
        actual: binding,
        attentionMode: "TYPE_DOMINANT",
        reviewStatus: "AWAITING_USER_APPROVAL",
        reviewDecision: "PENDING_OPERATOR",
        formalCoverEligible: true,
        formalHardBlocks: [],
        contrastResult: "PASS",
        contrastHardBlocks: [],
      }),
    ).not.toThrow();
  });

  it("blocks stale asset identity and any formal QA hard block", () => {
    expect(() =>
      assertCalibrationG4Ready({
        expected: binding,
        actual: { ...binding, assetChecksum: "a".repeat(64) },
        attentionMode: "TYPE_DOMINANT",
        reviewStatus: "AWAITING_USER_APPROVAL",
        reviewDecision: "PENDING_OPERATOR",
        formalCoverEligible: true,
        formalHardBlocks: [],
        contrastResult: "PASS",
        contrastHardBlocks: [],
      }),
    ).toThrowError(/binding mismatch/u);
    expect(() =>
      assertCalibrationG4Ready({
        expected: binding,
        actual: binding,
        attentionMode: "TYPE_DOMINANT",
        reviewStatus: "AWAITING_USER_APPROVAL",
        reviewDecision: "PENDING_OPERATOR",
        formalCoverEligible: true,
        formalHardBlocks: ["COPY_FIDELITY_FAILED"],
        contrastResult: "PASS",
        contrastHardBlocks: [],
      }),
    ).toThrowError(/formal QA evidence/u);
  });

  it("keeps the formal lock expressive but never turns this cover into a universal template", () => {
    expect(CALIBRATION_COVER_LOCKED_RULES).toHaveLength(13);
    expect(CALIBRATION_GROUP_SHARED_RULES).toHaveLength(7);
    expect(CALIBRATION_CONTENT_PAGE_ALLOWED_VARIATIONS).toHaveLength(13);
    expect(CALIBRATION_PROHIBITED_DEVIATIONS).toHaveLength(11);
    expect(CALIBRATION_VALIDATED_SYSTEMS).toHaveLength(6);
    expect(CALIBRATION_UNIVERSAL_TEMPLATE_EXCLUSIONS).toEqual([
      "LAYOUT",
      "COLOR",
      "STOREFRONT",
      "TITLE_POSITION",
      "CROP",
      "TYPE_DOMINANT",
    ]);
  });
});
