import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type {
  ApprovalEvent,
  FirstPageReview,
  StyleLock,
} from "../../packages/contracts/src/generated/1.0/index.js";
import { FirstPageRuntime } from "../../packages/runtime/src/first-page/index.js";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("Phase 4B first-page G4 Runtime", () => {
  it("binds approval to FPV checksum, creates one Style Lock and replays without duplication", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "content-ops-g4-"));
    roots.push(root);
    const stateFile = path.join(root, "first-page-runtime-state.json");
    const runtime = new FirstPageRuntime(stateFile);
    const checksum = "a".repeat(64);
    const pending = {
      project_id: "PRJ-20990101-DEMO",
      content_id: "C-0001",
      run_id: "RUN-20990101-010203-DEMO",
      content_version: "CV-1",
      copy_version: "CV-1",
      visual_plan_version: "VV-1",
      first_page_version: "FPV-1",
      asset_id: "AST-C0001-FP-001",
      asset_checksum: checksum,
      renderer_environment_ref:
        "projects/PRJ-20990101-DEMO/runs/RUN-20990101-010203-DEMO/outputs/first-page/renderer-environment-evidence.json",
      status: "AWAITING_USER_APPROVAL" as const,
      style_lock_version: null,
      approval_id: null,
    };
    await runtime.recordPending(pending);
    expect(JSON.parse(await readFile(stateFile, "utf8"))).toMatchObject({
      status: "AWAITING_USER_APPROVAL",
      style_lock_version: null,
    });

    const review: FirstPageReview = {
      first_page_review_id: "FPR-PHASE4B-001",
      project_id: pending.project_id,
      content_id: pending.content_id,
      content_version: pending.content_version,
      copy_version: pending.copy_version,
      visual_plan_version: pending.visual_plan_version,
      first_page_version: pending.first_page_version,
      asset_checksum: checksum,
      decision: "APPROVE",
      overall_comment: "Approved fictional fixture.",
      layout_feedback: "",
      typography_feedback: "",
      color_feedback: "",
      hierarchy_feedback: "",
      graphic_feedback: "",
      copy_feedback: "",
      requested_changes: [],
      revision_classification: "NONE",
      reviewer_role: "OPERATOR",
      source_run_id: pending.run_id,
      created_at: "2099-01-01T01:02:03.000Z",
      schema_version: "1.0.0",
      extensions: {},
    };
    const approval: ApprovalEvent = {
      approval_id: "APR-20990101-G4AA",
      gate: "FIRST_PAGE",
      target_type: "FIRST_PAGE_ASSET",
      target_id: pending.asset_id,
      target_version: `CV-1:CV-1:VV-1:FPV-1:${checksum}`,
      decision: "APPROVE",
      comment: "Approved fictional first page.",
      source_run_id: pending.run_id,
      created_at: "2099-01-01T01:02:03.000Z",
      deprecated_at: null,
      schema_version: "1.0.0",
    };
    const sourceAsset: StyleLock["source_first_page_asset"] = {
      asset_id: pending.asset_id,
      asset_role: "RENDERED_PAGE",
      asset_type: "IMAGE",
      mime_type: "image/png",
      relative_path:
        "projects/PRJ-20990101-DEMO/runs/RUN-20990101-010203-DEMO/outputs/first-page/01-cover_v001.png",
      source_type: "RENDERED",
      source_adapter: "PlaywrightHtmlCssRendererAdapter",
      source_run_id: pending.run_id,
      source_generation_id: "GEN-C0001-FP-001",
      version: 1,
      width: 1242,
      height: 1660,
      file_size: 4096,
      checksum,
      created_at: "2099-01-01T01:02:03.000Z",
      extensions: {},
    };
    const input: Parameters<FirstPageRuntime["finalizeG4"]>[0] = {
      review,
      approval,
      styleLockId: "SL-C0001-001",
      styleLockVersion: "SLV-1",
      sourceFirstPagePlanId: "PVP-C0001-01",
      sourceAsset,
      canvas: {
        width: 1242,
        height: 1660,
        aspect_ratio: "3:4" as const,
        orientation: "PORTRAIT" as const,
        resolution_unit: "PX" as const,
      },
      safeArea: { top: 96, right: 84, bottom: 96, left: 84, unit: "PX" as const },
      typography: [
        {
          token_id: "TYPO-DISPLAY-TITLE",
          role: "TITLE" as const,
          font_family: "PingFang SC",
          font_weight: 700,
          font_size: 76,
          line_height: 1.12,
          letter_spacing: 0,
          alignment: "LEFT" as const,
          max_lines: 3,
          overflow_strategy: "REFLOW" as const,
        },
      ],
      colors: [
        {
          token_id: "COLOR-WARM-WHITE",
          role: "BACKGROUND" as const,
          value: "#F5F2EB",
          color_space: "HEX" as const,
          opacity: 1,
        },
      ],
      grid: { columns: 12, gutter: 24 },
      imageTreatment: {
        brightness: 0,
        contrast: 0,
        saturation: -0.1,
        blur: 0,
        overlay: "none",
        gradient: "none",
        mask: "none",
        crop_strategy: "COVER" as const,
      },
      visualMode: "EDITORIAL_SERIES" as const,
      createdAt: "2099-01-01T01:02:03.000Z",
    };

    await expect(
      runtime.finalizeG4({
        ...input,
        review: { ...review, asset_checksum: "b".repeat(64) },
      }),
    ).rejects.toMatchObject({ code: "FIRST_PAGE_REVIEW_CONFLICT" });
    const completed = await runtime.finalizeG4(input);
    expect(completed.reused).toBe(false);
    expect(completed.styleLock).toMatchObject({
      style_lock_version: "SLV-1",
      first_page_version: "FPV-1",
      source_first_page_checksum: checksum,
    });
    const replay = await runtime.finalizeG4(input);
    expect(replay).toMatchObject({ reused: true, styleLock: null });
  });

  it("records a routed G4 REVISE without creating a Style Lock", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "content-ops-g4-revise-"));
    roots.push(root);
    const runtime = new FirstPageRuntime(path.join(root, "first-page-runtime-state.json"));
    const checksum = "b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5";
    const pending = {
      project_id: "PRJ-20990101-DEMO",
      content_id: "C-0001",
      run_id: "RUN-20990101-010203-R2RV",
      content_version: "CV-1",
      copy_version: "CV-1",
      visual_plan_version: "VV-2",
      first_page_version: "FPV-2",
      asset_id: "AST-C0001-FPV2",
      asset_checksum: checksum,
      renderer_environment_ref: "projects/demo/renderer-environment-evidence.json",
      status: "AWAITING_USER_APPROVAL" as const,
      style_lock_version: null,
      approval_id: null,
    };
    await runtime.recordPending(pending);
    const review: FirstPageReview = {
      first_page_review_id: "FPR-C0001-R2-001",
      project_id: pending.project_id,
      content_id: pending.content_id,
      content_version: "CV-1",
      copy_version: "CV-1",
      visual_plan_version: "VV-2",
      first_page_version: "FPV-2",
      asset_checksum: checksum,
      decision: "REVISE",
      overall_comment: "Cover conversion copy and global visual direction require revision.",
      layout_feedback: "Preserve the source asset as a negative reference only.",
      typography_feedback: "Do not lock the current hierarchy.",
      color_feedback: "No Style Lock is authorized.",
      hierarchy_feedback: "The click reason must become clear at thumbnail size.",
      graphic_feedback: "The background must have direct semantic relevance.",
      copy_feedback: "Create conversion-specific cover copy.",
      requested_changes: ["Revise cover copy and global visual direction."],
      revision_classification: "CONTENT_COPY",
      revision_routes: ["CONTENT_COPY", "GLOBAL_VISUAL_DIRECTION"],
      reviewer_role: "OPERATOR",
      source_run_id: pending.run_id,
      created_at: "2099-01-01T01:02:03.000Z",
      schema_version: "1.0.0",
      extensions: {},
    };
    const approval: ApprovalEvent = {
      approval_id: "APR-20990101-G4RV",
      gate: "FIRST_PAGE",
      target_type: "FIRST_PAGE_ASSET",
      target_id: pending.asset_id,
      target_version: `CV-1:CV-1:VV-2:FPV-2:${checksum}`,
      decision: "REVISE",
      comment: "Explicit Operator G4 REVISE.",
      source_run_id: pending.run_id,
      created_at: "2099-01-01T01:02:03.000Z",
      deprecated_at: null,
      schema_version: "1.0.0",
    };
    const result = await runtime.finalizeG4({
      review,
      approval,
      styleLockId: "SL-NOT-CREATED",
      styleLockVersion: "SLV-1",
      sourceFirstPagePlanId: "FPPP-C0001-FPV2",
      sourceAsset: {} as never,
      canvas: {} as never,
      safeArea: {} as never,
      typography: [] as never,
      colors: [] as never,
      grid: {},
      imageTreatment: {} as never,
      visualMode: "EDITORIAL_SERIES",
      createdAt: "2099-01-01T01:02:03.000Z",
    });
    expect(result).toMatchObject({
      state: {
        status: "REVISION_REQUIRED",
        style_lock_version: null,
        approval_id: approval.approval_id,
      },
      styleLock: null,
      reused: false,
    });

    await runtime
      .recordPending({ ...pending, run_id: "RUN-20990101-020203-R2RV" })
      .catch(() => undefined);
    const invalidReview: FirstPageReview = {
      ...review,
      revision_routes: ["GLOBAL_VISUAL_DIRECTION"],
    };
    await expect(
      runtime.finalizeG4({
        review: invalidReview,
        approval,
        styleLockId: "SL-NOT-CREATED",
        styleLockVersion: "SLV-1",
        sourceFirstPagePlanId: "FPPP-C0001-FPV2",
        sourceAsset: {} as never,
        canvas: {} as never,
        safeArea: {} as never,
        typography: [] as never,
        colors: [] as never,
        grid: {},
        imageTreatment: {} as never,
        visualMode: "EDITORIAL_SERIES",
        createdAt: "2099-01-01T01:02:03.000Z",
      }),
    ).rejects.toMatchObject({ code: "G4_REVISION_ROUTE_INVALID" });
  });
});
