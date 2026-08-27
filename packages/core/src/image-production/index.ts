import { createHash } from "node:crypto";

export const ASSET_CHANNELS = [
  "PROJECT_ASSET",
  "AI_GENERATED_VISUAL",
  "PROGRAMMATIC_GRAPHIC",
  "EVIDENCE_ASSET",
  "PURE_TYPOGRAPHY",
  "MIXED_ASSET",
] as const;
export type AssetChannel = (typeof ASSET_CHANNELS)[number];

export const IMAGE_PRODUCTION_VISUAL_MODES = [
  "SCENE_SERIES",
  "EDITORIAL_SERIES",
  "PRODUCT_LIFESTYLE",
  "EVIDENCE_LED",
  "MIXED",
  "CHARACTER_SERIES",
  "PURE_TYPOGRAPHY",
] as const;
export type ImageProductionVisualMode = (typeof IMAGE_PRODUCTION_VISUAL_MODES)[number];

export const ROUTING_PRIORITY = [
  "SAFETY_AUTHENTICITY_AUTHORIZATION",
  "OPERATOR_CURRENT_REQUEST",
  "APPROVED_STYLE_LOCK",
  "CONFIRMED_PROJECT_VISUAL_PROFILE",
  "CONFIRMED_GLOBAL_VISUAL_PREFERENCE",
  "CONTENT_EVIDENCE_AND_ASSET_NEED",
  "INDUSTRY_PACK_AND_OVERLAYS",
  "VISUAL_MODE_DEFAULTS",
  "GENERIC_DEFAULTS",
] as const;

export const QUALITY_WEIGHTS = {
  CONTENT_SEMANTIC_FIT: 20,
  COMPOSITION_FOCUS: 15,
  HIERARCHY_READABILITY: 15,
  ASSET_QUALITY_INTEGRITY: 15,
  PROJECT_AUDIENCE_FIT: 10,
  UNIQUENESS_ANTI_TEMPLATE: 10,
  VISUAL_MODE_EXECUTION: 10,
  PLATFORM_MOBILE_PERFORMANCE: 5,
} as const;

export type QualityDimension = keyof typeof QUALITY_WEIGHTS;
export type QualityRatings = Record<QualityDimension, number>;

function stableHash(input: unknown): string {
  const normalize = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(normalize);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>)
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([key, child]) => [key, normalize(child)]),
      );
    return value;
  };
  return createHash("sha256")
    .update(JSON.stringify(normalize(input)))
    .digest("hex");
}

export interface AssetRoutingInput {
  projectId: string;
  contentId: string;
  pageNumber: number;
  evidenceRequired: boolean;
  accurateStructureRequired: boolean;
  operatorRequestedChannel?: AssetChannel;
  styleLockChannel?: AssetChannel;
  projectProfileChannels?: AssetChannel[];
  industryChannels?: AssetChannel[];
  hostImagegenAvailable: boolean;
}

export function planAssetRoute(input: AssetRoutingInput): {
  asset_channel: AssetChannel;
  reason: string;
  priority_order: readonly string[];
  formal_text_policy: "RENDERER_ONLY";
  warnings: string[];
} {
  const warnings: string[] = [];
  if (input.evidenceRequired)
    return {
      asset_channel: "EVIDENCE_ASSET",
      reason: "Authentic evidence is required and outranks stylistic defaults.",
      priority_order: ROUTING_PRIORITY,
      formal_text_policy: "RENDERER_ONLY",
      warnings,
    };
  if (input.accurateStructureRequired)
    return {
      asset_channel: "PROGRAMMATIC_GRAPHIC",
      reason: "The page requires precise structure or relationships.",
      priority_order: ROUTING_PRIORITY,
      formal_text_policy: "RENDERER_ONLY",
      warnings,
    };
  const candidates = [
    input.operatorRequestedChannel,
    input.styleLockChannel,
    ...(input.projectProfileChannels ?? []),
    ...(input.industryChannels ?? []),
    "PURE_TYPOGRAPHY" as const,
  ].filter((value): value is AssetChannel => Boolean(value));
  let selected = candidates[0] ?? "PURE_TYPOGRAPHY";
  if (selected === "AI_GENERATED_VISUAL" && !input.hostImagegenAvailable) {
    selected = "PURE_TYPOGRAPHY";
    warnings.push("HOST_IMAGEGEN_UNAVAILABLE_NO_MOCK_FALLBACK");
  }
  return {
    asset_channel: selected,
    reason: "Selected by the highest applicable routing preference.",
    priority_order: ROUTING_PRIORITY,
    formal_text_policy: "RENDERER_ONLY",
    warnings,
  };
}

export interface DirectionCandidatePlan {
  candidate_id: string;
  asset_channel: AssetChannel;
  visual_mode: ImageProductionVisualMode;
  direction_key: string;
  generation_required: boolean;
  renderer_required: boolean;
}

export function planDirectionCandidates(input: {
  contentId: string;
  profileMaturity:
    "UNMATURE" | "UNAVAILABLE" | "COLD_START" | "LEARNING" | "MATURE" | "REVIEW_REQUIRED";
  explicitDirection: boolean;
  hostImagegenAvailable: boolean;
  candidateCount?: 2 | 3;
  contentSignals?: string[];
  industryPackId?: string;
}): { required: boolean; candidates: DirectionCandidatePlan[]; status: string; plan_hash: string } {
  if (input.profileMaturity === "MATURE" || input.explicitDirection) {
    const result = { required: false, candidates: [], status: "SKIPPED" };
    return { ...result, plan_hash: stableHash(result) };
  }
  if (input.profileMaturity === "REVIEW_REQUIRED") {
    const result = { required: false, candidates: [], status: "BLOCKED_REVIEW_REQUIRED" };
    return { ...result, plan_hash: stableHash(result) };
  }
  const corpus =
    `${input.industryPackId ?? ""} ${(input.contentSignals ?? []).join(" ")}`.toLowerCase();
  const directions = /space|interior|hotel|retail|空间|装修/u.test(corpus)
    ? [
        ["PROJECT_ASSET", "SCENE_SERIES", "SPATIAL_CONTEXT_AND_CIRCULATION"],
        ["PROJECT_ASSET", "SCENE_SERIES", "MATERIAL_LIGHT_AND_DETAIL_SEQUENCE"],
        ["MIXED_ASSET", "EDITORIAL_SERIES", "SPACE_EVIDENCE_WITH_EDITORIAL_ANNOTATION"],
      ]
    : /evidence|proof|credential|核验|证据|资质/u.test(corpus)
      ? [
          ["EVIDENCE_ASSET", "EVIDENCE_LED", "AUTHENTIC_EVIDENCE_HIERARCHY"],
          ["PROGRAMMATIC_GRAPHIC", "EDITORIAL_SERIES", "VERIFICATION_RELATIONSHIP_STRUCTURE"],
          ["AI_GENERATED_VISUAL", "EDITORIAL_SERIES", "TEXT_FREE_EDITORIAL_METAPHOR"],
        ]
      : /person|founder|expert|人物|创始人|专家/u.test(corpus)
        ? [
            ["PROJECT_ASSET", "CHARACTER_SERIES", "DOCUMENTARY_SUBJECT_CONTEXT"],
            ["PROJECT_ASSET", "EDITORIAL_SERIES", "ENVIRONMENTAL_PORTRAIT_EDITORIAL"],
            ["MIXED_ASSET", "MIXED", "SUBJECT_WITH_AUTHENTIC_CONTEXT_LAYER"],
          ]
        : [
            ["PROGRAMMATIC_GRAPHIC", "EDITORIAL_SERIES", "CONTENT_RELATIONSHIP_STRUCTURE"],
            ["AI_GENERATED_VISUAL", "EDITORIAL_SERIES", "CONTENT_SPECIFIC_VISUAL_METAPHOR"],
            ["MIXED_ASSET", "MIXED", "ASSET_AND_TYPE_EDITORIAL_COMPOSITION"],
          ];
  const count = input.candidateCount ?? (input.profileMaturity === "LEARNING" ? 2 : 3);
  const candidates = directions.slice(0, count).map(([channel, mode, direction], index) => {
    let assetChannel = channel as AssetChannel;
    if (assetChannel === "AI_GENERATED_VISUAL" && !input.hostImagegenAvailable)
      assetChannel = "PROGRAMMATIC_GRAPHIC";
    return {
      candidate_id: `VDC-${input.contentId}-${String.fromCharCode(65 + index)}`,
      asset_channel: assetChannel,
      visual_mode: mode as ImageProductionVisualMode,
      direction_key: direction ?? `CONTENT_DIRECTION_${index + 1}`,
      generation_required: assetChannel === "AI_GENERATED_VISUAL",
      renderer_required: true,
    };
  });
  assertMateriallyDifferentCandidates(candidates);
  const result = { required: true, candidates, status: "PLANNED" };
  return { ...result, plan_hash: stableHash(result) };
}

export function assertMateriallyDifferentCandidates(candidates: DirectionCandidatePlan[]): void {
  if (candidates.length < 2 || candidates.length > 3)
    throw new Error("VISUAL_DIRECTION_CANDIDATE_COUNT_INVALID");
  const signatures = new Set(
    candidates.map((item) => `${item.asset_channel}|${item.visual_mode}|${item.direction_key}`),
  );
  if (signatures.size !== candidates.length)
    throw new Error("VISUAL_DIRECTION_CANDIDATES_NOT_MATERIALLY_DIFFERENT");
}

export function evaluateImageQuality(input: {
  ratings: QualityRatings;
  hardBlocks: string[];
  role: "DIRECTION_CANDIDATE" | "FORMAL_ASSET";
}): {
  dimensions: Array<{
    dimension: QualityDimension;
    weight: number;
    rating: number;
    weighted_score: number;
  }>;
  total_score: number;
  threshold: 75 | 85;
  core_dimension_floor_met: boolean;
  result: "PASS_PENDING_OPERATOR" | "FAIL" | "BLOCKED";
  operator_approval_required: true;
} {
  const dimensions = Object.entries(QUALITY_WEIGHTS).map(([dimension, weight]) => {
    const rating = input.ratings[dimension as QualityDimension];
    if (!Number.isFinite(rating) || rating < 0 || rating > 5)
      throw new Error(`IMAGE_QUALITY_RATING_INVALID:${dimension}`);
    return {
      dimension: dimension as QualityDimension,
      weight,
      rating,
      weighted_score: Math.round(((rating / 5) * weight + Number.EPSILON) * 100) / 100,
    };
  });
  const total_score = Math.round(dimensions.reduce((sum, item) => sum + item.weighted_score, 0));
  const threshold = input.role === "DIRECTION_CANDIDATE" ? 75 : 85;
  const core = new Set<QualityDimension>([
    "CONTENT_SEMANTIC_FIT",
    "COMPOSITION_FOCUS",
    "HIERARCHY_READABILITY",
    "ASSET_QUALITY_INTEGRITY",
  ]);
  const core_dimension_floor_met = dimensions
    .filter((item) => core.has(item.dimension))
    .every((item) => item.rating >= 3);
  const result = input.hardBlocks.length
    ? "BLOCKED"
    : total_score >= threshold && core_dimension_floor_met
      ? "PASS_PENDING_OPERATOR"
      : "FAIL";
  return {
    dimensions,
    total_score,
    threshold,
    core_dimension_floor_met,
    result,
    operator_approval_required: true,
  };
}

export function evaluateGroupQuality(input: {
  assetIds: string[];
  visualSignatures: string[];
  subjectIdentityKeys: string[];
  sourceChecksums: string[];
}): {
  system_consistency: "PASS" | "FAIL";
  subject_consistency: "PASS" | "FAIL";
  page_difference: "PASS" | "FAIL";
  near_duplicate_pairs: string[][];
  result: "PASS_PENDING_OPERATOR" | "FAIL";
} {
  if (input.assetIds.length < 2) throw new Error("GROUP_QUALITY_REQUIRES_MULTIPLE_ASSETS");
  const duplicates: string[][] = [];
  for (let left = 0; left < input.sourceChecksums.length; left += 1)
    for (let right = left + 1; right < input.sourceChecksums.length; right += 1)
      if (input.sourceChecksums[left] === input.sourceChecksums[right]) {
        const leftAsset = input.assetIds[left];
        const rightAsset = input.assetIds[right];
        if (leftAsset && rightAsset) duplicates.push([leftAsset, rightAsset]);
      }
  const system_consistency =
    input.visualSignatures.length === input.assetIds.length ? "PASS" : "FAIL";
  const subject_consistency = new Set(input.subjectIdentityKeys).size <= 1 ? "PASS" : "FAIL";
  const page_difference =
    new Set(input.visualSignatures).size === input.assetIds.length && duplicates.length === 0
      ? "PASS"
      : "FAIL";
  const result = [system_consistency, subject_consistency, page_difference].every(
    (item) => item === "PASS",
  )
    ? "PASS_PENDING_OPERATOR"
    : "FAIL";
  return {
    system_consistency,
    subject_consistency,
    page_difference,
    near_duplicate_pairs: duplicates,
    result,
  };
}

export type FeedbackClass =
  "QUALITY_DEFECT" | "PRODUCTION_FEEDBACK" | "VISUAL_PREFERENCE" | "PROJECT_OR_DOMAIN_CONSTRAINT";
export type VisualRuleScope =
  | "CURRENT_ELEMENT"
  | "CURRENT_PAGE"
  | "CURRENT_SET"
  | "CURRENT_PROJECT"
  | "INDUSTRY_PACK"
  | "GLOBAL_USER_PREFERENCE";

export function proposeVisualRule(input: {
  eventId: string;
  feedbackClass: FeedbackClass;
  requestedScope?: VisualRuleScope;
  isToolOrSystemDefect: boolean;
  statement: string;
}): {
  eligible: boolean;
  status: "CANDIDATE" | "REJECTED";
  scope: VisualRuleScope;
  reason: string;
} {
  if (input.isToolOrSystemDefect || input.feedbackClass === "QUALITY_DEFECT")
    return {
      eligible: false,
      status: "REJECTED",
      scope: "CURRENT_ELEMENT",
      reason: "QUALITY_OR_SYSTEM_DEFECT_NOT_A_PREFERENCE",
    };
  if (input.feedbackClass === "PRODUCTION_FEEDBACK")
    return {
      eligible: false,
      status: "REJECTED",
      scope: input.requestedScope ?? "CURRENT_SET",
      reason: "PRODUCTION_FEEDBACK_CURRENT_WORK_ONLY",
    };
  const scope =
    input.requestedScope ??
    (input.feedbackClass === "PROJECT_OR_DOMAIN_CONSTRAINT" ? "CURRENT_PROJECT" : "CURRENT_SET");
  return { eligible: true, status: "CANDIDATE", scope, reason: "EXPLICIT_CONFIRMATION_REQUIRED" };
}

export function planProductionBatch(input: {
  pageCount: number;
  g4Approved: boolean;
  directionCandidateCount: number;
}) {
  if (input.pageCount < 1) throw new Error("IMAGE_PAGE_COUNT_INVALID");
  return {
    final_page_count: input.pageCount,
    direction_candidate_count: input.directionCandidateCount,
    formal_candidate_count: 0,
    pages: Array.from({ length: input.pageCount }, (_, index) => ({
      page_number: index + 1,
      status: input.g4Approved || index === 0 ? "ELIGIBLE" : "BLOCKED_BY_G4",
    })),
    requires_g4: !input.g4Approved,
  };
}

export * from "./dynamic-visual-strategy.js";
export * from "./image-set-continuity.js";
export * from "../cover-conversion/index.js";
export * from "../visual-baseline/index.js";
