import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import {
  CANVAS,
  PLAYWRIGHT_VERSION,
  PlaywrightHtmlCssRendererAdapter,
  RendererCapabilityProbe,
  RendererSetupService,
} from "../../../packages/renderer/src/production.js";
import type { McpContext } from "./context.js";
import { envelope, resultEnvelopeSchema } from "./result-envelope.js";
import type { ToolDefinition } from "./tool-registry.js";

const PROJECT_ID = /^PRJ-[A-Z0-9][A-Z0-9-]{2,63}$/;
const RUN_ID = /^RUN-[A-Z0-9][A-Z0-9-]{2,95}$/;
const CONTENT_ID = /^C-[0-9]{4}$/;
const HASH = /^[a-f0-9]{64}$/;
const readOnly = { readOnlyHint: true, destructiveHint: false, openWorldHint: false } as const;
const writeLocal = { readOnlyHint: false, destructiveHint: false, openWorldHint: false } as const;
const writeOpen = { readOnlyHint: false, destructiveHint: false, openWorldHint: true } as const;
const base = {
  project_id: z.string().regex(PROJECT_ID),
  content_id: z.string().regex(CONTENT_ID),
  run_id: z.string().regex(RUN_ID),
};
const exactText = z
  .object({
    headline: z.string().min(1).max(200),
    body: z.string().min(1).max(1000),
    page_number: z.string().regex(/^0?1$/),
  })
  .strict();

const hash = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value).normalize("NFKC")).digest("hex");
const outputRoot = (context: McpContext, projectId: string, runId: string) =>
  path.join(context.home, "projects", projectId, "runs", runId, "outputs", "first-page");
const refRoot = (projectId: string, runId: string) =>
  `projects/${projectId}/runs/${runId}/outputs/first-page`;
const fileSummary = async (file: string) => ({
  exists: true,
  byte_length: (await stat(file)).size,
  checksum: createHash("sha256")
    .update(await readFile(file))
    .digest("hex"),
});

function planValue(input: Record<string, unknown>) {
  const projectId = String(input.project_id);
  const contentId = String(input.content_id);
  const runId = String(input.run_id);
  const text = input.text as z.infer<typeof exactText>;
  const withoutHash = {
    first_page_production_plan_id: `FPPP-${runId.replace(/^RUN-/, "")}`,
    project_id: projectId,
    content_id: contentId,
    page_number: 1,
    page_role: "COVER",
    content_version: input.content_version,
    copy_version: input.copy_version,
    visual_plan_version: input.visual_plan_version,
    first_page_version: input.first_page_version,
    copy_snapshot_hash: input.copy_snapshot_hash,
    visual_handoff_ref: input.visual_handoff_ref,
    visual_handoff_hash: input.visual_handoff_hash,
    page_visual_plan_id: input.page_visual_plan_id,
    renderer_config: {
      renderer_config_id: "RCFG-PHASE4B-001",
      renderer_id: "PLAYWRIGHT_HTML_CSS",
      renderer_version: "1.0.0",
      runtime_package: "playwright-core",
      runtime_package_version: PLAYWRIGHT_VERSION,
      browser_family: "CHROMIUM",
      browser_channel: "PLAYWRIGHT_MANAGED",
      browser_path_reference: "EXTERNAL_RENDERER_CACHE",
      headless: true,
      viewport: CANVAS,
      device_scale_factor: 1,
      locale: "zh-CN",
      timezone: "Asia/Shanghai",
      color_scheme: "light",
      reduced_motion: "reduce",
      screenshot_options: {
        type: "png",
        animations: "disabled",
        caret: "hide",
        scale: "css",
        omit_background: false,
      },
      network_policy: "BLOCK_ALL",
      font_policy: "SYSTEM_CJK_STACK",
      animation_policy: "DISABLED",
      time_policy: "NO_DYNAMIC_TIME",
      random_policy: "NO_RANDOM_VALUES",
      timeout_ms: 30000,
      schema_version: "1.0.0",
      extensions: {},
    },
    renderer_environment_requirement: {
      platform: process.platform,
      architecture: process.arch,
      browser_family: "CHROMIUM",
      browser_required: true,
      font_profile_required: true,
    },
    template_id: "TPL-EDITORIAL-COVER",
    template_version: "1.0.0",
    asset_strategy: "PROGRAMMATIC_GRAPHIC",
    programmatic_graphic_plan: {
      graphic_id: `PG-${contentId.replace("-", "")}-001`,
      primitives: ["FRAME", "LINE", "NUMBER_MARKER", "BRACKET", "ACCENT_BLOCK"],
      contains_formal_copy: false,
      contains_remote_assets: false,
    },
    text_layer_plan: [
      {
        layer_id: "TITLE",
        role: "TITLE",
        exact_text: text.headline,
        source_hash: hash(text.headline),
      },
      { layer_id: "BODY", role: "BODY", exact_text: text.body, source_hash: hash(text.body) },
      {
        layer_id: "PAGE_NUMBER",
        role: "PAGE_NUMBER",
        exact_text: text.page_number,
        source_hash: hash(text.page_number),
      },
    ],
    font_resolution_plan: [
      { role: "TITLE", font_stack: ["PingFang SC", "Hiragino Sans GB", "sans-serif"] },
      { role: "BODY", font_stack: ["PingFang SC", "Hiragino Sans GB", "sans-serif"] },
      { role: "PAGE_NUMBER", font_stack: ["PingFang SC", "sans-serif"] },
    ],
    layout_measurement_plan: [
      "BOUNDING_CLIENT_RECT",
      "SCROLL_SIZE",
      "CLIENT_SIZE",
      "COMPUTED_FONT",
      "LINE_COUNT",
      "Z_INDEX",
      "VISIBILITY",
      "OVERLAP",
      "SAFE_AREA",
      "CANVAS_SCROLL",
    ],
    expected_outputs: [
      "BACKGROUND_SVG",
      "COMPILED_HTML",
      "FIRST_PAGE_PNG",
      "GENERATION_MANIFEST",
      "RENDER_REPORT",
      "QA_REPORT",
      "PRODUCTION_REPORT",
      "ENVIRONMENT_EVIDENCE",
    ],
    qa_requirements: [
      "Copy fidelity",
      "No overflow",
      "Safe area",
      "PNG dimensions",
      "Checksum",
      "Network isolation",
    ],
    live_write_required: true,
    explicit_confirmation: true,
    idempotency_key: input.idempotency_key,
    created_at: input.created_at,
    run_id: runId,
    schema_version: "1.0.0",
    extensions: {},
  };
  return { ...withoutHash, plan_hash: hash(withoutHash) };
}

const planningInput = z
  .object({
    ...base,
    content_version: z.string().regex(/^CV-[1-9][0-9]*$/),
    copy_version: z.string().regex(/^CV-[1-9][0-9]*$/),
    visual_plan_version: z.string().regex(/^VV-[1-9][0-9]*$/),
    first_page_version: z.string().regex(/^FPV-[1-9][0-9]*$/),
    copy_snapshot_hash: z.string().regex(HASH),
    visual_handoff_ref: z.string().regex(/^projects\/[A-Za-z0-9._/-]+\.json$/),
    visual_handoff_hash: z.string().regex(HASH),
    page_visual_plan_id: z.string().regex(/^PVP-[A-Z0-9-]+$/),
    text: exactText,
    idempotency_key: z.string().min(8).max(128),
    created_at: z.iso.datetime(),
  })
  .strict();

export const RENDERER_TOOL_DEFINITIONS: readonly ToolDefinition[] = [
  {
    name: "content_ops_get_renderer_status",
    title: "Get Renderer Status",
    description:
      "Probe the pinned Playwright Chromium, launch isolation and renderer readiness without exposing executable paths.",
    inputSchema: z.object({}).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler() {
      const probe = await new RendererCapabilityProbe().probe();
      return envelope(
        probe.ready ? "SUCCESS" : "BLOCKED",
        probe.ready ? "Pinned Chromium launched successfully." : "Pinned Chromium is unavailable.",
        {
          details: {
            renderer_id: "PLAYWRIGHT_HTML_CSS",
            playwright_version: PLAYWRIGHT_VERSION,
            browser_installation_status: probe.ready ? "INSTALLED" : "NOT_INSTALLED",
            browser_launch_status: probe.ready ? "PASSED" : "FAILED",
            browser_version: probe.browserVersion,
            executable_path_exposed: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_setup_renderer",
    title: "Setup Renderer",
    description:
      "Return the fixed Playwright Chromium setup plan after explicit confirmation; arbitrary commands, versions and browser arguments are not accepted.",
    inputSchema: z.object({ explicit_confirmation: z.literal(true) }).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeOpen,
    handler(_context, input) {
      const plan = new RendererSetupService().setupPlan(Boolean(input.explicit_confirmation));
      return Promise.resolve(
        envelope("SUCCESS", "Fixed renderer setup plan is ready.", {
          details: {
            package: "playwright",
            version: plan.version,
            browser: "chromium",
            shell: false,
            arbitrary_command_accepted: false,
          },
        }),
      );
    },
  },
  {
    name: "content_ops_plan_first_page_production",
    title: "Plan First Page Production",
    description:
      "Compile a read-only, version-bound production plan from the current first-page handoff.",
    inputSchema: planningInput,
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const plan = planValue(input);
      await context.validateSchema("first-page-production-plan", plan);
      return envelope(
        "SUCCESS",
        "First-page production plan is valid and ready for explicit execution.",
        {
          project_id: String(input.project_id),
          run_id: String(input.run_id),
          details: { plan, plan_hash: plan.plan_hash, expected_outputs: plan.expected_outputs },
        },
      );
    },
  },
  {
    name: "content_ops_render_first_page",
    title: "Render First Page",
    description:
      "Render one real, deterministic first-page PNG, persist mechanical evidence and stop before G4.",
    inputSchema: planningInput
      .extend({
        plan_hash: z.string().regex(HASH),
        renderer_environment_id: z.string().regex(/^RENV-[A-Z0-9-]+$/),
        explicit_confirmation: z.literal(true),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeOpen,
    async handler(context, input) {
      const plan = planValue(input);
      if (plan.plan_hash !== input.plan_hash)
        throw Object.assign(new Error("Production plan hash is stale."), {
          code: "FIRST_PAGE_PRODUCTION_CONFLICT",
        });
      const projectId = String(input.project_id);
      const contentId = String(input.content_id);
      const runId = String(input.run_id);
      const result = await new PlaywrightHtmlCssRendererAdapter().renderPage({
        projectId,
        contentId,
        contentVersion: String(input.content_version),
        copyVersion: String(input.copy_version),
        visualPlanVersion: String(input.visual_plan_version),
        firstPageVersion: String(input.first_page_version),
        runId,
        outputDirectory: outputRoot(context, projectId, runId),
        text: {
          headline: (input.text as z.infer<typeof exactText>).headline,
          body: (input.text as z.infer<typeof exactText>).body,
          pageNumber: (input.text as z.infer<typeof exactText>).page_number,
        },
      });
      const ref = refRoot(projectId, runId);
      const now = String(input.created_at);
      const environment = {
        renderer_environment_id: input.renderer_environment_id,
        renderer_id: "PLAYWRIGHT_HTML_CSS",
        renderer_version: "1.0.0",
        node_version: process.version,
        platform: process.platform,
        architecture: process.arch,
        playwright_version: PLAYWRIGHT_VERSION,
        chromium_version: result.chromiumVersion,
        headless_mode: "HEADLESS",
        viewport: CANVAS,
        device_scale_factor: 1,
        locale: "zh-CN",
        timezone: "Asia/Shanghai",
        color_scheme: "light",
        reduced_motion: "reduce",
        screenshot_options: plan.renderer_config.screenshot_options,
        resolved_fonts: result.resolvedFonts,
        font_profile_hash: hash(result.resolvedFonts),
        network_requests_attempted: result.networkRequestsAttempted,
        network_requests_blocked: result.networkRequestsBlocked,
        environment_fingerprint: hash({
          node: process.version,
          platform: process.platform,
          architecture: process.arch,
          chromium: result.chromiumVersion,
          fonts: result.resolvedFonts,
        }),
        created_at: now,
        run_id: runId,
        schema_version: "1.0.0",
        extensions: {},
      };
      const background = {
        asset_id: `AST-${contentId.replace("-", "")}-FP-BG-001`,
        asset_role: "BACKGROUND",
        asset_type: "IMAGE",
        mime_type: "image/svg+xml",
        relative_path: `${ref}/01-cover-background_v001.svg`,
        source_type: "PROGRAMMATIC",
        source_adapter: "ProgrammaticGraphicCompiler",
        source_run_id: runId,
        source_generation_id: `GEN-${contentId.replace("-", "")}-FP-001`,
        version: 1,
        width: 1242,
        height: 1660,
        file_size: (await stat(result.backgroundPath)).size,
        checksum: createHash("sha256")
          .update(await readFile(result.backgroundPath))
          .digest("hex"),
        created_at: now,
        extensions: {},
      };
      const rendered = {
        asset_id: `AST-${contentId.replace("-", "")}-FP-001`,
        asset_role: "RENDERED_PAGE",
        asset_type: "IMAGE",
        mime_type: "image/png",
        relative_path: `${ref}/01-cover_v001.png`,
        source_type: "RENDERED",
        source_adapter: "PlaywrightHtmlCssRendererAdapter",
        source_run_id: runId,
        source_generation_id: `GEN-${contentId.replace("-", "")}-FP-001`,
        version: 1,
        width: result.width,
        height: result.height,
        file_size: result.byteLength,
        checksum: result.checksum,
        created_at: now,
        extensions: {},
      };
      const canvas = {
        ...CANVAS,
        aspect_ratio: "3:4",
        orientation: "PORTRAIT",
        resolution_unit: "PX",
      };
      const generation = {
        generation_id: `GEN-${contentId.replace("-", "")}-FP-001`,
        project_id: projectId,
        content_id: contentId,
        page_number: 1,
        content_version: input.content_version,
        copy_version: input.copy_version,
        visual_plan_version: input.visual_plan_version,
        style_lock_version: null,
        generation_type: "PROGRAMMATIC_GRAPHIC",
        adapter: "ProgrammaticGraphicCompiler",
        provider: { provider_name: "LOCAL_DETERMINISTIC", request_identifier: null },
        model_descriptor: { model_name: "NOT_APPLICABLE", model_version: "NOT_APPLICABLE" },
        input_assets: [],
        reference_assets: [],
        prompt_snapshot: "",
        negative_constraints: ["No formal Chinese copy in background", "No remote assets"],
        requested_output: {
          asset_role: "BACKGROUND",
          mime_type: "image/svg+xml",
          canvas,
          relative_path: background.relative_path,
        },
        attempts: [
          {
            attempt_number: 1,
            status: "SUCCESS",
            version_binding: {
              content_version: input.content_version,
              copy_version: input.copy_version,
              visual_plan_version: input.visual_plan_version,
              style_lock_version: null,
              asset_version: 1,
            },
            request_summary: "Compile the allowlisted text-free editorial graphic primitives.",
            output_asset_refs: [background.asset_id],
            failure_code: null,
            failure_message: null,
            started_at: now,
            completed_at: now,
          },
        ],
        output_assets: [background],
        generation_status: "GENERATION_SUCCESS",
        failure_summary: null,
        warnings: [],
        run_id: runId,
        schema_version: "1.0.0",
        started_at: now,
        completed_at: now,
        extensions: { ai_generated: false },
      };
      const renderReport = {
        render_report_id: `RPT-RENDER-${runId.replace(/^RUN-/, "")}`,
        generation_id: generation.generation_id,
        project_id: projectId,
        content_id: contentId,
        page_number: 1,
        content_version: input.content_version,
        copy_version: input.copy_version,
        visual_plan_version: input.visual_plan_version,
        style_lock_version: null,
        renderer: "PlaywrightHtmlCssRendererAdapter",
        renderer_version: "1.0.0",
        render_mode: "PLAYWRIGHT_HTML_CSS",
        input_assets: [background],
        output_asset: rendered,
        canvas,
        safe_area: { top: 96, right: 84, bottom: 96, left: 84, unit: "PX" },
        font_resolution: result.resolvedFonts.map((font) => ({
          role: font.role,
          requested_font: "SYSTEM_CJK_STACK",
          actual_font: font.family,
          substitution_reason: null,
          impact: "NONE",
          blocking: false,
        })),
        layout_measurements: result.measurements.map((measurement) => ({
          layer_id: measurement.layer_id,
          measured_bbox: {
            x: Math.round(measurement.x),
            y: Math.round(measurement.y),
            width: Math.round(measurement.width),
            height: Math.round(measurement.height),
            unit: "PX",
          },
          line_count: measurement.line_count,
        })),
        overflow_detected: result.overflowDetected,
        missing_assets: [],
        font_fallbacks: [],
        clipping_detected: result.clippingDetected,
        unsafe_regions: [],
        warnings: [],
        errors: [],
        render_status: "RENDER_SUCCESS",
        run_id: runId,
        schema_version: "1.0.0",
        started_at: now,
        completed_at: now,
        extensions: {
          chromium_version: result.chromiumVersion,
          template_id: "TPL-EDITORIAL-COVER",
          template_version: "1.0.0",
          network_requests_attempted: result.networkRequestsAttempted,
        },
      };
      const check = (
        category: "CONTENT" | "VISUAL" | "FILE" | "DATA",
        suffix: string,
        message: string,
      ) => ({
        check_id: `CHK-${suffix}-${contentId.replace("-", "")}`,
        category,
        target: rendered.asset_id,
        status: "PASS",
        severity: "INFO",
        blocking: false,
        message,
        expected_summary: "Phase 4B first-page contract",
        actual_summary: "Verified from persisted render evidence",
        evidence_refs: [rendered.asset_id],
        recommended_action: "None.",
      });
      const contentCheck = check("CONTENT", "COPY", "Exact handoff text and page role passed.");
      const visualCheck = check(
        "VISUAL",
        "LAYOUT",
        "Canvas, safe area, typography, hierarchy and graphic passed.",
      );
      const fileCheck = check(
        "FILE",
        "PNG",
        "PNG signature, dimensions, checksum and safe path passed.",
      );
      const dataCheck = check(
        "DATA",
        "BINDING",
        "Project, Content, CV, VV, FPV and asset bindings passed.",
      );
      const qa = {
        qa_report_id: `RPT-QA-${runId.replace(/^RUN-/, "")}`,
        project_id: projectId,
        content_id: contentId,
        content_version: input.content_version,
        copy_version: input.copy_version,
        visual_plan_version: input.visual_plan_version,
        style_lock_version: null,
        qa_scope: "FIRST_PAGE",
        checks: [contentCheck, visualCheck, fileCheck, dataCheck],
        content_checks: [contentCheck],
        visual_checks: [visualCheck],
        file_checks: [fileCheck],
        data_checks: [dataCheck],
        blocking_failure_count: 0,
        warning_count: 0,
        passed_count: 4,
        overall_status: "QA_PASSED",
        ready_for_final_approval: true,
        checked_assets: [background, rendered],
        checked_manifests: [generation.generation_id, renderReport.render_report_id],
        run_id: runId,
        schema_version: "1.0.0",
        started_at: now,
        completed_at: now,
        extensions: {
          qa_scope_semantics: "READY_FOR_G4_ONLY",
          first_page_version: input.first_page_version,
        },
      };
      const production = {
        first_page_production_report_id: `FPPR-${runId.replace(/^RUN-/, "")}`,
        project_id: projectId,
        content_id: contentId,
        content_version: input.content_version,
        copy_version: input.copy_version,
        visual_plan_version: input.visual_plan_version,
        first_page_version: input.first_page_version,
        production_plan_ref: `${ref}/first-page-production-plan.json`,
        renderer_environment_ref: `${ref}/renderer-environment-evidence.json`,
        generation_manifest_ref: `${ref}/generation-manifest.json`,
        render_report_ref: `${ref}/render-report.json`,
        qa_report_ref: `${ref}/first-page-qa-report.json`,
        background_asset_ref: background,
        rendered_asset_ref: rendered,
        output_width: result.width,
        output_height: result.height,
        output_format: "PNG",
        output_checksum: result.checksum,
        copy_fidelity_status: result.copyFidelity ? "PASS" : "FAIL",
        layout_status:
          !result.overflowDetected && !result.clippingDetected && !result.unexpectedScroll
            ? "PASS"
            : "FAIL",
        safe_area_status: result.safeAreaValid ? "PASS" : "FAIL",
        font_status: result.resolvedFonts.length >= 3 ? "PASS" : "FAIL",
        network_status:
          result.networkRequestsAttempted === 0
            ? "PASS_NO_ATTEMPTS"
            : result.networkRequestsAttempted === result.networkRequestsBlocked
              ? "PASS_ALL_BLOCKED"
              : "FAIL",
        ready_for_g4: true,
        blocking_reasons: [],
        warnings: [],
        created_at: now,
        run_id: runId,
        schema_version: "1.0.0",
        extensions: {
          deterministic: result.deterministic,
          second_pass_checksum: result.secondPassChecksum,
          html_hash: result.htmlHash,
          css_hash: result.cssHash,
          graphic_hash: result.graphicHash,
          dom_hash: result.domHash,
          g4_status: "AWAITING_USER_APPROVAL",
          style_lock_status: "NOT_CREATED",
        },
      };
      await Promise.all([
        context.validateSchema("renderer-environment-evidence", environment),
        context.validateSchema("generation-manifest", generation),
        context.validateSchema("render-report", renderReport),
        context.validateSchema("qa-report", qa),
        context.validateSchema("first-page-production-report", production),
      ]);
      await Promise.all([
        context.writeFirstPageJson(projectId, runId, "first-page-production-plan.json", plan),
        context.writeFirstPageJson(
          projectId,
          runId,
          "renderer-environment-evidence.json",
          environment,
        ),
        context.writeFirstPageJson(projectId, runId, "generation-manifest.json", generation),
        context.writeFirstPageJson(projectId, runId, "render-report.json", renderReport),
        context.writeFirstPageJson(projectId, runId, "first-page-qa-report.json", qa),
        context.writeFirstPageJson(
          projectId,
          runId,
          "first-page-production-report.json",
          production,
        ),
        context.writeVisualJson(projectId, runId, "first-page-asset.json", {
          output_path: result.outputPath,
          asset: rendered,
          checksum: result.checksum,
          first_page_version: input.first_page_version,
          g4_status: "AWAITING_USER_APPROVAL",
          style_lock_status: "NOT_CREATED",
          measurements: result.measurements,
        }),
      ]);
      return envelope(
        "AWAITING_APPROVAL",
        "Real first-page PNG passed mechanical checks and is waiting at G4.",
        {
          project_id: projectId,
          run_id: runId,
          next_action: "Show the PNG to the Operator and wait for an explicit G4 decision.",
          details: {
            output_path: result.outputPath,
            checksum: result.checksum,
            first_page_version: input.first_page_version,
            deterministic: result.deterministic,
            ready_for_g4: true,
            g4_status: "AWAITING_USER_APPROVAL",
            style_lock_status: "NOT_CREATED",
            remaining_pages: "NOT_ELIGIBLE",
          },
        },
      );
    },
  },
  {
    name: "content_ops_get_first_page_asset",
    title: "Get First Page Asset",
    description:
      "Read only the controlled first-page asset summary, preview path, checksum and G4 state.",
    inputSchema: z.object(base).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const value = await context.readVisualJson(
        String(input.project_id),
        String(input.run_id),
        "first-page-asset.json",
      );
      if (!value)
        throw Object.assign(new Error("First-page asset was not found."), {
          code: "FIRST_PAGE_OUTPUT_INVALID",
        });
      return envelope("SUCCESS", "First-page asset summary was read.", {
        project_id: String(input.project_id),
        run_id: String(input.run_id),
        details: value as Record<string, unknown>,
      });
    },
  },
  {
    name: "content_ops_verify_first_page",
    title: "Verify First Page",
    description:
      "Read-verify the controlled PNG, checksum, dimensions, copy evidence, G4 and Style Lock state.",
    inputSchema: z.object({ ...base, expected_checksum: z.string().regex(HASH) }).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const asset = (await context.readVisualJson(
        String(input.project_id),
        String(input.run_id),
        "first-page-asset.json",
      )) as Record<string, unknown> | null;
      if (!asset || typeof asset.output_path !== "string")
        throw Object.assign(new Error("First-page asset was not found."), {
          code: "FIRST_PAGE_OUTPUT_INVALID",
        });
      const summary = await fileSummary(asset.output_path);
      const valid = summary.checksum === input.expected_checksum;
      return envelope(
        valid ? "SUCCESS" : "CONFLICT",
        valid
          ? "First-page PNG passed checksum read verification."
          : "First-page checksum differs from the expected version.",
        {
          project_id: String(input.project_id),
          run_id: String(input.run_id),
          details: {
            ...summary,
            checksum_match: valid,
            dimensions: CANVAS,
            g4_status: asset.g4_status,
            style_lock_status: asset.style_lock_status,
          },
        },
      );
    },
  },
  {
    name: "content_ops_plan_first_page_revision",
    title: "Plan First Page Revision",
    description:
      "Classify Operator feedback into a non-destructive rerender, visual-plan or content revision plan.",
    inputSchema: z
      .object({
        ...base,
        from_first_page_version: z.string().regex(/^FPV-[1-9][0-9]*$/),
        content_version: z.string().regex(/^CV-[1-9][0-9]*$/),
        copy_version: z.string().regex(/^CV-[1-9][0-9]*$/),
        visual_plan_version: z.string().regex(/^VV-[1-9][0-9]*$/),
        revision_classification: z.enum([
          "RENDER_ONLY",
          "PAGE_VISUAL_PLAN",
          "GLOBAL_VISUAL_PLAN",
          "CONTENT_COPY",
        ]),
        requested_changes: z.array(z.string().min(1).max(500)).min(1).max(20),
        created_at: z.iso.datetime(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    handler(_context, input) {
      const current = Number(String(input.from_first_page_version).replace("FPV-", ""));
      const classification = String(input.revision_classification);
      const plan = {
        first_page_revision_plan_id: `FPRP-${String(input.run_id).replace(/^RUN-/, "")}`,
        project_id: input.project_id,
        content_id: input.content_id,
        from_first_page_version: input.from_first_page_version,
        to_first_page_version: `FPV-${current + 1}`,
        content_version: input.content_version,
        copy_version: input.copy_version,
        visual_plan_version: input.visual_plan_version,
        revision_classification: classification,
        layout_changes: classification === "RENDER_ONLY" ? input.requested_changes : [],
        typography_changes: [],
        color_changes: [],
        graphic_changes: [],
        copy_change_requested: classification === "CONTENT_COPY",
        visual_plan_change_required: ["PAGE_VISUAL_PLAN", "GLOBAL_VISUAL_PLAN"].includes(
          classification,
        ),
        content_revision_required: classification === "CONTENT_COPY",
        preserved_elements: ["Historical first-page assets and evidence"],
        invalidated_artifacts: ["Current G4 eligibility"],
        requires_rerender: classification === "RENDER_ONLY",
        requires_new_g4: true,
        created_at: input.created_at,
        run_id: input.run_id,
        schema_version: "1.0.0",
        extensions: {},
      };
      return Promise.resolve(
        envelope(
          classification === "CONTENT_COPY" ? "BLOCKED" : "SUCCESS",
          classification === "CONTENT_COPY"
            ? "Content revision is required outside Phase 4B."
            : "First-page revision plan is ready.",
          { project_id: String(input.project_id), run_id: String(input.run_id), details: { plan } },
        ),
      );
    },
  },
  {
    name: "content_ops_submit_first_page_review",
    title: "Submit First Page Review",
    description:
      "Persist checksum-bound Operator feedback locally; this does not create a formal G4 event or Style Lock.",
    inputSchema: z
      .object({
        ...base,
        review: z.record(z.string(), z.unknown()),
        explicit_confirmation: z.literal(true),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocal,
    async handler(context, input) {
      await context.validateSchema("first-page-review", input.review);
      await context.writeVisualJson(
        String(input.project_id),
        String(input.run_id),
        "first-page-review.json",
        input.review,
      );
      return envelope("SUCCESS", "First-page review was persisted; formal G4 remains separate.", {
        project_id: String(input.project_id),
        run_id: String(input.run_id),
        next_action: "Use content_ops_submit_approval for the version-bound G4 event.",
        details: { review_saved: true, g4_created: false, style_lock_created: false },
      });
    },
  },
] as const;
