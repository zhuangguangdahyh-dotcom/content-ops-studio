import type {
  FinalManifest,
  GenerationManifest,
  PageVisualPlan,
  QaReport,
  RenderReport,
  StyleLock,
  VisualSystem,
} from "../../../contracts/src/generated/1.0/index.js";
import {
  validateChecksumFormat,
  validatePageAssetCompleteness,
  validateRelativeProjectPath,
} from "../assets/index.js";
import {
  issue,
  validationOutcome,
  type ValidationIssue,
  type ValidationOutcome,
} from "../validation-result.js";

export interface CurrentVersions {
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  style_lock_version?: string | null;
}

function compareVersion(
  issues: ValidationIssue[],
  actual: string | null | undefined,
  expected: string | null | undefined,
  field: string,
): void {
  if (actual !== expected)
    issues.push(
      issue("VERSION_BINDING_MISMATCH", `${field} must match the current version.`, `/${field}`),
    );
}

export function validateVersionBindings(
  artifact: CurrentVersions,
  current: CurrentVersions,
): ValidationOutcome {
  const issues: ValidationIssue[] = [];
  compareVersion(issues, artifact.content_version, current.content_version, "content_version");
  compareVersion(issues, artifact.copy_version, current.copy_version, "copy_version");
  compareVersion(
    issues,
    artifact.visual_plan_version,
    current.visual_plan_version,
    "visual_plan_version",
  );
  if (current.style_lock_version !== undefined && artifact.style_lock_version !== undefined)
    compareVersion(
      issues,
      artifact.style_lock_version,
      current.style_lock_version,
      "style_lock_version",
    );
  return validationOutcome(issues);
}

export function validatePageSequence(
  pages: ReadonlyArray<{ page_number: number; page_role: string }>,
  expectedPageCount: number,
): ValidationOutcome {
  const issues: ValidationIssue[] = [];
  if (pages.length !== expectedPageCount)
    issues.push(
      issue("PAGE_COUNT_MISMATCH", "Page count must equal the content page count.", "/pages"),
    );
  const numbers = pages.map((page) => page.page_number);
  if (new Set(numbers).size !== numbers.length)
    issues.push(issue("PAGE_NUMBER_DUPLICATE", "Each page number must occur once.", "/pages"));
  for (let page = 1; page <= expectedPageCount; page += 1)
    if (!numbers.includes(page))
      issues.push(issue("PAGE_SEQUENCE_GAP", `Missing page ${page}.`, "/pages"));
  const first = pages.find((page) => page.page_number === 1);
  if (!first) issues.push(issue("FIRST_PAGE_MISSING", "Page 1 is required.", "/pages"));
  else if (first.page_role !== "COVER")
    issues.push(issue("FIRST_PAGE_NOT_COVER", "Page 1 must have the COVER role.", "/pages"));
  return validationOutcome(issues);
}

export function validateTokenReferences(system: VisualSystem): ValidationOutcome {
  const issues: ValidationIssue[] = [];
  const typography = system.typography_tokens.map((token) => token.token_id);
  const colors = system.color_tokens.map((token) => token.token_id);
  if (new Set(typography).size !== typography.length)
    issues.push(
      issue(
        "TYPOGRAPHY_TOKEN_DUPLICATE",
        "Typography token IDs must be unique.",
        "/typography_tokens",
      ),
    );
  if (new Set(colors).size !== colors.length)
    issues.push(issue("COLOR_TOKEN_DUPLICATE", "Color token IDs must be unique.", "/color_tokens"));
  const typographySet = new Set(typography);
  const colorSet = new Set(colors);
  for (const [pageIndex, page] of system.pages.entries())
    for (const [layerIndex, layer] of page.text_layers.entries()) {
      if (!typographySet.has(layer.typography_token_id))
        issues.push(
          issue(
            "TYPOGRAPHY_TOKEN_MISSING",
            `Unknown token ${layer.typography_token_id}.`,
            `/pages/${pageIndex}/text_layers/${layerIndex}/typography_token_id`,
          ),
        );
      if (!colorSet.has(layer.color_token_id))
        issues.push(
          issue(
            "COLOR_TOKEN_MISSING",
            `Unknown token ${layer.color_token_id}.`,
            `/pages/${pageIndex}/text_layers/${layerIndex}/color_token_id`,
          ),
        );
    }
  return validationOutcome(issues);
}

export function validateVisualSystem(
  system: VisualSystem,
  expectedPageCount: number,
  current: CurrentVersions,
): ValidationOutcome {
  return validationOutcome([
    ...validatePageSequence(system.pages, expectedPageCount).issues,
    ...validateTokenReferences(system).issues,
    ...validateVersionBindings(system, current).issues,
  ]);
}

export function validatePageVisualPlan(
  plan: PageVisualPlan,
  currentPage: {
    page_number: number;
    copy_version: string;
    headline: string;
    body: string;
    supporting_text: string;
  },
  current: CurrentVersions,
): ValidationOutcome {
  const issues = [...validateVersionBindings(plan, current).issues];
  if (plan.page_number !== currentPage.page_number)
    issues.push(
      issue(
        "PAGE_PLAN_TARGET_MISMATCH",
        "Page plan must target an existing content page.",
        "/page_number",
      ),
    );
  if (
    plan.copy_snapshot.copy_version !== currentPage.copy_version ||
    plan.copy_snapshot.headline !== currentPage.headline ||
    plan.copy_snapshot.body !== currentPage.body ||
    plan.copy_snapshot.supporting_text !== currentPage.supporting_text
  )
    issues.push(
      issue(
        "COPY_SNAPSHOT_STALE",
        "Page copy snapshot must equal the current approved copy.",
        "/copy_snapshot",
      ),
    );
  if (plan.estimated_text_density > plan.max_text_density)
    issues.push(
      issue(
        "TEXT_DENSITY_EXCEEDED",
        "Estimated text density exceeds the page maximum.",
        "/estimated_text_density",
      ),
    );
  return validationOutcome(issues);
}

export function validateStyleLockEligibility(
  lock: StyleLock,
  current: CurrentVersions,
): ValidationOutcome {
  const issues = [...validateVersionBindings(lock, current).issues];
  const approval = lock.first_page_approval;
  if (approval.gate !== "FIRST_PAGE")
    issues.push(
      issue(
        "G4_GATE_REQUIRED",
        "Style Lock requires FIRST_PAGE approval.",
        "/first_page_approval/gate",
      ),
    );
  if (approval.decision !== "APPROVE")
    issues.push(
      issue(
        "G4_APPROVAL_REQUIRED",
        "Style Lock requires an APPROVE decision.",
        "/first_page_approval/decision",
      ),
    );
  if (approval.target_type !== "CONTENT" || approval.target_id !== lock.content_id)
    issues.push(
      issue(
        "G4_TARGET_MISMATCH",
        "G4 target must match the current content.",
        "/first_page_approval/target_id",
      ),
    );
  if (
    approval.target_version !== lock.visual_plan_version ||
    lock.first_page_approval_version !== lock.visual_plan_version
  )
    issues.push(
      issue(
        "G4_VERSION_STALE",
        "G4 approval must match the current visual plan version.",
        "/first_page_approval/target_version",
      ),
    );
  if (approval.approval_id !== lock.first_page_approval_id)
    issues.push(
      issue(
        "G4_APPROVAL_ID_MISMATCH",
        "Embedded approval ID must match Style Lock metadata.",
        "/first_page_approval_id",
      ),
    );
  if (approval.deprecated_at)
    issues.push(
      issue(
        "G4_APPROVAL_DEPRECATED",
        "Deprecated approval cannot create Style Lock.",
        "/first_page_approval/deprecated_at",
      ),
    );
  return validationOutcome(issues);
}

export function validateRemainingPagesEligibility(
  plan: PageVisualPlan,
  lock: StyleLock | null,
  current: CurrentVersions,
): ValidationOutcome {
  const issues: ValidationIssue[] = [];
  if (plan.page_number === 1) return validationOutcome(issues);
  if (!lock)
    return validationOutcome([
      issue("STYLE_LOCK_REQUIRED", "Remaining pages require a current Style Lock."),
    ]);
  issues.push(...validateStyleLockEligibility(lock, current).issues);
  if (plan.content_id !== lock.content_id || plan.project_id !== lock.project_id)
    issues.push(
      issue("STYLE_LOCK_TARGET_MISMATCH", "Page plan and Style Lock must target the same content."),
    );
  return validationOutcome(issues);
}

export function validateGenerationManifest(
  manifest: GenerationManifest,
  current: CurrentVersions,
): ValidationOutcome {
  const issues = [...validateVersionBindings(manifest, current).issues];
  if (manifest.page_number > 1 && !manifest.style_lock_version)
    issues.push(
      issue(
        "STYLE_LOCK_REQUIRED",
        "Remaining-page generation requires Style Lock.",
        "/style_lock_version",
      ),
    );
  const attempts = manifest.attempts.map((attempt) => attempt.attempt_number);
  if (new Set(attempts).size !== attempts.length)
    issues.push(
      issue("GENERATION_ATTEMPT_DUPLICATE", "Attempt numbers must be unique.", "/attempts"),
    );
  attempts.forEach((attempt, index) => {
    if (attempt !== index + 1)
      issues.push(
        issue(
          "GENERATION_ATTEMPT_SEQUENCE",
          "Attempt numbers must be consecutive.",
          `/attempts/${index}/attempt_number`,
        ),
      );
  });
  const outputIds = new Set(manifest.output_assets.map((asset) => asset.asset_id));
  for (const [attemptIndex, attempt] of manifest.attempts.entries()) {
    for (const assetId of attempt.output_asset_refs)
      if (!outputIds.has(assetId))
        issues.push(
          issue(
            "ASSET_REFERENCE_MISSING",
            `Attempt references missing asset ${assetId}.`,
            `/attempts/${attemptIndex}/output_asset_refs`,
          ),
        );
  }
  for (const [index, asset] of manifest.output_assets.entries()) {
    issues.push(
      ...validateRelativeProjectPath(asset.relative_path).issues.map((entry) => ({
        ...entry,
        path: `/output_assets/${index}/relative_path`,
      })),
    );
    issues.push(
      ...validateChecksumFormat(asset.checksum).issues.map((entry) => ({
        ...entry,
        path: `/output_assets/${index}/checksum`,
      })),
    );
  }
  return validationOutcome(issues);
}

export function validateRenderReport(
  report: RenderReport,
  current: CurrentVersions,
  availableGenerationIds: ReadonlySet<string>,
): ValidationOutcome {
  const issues = [...validateVersionBindings(report, current).issues];
  if (!availableGenerationIds.has(report.generation_id))
    issues.push(
      issue(
        "GENERATION_REFERENCE_MISSING",
        "Render report must reference a current generation.",
        "/generation_id",
      ),
    );
  if (report.overflow_detected)
    issues.push(
      issue("RENDER_TEXT_OVERFLOW", "Text overflow blocks rendering.", "/overflow_detected"),
    );
  if (report.clipping_detected)
    issues.push(
      issue("RENDER_TEXT_CLIPPING", "Text clipping blocks rendering.", "/clipping_detected"),
    );
  if (report.missing_assets.length)
    issues.push(
      issue("RENDER_ASSET_MISSING", "Required render assets are missing.", "/missing_assets"),
    );
  if (report.unsafe_regions.length)
    issues.push(
      issue(
        "RENDER_SAFE_AREA_VIOLATION",
        "Rendered content enters an unsafe region.",
        "/unsafe_regions",
      ),
    );
  if (!report.output_asset)
    issues.push(
      issue("RENDER_OUTPUT_MISSING", "Render output asset is required.", "/output_asset"),
    );
  else {
    issues.push(...validateRelativeProjectPath(report.output_asset.relative_path).issues);
    issues.push(...validateChecksumFormat(report.output_asset.checksum).issues);
  }
  if (
    issues.length &&
    ["RENDER_SUCCESS", "RENDER_SUCCESS_WITH_WARNINGS"].includes(report.render_status)
  )
    issues.push(
      issue(
        "RENDER_STATUS_INCONSISTENT",
        "A blocked render cannot report success.",
        "/render_status",
      ),
    );
  return validationOutcome(issues);
}

export function validateQaReadiness(report: QaReport, current: CurrentVersions): ValidationOutcome {
  const issues = [...validateVersionBindings(report, current).issues];
  const categories = new Set(report.checks.map((check) => check.category));
  for (const category of ["CONTENT", "VISUAL", "FILE", "DATA"])
    if (!categories.has(category as "CONTENT" | "VISUAL" | "FILE" | "DATA"))
      issues.push(issue("QA_CATEGORY_MISSING", `${category} QA is required.`, "/checks"));
  const blocking = report.checks.filter(
    (check) => check.status === "FAIL" && (check.blocking || check.severity === "BLOCKING"),
  ).length;
  const warnings = report.checks.filter((check) => check.severity === "WARNING").length;
  const passed = report.checks.filter((check) => check.status === "PASS").length;
  if (
    blocking !== report.blocking_failure_count ||
    warnings !== report.warning_count ||
    passed !== report.passed_count
  )
    issues.push(issue("QA_STATISTICS_MISMATCH", "QA statistics must equal the check results."));
  const statusReady =
    report.overall_status === "QA_PASSED" || report.overall_status === "QA_PASSED_WITH_WARNINGS";
  if (report.ready_for_final_approval !== (statusReady && blocking === 0))
    issues.push(
      issue(
        "QA_READINESS_INCONSISTENT",
        "Final approval readiness requires passed QA and zero blocking failures.",
      ),
    );
  return validationOutcome(issues);
}

export function validateFinalizationEligibility(
  manifest: FinalManifest,
  qaReport: QaReport,
  current: CurrentVersions,
): ValidationOutcome {
  const issues = [
    ...validateVersionBindings(manifest, current).issues,
    ...validateQaReadiness(qaReport, current).issues,
  ];
  const approval = manifest.final_approval;
  if (approval.gate !== "FINAL_SET" || approval.decision !== "APPROVE")
    issues.push(issue("G5_APPROVAL_REQUIRED", "Finalization requires approved FINAL_SET G5."));
  if (approval.target_type !== "IMAGE_SET" || approval.target_id !== manifest.content_id)
    issues.push(issue("G5_TARGET_MISMATCH", "G5 must target the current image set."));
  if (approval.target_version !== manifest.final_approval_target_version)
    issues.push(issue("G5_VERSION_STALE", "G5 approval target version is stale."));
  if (approval.deprecated_at)
    issues.push(issue("G5_APPROVAL_DEPRECATED", "Deprecated G5 cannot finalize."));
  if (
    manifest.qa_report_id !== qaReport.qa_report_id ||
    manifest.qa_status !== qaReport.overall_status
  )
    issues.push(issue("FINAL_QA_MISMATCH", "Final Manifest must bind the current QA report."));
  if (!qaReport.ready_for_final_approval)
    issues.push(issue("FINAL_QA_NOT_READY", "QA does not permit final approval."));
  issues.push(...validatePageAssetCompleteness(manifest.final_assets, manifest.page_count).issues);
  issues.push(...validateRelativeProjectPath(manifest.final_output_directory).issues);
  if (manifest.file_count !== manifest.final_assets.length)
    issues.push(issue("FINAL_FILE_COUNT_MISMATCH", "File count must equal final asset count."));
  for (const item of manifest.final_assets)
    if (manifest.checksums[item.asset.relative_path] !== item.asset.checksum)
      issues.push(
        issue(
          "FINAL_CHECKSUM_MISMATCH",
          `Checksum map does not match ${item.asset.relative_path}.`,
        ),
      );
  if (manifest.image_status !== "IMAGE_SET_GENERATED")
    issues.push(
      issue("FINAL_IMAGE_STATUS_INVALID", "Sync failure must not rewrite image generation status."),
    );
  return validationOutcome(issues);
}

export type VisualChangeKind =
  | "PAGE_COPY_CHANGED"
  | "PAGE_COUNT_CHANGED"
  | "GLOBAL_VISUAL_CHANGED"
  | "PAGE_BACKGROUND_REGENERATED"
  | "PAGE_LAYOUT_ADJUSTED"
  | "FILE_REPLACED";

export function calculateVisualInvalidations(change: VisualChangeKind): {
  preserveHistory: true;
  artifacts: string[];
  approvals: string[];
} {
  const definitions: Record<VisualChangeKind, { artifacts: string[]; approvals: string[] }> = {
    PAGE_COPY_CHANGED: {
      artifacts: [
        "PAGE_VISUAL_PLAN",
        "VISUAL_SYSTEM",
        "STYLE_LOCK",
        "RENDER_REPORT",
        "QA_REPORT",
        "FINAL_MANIFEST",
      ],
      approvals: ["FIRST_PAGE", "FINAL_SET"],
    },
    PAGE_COUNT_CHANGED: {
      artifacts: [
        "PAGE_VISUAL_PLAN",
        "VISUAL_SYSTEM",
        "STYLE_LOCK",
        "GENERATION_MANIFEST",
        "QA_REPORT",
        "FINAL_MANIFEST",
      ],
      approvals: ["FIRST_PAGE", "FINAL_SET"],
    },
    GLOBAL_VISUAL_CHANGED: {
      artifacts: [
        "STYLE_LOCK",
        "REMAINING_GENERATION_MANIFEST",
        "RENDER_REPORT",
        "QA_REPORT",
        "FINAL_MANIFEST",
      ],
      approvals: ["FINAL_SET"],
    },
    PAGE_BACKGROUND_REGENERATED: {
      artifacts: ["PAGE_RENDER_REPORT", "PAGE_VISUAL_QA", "PAGE_FILE_QA", "FINAL_MANIFEST"],
      approvals: ["FINAL_SET"],
    },
    PAGE_LAYOUT_ADJUSTED: {
      artifacts: ["PAGE_RENDER_REPORT", "PAGE_QA", "FINAL_MANIFEST"],
      approvals: ["FINAL_SET"],
    },
    FILE_REPLACED: {
      artifacts: ["CHECKSUM", "FILE_QA", "FINAL_MANIFEST"],
      approvals: ["FINAL_SET"],
    },
  };
  return { preserveHistory: true, ...definitions[change] };
}
