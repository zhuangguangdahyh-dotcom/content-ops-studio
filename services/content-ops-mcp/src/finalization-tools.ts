import { z } from "zod";
import {
  evaluateFinalizationEligibility,
  type FinalizationContext,
} from "../../../packages/core/src/finalization/index.js";
import type { ToolDefinition } from "./tool-registry.js";
import { envelope, resultEnvelopeSchema } from "./result-envelope.js";

const projectId = z.string().regex(/^PRJ-[0-9]{8}-[A-Z0-9]{4}$/);
const contentId = z.string().regex(/^C-[0-9]{4}$/);
const runId = z.string().regex(/^RUN-[0-9]{8}-[0-9]{6}-[A-Z0-9]{4}$/);
const approvalId = z.string().regex(/^APR-[0-9]{8}-[A-Z0-9]{4}$/);
const sha256 = z.string().regex(/^[a-f0-9]{64}$/);
const safeRelativePath = z
  .string()
  .min(1)
  .refine((value) => !value.startsWith("/") && !value.includes("..") && !value.startsWith("file:"));
const approval = z
  .object({
    approval_id: approvalId,
    gate: z.enum(["CONTENT_COPY", "FIRST_PAGE", "FINAL_SET"]),
    decision: z.enum(["APPROVE", "REVISE", "REJECT", "PAUSE"]),
    target_id: contentId,
    target_version: z.string().min(1),
    source_run_id: runId,
    deprecated_at: z.iso.datetime().nullable(),
    fixture_approval: z.boolean(),
    test_only: z.boolean(),
  })
  .strict();
const page = z
  .object({
    page_number: z.number().int().positive(),
    page_role: z.string().min(1),
    page_intent: z.string().min(1),
    asset_id: z.string().regex(/^AST-[A-Z0-9-]+$/),
    source_path: z.string().min(1),
    relative_path: safeRelativePath,
    checksum: sha256,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    file_size: z.number().int().positive(),
    mime_type: z.literal("image/png"),
    asset_channel: z.enum([
      "AI_GENERATED_VISUAL_RENDERER",
      "PURE_RENDERER",
      "OPERATOR_ASSET_RENDERER",
    ]),
    renderer_provenance: z.string().min(1),
    imagegen_provenance: z.string().min(1).nullable(),
    generation_manifest_ref: z.string().min(1),
    render_report_ref: z.string().min(1),
    single_page_qa_ref: z.string().min(1),
    single_page_qa_status: z.enum(["PASS", "FAIL"]),
    hard_block_count: z.number().int().nonnegative(),
    approved_formal_asset: z.boolean(),
    asset_status: z.enum(["APPROVED", "CANDIDATE", "REJECTED", "FAILED", "SUPERSEDED"]),
  })
  .strict();
const preview = z
  .object({
    size: z.enum(["FULL", "310", "186"]),
    source_path: z.string().min(1),
    relative_path: safeRelativePath,
    checksum: sha256,
  })
  .strict();
const finalizationContext = z
  .object({
    project_id: projectId,
    project_kind: z.enum(["PRODUCTION", "CALIBRATION", "TEST_FIXTURE"]),
    content_id: contentId,
    run_id: runId,
    runtime_mode: z.enum(["PRODUCTION", "TEST"]),
    workspace_target: z.enum(["NONE", "SANDBOX", "PRODUCTION"]),
    content_version: z.string().regex(/^CV-[1-9][0-9]*$/),
    copy_version: z.string().regex(/^CV-[1-9][0-9]*$/),
    visual_plan_version: z.string().regex(/^VV-[1-9][0-9]*$/),
    first_page_version: z.string().regex(/^FPV-[1-9][0-9]*$/),
    style_lock_id: z.string().regex(/^SL-[A-Z0-9-]+$/),
    style_lock_version: z.string().regex(/^SLV-[1-9][0-9]*$/),
    style_lock_active: z.boolean(),
    style_lock_visual_plan_version: z.string().regex(/^VV-[1-9][0-9]*$/),
    g3: approval,
    g4: approval,
    g5: approval.nullable(),
    page_count: z.number().int().positive(),
    pages: z.array(page).min(1),
    qa_report_id: z.string().regex(/^RPT-QA-[A-Z0-9-]+$/),
    qa_status: z.enum(["QA_PASSED", "QA_PASSED_WITH_WARNINGS", "QA_FAILED"]),
    group_qa_ref: z.string().min(1),
    group_qa_status: z.enum(["PASS", "FAIL"]),
    group_hard_block_count: z.number().int().nonnegative(),
    continuity_report_ref: z.string().min(1),
    continuity_status: z.enum(["PASS", "FAIL"]),
    strategy_ref: z.string().min(1),
    contact_sheets: z.array(preview).length(3),
    content_package_ref: z.string().min(1),
    visual_system_ref: z.string().regex(/^VS-[A-Z0-9-]+$/),
    final_manifest_id: z.string().regex(/^FINAL-[A-Z0-9-]+$/),
    final_manifest_version: z.string().regex(/^FMV-[1-9][0-9]*$/),
    finalized_at: z.iso.datetime(),
  })
  .strict();
const readOnly = { readOnlyHint: true, destructiveHint: false, openWorldHint: false } as const;
const writeLocal = { readOnlyHint: false, destructiveHint: false, openWorldHint: false } as const;

function runtimeFor(context: Parameters<ToolDefinition["handler"]>[0], value: FinalizationContext) {
  return context.finalizationRuntime(value.project_id, value.content_id, value.run_id);
}

export const FINALIZATION_TOOL_DEFINITIONS: readonly ToolDefinition[] = [
  {
    name: "content_ops_plan_finalization",
    title: "Plan Finalization",
    description:
      "Validate exact G3, G4, checksum-bound G5, Style Lock, page, QA and group evidence bindings without creating a Manifest or Delivery Package.",
    inputSchema: z.object({ context: finalizationContext }).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(_context, input) {
      await Promise.resolve();
      const value = input.context as FinalizationContext;
      const eligibility = evaluateFinalizationEligibility(value);
      return envelope(
        eligibility.eligible ? "SUCCESS" : "BLOCKED",
        eligibility.eligible
          ? "The approved Final Set is eligible for explicit local finalization."
          : "Finalization preconditions are incomplete or stale.",
        {
          project_id: value.project_id,
          run_id: value.run_id,
          details: {
            eligibility,
            final_manifest_created: false,
            delivery_created: false,
            imagegen_calls: 0,
            renderer_calls: 0,
            feishu_writes: 0,
          },
        },
      );
    },
  },
  {
    name: "content_ops_finalize_delivery",
    title: "Finalize Approved Delivery",
    description:
      "Create or idempotently reuse an immutable Final Manifest, fingerprint, approved-only Delivery Package, integrity report and archive state after explicit confirmation.",
    inputSchema: z
      .object({
        context: finalizationContext,
        request_id: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{7,127}$/),
        explicit_confirmation: z.literal(true),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocal,
    async handler(context, input) {
      const value = input.context as FinalizationContext;
      const result = await runtimeFor(context, value).finalize(value);
      return envelope("SUCCESS", "Approved Final Set was finalized and read-verified locally.", {
        project_id: value.project_id,
        run_id: value.run_id,
        artifacts: [
          result.manifest_path,
          result.delivery_path,
          result.integrity_report_path,
          result.archive_state_path,
        ],
        created_records: result.reused_manifest ? 0 : 1,
        details: { ...result, workspace_sync_status: "SYNC_NOT_STARTED" },
      });
    },
  },
  {
    name: "content_ops_get_finalization_status",
    title: "Get Finalization Status",
    description:
      "Read the evidence-backed current Final Set state without modifying Delivery, Archive, Feishu metadata or attachments.",
    inputSchema: z.object({ project_id: projectId, content_id: contentId, run_id: runId }).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const state = await context
        .finalizationRuntime(
          String(input.project_id),
          String(input.content_id),
          String(input.run_id),
        )
        .inspect();
      return envelope(
        "SUCCESS",
        state ? "Finalization state was read." : "No Finalization state exists.",
        {
          project_id: String(input.project_id),
          run_id: String(input.run_id),
          details: {
            state,
            finalized_is_not_feishu_synced: true,
            attachment_upload_status: "DEFERRED",
          },
        },
      );
    },
  },
  {
    name: "content_ops_verify_final_delivery",
    title: "Verify Final Delivery Currentness",
    description:
      "Compare the archived Final Set fingerprint with the supplied current version and asset bindings; changed content or bytes report SUPERSEDED.",
    inputSchema: z.object({ context: finalizationContext }).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const value = input.context as FinalizationContext;
      const state = await runtimeFor(context, value).inspect(value);
      const current = state?.status === "FINALIZED" && state.current === true;
      return envelope(
        current ? "SUCCESS" : "BLOCKED",
        current
          ? "Current Final Delivery is valid."
          : "Final Delivery is missing, failed or superseded.",
        {
          project_id: value.project_id,
          run_id: value.run_id,
          details: { state, current, remote_writes: 0 },
        },
      );
    },
  },
] as const;
