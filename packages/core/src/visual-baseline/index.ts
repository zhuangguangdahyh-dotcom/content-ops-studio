export const UNIVERSAL_VISUAL_DECISION_PRECEDENCE = [
  "SAFETY_AUTHENTICITY_AUTHORIZATION",
  "OPERATOR_CURRENT_REQUEST",
  "APPROVED_STYLE_LOCK",
  "PROJECT_VISUAL_PROFILE",
  "GLOBAL_USER_PREFERENCE",
  "PER_CONTENT_PAINPOINT_CONTENT_EVIDENCE_ASSETS",
  "INDUSTRY_PACK_AND_OVERLAY",
  "PLATFORM_PACK",
  "UNIVERSAL_DEFAULT_VISUAL_BASELINE",
] as const;

export const COMPOSITION_FAMILIES = [
  "FULL_BLEED_ANCHORED",
  "ASYMMETRIC_NEGATIVE_SPACE",
  "IMAGE_TEXT_INTERLOCK",
  "CROP_LAYERED",
  "MULTI_EVIDENCE_EDITORIAL",
  "TYPOGRAPHIC_FIELD",
  "DIAGNOSTIC_COMPOSITION",
  "SPLIT_DEPTH",
  "EDGE_ANCHORED",
  "SUBJECT_OVERLAP",
] as const;
export type CompositionFamily = (typeof COMPOSITION_FAMILIES)[number];

export const SPATIAL_RELATIONSHIPS = [
  "ASYMMETRIC_BALANCE",
  "PROPORTIONAL_CONTRAST",
  "IMAGE_TEXT_INTERLOCK",
  "SUBJECT_CROP_TENSION",
  "FOREGROUND_BACKGROUND_LAYERING",
  "EDGE_TENSION",
  "PRIMARY_SECONDARY_AXIS",
  "CROSS_REGION_ALIGNMENT",
  "PURPOSEFUL_NEGATIVE_SPACE",
  "VISUAL_DEPTH_RELATION",
] as const;
export type SpatialRelationship = (typeof SPATIAL_RELATIONSHIPS)[number];

export const PAINPOINT_SCENE_RELATIONS = [
  "DIRECTLY_SUPPORTS_PAINPOINT",
  "DIRECTLY_SUPPORTS_VALUE",
  "SUPPORTS_CONTRAST",
  "NEUTRAL_CATEGORY_RELEVANCE",
  "CONTRADICTS_PAINPOINT",
  "DECORATIVE_ONLY",
] as const;
export type PainpointSceneRelation = (typeof PAINPOINT_SCENE_RELATIONS)[number];

export const UNIVERSAL_VISUAL_ERROR_CODES = [
  "DEFAULT_FONT_POLICY_VIOLATION",
  "SONGTI_WEIGHT_UNAVAILABLE",
  "SONGTI_FONT_UNAVAILABLE",
  "CORE_TEXT_TOO_SMALL",
  "TYPOGRAPHIC_HIERARCHY_WEAK",
  "EDITORIAL_SPATIAL_TENSION_WEAK",
  "IMAGE_TEXT_INTEGRATION_WEAK",
  "NEGATIVE_SPACE_PURPOSE_WEAK",
  "GENERIC_TEXT_OVER_PHOTO_LAYOUT",
  "LAYOUT_FAMILY_REPETITION",
  "CANDIDATE_SET_VISUALLY_HOMOGENEOUS",
  "PAINPOINT_SCENE_CONTRADICTION",
  "PAINPOINT_VISUAL_EVIDENCE_WEAK",
  "GENERIC_STOREFRONT_VISUAL",
  "LOCALE_SCENE_FIT_WEAK",
  "DIAGNOSTIC_MARKER_UNEXPLAINED",
  "TYPOGRAPHY_SPATIAL_INTEGRITY_BLOCKED",
  "TEXT_TEXT_OVERLAP",
  "TEXT_GRAPHIC_OCCLUSION",
  "TEXT_REGION_COLLISION",
  "INSUFFICIENT_CONTAINER_PADDING",
  "LINE_GLYPH_COLLISION",
  "FORCED_TRACKING_DISTORTION",
  "ORPHAN_CHARACTER_BREAK",
  "COMPETING_PRIMARY_TEXT",
  "DENSITY_FORCED_COMPRESSION",
  "TYPOGRAPHIC_BREATHING_ROOM_WEAK",
] as const;
export type UniversalVisualErrorCode = (typeof UNIVERSAL_VISUAL_ERROR_CODES)[number];

export const MODERN_CHINESE_SERIF_CANDIDATES = [
  "Songti SC",
  "Source Han Serif SC",
  "Noto Serif CJK SC",
  "Noto Serif SC",
  "STSong",
] as const;

export interface FontAvailability {
  family: string;
  weights: number[];
  chineseSerif: boolean;
}

export interface TypographyResolutionInput {
  currentOperatorFont?: string;
  projectFont?: string;
  brandFont?: string;
  industryFont?: string;
  globalDefaultEnabled: boolean;
  availableFonts: FontAvailability[];
}

export interface ResolvedTypographyStrategy {
  source: "CURRENT_OPERATOR" | "PROJECT" | "BRAND" | "INDUSTRY" | "UNIVERSAL_DEFAULT";
  requested_font_family: string;
  resolved_font_family: string;
  resolved_title_weight: number;
  resolved_subtitle_weight: number;
  resolved_body_weight: number;
  synthetic_bold: false;
  font_downloaded: false;
  silent_pingfang_fallback: false;
}

function findFont(fonts: FontAvailability[], family: string): FontAvailability | undefined {
  return fonts.find((font) => font.family.toLowerCase() === family.toLowerCase());
}

function weightAtOrBelow(font: FontAvailability, preferred: number[]): number | undefined {
  return (
    preferred.find((weight) => font.weights.includes(weight)) ??
    [...font.weights].sort((a, b) => b - a)[0]
  );
}

export function resolveTypographyStrategy(
  input: TypographyResolutionInput,
): ResolvedTypographyStrategy {
  const explicit = [
    ["CURRENT_OPERATOR", input.currentOperatorFont],
    ["PROJECT", input.projectFont],
    ["BRAND", input.brandFont],
    ["INDUSTRY", input.industryFont],
  ] as const;
  const selected = explicit.find(([, family]) => Boolean(family?.trim()));
  if (selected) {
    const requested = selected[1];
    if (!requested) throw new Error("FONT_SELECTION_INVARIANT");
    const font = findFont(input.availableFonts, requested);
    if (!font)
      throw Object.assign(new Error(`Requested font is unavailable: ${requested}`), {
        code: "DEFAULT_FONT_POLICY_VIOLATION",
      });
    const title = weightAtOrBelow(font, [800, 700]);
    const subtitle = weightAtOrBelow(font, [500, 400]);
    if (title === undefined || subtitle === undefined)
      throw Object.assign(new Error(`Requested font has no usable weight: ${requested}`), {
        code: "SONGTI_WEIGHT_UNAVAILABLE",
      });
    return {
      source: selected[0],
      requested_font_family: requested,
      resolved_font_family: font.family,
      resolved_title_weight: title,
      resolved_subtitle_weight: subtitle,
      resolved_body_weight: font.weights.includes(400) ? 400 : subtitle,
      synthetic_bold: false,
      font_downloaded: false,
      silent_pingfang_fallback: false,
    };
  }
  if (!input.globalDefaultEnabled)
    throw Object.assign(new Error("No typography rule resolved."), {
      code: "DEFAULT_FONT_POLICY_VIOLATION",
    });
  for (const family of MODERN_CHINESE_SERIF_CANDIDATES) {
    const font = findFont(input.availableFonts, family);
    if (!font?.chineseSerif) continue;
    const title = [800, 700].find((weight) => font.weights.includes(weight));
    const subtitle = [500, 400].find((weight) => font.weights.includes(weight));
    if (title !== undefined && subtitle !== undefined)
      return {
        source: "UNIVERSAL_DEFAULT",
        requested_font_family: "MODERN_CHINESE_SERIF",
        resolved_font_family: font.family,
        resolved_title_weight: title,
        resolved_subtitle_weight: subtitle,
        resolved_body_weight: font.weights.includes(400) ? 400 : subtitle,
        synthetic_bold: false,
        font_downloaded: false,
        silent_pingfang_fallback: false,
      };
  }
  throw Object.assign(new Error("No Renderer-verified modern Chinese serif is available."), {
    code: input.availableFonts.some((font) => font.chineseSerif)
      ? "SONGTI_WEIGHT_UNAVAILABLE"
      : "SONGTI_FONT_UNAVAILABLE",
  });
}

const EDITORIAL_DIMENSIONS = [
  "HIERARCHY",
  "SPATIAL_AXIS",
  "ASYMMETRY",
  "PROPORTION",
  "NEGATIVE_SPACE_PURPOSE",
  "SUBJECT_CROP",
  "DEPTH",
  "IMAGE_TEXT_RELATION",
  "TENSION",
  "READING_PATH",
] as const;
export type EditorialDimension = (typeof EDITORIAL_DIMENSIONS)[number];

function checkedScores<T extends string>(
  dimensions: readonly T[],
  scores: Record<T, number>,
  maximum: number,
) {
  return dimensions.map((dimension) => {
    const score = scores[dimension];
    if (!Number.isInteger(score) || score < 0 || score > maximum)
      throw new Error(`VISUAL_SCORE_INVALID:${dimension}`);
    return {
      dimension,
      weight: maximum,
      score,
      reason: `${dimension} evaluated against rendered pixels.`,
    };
  });
}

export function evaluateEditorialSpatialComposition(input: {
  scores: Record<EditorialDimension, number>;
  spatialRelationships: SpatialRelationship[];
  genericTextOverPhoto: boolean;
  purposefulNegativeSpace: boolean;
}) {
  const dimensions = checkedScores(EDITORIAL_DIMENSIONS, input.scores, 10);
  const hardBlocks: UniversalVisualErrorCode[] = [];
  if (input.genericTextOverPhoto) hardBlocks.push("GENERIC_TEXT_OVER_PHOTO_LAYOUT");
  if (input.spatialRelationships.length < 2) hardBlocks.push("EDITORIAL_SPATIAL_TENSION_WEAK");
  if (!input.purposefulNegativeSpace) hardBlocks.push("NEGATIVE_SPACE_PURPOSE_WEAK");
  const totalScore = dimensions.reduce((sum, item) => sum + item.score, 0);
  return {
    dimensions,
    total_score: totalScore,
    threshold: 80,
    hard_blocks: [...new Set(hardBlocks)],
    result: hardBlocks.length
      ? ("BLOCKED" as const)
      : totalScore >= 80
        ? ("PASS_PENDING_OPERATOR" as const)
        : ("FAIL" as const),
    operator_approval_required: true as const,
  };
}

const INTEGRATION_DIMENSIONS = [
  "SUBJECT_OR_EDGE_RELATION",
  "NEGATIVE_SPACE_RELATION",
  "FOCUS_COOPERATION",
  "EVIDENCE_VISIBILITY",
  "READING_PATH_INTEGRATION",
] as const;
export type IntegrationDimension = (typeof INTEGRATION_DIMENSIONS)[number];

export function evaluateImageTextIntegration(input: {
  scores: Record<IntegrationDimension, number>;
  anchorRelationships: string[];
  genericTextOverPhoto: boolean;
  keyEvidenceObscured: boolean;
}) {
  const dimensions = checkedScores(INTEGRATION_DIMENSIONS, input.scores, 20);
  const hardBlocks: UniversalVisualErrorCode[] = [];
  if (input.genericTextOverPhoto) hardBlocks.push("GENERIC_TEXT_OVER_PHOTO_LAYOUT");
  if (!input.anchorRelationships.length || input.keyEvidenceObscured)
    hardBlocks.push("IMAGE_TEXT_INTEGRATION_WEAK");
  const totalScore = dimensions.reduce((sum, item) => sum + item.score, 0);
  return {
    dimensions,
    total_score: totalScore,
    threshold: 85,
    hard_blocks: [...new Set(hardBlocks)],
    result: hardBlocks.length
      ? ("BLOCKED" as const)
      : totalScore >= 85
        ? ("PASS_PENDING_OPERATOR" as const)
        : ("FAIL" as const),
    operator_approval_required: true as const,
  };
}

export const DIVERSITY_WEIGHTS = {
  COMPOSITION_FAMILY_DIVERSITY: 15,
  TEXT_REGION_DIVERSITY: 10,
  SHOT_SCALE_DIVERSITY: 10,
  CAMERA_VIEWPOINT_DIVERSITY: 10,
  ASSET_STRUCTURE_DIVERSITY: 15,
  SEMANTIC_ROLE_DIVERSITY: 10,
  VISUAL_READING_PATH_DIVERSITY: 10,
  IMAGE_TEXT_INTEGRATION_DIVERSITY: 10,
  NEAR_TEMPLATE_DUPLICATE_RISK: 10,
} as const;
export type DiversityDimension = keyof typeof DIVERSITY_WEIGHTS;

export function evaluateCandidateSetVisualDiversity(input: {
  scores: Record<DiversityDimension, number>;
  compositionFamilies: CompositionFamily[];
  textRegions: string[];
  assetStructures: string[];
  readingPaths: string[];
  nearTemplateDuplicateRisk: "LOW" | "MEDIUM" | "HIGH" | "BLOCKING";
}) {
  const dimensions = Object.entries(DIVERSITY_WEIGHTS).map(([dimension, weight]) => {
    const score = input.scores[dimension as DiversityDimension];
    if (!Number.isInteger(score) || score < 0 || score > weight)
      throw new Error(`CANDIDATE_DIVERSITY_SCORE_INVALID:${dimension}`);
    return {
      dimension: dimension as DiversityDimension,
      weight,
      score,
      reason: `${dimension} compared across the complete candidate set.`,
    };
  });
  const hardBlocks: UniversalVisualErrorCode[] = [];
  const requiredDistinctCount = Math.min(3, Math.max(2, input.compositionFamilies.length));
  if (
    new Set(input.compositionFamilies).size < requiredDistinctCount ||
    new Set(input.assetStructures).size < requiredDistinctCount
  )
    hardBlocks.push("CANDIDATE_SET_VISUALLY_HOMOGENEOUS");
  if (
    new Set(input.textRegions).size < requiredDistinctCount ||
    new Set(input.readingPaths).size < requiredDistinctCount
  )
    hardBlocks.push("LAYOUT_FAMILY_REPETITION");
  if (input.nearTemplateDuplicateRisk === "BLOCKING")
    hardBlocks.push("CANDIDATE_SET_VISUALLY_HOMOGENEOUS");
  const totalScore = dimensions.reduce((sum, item) => sum + item.score, 0);
  return {
    dimensions,
    total_score: totalScore,
    threshold: 85,
    hard_blocks: [...new Set(hardBlocks)],
    result: hardBlocks.length
      ? ("BLOCKED" as const)
      : totalScore >= 85
        ? ("PASS_PENDING_OPERATOR" as const)
        : ("FAIL" as const),
    operator_approval_required: true as const,
  };
}

export const PAINPOINT_CONGRUENCE_WEIGHTS = {
  VISIBLE_PAINPOINT_EVIDENCE: 30,
  COPY_SCENE_RELATION: 25,
  BUSINESS_SCENE_RECOGNITION: 20,
  CONTRAST_OR_DIAGNOSTIC_VALIDITY: 25,
} as const;
export type PainpointDimension = keyof typeof PAINPOINT_CONGRUENCE_WEIGHTS;

export function evaluatePainpointSceneCongruence(input: {
  strategy: string;
  relation: PainpointSceneRelation;
  scores: Record<PainpointDimension, number>;
  visibleEvidence: string[];
  diagnosticMarkers: Array<{ explained: boolean }>;
  storefrontGeneric: boolean;
}) {
  const dimensions = Object.entries(PAINPOINT_CONGRUENCE_WEIGHTS).map(([dimension, weight]) => {
    const score = input.scores[dimension as PainpointDimension];
    if (!Number.isInteger(score) || score < 0 || score > weight)
      throw new Error(`PAINPOINT_SCENE_SCORE_INVALID:${dimension}`);
    return {
      dimension: dimension as PainpointDimension,
      weight,
      score,
      reason: `${dimension} grounded in visible scene evidence.`,
    };
  });
  const hardBlocks: UniversalVisualErrorCode[] = [];
  if (["PAINPOINT_FIRST", "RISK_FIRST", "QUESTION_FIRST"].includes(input.strategy)) {
    if (["CONTRADICTS_PAINPOINT", "DECORATIVE_ONLY"].includes(input.relation))
      hardBlocks.push("PAINPOINT_SCENE_CONTRADICTION");
    if (input.relation === "NEUTRAL_CATEGORY_RELEVANCE" || !input.visibleEvidence.length)
      hardBlocks.push("PAINPOINT_VISUAL_EVIDENCE_WEAK");
  }
  if (input.storefrontGeneric) hardBlocks.push("GENERIC_STOREFRONT_VISUAL");
  if (input.diagnosticMarkers.some((marker) => !marker.explained))
    hardBlocks.push("DIAGNOSTIC_MARKER_UNEXPLAINED");
  const totalScore = dimensions.reduce((sum, item) => sum + item.score, 0);
  return {
    dimensions,
    total_score: totalScore,
    threshold: 85,
    hard_blocks: [...new Set(hardBlocks)],
    result: hardBlocks.length
      ? ("BLOCKED" as const)
      : totalScore >= 85
        ? ("PASS_PENDING_OPERATOR" as const)
        : ("FAIL" as const),
    operator_approval_required: true as const,
  };
}

export function evaluateLocaleSceneFit(input: {
  audienceLocale: string;
  projectRegion: string | null;
  resolvedSceneLocale: string;
  localeEvidence: string[];
  regionMateriallyChangesScene: boolean;
  operatorRequestedLocale?: string;
}) {
  const target = input.operatorRequestedLocale ?? input.projectRegion ?? input.audienceLocale;
  const aligned =
    input.resolvedSceneLocale.includes(target) || target.includes(input.resolvedSceneLocale);
  const regionQuestionRequired =
    !input.operatorRequestedLocale && !input.projectRegion && input.regionMateriallyChangesScene;
  const totalScore = aligned && input.localeEvidence.length >= 2 ? 95 : aligned ? 80 : 40;
  const hardBlocks: UniversalVisualErrorCode[] = [];
  if (!aligned || regionQuestionRequired) hardBlocks.push("LOCALE_SCENE_FIT_WEAK");
  return {
    target_locale: target,
    region_question_required: regionQuestionRequired,
    total_score: totalScore,
    threshold: 80,
    hard_blocks: [...new Set(hardBlocks)],
    result: hardBlocks.length ? ("BLOCKED" as const) : ("PASS_PENDING_OPERATOR" as const),
    operator_approval_required: true as const,
  };
}

export interface CalibrationRound2Concept {
  candidateId: "CCC-CAL-SPACE-001-D" | "CCC-CAL-SPACE-001-E" | "CCC-CAL-SPACE-001-F";
  hook: "门店老板，\n你的门头在劝退顾客吗";
  secondary: "先查品类、定位、入口这3处";
  compositionFamily: CompositionFamily;
  spatialRelationships: SpatialRelationship[];
  textRegion: string;
  assetStructure: string;
  readingPath: string;
  semanticRole: "DIRECT_PAINPOINT_SCENE" | "DIRECT_BUSINESS_SCENE" | "EVIDENCE_ASSET";
  painpointRelation: PainpointSceneRelation;
}

export function planCommercialSpaceCalibrationRound2(): CalibrationRound2Concept[] {
  const hook = "门店老板，\n你的门头在劝退顾客吗" as const;
  const secondary = "先查品类、定位、入口这3处" as const;
  return [
    {
      candidateId: "CCC-CAL-SPACE-001-D",
      hook,
      secondary,
      compositionFamily: "IMAGE_TEXT_INTERLOCK",
      spatialRelationships: ["IMAGE_TEXT_INTERLOCK", "EDGE_TENSION", "PURPOSEFUL_NEGATIVE_SPACE"],
      textRegion: "RIGHT_EDGE_VERTICAL_FIELD",
      assetStructure: "SINGLE_DIRECT_PAINPOINT_SCENE",
      readingPath: "STOREFRONT_EVIDENCE_TO_INTERLOCKED_TITLE",
      semanticRole: "DIRECT_PAINPOINT_SCENE",
      painpointRelation: "DIRECTLY_SUPPORTS_PAINPOINT",
    },
    {
      candidateId: "CCC-CAL-SPACE-001-E",
      hook,
      secondary,
      compositionFamily: "DIAGNOSTIC_COMPOSITION",
      spatialRelationships: [
        "PRIMARY_SECONDARY_AXIS",
        "CROSS_REGION_ALIGNMENT",
        "PROPORTIONAL_CONTRAST",
      ],
      textRegion: "LOWER_LEFT_DIAGNOSTIC_AXIS",
      assetStructure: "SINGLE_SCENE_WITH_THREE_EVIDENCE_MARKERS",
      readingPath: "TITLE_TO_THREE_DIAGNOSTIC_REGIONS",
      semanticRole: "DIRECT_BUSINESS_SCENE",
      painpointRelation: "DIRECTLY_SUPPORTS_PAINPOINT",
    },
    {
      candidateId: "CCC-CAL-SPACE-001-F",
      hook,
      secondary,
      compositionFamily: "MULTI_EVIDENCE_EDITORIAL",
      spatialRelationships: [
        "FOREGROUND_BACKGROUND_LAYERING",
        "SUBJECT_CROP_TENSION",
        "ASYMMETRIC_BALANCE",
      ],
      textRegion: "TOP_BAND_AND_EDGE_CAPTION",
      assetStructure: "ONE_MASTER_IMAGE_PLUS_THREE_SAME_IMAGE_CROPS",
      readingPath: "MASTER_SCENE_TO_THREE_EVIDENCE_CROPS_TO_COPY",
      semanticRole: "EVIDENCE_ASSET",
      painpointRelation: "SUPPORTS_CONTRAST",
    },
  ];
}

export interface CalibrationRound3Concept {
  candidateId: "CCC-CAL-SPACE-001-G" | "CCC-CAL-SPACE-001-H";
  hook: "门店老板，\n你的门头在劝退顾客吗";
  secondary: "先查品类、定位、入口这3处";
  visualDirection: "BREATHABLE_EDITORIAL" | "SPATIAL_TENSION_MINIMAL";
  compositionFamily: CompositionFamily;
  spatialRelationships: SpatialRelationship[];
  textRegion: string;
  assetStructure: string;
  readingPath: string;
}

export function planCommercialSpaceCalibrationRound3(): CalibrationRound3Concept[] {
  const hook = "门店老板，\n你的门头在劝退顾客吗" as const;
  const secondary = "先查品类、定位、入口这3处" as const;
  return [
    {
      candidateId: "CCC-CAL-SPACE-001-G",
      hook,
      secondary,
      visualDirection: "BREATHABLE_EDITORIAL",
      compositionFamily: "CROP_LAYERED",
      spatialRelationships: [
        "ASYMMETRIC_BALANCE",
        "CROSS_REGION_ALIGNMENT",
        "PURPOSEFUL_NEGATIVE_SPACE",
      ],
      textRegion: "CENTER_LEFT_BREATHING_FIELD",
      assetStructure: "ONE_MASTER_PLUS_ONE_RESTRAINED_SAME_SOURCE_CROP",
      readingPath: "TITLE_TO_STOREFRONT_TO_SUPPORTING_COPY",
    },
    {
      candidateId: "CCC-CAL-SPACE-001-H",
      hook,
      secondary,
      visualDirection: "SPATIAL_TENSION_MINIMAL",
      compositionFamily: "ASYMMETRIC_NEGATIVE_SPACE",
      spatialRelationships: ["EDGE_TENSION", "SUBJECT_CROP_TENSION", "PRIMARY_SECONDARY_AXIS"],
      textRegion: "CENTER_RIGHT_NATURAL_NEGATIVE_SPACE",
      assetStructure: "ONE_UNINTERRUPTED_FULL_STOREFRONT_SCENE",
      readingPath: "ARCHITECTURAL_EDGE_TO_TITLE_TO_RECESSED_ENTRANCE",
    },
  ];
}

export * from "./typography-spatial.js";
export * from "./editorial-attention.js";
export * from "./formal-calibration-cover.js";
export * from "./text-background-contrast.js";
export * from "./calibration-g4.js";
