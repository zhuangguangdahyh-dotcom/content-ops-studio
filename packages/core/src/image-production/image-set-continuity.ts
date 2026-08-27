export const IMAGE_SET_PAGE_DUTIES = [
  "COVER_CLICK",
  "VALUE_DELIVERY",
  "SUMMARY_CONVERSION",
] as const;
export type ImageSetPageDuty = (typeof IMAGE_SET_PAGE_DUTIES)[number];

export const BACKGROUND_ASSET_POLICIES = [
  "DISTINCT_BACKGROUND_REQUIRED",
  "REUSE_WITH_MATERIAL_TRANSFORMATION",
  "NO_RASTER_BACKGROUND",
] as const;
export type BackgroundAssetPolicy = (typeof BACKGROUND_ASSET_POLICIES)[number];

export interface ImageSetPageStrategyInput {
  pageNumber: number;
  pageRole: string;
  pageDuty: ImageSetPageDuty;
  semanticResponsibility: string;
  visualSystemKey: string;
  backgroundAssetPolicy: BackgroundAssetPolicy;
  plannedBackgroundKey: string | null;
  shotSignature: string | null;
  compositionFamily: string;
  continuityAnchorRefs: string[];
  differenceFromPrevious: string;
}

export interface ImageSetProductionStrategyInput {
  visualMotif: string;
  continuityAnchors: string[];
  pages: ImageSetPageStrategyInput[];
}

export interface ImageSetProductionStrategyResult {
  visual_motif: string;
  continuity_anchors: string[];
  pages: ImageSetPageStrategyInput[];
  distinct_backgrounds_required: number;
  planned_distinct_backgrounds: number;
  composition_family_count: number;
  result: "PLANNED";
}

export interface ImageSetPageEvidence {
  pageNumber: number;
  pageRole: string;
  pageDuty: ImageSetPageDuty;
  semanticResponsibility: string;
  visualSystemKey: string;
  backgroundAssetPolicy: BackgroundAssetPolicy;
  backgroundSourceChecksum: string | null;
  renderedAssetChecksum: string;
  shotSignature: string | null;
  compositionFamily: string;
  continuityAnchorsPresent: string[];
  pageRoleFulfilled: boolean;
  mobileReadable: boolean;
  differenceFromPreviousVerified: boolean;
}

export interface ImageSetContinuityEvaluation {
  visual_style_continuity: "PASS" | "FAIL";
  page_duty_fulfillment: "PASS" | "FAIL";
  background_asset_diversity: "PASS" | "FAIL";
  shot_and_composition_diversity: "PASS" | "FAIL";
  narrative_progression: "PASS" | "FAIL";
  mobile_readability: "PASS" | "FAIL";
  duplicate_background_pairs: number[][];
  duplicate_shot_pairs: number[][];
  hard_blocks: string[];
  result: "PASS_PENDING_OPERATOR" | "FAIL";
}

function assertNonBlank(value: string, code: string): void {
  if (!value.trim()) throw new Error(code);
}

function duplicatePairs<T>(values: Array<{ pageNumber: number; value: T }>): number[][] {
  const pairs: number[][] = [];
  for (let left = 0; left < values.length; left += 1)
    for (let right = left + 1; right < values.length; right += 1)
      if (values[left]?.value === values[right]?.value) {
        const leftPage = values[left]?.pageNumber;
        const rightPage = values[right]?.pageNumber;
        if (leftPage !== undefined && rightPage !== undefined) pairs.push([leftPage, rightPage]);
      }
  return pairs;
}

function assertPageSequence(pages: Array<{ pageNumber: number }>): void {
  const expected = pages.map((_, index) => index + 1);
  if (pages.some((page, index) => page.pageNumber !== expected[index]))
    throw new Error("IMAGE_SET_PAGE_SEQUENCE_INVALID");
}

function assertPageDuties(pages: Array<{ pageDuty: ImageSetPageDuty }>): void {
  if (pages[0]?.pageDuty !== "COVER_CLICK") throw new Error("IMAGE_SET_COVER_DUTY_REQUIRED");
  if (pages.at(-1)?.pageDuty !== "SUMMARY_CONVERSION")
    throw new Error("IMAGE_SET_CLOSING_DUTY_REQUIRED");
  if (pages.slice(1, -1).some((page) => page.pageDuty !== "VALUE_DELIVERY"))
    throw new Error("IMAGE_SET_BODY_VALUE_DUTY_REQUIRED");
}

export function planImageSetProductionStrategy(
  input: ImageSetProductionStrategyInput,
): ImageSetProductionStrategyResult {
  if (input.pages.length < 4 || input.pages.length > 8)
    throw new Error("IMAGE_SET_PAGE_COUNT_OUT_OF_RANGE");
  assertNonBlank(input.visualMotif, "IMAGE_SET_VISUAL_MOTIF_REQUIRED");
  if (new Set(input.continuityAnchors.map((value) => value.trim()).filter(Boolean)).size < 3)
    throw new Error("IMAGE_SET_CONTINUITY_ANCHORS_INSUFFICIENT");
  assertPageSequence(input.pages);
  assertPageDuties(input.pages);

  const visualSystemKeys = new Set<string>();
  const semanticResponsibilities = new Set<string>();
  const distinctBackgrounds: Array<{ pageNumber: number; value: string }> = [];
  const shotSignatures: Array<{ pageNumber: number; value: string }> = [];
  const compositionFamilies = new Set<string>();

  for (const page of input.pages) {
    assertNonBlank(page.pageRole, "IMAGE_SET_PAGE_ROLE_REQUIRED");
    assertNonBlank(page.semanticResponsibility, "IMAGE_SET_SEMANTIC_RESPONSIBILITY_REQUIRED");
    assertNonBlank(page.visualSystemKey, "IMAGE_SET_VISUAL_SYSTEM_KEY_REQUIRED");
    assertNonBlank(page.compositionFamily, "IMAGE_SET_COMPOSITION_FAMILY_REQUIRED");
    assertNonBlank(page.differenceFromPrevious, "IMAGE_SET_PAGE_DIFFERENCE_BASIS_REQUIRED");
    if (semanticResponsibilities.has(page.semanticResponsibility))
      throw new Error("IMAGE_SET_PAGE_RESPONSIBILITIES_NOT_DISTINCT");
    semanticResponsibilities.add(page.semanticResponsibility);
    visualSystemKeys.add(page.visualSystemKey);
    compositionFamilies.add(page.compositionFamily);
    if (page.continuityAnchorRefs.length < 2)
      throw new Error("IMAGE_SET_PAGE_CONTINUITY_ANCHORS_INSUFFICIENT");
    if (page.continuityAnchorRefs.some((anchor) => !input.continuityAnchors.includes(anchor)))
      throw new Error("IMAGE_SET_PAGE_CONTINUITY_ANCHOR_UNKNOWN");

    if (page.backgroundAssetPolicy === "NO_RASTER_BACKGROUND") {
      if (page.plannedBackgroundKey !== null || page.shotSignature !== null)
        throw new Error("IMAGE_SET_NO_RASTER_BACKGROUND_MUST_NOT_DECLARE_SOURCE");
      continue;
    }
    if (!page.plannedBackgroundKey || !page.shotSignature)
      throw new Error("IMAGE_SET_BACKGROUND_AND_SHOT_REQUIRED");
    distinctBackgrounds.push({ pageNumber: page.pageNumber, value: page.plannedBackgroundKey });
    shotSignatures.push({ pageNumber: page.pageNumber, value: page.shotSignature });
  }

  if (visualSystemKeys.size !== 1) throw new Error("IMAGE_SET_VISUAL_SYSTEM_DRIFT");
  const requiredDistinct = input.pages.filter(
    (page) => page.backgroundAssetPolicy === "DISTINCT_BACKGROUND_REQUIRED",
  );
  const requiredBackgroundPairs = duplicatePairs(
    requiredDistinct.map((page) => ({
      pageNumber: page.pageNumber,
      value: page.plannedBackgroundKey,
    })),
  );
  if (requiredBackgroundPairs.length) throw new Error("IMAGE_SET_BACKGROUND_REUSE_NOT_ALLOWED");
  if (duplicatePairs(shotSignatures).length)
    throw new Error("IMAGE_SET_SHOTS_NOT_MATERIALLY_DIFFERENT");
  if (compositionFamilies.size < Math.min(3, input.pages.length))
    throw new Error("IMAGE_SET_COMPOSITION_DIVERSITY_INSUFFICIENT");

  return {
    visual_motif: input.visualMotif,
    continuity_anchors: [...input.continuityAnchors],
    pages: input.pages.map((page) => ({
      ...page,
      continuityAnchorRefs: [...page.continuityAnchorRefs],
    })),
    distinct_backgrounds_required: requiredDistinct.length,
    planned_distinct_backgrounds: new Set(distinctBackgrounds.map((item) => item.value)).size,
    composition_family_count: compositionFamilies.size,
    result: "PLANNED",
  };
}

export function evaluateImageSetContinuity(input: {
  continuityAnchors: string[];
  pages: ImageSetPageEvidence[];
}): ImageSetContinuityEvaluation {
  const hardBlocks: string[] = [];
  try {
    assertPageSequence(input.pages);
    assertPageDuties(input.pages);
  } catch (error) {
    hardBlocks.push(error instanceof Error ? error.message : "IMAGE_SET_PAGE_DUTY_INVALID");
  }

  const visualStyleContinuity = new Set(input.pages.map((page) => page.visualSystemKey)).size === 1;
  if (!visualStyleContinuity) hardBlocks.push("IMAGE_SET_VISUAL_SYSTEM_DRIFT");

  const roleFulfillment = input.pages.every((page) => page.pageRoleFulfilled);
  if (!roleFulfillment) hardBlocks.push("IMAGE_SET_PAGE_ROLE_UNFULFILLED");

  const distinctPages = input.pages.filter(
    (page) => page.backgroundAssetPolicy === "DISTINCT_BACKGROUND_REQUIRED",
  );
  const duplicateBackgroundPairs = duplicatePairs(
    distinctPages
      .filter((page) => page.backgroundSourceChecksum !== null)
      .map((page) => ({ pageNumber: page.pageNumber, value: page.backgroundSourceChecksum })),
  );
  const missingDistinctBackground = distinctPages.some((page) => !page.backgroundSourceChecksum);
  if (duplicateBackgroundPairs.length || missingDistinctBackground)
    hardBlocks.push("IMAGE_SET_DISTINCT_BACKGROUND_REQUIREMENT_FAILED");

  const rasterPages = input.pages.filter(
    (page) => page.backgroundAssetPolicy !== "NO_RASTER_BACKGROUND",
  );
  const duplicateShotPairs = duplicatePairs(
    rasterPages
      .filter((page) => page.shotSignature !== null)
      .map((page) => ({ pageNumber: page.pageNumber, value: page.shotSignature })),
  );
  const missingShot = rasterPages.some((page) => !page.shotSignature);
  const compositionCount = new Set(input.pages.map((page) => page.compositionFamily)).size;
  if (
    duplicateShotPairs.length ||
    missingShot ||
    compositionCount < Math.min(3, input.pages.length)
  )
    hardBlocks.push("IMAGE_SET_SHOT_OR_COMPOSITION_DIVERSITY_FAILED");

  const responsibilities = input.pages.map((page) => page.semanticResponsibility);
  const narrativeProgression =
    new Set(responsibilities).size === responsibilities.length &&
    input.pages.slice(1).every((page) => page.differenceFromPreviousVerified);
  if (!narrativeProgression) hardBlocks.push("IMAGE_SET_NARRATIVE_PROGRESSION_FAILED");

  const mobileReadability = input.pages.every((page) => page.mobileReadable);
  if (!mobileReadability) hardBlocks.push("IMAGE_SET_MOBILE_READABILITY_FAILED");

  const continuityCoverage = input.pages.every(
    (page) =>
      page.continuityAnchorsPresent.length >= 2 &&
      page.continuityAnchorsPresent.every((anchor) => input.continuityAnchors.includes(anchor)),
  );
  if (!continuityCoverage) hardBlocks.push("IMAGE_SET_CONTINUITY_ANCHORS_MISSING");

  const backgroundAssetDiversity =
    duplicateBackgroundPairs.length === 0 && !missingDistinctBackground;
  const shotAndCompositionDiversity =
    duplicateShotPairs.length === 0 &&
    !missingShot &&
    compositionCount >= Math.min(3, input.pages.length);
  const pageDutyFulfillment = roleFulfillment && !hardBlocks.some((code) => code.includes("DUTY"));

  return {
    visual_style_continuity: visualStyleContinuity && continuityCoverage ? "PASS" : "FAIL",
    page_duty_fulfillment: pageDutyFulfillment ? "PASS" : "FAIL",
    background_asset_diversity: backgroundAssetDiversity ? "PASS" : "FAIL",
    shot_and_composition_diversity: shotAndCompositionDiversity ? "PASS" : "FAIL",
    narrative_progression: narrativeProgression ? "PASS" : "FAIL",
    mobile_readability: mobileReadability ? "PASS" : "FAIL",
    duplicate_background_pairs: duplicateBackgroundPairs,
    duplicate_shot_pairs: duplicateShotPairs,
    hard_blocks: [...new Set(hardBlocks)],
    result: hardBlocks.length === 0 ? "PASS_PENDING_OPERATOR" : "FAIL",
  };
}
