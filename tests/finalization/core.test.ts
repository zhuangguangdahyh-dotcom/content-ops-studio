import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildFinalApprovalTargetVersion,
  buildFinalSetFingerprint,
  evaluateFinalizationEligibility,
} from "../../packages/core/src/finalization/index.js";
import { createFinalizationE2eFixture } from "./fixture.js";

type Context = Awaited<ReturnType<typeof createFinalizationE2eFixture>>;

async function fixture() {
  return createFinalizationE2eFixture(await mkdtemp(path.join(os.tmpdir(), "final-core-")));
}

function codes(context: Awaited<ReturnType<typeof fixture>>): string[] {
  return evaluateFinalizationEligibility(context).issues.map((item) => item.code);
}

function page(context: Context, index: number) {
  const value = context.pages[index];
  if (!value) throw new Error(`Fixture page ${index} is missing.`);
  return value;
}

const invalidCases: Array<[string, (value: Context) => void, string]> = [
  [
    "G3 missing",
    (value) => {
      Object.assign(value, { g3: null });
    },
    "CONTENT_COPY_APPROVAL_REQUIRED",
  ],
  [
    "G4 missing",
    (value) => {
      Object.assign(value, { g4: null });
    },
    "FIRST_PAGE_APPROVAL_REQUIRED",
  ],
  ["G5 missing", (value) => (value.g5 = null), "G5_APPROVAL_REQUIRED"],
  ["hard block", (value) => (value.group_hard_block_count = 1), "HARD_BLOCK_EXISTS"],
  [
    "missing page",
    (value) => {
      value.pages.pop();
    },
    "PAGE_ASSET_MISSING",
  ],
  [
    "wrong order",
    (value) => {
      value.pages.reverse();
    },
    "PAGE_ORDER_INVALID",
  ],
  ["stale Style Lock", (value) => (value.style_lock_active = false), "STYLE_LOCK_STALE"],
  ["copy mismatch", (value) => (value.copy_version = "CV-2"), "CONTENT_COPY_VERSION_MISMATCH"],
  [
    "visual mismatch",
    (value) => (value.visual_plan_version = "VV-2"),
    "STYLE_LOCK_VERSION_MISMATCH",
  ],
  [
    "candidate",
    (value) => (page(value, 1).asset_status = "CANDIDATE"),
    "UNAPPROVED_CANDIDATE_FORBIDDEN",
  ],
  [
    "failed attempt",
    (value) => (page(value, 1).asset_status = "FAILED"),
    "FAILED_OR_SUPERSEDED_ASSET_FORBIDDEN",
  ],
  [
    "absolute manifest path",
    (value) => (page(value, 1).relative_path = "/Users/example/page.png"),
    "ABSOLUTE_OR_TRAVERSAL_PATH_FORBIDDEN",
  ],
  [
    "duplicate asset",
    (value) => (page(value, 1).asset_id = page(value, 0).asset_id),
    "DUPLICATE_PAGE_ASSET_CONFLICT",
  ],
  [
    "page QA fail",
    (value) => (page(value, 1).single_page_qa_status = "FAIL"),
    "SINGLE_PAGE_QA_FAILED",
  ],
  ["continuity fail", (value) => (value.continuity_status = "FAIL"), "CONTINUITY_REQUIRED"],
  ["group QA fail", (value) => (value.group_qa_status = "FAIL"), "GROUP_QA_REQUIRED"],
];

describe("Finalization eligibility and binding", () => {
  it("accepts the strict TEST_ONLY fixture and produces a stable checksum-bound fingerprint", async () => {
    const context = await fixture();
    expect(evaluateFinalizationEligibility(context)).toMatchObject({
      eligible: true,
      status: "ELIGIBLE",
    });
    expect(buildFinalSetFingerprint(context)).toMatch(/^[a-f0-9]{64}$/);
    expect(buildFinalSetFingerprint(structuredClone(context))).toBe(
      buildFinalSetFingerprint(context),
    );
    expect(context.g5?.target_version).toContain(
      buildFinalApprovalTargetVersion(context).slice(-16),
    );
  });

  it.each(invalidCases)("blocks %s", async (_name, mutate, expected) => {
    const context = await fixture();
    mutate(context);
    expect(codes(context)).toContain(expected);
  });

  it("rejects fixture approval in Production Runtime and Calibration in Production Workspace", async () => {
    const context = await fixture();
    context.runtime_mode = "PRODUCTION";
    expect(codes(context)).toContain("FIXTURE_APPROVAL_PRODUCTION_FORBIDDEN");
    context.runtime_mode = "TEST";
    context.project_kind = "CALIBRATION";
    context.workspace_target = "PRODUCTION";
    expect(codes(context)).toContain("CALIBRATION_PRODUCTION_WORKSPACE_FORBIDDEN");
  });
});
