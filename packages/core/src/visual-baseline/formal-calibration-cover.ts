export const FORMAL_CALIBRATION_TEXT_BACKGROUND_PRIORITY = [
  "NATURAL_NEGATIVE_SPACE",
  "IMAGE_CROP_OR_COMPOSITION",
  "TEXT_REGION_ADJUSTMENT",
  "LOCAL_EXPOSURE_OR_VALUE",
  "RESTRAINED_GRADIENT_OR_MASK",
  "VISIBLE_PANEL",
] as const;

export type FormalCalibrationTextBackgroundStrategy =
  (typeof FORMAL_CALIBRATION_TEXT_BACKGROUND_PRIORITY)[number];

export const FORMAL_CALIBRATION_ERROR_CODES = [
  "FORMAL_CANDIDATE_ASSET_REUSE",
  "PRIMARY_HOOK_TOO_WEAK",
  "COVER_CONTENT_SCALE_UNDIFFERENTIATED",
  "MATERIAL_ADVERTISEMENT_FIT_WEAK",
  "TEXT_BACKGROUND_PRIORITY_BYPASSED",
  "COLOR_RESCUES_WEAK_STRUCTURE",
  "ACTUAL_186_INSPECTION_MISSING",
  "FORMAL_SCORE_THRESHOLD_NOT_MET",
  "DETERMINISTIC_REPLAY_FAILED",
  "HISTORICAL_ASSET_MUTATION",
  "C0001_MUTATION",
  "DOWNSTREAM_WRITE_FORBIDDEN",
] as const;

export type FormalCalibrationErrorCode = (typeof FORMAL_CALIBRATION_ERROR_CODES)[number];

export function resolveFormalTextBackgroundStrategy(
  viableStrategies: FormalCalibrationTextBackgroundStrategy[],
): FormalCalibrationTextBackgroundStrategy {
  const viable = new Set(viableStrategies);
  const strategy = FORMAL_CALIBRATION_TEXT_BACKGROUND_PRIORITY.find((item) => viable.has(item));
  if (!strategy) throw new Error("FORMAL_TEXT_BACKGROUND_STRATEGY_UNAVAILABLE");
  return strategy;
}

export interface FormalCalibrationReadinessInput {
  selectedCandidateChecksum: string;
  formalAssetChecksum: string;
  selectedCandidatePath: string;
  formalAssetPath: string;
  fullTitleFontPx: number;
  effectiveTitleFontPxAt186: number;
  contentPageReferenceFontPx: number;
  primaryHookMassScore: number;
  materialAdvertisementRisk: number;
  selectedTextBackgroundStrategy: FormalCalibrationTextBackgroundStrategy;
  viableTextBackgroundStrategies: FormalCalibrationTextBackgroundStrategy[];
  grayscaleStructureScore: number;
  scores: {
    coverAttention: number;
    clickClarity: number;
    semanticRelevance: number;
    painpointScene: number;
    editorialSpatial: number;
    imageTextIntegration: number;
    imageQuality: number;
  };
  actual186Inspected: boolean;
  deterministicReplay: boolean;
  historicalAssetsImmutable: boolean;
  c0001Immutable: boolean;
  feishuWrites: number;
  remainingPagesCreated: number;
}

export function evaluateFormalCalibrationReadiness(input: FormalCalibrationReadinessInput) {
  const hardBlocks: FormalCalibrationErrorCode[] = [];
  if (
    input.selectedCandidateChecksum === input.formalAssetChecksum ||
    input.selectedCandidatePath === input.formalAssetPath
  )
    hardBlocks.push("FORMAL_CANDIDATE_ASSET_REUSE");
  if (input.effectiveTitleFontPxAt186 < 28 || input.primaryHookMassScore < 85)
    hardBlocks.push("PRIMARY_HOOK_TOO_WEAK");
  if (input.fullTitleFontPx < input.contentPageReferenceFontPx * 2.2)
    hardBlocks.push("COVER_CONTENT_SCALE_UNDIFFERENTIATED");
  if (input.materialAdvertisementRisk > 30) hardBlocks.push("MATERIAL_ADVERTISEMENT_FIT_WEAK");
  if (
    resolveFormalTextBackgroundStrategy(input.viableTextBackgroundStrategies) !==
    input.selectedTextBackgroundStrategy
  )
    hardBlocks.push("TEXT_BACKGROUND_PRIORITY_BYPASSED");
  if (input.grayscaleStructureScore < 80) hardBlocks.push("COLOR_RESCUES_WEAK_STRUCTURE");
  if (!input.actual186Inspected) hardBlocks.push("ACTUAL_186_INSPECTION_MISSING");
  if (
    input.scores.coverAttention < 90 ||
    input.scores.clickClarity < 90 ||
    input.scores.semanticRelevance < 85 ||
    input.scores.painpointScene < 85 ||
    input.scores.editorialSpatial < 85 ||
    input.scores.imageTextIntegration < 85 ||
    input.scores.imageQuality < 85
  )
    hardBlocks.push("FORMAL_SCORE_THRESHOLD_NOT_MET");
  if (!input.deterministicReplay) hardBlocks.push("DETERMINISTIC_REPLAY_FAILED");
  if (!input.historicalAssetsImmutable) hardBlocks.push("HISTORICAL_ASSET_MUTATION");
  if (!input.c0001Immutable) hardBlocks.push("C0001_MUTATION");
  if (input.feishuWrites !== 0 || input.remainingPagesCreated !== 0)
    hardBlocks.push("DOWNSTREAM_WRITE_FORBIDDEN");
  return {
    hard_blocks: [...new Set(hardBlocks)],
    ready_for_calibration_g4: hardBlocks.length === 0,
    result: hardBlocks.length ? ("BLOCKED" as const) : ("PASS_PENDING_OPERATOR" as const),
    calibration_g4_decision: "PENDING_OPERATOR" as const,
    formal_style_lock_created: false as const,
  };
}

export function createCalibrationStyleLockPreview() {
  return {
    cover_locked_rules: [
      "Primary Hook is the first visual mass and remains legible at actual 186x248 output.",
      "Cover uses a clearly stronger scale contrast than Content pages.",
      "A real storefront and entrance visibly support the business Painpoint.",
      "Renderer owns every formal Chinese glyph.",
      "Color follows a valid grayscale hierarchy and does not rescue weak structure.",
    ],
    group_shared_rules: [
      "Use Renderer-verified modern Chinese serif typography with truthful weight reporting.",
      "Preserve mature, restrained, low-saturation commercial-space editorial quality.",
      "Maintain real Chinese urban commercial context and authentic materials.",
      "Keep image and type in an explainable spatial and semantic relationship.",
    ],
    content_page_allowed_variations: [
      "Reduce type scale for sustained reading and evidence progression.",
      "Vary grid, crop, image placement, pacing and information density by page intent.",
      "Use image-dominant, evidence-led or diagnostic compositions when content requires them.",
      "Do not mechanically repeat Cover-scale typography, the Cover crop or its attention device.",
    ],
    creates_style_lock: false as const,
  };
}
