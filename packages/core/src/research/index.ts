import { createHash } from "node:crypto";

export const DEFAULT_RESEARCH_WEIGHTS = Object.freeze({
  audience_relevance: 15,
  frequency: 10,
  urgency: 10,
  decision_impact: 15,
  real_cost: 10,
  subject_advantage_fit: 10,
  evidence_strength: 15,
  content_potential: 10,
  promotion_fit: 5,
});

export type EvidenceConfidence =
  "A_DIRECT_STRONG" | "B_MULTI_SOURCE" | "C_SINGLE_OR_INDIRECT" | "D_HYPOTHESIS";
export type PainpointPriority = "CORE" | "IMPORTANT" | "SUPPLEMENTARY";
export type PromotionPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ReviewDecision = "APPROVE" | "REVISE" | "REJECT" | "PAUSE";

export interface NormalizedResearchSource {
  source_id: string;
  source_type: string;
  title: string;
  publisher_or_owner: string;
  source_location: string;
  source_date: string | null;
  retrieved_at: string;
  language: string;
  summary: string;
  supported_claims: string[];
  limitations: string;
  credibility_notes: string;
  is_first_party: boolean;
  is_user_provided: boolean;
  is_current: boolean;
  duplicate_of: string | null;
  content_hash: string;
  extensions: Record<string, unknown>;
}

export interface PainpointScoreInput {
  audience_relevance: number;
  frequency: number;
  urgency: number;
  decision_impact: number;
  real_cost: number;
  subject_advantage_fit: number;
  evidence_strength: number;
  content_potential: number;
  promotion_fit: number;
}

export interface ResearchPainpoint {
  painpoint_id: string;
  project_id: string;
  record_unique_key: string;
  painpoint_name: string;
  review_status: string;
  business_scenario: string;
  audience_type: string;
  decision_stage: string;
  explicit_need: string;
  deep_anxiety: string;
  trigger_events: string[];
  primary_barriers: string[];
  analysis_reason: string;
  commercial_loss_or_real_cost: string;
  content_entry_angles: string[];
  subject_advantages_to_express: string[];
  evidence_refs: string[];
  evidence_confidence: EvidenceConfidence;
  painpoint_priority: PainpointPriority;
  promotion_priority: PromotionPriority;
  contentization_status: string;
  related_content_ids: string[];
  finalized_content_count: number;
  latest_content_date: string | null;
  duplication_risk: "LOW" | "MEDIUM" | "HIGH";
  version: number;
  research_batch_id: string;
  schema_version: string;
  last_run_id: string;
  created_at: string;
  updated_at: string;
  extensions: Record<string, unknown>;
}

const REQUIRED_PROFILE_FIELDS = [
  "project_id",
  "project_status",
  "config_confirmation_status",
  "subject_name",
  "subject_type",
  "industry",
  "audience_profile",
  "audience_decision_characteristics",
  "professional_advantages",
  "target_platforms",
  "primary_platform",
  "industry_pack",
  "platform_pack",
] as const;

const RECOMMENDED_PROFILE_FIELDS = [
  "industry_subfields",
  "core_business_or_products",
  "service_region",
  "price_band",
  "core_content_directions",
] as const;

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

export function validateProjectResearchReadiness(profile: Record<string, unknown>): {
  ready: boolean;
  material_blockers: string[];
  non_blocking_gaps: string[];
} {
  const material: string[] = REQUIRED_PROFILE_FIELDS.filter((field) => !hasValue(profile[field]));
  if (profile.project_status !== "PROJECT_ACTIVE") material.push("project_status_not_active");
  if (profile.config_confirmation_status !== "CONFIG_CONFIRMED")
    material.push("configuration_not_confirmed");
  return {
    ready: material.length === 0,
    material_blockers: [...new Set(material)].sort(),
    non_blocking_gaps: RECOMMENDED_PROFILE_FIELDS.filter((field) => !hasValue(profile[field])),
  };
}

function normalizeText(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ");
}

function assertSafeSourceLocation(location: string): string {
  if (!location.includes(":")) {
    if (location.startsWith("/") || location.includes(".."))
      throw new Error("RESEARCH_SOURCE_PATH_UNSAFE");
    return normalizeText(location);
  }
  let parsed: URL;
  try {
    parsed = new URL(location);
  } catch {
    throw new Error("RESEARCH_SOURCE_URL_INVALID");
  }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password)
    throw new Error("RESEARCH_SOURCE_URL_UNSAFE");
  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.endsWith(".local") ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  )
    throw new Error("RESEARCH_SOURCE_URL_PRIVATE");
  parsed.hash = "";
  for (const parameter of [...parsed.searchParams.keys()])
    if (/^(utm_|fbclid|gclid)/i.test(parameter)) parsed.searchParams.delete(parameter);
  return parsed.toString();
}

export function calculateSourceHash(
  source: Pick<
    NormalizedResearchSource,
    "title" | "publisher_or_owner" | "source_location" | "summary" | "supported_claims"
  >,
): string {
  const normalized = JSON.stringify({
    title: normalizeText(source.title).toLowerCase(),
    publisher: normalizeText(source.publisher_or_owner).toLowerCase(),
    location: source.source_location.toLowerCase(),
    summary: normalizeText(source.summary),
    claims: source.supported_claims.map(normalizeText).sort(),
  });
  return createHash("sha256").update(normalized).digest("hex");
}

export function normalizeResearchSource(
  source: Omit<NormalizedResearchSource, "content_hash" | "duplicate_of"> & {
    content_hash?: string;
    duplicate_of?: string | null;
  },
): NormalizedResearchSource {
  const normalized: NormalizedResearchSource = {
    ...source,
    title: normalizeText(source.title),
    publisher_or_owner: normalizeText(source.publisher_or_owner),
    source_location: assertSafeSourceLocation(source.source_location),
    summary: normalizeText(source.summary),
    supported_claims: [...new Set(source.supported_claims.map(normalizeText))].sort(),
    limitations: normalizeText(source.limitations),
    credibility_notes: normalizeText(source.credibility_notes),
    duplicate_of: source.duplicate_of ?? null,
    content_hash: "",
    extensions: structuredClone(source.extensions),
  };
  if (normalized.summary.length > 1200) throw new Error("RESEARCH_SOURCE_SUMMARY_TOO_LONG");
  normalized.content_hash = calculateSourceHash(normalized);
  if (source.content_hash && source.content_hash !== normalized.content_hash)
    throw new Error("RESEARCH_SOURCE_HASH_MISMATCH");
  return normalized;
}

export function deduplicateSources(sources: NormalizedResearchSource[]): {
  unique: NormalizedResearchSource[];
  duplicates: NormalizedResearchSource[];
} {
  const byLocation = new Map<string, string>();
  const byHash = new Map<string, string>();
  const unique: NormalizedResearchSource[] = [];
  const duplicates: NormalizedResearchSource[] = [];
  for (const source of sources) {
    const existing = byLocation.get(source.source_location) ?? byHash.get(source.content_hash);
    if (existing) {
      duplicates.push({ ...source, duplicate_of: existing });
      continue;
    }
    byLocation.set(source.source_location, source.source_id);
    byHash.set(source.content_hash, source.source_id);
    unique.push({ ...source, duplicate_of: null });
  }
  return { unique, duplicates };
}

export function validateEvidenceReferences(
  painpoints: Array<
    Pick<ResearchPainpoint, "painpoint_id" | "evidence_refs" | "evidence_confidence">
  >,
  evidenceIds: Iterable<string>,
  independentSourceByEvidence: ReadonlyMap<string, string> = new Map(),
): string[] {
  const known = new Set(evidenceIds);
  const errors: string[] = [];
  for (const painpoint of painpoints) {
    if (painpoint.evidence_refs.length === 0)
      errors.push(`${painpoint.painpoint_id}:EVIDENCE_REQUIRED`);
    for (const ref of painpoint.evidence_refs)
      if (!known.has(ref)) errors.push(`${painpoint.painpoint_id}:EVIDENCE_REF_UNKNOWN:${ref}`);
    if (painpoint.evidence_confidence === "B_MULTI_SOURCE") {
      const independent = new Set(
        painpoint.evidence_refs.map((ref) => independentSourceByEvidence.get(ref)).filter(Boolean),
      );
      if (independent.size < 2)
        errors.push(`${painpoint.painpoint_id}:B_CONFIDENCE_REQUIRES_TWO_INDEPENDENT_SOURCES`);
    }
  }
  return errors.sort();
}

function assertScore(value: number, key: string): void {
  if (!Number.isInteger(value) || value < 0 || value > 5)
    throw new Error(`PAINPOINT_SCORE_INVALID:${key}`);
}

export function calculatePainpointWeightedScore(
  input: PainpointScoreInput,
  weights: Readonly<Record<keyof PainpointScoreInput, number>> = DEFAULT_RESEARCH_WEIGHTS,
): number {
  const entries = Object.entries(weights) as Array<[keyof PainpointScoreInput, number]>;
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  if (totalWeight !== 100) throw new Error("PAINPOINT_SCORE_WEIGHT_TOTAL_NOT_100");
  let total = 0;
  for (const [key, weight] of entries) {
    assertScore(input[key], key);
    total += (input[key] / 5) * weight;
  }
  return Math.round(total * 100) / 100;
}

export function assignPainpointPriority(
  weightedScore: number,
  thresholds: { core: number; important: number } = { core: 80, important: 65 },
): PainpointPriority {
  if (weightedScore < 0 || weightedScore > 100 || thresholds.core <= thresholds.important)
    throw new Error("PAINPOINT_PRIORITY_THRESHOLD_INVALID");
  if (weightedScore >= thresholds.core) return "CORE";
  if (weightedScore >= thresholds.important) return "IMPORTANT";
  return "SUPPLEMENTARY";
}

export function validateHypothesisRestrictions(
  painpoint: Pick<
    ResearchPainpoint,
    | "painpoint_id"
    | "evidence_confidence"
    | "painpoint_priority"
    | "promotion_priority"
    | "extensions"
  >,
  allowHypothesisCandidates: boolean,
): string[] {
  if (painpoint.evidence_confidence !== "D_HYPOTHESIS") return [];
  const errors: string[] = [];
  if (!allowHypothesisCandidates) errors.push(`${painpoint.painpoint_id}:HYPOTHESIS_NOT_ALLOWED`);
  if (painpoint.painpoint_priority === "CORE")
    errors.push(`${painpoint.painpoint_id}:HYPOTHESIS_CORE_FORBIDDEN`);
  if (["HIGH", "CRITICAL"].includes(painpoint.promotion_priority))
    errors.push(`${painpoint.painpoint_id}:HYPOTHESIS_HIGH_PROMOTION_FORBIDDEN`);
  const limitations = painpoint.extensions.limitations;
  if (typeof limitations !== "string" || limitations.trim().length === 0)
    errors.push(`${painpoint.painpoint_id}:HYPOTHESIS_LIMITATIONS_REQUIRED`);
  return errors;
}

export function detectExactPainpointDuplicates(
  painpoints: Array<
    Pick<
      ResearchPainpoint,
      "painpoint_id" | "painpoint_name" | "business_scenario" | "audience_type" | "decision_stage"
    >
  >,
): Array<{ duplicate_id: string; original_id: string }> {
  const seen = new Map<string, string>();
  const duplicates: Array<{ duplicate_id: string; original_id: string }> = [];
  for (const item of painpoints) {
    const identity = [
      item.painpoint_name,
      item.business_scenario,
      item.audience_type,
      item.decision_stage,
    ]
      .map((part) => normalizeText(part).toLowerCase())
      .join("|");
    const original = seen.get(identity);
    if (original) duplicates.push({ duplicate_id: item.painpoint_id, original_id: original });
    else seen.set(identity, item.painpoint_id);
  }
  return duplicates;
}

export function validatePainpointBatch(input: {
  project_id: string;
  research_batch_id: string;
  requested_count: number;
  produced_count: number;
  evidence_backed_count: number;
  hypothesis_count: number;
  painpoints: ResearchPainpoint[];
  allow_hypothesis_candidates: boolean;
}): string[] {
  const errors: string[] = [];
  if (input.produced_count !== input.painpoints.length) errors.push("PRODUCED_COUNT_MISMATCH");
  if (input.evidence_backed_count + input.hypothesis_count !== input.produced_count)
    errors.push("EVIDENCE_COUNT_MISMATCH");
  if (input.produced_count > input.requested_count) errors.push("PRODUCED_COUNT_EXCEEDS_REQUESTED");
  for (const painpoint of input.painpoints) {
    if (painpoint.project_id !== input.project_id)
      errors.push(`${painpoint.painpoint_id}:PROJECT_MISMATCH`);
    if (painpoint.research_batch_id !== input.research_batch_id)
      errors.push(`${painpoint.painpoint_id}:BATCH_MISMATCH`);
    if (painpoint.review_status !== "PAINPOINT_PENDING")
      errors.push(`${painpoint.painpoint_id}:INITIAL_REVIEW_STATUS_NOT_PENDING`);
    errors.push(...validateHypothesisRestrictions(painpoint, input.allow_hypothesis_candidates));
  }
  for (const duplicate of detectExactPainpointDuplicates(input.painpoints))
    errors.push(`${duplicate.duplicate_id}:EXACT_DUPLICATE_OF:${duplicate.original_id}`);
  return errors.sort();
}

export function validateReviewBatch(
  review: {
    research_batch_id: string;
    painpoint_batch_version: number;
    review_version: number;
    items: Array<{ painpoint_id: string; painpoint_version: number; decision: ReviewDecision }>;
  },
  current: {
    research_batch_id: string;
    painpoint_batch_version: number;
    painpointVersions: ReadonlyMap<string, number>;
    latestReviewVersion: number;
  },
): string[] {
  const errors: string[] = [];
  if (review.research_batch_id !== current.research_batch_id)
    errors.push("REVIEW_BATCH_TARGET_MISMATCH");
  if (review.painpoint_batch_version !== current.painpoint_batch_version)
    errors.push("REVIEW_BATCH_VERSION_STALE");
  if (review.review_version <= current.latestReviewVersion) errors.push("REVIEW_VERSION_STALE");
  const ids = new Set<string>();
  for (const item of review.items) {
    if (ids.has(item.painpoint_id)) errors.push(`${item.painpoint_id}:MULTIPLE_CURRENT_DECISIONS`);
    ids.add(item.painpoint_id);
    const currentVersion = current.painpointVersions.get(item.painpoint_id);
    if (currentVersion === undefined) errors.push(`${item.painpoint_id}:NOT_IN_RESEARCH_BATCH`);
    else if (currentVersion !== item.painpoint_version)
      errors.push(`${item.painpoint_id}:PAINPOINT_VERSION_STALE`);
  }
  return errors.sort();
}

export function calculateResearchCoverage(input: {
  requested_count: number;
  painpoints: Array<
    Pick<
      ResearchPainpoint,
      "audience_type" | "decision_stage" | "business_scenario" | "evidence_confidence"
    >
  >;
  source_types: string[];
}): {
  produced_count: number;
  requested_coverage: number;
  audience_count: number;
  decision_stage_count: number;
  scenario_count: number;
  source_type_count: number;
  evidence_backed_count: number;
} {
  const count = input.painpoints.length;
  return {
    produced_count: count,
    requested_coverage: Math.round((count / input.requested_count) * 10000) / 10000,
    audience_count: new Set(input.painpoints.map((item) => item.audience_type)).size,
    decision_stage_count: new Set(input.painpoints.map((item) => item.decision_stage)).size,
    scenario_count: new Set(input.painpoints.map((item) => item.business_scenario)).size,
    source_type_count: new Set(input.source_types).size,
    evidence_backed_count: input.painpoints.filter(
      (item) => item.evidence_confidence !== "D_HYPOTHESIS",
    ).length,
  };
}

export function compilePainpointFeishuFields(
  painpoint: ResearchPainpoint,
  evidence: Array<{
    source_type: string;
    source_name: string;
    source_location: string;
    summary: string;
    source_date: string | null;
  }>,
): Record<string, string | number | string[]> {
  return {
    painpointsPainpointName: painpoint.painpoint_name,
    painpointsPainpointId: painpoint.painpoint_id,
    painpointsReviewStatus: painpoint.review_status,
    painpointsBusinessScenario: painpoint.business_scenario,
    painpointsAudienceType: painpoint.audience_type,
    painpointsDecisionStage: painpoint.decision_stage,
    painpointsExplicitNeed: painpoint.explicit_need,
    painpointsDeepAnxiety: painpoint.deep_anxiety,
    painpointsTriggerEvents: painpoint.trigger_events.join("\n"),
    painpointsPrimaryBarriers: painpoint.primary_barriers.join("\n"),
    painpointsAnalysisReason: painpoint.analysis_reason,
    painpointsCommercialLoss: painpoint.commercial_loss_or_real_cost,
    painpointsContentEntryAngles: painpoint.content_entry_angles.join("\n"),
    painpointsSubjectAdvantages: painpoint.subject_advantages_to_express.join("\n"),
    painpointsEvidenceSourceType: [...new Set(evidence.map((item) => item.source_type))],
    painpointsEvidenceSource: evidence
      .map((item) => `${item.source_name} | ${item.source_location}`)
      .join("\n"),
    painpointsEvidenceSummary: evidence.map((item) => item.summary).join("\n"),
    painpointsEvidenceDate: evidence
      .map((item) => item.source_date)
      .filter(Boolean)
      .join(", "),
    painpointsEvidenceConfidence: painpoint.evidence_confidence,
    painpointsPainpointPriority: painpoint.painpoint_priority,
    painpointsPromotionPriority: painpoint.promotion_priority,
    painpointsContentizationStatus: painpoint.contentization_status,
    painpointsRelatedContent: painpoint.related_content_ids,
    painpointsFinalizedContentCount: painpoint.finalized_content_count,
    painpointsLatestContentDate: painpoint.latest_content_date ?? "",
    painpointsDuplicationRisk: painpoint.duplication_risk,
    painpointsNotes:
      typeof painpoint.extensions.notes === "string" ? painpoint.extensions.notes : "",
    painpointsProjectId: painpoint.project_id,
    painpointsRecordUniqueKey: painpoint.record_unique_key,
    painpointsResearchBatchId: painpoint.research_batch_id,
    painpointsSchemaVersion: painpoint.schema_version,
    painpointsLastRunId: painpoint.last_run_id,
    painpointsCreatedAt: painpoint.created_at,
    painpointsUpdatedAt: painpoint.updated_at,
  };
}
