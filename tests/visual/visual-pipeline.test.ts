import { readFile } from "node:fs/promises";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import type {
  GenerationManifest,
  PageVisualPlan,
  RenderReport,
  StyleLock,
  VisualSystem,
} from "../../packages/contracts/src/generated/1.0/index.js";
import {
  calculateVisualInvalidations,
  validateGenerationManifest,
  validatePageSequence,
  validatePageVisualPlan,
  validateRemainingPagesEligibility,
  validateRenderReport,
  validateStyleLockEligibility,
  validateTokenReferences,
  validateVisualSystem,
} from "../../packages/core/src/index.js";

interface WorkflowFixture {
  visual_system: VisualSystem;
  page_visual_plans: PageVisualPlan[];
  style_lock: StyleLock;
  first_page_generation_manifest: GenerationManifest;
  remaining_generation_manifests: GenerationManifest[];
  render_reports: RenderReport[];
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

describe("visual planning contracts", () => {
  it("accepts a consecutive four-page visual system with current versions and tokens", () => {
    expect(validateVisualSystem(fixture.visual_system, 4, current)).toEqual({
      valid: true,
      issues: [],
    });
  });

  it("rejects a page gap, duplicate number, missing first page, and non-cover first page", () => {
    expect(
      validatePageSequence(
        fixture.page_visual_plans.filter((page) => page.page_number !== 2),
        4,
      ).issues.map((entry) => entry.code),
    ).toContain("PAGE_SEQUENCE_GAP");
    expect(
      validatePageSequence(
        [
          { page_number: 1, page_role: "COVER" },
          { page_number: 1, page_role: "ANALYSIS" },
        ],
        2,
      ).issues.map((entry) => entry.code),
    ).toContain("PAGE_NUMBER_DUPLICATE");
    expect(
      validatePageSequence([{ page_number: 2, page_role: "ANALYSIS" }], 1).issues.map(
        (entry) => entry.code,
      ),
    ).toContain("FIRST_PAGE_MISSING");
    expect(
      validatePageSequence([{ page_number: 1, page_role: "ANALYSIS" }], 1).issues.map(
        (entry) => entry.code,
      ),
    ).toContain("FIRST_PAGE_NOT_COVER");
  });

  it("rejects duplicate and unresolved typography or color tokens", () => {
    const system = structuredClone(fixture.visual_system);
    const firstToken = system.typography_tokens[0];
    if (!firstToken) throw new Error("Missing typography token.");
    system.typography_tokens.push(firstToken);
    system.pages[0]?.text_layers.forEach((layer) => {
      layer.color_token_id = "COLOR-MISSING";
    });
    const codes = validateTokenReferences(system).issues.map((entry) => entry.code);
    expect(codes).toContain("TYPOGRAPHY_TOKEN_DUPLICATE");
    expect(codes).toContain("COLOR_TOKEN_MISSING");
  });

  it("binds each page plan to the exact copy snapshot and a safe density strategy", () => {
    const plan = fixture.page_visual_plans[0];
    if (!plan) throw new Error("Missing first page plan fixture.");
    const page = {
      page_number: 1,
      copy_version: "CV-1",
      headline: "A fictional decision guide",
      body: "Use evidence before choosing.",
      supporting_text: "Sanitized fixture copy.",
    };
    expect(validatePageVisualPlan(plan, page, current).valid).toBe(true);
    const stale = structuredClone(plan);
    stale.copy_snapshot.body = "Changed copy";
    stale.estimated_text_density = 0.9;
    expect(validatePageVisualPlan(stale, page, current).issues.map((entry) => entry.code)).toEqual(
      expect.arrayContaining(["COPY_SNAPSHOT_STALE", "TEXT_DENSITY_EXCEEDED"]),
    );
    expect(plan.camera_and_lens_direction).toBeNull();
    expect([
      "REFLOW",
      "MOVE_TO_NEXT_PAGE",
      "REVISE_COPY",
      "CHANGE_LAYOUT",
      "BLOCK_AND_RETURN",
    ]).toContain(plan.overflow_strategy);
  });
});

describe("Style Lock and generation boundary", () => {
  it("accepts only current active matching G4 approval", () => {
    expect(validateStyleLockEligibility(fixture.style_lock, current).valid).toBe(true);
    const wrong = structuredClone(fixture.style_lock);
    wrong.first_page_approval.gate = "FINAL_SET";
    wrong.first_page_approval.deprecated_at = "2099-01-01T01:02:03.000Z";
    wrong.first_page_approval.target_version = "VV-2";
    expect(validateStyleLockEligibility(wrong, current).issues.map((entry) => entry.code)).toEqual(
      expect.arrayContaining(["G4_GATE_REQUIRED", "G4_VERSION_STALE", "G4_APPROVAL_DEPRECATED"]),
    );
  });

  it("allows page one without Style Lock and blocks remaining pages without it", () => {
    const first = fixture.page_visual_plans[0];
    const second = fixture.page_visual_plans[1];
    if (!first || !second) throw new Error("Missing page plan fixture.");
    expect(validateRemainingPagesEligibility(first, null, current).valid).toBe(true);
    expect(validateRemainingPagesEligibility(second, null, current).issues[0]?.code).toBe(
      "STYLE_LOCK_REQUIRED",
    );
    expect(validateRemainingPagesEligibility(second, fixture.style_lock, current).valid).toBe(true);
  });

  it("preserves consecutive generation attempts and validates output references", () => {
    const manifest = fixture.remaining_generation_manifests[0];
    if (!manifest) throw new Error("Missing generation fixture.");
    expect(validateGenerationManifest(manifest, current).valid).toBe(true);
    const duplicate = structuredClone(manifest);
    const second = duplicate.attempts[1];
    if (second) second.attempt_number = 1;
    expect(
      validateGenerationManifest(duplicate, current).issues.map((entry) => entry.code),
    ).toContain("GENERATION_ATTEMPT_DUPLICATE");
    const missing = structuredClone(manifest);
    const finalAttempt = missing.attempts[1];
    if (finalAttempt) finalAttempt.output_asset_refs = ["AST-NOT-FOUND"];
    expect(
      validateGenerationManifest(missing, current).issues.map((entry) => entry.code),
    ).toContain("ASSET_REFERENCE_MISSING");
  });
});

describe("render and invalidation contracts", () => {
  it("accepts a current render and blocks overflow, clipping, unsafe regions, missing assets and output", () => {
    const report = fixture.render_reports[0];
    if (!report) throw new Error("Missing render fixture.");
    const generationIds = new Set([report.generation_id]);
    expect(validateRenderReport(report, current, generationIds).valid).toBe(true);
    const failed = structuredClone(report);
    failed.overflow_detected = true;
    failed.clipping_detected = true;
    failed.unsafe_regions = [{ x: 0, y: 0, width: 1, height: 1, unit: "PERCENT" }];
    failed.missing_assets = ["AST-MISSING"];
    failed.output_asset = null;
    expect(
      validateRenderReport(failed, current, generationIds).issues.map((entry) => entry.code),
    ).toEqual(
      expect.arrayContaining([
        "RENDER_TEXT_OVERFLOW",
        "RENDER_TEXT_CLIPPING",
        "RENDER_SAFE_AREA_VIOLATION",
        "RENDER_ASSET_MISSING",
        "RENDER_OUTPUT_MISSING",
        "RENDER_STATUS_INCONSISTENT",
      ]),
    );
  });

  it("calculates scoped, history-preserving invalidations", () => {
    const copyInvalidation = calculateVisualInvalidations("PAGE_COPY_CHANGED");
    expect(copyInvalidation.preserveHistory).toBe(true);
    expect(copyInvalidation.artifacts).toEqual(
      expect.arrayContaining(["STYLE_LOCK", "FINAL_MANIFEST"]),
    );
    expect(calculateVisualInvalidations("PAGE_BACKGROUND_REGENERATED").artifacts).not.toContain(
      "STYLE_LOCK",
    );
    expect(calculateVisualInvalidations("PAGE_LAYOUT_ADJUSTED").artifacts).not.toContain(
      "GENERATION_MANIFEST",
    );
    expect(calculateVisualInvalidations("FILE_REPLACED").artifacts).toEqual([
      "CHECKSUM",
      "FILE_QA",
      "FINAL_MANIFEST",
    ]);
  });
});
