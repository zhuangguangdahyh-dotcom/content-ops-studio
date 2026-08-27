import { createHash } from "node:crypto";

export const ACCOUNT_GOALS = [
  "LEAD_GENERATION",
  "BRAND_BUILDING",
  "KNOWLEDGE_EDUCATION",
  "PRODUCT_SALES",
  "COMMUNITY",
  "PORTFOLIO_SHOWCASE",
] as const;
export type AccountGoal = (typeof ACCOUNT_GOALS)[number];

export const COVER_OBJECTIVES = [
  "AUDIENCE_FILTER",
  "PAINPOINT_DIRECT",
  "VALUE_DIRECT",
  "RISK_WARNING",
  "DECISION_CHECKLIST",
  "RESULT_EVIDENCE",
  "BRAND_STATEMENT",
] as const;
export type CoverObjective = (typeof COVER_OBJECTIVES)[number];

export const COVER_CONVERSION_STRATEGIES = [
  "TARGET_AUDIENCE_FIRST",
  "PAINPOINT_FIRST",
  "VALUE_FIRST",
  "RISK_FIRST",
  "DECISION_FIRST",
  "RESULT_FIRST",
  "CONTRAST_FIRST",
  "QUESTION_FIRST",
] as const;
export type CoverConversionStrategy = (typeof COVER_CONVERSION_STRATEGIES)[number];

export const COVER_SEMANTIC_ROLES = [
  "DIRECT_INDUSTRY_SCENE",
  "DIRECT_BUSINESS_SCENE",
  "DIRECT_CUSTOMER_SCENE",
  "DIRECT_PAINPOINT_SCENE",
  "DIRECT_VALUE_SCENE",
  "PROJECT_ASSET",
  "SUBJECT_PERSON",
  "PRODUCT_SUBJECT",
  "SPACE_SUBJECT",
  "EVIDENCE_ASSET",
  "ABSTRACT_SEMANTIC",
  "DECORATIVE_ONLY",
] as const;
export type CoverSemanticRole = (typeof COVER_SEMANTIC_ROLES)[number];

export const COVER_ERROR_CODES = [
  "COVER_CONTEXT_INSUFFICIENT",
  "COVER_SUBJECT_TOO_GENERIC",
  "COVER_AUDIENCE_MISSING",
  "COVER_PAINPOINT_MISSING",
  "COVER_VALUE_MISSING",
  "COVER_HOOK_TOO_GENERIC",
  "COVER_HOOK_TOO_LONG",
  "COVER_TEXT_TOO_DENSE",
  "COVER_THUMBNAIL_UNREADABLE",
  "COVER_CLICK_CLARITY_BLOCKED",
  "VISUAL_SEMANTIC_RELEVANCE_BLOCKED",
  "DECORATIVE_BACKGROUND_NOT_ALLOWED",
  "ABSTRACT_METAPHOR_TOO_WEAK",
  "COVER_COPY_REVISION_REQUIRED",
  "COVER_VISUAL_REVISION_REQUIRED",
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
] as const;
export type CoverErrorCode = (typeof COVER_ERROR_CODES)[number];

function stableHash(value: unknown): string {
  const normalize = (input: unknown): unknown => {
    if (Array.isArray(input)) return input.map(normalize);
    if (input && typeof input === "object")
      return Object.fromEntries(
        Object.entries(input as Record<string, unknown>)
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([key, child]) => [key, normalize(child)]),
      );
    return input;
  };
  return createHash("sha256")
    .update(JSON.stringify(normalize(value)))
    .digest("hex");
}

export function countVisibleCharacters(value: string): number {
  return Array.from(value.normalize("NFKC").replace(/\s+/gu, "")).length;
}

function genericSubject(value: string): boolean {
  const normalized = value.normalize("NFKC").trim().toLowerCase();
  return (
    normalized.length < 6 ||
    ["professional services", "generic professional services", "专业服务", "通用专业服务"].includes(
      normalized,
    ) ||
    /^(generic|通用|示例|fictional)\s*(service|services|服务)?$/u.test(normalized)
  );
}

export interface CoverConversionInput {
  projectId: string;
  contentId: string;
  contentVersion: string;
  copyVersion: string;
  runId: string;
  createdAt: string;
  platform: "XIAOHONGSHU";
  accountGoal: AccountGoal;
  subject: string;
  audience: string;
  painpoint: string;
  contentValue: string;
  decisionStage: string;
  publishTitle: string;
  page1ContentCopy: string;
  requestedObjective?: CoverObjective;
  requestedStrategy?: CoverConversionStrategy;
  projectVisualProfileVersion: string | null;
  globalVisualPreferenceVersion: string;
  industryPackVersion: string;
  platformPackVersion: string;
}

export function planCoverConversion(input: CoverConversionInput) {
  const errors: CoverErrorCode[] = [];
  if (input.accountGoal === "LEAD_GENERATION") {
    if (!input.audience.trim()) errors.push("COVER_AUDIENCE_MISSING");
    if (!input.painpoint.trim()) errors.push("COVER_PAINPOINT_MISSING");
    if (!input.contentValue.trim()) errors.push("COVER_VALUE_MISSING");
    if (genericSubject(input.subject)) errors.push("COVER_SUBJECT_TOO_GENERIC");
    if (errors.length) errors.unshift("COVER_CONTEXT_INSUFFICIENT");
  }
  const strategyCandidates: CoverConversionStrategy[] =
    input.accountGoal === "LEAD_GENERATION"
      ? ["TARGET_AUDIENCE_FIRST", "PAINPOINT_FIRST", "VALUE_FIRST", "RISK_FIRST", "DECISION_FIRST"]
      : input.accountGoal === "BRAND_BUILDING"
        ? ["CONTRAST_FIRST", "VALUE_FIRST"]
        : ["VALUE_FIRST", "DECISION_FIRST", "QUESTION_FIRST"];
  const selectedStrategy =
    input.requestedStrategy ??
    (input.accountGoal === "LEAD_GENERATION" && input.painpoint.trim()
      ? "PAINPOINT_FIRST"
      : (strategyCandidates[0] ?? "VALUE_FIRST"));
  const coverObjective =
    input.requestedObjective ??
    (selectedStrategy === "TARGET_AUDIENCE_FIRST"
      ? "AUDIENCE_FILTER"
      : selectedStrategy === "PAINPOINT_FIRST"
        ? "PAINPOINT_DIRECT"
        : selectedStrategy === "RISK_FIRST"
          ? "RISK_WARNING"
          : selectedStrategy === "DECISION_FIRST"
            ? "DECISION_CHECKLIST"
            : input.accountGoal === "BRAND_BUILDING"
              ? "BRAND_STATEMENT"
              : "VALUE_DIRECT");
  const blockingQuestion = errors.length
    ? [
        genericSubject(input.subject)
          ? "这个项目具体代表哪类业务主体、服务什么客户，并希望用什么真实场景被识别？"
          : "补充当前封面必须筛选的目标客户、核心Painpoint和可提供价值。",
      ]
    : [];
  const result = {
    cover_conversion_plan_id: `CCP-${input.contentId}-${input.runId.slice(-4)}`,
    project_id: input.projectId,
    content_id: input.contentId,
    content_version: input.contentVersion,
    copy_version: input.copyVersion,
    platform: input.platform,
    account_goal: input.accountGoal,
    cover_objective: coverObjective,
    subject: input.subject,
    audience: input.audience,
    painpoint: input.painpoint,
    content_value: input.contentValue,
    decision_stage: input.decisionStage,
    publish_title: input.publishTitle,
    page_1_content_copy: input.page1ContentCopy,
    strategy_candidates: strategyCandidates,
    selected_strategy: selectedStrategy,
    primary_hook_constraints: {
      recommended_min_visible_characters: 6,
      recommended_max_visible_characters: 16,
      hard_max_visible_characters: 20,
      max_lines: 3,
    },
    secondary_line_constraints: {
      recommended_min_visible_characters: 0,
      recommended_max_visible_characters: 16,
      hard_max_visible_characters: 20,
      max_lines: 2,
    },
    thumbnail_constraints: {
      targets: ["310x414", "186x248"],
      primary_min_effective_font_px: 28,
      secondary_min_effective_font_px: 14,
      primary_max_lines: 3,
    },
    project_visual_profile_version: input.projectVisualProfileVersion,
    global_visual_preference_version: input.globalVisualPreferenceVersion,
    industry_pack_version: input.industryPackVersion,
    platform_pack_version: input.platformPackVersion,
    ambiguities: [...new Set(errors)],
    blocking_questions: blockingQuestion,
    ready: errors.length === 0,
    run_id: input.runId,
    created_at: input.createdAt,
    schema_version: "1.0.0" as const,
    extensions: {},
  };
  return { ...result, plan_hash: stableHash(result) };
}

export interface CoverCopyEvaluationInput {
  coverPrimaryHook: string;
  coverSecondaryLine: string;
  coverSupportingCopy: string;
  page1ContentCopy: string;
  targetCustomerSignal: boolean;
  painpointSignal: boolean;
  valueSignal: boolean;
  riskSignal: boolean;
  decisionSignal: boolean;
  promiseSupported: boolean;
  accountGoal: AccountGoal;
  primaryLines: number;
  secondaryLines: number;
}

export function evaluateCoverCopy(input: CoverCopyEvaluationInput) {
  const hardBlocks: CoverErrorCode[] = [];
  const hookCount = countVisibleCharacters(input.coverPrimaryHook);
  if (hookCount > 20) hardBlocks.push("COVER_HOOK_TOO_LONG");
  if (input.primaryLines > 3 || input.secondaryLines > 2 || input.coverSupportingCopy.trim())
    hardBlocks.push("COVER_TEXT_TOO_DENSE");
  const hasClickSignal =
    input.targetCustomerSignal ||
    input.painpointSignal ||
    input.valueSignal ||
    input.riskSignal ||
    input.decisionSignal;
  if (input.accountGoal === "LEAD_GENERATION" && !hasClickSignal)
    hardBlocks.push("COVER_HOOK_TOO_GENERIC");
  if (!input.promiseSupported) hardBlocks.push("COVER_COPY_REVISION_REQUIRED");
  if (input.coverPrimaryHook.trim() === input.page1ContentCopy.trim() && hookCount > 20)
    hardBlocks.push("COVER_TEXT_TOO_DENSE");
  return {
    character_counts: {
      cover_primary_hook: hookCount,
      cover_secondary_line: countVisibleCharacters(input.coverSecondaryLine),
      cover_supporting_copy: countVisibleCharacters(input.coverSupportingCopy),
    },
    hard_blocks: [...new Set(hardBlocks)],
    ready_for_g3: hardBlocks.length === 0,
  };
}

export interface ThumbnailMeasurement {
  size: "310x414" | "186x248";
  width: 310 | 186;
  height: 414 | 248;
  primaryEffectiveFontPx: number;
  secondaryEffectiveFontPx: number;
  readable: boolean;
}

export function evaluateCoverThumbnail(input: {
  accountGoal: AccountGoal;
  thumbnails: ThumbnailMeasurement[];
  primaryHookLines: number;
  primaryHookFirstFocus: boolean;
  singleClickMessage: boolean;
  audienceOrPainpointOrValueClear: boolean;
  backgroundCompetes: boolean;
  smallParagraphPresent: boolean;
  contrastRatio: number;
  textVisualShare: number;
  businessSceneRecognizable: boolean;
}) {
  const hardBlocks: CoverErrorCode[] = [];
  if (
    input.thumbnails.length !== 2 ||
    !input.thumbnails.some((item) => item.size === "310x414") ||
    !input.thumbnails.some((item) => item.size === "186x248") ||
    input.thumbnails.some((item) => !item.readable)
  )
    hardBlocks.push("COVER_THUMBNAIL_UNREADABLE");
  const thumbnail310 = input.thumbnails.find((item) => item.size === "310x414");
  if (input.accountGoal === "LEAD_GENERATION") {
    if (!thumbnail310 || thumbnail310.primaryEffectiveFontPx < 28)
      hardBlocks.push("COVER_THUMBNAIL_UNREADABLE");
    if (
      thumbnail310 &&
      thumbnail310.secondaryEffectiveFontPx > 0 &&
      thumbnail310.secondaryEffectiveFontPx < 14
    )
      hardBlocks.push("COVER_THUMBNAIL_UNREADABLE");
    if (input.primaryHookLines > 3 || input.smallParagraphPresent)
      hardBlocks.push("COVER_TEXT_TOO_DENSE");
    if (!input.audienceOrPainpointOrValueClear || !input.singleClickMessage)
      hardBlocks.push("COVER_CLICK_CLARITY_BLOCKED");
  }
  if (!input.primaryHookFirstFocus || input.backgroundCompetes || input.contrastRatio < 4.5)
    hardBlocks.push("COVER_THUMBNAIL_UNREADABLE");
  return {
    hard_blocks: [...new Set(hardBlocks)],
    result: hardBlocks.length ? ("BLOCKED" as const) : ("PASS" as const),
  };
}

export const CLICK_CLARITY_WEIGHTS = {
  TARGET_CUSTOMER_CLARITY: 25,
  PAINPOINT_OR_VALUE_CLARITY: 25,
  ONE_SECOND_COMPREHENSION: 20,
  THUMBNAIL_LEGIBILITY: 20,
  CONTENT_PROMISE_ALIGNMENT: 10,
} as const;
export type ClickClarityDimension = keyof typeof CLICK_CLARITY_WEIGHTS;

export function evaluateCoverClickClarity(input: {
  scores: Record<ClickClarityDimension, number>;
  hardBlocks?: CoverErrorCode[];
  accountGoal: AccountGoal;
}) {
  const dimensions = Object.entries(CLICK_CLARITY_WEIGHTS).map(([dimension, weight]) => {
    const score = input.scores[dimension as ClickClarityDimension];
    if (!Number.isInteger(score) || score < 0 || score > weight)
      throw new Error(`COVER_CLICK_CLARITY_SCORE_INVALID:${dimension}`);
    return { dimension: dimension as ClickClarityDimension, weight, score };
  });
  const totalScore = dimensions.reduce((sum, item) => sum + item.score, 0);
  const threshold = input.accountGoal === "LEAD_GENERATION" ? 85 : 75;
  const hardBlocks = [...new Set(input.hardBlocks ?? [])];
  return {
    dimensions,
    total_score: totalScore,
    threshold,
    hard_blocks: hardBlocks,
    result: hardBlocks.length
      ? ("BLOCKED" as const)
      : totalScore >= threshold
        ? ("PASS_PENDING_OPERATOR" as const)
        : ("FAIL" as const),
    operator_approval_required: true as const,
  };
}

export const SEMANTIC_RELEVANCE_WEIGHTS = {
  INDUSTRY_RELEVANCE: 20,
  BUSINESS_SCENE_RELEVANCE: 20,
  PAINPOINT_RELEVANCE: 20,
  CONTENT_VALUE_RELEVANCE: 15,
  PROJECT_OR_SUBJECT_RELEVANCE: 15,
  AUDIENCE_RECOGNITION: 10,
} as const;
export type SemanticRelevanceDimension = keyof typeof SEMANTIC_RELEVANCE_WEIGHTS;

export function evaluateVisualSemanticRelevance(input: {
  semanticRole: CoverSemanticRole;
  directRelationStatement: string;
  scores: Record<SemanticRelevanceDimension, number>;
  accountGoal: AccountGoal;
  projectProfileAllowsAbstract: boolean;
  operatorRejected: boolean;
  targetAudienceCanRecognize: boolean;
}) {
  const dimensions = Object.entries(SEMANTIC_RELEVANCE_WEIGHTS).map(([dimension, weight]) => {
    const score = input.scores[dimension as SemanticRelevanceDimension];
    if (!Number.isInteger(score) || score < 0 || score > weight)
      throw new Error(`VISUAL_SEMANTIC_RELEVANCE_SCORE_INVALID:${dimension}`);
    return { dimension: dimension as SemanticRelevanceDimension, weight, score };
  });
  const hardBlocks: CoverErrorCode[] = [];
  if (input.accountGoal === "LEAD_GENERATION" && input.semanticRole === "DECORATIVE_ONLY")
    hardBlocks.push("DECORATIVE_BACKGROUND_NOT_ALLOWED");
  if (
    input.semanticRole === "ABSTRACT_SEMANTIC" &&
    (!input.directRelationStatement.trim() ||
      !input.projectProfileAllowsAbstract ||
      !input.targetAudienceCanRecognize ||
      input.operatorRejected)
  )
    hardBlocks.push("ABSTRACT_METAPHOR_TOO_WEAK");
  const totalScore = dimensions.reduce((sum, item) => sum + item.score, 0);
  const threshold = input.accountGoal === "LEAD_GENERATION" ? 80 : 70;
  if (totalScore < threshold && hardBlocks.length === 0)
    hardBlocks.push("VISUAL_SEMANTIC_RELEVANCE_BLOCKED");
  return {
    dimensions,
    total_score: totalScore,
    threshold,
    hard_blocks: [...new Set(hardBlocks)],
    result: hardBlocks.length ? ("BLOCKED" as const) : ("PASS_PENDING_OPERATOR" as const),
    operator_approval_required: true as const,
  };
}

export interface CommercialSpaceCoverConcept {
  candidateId: string;
  hook: string;
  secondaryLine: string;
  strategy: CoverConversionStrategy;
  objective: CoverObjective;
  semanticRole: CoverSemanticRole;
  visualMode: "SCENE_SERIES" | "EDITORIAL_SERIES" | "MIXED";
  composition: string;
  subject: string;
  textToImageRatio: string;
  relationStatement: string;
  strength: string;
  risk: string;
}

export function planCommercialSpaceCalibrationConcepts(): CommercialSpaceCoverConcept[] {
  return [
    {
      candidateId: "CCC-CAL-SPACE-001-A",
      hook: "生意不好，先看门头",
      secondaryLine: "第一眼就劝退顾客？",
      strategy: "PAINPOINT_FIRST",
      objective: "PAINPOINT_DIRECT",
      semanticRole: "DIRECT_PAINPOINT_SCENE",
      visualMode: "SCENE_SERIES",
      composition: "街道顾客视角的完整单门店立面，强标题压住上方低干扰区域。",
      subject: "品类识别弱、入口关系不清的虚构商业门店门头",
      textToImageRatio: "42:58",
      relationStatement: "顾客尚未进店时看到的完整门头，直接呈现第一眼识别不足的Painpoint。",
      strength: "Painpoint直给，门店老板能立即代入顾客第一眼。",
      risk: "需要避免把问题门头拍得过度破败或廉价。",
    },
    {
      candidateId: "CCC-CAL-SPACE-001-B",
      hook: "门店老板，先改第一眼",
      secondaryLine: "门头先讲清品类和定位",
      strategy: "TARGET_AUDIENCE_FIRST",
      objective: "AUDIENCE_FILTER",
      semanticRole: "DIRECT_CUSTOMER_SCENE",
      visualMode: "EDITORIAL_SERIES",
      composition: "近距离斜向入口与招牌区域，文字形成大比例编辑覆盖但保留完整商业身份。",
      subject: "准备升级门店形象的虚构店主所面对的入口与门头决策现场",
      textToImageRatio: "52:48",
      relationStatement: "门店老板的改造决策与门头入口现场同框，直接筛选目标客户。",
      strength: "精准叫出门店老板，客户筛选最强。",
      risk: "编辑文字占比高，必须避免普通大字模板感。",
    },
    {
      candidateId: "CCC-CAL-SPACE-001-C",
      hook: "你的门头，在劝退顾客吗",
      secondaryLine: "先查这3个第一眼信号",
      strategy: "QUESTION_FIRST",
      objective: "RISK_WARNING",
      semanticRole: "DIRECT_BUSINESS_SCENE",
      visualMode: "MIXED",
      composition: "顾客步行接近门店的稍广角视野，Renderer用克制边界标出三个无文字检查区域。",
      subject: "街道动线、招牌识别、入口光线同时可见的虚构门店第一眼场景",
      textToImageRatio: "38:62",
      relationStatement: "接近门店的一秒视野直接承载门头是否劝退顾客的风险判断。",
      strength: "问题感与风险感强，同时保留具体可检查的视觉线索。",
      risk: "问句需要控制焦虑感，不能暗示未经证据支持的经营结果。",
    },
  ];
}
