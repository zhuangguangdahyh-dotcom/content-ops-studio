import { readFile } from "node:fs/promises";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import type { FinalManifest, QaReport } from "../../packages/contracts/src/generated/1.0/index.js";
import {
  validateFinalizationEligibility,
  validateQaReadiness,
} from "../../packages/core/src/index.js";

interface WorkflowFixture {
  qa_report: QaReport;
  final_manifest: FinalManifest;
}
const current = {
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  style_lock_version: "SLV-1",
};
let fixture: WorkflowFixture;

beforeAll(async () => {
  fixture = JSON.parse(
    await readFile(
      path.resolve(
        "tests/fixtures/contracts/1.0/visual-workflow/valid/full-visual-finalization.json",
      ),
      "utf8",
    ),
  ) as WorkflowFixture;
});

describe("four-layer QA", () => {
  it("requires all four layers, accurate statistics, and zero blocking failures", () => {
    expect(validateQaReadiness(fixture.qa_report, current).valid).toBe(true);
    const blocked = structuredClone(fixture.qa_report);
    const visual = blocked.visual_checks[0];
    if (!visual) throw new Error("Missing visual check.");
    visual.status = "FAIL";
    visual.severity = "BLOCKING";
    visual.blocking = true;
    blocked.checks[1] = visual;
    blocked.blocking_failure_count = 1;
    blocked.passed_count = 3;
    blocked.overall_status = "QA_FAILED";
    expect(validateQaReadiness(blocked, current).issues.map((entry) => entry.code)).toContain(
      "QA_READINESS_INCONSISTENT",
    );
  });

  it("rejects stale versions and mismatched check statistics", () => {
    const stale = structuredClone(fixture.qa_report);
    stale.content_version = "CV-2";
    stale.passed_count = 99;
    expect(validateQaReadiness(stale, current).issues.map((entry) => entry.code)).toEqual(
      expect.arrayContaining(["VERSION_BINDING_MISMATCH", "QA_STATISTICS_MISMATCH"]),
    );
  });
});

describe("G5 finalization", () => {
  it("accepts current QA and G5 while keeping failed synchronization independent", () => {
    expect(fixture.final_manifest.sync_status).toBe("SYNC_FAILED");
    expect(fixture.final_manifest.image_status).toBe("IMAGE_SET_GENERATED");
    expect(
      validateFinalizationEligibility(fixture.final_manifest, fixture.qa_report, current),
    ).toEqual({ valid: true, issues: [] });
  });

  it("rejects stale G5, failed QA, missing pages, unsafe paths, and checksum mismatch", () => {
    const manifest = structuredClone(fixture.final_manifest);
    manifest.final_approval.target_version = "FINAL-OLD";
    manifest.final_assets.pop();
    manifest.final_output_directory = "../escape";
    const first = manifest.final_assets[0];
    if (first) manifest.checksums[first.asset.relative_path] = "f".repeat(64);
    const qa = structuredClone(fixture.qa_report);
    qa.ready_for_final_approval = false;
    qa.overall_status = "QA_FAILED";
    const codes = validateFinalizationEligibility(manifest, qa, current).issues.map(
      (entry) => entry.code,
    );
    expect(codes).toEqual(
      expect.arrayContaining([
        "G5_VERSION_STALE",
        "FINAL_QA_NOT_READY",
        "PAGE_ASSET_MISSING",
        "ASSET_PATH_TRAVERSAL",
        "FINAL_CHECKSUM_MISMATCH",
      ]),
    );
  });

  it("does not mutate or delete a prior manifest when validating a new version", () => {
    const oldSnapshot = JSON.stringify(fixture.final_manifest);
    const next = structuredClone(fixture.final_manifest);
    next.final_manifest_id = "FINAL-DEMO-002";
    next.content_version = "CV-2";
    validateFinalizationEligibility(next, fixture.qa_report, current);
    expect(JSON.stringify(fixture.final_manifest)).toBe(oldSnapshot);
    expect(next.final_manifest_id).not.toBe(fixture.final_manifest.final_manifest_id);
  });
});
