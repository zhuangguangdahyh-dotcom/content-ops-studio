import { createHash } from "node:crypto";

export type FinalizationProjectKind = "PRODUCTION" | "CALIBRATION" | "TEST_FIXTURE";
export type FinalizationRuntimeMode = "PRODUCTION" | "TEST";
export type FinalizationWorkspaceTarget = "NONE" | "SANDBOX" | "PRODUCTION";

export interface FinalizationApprovalBinding {
  approval_id: string;
  gate: "CONTENT_COPY" | "FIRST_PAGE" | "FINAL_SET";
  decision: "APPROVE" | "REVISE" | "REJECT" | "PAUSE";
  target_id: string;
  target_version: string;
  source_run_id: string;
  deprecated_at: string | null;
  fixture_approval: boolean;
  test_only: boolean;
}

export interface FinalizationPageInput {
  page_number: number;
  page_role: string;
  page_intent: string;
  asset_id: string;
  source_path: string;
  relative_path: string;
  checksum: string;
  width: number;
  height: number;
  file_size: number;
  mime_type: "image/png";
  asset_channel: "AI_GENERATED_VISUAL_RENDERER" | "PURE_RENDERER" | "OPERATOR_ASSET_RENDERER";
  renderer_provenance: string;
  imagegen_provenance: string | null;
  generation_manifest_ref: string;
  render_report_ref: string;
  single_page_qa_ref: string;
  single_page_qa_status: "PASS" | "FAIL";
  hard_block_count: number;
  approved_formal_asset: boolean;
  asset_status: "APPROVED" | "CANDIDATE" | "REJECTED" | "FAILED" | "SUPERSEDED";
}

export interface FinalizationPreviewInput {
  size: "FULL" | "310" | "186";
  source_path: string;
  relative_path: string;
  checksum: string;
}

export interface FinalizationContext {
  project_id: string;
  project_kind: FinalizationProjectKind;
  content_id: string;
  run_id: string;
  runtime_mode: FinalizationRuntimeMode;
  workspace_target: FinalizationWorkspaceTarget;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  first_page_version: string;
  style_lock_id: string;
  style_lock_version: string;
  style_lock_active: boolean;
  style_lock_visual_plan_version: string;
  g3: FinalizationApprovalBinding;
  g4: FinalizationApprovalBinding;
  g5: FinalizationApprovalBinding | null;
  page_count: number;
  pages: FinalizationPageInput[];
  qa_report_id: string;
  qa_status: "QA_PASSED" | "QA_PASSED_WITH_WARNINGS" | "QA_FAILED";
  group_qa_ref: string;
  group_qa_status: "PASS" | "FAIL";
  group_hard_block_count: number;
  continuity_report_ref: string;
  continuity_status: "PASS" | "FAIL";
  strategy_ref: string;
  contact_sheets: FinalizationPreviewInput[];
  content_package_ref: string;
  visual_system_ref: string;
  final_manifest_id: string;
  final_manifest_version: string;
  finalized_at: string;
}

export interface FinalizationIssue {
  code: string;
  message: string;
  path?: string;
}

export interface FinalizationEligibility {
  eligible: boolean;
  status: "NOT_ELIGIBLE" | "ELIGIBLE";
  target_version: string;
  issues: FinalizationIssue[];
}

const SHA256 = /^[a-f0-9]{64}$/u;

function issue(code: string, message: string, path?: string): FinalizationIssue {
  return { code, message, ...(path ? { path } : {}) };
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, stableValue(item)]),
    );
  return value;
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(stableValue(value));
}

export function sha256Canonical(value: unknown): string {
  return createHash("sha256").update(canonicalJson(value), "utf8").digest("hex");
}

export function orderedPageChecksums(context: FinalizationContext): string[] {
  return [...context.pages]
    .sort((left, right) => left.page_number - right.page_number)
    .map((page) => page.checksum);
}

export function buildFinalApprovalTargetVersion(context: FinalizationContext): string {
  const checksumBinding = sha256Canonical(orderedPageChecksums(context)).slice(0, 16);
  return [
    "FINAL",
    context.content_version,
    context.copy_version,
    context.visual_plan_version,
    context.first_page_version,
    context.style_lock_version,
    checksumBinding,
  ].join(":");
}

function validateApproval(
  context: FinalizationContext,
  approval: FinalizationApprovalBinding | null,
  gate: FinalizationApprovalBinding["gate"],
  targetVersion: string,
): FinalizationIssue[] {
  if (!approval)
    return [
      issue(
        gate === "FINAL_SET" ? "G5_APPROVAL_REQUIRED" : `${gate}_APPROVAL_REQUIRED`,
        `${gate} approval is required.`,
      ),
    ];
  const issues: FinalizationIssue[] = [];
  if (approval.gate !== gate || approval.decision !== "APPROVE")
    issues.push(issue(`${gate}_APPROVAL_REQUIRED`, `${gate} must be explicitly approved.`));
  if (approval.target_id !== context.content_id)
    issues.push(issue(`${gate}_TARGET_MISMATCH`, `${gate} target must match current Content.`));
  if (approval.target_version !== targetVersion)
    issues.push(issue(`${gate}_VERSION_MISMATCH`, `${gate} target version is stale.`));
  if (approval.deprecated_at)
    issues.push(issue(`${gate}_APPROVAL_DEPRECATED`, `${gate} approval is deprecated.`));
  if (
    (approval.fixture_approval || approval.test_only) &&
    (context.runtime_mode === "PRODUCTION" || context.workspace_target === "PRODUCTION")
  )
    issues.push(
      issue(
        "FIXTURE_APPROVAL_PRODUCTION_FORBIDDEN",
        "Fixture approvals cannot authorize Production Runtime or Production Workspace.",
      ),
    );
  return issues;
}

export function evaluateFinalizationEligibility(
  context: FinalizationContext,
): FinalizationEligibility {
  const issues: FinalizationIssue[] = [];
  const g5Target = buildFinalApprovalTargetVersion(context);
  if (context.project_kind === "CALIBRATION" && context.workspace_target === "PRODUCTION")
    issues.push(
      issue(
        "CALIBRATION_PRODUCTION_WORKSPACE_FORBIDDEN",
        "Calibration cannot write Production Workspace.",
      ),
    );
  if (context.project_kind === "TEST_FIXTURE" && context.runtime_mode !== "TEST")
    issues.push(
      issue("TEST_FIXTURE_RUNTIME_REQUIRED", "Finalization fixture requires TEST Runtime."),
    );
  if (!context.style_lock_active)
    issues.push(issue("STYLE_LOCK_STALE", "An active Style Lock is required."));
  if (context.style_lock_visual_plan_version !== context.visual_plan_version)
    issues.push(
      issue("STYLE_LOCK_VERSION_MISMATCH", "Style Lock must bind the current Visual Plan."),
    );
  issues.push(
    ...validateApproval(
      context,
      context.g3,
      "CONTENT_COPY",
      `${context.content_version}:${context.copy_version}`,
    ),
    ...validateApproval(context, context.g4, "FIRST_PAGE", context.visual_plan_version),
    ...validateApproval(context, context.g5, "FINAL_SET", g5Target),
  );
  if (context.qa_status === "QA_FAILED")
    issues.push(issue("FINAL_QA_NOT_READY", "Final QA must pass."));
  if (context.continuity_status !== "PASS")
    issues.push(issue("CONTINUITY_REQUIRED", "Image Set Continuity must pass."));
  if (context.group_qa_status !== "PASS")
    issues.push(issue("GROUP_QA_REQUIRED", "Group QA must pass."));
  if (context.group_hard_block_count !== 0)
    issues.push(issue("HARD_BLOCK_EXISTS", "Finalization requires zero group hard blocks."));
  if (context.pages.length !== context.page_count)
    issues.push(issue("PAGE_ASSET_MISSING", "Page count does not match the approved set."));
  const numbers = context.pages.map((page) => page.page_number);
  const expected = Array.from({ length: context.page_count }, (_, index) => index + 1);
  if (JSON.stringify(numbers) !== JSON.stringify(expected))
    issues.push(issue("PAGE_ORDER_INVALID", "Pages must be ordered and contiguous."));
  if (new Set(context.pages.map((page) => page.asset_id)).size !== context.pages.length)
    issues.push(issue("DUPLICATE_PAGE_ASSET_CONFLICT", "Final pages require unique Asset IDs."));
  for (const [index, page] of context.pages.entries()) {
    if (!SHA256.test(page.checksum))
      issues.push(
        issue("FINAL_CHECKSUM_INVALID", "Page checksum must be SHA-256.", `/pages/${index}`),
      );
    if (!page.approved_formal_asset || page.asset_status !== "APPROVED")
      issues.push(
        issue(
          page.asset_status === "CANDIDATE"
            ? "UNAPPROVED_CANDIDATE_FORBIDDEN"
            : "FAILED_OR_SUPERSEDED_ASSET_FORBIDDEN",
          "Delivery accepts only approved formal assets.",
          `/pages/${index}`,
        ),
      );
    if (page.single_page_qa_status !== "PASS" || page.hard_block_count !== 0)
      issues.push(
        issue("SINGLE_PAGE_QA_FAILED", "Every page requires passing QA and zero hard blocks."),
      );
    if (page.mime_type !== "image/png")
      issues.push(issue("FINAL_ASSET_TYPE_INVALID", "V1 Final Set pages must be PNG."));
    if (page.relative_path.startsWith("/") || page.relative_path.includes(".."))
      issues.push(
        issue("ABSOLUTE_OR_TRAVERSAL_PATH_FORBIDDEN", "Manifest paths must be safe and relative."),
      );
  }
  if (
    context.contact_sheets.length !== 3 ||
    new Set(context.contact_sheets.map((item) => item.size)).size !== 3
  )
    issues.push(
      issue("CONTACT_SHEET_SET_INCOMPLETE", "Full, 310 and 186 Contact Sheets are required."),
    );
  return {
    eligible: issues.length === 0,
    status: issues.length === 0 ? "ELIGIBLE" : "NOT_ELIGIBLE",
    target_version: g5Target,
    issues,
  };
}

export function buildFinalSetFingerprintInputs(context: FinalizationContext) {
  return {
    versions: {
      content: context.content_version,
      copy: context.copy_version,
      visual_plan: context.visual_plan_version,
      first_page: context.first_page_version,
    },
    approval_ids: [context.g3.approval_id, context.g4.approval_id, context.g5?.approval_id ?? ""],
    style_lock: { id: context.style_lock_id, version: context.style_lock_version },
    ordered_page_checksums: orderedPageChecksums(context),
    group_qa_ref: context.group_qa_ref,
    continuity_report_ref: context.continuity_report_ref,
    page_count: context.page_count,
  };
}

export function buildFinalSetFingerprint(context: FinalizationContext): string {
  return sha256Canonical(buildFinalSetFingerprintInputs(context));
}

export function isCurrentFinalization(fingerprint: string, context: FinalizationContext): boolean {
  return fingerprint === buildFinalSetFingerprint(context);
}
