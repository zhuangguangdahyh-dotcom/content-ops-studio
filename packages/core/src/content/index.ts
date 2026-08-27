import { calculateDeterministicFingerprint, countUnicodeCodePoints } from "@content-ops/contracts";

export * from "./calibration-repair.js";

export const CONTENT_QUALITY_WEIGHTS = {
  FOCUS: 15,
  AUDIENCE_RELEVANCE: 15,
  VALUE_DELIVERY: 15,
  EVIDENCE_SUPPORT: 15,
  SUBJECT_FIT: 10,
  PLATFORM_FIT: 10,
  READABILITY: 10,
  ORIGINALITY: 5,
  CTA_RELEVANCE: 5,
} as const;

export type ContentQualityDimension = keyof typeof CONTENT_QUALITY_WEIGHTS;
export type ContentPageDraft = {
  page_number: number;
  page_role: string;
  copy_version: string;
  headline: string;
  body: string;
  supporting_text: string;
  content_purpose: string;
  background_direction: string;
  visual_evidence_requirement: string;
  layout_notes: string;
  negative_constraints: string[];
  created_at: string;
  updated_at: string;
  extensions: Record<string, unknown>;
};

export type ContentClaim = {
  claim_id: string;
  page_number: number;
  claim_type: string;
  claim_text: string;
  evidence_refs: string[];
  support_status: string;
  support_rationale: string;
  limitations: string[];
  rewrite_requirement: string | null;
};

export function validateConfirmedPainpoint(painpoint: Record<string, unknown>): void {
  if (painpoint.review_status !== "PAINPOINT_CONFIRMED") throw new Error("PAINPOINT_NOT_CONFIRMED");
}

export function validateAngleSelection(input: {
  candidates: Array<{ candidate_id: string }>;
  selected_candidate_id: string;
  user_fixed_angle: string | null;
}): void {
  if (!input.user_fixed_angle && input.candidates.length < 3)
    throw new Error("CONTENT_ANGLE_CANDIDATES_INSUFFICIENT");
  if (!input.candidates.some((item) => item.candidate_id === input.selected_candidate_id))
    throw new Error("CONTENT_ANGLE_SELECTION_INVALID");
}

export function validateContentPages(
  pages: ContentPageDraft[],
  resolvedPageCount: number,
): string[] {
  const errors: string[] = [];
  if (resolvedPageCount < 4 || resolvedPageCount > 8) errors.push("PAGE_COUNT_INVALID");
  if (pages.length !== resolvedPageCount) errors.push("PAGE_COUNT_MISMATCH");
  if (pages[0]?.page_role !== "COVER") errors.push("FIRST_PAGE_NOT_COVER");
  pages.forEach((page, index) => {
    if (page.page_number !== index + 1) errors.push(`PAGE_NUMBER_NOT_CONTIGUOUS:${index + 1}`);
    if (!page.content_purpose.trim()) errors.push(`PAGE_PURPOSE_EMPTY:${page.page_number}`);
    if (!page.headline.trim()) errors.push(`PAGE_HEADLINE_EMPTY:${page.page_number}`);
    if (!page.body.trim() && !page.supporting_text.trim())
      errors.push(`PAGE_COPY_EMPTY:${page.page_number}`);
  });
  return errors;
}

export function validateClaimMap(
  claims: ContentClaim[],
  validEvidenceIds: Iterable<string>,
): string[] {
  const evidence = new Set(validEvidenceIds);
  const errors: string[] = [];
  for (const claim of claims) {
    if (["UNSUPPORTED", "REWRITE_REQUIRED"].includes(claim.support_status))
      errors.push(`${claim.claim_id}:CLAIM_UNSUPPORTED`);
    if (["FACTUAL_EXTERNAL", "PROJECT_FIRST_PARTY"].includes(claim.claim_type)) {
      if (claim.evidence_refs.length === 0) errors.push(`${claim.claim_id}:EVIDENCE_REQUIRED`);
      for (const reference of claim.evidence_refs)
        if (!evidence.has(reference))
          errors.push(`${claim.claim_id}:EVIDENCE_UNKNOWN:${reference}`);
    }
    if (
      claim.claim_type === "PROFESSIONAL_JUDGMENT" &&
      claim.support_status !== "JUDGMENT_NO_EXTERNAL_EVIDENCE_REQUIRED" &&
      claim.evidence_refs.length === 0
    )
      errors.push(`${claim.claim_id}:JUDGMENT_CLASSIFICATION_INVALID`);
    if (
      claim.claim_type === "OPINION" &&
      claim.support_status !== "OPINION_NO_EXTERNAL_EVIDENCE_REQUIRED"
    )
      errors.push(`${claim.claim_id}:OPINION_CLASSIFICATION_INVALID`);
  }
  return errors.sort();
}

export function calculateContentQualityScore(
  scores: Record<ContentQualityDimension, number>,
): number {
  const totalWeight = Object.values(CONTENT_QUALITY_WEIGHTS).reduce((sum, value) => sum + value, 0);
  if (totalWeight !== 100) throw new Error("CONTENT_QUALITY_WEIGHT_TOTAL_NOT_100");
  let weighted = 0;
  for (const [dimension, weight] of Object.entries(CONTENT_QUALITY_WEIGHTS)) {
    const score = scores[dimension as ContentQualityDimension];
    if (!Number.isFinite(score) || score < 0 || score > 5)
      throw new Error(`CONTENT_QUALITY_SCORE_INVALID:${dimension}`);
    weighted += (score / 5) * weight;
  }
  return Math.round(weighted * 100) / 100;
}

export function contentReadyForG3(weightedScore: number, blockingFailures: number): boolean {
  return weightedScore >= 75 && blockingFailures === 0;
}

export function buildContentFingerprint(input: {
  painpoint_id: string;
  content_angle: string;
  core_viewpoint: string;
  cover_hook: string;
  content_structure_type: string;
  main_conclusion: string;
}): string {
  return calculateDeterministicFingerprint(input);
}

export function assertTitleLength(title: string): number {
  const count = countUnicodeCodePoints(title);
  if (count < 1 || count > 20) throw new Error("CONTENT_TITLE_LENGTH_INVALID");
  return count;
}

export function compileContentFeishuFields(
  content: Record<string, unknown>,
  pages: ContentPageDraft[],
  fingerprint: string,
  painpointRecordId: string,
): Record<string, unknown> {
  const pageCopy = pages
    .map((page) => `${page.page_number}. ${page.headline}\n${page.body || page.supporting_text}`)
    .join("\n\n");
  return {
    contentsContentTopic: content.content_topic,
    contentsContentId: content.content_id,
    contentsPrimaryPainpoint: [painpointRecordId],
    contentsContentAngle: content.content_angle,
    contentsContentStructureType: content.content_structure_type,
    contentsAudienceExplicitNeed: content.audience_explicit_need,
    contentsAudienceDeepAnxiety: content.audience_deep_anxiety,
    contentsSingleCoreProblem: content.single_core_problem,
    contentsCoreViewpoint: content.core_viewpoint,
    contentsSolutionLogic: content.solution_logic,
    contentsContentObjective: content.content_objective,
    contentsPageCount: content.page_count,
    contentsPageCopy: pageCopy,
    contentsPageStructureSummary: content.page_structure_summary,
    contentsDirectMessageHook: content.direct_message_hook,
    contentsPublishTitle: content.publish_title,
    contentsTitleCharacterCount: content.title_character_count,
    contentsPublishBody: content.publish_body,
    contentsPromotionSuitability: content.promotion_suitability,
    contentsPromotionReason: content.promotion_reason,
    contentsDuplicationRisk: content.duplication_risk,
    contentsContentStatus: content.content_status,
    contentsImageStatus: content.image_status,
    contentsFirstPageApprovalStatus: content.first_page_approval_status,
    contentsFinalApprovalStatus: content.final_approval_status,
    contentsSyncStatus: content.sync_status,
    contentsCreationSource: content.creation_source,
    contentsProjectId: content.project_id,
    contentsRecordUniqueKey: content.record_unique_key,
    contentsContentFingerprint: fingerprint,
    contentsContentVersion: content.content_version,
    contentsSchemaVersion: content.schema_version,
    contentsLastRunId: content.last_run_id,
    contentsCreatedAt: content.created_at,
    contentsUpdatedAt: content.updated_at,
  };
}
