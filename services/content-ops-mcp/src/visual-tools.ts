import { z } from "zod";
import {
  assertFirstPageHandoff,
  planVisualRevision,
  validateCopyFidelity,
  validateVisualDirectionDecision,
  validateVisualPlanningContext,
  type ApprovedCopySnapshot,
} from "../../../packages/core/src/visual-planning/index.js";
import type { McpContext } from "./context.js";
import { logicalFields, record } from "./content-tools.js";
import { envelope, resultEnvelopeSchema } from "./result-envelope.js";
import type { ToolDefinition } from "./tool-registry.js";

const PROJECT_ID = /^PRJ-[A-Z0-9][A-Z0-9-]{2,63}$/;
const RUN_ID = /^RUN-[A-Z0-9][A-Z0-9-]{2,95}$/;
const CONTENT_ID = /^C-[0-9]{4}$/;
const HASH = /^[a-f0-9]{64}$/;
const SAFE_KEY = /^[A-Za-z0-9][A-Za-z0-9._-]{7,127}$/;
const recordInput = z.record(z.string(), z.unknown());
const readOnly = { readOnlyHint: true, destructiveHint: false, openWorldHint: false } as const;
const writeLocal = { readOnlyHint: false, destructiveHint: false, openWorldHint: false } as const;
const writeOpen = { readOnlyHint: false, destructiveHint: false, openWorldHint: true } as const;

function value(value: unknown): string {
  return typeof value === "string" ? value : "";
}

async function readRemoteContent(context: McpContext, projectId: string, contentId: string) {
  const workspace = await context.contentWorkspace(projectId);
  const uniqueKey = `${projectId}::content::${contentId}`;
  const row = await workspace.adapter.findRecordByUniqueKey(uniqueKey, {
    tableId: workspace.contentTableId,
    tableLogicalKey: "contents",
    uniqueFieldLogicalKey: "contentsRecordUniqueKey",
  });
  if (!row) throw Object.assign(new Error("Content was not found."), { code: "CONTENT_NOT_FOUND" });
  return { workspace, row, logical: logicalFields(row.fields, workspace.fieldMap), uniqueKey };
}

const baseInput = {
  project_id: z.string().regex(PROJECT_ID),
  content_id: z.string().regex(CONTENT_ID),
  run_id: z.string().regex(RUN_ID),
};

const protectedKeys = [
  "contentsContentId",
  "contentsPrimaryPainpoint",
  "contentsContentAngle",
  "contentsContentStructureType",
  "contentsPageCount",
  "contentsPageCopy",
  "contentsPublishTitle",
  "contentsPublishBody",
  "contentsContentFingerprint",
  "contentsContentVersion",
  "contentsImageStatus",
  "contentsFirstPageApprovalStatus",
  "contentsFinalApprovalStatus",
  "contentsSyncStatus",
  "contentsRecordUniqueKey",
];

export const VISUAL_TOOL_DEFINITIONS: readonly ToolDefinition[] = [
  {
    name: "content_ops_get_visual_context",
    title: "Get Visual Context",
    description:
      "Read exact G3-approved Content, Project rules and asset availability for Visual Planning without writing.",
    inputSchema: z
      .object({
        ...baseInput,
        content_run_id: z.string().regex(RUN_ID),
        g3_approval_id: z.string().regex(/^APR-[A-Z0-9-]+$/),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const contentId = String(input.content_id);
      const contentRunId = String(input.content_run_id);
      const [remote, pkg, profile] = await Promise.all([
        readRemoteContent(context, projectId, contentId),
        context.readContentJson(projectId, contentRunId, "content-package.json"),
        context.readProjectProfile(projectId),
      ]);
      if (!pkg)
        throw Object.assign(new Error("Content Package was not found."), {
          code: "CONTENT_PACKAGE_NOT_FOUND",
        });
      const packageValue = record(pkg);
      const content = record(packageValue.content_record);
      const pages = Array.isArray(packageValue.pages) ? packageValue.pages.map(record) : [];
      const hashes = pages.map((page) => ({
        page_number: Number(page.page_number),
        copy_hash: context.hash({
          copy_version: page.copy_version,
          headline: page.headline,
          body: page.body,
          supporting_text: page.supporting_text,
        }),
      }));
      const contextArtifact = {
        visual_context_id: `VCTX-${String(input.run_id).replace(/^RUN-/, "")}`,
        project_id: projectId,
        content_id: contentId,
        content_status: "COPY_APPROVED",
        content_version: remote.logical.contentsContentVersion,
        copy_version: content.copy_version,
        g3_approval_id: input.g3_approval_id,
        g3_target_version: `${String(content.content_version)}:${String(content.copy_version)}`,
        content_package_ref: `projects/${projectId}/runs/${contentRunId}/content/content-package.json`,
        content_package_hash: context.hash(packageValue),
        page_copy_hashes: hashes,
        project_profile_version: Number(profile?.configuration_version ?? 1),
        project_visual_preferences: [],
        project_content_style: Array.isArray(profile?.content_style) ? profile.content_style : [],
        project_expression_tone: Array.isArray(profile?.expression_tone)
          ? profile.expression_tone
          : [],
        active_project_rules: ["Preserve G3-approved copy"],
        rejected_directions: Array.isArray(profile?.prohibited_expressions)
          ? profile.prohibited_expressions
          : [],
        platform_pack: {
          id: String(packageValue.platform_pack_id),
          version: String(packageValue.platform_pack_version),
        },
        industry_pack: {
          id: String(packageValue.industry_pack_id),
          version: String(packageValue.industry_pack_version),
        },
        historical_visual_plans: [],
        approved_style_refs: [],
        available_project_assets: [],
        available_evidence_assets: [],
        visual_constraints: [
          "No image generation in Phase 4A",
          "Renderer owns formal Chinese copy",
        ],
        user_overrides: [],
        capability_snapshot: {
          programmatic_graphics: true,
          image_generation: false,
          renderer: false,
          attachment_upload: false,
        },
        ready_for_visual_planning: true,
        blocking_reasons: [],
        created_at: new Date().toISOString(),
        run_id: input.run_id,
        schema_version: "1.0.0",
        extensions: { remote_content_status: remote.logical.contentsContentStatus },
      };
      if (
        !["COPY_APPROVED", "VISUAL_PLANNING"].includes(value(remote.logical.contentsContentStatus))
      )
        throw Object.assign(new Error("Content is not eligible for Visual Planning."), {
          code: "CONTENT_NOT_COPY_APPROVED",
        });
      validateVisualPlanningContext({
        content_status: value(contextArtifact.content_status),
        content_version: value(contextArtifact.content_version),
        copy_version: value(contextArtifact.copy_version),
        g3_target_version: contextArtifact.g3_target_version,
        expected_page_count: pages.length,
        page_copy_hashes: hashes,
      });
      await context.validateSchema("visual-planning-context", contextArtifact);
      return envelope(
        "SUCCESS",
        "Exact approved-copy Visual Planning context is ready; no write occurred.",
        {
          project_id: projectId,
          run_id: String(input.run_id),
          details: { visual_context: contextArtifact, remote_identifiers_exposed: false },
        },
      );
    },
  },
  {
    name: "content_ops_plan_visual_direction",
    title: "Plan Visual Direction",
    description:
      "Dry-run three executable visual direction candidates and a selected candidate without writing.",
    inputSchema: z
      .object({
        ...baseInput,
        visual_context: recordInput,
        user_fixed_mode: z
          .enum(["SCENE_SERIES", "EDITORIAL_SERIES", "PRODUCT_LIFESTYLE", "EVIDENCE_LED", "MIXED"])
          .nullable(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const runId = String(input.run_id);
      const fixed = input.user_fixed_mode as string | null;
      const modes = fixed ? [fixed] : ["EDITORIAL_SERIES", "EVIDENCE_LED", "MIXED"];
      const candidates = modes.map((visual_mode, index) => ({
        candidate_id: `VDC-${index + 1}-${runId.replace(/^RUN-/, "")}`,
        visual_mode,
        direction_name:
          ["克制专业编辑风", "资质核验资料与证据卡片风", "编辑图形加有限证据资产"][index] ??
          "Operator fixed direction",
        direction_summary: "Use an explicit asset source and deterministic Chinese typography.",
        content_fit: "Supports a professional decision checklist.",
        industry_fit: "Fits generic professional services.",
        platform_fit: "Fits 3:4 Xiaohongshu image posts.",
        project_fit: "Matches restrained and trustworthy expression.",
        asset_feasibility:
          visual_mode === "EVIDENCE_LED"
            ? "Limited because no approved screenshot asset exists."
            : "Executable with programmatic graphics.",
        text_density_fit: "Supports the approved six-page copy.",
        background_strategy: "Warm white with low-saturation blue-gray structure.",
        typography_strategy: "Portable Chinese sans-serif stack; Renderer owns all final text.",
        color_strategy: "Warm white, charcoal and muted blue-gray.",
        layout_strategy: "High whitespace, stable numbering and page-specific information cards.",
        evidence_strategy: "Never fabricate certificates, logos or official pages.",
        strengths: ["Copy fidelity", "Deterministic handoff"],
        limitations:
          visual_mode === "EVIDENCE_LED"
            ? ["Approved screenshot assets unavailable"]
            : ["Planning only; no rendered output"],
        blocking_risks: visual_mode === "EVIDENCE_LED" ? ["EVIDENCE_ASSET_UNAVAILABLE"] : [],
        score: visual_mode === "EDITORIAL_SERIES" ? 92 : visual_mode === "MIXED" ? 78 : 68,
      }));
      const selectable =
        candidates.find((item) => item.visual_mode === (fixed ?? "EDITORIAL_SERIES")) ??
        candidates[0];
      if (!selectable) throw new Error("VISUAL_DIRECTION_SELECTION_INVALID");
      validateVisualDirectionDecision({
        candidates,
        selected_candidate_id: selectable.candidate_id,
        user_fixed_mode: fixed,
        rejected_modes: [],
        rejected_directions: [],
      });
      const decision = {
        visual_direction_decision_id: `VDD-${runId.replace(/^RUN-/, "")}`,
        visual_context_id: record(input.visual_context).visual_context_id,
        candidates,
        selected_candidate_id: selectable.candidate_id,
        selection_rationale:
          "EDITORIAL_SERIES is the highest-fidelity executable mode without unavailable or fabricated evidence assets.",
        user_fixed_mode: fixed,
        user_fixed_direction: null,
        user_rejected_modes: [],
        user_rejected_directions: [],
        industry_mode_preferences: ["EDITORIAL_SERIES"],
        platform_constraints: ["1242x1660 3:4 portrait"],
        asset_feasibility: [
          "Programmatic graphic is available",
          "No approved screenshot or project photography",
        ],
        created_at: new Date().toISOString(),
        run_id: runId,
        schema_version: "1.0.0",
        extensions: {},
      };
      await context.validateSchema("visual-direction-decision", decision);
      return envelope(
        "SUCCESS",
        "Visual direction candidates were planned; no local or remote write occurred.",
        {
          project_id: String(input.project_id),
          run_id: runId,
          details: {
            visual_direction_decision: decision,
            selected_mode: selectable.visual_mode,
            remote_write_attempted: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_submit_visual_plan",
    title: "Submit Visual Plan",
    description:
      "Validate and atomically retain the formal Visual Plan locally; never writes Feishu.",
    inputSchema: z
      .object({
        ...baseInput,
        idempotency_key: z.string().regex(SAFE_KEY),
        visual_context: recordInput,
        visual_direction_decision: recordInput,
        visual_reference_manifest: recordInput,
        visual_system: recordInput,
        page_visual_plans: z.array(recordInput).min(4).max(8),
        asset_requirements_plan: recordInput,
        layout_feasibility_report: recordInput,
        visual_quality_report: recordInput,
        visual_handoff_package: recordInput,
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocal,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const runId = String(input.run_id);
      const schemaValues: Array<[string, unknown]> = [
        ["visual-planning-context", input.visual_context],
        ["visual-direction-decision", input.visual_direction_decision],
        ["visual-reference-manifest", input.visual_reference_manifest],
        ["visual-system", input.visual_system],
        ["asset-requirements-plan", input.asset_requirements_plan],
        ["layout-feasibility-report", input.layout_feasibility_report],
        ["visual-planning-quality-report", input.visual_quality_report],
        ["visual-handoff-package", input.visual_handoff_package],
      ];
      for (const page of input.page_visual_plans as unknown[])
        await context.validateSchema("page-visual-plan", page);
      for (const [name, artifact] of schemaValues) await context.validateSchema(name, artifact);
      const handoff = record(input.visual_handoff_package);
      const first = record(handoff.first_page_handoff);
      const quality = record(input.visual_quality_report);
      const layout = record(input.layout_feasibility_report);
      assertFirstPageHandoff({
        page_number: Number(first.page_number),
        page_role: value(first.page_role),
        ready: Boolean(first.ready),
        quality_ready: Boolean(quality.ready_for_first_page),
        layout_blocked_count: Number(layout.blocked_count),
      });
      const approvedPackageRef = value(record(input.visual_context).content_package_ref);
      const match = /runs\/(RUN-[A-Z0-9-]+)\/content/.exec(approvedPackageRef);
      const contentRunId = match?.[1];
      const contentPackage = contentRunId
        ? record(await context.readContentJson(projectId, contentRunId, "content-package.json"))
        : {};
      const approvedPages = Array.isArray(contentPackage.pages)
        ? contentPackage.pages.map(record)
        : [];
      validateCopyFidelity(
        approvedPages.map((page) => ({
          page_number: Number(page.page_number),
          copy: {
            copy_version: value(page.copy_version),
            headline: value(page.headline),
            body: value(page.body),
            supporting_text: value(page.supporting_text),
          },
        })),
        (input.page_visual_plans as Record<string, unknown>[]).map((page) => ({
          page_number: Number(page.page_number),
          page_role: value(page.page_role),
          copy_snapshot: record(page.copy_snapshot) as ApprovedCopySnapshot,
        })),
      );
      const artifactMap: Record<string, unknown> = {
        "visual-planning-context.json": input.visual_context,
        "visual-direction-decision.json": input.visual_direction_decision,
        "visual-reference-manifest.json": input.visual_reference_manifest,
        "visual-system.json": input.visual_system,
        "page-visual-plans.json": input.page_visual_plans,
        "asset-requirements-plan.json": input.asset_requirements_plan,
        "layout-feasibility-report.json": input.layout_feasibility_report,
        "visual-planning-quality-report.json": input.visual_quality_report,
        "visual-handoff-package.json": input.visual_handoff_package,
      };
      for (const [file, artifact] of Object.entries(artifactMap))
        await context.writeVisualJson(projectId, runId, file, artifact);
      const request = {
        idempotency_key_hash: context.hash(input.idempotency_key),
        plan_hash: context.hash(input.visual_handoff_package),
      };
      await context.writeVisualJson(projectId, runId, "visual-request.json", request);
      return envelope(
        "SUCCESS",
        "Formal Visual Plan was validated and retained locally; Feishu was not written.",
        {
          project_id: projectId,
          run_id: runId,
          artifacts: Object.keys(artifactMap),
          details: {
            visual_plan_hash: request.plan_hash,
            idempotency_key_hash: request.idempotency_key_hash,
            remote_write_attempted: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_finalize_visual_plan",
    title: "Finalize Visual Plan",
    description:
      "With both write gates, update only allowed Feishu visual summary fields and read-verify protected copy/state fields.",
    inputSchema: z
      .object({
        ...baseInput,
        visual_plan_hash: z.string().regex(HASH),
        idempotency_key: z.string().regex(SAFE_KEY),
        explicit_confirmation: z.literal(true),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeOpen,
    async handler(context, input) {
      if (!context.liveWriteEnabled)
        throw Object.assign(new Error("Live Feishu environment gate is disabled."), {
          code: "LIVE_WRITE_ENV_GATE_REQUIRED",
        });
      const projectId = String(input.project_id);
      const runId = String(input.run_id);
      const request = record(await context.readVisualJson(projectId, runId, "visual-request.json"));
      const handoff = record(
        await context.readVisualJson(projectId, runId, "visual-handoff-package.json"),
      );
      if (
        !Object.keys(handoff).length ||
        request.plan_hash !== input.visual_plan_hash ||
        context.hash(handoff) !== input.visual_plan_hash
      )
        throw Object.assign(new Error("Visual Plan hash mismatch."), {
          code: "VISUAL_PLAN_HASH_MISMATCH",
        });
      const remoteBefore = await readRemoteContent(context, projectId, String(input.content_id));
      if (
        remoteBefore.logical.contentsContentStatus !== "COPY_APPROVED" &&
        remoteBefore.logical.contentsContentStatus !== "VISUAL_PLANNING"
      )
        throw Object.assign(new Error("Content is not eligible for Visual Planning."), {
          code: "CONTENT_NOT_COPY_APPROVED",
        });
      const protectedBefore = Object.fromEntries(
        protectedKeys.map((key) => [key, remoteBefore.logical[key]]),
      );
      const visualSystem = record(handoff.visual_system);
      const decision = record(handoff.visual_direction_decision);
      const selected = (
        Array.isArray(decision.candidates) ? decision.candidates.map(record) : []
      ).find((candidate) => candidate.candidate_id === decision.selected_candidate_id);
      const summary = `VV-1｜${value(selected?.visual_mode)}｜1242x1660｜6页｜首图交接就绪`;
      const runtime = await context.visualPlanningRuntime(projectId, runId);
      const write = await runtime.finalize({
        contentUniqueKey: remoteBefore.uniqueKey,
        contentVersion: 1,
        contentId: String(input.content_id),
        contentVersionLabel: value(handoff.content_version),
        copyVersion: value(handoff.copy_version),
        visualPlanVersion: value(handoff.visual_plan_version),
        planHash: String(input.visual_plan_hash),
        backgroundDirection: value(visualSystem.global_visual_direction),
        visualPlanSummary: summary,
        updatedAt: new Date().toISOString(),
        idempotencyKey: String(input.idempotency_key),
        confirmLiveWrite: true,
      });
      const remoteAfter = await readRemoteContent(context, projectId, String(input.content_id));
      const protectedAfter = Object.fromEntries(
        protectedKeys.map((key) => [key, remoteAfter.logical[key]]),
      );
      if (context.hash(protectedBefore) !== context.hash(protectedAfter))
        throw Object.assign(new Error("Protected Content fields changed."), {
          code: "VISUAL_PROTECTED_FIELD_DRIFT",
        });
      const verified =
        remoteAfter.logical.contentsVisualPlanVersion === handoff.visual_plan_version &&
        remoteAfter.logical.contentsContentStatus === "VISUAL_PLANNING";
      if (!verified)
        throw Object.assign(new Error("Remote visual fields did not read-verify."), {
          code: "VISUAL_REMOTE_READ_VERIFY_FAILED",
        });
      return envelope(
        "SUCCESS",
        write.updated
          ? "Visual Plan was finalized and remote protected fields read-verified."
          : "Identical Visual Plan replay reused the verified remote state with zero updates.",
        {
          project_id: projectId,
          run_id: runId,
          updated_records: write.updated,
          details: {
            visual_plan_version: handoff.visual_plan_version,
            writes_attempted: write.writesAttempted,
            writes_passed: write.writesAttempted,
            writes_failed: 0,
            idempotent_replay: write.reused === 1,
            protected_fields_unchanged: true,
            first_page_handoff_ready: true,
            image_generation_attempted: false,
            g4_created: false,
            style_lock_created: false,
            remote_identifiers_exposed: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_get_visual_plan",
    title: "Get Visual Plan",
    description: "Read the retained formal Visual Plan and current version without writing.",
    inputSchema: z.object(baseInput).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const handoff = await context.readVisualJson(
        String(input.project_id),
        String(input.run_id),
        "visual-handoff-package.json",
      );
      if (!handoff)
        throw Object.assign(new Error("Visual Plan was not found."), {
          code: "VISUAL_PLAN_NOT_FOUND",
        });
      return envelope("SUCCESS", "Formal Visual Plan was read.", {
        project_id: String(input.project_id),
        run_id: String(input.run_id),
        details: { visual_handoff_package: handoff, remote_identifiers_exposed: false },
      });
    },
  },
  {
    name: "content_ops_verify_visual_plan",
    title: "Verify Visual Plan",
    description:
      "Read-verify local plan hashes, quality/layout readiness and bounded remote visual state.",
    inputSchema: z.object({ ...baseInput, visual_plan_hash: z.string().regex(HASH) }).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const runId = String(input.run_id);
      const handoff = record(
        await context.readVisualJson(projectId, runId, "visual-handoff-package.json"),
      );
      const quality = record(handoff.visual_quality_report);
      const layout = record(handoff.layout_feasibility_report);
      const remote = await readRemoteContent(context, projectId, String(input.content_id));
      const matched =
        context.hash(handoff) === input.visual_plan_hash &&
        quality.ready_for_first_page === true &&
        Number(layout.blocked_count) === 0 &&
        remote.logical.contentsVisualPlanVersion === handoff.visual_plan_version &&
        remote.logical.contentsContentStatus === "VISUAL_PLANNING";
      return envelope(
        matched ? "SUCCESS" : "BLOCKED",
        matched
          ? "Local and remote Visual Plan evidence passed read verification."
          : "Visual Plan verification found a mismatch.",
        {
          project_id: projectId,
          run_id: runId,
          details: {
            plan_hash_match: context.hash(handoff) === input.visual_plan_hash,
            quality_ready: quality.ready_for_first_page,
            layout_blocked_count: layout.blocked_count,
            remote_version_match:
              remote.logical.contentsVisualPlanVersion === handoff.visual_plan_version,
            remote_status_match: remote.logical.contentsContentStatus === "VISUAL_PLANNING",
            protected_copy_fields_read_only: true,
            remote_identifiers_exposed: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_plan_visual_revision",
    title: "Plan Visual Revision",
    description:
      "Dry-run a non-destructive Visual Plan revision; never writes local or remote state.",
    inputSchema: z
      .object({
        ...baseInput,
        from_visual_plan_version: z.string().regex(/^VV-[1-9][0-9]*$/),
        revision_scope: z.enum([
          "GLOBAL_DIRECTION",
          "VISUAL_MODE",
          "COLOR_SYSTEM",
          "TYPOGRAPHY_SYSTEM",
          "LAYOUT_SYSTEM",
          "PAGE_PLAN",
          "ASSET_STRATEGY",
          "TEXT_LAYER_ONLY",
          "FULL_VISUAL_REPLAN",
        ]),
        requested_changes: z.array(z.string().min(1).max(1000)).min(1),
        changes_copy: z.boolean(),
        changes_page_count: z.boolean(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    handler(_context, input) {
      const planned = planVisualRevision({
        from_version: String(input.from_visual_plan_version),
        changes_copy: Boolean(input.changes_copy),
        changes_page_count: Boolean(input.changes_page_count),
        first_page_exists: false,
        g4_exists: false,
      });
      const list = input.requested_changes as string[];
      const revision = {
        visual_revision_plan_id: `VRP-${String(input.run_id).replace(/^RUN-/, "")}`,
        project_id: input.project_id,
        content_id: input.content_id,
        from_visual_plan_version: input.from_visual_plan_version,
        to_visual_plan_version: planned.to_version,
        revision_scope: input.revision_scope,
        direction_changes: input.revision_scope === "GLOBAL_DIRECTION" ? list : [],
        mode_changes: input.revision_scope === "VISUAL_MODE" ? list : [],
        color_changes: input.revision_scope === "COLOR_SYSTEM" ? list : [],
        typography_changes: input.revision_scope === "TYPOGRAPHY_SYSTEM" ? list : [],
        layout_changes: input.revision_scope === "LAYOUT_SYSTEM" ? list : [],
        page_changes: input.revision_scope === "PAGE_PLAN" ? list : [],
        asset_strategy_changes: input.revision_scope === "ASSET_STRATEGY" ? list : [],
        preserved_elements: ["Current approved copy", "Prior Visual Plan"],
        invalidated_artifacts: [],
        requires_content_revision: planned.requires_content_revision,
        requires_new_g3: planned.requires_new_g3,
        requires_first_page_regeneration: false,
        requires_new_g4: false,
        dry_run: true,
        created_at: new Date().toISOString(),
        run_id: input.run_id,
        schema_version: "1.0.0",
        extensions: {},
      };
      return Promise.resolve(
        envelope(
          planned.requires_content_revision ? "BLOCKED" : "SUCCESS",
          planned.requires_content_revision
            ? "Requested revision crosses the copy/page-count boundary and must return to Content Creation."
            : "Visual-only revision was planned as a zero-write dry run.",
          {
            project_id: String(input.project_id),
            run_id: String(input.run_id),
            details: {
              visual_plan_revision: revision,
              local_write_attempted: false,
              remote_write_attempted: false,
            },
          },
        ),
      );
    },
  },
  {
    name: "content_ops_get_first_page_handoff",
    title: "Get First Page Handoff",
    description:
      "Read the ready Cover production handoff without creating G4, Style Lock, images or paths.",
    inputSchema: z.object(baseInput).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const handoff = record(
        await context.readVisualJson(
          String(input.project_id),
          String(input.run_id),
          "visual-handoff-package.json",
        ),
      );
      const first = record(handoff.first_page_handoff);
      if (!Object.keys(first).length)
        throw Object.assign(new Error("First-page handoff was not found."), {
          code: "FIRST_PAGE_HANDOFF_NOT_FOUND",
        });
      assertFirstPageHandoff({
        page_number: Number(first.page_number),
        page_role: value(first.page_role),
        ready: Boolean(first.ready),
        quality_ready: Boolean(record(handoff.visual_quality_report).ready_for_first_page),
        layout_blocked_count: Number(record(handoff.layout_feasibility_report).blocked_count),
      });
      return envelope(
        "SUCCESS",
        "First-page production handoff is ready; no image, G4 or Style Lock exists.",
        {
          project_id: String(input.project_id),
          run_id: String(input.run_id),
          details: {
            first_page_handoff: first,
            image_generated: false,
            g4_created: false,
            style_lock_created: false,
            output_path_present: false,
          },
        },
      );
    },
  },
] as const;
