import { describe, expect, it } from "vitest";
import { planCommercialSpaceCalibrationConcepts } from "../../packages/core/src/cover-conversion/index.js";

describe("commercial-space calibration concept planning", () => {
  it("returns three materially different conversion and semantic directions", () => {
    const concepts = planCommercialSpaceCalibrationConcepts();
    expect(concepts).toHaveLength(3);
    expect(new Set(concepts.map((item) => item.strategy)).size).toBe(3);
    expect(new Set(concepts.map((item) => item.semanticRole)).size).toBe(3);
    expect(new Set(concepts.map((item) => item.composition)).size).toBe(3);
    expect(concepts.every((item) => item.hook.length > 0 && item.secondaryLine.length > 0)).toBe(
      true,
    );
  });
});
