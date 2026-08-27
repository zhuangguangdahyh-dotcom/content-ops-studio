export const TEXT_BACKGROUND_CONTRAST_ERROR_CODES = [
  "TEXT_BACKGROUND_CONTRAST_INTEGRITY_BLOCKED",
  "TEXT_BACKGROUND_CONTRAST_UNSTABLE",
  "TEXT_BACKGROUND_COMPLEXITY_BLOCKED",
  "SECONDARY_TEXT_CONTRAST_TOO_LOW",
  "PRIMARY_TEXT_LOCAL_CONTRAST_FAILURE",
  "LOW_CONTRAST_AREA_EXCESSIVE",
  "COLOR_HIERARCHY_REDUCES_LEGIBILITY",
] as const;

export type TextBackgroundContrastErrorCode = (typeof TEXT_BACKGROUND_CONTRAST_ERROR_CODES)[number];

export const FORMAL_TEXT_LAYER_ROLES = [
  "PRIMARY_HOOK",
  "SECONDARY_SIGNAL",
  "BODY",
  "LABEL",
  "CAPTION",
  "BRAND",
  "PAGE_NUMBER",
] as const;

export type FormalTextLayerRole = (typeof FORMAL_TEXT_LAYER_ROLES)[number];

export const FORMAL_COVER_GATE_ORDER = [
  "MECHANICAL_QA",
  "TYPOGRAPHY_POLICY",
  "TYPOGRAPHY_SPATIAL_INTEGRITY",
  "TEXT_BACKGROUND_CONTRAST_INTEGRITY",
  "TEXT_BACKGROUND_CONTRAST_STABILITY",
  "BACKGROUND_COMPLEXITY_UNDER_TEXT",
  "TYPOGRAPHY_BREATHING_ROOM",
  "THUMBNAIL_QA",
  "COVER_CLICK_CLARITY",
  "VISUAL_SEMANTIC_RELEVANCE",
  "PAINPOINT_SCENE_CONGRUENCE",
  "LOCALE_SCENE_FIT",
  "EDITORIAL_SPATIAL_COMPOSITION",
  "IMAGE_TEXT_INTEGRATION",
  "COVER_ATTENTION_DOMINANCE",
  "VISUAL_MASS_HIERARCHY",
  "GREYSCALE_HIERARCHY",
  "COLOR_INTELLIGENCE",
  "TYPOGRAPHY_AS_FORM",
  "IMAGE_QUALITY",
  "ACTUAL_PIXEL_INSPECTION",
  "DETERMINISTIC_REPLAY",
] as const;

export interface TextLayerContrastInput {
  text_layer_id: string;
  role: FormalTextLayerRole;
  foreground_opacity: number;
  minimum_local_contrast: number;
  low_percentile_local_contrast: number;
  median_local_contrast: number;
  worst_local_region_median_contrast: number;
  low_contrast_area_ratio: number;
  contrast_variance: number;
  foreground_background_edge_conflict: number;
  background_complexity_under_text: number;
  actual_pixel_readable: boolean;
}

function isPrimary(role: FormalTextLayerRole): boolean {
  return role === "PRIMARY_HOOK";
}

function isSecondaryReadingLayer(role: FormalTextLayerRole): boolean {
  return role === "SECONDARY_SIGNAL" || role === "BODY";
}

export function evaluateTextLayerContrast(input: TextLayerContrastInput) {
  const errors: TextBackgroundContrastErrorCode[] = [];
  const primary = isPrimary(input.role);
  const medianThreshold = primary ? 5 : 5.5;
  const lowPercentileThreshold = primary ? 3.5 : 4;
  const lowAreaThreshold = primary ? 0.12 : 0.08;
  const complexityThreshold = primary ? 0.015 : 0.01;

  if (
    input.median_local_contrast < medianThreshold ||
    input.low_percentile_local_contrast < lowPercentileThreshold ||
    input.worst_local_region_median_contrast < lowPercentileThreshold ||
    !input.actual_pixel_readable
  ) {
    errors.push("TEXT_BACKGROUND_CONTRAST_INTEGRITY_BLOCKED");
    if (primary) errors.push("PRIMARY_TEXT_LOCAL_CONTRAST_FAILURE");
    if (input.role === "SECONDARY_SIGNAL") errors.push("SECONDARY_TEXT_CONTRAST_TOO_LOW");
  }
  if (input.low_contrast_area_ratio > lowAreaThreshold) errors.push("LOW_CONTRAST_AREA_EXCESSIVE");
  if (
    input.contrast_variance > 8 ||
    input.foreground_background_edge_conflict > 0.12 ||
    input.minimum_local_contrast < 2
  )
    errors.push("TEXT_BACKGROUND_CONTRAST_UNSTABLE");
  if (input.background_complexity_under_text > complexityThreshold)
    errors.push("TEXT_BACKGROUND_COMPLEXITY_BLOCKED");
  if (
    isSecondaryReadingLayer(input.role) &&
    (input.foreground_opacity < 0.92 || input.median_local_contrast < medianThreshold)
  )
    errors.push("COLOR_HIERARCHY_REDUCES_LEGIBILITY");

  return {
    text_layer_id: input.text_layer_id,
    result: errors.length === 0 ? ("PASS" as const) : ("FAIL" as const),
    errors: [...new Set(errors)],
    thresholds: {
      median_local_contrast: medianThreshold,
      low_percentile_local_contrast: lowPercentileThreshold,
      maximum_low_contrast_area_ratio: lowAreaThreshold,
      maximum_background_complexity: complexityThreshold,
    },
  };
}

export function evaluateTextBackgroundContrastIntegrity(inputs: TextLayerContrastInput[]) {
  const layers = inputs.map(evaluateTextLayerContrast);
  const hardBlocks = [...new Set(layers.flatMap((layer) => layer.errors))];
  return {
    layers,
    hard_blocks: hardBlocks,
    result: hardBlocks.length === 0 ? ("PASS" as const) : ("FAIL" as const),
    gate_order: [...FORMAL_COVER_GATE_ORDER],
  };
}
