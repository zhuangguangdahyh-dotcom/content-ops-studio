import { createHash } from "node:crypto";
import type {
  AssetChannel,
  FeedbackClass,
  ImageProductionVisualMode,
  VisualRuleScope,
} from "./index.js";
import type {
  AccountGoal,
  CoverConversionStrategy,
  CoverObjective,
  CoverSemanticRole,
} from "../cover-conversion/index.js";
import type { CompositionFamily } from "../visual-baseline/index.js";
import type { CoverAttentionMode, PageDesignIntent } from "../visual-baseline/index.js";

export const PROJECT_VISUAL_PROFILE_MATURITY = [
  "COLD_START",
  "LEARNING",
  "MATURE",
  "REVIEW_REQUIRED",
] as const;
export type ProjectVisualProfileMaturity = (typeof PROJECT_VISUAL_PROFILE_MATURITY)[number];

export interface StrategyPreferenceSet {
  assetSourcePreferences: AssetChannel[];
  backgroundPreferences: string[];
  imageRealismPreferences: string[];
  photographyPreferences: string[];
  illustrationPreferences: string[];
  characterPreferences: string[];
  spacePreferences: string[];
  productPreferences: string[];
  compositionPreferences: string[];
  visualFocusPreferences: string[];
  whitespacePreferences: string[];
  visualDensityPreferences: string[];
  typographyPreferences: string[];
  fontFamilyPreferences: string[];
  titleSizePreferences: string[];
  bodySizePreferences: string[];
  fontWeightPreferences: string[];
  lineHeightPreferences: string[];
  letterSpacingPreferences: string[];
  alignmentPreferences: string[];
  colorPreferences: string[];
  accentColorPreferences: string[];
  contrastPreferences: string[];
  effectPreferences: string[];
  shadowPreferences: string[];
  gradientPreferences: string[];
  maskPreferences: string[];
  borderPreferences: string[];
  cornerPreferences: string[];
  texturePreferences: string[];
  titleFontPreferences?: string[];
  subtitleFontPreferences?: string[];
  bodyFontPreferences?: string[];
  compositionFamilyPreferences?: CompositionFamily[];
  imageTextIntegrationPreferences?: string[];
  spatialTensionPreferences?: string[];
  negativeSpacePreferences?: string[];
  preferredCoverAttentionModes?: CoverAttentionMode[];
  coverVisualMassPreferences?: string[];
  coverScaleContrastPreferences?: string[];
  coverGridDisciplinePreferences?: string[];
  coverGridBreakPreferences?: string[];
  coverCropPreferences?: string[];
  coverNegativeSpacePreferences?: string[];
  coverColorContrastPreferences?: string[];
  coverColorQuantityPreferences?: string[];
  coverTypographyShapePreferences?: string[];
  coverInfoDensityPreferences?: string[];
  coverVisualTensionPreferences?: string[];
}

export interface LearningProjectVisualProfile extends StrategyPreferenceSet {
  profileId: string;
  projectId: string;
  profileVersion: string;
  maturityStatus: ProjectVisualProfileMaturity;
  preferredVisualModes: ImageProductionVisualMode[];
  formalTextPolicy: "RENDERER_ONLY";
  imageTextPolicy: "TEXT_FREE_GENERATED_VISUALS" | "AUTHORIZED_INCIDENTAL_TEXT_ONLY";
  preferredPageCounts: number[];
  preferredCandidateCounts: number[];
  productionBatchPreferences: string[];
  qualityThresholds: {
    directionCandidate: number;
    formalAsset: number;
    group: number;
    coreDimensionFloor: number;
  };
  approvedReferenceElements: string[];
  rejectedReferenceElements: string[];
  mustRules: string[];
  mustNotRules: string[];
  preferRules: string[];
  avoidRules: string[];
  confirmedFeedbackRefs: string[];
  ruleVersionRefs: string[];
  knownExceptions: string[];
  reviewRequiredReasons: string[];
  coverAccountGoalPreferences?: AccountGoal[];
  coverObjectivePreferences?: CoverObjective[];
  coverPrimaryHookLengthPreferences?: string[];
  coverPrimaryHookLinePreferences?: string[];
  coverSecondaryLinePreferences?: string[];
  coverTextProminencePreferences?: string[];
  coverTextAreaPreferences?: string[];
  coverTextToImageRatioPreferences?: string[];
  coverThumbnailFontPreferences?: string[];
  coverAlignmentPreferences?: string[];
  coverContrastPreferences?: string[];
  coverEffectPreferences?: string[];
  coverBackgroundSemanticPreferences?: CoverSemanticRole[];
  coverApprovedReferenceElements?: string[];
  coverRejectedReferenceElements?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ConfirmedVisualRuleInput {
  ruleId: string;
  version: number;
  statement: string;
  type: "MUST" | "MUST_NOT" | "PREFER" | "AVOID";
  scope: VisualRuleScope;
  status: "ACTIVE" | "SUPERSEDED" | "DISABLED" | "FORGOTTEN";
}

export interface DynamicVisualStrategyInput {
  runId: string;
  createdAt: string;
  projectProfile: {
    projectId: string;
    industry: string;
    objective: string;
    profileVersion: string;
  };
  subject: { summary: string; identityAnchors: string[] };
  audience: { summary: string; trustNeeds: string[] };
  platformPack: { platform: string; aspectRatio: string; mobileFirst: boolean };
  industryVisualPack: {
    packId: string;
    defaultVisualModes: ImageProductionVisualMode[];
    assetSourcePriority: AssetChannel[];
    identityInvariants: string[];
    hardBlocks: string[];
  };
  overlays: Array<{ overlayId: string; rules: string[] }>;
  projectVisualProfile: LearningProjectVisualProfile;
  globalUserVisualPreferences: Partial<StrategyPreferenceSet>;
  painpoint: { painpointId: string; summary: string; semanticTags: string[] };
  contentPackage: {
    contentId: string;
    theme: string;
    structure: string[];
    pageRoles: Array<{ pageNumber: number; role: string; semanticPurpose: string }>;
  };
  accountGoal?: AccountGoal;
  coverObjective?: CoverObjective;
  coverCopyPackage?: {
    coverPrimaryHook: string;
    coverSecondaryLine: string;
    coverSupportingCopy: string;
  };
  coverConversionStrategy?: CoverConversionStrategy;
  coverClickClarityRequirements?: string[];
  semanticRelevanceRequirements?: string[];
  universalVisualDefaultVersion?: string;
  typographyDefaultPolicyVersion?: string;
  editorialSpatialPolicyVersion?: string;
  coverSpecificProjectPreferences?: string[];
  currentOperatorRequest: {
    summary: string;
    scope: "CURRENT_SET";
    requestedAssetChannel?: AssetChannel;
    requestedVisualMode?: ImageProductionVisualMode;
    requestedColorDirection?: string;
    requestedCompositionDirection?: string;
    requestedFontFamily?: string;
  } | null;
  availableProjectAssets: Array<{
    assetId: string;
    kind: string;
    authorized: boolean;
    semanticTags: string[];
  }>;
  evidenceAssets: Array<{ assetId: string; verified: boolean; semanticTags: string[] }>;
  approvedReferences: string[];
  rejectedReferences: string[];
  historicalGateResults: Array<{ gate: "G4" | "G5"; decision: string; profileVersion: string }>;
  historicalFeedbackEvents: Array<{
    eventId: string;
    feedbackClass: FeedbackClass;
    scope: VisualRuleScope;
    statement: string;
  }>;
  confirmedRules: ConfirmedVisualRuleInput[];
  constraints: {
    costTier: "LOW" | "STANDARD" | "PREMIUM";
    timeTier: "FAST" | "STANDARD" | "EXTENDED";
    minimumFormalQuality: number;
    maximumCandidateCount: 1 | 2 | 3;
  };
}

export interface DynamicVisualStrategyPlanArtifact {
  strategy_plan_id: string;
  project_id: string;
  content_id: string;
  project_profile_version: string;
  profile_maturity_status: ProjectVisualProfileMaturity;
  synthesis_status: "PLANNED" | "BLOCKED_REVIEW_REQUIRED";
  strategy_summary: string;
  decision_precedence: string[];
  page_strategies: PageStrategyArtifact[];
  candidate_directions: CandidateDirectionArtifact[];
  image_count: number;
  candidate_count: number;
  production_batches: Array<{
    batch_number: number;
    page_numbers: number[];
    gate: "DIRECTION_SELECTION" | "G4" | "STYLE_LOCK";
  }>;
  quality_thresholds: {
    direction_candidate: number;
    formal_asset: number;
    group: number;
    core_dimension_floor: number;
  };
  consistency_risks: string[];
  confidence_report_id: string;
  ambiguity_report_id: string;
  selection_reasons: string[];
  current_override_applied: boolean;
  cover_visual_strategy?: CoverConversionStrategy;
  cover_text_prominence?: string;
  cover_text_to_image_ratio?: string;
  cover_background_semantic_role?: CoverSemanticRole;
  cover_thumbnail_targets?: Array<"310x414" | "186x248">;
  cover_click_clarity_target?: number;
  semantic_relevance_target?: number;
  cover_candidate_count?: number;
  cover_candidate_diversity_reason?: string;
  universal_visual_default_version?: string;
  typography_default_policy_version?: string;
  editorial_spatial_policy_version?: string;
  resolved_typography_strategy?: string;
  resolved_composition_family?: CompositionFamily;
  image_text_integration_strategy?: string;
  candidate_diversity_strategy?: string;
  painpoint_scene_strategy?: string;
  editorial_design_knowledge_version?: "1.0.0";
  cover_attention_plan_ref?: string;
  cover_attention_mode?: CoverAttentionMode;
  long_term_profile_mutated: false;
  industry_pack_mutated: false;
  global_preference_mutated: false;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}

export interface PageStrategyArtifact {
  page_number: number;
  page_role: string;
  page_design_intent?: PageDesignIntent;
  asset_channel: AssetChannel;
  visual_mode: ImageProductionVisualMode;
  background_direction: string;
  image_subject: string;
  composition_direction: string;
  image_realism: string;
  color_strategy: string;
  typography: {
    font_character: string;
    title_size_strategy: string;
    body_size_strategy: string;
    font_weight: string;
    line_height: string;
    letter_spacing: string;
    alignment: string;
    text_region: string;
    text_image_ratio: string;
  };
  effects: {
    effects: string[];
    mask: string;
    shadow: string;
    gradient: string;
    border: string;
    texture: string;
  };
  selection_reason: string;
}

export interface CandidateDirectionArtifact {
  candidate_key: string;
  asset_channel: AssetChannel;
  visual_mode: ImageProductionVisualMode;
  subject_direction: string;
  composition_direction: string;
  palette_direction: string;
  material_difference_basis: string;
}

export interface VisualStrategyConfidenceReportArtifact {
  report_id: string;
  strategy_plan_id: string;
  overall_confidence: number;
  confidence_level: "LOW" | "MEDIUM" | "HIGH";
  dimensions: Array<{ dimension: string; score: number; reason: string }>;
  source_coverage: {
    required_source_count: number;
    available_source_count: number;
    missing_sources: string[];
  };
  review_required: boolean;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}

export interface VisualAmbiguityReportArtifact {
  report_id: string;
  strategy_plan_id: string;
  major_ambiguities: Array<{
    code: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "BLOCKING";
    description: string;
    affected_decisions: string[];
  }>;
  blocking: boolean;
  recommended_clarification_questions: string[];
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}

export interface DynamicVisualStrategyResult {
  plan: DynamicVisualStrategyPlanArtifact;
  confidence: VisualStrategyConfidenceReportArtifact;
  ambiguity: VisualAmbiguityReportArtifact;
}

const PRECEDENCE = [
  "SAFETY_AUTHENTICITY_AUTHORIZATION",
  "OPERATOR_CURRENT_REQUEST",
  "APPROVED_STYLE_LOCK",
  "CONFIRMED_PROJECT_RULES_AND_PROFILE",
  "CONFIRMED_GLOBAL_VISUAL_PREFERENCES",
  "PER_CONTENT_EVIDENCE_ASSET_AND_SEMANTIC_NEED",
  "INDUSTRY_PACK_AND_OVERLAY_PRIORS",
  "PLATFORM_PACK",
  "UNIVERSAL_DEFAULT_VISUAL_BASELINE",
];

function digest(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function first(values: string[] | undefined, fallback: string): string {
  return values?.find((value) => value.trim().length > 0) ?? fallback;
}

function coverContextIsGeneric(input: DynamicVisualStrategyInput): boolean {
  const subject = input.subject.summary.normalize("NFKC").trim().toLowerCase();
  return (
    !input.audience.summary.trim() ||
    !input.painpoint.summary.trim() ||
    subject.length < 6 ||
    ["professional services", "generic professional services", "专业服务", "通用专业服务"].includes(
      subject,
    )
  );
}

function semanticRoleForFamily(family: ReturnType<typeof semanticFamily>): CoverSemanticRole {
  if (family === "SPACE") return "DIRECT_BUSINESS_SCENE";
  if (family === "EVIDENCE") return "EVIDENCE_ASSET";
  if (family === "PERSON") return "SUBJECT_PERSON";
  if (family === "PRODUCT") return "PRODUCT_SUBJECT";
  return "ABSTRACT_SEMANTIC";
}

function activeRules(input: DynamicVisualStrategyInput): ConfirmedVisualRuleInput[] {
  return input.confirmedRules.filter(
    (rule) => rule.status === "ACTIVE" && rule.scope === "CURRENT_PROJECT",
  );
}

function semanticFamily(
  input: DynamicVisualStrategyInput,
): "SPACE" | "EVIDENCE" | "PERSON" | "PRODUCT" | "PROCESS" | "STORY" | "EDITORIAL" {
  const corpus = [
    input.projectProfile.industry,
    input.painpoint.summary,
    ...input.painpoint.semanticTags,
    input.contentPackage.theme,
    ...input.contentPackage.structure,
    ...input.contentPackage.pageRoles.flatMap((page) => [page.role, page.semanticPurpose]),
  ]
    .join(" ")
    .toLowerCase();
  if (/space|interior|hotel|retail|restaurant|空间|装修|酒店|门店/u.test(corpus)) return "SPACE";
  if (/evidence|proof|credential|verification|证据|核验|资质|案例/u.test(corpus)) return "EVIDENCE";
  if (/person|founder|expert|doctor|人物|创始人|专家|医生/u.test(corpus)) return "PERSON";
  if (/product|consumer|商品|产品/u.test(corpus)) return "PRODUCT";
  if (/process|step|system|framework|流程|步骤|结构/u.test(corpus)) return "PROCESS";
  if (/story|journey|emotion|故事|经历|情绪/u.test(corpus)) return "STORY";
  return "EDITORIAL";
}

function maturityCandidateCount(input: DynamicVisualStrategyInput): number {
  if (input.projectVisualProfile.maturityStatus === "REVIEW_REQUIRED") return 0;
  if (input.currentOperatorRequest) return 1;
  if (input.projectVisualProfile.maturityStatus === "MATURE") return 1;
  if (input.projectVisualProfile.maturityStatus === "LEARNING")
    return Math.min(2, input.constraints.maximumCandidateCount);
  const coldCount =
    input.constraints.costTier === "LOW" || input.constraints.timeTier === "FAST" ? 2 : 3;
  return Math.min(coldCount, input.constraints.maximumCandidateCount);
}

function familyDirections(family: ReturnType<typeof semanticFamily>): Array<{
  channel: AssetChannel;
  mode: ImageProductionVisualMode;
  subject: string;
  composition: string;
  difference: string;
}> {
  switch (family) {
    case "SPACE":
      return [
        {
          channel: "PROJECT_ASSET",
          mode: "SCENE_SERIES",
          subject: "A verified whole-space scene showing business identity and circulation",
          composition: "Corrected architectural wide view with a readable operational anchor",
          difference: "whole-space context and circulation",
        },
        {
          channel: "PROJECT_ASSET",
          mode: "SCENE_SERIES",
          subject: "A materially credible zone or service detail from the same space DNA",
          composition: "Compressed detail view with different axis, scale and focal distance",
          difference: "detail-scale material and service evidence",
        },
        {
          channel: "MIXED_ASSET",
          mode: "EVIDENCE_LED",
          subject: "Authentic project evidence paired with restrained editorial hierarchy",
          composition: "Evidence-first field with Renderer-owned explanation",
          difference: "evidence-led interpretation rather than another scene angle",
        },
      ];
    case "EVIDENCE":
      return [
        {
          channel: "EVIDENCE_ASSET",
          mode: "EVIDENCE_LED",
          subject: "Authentic, authorized evidence relevant to the claim",
          composition: "Evidence-first hierarchy with legible verification context",
          difference: "literal verified evidence",
        },
        {
          channel: "PROGRAMMATIC_GRAPHIC",
          mode: "EDITORIAL_SERIES",
          subject: "The relationships that must be checked rather than a fabricated document",
          composition: "Structured correspondence and boundary diagram",
          difference: "precise relational explanation",
        },
        {
          channel: "AI_GENERATED_VISUAL",
          mode: "EDITORIAL_SERIES",
          subject: "A text-free metaphor grounded in the content's verification logic",
          composition: "Asymmetric editorial object with progressive layers",
          difference: "abstract semantic metaphor",
        },
      ];
    case "PERSON":
      return [
        {
          channel: "PROJECT_ASSET",
          mode: "CHARACTER_SERIES",
          subject: "The authorized Subject in a real working context",
          composition: "Documentary environmental portrait with contextual negative space",
          difference: "working-context documentary portrait",
        },
        {
          channel: "PROJECT_ASSET",
          mode: "EDITORIAL_SERIES",
          subject: "A quieter identity-led Subject portrait",
          composition: "Editorial crop with a distinct focal distance and type field",
          difference: "identity-first editorial portrait",
        },
        {
          channel: "MIXED_ASSET",
          mode: "MIXED",
          subject: "Authorized Subject imagery and authentic contextual material",
          composition: "Subject-plus-context composition without fake evidence",
          difference: "subject and contextual evidence combination",
        },
      ];
    case "PRODUCT":
      return [
        {
          channel: "PROJECT_ASSET",
          mode: "PRODUCT_LIFESTYLE",
          subject: "The authorized product in its actual use context",
          composition: "Use-led scene with product identity intact",
          difference: "real use context",
        },
        {
          channel: "PROJECT_ASSET",
          mode: "EDITORIAL_SERIES",
          subject: "Product material, mechanism or detail",
          composition: "Controlled close view with clear physical hierarchy",
          difference: "material and mechanism detail",
        },
        {
          channel: "PROGRAMMATIC_GRAPHIC",
          mode: "EVIDENCE_LED",
          subject: "Verified product comparison or operating logic",
          composition: "Precise comparison structure with Renderer text",
          difference: "evidence-based comparison",
        },
      ];
    case "PROCESS":
      return [
        {
          channel: "PROGRAMMATIC_GRAPHIC",
          mode: "EDITORIAL_SERIES",
          subject: "The content-specific relationship or sequence",
          composition: "Non-template relational structure with one dominant reading path",
          difference: "precise relationship model",
        },
        {
          channel: "MIXED_ASSET",
          mode: "MIXED",
          subject: "Authorized context combined with a restrained process layer",
          composition: "Context anchor plus sequence rhythm",
          difference: "contextual process explanation",
        },
        {
          channel: "PURE_TYPOGRAPHY",
          mode: "PURE_TYPOGRAPHY",
          subject: "The approved copy's verbal hierarchy",
          composition: "Editorial type rhythm derived from the page argument",
          difference: "copy-led hierarchy without illustrative subject",
        },
      ];
    case "STORY":
      return [
        {
          channel: "PROJECT_ASSET",
          mode: "SCENE_SERIES",
          subject: "An authorized scene at the story's decisive moment",
          composition: "Breathing documentary frame with narrative negative space",
          difference: "decisive real scene",
        },
        {
          channel: "AI_GENERATED_VISUAL",
          mode: "EDITORIAL_SERIES",
          subject: "A text-free emotional metaphor specific to this story",
          composition: "Atmospheric editorial image with one emotional focal point",
          difference: "metaphorical emotional interpretation",
        },
        {
          channel: "PURE_TYPOGRAPHY",
          mode: "PURE_TYPOGRAPHY",
          subject: "The approved narrative line",
          composition: "Quiet literary type field with controlled pacing",
          difference: "language-led narrative pacing",
        },
      ];
    case "EDITORIAL":
      return [
        {
          channel: "PROGRAMMATIC_GRAPHIC",
          mode: "EDITORIAL_SERIES",
          subject: "A content-specific conceptual relationship",
          composition: "Asymmetric editorial structure derived from the current argument",
          difference: "relational editorial structure",
        },
        {
          channel: "AI_GENERATED_VISUAL",
          mode: "EDITORIAL_SERIES",
          subject: "A text-free content-specific visual metaphor",
          composition: "Single-subject editorial image with deliberate whitespace",
          difference: "visual metaphor",
        },
        {
          channel: "MIXED_ASSET",
          mode: "MIXED",
          subject: "Authorized asset plus deterministic editorial explanation",
          composition: "Asset-led mixed field with a different focal system",
          difference: "asset and Renderer synthesis",
        },
      ];
  }
}

function usableChannel(candidate: AssetChannel, input: DynamicVisualStrategyInput): AssetChannel {
  if (candidate === "EVIDENCE_ASSET" && !input.evidenceAssets.some((asset) => asset.verified))
    return "PROGRAMMATIC_GRAPHIC";
  if (
    candidate === "PROJECT_ASSET" &&
    !input.availableProjectAssets.some((asset) => asset.authorized)
  )
    return "AI_GENERATED_VISUAL";
  return candidate;
}

function pageMode(
  role: string,
  family: ReturnType<typeof semanticFamily>,
): ImageProductionVisualMode {
  const normalized = role.toLowerCase();
  if (/evidence|proof|证据|核验/u.test(normalized)) return "EVIDENCE_LED";
  if (family === "SPACE") return "SCENE_SERIES";
  if (family === "PERSON") return "CHARACTER_SERIES";
  if (family === "PRODUCT") return "PRODUCT_LIFESTYLE";
  return "EDITORIAL_SERIES";
}

function buildAmbiguity(
  input: DynamicVisualStrategyInput,
  planId: string,
): VisualAmbiguityReportArtifact {
  const major: VisualAmbiguityReportArtifact["major_ambiguities"] = [];
  if (input.accountGoal === "LEAD_GENERATION" && coverContextIsGeneric(input))
    major.push({
      code: "COVER_CONTEXT_INSUFFICIENT",
      severity: "BLOCKING",
      description:
        "Lead-generation cover production requires a specific Subject, Audience and Painpoint before visual direction selection.",
      affected_decisions: [
        "COVER_CONVERSION_STRATEGY",
        "COVER_COPY",
        "BACKGROUND_SEMANTIC_ROLE",
        "FORMAL_PRODUCTION",
      ],
    });
  if (input.projectVisualProfile.maturityStatus === "REVIEW_REQUIRED")
    major.push({
      code: "PROFILE_CONTEXT_CHANGE_REVIEW_REQUIRED",
      severity: "BLOCKING",
      description: first(
        input.projectVisualProfile.reviewRequiredReasons,
        "The Project Visual Profile requires review before reuse.",
      ),
      affected_decisions: ["PROFILE_REUSE", "CANDIDATE_COUNT", "FORMAL_PRODUCTION"],
    });
  if (
    input.availableProjectAssets.length === 0 &&
    input.evidenceAssets.length === 0 &&
    input.approvedReferences.length === 0
  )
    major.push({
      code: "NO_GROUNDED_VISUAL_REFERENCE",
      severity: "MEDIUM",
      description:
        "No authorized Project asset, verified evidence asset or approved reference is available.",
      affected_decisions: ["IMAGE_SUBJECT", "REALISM", "PROJECT_FIT"],
    });
  if (input.projectVisualProfile.maturityStatus === "COLD_START")
    major.push({
      code: "COLD_START_AESTHETIC_UNCERTAINTY",
      severity: "MEDIUM",
      description: "The project has not accumulated enough confirmed visual preference evidence.",
      affected_decisions: ["PALETTE", "TYPOGRAPHY", "COMPOSITION"],
    });
  const questions = major
    .slice(0, 3)
    .map((item) =>
      item.code === "COVER_CONTEXT_INSUFFICIENT"
        ? "这个项目具体代表哪类业务主体、服务什么客户，并希望用什么真实场景被识别？"
        : item.code === "PROFILE_CONTEXT_CHANGE_REVIEW_REQUIRED"
          ? "Which changed Subject, Audience, platform or brand condition should replace the old Profile assumption?"
          : item.code === "NO_GROUNDED_VISUAL_REFERENCE"
            ? "Which authorized asset or reference best represents the intended project identity?"
            : "Which of the materially different directions best represents this project's desired visual character?",
    );
  return {
    report_id: `VAR-${input.contentPackage.contentId}-${input.runId.replace(/^RUN-/u, "")}`,
    strategy_plan_id: planId,
    major_ambiguities: major,
    blocking: major.some((item) => item.severity === "BLOCKING"),
    recommended_clarification_questions: questions,
    run_id: input.runId,
    schema_version: "1.0.0",
    created_at: input.createdAt,
  };
}

function buildConfidence(
  input: DynamicVisualStrategyInput,
  planId: string,
  ambiguity: VisualAmbiguityReportArtifact,
): VisualStrategyConfidenceReportArtifact {
  const required = [
    ["PROJECT_PROFILE", input.projectProfile.objective.length > 0],
    ["SUBJECT", input.subject.summary.length > 0],
    ["AUDIENCE", input.audience.summary.length > 0],
    ["PLATFORM_PACK", input.platformPack.platform.length > 0],
    ["INDUSTRY_PACK", input.industryVisualPack.packId.length > 0],
    ["OVERLAYS", input.overlays.length > 0],
    ["PROJECT_VISUAL_PROFILE", input.projectVisualProfile.profileId.length > 0],
    ["PAINPOINT", input.painpoint.summary.length > 0],
    ["CONTENT_PACKAGE", input.contentPackage.pageRoles.length > 0],
    [
      "ASSET_OR_REFERENCE",
      input.availableProjectAssets.length + input.approvedReferences.length > 0,
    ],
  ] as const;
  const missing = required.filter(([, available]) => !available).map(([name]) => name);
  const coverage = (required.length - missing.length) / required.length;
  const maturityScore =
    input.projectVisualProfile.maturityStatus === "MATURE"
      ? 0.95
      : input.projectVisualProfile.maturityStatus === "LEARNING"
        ? 0.8
        : input.projectVisualProfile.maturityStatus === "COLD_START"
          ? 0.62
          : 0.25;
  const historyScore = Math.min(
    1,
    0.45 + activeRules(input).length * 0.15 + input.historicalGateResults.length * 0.05,
  );
  const overall = Math.max(
    0,
    Math.min(
      1,
      Number(
        (
          (coverage * 0.45 + maturityScore * 0.35 + historyScore * 0.2) *
          (ambiguity.blocking ? 0.5 : 1)
        ).toFixed(2),
      ),
    ),
  );
  return {
    report_id: `VSCR-${input.contentPackage.contentId}-${input.runId.replace(/^RUN-/u, "")}`,
    strategy_plan_id: planId,
    overall_confidence: overall,
    confidence_level: overall >= 0.8 ? "HIGH" : overall >= 0.55 ? "MEDIUM" : "LOW",
    dimensions: [
      {
        dimension: "SOURCE_COVERAGE",
        score: Number(coverage.toFixed(2)),
        reason: `${required.length - missing.length}/${required.length} required source groups are available.`,
      },
      {
        dimension: "PROFILE_MATURITY",
        score: maturityScore,
        reason: `Profile maturity is ${input.projectVisualProfile.maturityStatus}.`,
      },
      {
        dimension: "CONFIRMED_HISTORY",
        score: historyScore,
        reason: `${activeRules(input).length} active project rules and ${input.historicalGateResults.length} historical gate results were supplied.`,
      },
    ],
    source_coverage: {
      required_source_count: required.length,
      available_source_count: required.length - missing.length,
      missing_sources: missing,
    },
    review_required: ambiguity.blocking,
    run_id: input.runId,
    schema_version: "1.0.0",
    created_at: input.createdAt,
  };
}

export class DynamicVisualStrategySynthesizer {
  synthesize(input: DynamicVisualStrategyInput): DynamicVisualStrategyResult {
    const family = semanticFamily(input);
    const planId = `DVSP-${input.contentPackage.contentId}-${input.runId.replace(/^RUN-/u, "")}`;
    const ambiguity = buildAmbiguity(input, planId);
    const confidence = buildConfidence(input, planId, ambiguity);
    const rules = activeRules(input);
    const operator = input.currentOperatorRequest;
    const count = maturityCandidateCount(input);
    const profile = input.projectVisualProfile;
    const global = input.globalUserVisualPreferences;
    const familyOptions = familyDirections(family);
    const confirmedProjectRuleText = rules
      .map((rule) => rule.statement)
      .join(" ")
      .toLowerCase();
    const profileChannel = profile.assetSourcePreferences[0];
    const learnedRuleChannel = /authentic work|real work|真实工作|真实场景/u.test(
      confirmedProjectRuleText,
    )
      ? ("PROJECT_ASSET" as const)
      : undefined;
    const globalChannel = global.assetSourcePreferences?.[0];
    const chosenColor =
      operator?.requestedColorDirection ??
      first(
        profile.colorPreferences,
        /low.?saturation|低饱和/u.test(confirmedProjectRuleText)
          ? "confirmed project rule: low-saturation editorial palette"
          : first(global.colorPreferences, "content-derived restrained palette"),
      );
    const chosenComposition =
      operator?.requestedCompositionDirection ??
      first(
        profile.compositionPreferences,
        /generic card|card stack|普通ppt|卡片堆叠/u.test(confirmedProjectRuleText)
          ? "confirmed project rule: content-specific editorial composition without generic card stacking"
          : first(
              global.compositionPreferences,
              familyOptions[0]?.composition ?? "content-derived editorial composition",
            ),
      );
    const profileRuleSummary = rules.map((rule) => rule.statement).join("; ");
    const resolvedTypographyStrategy =
      operator?.requestedFontFamily ??
      first(
        profile.titleFontPreferences,
        first(
          profile.fontFamilyPreferences,
          first(global.fontFamilyPreferences, "modern Chinese serif cold-start fallback"),
        ),
      );
    const resolvedCompositionFamily =
      profile.compositionFamilyPreferences?.[0] ??
      (family === "SPACE" ? "IMAGE_TEXT_INTERLOCK" : "ASYMMETRIC_NEGATIVE_SPACE");
    const candidates = ambiguity.blocking
      ? []
      : familyOptions.slice(0, count).map((direction, index): CandidateDirectionArtifact => {
          const requestedChannel = operator?.requestedAssetChannel;
          const channel = usableChannel(
            requestedChannel ??
              profileChannel ??
              learnedRuleChannel ??
              globalChannel ??
              direction.channel,
            input,
          );
          const mode =
            operator?.requestedVisualMode ?? profile.preferredVisualModes[0] ?? direction.mode;
          return {
            candidate_key: `DIRECTION-${input.contentPackage.contentId.replace(/[^A-Z0-9-]/giu, "-").toUpperCase()}-${index + 1}`,
            asset_channel: channel,
            visual_mode: mode,
            subject_direction: direction.subject,
            composition_direction:
              index === 0
                ? chosenComposition
                : `${direction.composition}; do not reuse candidate 1 coordinates`,
            palette_direction: chosenColor,
            material_difference_basis: direction.difference,
          };
        });
    const primary = candidates[0] ?? {
      candidate_key: `DIRECTION-${input.contentPackage.contentId}-BLOCKED`,
      asset_channel: "PROGRAMMATIC_GRAPHIC" as const,
      visual_mode: "EDITORIAL_SERIES" as const,
      subject_direction: "Blocked pending Profile review",
      composition_direction: "Blocked pending Profile review",
      palette_direction: "Blocked pending Profile review",
      material_difference_basis: "Blocked pending Profile review",
    };
    const pageStrategies = input.contentPackage.pageRoles.map(
      (page, index): PageStrategyArtifact => {
        const evidencePage = /evidence|proof|证据|核验/u.test(
          `${page.role} ${page.semanticPurpose}`.toLowerCase(),
        );
        const evidenceAvailable = input.evidenceAssets.some((asset) => asset.verified);
        const channel = usableChannel(
          operator?.requestedAssetChannel ??
            (evidencePage && evidenceAvailable ? "EVIDENCE_ASSET" : primary.asset_channel),
          input,
        );
        const mode =
          operator?.requestedVisualMode ??
          (evidencePage ? "EVIDENCE_LED" : pageMode(page.role, family));
        return {
          page_number: page.pageNumber,
          page_role: page.role,
          asset_channel: channel,
          visual_mode: mode,
          background_direction: first(
            profile.backgroundPreferences,
            `${chosenColor}; background serves ${page.semanticPurpose}`,
          ),
          image_subject: `${primary.subject_direction}; page-specific focus: ${page.semanticPurpose}`,
          composition_direction:
            index === 0
              ? primary.composition_direction
              : `${chosenComposition}; page ${page.pageNumber} uses a distinct scale, axis and focal relationship`,
          image_realism: first(
            profile.imageRealismPreferences,
            family === "SPACE"
              ? "credible photography with structurally stable space identity"
              : "truthful to asset provenance; generated visuals never impersonate evidence",
          ),
          color_strategy: chosenColor,
          typography: {
            font_character: first(
              profile.fontFamilyPreferences,
              first(global.fontFamilyPreferences, "project-appropriate editorial sans"),
            ),
            title_size_strategy: first(
              profile.titleSizePreferences,
              "role-relative large title with mobile recognition",
            ),
            body_size_strategy: first(
              profile.bodySizePreferences,
              "readable supporting copy below title priority",
            ),
            font_weight: first(
              profile.fontWeightPreferences,
              "controlled contrast between title and body",
            ),
            line_height: first(
              profile.lineHeightPreferences,
              "content-density-derived comfortable line height",
            ),
            letter_spacing: first(
              profile.letterSpacingPreferences,
              "language-appropriate restrained tracking",
            ),
            alignment: first(profile.alignmentPreferences, "composition-derived alignment"),
            text_region: first(
              profile.visualFocusPreferences,
              "safe-area text field separated from the image focal point",
            ),
            text_image_ratio: first(
              profile.visualDensityPreferences,
              "page-role-derived text-to-image ratio",
            ),
          },
          effects: {
            effects: profile.effectPreferences.length
              ? [...profile.effectPreferences]
              : ["restrained and content-serving only"],
            mask: first(profile.maskPreferences, "none unless required for readable overlap"),
            shadow: first(profile.shadowPreferences, "physically plausible or none"),
            gradient: first(profile.gradientPreferences, "none by default"),
            border: first(profile.borderPreferences, "content-derived, not a generic card system"),
            texture: first(profile.texturePreferences, "subtle and provenance-appropriate"),
          },
          selection_reason: `${page.semanticPurpose}; ${operator ? "current Operator override applied before Profile defaults" : profileRuleSummary || "per-content semantics resolved within Profile and Pack boundaries"}.`,
        };
      },
    );
    const plan: DynamicVisualStrategyPlanArtifact = {
      strategy_plan_id: planId,
      project_id: input.projectProfile.projectId,
      content_id: input.contentPackage.contentId,
      project_profile_version: profile.profileVersion,
      profile_maturity_status: profile.maturityStatus,
      synthesis_status: ambiguity.blocking ? "BLOCKED_REVIEW_REQUIRED" : "PLANNED",
      strategy_summary: `${family} strategy for ${input.contentPackage.theme}; per-content decisions combine current semantics, authorized assets and confirmed Project rules without treating Pack or Visual Mode as a finished template.`,
      decision_precedence: [...PRECEDENCE],
      page_strategies: pageStrategies,
      candidate_directions: candidates,
      image_count: input.contentPackage.pageRoles.length,
      candidate_count: candidates.length,
      production_batches: [
        {
          batch_number: 1,
          page_numbers: [1],
          gate: candidates.length > 1 ? "DIRECTION_SELECTION" : "G4",
        },
        ...(input.contentPackage.pageRoles.length > 1
          ? [
              {
                batch_number: 2,
                page_numbers: input.contentPackage.pageRoles
                  .slice(1)
                  .map((page) => page.pageNumber),
                gate: "STYLE_LOCK" as const,
              },
            ]
          : []),
      ],
      quality_thresholds: {
        direction_candidate: profile.qualityThresholds.directionCandidate,
        formal_asset: Math.max(
          profile.qualityThresholds.formalAsset,
          input.constraints.minimumFormalQuality,
        ),
        group: profile.qualityThresholds.group,
        core_dimension_floor: profile.qualityThresholds.coreDimensionFloor,
      },
      consistency_risks: [
        ...input.industryVisualPack.identityInvariants,
        ...input.overlays.flatMap((overlay) => overlay.rules),
        ...profile.mustNotRules,
      ],
      confidence_report_id: confidence.report_id,
      ambiguity_report_id: ambiguity.report_id,
      selection_reasons: [
        `Semantic family: ${family}`,
        `Profile precedence over global preference: ${profile.profileVersion}`,
        `Candidate count derived from ${profile.maturityStatus}, cost and time constraints: ${candidates.length}`,
        ...(operator ? [`Current-set override: ${operator.summary}`] : []),
      ],
      current_override_applied: Boolean(operator),
      cover_visual_strategy:
        input.coverConversionStrategy ??
        (input.accountGoal === "LEAD_GENERATION" ? "PAINPOINT_FIRST" : "VALUE_FIRST"),
      cover_text_prominence: first(
        profile.coverTextProminencePreferences,
        input.accountGoal === "LEAD_GENERATION"
          ? "primary hook is the first visual focus at phone thumbnail scale"
          : "content-derived editorial hierarchy",
      ),
      cover_text_to_image_ratio: first(
        profile.coverTextToImageRatioPreferences,
        input.accountGoal === "LEAD_GENERATION" ? "40:60 to 55:45" : "content-derived",
      ),
      cover_background_semantic_role:
        profile.coverBackgroundSemanticPreferences?.[0] ?? semanticRoleForFamily(family),
      cover_thumbnail_targets: ["310x414", "186x248"],
      cover_click_clarity_target: input.accountGoal === "LEAD_GENERATION" ? 85 : 75,
      semantic_relevance_target: input.accountGoal === "LEAD_GENERATION" ? 80 : 70,
      cover_candidate_count: candidates.length,
      cover_candidate_diversity_reason:
        candidates.length > 1
          ? "Candidates must differ materially in conversion strategy, semantic role and composition—not only palette."
          : ambiguity.blocking
            ? "No candidates are allowed until blocking cover context is resolved."
            : "One candidate is sufficient under the current confirmed Profile and constraints.",
      universal_visual_default_version: input.universalVisualDefaultVersion ?? "UVDPV-1",
      typography_default_policy_version: input.typographyDefaultPolicyVersion ?? "TDPV-1",
      editorial_spatial_policy_version: input.editorialSpatialPolicyVersion ?? "ESCPV-1",
      resolved_typography_strategy: resolvedTypographyStrategy,
      resolved_composition_family: resolvedCompositionFamily,
      image_text_integration_strategy: first(
        profile.imageTextIntegrationPreferences,
        "derive type anchors from subject edges, natural negative space and visible evidence",
      ),
      candidate_diversity_strategy:
        "vary composition family, text region, shot scale, viewpoint, asset structure and reading path",
      painpoint_scene_strategy:
        input.accountGoal === "LEAD_GENERATION"
          ? "require direct Painpoint, Value or contrast evidence instead of category-only imagery"
          : "derive the scene relation from the current Content objective",
      long_term_profile_mutated: false,
      industry_pack_mutated: false,
      global_preference_mutated: false,
      run_id: input.runId,
      schema_version: "1.0.0",
      created_at: input.createdAt,
    };
    return { plan, confidence, ambiguity };
  }
}

export interface VisualFeedbackForLearning {
  eventId: string;
  feedbackClass: FeedbackClass;
  scope: VisualRuleScope;
  statement: string;
  isToolOrSystemDefect: boolean;
}

export interface VisualRuleCandidateForLearning {
  candidateId: string;
  sourceEventId: string;
  statement: string;
  type: "MUST" | "MUST_NOT" | "PREFER" | "AVOID";
  scope: VisualRuleScope;
  confirmed: false;
}

function profileVersionNumber(version: string): number {
  const matched = /^PVPFV-([1-9][0-9]*)$/u.exec(version);
  if (!matched?.[1]) throw new Error("PROJECT_VISUAL_PROFILE_VERSION_INVALID");
  return Number(matched[1]);
}

function evolveProfile(
  profile: LearningProjectVisualProfile,
  updates: Partial<LearningProjectVisualProfile>,
  updatedAt: string,
): LearningProjectVisualProfile {
  return {
    ...profile,
    ...updates,
    profileVersion: `PVPFV-${profileVersionNumber(profile.profileVersion) + 1}`,
    updatedAt,
  };
}

function addUnique(values: string[], value: string): string[] {
  return values.includes(value) ? [...values] : [...values, value];
}

function removeValue(values: string[], value: string): string[] {
  return values.filter((item) => item !== value);
}

export function createVisualRuleCandidate(
  feedback: VisualFeedbackForLearning,
  candidateId: string,
  type: VisualRuleCandidateForLearning["type"],
): VisualRuleCandidateForLearning {
  if (
    feedback.isToolOrSystemDefect ||
    feedback.feedbackClass === "QUALITY_DEFECT" ||
    feedback.feedbackClass === "PRODUCTION_FEEDBACK"
  )
    throw new Error("VISUAL_FEEDBACK_NOT_ELIGIBLE_FOR_LONG_TERM_RULE");
  if (feedback.scope !== "CURRENT_PROJECT")
    throw new Error("VISUAL_RULE_CANDIDATE_SCOPE_NOT_PROJECT");
  return {
    candidateId,
    sourceEventId: feedback.eventId,
    statement: feedback.statement,
    type,
    scope: feedback.scope,
    confirmed: false,
  };
}

export function confirmVisualRule(input: {
  profile: LearningProjectVisualProfile;
  feedback: VisualFeedbackForLearning;
  candidate: VisualRuleCandidateForLearning;
  ruleId: string;
  confirmedAt: string;
}): { profile: LearningProjectVisualProfile; rule: ConfirmedVisualRuleInput } {
  if (input.candidate.confirmed) throw new Error("VISUAL_RULE_CANDIDATE_ALREADY_CONFIRMED");
  if (input.candidate.sourceEventId !== input.feedback.eventId)
    throw new Error("VISUAL_RULE_CANDIDATE_EVENT_MISMATCH");
  const rule: ConfirmedVisualRuleInput = {
    ruleId: input.ruleId,
    version: 1,
    statement: input.candidate.statement,
    type: input.candidate.type,
    scope: input.candidate.scope,
    status: "ACTIVE",
  };
  const bucket =
    rule.type === "MUST"
      ? { mustRules: addUnique(input.profile.mustRules, rule.statement) }
      : rule.type === "MUST_NOT"
        ? { mustNotRules: addUnique(input.profile.mustNotRules, rule.statement) }
        : rule.type === "PREFER"
          ? { preferRules: addUnique(input.profile.preferRules, rule.statement) }
          : { avoidRules: addUnique(input.profile.avoidRules, rule.statement) };
  const nextMaturity =
    input.profile.maturityStatus === "COLD_START" ? "LEARNING" : input.profile.maturityStatus;
  return {
    rule,
    profile: evolveProfile(
      input.profile,
      {
        ...bucket,
        maturityStatus: nextMaturity,
        confirmedFeedbackRefs: addUnique(
          input.profile.confirmedFeedbackRefs,
          input.feedback.eventId,
        ),
        ruleVersionRefs: addUnique(input.profile.ruleVersionRefs, `${rule.ruleId}@${rule.version}`),
      },
      input.confirmedAt,
    ),
  };
}

export function revokeVisualRule(input: {
  profile: LearningProjectVisualProfile;
  rule: ConfirmedVisualRuleInput;
  revokedAt: string;
}): { profile: LearningProjectVisualProfile; rule: ConfirmedVisualRuleInput } {
  if (input.rule.status !== "ACTIVE") throw new Error("VISUAL_RULE_NOT_ACTIVE");
  const bucket =
    input.rule.type === "MUST"
      ? { mustRules: removeValue(input.profile.mustRules, input.rule.statement) }
      : input.rule.type === "MUST_NOT"
        ? { mustNotRules: removeValue(input.profile.mustNotRules, input.rule.statement) }
        : input.rule.type === "PREFER"
          ? { preferRules: removeValue(input.profile.preferRules, input.rule.statement) }
          : { avoidRules: removeValue(input.profile.avoidRules, input.rule.statement) };
  const nextRule = { ...input.rule, version: input.rule.version + 1, status: "DISABLED" as const };
  return {
    rule: nextRule,
    profile: evolveProfile(
      input.profile,
      {
        ...bucket,
        maturityStatus: "LEARNING",
        ruleVersionRefs: addUnique(
          input.profile.ruleVersionRefs,
          `${nextRule.ruleId}@${nextRule.version}`,
        ),
      },
      input.revokedAt,
    ),
  };
}

export function forgetVisualRule(input: {
  profile: LearningProjectVisualProfile;
  rule: ConfirmedVisualRuleInput;
  forgottenAt: string;
}): { profile: LearningProjectVisualProfile; rule: ConfirmedVisualRuleInput } {
  const revoked =
    input.rule.status === "ACTIVE"
      ? revokeVisualRule({ profile: input.profile, rule: input.rule, revokedAt: input.forgottenAt })
      : { profile: input.profile, rule: input.rule };
  const forgotten = {
    ...revoked.rule,
    version: revoked.rule.version + 1,
    status: "FORGOTTEN" as const,
    statement: `[FORGOTTEN:${digest(revoked.rule.statement).slice(0, 12)}]`,
  };
  return {
    rule: forgotten,
    profile: evolveProfile(
      revoked.profile,
      {
        ruleVersionRefs: addUnique(
          revoked.profile.ruleVersionRefs,
          `${forgotten.ruleId}@${forgotten.version}`,
        ),
      },
      input.forgottenAt,
    ),
  };
}
