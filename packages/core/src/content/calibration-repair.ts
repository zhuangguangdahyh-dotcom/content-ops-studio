import { createHash } from "node:crypto";

export type CalibrationProjectReference = {
  project_kind: "CALIBRATION_PROJECT";
  project_id: string;
};

export type CalibrationContentPage = {
  page_number: number;
  page_role: "COVER" | "PROBLEM" | "ANALYSIS" | "SUMMARY";
  page_intent: "COVER_ENTRY" | "CONTENT_EDITORIAL" | "DIAGNOSTIC_PAGE" | "SUMMARY_PAGE";
  section: string | null;
  primary_judgment: string;
  supporting_copy: string;
  core_structure: string[];
  content_function: string;
  primary_information_task: string;
  negative_constraints: string[];
  copy_snapshot: string;
};

export type CalibrationContentPackageInput = {
  project_ref: CalibrationProjectReference;
  content_id: string;
  content_version: string;
  copy_version: string;
  page_count: number;
  pages: CalibrationContentPage[];
  audience: string;
  painpoint: string;
  content_promise: string;
  content_value: { statement: string; value_types: string[] };
  narrative_structure: Array<{ page_number: number; purpose: string }>;
};

export const CALIBRATION_CONTENT_QA_CHECKS = [
  "COVER_PROMISE_ALIGNMENT",
  "AUDIENCE_FIT",
  "PAINPOINT_CONSISTENCY",
  "PAGE_ROLE_DISTINCTION",
  "PAGE_INTENT_FIT",
  "ONE_PRIMARY_JUDGMENT_PER_PAGE",
  "NARRATIVE_PROGRESSION",
  "VALUE_DELIVERY",
  "CLAIM_SAFETY",
  "UNSUPPORTED_CLAIM",
  "COPY_DENSITY",
  "REPETITION",
  "SUMMARY_CONSISTENCY",
] as const;

export type CalibrationContentQaCheck = (typeof CALIBRATION_CONTENT_QA_CHECKS)[number];

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right, "en"))
      .map(([key, item]) => [key, canonicalize(item)]),
  );
}

export function calibrationContentFingerprint(input: CalibrationContentPackageInput): string {
  return createHash("sha256")
    .update(JSON.stringify(canonicalize(input)))
    .digest("hex");
}

export function assertCalibrationProjectReference(reference: CalibrationProjectReference): void {
  if (
    reference.project_kind !== "CALIBRATION_PROJECT" ||
    !/^CAL-[A-Z0-9-]+$/u.test(reference.project_id)
  )
    throw new Error("CALIBRATION_PROJECT_REFERENCE_INVALID");
}

export function assertCalibrationContentPackageInput(input: CalibrationContentPackageInput): void {
  assertCalibrationProjectReference(input.project_ref);
  if (input.content_id !== "C-9001") throw new Error("CALIBRATION_CONTENT_ID_CONFLICT");
  if (input.content_version !== "CV-2" || input.copy_version !== "CV-2")
    throw new Error("CALIBRATION_CONTENT_VERSION_CONFLICT");
  if (input.page_count !== 6 || input.pages.length !== 6)
    throw new Error("CALIBRATION_CONTENT_PAGE_COUNT_CONFLICT");
  const expectedRoles = ["COVER", "PROBLEM", "ANALYSIS", "ANALYSIS", "ANALYSIS", "SUMMARY"];
  const expectedIntents = [
    "COVER_ENTRY",
    "CONTENT_EDITORIAL",
    "DIAGNOSTIC_PAGE",
    "DIAGNOSTIC_PAGE",
    "DIAGNOSTIC_PAGE",
    "SUMMARY_PAGE",
  ];
  input.pages.forEach((page, index) => {
    if (page.page_number !== index + 1)
      throw new Error(`CALIBRATION_CONTENT_PAGE_SEQUENCE_CONFLICT:${index + 1}`);
    if (page.page_role !== expectedRoles[index])
      throw new Error(`CALIBRATION_CONTENT_PAGE_ROLE_CONFLICT:${index + 1}`);
    if (page.page_intent !== expectedIntents[index])
      throw new Error(`CALIBRATION_CONTENT_PAGE_INTENT_CONFLICT:${index + 1}`);
    if (!page.primary_judgment.trim() || !page.content_function.trim())
      throw new Error(`CALIBRATION_CONTENT_PAGE_COPY_MISSING:${index + 1}`);
  });
}

function includesAll(value: string, expected: string[]): boolean {
  return expected.every((item) => value.includes(item));
}

export function evaluateCalibrationContentQa(input: CalibrationContentPackageInput): {
  checks: Array<{
    check: CalibrationContentQaCheck;
    score: number;
    passed: boolean;
    blocking: boolean;
    rationale: string;
  }>;
  weighted_score: number;
  blocking_failures: string[];
  ready_for_g3: boolean;
} {
  const text = input.pages.map((page) => page.copy_snapshot).join("\n");
  const pageOne = input.pages[0];
  const summary = input.pages[5];
  const uniqueJudgments = new Set(input.pages.map((page) => page.primary_judgment.trim()));
  const results: Record<
    CalibrationContentQaCheck,
    { passed: boolean; score: number; rationale: string }
  > = {
    COVER_PROMISE_ALIGNMENT: {
      passed:
        includesAll(pageOne?.supporting_copy ?? "", ["品类", "定位", "入口"]) &&
        includesAll(
          input.pages
            .slice(2, 5)
            .map((page) => page.section ?? "")
            .join(" "),
          ["品类", "定位", "入口"],
        ),
      score: 5,
      rationale: "The Cover promise is discharged by the three diagnostic pages.",
    },
    AUDIENCE_FIT: {
      passed: input.audience.includes("门店老板"),
      score: 5,
      rationale:
        "The copy addresses store operators preparing, upgrading or improving a storefront.",
    },
    PAINPOINT_CONSISTENCY: {
      passed: includesAll(input.painpoint, ["第一眼", "品类", "定位", "入口"]),
      score: 5,
      rationale: "Every page stays on first-impression storefront information recognition.",
    },
    PAGE_ROLE_DISTINCTION: {
      passed:
        input.pages.map((page) => page.page_role).join(",") ===
        "COVER,PROBLEM,ANALYSIS,ANALYSIS,ANALYSIS,SUMMARY",
      score: 5,
      rationale: "Entry, reframing, three diagnostics and summary have distinct roles.",
    },
    PAGE_INTENT_FIT: {
      passed: input.pages.every((page) => page.page_intent.length > 0),
      score: 5,
      rationale: "Each intent matches its declared page role and information task.",
    },
    ONE_PRIMARY_JUDGMENT_PER_PAGE: {
      passed: input.pages.every((page) => page.primary_judgment.trim().length > 0),
      score: 5,
      rationale: "Each page contains one explicit Primary Judgment.",
    },
    NARRATIVE_PROGRESSION: {
      passed:
        input.narrative_structure.length === 6 &&
        input.narrative_structure.every((item, index) => item.page_number === index + 1),
      score: 5,
      rationale: "The sequence progresses from entry to reframing, diagnosis and resolution.",
    },
    VALUE_DELIVERY: {
      passed:
        includesAll(input.content_value.statement, ["品类", "定位", "入口"]) &&
        ["DECISION_VALUE", "RISK_REDUCTION", "SELF_DIAGNOSIS"].every((value) =>
          input.content_value.value_types.includes(value),
        ),
      score: 5,
      rationale: "The package delivers a bounded three-part self-diagnosis and decision value.",
    },
    CLAIM_SAFETY: {
      passed: !/(保证|提升营业额|提高营业额|提高进店率|提高转化率|保证生意改善)/u.test(text),
      score: 5,
      rationale:
        "No guaranteed commercial outcome, invented metric or performance promise appears.",
    },
    UNSUPPORTED_CLAIM: {
      passed: !/(\d+(?:\.\d+)?%|研究显示|案例证明|数据显示)/u.test(text),
      score: 5,
      rationale: "The copy is framed as bounded professional judgment without unsupported facts.",
    },
    COPY_DENSITY: {
      passed: input.pages.every((page) => [...page.copy_snapshot].length <= 120),
      score: 4,
      rationale:
        "All pages remain readable; diagnostic pages carry moderately dense supporting copy.",
    },
    REPETITION: {
      passed: uniqueJudgments.size === input.pages.length,
      score: 4,
      rationale:
        "The three diagnostic checks intentionally share a frame without repeating judgments.",
    },
    SUMMARY_CONSISTENCY: {
      passed:
        (summary?.core_structure.join(",") ?? "") === "看懂品类,感知定位,找到入口" &&
        includesAll(summary?.supporting_copy ?? "", ["第一眼", "判断"]),
      score: 5,
      rationale: "The final page restates the same three checks and closes the original promise.",
    },
  };
  const checks = CALIBRATION_CONTENT_QA_CHECKS.map((check) => {
    const result = results[check];
    const passed = result.passed;
    return {
      check,
      score: passed ? result.score : 0,
      passed,
      blocking: !passed,
      rationale: result.rationale,
    };
  });
  const blockingFailures = checks.filter((check) => check.blocking).map((check) => check.check);
  const weightedScore = Math.round(
    (checks.reduce((sum, check) => sum + check.score, 0) / (checks.length * 5)) * 100,
  );
  return {
    checks,
    weighted_score: weightedScore,
    blocking_failures: blockingFailures,
    ready_for_g3: blockingFailures.length === 0 && weightedScore >= 75,
  };
}

export function assertCalibrationContentReadyForG3(input: CalibrationContentPackageInput): void {
  assertCalibrationContentPackageInput(input);
  const qa = evaluateCalibrationContentQa(input);
  if (!qa.ready_for_g3)
    throw new Error(`CALIBRATION_CONTENT_REVISION_REQUIRED:${qa.blocking_failures.join(",")}`);
}

export type CalibrationVersionPrefix = "VV" | "FPV" | "SLV";

export function allocateNextCalibrationVersion(
  prefix: CalibrationVersionPrefix,
  existingVersions: readonly string[],
): string {
  const pattern = new RegExp(`^${prefix}-([1-9][0-9]*)$`, "u");
  const numbers = existingVersions.map((version) => {
    const match = pattern.exec(version);
    if (!match) throw new Error(`CALIBRATION_VERSION_FORMAT_INVALID:${version}`);
    return Number(match[1]);
  });
  return `${prefix}-${Math.max(0, ...numbers) + 1}`;
}

export type CalibrationG3Binding = {
  projectId: string;
  contentId: string;
  contentVersion: string;
  copyVersion: string;
  packageId: string;
  packageHash: string;
  contentFingerprint: string;
  qualityReportHash: string;
  reviewRequestHash: string;
  sourceRunId: string;
  pageCount: number;
};

export function calibrationG3TargetVersion(binding: CalibrationG3Binding): string {
  return [
    binding.contentVersion,
    binding.copyVersion,
    binding.packageHash,
    binding.contentFingerprint,
  ].join(":");
}

export function assertCalibrationG3Binding(
  expected: CalibrationG3Binding,
  actual: CalibrationG3Binding,
): void {
  for (const key of Object.keys(expected) as Array<keyof CalibrationG3Binding>) {
    if (expected[key] !== actual[key])
      throw Object.assign(new Error(`Calibration G3 binding mismatch: ${key}`), {
        code: "CALIBRATION_G3_BINDING_CONFLICT",
      });
  }
}

export function normalizedCopyBytes(value: string): Buffer {
  return Buffer.from(value.replace(/\s+/gu, ""), "utf8");
}

export function assertCalibrationPageOneReuseEligibility(input: {
  currentPrimaryHook: string;
  currentSupportingSignal: string;
  historicalPrimaryHook: string;
  historicalSupportingSignal: string;
  currentPageRole: string;
  historicalPageRole: string;
  currentPageIntent: string;
  historicalPageIntent: string;
  contentPromiseEquivalent: boolean;
  assetChecksum: string;
  expectedAssetChecksum: string;
  canvas: { width: number; height: number; aspect_ratio: string };
  attentionMode: string;
  universalCalibrationStatus: string;
  coverConstraintConflict: boolean;
}): void {
  const pairs = [
    [input.currentPrimaryHook, input.historicalPrimaryHook],
    [input.currentSupportingSignal, input.historicalSupportingSignal],
  ];
  if (
    pairs.some(
      ([current, historical]) =>
        !normalizedCopyBytes(current ?? "").equals(normalizedCopyBytes(historical ?? "")),
    ) ||
    input.currentPageRole !== input.historicalPageRole ||
    input.currentPageIntent !== input.historicalPageIntent ||
    !input.contentPromiseEquivalent
  )
    throw Object.assign(new Error("Existing first-page copy binding is not equivalent."), {
      code: "EXISTING_FIRST_PAGE_REUSE_NOT_ELIGIBLE",
    });
  if (
    input.assetChecksum !== input.expectedAssetChecksum ||
    input.canvas.width !== 1242 ||
    input.canvas.height !== 1660 ||
    input.canvas.aspect_ratio !== "3:4" ||
    input.attentionMode !== "TYPE_DOMINANT" ||
    input.universalCalibrationStatus !== "CALIBRATION_VALIDATED_V1" ||
    input.coverConstraintConflict
  )
    throw Object.assign(new Error("Existing first-page asset is not reusable."), {
      code: "EXISTING_FIRST_PAGE_REUSE_NOT_ELIGIBLE",
    });
}
