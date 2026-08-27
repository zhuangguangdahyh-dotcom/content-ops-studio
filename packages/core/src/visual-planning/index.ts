import { createHash } from "node:crypto";
import { countUnicodeCodePoints } from "@content-ops/contracts";

export const VISUAL_PLANNING_QUALITY_WEIGHTS = {
  CONTENT_FIDELITY: 20,
  VISUAL_MODE_FIT: 15,
  GROUP_CONSISTENCY: 15,
  PAGE_SPECIFIC_RELEVANCE: 15,
  READABILITY_FEASIBILITY: 15,
  ASSET_FEASIBILITY: 10,
  PROJECT_FIT: 5,
  PLATFORM_FIT: 5,
} as const;

export const VISUAL_PLANNING_ERROR_CODES = [
  "CONTENT_NOT_COPY_APPROVED",
  "G3_APPROVAL_MISSING",
  "G3_APPROVAL_STALE",
  "VISUAL_CONTEXT_INCOMPLETE",
  "VISUAL_MODE_UNSUPPORTED",
  "VISUAL_DIRECTION_PROHIBITED",
  "VISUAL_REFERENCE_UNSAFE",
  "VISUAL_ASSET_UNAVAILABLE",
  "VISUAL_COPY_VERSION_MISMATCH",
  "VISUAL_COPY_DRIFT",
  "VISUAL_PAGE_COUNT_MISMATCH",
  "VISUAL_PAGE_SEQUENCE_INVALID",
  "VISUAL_TOKEN_REFERENCE_INVALID",
  "VISUAL_TEXT_OVERFLOW",
  "VISUAL_LAYOUT_BLOCKED",
  "VISUAL_PLAN_QUALITY_BLOCKED",
  "VISUAL_PLAN_STALE",
  "VISUAL_PLAN_CONFLICT",
  "FIRST_PAGE_HANDOFF_NOT_READY",
  "CONTENT_REVISION_REQUIRED",
] as const;

export type VisualQualityDimension = keyof typeof VISUAL_PLANNING_QUALITY_WEIGHTS;
export type ApprovedCopySnapshot = {
  copy_version: string;
  headline: string;
  body: string;
  supporting_text: string;
};

export type VisualContextInput = {
  content_status: string;
  content_version: string;
  copy_version: string;
  g3_target_version: string;
  g3_deprecated_at?: string | null;
  expected_page_count: number;
  page_copy_hashes: Array<{ page_number: number; copy_hash: string }>;
};

export type VisualDirectionCandidate = {
  candidate_id: string;
  visual_mode: string;
  blocking_risks: string[];
};

export type PageCopyLike = {
  page_number: number;
  page_role: string;
  copy_snapshot: ApprovedCopySnapshot;
};

export type LayoutPageResult = {
  page_number: number;
  page_role: string;
  headline_codepoints: number;
  body_codepoints: number;
  supporting_codepoints: number;
  total_codepoints: number;
  estimated_density: "LOW" | "MEDIUM" | "HIGH" | "EXCESSIVE";
  estimated_line_count: number;
  available_text_regions: number;
  typography_token_refs: string[];
  safe_area_fit: boolean;
  max_lines_fit: boolean;
  hierarchy_fit: boolean;
  contrast_feasibility: boolean;
  overflow_strategy:
    | "REFLOW"
    | "CHANGE_LAYOUT"
    | "MOVE_SUPPORTING_TEXT"
    | "REDUCE_DECORATION"
    | "CONTENT_REVISION_REQUIRED"
    | "BLOCK_AND_RETURN";
  status: "PASS" | "WARNING" | "BLOCKED";
  warnings: string[];
  blocking_reason: string | null;
};

function fail(code: string): never {
  throw Object.assign(new Error(code), { code });
}

export function hashApprovedCopy(snapshot: ApprovedCopySnapshot): string {
  const canonical = JSON.stringify({
    copy_version: snapshot.copy_version.normalize("NFKC"),
    headline: snapshot.headline.normalize("NFKC"),
    body: snapshot.body.normalize("NFKC"),
    supporting_text: snapshot.supporting_text.normalize("NFKC"),
  });
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

export function validateVisualPlanningContext(input: VisualContextInput): void {
  if (input.content_status !== "COPY_APPROVED") fail("CONTENT_NOT_COPY_APPROVED");
  if (input.content_version !== input.copy_version) fail("VISUAL_COPY_VERSION_MISMATCH");
  if (input.g3_target_version !== `${input.content_version}:${input.copy_version}`)
    fail("G3_APPROVAL_STALE");
  if (input.g3_deprecated_at) fail("G3_APPROVAL_STALE");
  if (input.expected_page_count < 4 || input.expected_page_count > 8)
    fail("VISUAL_PAGE_COUNT_INVALID");
  if (input.page_copy_hashes.length !== input.expected_page_count)
    fail("VISUAL_PAGE_COUNT_MISMATCH");
  input.page_copy_hashes.forEach((page, index) => {
    if (page.page_number !== index + 1) fail("VISUAL_PAGE_SEQUENCE_INVALID");
  });
}

export function validateVisualDirectionDecision(input: {
  candidates: VisualDirectionCandidate[];
  selected_candidate_id: string;
  user_fixed_mode: string | null;
  rejected_modes: string[];
  rejected_directions: string[];
}): VisualDirectionCandidate {
  if (!input.user_fixed_mode && input.candidates.length < 3)
    fail("VISUAL_DIRECTION_CANDIDATES_INSUFFICIENT");
  const selected = input.candidates.find(
    (candidate) => candidate.candidate_id === input.selected_candidate_id,
  );
  if (!selected) fail("VISUAL_DIRECTION_SELECTION_INVALID");
  if (input.rejected_modes.includes(selected.visual_mode)) fail("VISUAL_DIRECTION_PROHIBITED");
  if (input.rejected_directions.includes(selected.candidate_id))
    fail("VISUAL_DIRECTION_PROHIBITED");
  if (selected.blocking_risks.length > 0) fail("VISUAL_ASSET_UNAVAILABLE");
  return selected;
}

export function validateCopyFidelity(
  approvedPages: Array<{ page_number: number; copy: ApprovedCopySnapshot }>,
  visualPages: PageCopyLike[],
): void {
  if (approvedPages.length !== visualPages.length) fail("VISUAL_PAGE_COUNT_MISMATCH");
  for (const [index, approved] of approvedPages.entries()) {
    const visual = visualPages[index];
    if (!visual || visual.page_number !== approved.page_number)
      fail("VISUAL_PAGE_SEQUENCE_INVALID");
    if (hashApprovedCopy(visual.copy_snapshot) !== hashApprovedCopy(approved.copy))
      fail("VISUAL_COPY_DRIFT");
  }
  if (visualPages[0]?.page_role !== "COVER") fail("VISUAL_FIRST_PAGE_NOT_COVER");
}

export function assessLayoutFeasibility(
  page: PageCopyLike,
  input: {
    available_text_regions: number;
    typography_token_refs: string[];
    safe_area_fit: boolean;
  },
): LayoutPageResult {
  const headline = countUnicodeCodePoints(page.copy_snapshot.headline);
  const body = countUnicodeCodePoints(page.copy_snapshot.body);
  const supporting = countUnicodeCodePoints(page.copy_snapshot.supporting_text);
  const total = headline + body + supporting;
  const estimatedLines =
    Math.ceil(headline / 12) + Math.ceil(body / 22) + Math.ceil(supporting / 20);
  const density = total > 300 ? "EXCESSIVE" : total > 190 ? "HIGH" : total > 90 ? "MEDIUM" : "LOW";
  const blocked =
    density === "EXCESSIVE" || !input.safe_area_fit || input.available_text_regions < 1;
  return {
    page_number: page.page_number,
    page_role: page.page_role,
    headline_codepoints: headline,
    body_codepoints: body,
    supporting_codepoints: supporting,
    total_codepoints: total,
    estimated_density: density,
    estimated_line_count: estimatedLines,
    available_text_regions: input.available_text_regions,
    typography_token_refs: input.typography_token_refs,
    safe_area_fit: input.safe_area_fit,
    max_lines_fit: !blocked,
    hierarchy_fit: input.typography_token_refs.length > 0,
    contrast_feasibility: true,
    overflow_strategy: density === "EXCESSIVE" ? "CONTENT_REVISION_REQUIRED" : "REFLOW",
    status: blocked ? "BLOCKED" : density === "HIGH" ? "WARNING" : "PASS",
    warnings: density === "HIGH" ? ["HIGH_TEXT_DENSITY"] : [],
    blocking_reason: blocked
      ? density === "EXCESSIVE"
        ? "CONTENT_REVISION_REQUIRED"
        : "SAFE_AREA_OR_TEXT_REGION_INVALID"
      : null,
  };
}

export function calculateVisualPlanningQualityScore(
  scores: Record<VisualQualityDimension, number>,
): number {
  const total = Object.values(VISUAL_PLANNING_QUALITY_WEIGHTS).reduce(
    (sum, weight) => sum + weight,
    0,
  );
  if (total !== 100) fail("VISUAL_QUALITY_WEIGHT_TOTAL_NOT_100");
  let weighted = 0;
  for (const [dimension, weight] of Object.entries(VISUAL_PLANNING_QUALITY_WEIGHTS)) {
    const score = scores[dimension as VisualQualityDimension];
    if (!Number.isFinite(score) || score < 0 || score > 5)
      fail(`VISUAL_QUALITY_SCORE_INVALID:${dimension}`);
    weighted += (score / 5) * weight;
  }
  return Math.round(weighted * 100) / 100;
}

export function visualPlanReadyForFirstPage(score: number, blockers: number): boolean {
  return score >= 80 && blockers === 0;
}

export function validateAssetRequirement(input: {
  strategy: string;
  evidence_asset_required: boolean;
  evidence_asset_ids: string[];
  informational_text_in_background_allowed: boolean;
  prohibited_content: string[];
}): void {
  if (input.informational_text_in_background_allowed) fail("VISUAL_BACKGROUND_TEXT_FORBIDDEN");
  if (
    input.strategy === "EVIDENCE_SCREENSHOT" &&
    (input.evidence_asset_required === false || input.evidence_asset_ids.length === 0)
  )
    fail("VISUAL_EVIDENCE_ASSET_REQUIRED");
  const unsafe = ["fake certificate", "fake official mark", "fake logo"];
  if (input.prohibited_content.some((item) => unsafe.includes(item.toLowerCase())) === false)
    fail("VISUAL_ASSET_SAFETY_CONSTRAINTS_MISSING");
}

export function assertFirstPageHandoff(input: {
  page_number: number;
  page_role: string;
  ready: boolean;
  quality_ready: boolean;
  layout_blocked_count: number;
  style_lock?: unknown;
  g4_approval?: unknown;
  generated_asset?: unknown;
  output_path?: unknown;
}): void {
  if (input.page_number !== 1 || input.page_role !== "COVER")
    fail("FIRST_PAGE_HANDOFF_TARGET_INVALID");
  if (!input.ready || !input.quality_ready || input.layout_blocked_count > 0)
    fail("FIRST_PAGE_HANDOFF_NOT_READY");
  if (input.style_lock || input.g4_approval || input.generated_asset || input.output_path)
    fail("FIRST_PAGE_HANDOFF_PHASE_BOUNDARY_VIOLATION");
}

export function planVisualRevision(input: {
  from_version: string;
  changes_copy: boolean;
  changes_page_count: boolean;
  first_page_exists: boolean;
  g4_exists: boolean;
}): {
  to_version: string;
  requires_content_revision: boolean;
  requires_new_g3: boolean;
  requires_first_page_regeneration: boolean;
  requires_new_g4: boolean;
} {
  const match = /^VV-([1-9][0-9]*)$/.exec(input.from_version);
  if (!match) fail("VISUAL_PLAN_VERSION_INVALID");
  const contentRevision = input.changes_copy || input.changes_page_count;
  return {
    to_version: `VV-${Number(match[1]) + 1}`,
    requires_content_revision: contentRevision,
    requires_new_g3: contentRevision,
    requires_first_page_regeneration: input.first_page_exists,
    requires_new_g4: input.g4_exists,
  };
}
