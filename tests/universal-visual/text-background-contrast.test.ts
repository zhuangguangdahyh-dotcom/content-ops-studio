import { describe, expect, it } from "vitest";
import {
  FORMAL_COVER_GATE_ORDER,
  evaluateTextBackgroundContrastIntegrity,
  evaluateTextLayerContrast,
  type TextLayerContrastInput,
} from "../../packages/core/src/visual-baseline/text-background-contrast.js";

const passingLayer: TextLayerContrastInput = {
  text_layer_id: "PRIMARY_HOOK",
  role: "PRIMARY_HOOK",
  foreground_opacity: 1,
  minimum_local_contrast: 2.27,
  low_percentile_local_contrast: 14.98,
  median_local_contrast: 16.97,
  worst_local_region_median_contrast: 5.03,
  low_contrast_area_ratio: 0.0003,
  contrast_variance: 2.82,
  foreground_background_edge_conflict: 0.0053,
  background_complexity_under_text: 0.0053,
  actual_pixel_readable: true,
};

describe("raster text-background contrast integrity", () => {
  it("runs after spatial integrity and before cover-attention scoring", () => {
    const spatial = FORMAL_COVER_GATE_ORDER.indexOf("TYPOGRAPHY_SPATIAL_INTEGRITY");
    const contrast = FORMAL_COVER_GATE_ORDER.indexOf("TEXT_BACKGROUND_CONTRAST_INTEGRITY");
    const attention = FORMAL_COVER_GATE_ORDER.indexOf("COVER_ATTENTION_DOMINANCE");
    expect(spatial).toBeLessThan(contrast);
    expect(contrast).toBeLessThan(attention);
  });

  it("passes the revised FPV-2 primary and secondary pixel measurements", () => {
    const result = evaluateTextBackgroundContrastIntegrity([
      passingLayer,
      {
        ...passingLayer,
        text_layer_id: "SECONDARY_SIGNAL",
        role: "SECONDARY_SIGNAL",
        minimum_local_contrast: 7.88,
        low_percentile_local_contrast: 9.43,
        median_local_contrast: 10.75,
        worst_local_region_median_contrast: 8.76,
        low_contrast_area_ratio: 0,
        contrast_variance: 0.67,
        foreground_background_edge_conflict: 0,
        background_complexity_under_text: 0,
      },
    ]);
    expect(result.result).toBe("PASS");
    expect(result.hard_blocks).toEqual([]);
  });

  it("turns the historical FPV-1 primary risk into hard blocks", () => {
    const result = evaluateTextLayerContrast({
      ...passingLayer,
      minimum_local_contrast: 1,
      low_percentile_local_contrast: 1.9565,
      median_local_contrast: 15.9589,
      worst_local_region_median_contrast: 1.0355,
      low_contrast_area_ratio: 0.142,
      contrast_variance: 29.8248,
      background_complexity_under_text: 0.0215,
      foreground_background_edge_conflict: 0.0215,
      actual_pixel_readable: false,
    });
    expect(result.result).toBe("FAIL");
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "TEXT_BACKGROUND_CONTRAST_INTEGRITY_BLOCKED",
        "PRIMARY_TEXT_LOCAL_CONTRAST_FAILURE",
        "LOW_CONTRAST_AREA_EXCESSIVE",
        "TEXT_BACKGROUND_CONTRAST_UNSTABLE",
        "TEXT_BACKGROUND_COMPLEXITY_BLOCKED",
      ]),
    );
  });

  it("rejects an average-pass secondary layer when its worst local tile fails", () => {
    const result = evaluateTextLayerContrast({
      ...passingLayer,
      text_layer_id: "SECONDARY_SIGNAL",
      role: "SECONDARY_SIGNAL",
      minimum_local_contrast: 3.1,
      low_percentile_local_contrast: 6.41,
      median_local_contrast: 7.27,
      worst_local_region_median_contrast: 3.14,
      low_contrast_area_ratio: 0.0134,
      contrast_variance: 0.65,
      background_complexity_under_text: 0.0014,
      foreground_background_edge_conflict: 0.0014,
    });
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "TEXT_BACKGROUND_CONTRAST_INTEGRITY_BLOCKED",
        "SECONDARY_TEXT_CONTRAST_TOO_LOW",
      ]),
    );
  });

  it("does not allow low opacity to manufacture secondary hierarchy", () => {
    const result = evaluateTextLayerContrast({
      ...passingLayer,
      text_layer_id: "SECONDARY_SIGNAL",
      role: "SECONDARY_SIGNAL",
      foreground_opacity: 0.7,
      minimum_local_contrast: 8,
      low_percentile_local_contrast: 9,
      median_local_contrast: 11,
      worst_local_region_median_contrast: 8,
      background_complexity_under_text: 0,
      foreground_background_edge_conflict: 0,
    });
    expect(result.errors).toContain("COLOR_HIERARCHY_REDUCES_LEGIBILITY");
  });

  it("keeps actual pixel inspection authoritative over passing numbers", () => {
    const result = evaluateTextLayerContrast({
      ...passingLayer,
      actual_pixel_readable: false,
    });
    expect(result.errors).toContain("TEXT_BACKGROUND_CONTRAST_INTEGRITY_BLOCKED");
    expect(result.errors).toContain("PRIMARY_TEXT_LOCAL_CONTRAST_FAILURE");
  });
});
