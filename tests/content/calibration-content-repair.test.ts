import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertCalibrationContentPackageInput,
  assertCalibrationContentReadyForG3,
  assertCalibrationG3Binding,
  assertCalibrationPageOneReuseEligibility,
  assertCalibrationProjectReference,
  allocateNextCalibrationVersion,
  calibrationG3TargetVersion,
  calibrationContentFingerprint,
  evaluateCalibrationContentQa,
  type CalibrationContentPackageInput,
} from "../../packages/core/src/content/calibration-repair.js";
import { CalibrationContentRepairRuntime } from "../../packages/runtime/src/content/calibration-repair.js";

function packageInput(): CalibrationContentPackageInput {
  const pages = [
    ["COVER", "COVER_ENTRY", null, "门头没说清，\n顾客就走了", "门店老板先查品类、定位和入口", []],
    [
      "PROBLEM",
      "CONTENT_EDITORIAL",
      null,
      "门头真正的问题，\n不是好不好看",
      "而是顾客第一眼能不能看懂：\n你是谁、卖什么、值不值得进去。",
      [],
    ],
    [
      "ANALYSIS",
      "DIAGNOSTIC_PAGE",
      "第一查：品类",
      "不进店，\n能一眼看懂你卖什么吗？",
      "如果门头只能传达“好看”，\n却看不出经营内容，\n顾客就需要花更多力气理解你。",
      [],
    ],
    [
      "ANALYSIS",
      "DIAGNOSTIC_PAGE",
      "第二查：定位",
      "看起来像你真正\n想吸引的那类顾客吗？",
      "材质、比例、灯光和信息密度，\n都在提前告诉顾客：\n这家店适不适合我。",
      [],
    ],
    [
      "ANALYSIS",
      "DIAGNOSTIC_PAGE",
      "第三查：入口",
      "顾客知道从哪里进，\n也愿意靠近吗？",
      "入口太退、太暗、被陈列遮挡，\n都会增加顾客靠近和进入之前的犹豫。",
      [],
    ],
    [
      "SUMMARY",
      "SUMMARY_PAGE",
      null,
      "门头先解决这3件事",
      "漂亮只是结果。\n让顾客第一眼更快完成判断，\n才是门头真正要解决的问题。",
      ["看懂品类", "感知定位", "找到入口"],
    ],
  ] as const;
  return {
    project_ref: {
      project_kind: "CALIBRATION_PROJECT",
      project_id: "CAL-COMMERCIAL-SPACE-001",
    },
    content_id: "C-9001",
    content_version: "CV-2",
    copy_version: "CV-2",
    page_count: 6,
    pages: pages.map((page, index) => ({
      page_number: index + 1,
      page_role: page[0],
      page_intent: page[1],
      section: page[2],
      primary_judgment: page[3],
      supporting_copy: page[4],
      core_structure: [...page[5]],
      content_function: `Page ${index + 1} bounded function.`,
      primary_information_task: `Page ${index + 1} primary task.`,
      negative_constraints: ["No unsupported commercial outcome"],
      copy_snapshot: [page[2], page[3], page[4], ...page[5]].filter(Boolean).join("\n"),
    })),
    audience: "准备开店、升级门店或改善门头的门店老板",
    painpoint: "顾客第一眼不能快速识别门店的品类、定位和入口。",
    content_promise: "通过品类、定位、入口完成一次基础门头自查。",
    content_value: {
      statement: "帮助门店老板从门头审美转向第一眼经营信息识别，并检查品类、定位和入口。",
      value_types: ["DECISION_VALUE", "RISK_REDUCTION", "SELF_DIAGNOSIS"],
    },
    narrative_structure: [
      "为什么值得点开",
      "重新定义问题",
      "检查品类",
      "检查定位",
      "检查入口",
      "形成三项自查",
    ].map((purpose, index) => ({ page_number: index + 1, purpose })),
  };
}

describe("Calibration Content Package repair", () => {
  it("allocates SLV-2 without mutating the historical SLV-1", () => {
    expect(allocateNextCalibrationVersion("SLV", ["SLV-1"])).toBe("SLV-2");
  });

  it("keeps Production and Calibration project references discriminated", () => {
    expect(() =>
      assertCalibrationProjectReference({
        project_kind: "CALIBRATION_PROJECT",
        project_id: "CAL-COMMERCIAL-SPACE-001",
      }),
    ).not.toThrow();
    expect(() =>
      assertCalibrationProjectReference({
        project_kind: "CALIBRATION_PROJECT",
        project_id: "PRJ-20990101-DEMO",
      }),
    ).toThrowError("CALIBRATION_PROJECT_REFERENCE_INVALID");
  });

  it("accepts the exact CV-2 six-page structure and produces deterministic QA", () => {
    const input = packageInput();
    expect(() => assertCalibrationContentPackageInput(input)).not.toThrow();
    expect(() => assertCalibrationContentReadyForG3(input)).not.toThrow();
    const qa = evaluateCalibrationContentQa(input);
    expect(qa).toMatchObject({ weighted_score: 97, blocking_failures: [], ready_for_g3: true });
    expect(qa.checks).toHaveLength(13);
    expect(calibrationContentFingerprint(input)).toHaveLength(64);
    expect(calibrationContentFingerprint(input)).toBe(calibrationContentFingerprint(input));
  });

  it("blocks version drift, page-count drift and unsupported commercial claims", () => {
    expect(() =>
      assertCalibrationContentPackageInput({ ...packageInput(), content_version: "CV-1" }),
    ).toThrowError("CALIBRATION_CONTENT_VERSION_CONFLICT");
    expect(() =>
      assertCalibrationContentPackageInput({ ...packageInput(), page_count: 5 }),
    ).toThrowError("CALIBRATION_CONTENT_PAGE_COUNT_CONFLICT");
    const unsafe = packageInput();
    const page = unsafe.pages[4];
    if (!page) throw new Error("Expected Page 5.");
    page.supporting_copy = "保证提高营业额";
    page.copy_snapshot = `${page.primary_judgment}\n${page.supporting_copy}`;
    expect(() => assertCalibrationContentReadyForG3(unsafe)).toThrowError(
      /CALIBRATION_CONTENT_REVISION_REQUIRED:CLAIM_SAFETY/u,
    );
  });

  it("reuses identical immutable artifacts and rejects same-version payload drift", async () => {
    const projectHome = await mkdtemp(path.join(os.tmpdir(), "calibration-content-repair-"));
    const runtime = new CalibrationContentRepairRuntime({
      projectHome,
      projectId: "CAL-DEMO-001",
      runId: "RUN-20990101-010203-C4R1",
      schemaRoot: path.resolve("plugins/content-ops-studio/schemas/1.0"),
    });
    const value = JSON.parse(
      await readFile(
        path.resolve(
          "tests/fixtures/contracts/1.0/calibration-content-quality-report/valid/complete.json",
        ),
        "utf8",
      ),
    ) as Record<string, unknown>;
    const first = await runtime.writeOnceOrReuse(
      "calibration-content-quality-report",
      "content-quality-report.json",
      value,
    );
    const replay = await runtime.writeOnceOrReuse(
      "calibration-content-quality-report",
      "content-quality-report.json",
      value,
    );
    expect(first.reused).toBe(false);
    expect(replay).toMatchObject({ reused: true, sha256: first.sha256 });
    await expect(
      runtime.writeOnceOrReuse(
        "calibration-content-quality-report",
        "content-quality-report.json",
        { ...value, weighted_score: 96 },
      ),
    ).rejects.toMatchObject({ code: "CALIBRATION_CONTENT_ARTIFACT_VERSION_CONFLICT" });
  });

  it("allocates VV and FPV independently without overwriting historical versions", () => {
    expect(allocateNextCalibrationVersion("VV", ["VV-1"])).toBe("VV-2");
    expect(allocateNextCalibrationVersion("FPV", ["FPV-1", "FPV-2"])).toBe("FPV-3");
    expect(() => allocateNextCalibrationVersion("VV", ["FPV-2"])).toThrowError(
      "CALIBRATION_VERSION_FORMAT_INVALID:FPV-2",
    );
  });

  it("binds G3 to the exact package and rejects a different package hash", () => {
    const binding = {
      projectId: "CAL-COMMERCIAL-SPACE-001",
      contentId: "C-9001",
      contentVersion: "CV-2",
      copyVersion: "CV-2",
      packageId: "CCP-CAL-COMMERCIAL-SPACE-001-CV2",
      packageHash: "a".repeat(64),
      contentFingerprint: "b".repeat(64),
      qualityReportHash: "c".repeat(64),
      reviewRequestHash: "d".repeat(64),
      sourceRunId: "RUN-20260826-223000-C4R1",
      pageCount: 6,
    };
    expect(() => assertCalibrationG3Binding(binding, binding)).not.toThrow();
    expect(calibrationG3TargetVersion(binding)).toContain("CV-2:CV-2");
    expect(() =>
      assertCalibrationG3Binding(binding, { ...binding, packageHash: "e".repeat(64) }),
    ).toThrowError(/packageHash/u);
  });

  it("requires current Page 1 copy, role, intent, canvas and checksum before byte reuse", () => {
    const eligible = {
      currentPrimaryHook: "门头没说清，\n顾客就走了",
      currentSupportingSignal: "门店老板先查品类、定位和入口",
      historicalPrimaryHook: "门头没说清，顾客就走了",
      historicalSupportingSignal: "门店老板先查品类、定位和入口",
      currentPageRole: "COVER",
      historicalPageRole: "COVER",
      currentPageIntent: "COVER_ENTRY",
      historicalPageIntent: "COVER_ENTRY",
      contentPromiseEquivalent: true,
      assetChecksum: "a".repeat(64),
      expectedAssetChecksum: "a".repeat(64),
      canvas: { width: 1242, height: 1660, aspect_ratio: "3:4" },
      attentionMode: "TYPE_DOMINANT",
      universalCalibrationStatus: "CALIBRATION_VALIDATED_V1",
      coverConstraintConflict: false,
    };
    expect(() => assertCalibrationPageOneReuseEligibility(eligible)).not.toThrow();
    expect(() =>
      assertCalibrationPageOneReuseEligibility({
        ...eligible,
        currentPrimaryHook: "A different promise",
      }),
    ).toThrowError("Existing first-page copy binding is not equivalent.");
    expect(() =>
      assertCalibrationPageOneReuseEligibility({
        ...eligible,
        canvas: { ...eligible.canvas, width: 1 },
      }),
    ).toThrowError("Existing first-page asset is not reusable.");
  });

  it("rejects same-version drift for a Step B G3 approval artifact", async () => {
    const projectHome = await mkdtemp(path.join(os.tmpdir(), "calibration-rebinding-"));
    const runtime = new CalibrationContentRepairRuntime({
      projectHome,
      projectId: "CAL-DEMO-001",
      runId: "RUN-20990101-020304-G3B1",
      schemaRoot: path.resolve("plugins/content-ops-studio/schemas/1.0"),
    });
    const value = JSON.parse(
      await readFile(
        path.resolve("tests/fixtures/contracts/1.0/calibration-g3-approval/valid/complete.json"),
        "utf8",
      ),
    ) as Record<string, unknown>;
    const first = await runtime.writeOnceOrReuse(
      "calibration-g3-approval",
      "calibration-g3-approval.json",
      value,
    );
    const replay = await runtime.writeOnceOrReuse(
      "calibration-g3-approval",
      "calibration-g3-approval.json",
      value,
    );
    expect(replay).toMatchObject({ reused: true, sha256: first.sha256 });
    const approvalEvent = value.approval_event as Record<string, unknown>;
    await expect(
      runtime.writeOnceOrReuse("calibration-g3-approval", "calibration-g3-approval.json", {
        ...value,
        approval_event: { ...approvalEvent, comment: "Conflicting replay" },
      }),
    ).rejects.toMatchObject({ code: "CALIBRATION_CONTENT_ARTIFACT_VERSION_CONFLICT" });
  });
});
