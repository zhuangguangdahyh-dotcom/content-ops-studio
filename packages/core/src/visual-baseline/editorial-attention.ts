import type {
  evaluateTypographyBreathingRoom,
  evaluateTypographySpatialIntegrity,
} from "./typography-spatial.js";

export const EDITORIAL_DESIGN_KNOWLEDGE_VERSION = "1.0.0" as const;
export const EDITORIAL_DESIGN_KNOWLEDGE_LAYER = "EDITORIAL_DESIGN_KNOWLEDGE_LAYER" as const;

export const EDITORIAL_DESIGN_PRINCIPLES = [
  "SYSTEM_BEFORE_STYLE",
  "CONSISTENCY_IS_SYSTEM_NOT_SAMENESS",
  "HIERARCHY_BEFORE_DECORATION",
  "FORM_BEFORE_COLOR",
  "NEGATIVE_SPACE_IS_ACTIVE",
  "TYPE_IS_VISUAL_FORM",
  "IMAGE_AND_TYPE_MUST_DIALOGUE",
  "CONTROLLED_TENSION",
  "GRID_IS_SCAFFOLD_NOT_CAGE",
  "RESTRAINT_IS_EDITING",
] as const;
export type EditorialDesignPrinciple = (typeof EDITORIAL_DESIGN_PRINCIPLES)[number];

export const EDITORIAL_DESIGN_GRAMMAR = [
  "HIERARCHY",
  "SCALE_CONTRAST",
  "VISUAL_MASS",
  "ASYMMETRIC_BALANCE",
  "ACTIVE_NEGATIVE_SPACE",
  "GRID_DISCIPLINE",
  "CONTROLLED_GRID_BREAK",
  "CROP_TENSION",
  "EDGE_RELATION",
  "TYPE_SHAPE",
  "LINE_BREAK_SHAPE",
  "IMAGE_TYPE_DIALOGUE",
  "VALUE_CONTRAST",
  "SATURATION_CONTRAST",
  "COLOR_QUANTITY",
  "INFORMATION_COMPRESSION",
  "DISTINCTIVE_SILHOUETTE",
  "EDITORIAL_PACING",
] as const;

export const PAGE_DESIGN_INTENTS = [
  "COVER_ENTRY",
  "CONTENT_EDITORIAL",
  "EVIDENCE_PAGE",
  "DIAGNOSTIC_PAGE",
  "SUMMARY_PAGE",
  "CTA_PAGE",
] as const;
export type PageDesignIntent = (typeof PAGE_DESIGN_INTENTS)[number];

export const COVER_ATTENTION_MODES = [
  "TYPE_DOMINANT",
  "IMAGE_DOMINANT",
  "TYPE_IMAGE_COLLISION",
  "CROP_DOMINANT",
  "COLOR_DOMINANT",
  "EVIDENCE_DOMINANT",
  "CONTRAST_DOMINANT",
  "HYBRID_ATTENTION",
] as const;
export type CoverAttentionMode = (typeof COVER_ATTENTION_MODES)[number];

export const COVER_ATTENTION_ERROR_CODES = [
  "COVER_ATTENTION_DOMINANCE_BLOCKED",
  "PRIMARY_HOOK_TOO_WEAK",
  "MULTIPLE_PRIMARY_FOCI",
  "ONE_SECOND_RECOGNITION_FAILED",
  "THUMBNAIL_IMPACT_WEAK",
  "VISUAL_MASS_HIERARCHY_WEAK",
  "COVER_INFORMATION_OVERLOADED",
  "COVER_SILHOUETTE_GENERIC",
  "SCROLL_STOPPING_CONTRAST_WEAK",
  "EDITORIAL_TENSION_WEAK",
  "COLOR_RESCUES_WEAK_STRUCTURE",
  "COLOR_HIERARCHY_CONFLICT",
  "COVER_INNER_PAGE_UNDIFFERENTIATED",
] as const;
export type CoverAttentionErrorCode = (typeof COVER_ATTENTION_ERROR_CODES)[number];

export const COVER_ATTENTION_DIMENSIONS = [
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
] as const;
export type CoverAttentionDimension = (typeof COVER_ATTENTION_DIMENSIONS)[number];

export interface VisualMassElement {
  id: string;
  bbox_area_ratio: number;
  weight: number;
  value_contrast: number;
  saturation_contrast: number;
  position_salience: number;
  negative_space_isolation: number;
  scale_salience: number;
  subject_strength: number;
}

export function evaluateVisualMassHierarchy(input: {
  elements: VisualMassElement[];
  pageDesignIntent: PageDesignIntent;
}) {
  if (input.elements.length < 3) throw new Error("VISUAL_MASS_ELEMENTS_INSUFFICIENT");
  const ranked = input.elements
    .map((element) => ({
      id: element.id,
      mass_score: Number(
        (
          element.bbox_area_ratio * 18 +
          element.weight * 12 +
          element.value_contrast * 16 +
          element.saturation_contrast * 7 +
          element.position_salience * 8 +
          element.negative_space_isolation * 14 +
          element.scale_salience * 13 +
          element.subject_strength * 12
        ).toFixed(2),
      ),
    }))
    .sort((a, b) => b.mass_score - a.mass_score);
  const [primary, secondary, tertiary] = ranked;
  if (primary === undefined || secondary === undefined || tertiary === undefined)
    throw new Error("VISUAL_MASS_ELEMENTS_INSUFFICIENT");
  const clearPrimary = primary.mass_score >= secondary.mass_score * 1.18;
  const hardBlocks: CoverAttentionErrorCode[] = [];
  if (input.pageDesignIntent === "COVER_ENTRY" && !clearPrimary)
    hardBlocks.push("MULTIPLE_PRIMARY_FOCI", "VISUAL_MASS_HIERARCHY_WEAK");
  return {
    primary,
    secondary,
    tertiary,
    clear_primary: clearPrimary,
    hard_blocks: [...new Set(hardBlocks)],
    result: hardBlocks.length ? ("BLOCKED" as const) : ("PASS" as const),
  };
}

export function evaluateColorAttentionStrategy(input: {
  grayscaleStructureScore: number;
  colorHierarchyAligned: boolean;
  dominantAreaRatio: number;
  supportAreaRatio: number;
  accentAreaRatio: number;
  hueStrategy: string;
  valueStrategy: string;
  saturationStrategy: string;
  temperatureStrategy: string;
}) {
  const hardBlocks: CoverAttentionErrorCode[] = [];
  if (input.grayscaleStructureScore < 80) hardBlocks.push("COLOR_RESCUES_WEAK_STRUCTURE");
  if (!input.colorHierarchyAligned) hardBlocks.push("COLOR_HIERARCHY_CONFLICT");
  const ratioTotal = input.dominantAreaRatio + input.supportAreaRatio + input.accentAreaRatio;
  if (Math.abs(ratioTotal - 1) > 0.01) throw new Error("COLOR_AREA_RATIO_INVALID");
  return {
    grayscale_check:
      input.grayscaleStructureScore >= 80 ? "PASS" : "COLOR_NOT_ALLOWED_TO_RESCUE_STRUCTURE",
    hierarchy_aligned: input.colorHierarchyAligned,
    color_dimensions: {
      hue: input.hueStrategy,
      value: input.valueStrategy,
      saturation: input.saturationStrategy,
      temperature: input.temperatureStrategy,
      quantity: {
        dominant: input.dominantAreaRatio,
        support: input.supportAreaRatio,
        accent: input.accentAreaRatio,
      },
    },
    hard_blocks: hardBlocks,
    result: hardBlocks.length ? ("BLOCKED" as const) : ("PASS" as const),
  };
}

export function evaluateTypographyAsForm(input: {
  lineBreakShapeScore: number;
  textBlockShapeScore: number;
  edgeRelationScore: number;
  scaleRelationScore: number;
  verticalRhythmScore: number;
  massDistributionScore: number;
}) {
  const scores = [
    input.lineBreakShapeScore,
    input.textBlockShapeScore,
    input.edgeRelationScore,
    input.scaleRelationScore,
    input.verticalRhythmScore,
    input.massDistributionScore,
  ];
  if (scores.some((score) => !Number.isInteger(score) || score < 0 || score > 100))
    throw new Error("TYPOGRAPHY_AS_FORM_SCORE_INVALID");
  const total = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  return {
    total_score: total,
    threshold: 85,
    result: total >= 85 ? ("PASS" as const) : ("FAIL" as const),
  };
}

export function evaluateCoverAttentionDominance(input: {
  pageDesignIntent: PageDesignIntent;
  mode: CoverAttentionMode;
  scores: Record<CoverAttentionDimension, number>;
  spatial: ReturnType<typeof evaluateTypographySpatialIntegrity>;
  breathing: ReturnType<typeof evaluateTypographyBreathingRoom>;
  visualMassResult: ReturnType<typeof evaluateVisualMassHierarchy>;
  colorResult: ReturnType<typeof evaluateColorAttentionStrategy>;
  thumbnailWidth: 186;
  thumbnailHeight: 248;
  primaryHookClear: boolean;
  oneSecondRecognizable: boolean;
  informationOverloaded: boolean;
  coverDistinctFromInnerPage: boolean;
}) {
  const hardBlocks: CoverAttentionErrorCode[] = [];
  if (input.spatial.result !== "PASS" || input.breathing.result !== "PASS")
    hardBlocks.push("COVER_ATTENTION_DOMINANCE_BLOCKED");
  if (input.pageDesignIntent !== "COVER_ENTRY")
    hardBlocks.push("COVER_INNER_PAGE_UNDIFFERENTIATED");
  if (!input.primaryHookClear) hardBlocks.push("PRIMARY_HOOK_TOO_WEAK");
  if (!input.oneSecondRecognizable) hardBlocks.push("ONE_SECOND_RECOGNITION_FAILED");
  if (input.informationOverloaded) hardBlocks.push("COVER_INFORMATION_OVERLOADED");
  if (!input.coverDistinctFromInnerPage) hardBlocks.push("COVER_INNER_PAGE_UNDIFFERENTIATED");
  hardBlocks.push(...input.visualMassResult.hard_blocks, ...input.colorResult.hard_blocks);
  const dimensions = COVER_ATTENTION_DIMENSIONS.map((dimension) => {
    const score = input.scores[dimension];
    if (!Number.isInteger(score) || score < 0 || score > 10)
      throw new Error(`COVER_ATTENTION_SCORE_INVALID:${dimension}`);
    return { dimension, score, maximum: 10 };
  });
  const totalScore = dimensions.reduce((sum, item) => sum + item.score, 0);
  if (input.scores.THUMBNAIL_IMPACT < 8) hardBlocks.push("THUMBNAIL_IMPACT_WEAK");
  if (input.scores.DISTINCTIVE_SILHOUETTE < 8) hardBlocks.push("COVER_SILHOUETTE_GENERIC");
  if (input.scores.SCROLL_STOPPING_CONTRAST < 8) hardBlocks.push("SCROLL_STOPPING_CONTRAST_WEAK");
  if (input.scores.EDITORIAL_TENSION < 8) hardBlocks.push("EDITORIAL_TENSION_WEAK");
  return {
    mode: input.mode,
    page_design_intent: input.pageDesignIntent,
    thumbnail_inspection: "ACTUAL_186x248_ONE_SECOND",
    dimensions,
    total_score: totalScore,
    threshold: 85,
    hard_blocks: [...new Set(hardBlocks)],
    result: hardBlocks.length
      ? ("BLOCKED" as const)
      : totalScore >= 85
        ? ("PASS_PENDING_OPERATOR" as const)
        : ("FAIL" as const),
    operator_selection_required: true as const,
  };
}

export interface CalibrationRound4Concept {
  candidateId: "CCC-CAL-SPACE-001-I" | "CCC-CAL-SPACE-001-J" | "CCC-CAL-SPACE-001-K";
  pageDesignIntent: "COVER_ENTRY";
  attentionMode: CoverAttentionMode;
  primaryHook: string;
  secondaryHook: string;
  contentPromise: string;
  compositionFamily: string;
  textRegion: string;
  assetStructure: string;
  readingPath: string;
  diversityAxes: string[];
}

export function planCommercialSpaceCalibrationRound4(): CalibrationRound4Concept[] {
  const promise = "帮助门店老板核对门头是否清楚传达品类、定位与入口。";
  return [
    {
      candidateId: "CCC-CAL-SPACE-001-I",
      pageDesignIntent: "COVER_ENTRY",
      attentionMode: "TYPE_DOMINANT",
      primaryHook: "门头没说清，顾客就走了",
      secondaryHook: "门店老板先查品类、定位和入口",
      contentPromise: promise,
      compositionFamily: "TYPOGRAPHIC_FIELD",
      textRegion: "OVERSCALE_LEFT_FIELD",
      assetStructure: "QUIET_STOREFRONT_TEXTURE_WITH_TYPE_MASS",
      readingPath: "OVERSCALE_HOOK_TO_RESTRAINED_SCENE_TO_PROMISE",
      diversityAxes: ["copy_strategy", "attention_mode", "composition", "type_scale", "crop"],
    },
    {
      candidateId: "CCC-CAL-SPACE-001-J",
      pageDesignIntent: "COVER_ENTRY",
      attentionMode: "CROP_DOMINANT",
      primaryHook: "顾客看不懂你的门头",
      secondaryHook: "不是审美问题，是进店判断断了",
      contentPromise: promise,
      compositionFamily: "CROP_LAYERED",
      textRegion: "LOWER_EDGE_COUNTERWEIGHT",
      assetStructure: "TIGHT_ENTRANCE_CROP_WITH_CLEAR_CATEGORY_AMBIGUITY",
      readingPath: "CROPPED_ENTRANCE_TO_HOOK_TO_PROMISE",
      diversityAxes: [
        "copy_strategy",
        "attention_mode",
        "composition",
        "image",
        "crop",
        "type_scale",
      ],
    },
    {
      candidateId: "CCC-CAL-SPACE-001-K",
      pageDesignIntent: "COVER_ENTRY",
      attentionMode: "TYPE_IMAGE_COLLISION",
      primaryHook: "门头正在劝退谁？",
      secondaryHook: "3处看懂品类、定位和入口",
      contentPromise: promise,
      compositionFamily: "IMAGE_TEXT_INTERLOCK",
      textRegion: "DIAGONAL_EDGE_INTERLOCK",
      assetStructure: "STOREFRONT_BOUNDARY_AND_TYPE_COLLISION",
      readingPath: "BOUNDARY_LINE_TO_QUESTION_HOOK_TO_THREE_POINT_PROMISE",
      diversityAxes: [
        "copy_strategy",
        "attention_mode",
        "composition",
        "image",
        "color",
        "type_scale",
      ],
    },
  ];
}
