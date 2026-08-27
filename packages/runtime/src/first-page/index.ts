import { readFile, rename, writeFile } from "node:fs/promises";
import type {
  ApprovalEvent,
  FirstPageReview,
  StyleLock,
} from "../../../contracts/src/generated/1.0/index.js";

export interface FirstPageRuntimeState {
  project_id: string;
  content_id: string;
  run_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  first_page_version: string;
  asset_id: string;
  asset_checksum: string;
  renderer_environment_ref: string;
  status: "AWAITING_USER_APPROVAL" | "APPROVED" | "REVISION_REQUIRED" | "REJECTED" | "PAUSED";
  style_lock_version: string | null;
  approval_id: string | null;
}

async function atomicJson(file: string, value: unknown): Promise<void> {
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, file);
}

export class FirstPageRuntime {
  constructor(private readonly stateFile: string) {}

  async recordPending(state: FirstPageRuntimeState): Promise<FirstPageRuntimeState> {
    const existing = await this.read();
    if (existing) {
      if (JSON.stringify(existing) === JSON.stringify(state)) return existing;
      if (existing.first_page_version === state.first_page_version)
        throw Object.assign(new Error("First-page version already has different evidence."), {
          code: "FIRST_PAGE_PRODUCTION_CONFLICT",
        });
    }
    await atomicJson(this.stateFile, state);
    return state;
  }

  async read(): Promise<FirstPageRuntimeState | null> {
    try {
      return JSON.parse(await readFile(this.stateFile, "utf8")) as FirstPageRuntimeState;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }

  async finalizeG4(input: {
    review: FirstPageReview;
    approval: ApprovalEvent;
    styleLockId: string;
    styleLockVersion: string;
    sourceFirstPagePlanId: string;
    sourceAsset: StyleLock["source_first_page_asset"];
    canvas: StyleLock["locked_canvas"];
    safeArea: StyleLock["locked_safe_area"];
    typography: StyleLock["locked_typography_tokens"];
    colors: StyleLock["locked_color_tokens"];
    grid: StyleLock["locked_grid"];
    imageTreatment: StyleLock["locked_image_treatment"];
    visualMode: StyleLock["locked_visual_mode"];
    createdAt: string;
  }): Promise<{ state: FirstPageRuntimeState; styleLock: StyleLock | null; reused: boolean }> {
    const current = await this.read();
    if (!current)
      throw Object.assign(new Error("First-page state is missing."), {
        code: "FIRST_PAGE_NOT_READY_FOR_G4",
      });
    if (current.status === "APPROVED" && current.style_lock_version === input.styleLockVersion)
      return { state: current, styleLock: null, reused: true };
    if (
      input.review.asset_checksum !== current.asset_checksum ||
      input.review.first_page_version !== current.first_page_version
    )
      throw Object.assign(new Error("Review does not bind the current first-page asset."), {
        code: "FIRST_PAGE_REVIEW_CONFLICT",
      });
    if (
      input.approval.gate !== "FIRST_PAGE" ||
      input.approval.target_type !== "FIRST_PAGE_ASSET" ||
      input.approval.target_id !== current.asset_id ||
      input.approval.target_version !==
        `${current.content_version}:${current.copy_version}:${current.visual_plan_version}:${current.first_page_version}:${current.asset_checksum}`
    )
      throw Object.assign(new Error("G4 approval target is stale or mismatched."), {
        code: "G4_ASSET_MISMATCH",
      });
    if (input.approval.decision !== input.review.decision)
      throw Object.assign(new Error("Review and G4 decisions differ."), {
        code: "G4_APPROVAL_STALE",
      });
    if (input.review.decision === "REVISE") {
      const routes = new Set<string>(input.review.revision_routes ?? []);
      const expectedRoute =
        input.review.revision_classification === "GLOBAL_VISUAL_PLAN"
          ? "GLOBAL_VISUAL_DIRECTION"
          : input.review.revision_classification;
      if (routes.size === 0 || expectedRoute === "NONE" || !routes.has(expectedRoute))
        throw Object.assign(
          new Error("Revision routes must include the primary revision classification."),
          { code: "G4_REVISION_ROUTE_INVALID" },
        );
    }
    if (input.review.decision !== "APPROVE") {
      const status =
        input.review.decision === "REVISE"
          ? "REVISION_REQUIRED"
          : input.review.decision === "REJECT"
            ? "REJECTED"
            : "PAUSED";
      const state = {
        ...current,
        status,
        approval_id: input.approval.approval_id,
      } as FirstPageRuntimeState;
      await atomicJson(this.stateFile, state);
      return { state, styleLock: null, reused: false };
    }
    const styleLock: StyleLock = {
      style_lock_id: input.styleLockId,
      project_id: current.project_id,
      content_id: current.content_id,
      content_version: current.content_version,
      copy_version: current.copy_version,
      visual_plan_version: current.visual_plan_version,
      first_page_version: current.first_page_version,
      source_first_page_checksum: current.asset_checksum,
      renderer_environment_ref: current.renderer_environment_ref,
      style_lock_version: input.styleLockVersion,
      source_first_page_plan_id: input.sourceFirstPagePlanId,
      source_first_page_asset: input.sourceAsset,
      first_page_approval_id: input.approval.approval_id,
      first_page_approval_version: current.visual_plan_version,
      first_page_approval: input.approval,
      locked_canvas: input.canvas,
      locked_safe_area: input.safeArea,
      locked_typography_tokens: input.typography,
      locked_color_tokens: input.colors,
      locked_grid: input.grid,
      locked_image_treatment: input.imageTreatment,
      locked_layout_logic: ["Preserve cover reading hierarchy and safe area"],
      locked_brand_rules: ["Do not add unapproved marks"],
      locked_page_number_rules: ["Use two-digit page numbers"],
      locked_visual_mode: input.visualMode,
      locked_rules: [
        "Lock visual mode, canvas, safe area, typography, palette, image treatment and grid.",
      ],
      allowed_variations: [
        "Vary subject, composition, text position, crop, whitespace and local emphasis.",
      ],
      allowed_page_variations: ["Page-specific information geometry"],
      prohibited_deviations: [
        "CHANGE_TYPOGRAPHY_SYSTEM",
        "CHANGE_GLOBAL_COLOR_SYSTEM",
        "CHANGE_VISUAL_MODE",
        "CHANGE_GLOBAL_IMAGE_TREATMENT",
        "CHANGE_PRIMARY_LAYOUT_LOGIC",
        "CHANGE_SAFE_AREA_SYSTEM",
        "CHANGE_BRAND_MARK_RULES",
        "CHANGE_PAGE_NUMBER_RULES",
      ],
      created_by_skill: "image-set-production",
      run_id: current.run_id,
      schema_version: "1.0.0",
      created_at: input.createdAt,
      invalidated_at: null,
      extensions: {},
    };
    const state: FirstPageRuntimeState = {
      ...current,
      status: "APPROVED",
      style_lock_version: input.styleLockVersion,
      approval_id: input.approval.approval_id,
    };
    await atomicJson(this.stateFile, state);
    return { state, styleLock, reused: false };
  }
}
