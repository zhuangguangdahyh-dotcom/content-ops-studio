export const CALIBRATION_COVER_LOCKED_RULES = [
  "Cover Primary Hook must own the first visual mass.",
  "Cover type scale must be materially stronger than Content Page type scale.",
  "Primary Hook must be quickly recognizable in the actual 186x248 thumbnail.",
  "Supporting Signal must remain independently clear and readable while subordinate.",
  "Renderer must compose every formal Chinese glyph.",
  "Typography Spatial Integrity must pass.",
  "Typography Breathing Room must pass.",
  "Text-Background Raster Contrast must pass for every text layer.",
  "Background Complexity must not damage text readability.",
  "Cover Attention must pass.",
  "Click Clarity must pass.",
  "The background asset must directly serve the Audience, Painpoint or Content Value.",
  "Color must not rescue a weak grayscale hierarchy.",
] as const;

export const CALIBRATION_GROUP_SHARED_RULES = [
  "Use a Renderer-verified modern Chinese serif system.",
  "Maintain one coherent typography logic across the group.",
  "Maintain mature, professional and editorially designed visual completion.",
  "Image and typography must have an explainable spatial or semantic relationship.",
  "Every page visual must serve the current Page Intent.",
  "Maintain truthful boundaries between real assets and AI-generated assets.",
  "Maintain one group visual language without mechanically copying a Layout.",
] as const;

export const CALIBRATION_CONTENT_PAGE_ALLOWED_VARIATIONS = [
  "Content Page type may be materially smaller than Cover type.",
  "Content pages prioritize reading, understanding, progression and visual rhythm.",
  "Grid may change.",
  "Composition Family may change.",
  "Crop may change.",
  "Text Region may change.",
  "Image-to-text ratio may change.",
  "Image Dominant composition is allowed.",
  "Evidence Dominant composition is allowed.",
  "Diagnostic Composition is allowed.",
  "Multi-Evidence Editorial composition is allowed.",
  "Information density, color area and visual intensity may change with Page Intent.",
  "The Cover Attention Device must not be forcibly copied to content pages.",
] as const;

export const CALIBRATION_PROHIBITED_DEVIATIONS = [
  "Do not mechanically copy the current Cover coordinates.",
  "Do not turn a fixed top-left or top large title into the group template.",
  "Do not turn white wall, black type and frontal storefront into a Universal default visual.",
  "Do not force TYPE_DOMINANT onto all content pages.",
  "Do not copy Cover-scale oversized typography onto Content Pages.",
  "Do not manufacture design character through text collisions.",
  "Do not manufacture hierarchy by reducing text contrast.",
  "Do not use a premium-looking background unrelated to the content.",
  "Do not use ordinary presentation-card layouts.",
  "Do not let AI generate formal Chinese text.",
  "Do not let an aggregate quality score offset any Hard Block.",
] as const;

export const CALIBRATION_VALIDATED_SYSTEMS = [
  "UNIVERSAL_DEFAULT_VISUAL_BASELINE_V1",
  "EDITORIAL_DESIGN_KNOWLEDGE_V1",
  "COVER_ATTENTION_INTELLIGENCE_V1",
  "TYPOGRAPHY_SPATIAL_INTEGRITY_V1",
  "TYPOGRAPHY_BREATHING_ROOM_V1",
  "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1",
] as const;

export const CALIBRATION_UNIVERSAL_TEMPLATE_EXCLUSIONS = [
  "LAYOUT",
  "COLOR",
  "STOREFRONT",
  "TITLE_POSITION",
  "CROP",
  "TYPE_DOMINANT",
] as const;

export interface CalibrationG4Binding {
  projectId: string;
  contentId: string;
  contentVersion: string;
  copyVersion: string;
  visualPlanVersion: string;
  firstPageVersion: string;
  assetId: string;
  assetChecksum: string;
  formalRunId: string;
}

export function calibrationG4TargetVersion(binding: CalibrationG4Binding): string {
  return [
    binding.contentVersion,
    binding.copyVersion,
    binding.visualPlanVersion,
    binding.firstPageVersion,
    binding.assetChecksum,
  ].join(":");
}

export function assertCalibrationG4Ready(input: {
  expected: CalibrationG4Binding;
  actual: CalibrationG4Binding;
  attentionMode: string;
  reviewStatus: string;
  reviewDecision: string;
  formalCoverEligible: boolean;
  formalHardBlocks: string[];
  contrastResult: string;
  contrastHardBlocks: string[];
}): void {
  for (const key of Object.keys(input.expected) as Array<keyof CalibrationG4Binding>) {
    if (input.expected[key] !== input.actual[key])
      throw Object.assign(new Error(`Calibration G4 binding mismatch: ${key}`), {
        code: "CALIBRATION_G4_BINDING_CONFLICT",
      });
  }
  if (input.attentionMode !== "TYPE_DOMINANT")
    throw Object.assign(new Error("Calibration attention mode is not the approved mode."), {
      code: "CALIBRATION_G4_ATTENTION_MODE_CONFLICT",
    });
  if (
    input.reviewStatus !== "AWAITING_USER_APPROVAL" ||
    input.reviewDecision !== "PENDING_OPERATOR"
  )
    throw Object.assign(new Error("Calibration G4 review is not pending Operator approval."), {
      code: "CALIBRATION_G4_STATE_CONFLICT",
    });
  if (
    !input.formalCoverEligible ||
    input.formalHardBlocks.length > 0 ||
    input.contrastResult !== "PASS" ||
    input.contrastHardBlocks.length > 0
  )
    throw Object.assign(new Error("Calibration G4 formal QA evidence is not eligible."), {
      code: "CALIBRATION_G4_QA_BLOCKED",
    });
}
