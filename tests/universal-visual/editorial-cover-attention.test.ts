import { describe, expect, it } from "vitest";
import {
  COVER_ATTENTION_ERROR_CODES,
  EDITORIAL_DESIGN_PRINCIPLES,
  evaluateColorAttentionStrategy,
  evaluateCoverAttentionDominance,
  evaluateTypographyAsForm,
  evaluateTypographyBreathingRoom,
  evaluateTypographySpatialIntegrity,
  evaluateVisualMassHierarchy,
  planCommercialSpaceCalibrationRound4,
  type TextLayerMeasurement,
} from "../../packages/core/src/visual-baseline/index.js";

const layer = (
  id: string,
  role: TextLayerMeasurement["role"],
  y: number,
  size: number,
  weight: number,
): TextLayerMeasurement => ({
  layer_id: id,
  role,
  text: id === "title" ? "门头没说清，顾客就走了" : "先查品类、定位、入口",
  lines: id === "title" ? ["门头没说清", "顾客就走了"] : ["先查品类、定位、入口"],
  rect: { x: 90, y, width: 760, height: size * 2.2 },
  container_rect: null,
  container_padding_required: false,
  font_family: "Songti SC",
  font_size_px: size,
  font_weight: role === "TITLE" ? 700 : 400,
  line_height_px: size * 1.1,
  letter_spacing_px: -1,
  z_index: 3,
  visibility: "VISIBLE",
  primary_visual_weight: weight,
  forced_compression: false,
  glyph_collision_detected: false,
});
const title = layer("title", "TITLE", 100, 116, 1);
const secondary = layer("secondary", "SECONDARY", 440, 48, 0.45);
const spatial = evaluateTypographySpatialIntegrity({
  text_layers: [title, secondary],
  graphic_layers: [],
  visual_collision_pairs: [],
  intentional_image_text_interlocks: [],
});
const breathing = evaluateTypographyBreathingRoom({
  title_layer: title,
  secondary_layer: secondary,
  minimum_text_to_image_distance_px: 72,
  information_groups_visually_distinct: true,
  visual_pressure_detected: false,
});
const masses = evaluateVisualMassHierarchy({
  pageDesignIntent: "COVER_ENTRY",
  elements: [
    {
      id: "hook",
      bbox_area_ratio: 0.31,
      weight: 1,
      value_contrast: 1,
      saturation_contrast: 0.2,
      position_salience: 0.9,
      negative_space_isolation: 0.9,
      scale_salience: 1,
      subject_strength: 0.8,
    },
    {
      id: "image",
      bbox_area_ratio: 0.5,
      weight: 0.55,
      value_contrast: 0.45,
      saturation_contrast: 0.4,
      position_salience: 0.6,
      negative_space_isolation: 0.3,
      scale_salience: 0.55,
      subject_strength: 0.8,
    },
    {
      id: "support",
      bbox_area_ratio: 0.08,
      weight: 0.3,
      value_contrast: 0.4,
      saturation_contrast: 0.1,
      position_salience: 0.4,
      negative_space_isolation: 0.4,
      scale_salience: 0.25,
      subject_strength: 0.1,
    },
  ],
});
const color = evaluateColorAttentionStrategy({
  grayscaleStructureScore: 90,
  colorHierarchyAligned: true,
  dominantAreaRatio: 0.72,
  supportAreaRatio: 0.2,
  accentAreaRatio: 0.08,
  hueStrategy: "neutral",
  valueStrategy: "high",
  saturationStrategy: "low",
  temperatureStrategy: "warm",
});
const attentionScores = Object.fromEntries(
  [
    "PRIMARY_HOOK_DOMINANCE",
    "ONE_SECOND_RECOGNITION",
    "THUMBNAIL_IMPACT",
    "VISUAL_MASS_HIERARCHY",
    "INFORMATION_COMPRESSION",
    "DISTINCTIVE_SILHOUETTE",
    "SCROLL_STOPPING_CONTRAST",
    "EDITORIAL_TENSION",
    "CONTENT_PROMISE_ALIGNMENT",
    "TARGET_AUDIENCE_SIGNAL",
  ].map((key) => [key, 9]),
) as never;

describe("Phase 4B-R.2.3 editorial design and cover attention", () => {
  it("keeps exactly ten non-style editorial principles", () =>
    expect(EDITORIAL_DESIGN_PRINCIPLES).toHaveLength(10));
  it("visual-mass produces primary, secondary, tertiary and one clear cover focus", () => {
    expect(masses.result).toBe("PASS");
    expect(masses.primary.id).toBe("hook");
    expect(masses.clear_primary).toBe(true);
  });
  it("visual-mass blocks multiple cover primaries", () => {
    const result = evaluateVisualMassHierarchy({
      pageDesignIntent: "COVER_ENTRY",
      elements: [
        {
          id: "a",
          bbox_area_ratio: 0.3,
          weight: 0.8,
          value_contrast: 0.8,
          saturation_contrast: 0.4,
          position_salience: 0.7,
          negative_space_isolation: 0.5,
          scale_salience: 0.8,
          subject_strength: 0.7,
        },
        {
          id: "b",
          bbox_area_ratio: 0.3,
          weight: 0.8,
          value_contrast: 0.8,
          saturation_contrast: 0.4,
          position_salience: 0.7,
          negative_space_isolation: 0.5,
          scale_salience: 0.8,
          subject_strength: 0.7,
        },
        {
          id: "c",
          bbox_area_ratio: 0.1,
          weight: 0.2,
          value_contrast: 0.2,
          saturation_contrast: 0.2,
          position_salience: 0.2,
          negative_space_isolation: 0.2,
          scale_salience: 0.2,
          subject_strength: 0.2,
        },
      ],
    });
    expect(result.hard_blocks).toContain("MULTIPLE_PRIMARY_FOCI");
  });
  it("color passes only after grayscale structure", () => expect(color.result).toBe("PASS"));
  it("color cannot rescue weak structure", () =>
    expect(
      evaluateColorAttentionStrategy({
        grayscaleStructureScore: 60,
        colorHierarchyAligned: true,
        dominantAreaRatio: 0.7,
        supportAreaRatio: 0.2,
        accentAreaRatio: 0.1,
        hueStrategy: "x",
        valueStrategy: "x",
        saturationStrategy: "x",
        temperatureStrategy: "x",
      }).hard_blocks,
    ).toContain("COLOR_RESCUES_WEAK_STRUCTURE"));
  it("color hierarchy conflict blocks", () =>
    expect(
      evaluateColorAttentionStrategy({
        grayscaleStructureScore: 90,
        colorHierarchyAligned: false,
        dominantAreaRatio: 0.7,
        supportAreaRatio: 0.2,
        accentAreaRatio: 0.1,
        hueStrategy: "x",
        valueStrategy: "x",
        saturationStrategy: "x",
        temperatureStrategy: "x",
      }).hard_blocks,
    ).toContain("COLOR_HIERARCHY_CONFLICT"));
  it("typography-as-form passes six spatial-form dimensions", () =>
    expect(
      evaluateTypographyAsForm({
        lineBreakShapeScore: 90,
        textBlockShapeScore: 91,
        edgeRelationScore: 88,
        scaleRelationScore: 92,
        verticalRhythmScore: 89,
        massDistributionScore: 90,
      }).result,
    ).toBe("PASS"));
  it("cover attention runs after spatial and breathing gates", () =>
    expect(
      evaluateCoverAttentionDominance({
        pageDesignIntent: "COVER_ENTRY",
        mode: "TYPE_DOMINANT",
        scores: attentionScores,
        spatial,
        breathing,
        visualMassResult: masses,
        colorResult: color,
        thumbnailWidth: 186,
        thumbnailHeight: 248,
        primaryHookClear: true,
        oneSecondRecognizable: true,
        informationOverloaded: false,
        coverDistinctFromInnerPage: true,
      }).result,
    ).toBe("PASS_PENDING_OPERATOR"));
  it("does not confuse content pages with covers", () =>
    expect(
      evaluateCoverAttentionDominance({
        pageDesignIntent: "CONTENT_EDITORIAL",
        mode: "TYPE_DOMINANT",
        scores: attentionScores,
        spatial,
        breathing,
        visualMassResult: masses,
        colorResult: color,
        thumbnailWidth: 186,
        thumbnailHeight: 248,
        primaryHookClear: true,
        oneSecondRecognizable: true,
        informationOverloaded: false,
        coverDistinctFromInnerPage: false,
      }).hard_blocks,
    ).toContain("COVER_INNER_PAGE_UNDIFFERENTIATED"));
  it("defines all requested hard-block codes", () =>
    expect(COVER_ATTENTION_ERROR_CODES).toHaveLength(13));
  it("plans three cold-cover routes with different attention modes", () => {
    const plans = planCommercialSpaceCalibrationRound4();
    expect(plans).toHaveLength(3);
    expect(new Set(plans.map((p) => p.attentionMode)).size).toBe(3);
  });
  it("requires at least three materially different axes per route", () =>
    expect(planCommercialSpaceCalibrationRound4().every((p) => p.diversityAxes.length >= 3)).toBe(
      true,
    ));
  it("keeps the same painpoint promise across I J K", () =>
    expect(new Set(planCommercialSpaceCalibrationRound4().map((p) => p.contentPromise)).size).toBe(
      1,
    ));
  it("does not select a candidate", () =>
    expect(planCommercialSpaceCalibrationRound4()).not.toHaveProperty("selected_candidate"));
});
