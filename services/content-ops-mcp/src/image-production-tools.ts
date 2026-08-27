import { z } from "zod";
import {
  ASSET_CHANNELS,
  IMAGE_PRODUCTION_VISUAL_MODES,
  evaluateGroupQuality,
  evaluateImageQuality,
  planAssetRoute,
  planDirectionCandidates,
  planProductionBatch,
  proposeVisualRule,
  type QualityDimension,
} from "../../../packages/core/src/image-production/index.js";
import {
  ACCOUNT_GOALS,
  COVER_CONVERSION_STRATEGIES,
  COVER_OBJECTIVES,
  COVER_SEMANTIC_ROLES,
  evaluateCoverClickClarity,
  evaluateCoverThumbnail,
  evaluateVisualSemanticRelevance,
  planCoverConversion,
} from "../../../packages/core/src/cover-conversion/index.js";
import type { ToolDefinition } from "./tool-registry.js";
import { envelope, resultEnvelopeSchema } from "./result-envelope.js";

const PROJECT_ID = /^PRJ-[A-Z0-9][A-Z0-9-]{2,63}$/;
const CONTENT_ID = /^C-[0-9]{4}$/;
const RUN_ID = /^RUN-[A-Z0-9][A-Z0-9-]{2,95}$/;
const HASH = /^[a-f0-9]{64}$/;
const assetChannel = z.enum(ASSET_CHANNELS);
const visualMode = z.enum(IMAGE_PRODUCTION_VISUAL_MODES);
const base = {
  project_id: z.string().regex(PROJECT_ID),
  content_id: z.string().regex(CONTENT_ID),
  run_id: z.string().regex(RUN_ID),
};
const readOnly = { readOnlyHint: true, destructiveHint: false, openWorldHint: false } as const;
const writeLocal = { readOnlyHint: false, destructiveHint: false, openWorldHint: false } as const;
const coverProjectId = z.string().regex(/^(?:PRJ|CAL)-[A-Z0-9][A-Z0-9-]{2,63}$/);
const accountGoal = z.enum(ACCOUNT_GOALS);
const coverObjective = z.enum(COVER_OBJECTIVES);
const coverStrategy = z.enum(COVER_CONVERSION_STRATEGIES);
const coverSemanticRole = z.enum(COVER_SEMANTIC_ROLES);

function strings(input: unknown): string[] {
  return Array.isArray(input) ? input.map(String) : [];
}

const candidate = z
  .object({
    candidate_id: z.string().regex(/^VDC-[A-Z0-9-]+$/),
    asset_id: z.string().regex(/^AST-[A-Z0-9-]+$/),
    asset_channel: assetChannel,
    visual_mode: visualMode,
    composition_summary: z.string().min(1),
    palette: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).min(2),
    typography_character: z.string().min(1),
    relative_path: z
      .string()
      .min(1)
      .refine((item) => !item.startsWith("/") && !item.includes("..")),
    mime_type: z.enum(["image/png", "image/jpeg", "image/webp"]),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    file_size: z.number().int().positive(),
    checksum: z.string().regex(HASH),
    quality_score: z.number().int().min(75).max(100),
    hard_blocks: z.array(z.string()).max(0),
    host_imagegen: z.boolean(),
    renderer: z.boolean(),
  })
  .strict();

const qualityRatings = z
  .object({
    CONTENT_SEMANTIC_FIT: z.number().int().min(0).max(5),
    COMPOSITION_FOCUS: z.number().int().min(0).max(5),
    HIERARCHY_READABILITY: z.number().int().min(0).max(5),
    ASSET_QUALITY_INTEGRITY: z.number().int().min(0).max(5),
    PROJECT_AUDIENCE_FIT: z.number().int().min(0).max(5),
    UNIQUENESS_ANTI_TEMPLATE: z.number().int().min(0).max(5),
    VISUAL_MODE_EXECUTION: z.number().int().min(0).max(5),
    PLATFORM_MOBILE_PERFORMANCE: z.number().int().min(0).max(5),
  })
  .strict();

export const IMAGE_PRODUCTION_TOOL_DEFINITIONS: readonly ToolDefinition[] = [
  {
    name: "content_ops_plan_cover_conversion",
    title: "Plan Cover Conversion",
    description:
      "Plan a Xiaohongshu cover conversion strategy from specific Subject, Audience, Painpoint and account goal; generic lead-generation context is blocked.",
    inputSchema: z
      .object({
        project_id: coverProjectId,
        content_id: z.string().regex(CONTENT_ID),
        run_id: z.string().regex(RUN_ID),
        content_version: z.string().regex(/^CV-[1-9][0-9]*$/),
        copy_version: z.string().regex(/^CV-[1-9][0-9]*$/),
        account_goal: accountGoal,
        subject: z.string(),
        audience: z.string(),
        painpoint: z.string(),
        content_value: z.string(),
        decision_stage: z.string().min(1),
        publish_title: z.string().min(1),
        page_1_content_copy: z.string().min(1),
        requested_objective: coverObjective.optional(),
        requested_strategy: coverStrategy.optional(),
        project_visual_profile_version: z
          .string()
          .regex(/^PVPFV-[1-9][0-9]*$/)
          .nullable(),
        global_visual_preference_version: z.string().regex(/^GUVPV-[1-9][0-9]*$/),
        industry_pack_version: z.string().regex(/^\d+\.\d+\.\d+$/),
        platform_pack_version: z.string().regex(/^\d+\.\d+\.\d+$/),
        created_at: z.iso.datetime(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(_context, input) {
      await Promise.resolve();
      const plan = planCoverConversion({
        projectId: String(input.project_id),
        contentId: String(input.content_id),
        contentVersion: String(input.content_version),
        copyVersion: String(input.copy_version),
        runId: String(input.run_id),
        createdAt: String(input.created_at),
        platform: "XIAOHONGSHU",
        accountGoal: input.account_goal as never,
        subject: String(input.subject),
        audience: String(input.audience),
        painpoint: String(input.painpoint),
        contentValue: String(input.content_value),
        decisionStage: String(input.decision_stage),
        publishTitle: String(input.publish_title),
        page1ContentCopy: String(input.page_1_content_copy),
        ...(input.requested_objective
          ? { requestedObjective: input.requested_objective as never }
          : {}),
        ...(input.requested_strategy
          ? { requestedStrategy: input.requested_strategy as never }
          : {}),
        projectVisualProfileVersion: input.project_visual_profile_version as string | null,
        globalVisualPreferenceVersion: String(input.global_visual_preference_version),
        industryPackVersion: String(input.industry_pack_version),
        platformPackVersion: String(input.platform_pack_version),
      });
      return envelope(
        plan.ready ? "SUCCESS" : "BLOCKED",
        plan.ready ? "Cover conversion plan is ready." : "Cover context is insufficient.",
        {
          project_id: String(input.project_id),
          run_id: String(input.run_id),
          warnings: plan.ambiguities,
          ...(plan.blocking_questions[0] ? { next_action: plan.blocking_questions[0] } : {}),
          details: { plan, remote_writes: 0 },
        },
      );
    },
  },
  {
    name: "content_ops_submit_cover_copy_revision",
    title: "Submit Cover Copy Revision",
    description:
      "Validate and persist an already-authored conversion-specific cover copy package in Project Home; it does not grant G3 or G4 approval.",
    inputSchema: z
      .object({
        project_id: coverProjectId,
        content_id: z.string().regex(CONTENT_ID),
        run_id: z.string().regex(RUN_ID),
        artifact: z.record(z.string(), z.unknown()),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocal,
    async handler(context, input) {
      await context.validateSchema("cover-copy-package", input.artifact);
      const file = await context.writeImageProductionJson(
        String(input.project_id),
        String(input.run_id),
        "cover-copy-package.json",
        input.artifact,
      );
      return envelope(
        "AWAITING_APPROVAL",
        "Cover copy revision was stored locally and still requires G3.",
        {
          project_id: String(input.project_id),
          run_id: String(input.run_id),
          created_records: 1,
          artifacts: [file],
          next_action: "Run the version-bound G3 copy review.",
          details: { g3_approved: false, g4_created: false, remote_writes: 0 },
        },
      );
    },
  },
  {
    name: "content_ops_evaluate_cover_thumbnail",
    title: "Evaluate Cover Thumbnail",
    description:
      "Evaluate true-size 310x414 and 186x248 thumbnail legibility without aesthetic approval.",
    inputSchema: z
      .object({
        project_id: coverProjectId,
        content_id: z.string().regex(CONTENT_ID),
        run_id: z.string().regex(RUN_ID),
        candidate_id: z.string().regex(/^CCC-[A-Z0-9-]+$/),
        account_goal: accountGoal,
        thumbnails: z
          .array(
            z
              .object({
                size: z.enum(["310x414", "186x248"]),
                width: z.union([z.literal(310), z.literal(186)]),
                height: z.union([z.literal(414), z.literal(248)]),
                relative_path: z.string().min(1),
                checksum: z.string().regex(HASH),
                primary_effective_font_px: z.number().nonnegative(),
                secondary_effective_font_px: z.number().nonnegative(),
                readable: z.boolean(),
              })
              .strict(),
          )
          .length(2),
        source_asset_checksum: z.string().regex(HASH),
        primary_hook_lines: z.number().int().positive(),
        primary_hook_first_focus: z.boolean(),
        single_click_message: z.boolean(),
        audience_or_painpoint_or_value_clear: z.boolean(),
        background_competes: z.boolean(),
        small_paragraph_present: z.boolean(),
        text_background_contrast: z.number().min(1),
        text_visual_share: z.number().min(0).max(1),
        business_scene_recognizable: z.boolean(),
        created_at: z.iso.datetime(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocal,
    async handler(context, input) {
      const result = evaluateCoverThumbnail({
        accountGoal: input.account_goal as never,
        thumbnails: (input.thumbnails as Array<Record<string, unknown>>).map((item) => ({
          size: item.size as never,
          width: item.width as never,
          height: item.height as never,
          primaryEffectiveFontPx: Number(item.primary_effective_font_px),
          secondaryEffectiveFontPx: Number(item.secondary_effective_font_px),
          readable: Boolean(item.readable),
        })),
        primaryHookLines: Number(input.primary_hook_lines),
        primaryHookFirstFocus: Boolean(input.primary_hook_first_focus),
        singleClickMessage: Boolean(input.single_click_message),
        audienceOrPainpointOrValueClear: Boolean(input.audience_or_painpoint_or_value_clear),
        backgroundCompetes: Boolean(input.background_competes),
        smallParagraphPresent: Boolean(input.small_paragraph_present),
        contrastRatio: Number(input.text_background_contrast),
        textVisualShare: Number(input.text_visual_share),
        businessSceneRecognizable: Boolean(input.business_scene_recognizable),
      });
      const artifact = {
        report_id: `CTQA-${String(input.candidate_id).replace(/^CCC-/u, "")}`,
        project_id: input.project_id,
        content_id: input.content_id,
        candidate_id: input.candidate_id,
        source_asset_checksum: input.source_asset_checksum,
        thumbnails: input.thumbnails,
        primary_hook_lines: input.primary_hook_lines,
        primary_hook_first_focus: input.primary_hook_first_focus,
        single_click_message: input.single_click_message,
        audience_or_painpoint_or_value_clear: input.audience_or_painpoint_or_value_clear,
        background_competes: input.background_competes,
        small_paragraph_present: input.small_paragraph_present,
        text_background_contrast: input.text_background_contrast,
        text_visual_share: input.text_visual_share,
        business_scene_recognizable: input.business_scene_recognizable,
        hard_blocks: result.hard_blocks,
        result: result.result,
        run_id: input.run_id,
        created_at: input.created_at,
        schema_version: "1.0.0",
        extensions: {},
      };
      await context.validateSchema("cover-thumbnail-qa", artifact);
      const file = await context.writeImageProductionJson(
        String(input.project_id),
        String(input.run_id),
        `${artifact.report_id}.json`,
        artifact,
      );
      return envelope(
        result.result === "PASS" ? "SUCCESS" : "BLOCKED",
        `Thumbnail result: ${result.result}.`,
        {
          project_id: String(input.project_id),
          run_id: String(input.run_id),
          artifacts: [file],
          details: { ...result, aesthetic_approval_granted: false },
        },
      );
    },
  },
  {
    name: "content_ops_evaluate_cover_click_clarity",
    title: "Evaluate Cover Click Clarity",
    description:
      "Score the 100-point cover click-clarity model; passing never creates Operator approval.",
    inputSchema: z
      .object({
        project_id: coverProjectId,
        content_id: z.string().regex(CONTENT_ID),
        run_id: z.string().regex(RUN_ID),
        candidate_id: z.string().regex(/^CCC-[A-Z0-9-]+$/),
        account_goal: accountGoal,
        cover_objective: coverObjective,
        scores: z.record(z.string(), z.number().int().nonnegative()),
        hard_blocks: z.array(z.string()),
        created_at: z.iso.datetime(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(_context, input) {
      await Promise.resolve();
      const result = evaluateCoverClickClarity({
        scores: input.scores as never,
        hardBlocks: input.hard_blocks as never,
        accountGoal: input.account_goal as never,
      });
      return envelope(
        result.result === "PASS_PENDING_OPERATOR" ? "AWAITING_APPROVAL" : "BLOCKED",
        `Cover click clarity: ${result.total_score}/${result.threshold}.`,
        {
          project_id: String(input.project_id),
          run_id: String(input.run_id),
          details: {
            ...result,
            candidate_id: input.candidate_id,
            cover_objective: input.cover_objective,
            aesthetic_approval_granted: false,
            remote_writes: 0,
          },
        },
      );
    },
  },
  {
    name: "content_ops_evaluate_visual_semantic_relevance",
    title: "Evaluate Visual Semantic Relevance",
    description:
      "Score direct visual relevance and block decorative-only or unsupported abstract lead-generation backgrounds.",
    inputSchema: z
      .object({
        project_id: coverProjectId,
        content_id: z.string().regex(CONTENT_ID),
        run_id: z.string().regex(RUN_ID),
        candidate_id: z.string().regex(/^CCC-[A-Z0-9-]+$/),
        account_goal: accountGoal,
        semantic_role: coverSemanticRole,
        direct_relation_statement: z.string(),
        scores: z.record(z.string(), z.number().int().nonnegative()),
        project_profile_allows_abstract: z.boolean(),
        operator_rejected: z.boolean(),
        target_audience_can_recognize: z.boolean(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(_context, input) {
      await Promise.resolve();
      const result = evaluateVisualSemanticRelevance({
        semanticRole: input.semantic_role as never,
        directRelationStatement: String(input.direct_relation_statement),
        scores: input.scores as never,
        accountGoal: input.account_goal as never,
        projectProfileAllowsAbstract: Boolean(input.project_profile_allows_abstract),
        operatorRejected: Boolean(input.operator_rejected),
        targetAudienceCanRecognize: Boolean(input.target_audience_can_recognize),
      });
      return envelope(
        result.result === "PASS_PENDING_OPERATOR" ? "AWAITING_APPROVAL" : "BLOCKED",
        `Visual semantic relevance: ${result.total_score}/${result.threshold}.`,
        {
          project_id: String(input.project_id),
          run_id: String(input.run_id),
          details: {
            ...result,
            candidate_id: input.candidate_id,
            aesthetic_approval_granted: false,
            remote_writes: 0,
          },
        },
      );
    },
  },
  {
    name: "content_ops_get_cover_concept_candidates",
    title: "Get Cover Concept Candidates",
    description:
      "Read the local cover-concept candidate set and comparison assets without selecting a direction.",
    inputSchema: z
      .object({
        project_id: coverProjectId,
        content_id: z.string().regex(CONTENT_ID),
        run_id: z.string().regex(RUN_ID),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const value = await context.readImageProductionJson(
        String(input.project_id),
        String(input.run_id),
        "cover-concept-candidate-set.json",
      );
      return envelope(
        value ? "AWAITING_APPROVAL" : "BLOCKED",
        value
          ? "Cover concept candidates loaded; Operator selection is required."
          : "Cover concept candidate set was not found.",
        {
          project_id: String(input.project_id),
          run_id: String(input.run_id),
          details: { candidate_set: value, selection_created: false, remote_writes: 0 },
        },
      );
    },
  },
  {
    name: "content_ops_get_image_production_context",
    title: "Get Image Production Context",
    description:
      "Read the version-bound image-production context without changing Content, Visual Plan, G4, Style Lock, or Feishu.",
    inputSchema: z.object(base).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const contentId = String(input.content_id);
      const runId = String(input.run_id);
      const existing = await context.readImageProductionJson(
        projectId,
        runId,
        "image-production-context.json",
      );
      return envelope(
        existing ? "SUCCESS" : "BLOCKED",
        existing ? "Image Production Context loaded." : "Image Production Context was not found.",
        {
          project_id: projectId,
          run_id: runId,
          details: { context: existing, content_id: contentId, remote_writes: 0 },
        },
      );
    },
  },
  {
    name: "content_ops_plan_asset_routing",
    title: "Plan Asset Routing",
    description:
      "Plan one page through the six provenance-preserving asset channels; this tool never generates an image.",
    inputSchema: z
      .object({
        ...base,
        page_number: z.number().int().positive(),
        evidence_required: z.boolean(),
        accurate_structure_required: z.boolean(),
        operator_requested_channel: assetChannel.optional(),
        style_lock_channel: assetChannel.optional(),
        project_profile_channels: z.array(assetChannel).optional(),
        industry_channels: z.array(assetChannel).optional(),
        host_imagegen_available: z.boolean(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(_context, input) {
      await Promise.resolve();
      const route = planAssetRoute({
        projectId: String(input.project_id),
        contentId: String(input.content_id),
        pageNumber: Number(input.page_number),
        evidenceRequired: Boolean(input.evidence_required),
        accurateStructureRequired: Boolean(input.accurate_structure_required),
        operatorRequestedChannel: input.operator_requested_channel as never,
        styleLockChannel: input.style_lock_channel as never,
        projectProfileChannels: input.project_profile_channels as never,
        industryChannels: input.industry_channels as never,
        hostImagegenAvailable: Boolean(input.host_imagegen_available),
      });
      return envelope("SUCCESS", "Asset route planned without side effects.", {
        project_id: String(input.project_id),
        run_id: String(input.run_id),
        warnings: route.warnings,
        details: { ...route, remote_writes: 0 },
      });
    },
  },
  {
    name: "content_ops_plan_visual_direction_candidates",
    title: "Plan Visual Direction Candidates",
    description:
      "Plan two or three materially different non-delivery directions for an immature project profile.",
    inputSchema: z
      .object({
        ...base,
        profile_maturity: z.enum(["UNMATURE", "MATURE", "UNAVAILABLE"]),
        explicit_direction: z.boolean(),
        host_imagegen_available: z.boolean(),
        candidate_count: z.union([z.literal(2), z.literal(3)]).optional(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(_context, input) {
      await Promise.resolve();
      const plan = planDirectionCandidates({
        contentId: String(input.content_id),
        profileMaturity: input.profile_maturity as never,
        explicitDirection: Boolean(input.explicit_direction),
        hostImagegenAvailable: Boolean(input.host_imagegen_available),
        ...(input.candidate_count === undefined
          ? {}
          : { candidateCount: input.candidate_count as 2 | 3 }),
      });
      return envelope(
        "SUCCESS",
        plan.required
          ? "Direction candidates planned; Host execution and submission remain separate."
          : "Direction candidates are not required by the current profile or explicit direction.",
        {
          project_id: String(input.project_id),
          run_id: String(input.run_id),
          details: { ...plan, remote_writes: 0 },
        },
      );
    },
  },
  {
    name: "content_ops_submit_direction_candidate_assets",
    title: "Submit Direction Candidate Assets",
    description:
      "Validate and register two or three already-materialized direction candidates in Project Home only.",
    inputSchema: z
      .object({
        ...base,
        candidate_set_id: z.string().regex(/^VDCS-[A-Z0-9-]+$/),
        content_version: z.string().regex(/^CV-[1-9][0-9]*$/),
        copy_version: z.string().regex(/^CV-[1-9][0-9]*$/),
        source_visual_plan_version: z.string().regex(/^VV-[1-9][0-9]*$/),
        candidates: z.array(candidate).min(2).max(3),
        created_at: z.iso.datetime(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocal,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const contentId = String(input.content_id);
      const runId = String(input.run_id);
      const candidates = input.candidates as Array<z.infer<typeof candidate>>;
      if (
        new Set(
          candidates.map(
            (item) => `${item.asset_channel}|${item.visual_mode}|${item.composition_summary}`,
          ),
        ).size !== candidates.length
      )
        throw Object.assign(new Error("Candidates are not materially different."), {
          code: "VISUAL_DIRECTION_CANDIDATES_NOT_MATERIALLY_DIFFERENT",
        });
      const artifact = {
        candidate_set_id: input.candidate_set_id,
        project_id: projectId,
        content_id: contentId,
        content_version: input.content_version,
        copy_version: input.copy_version,
        source_visual_plan_version: input.source_visual_plan_version,
        status: "AWAITING_USER_SELECTION",
        candidates: candidates.map((item) => ({
          candidate_id: item.candidate_id,
          asset_id: item.asset_id,
          asset_channel: item.asset_channel,
          visual_mode: item.visual_mode,
          composition_summary: item.composition_summary,
          palette: item.palette,
          typography_character: item.typography_character,
          asset: {
            asset_id: item.asset_id,
            asset_role: "DIRECTION_CANDIDATE",
            asset_type: "IMAGE",
            mime_type: item.mime_type,
            relative_path: item.relative_path,
            source_type: item.host_imagegen ? "HOST_NATIVE_IMAGEGEN" : "RENDERED",
            source_adapter: item.host_imagegen ? "host-native-imagegen" : "production-renderer",
            source_run_id: runId,
            source_generation_id: `GEN-${item.candidate_id.replace(/^VDC-/u, "")}`,
            version: 1,
            width: item.width,
            height: item.height,
            file_size: item.file_size,
            checksum: item.checksum,
            created_at: input.created_at,
            extensions: {},
          },
          quality_score: item.quality_score,
          hard_blocks: [],
          host_imagegen: item.host_imagegen,
          renderer: item.renderer,
          delivery_role: "DIRECTION_CANDIDATE_ONLY",
        })),
        material_difference_verified: true,
        formal_delivery_count: 0,
        feishu_formal_write_count: 0,
        run_id: runId,
        schema_version: "1.0.0",
        created_at: input.created_at,
      };
      await context.validateSchema("visual-direction-candidate-set", artifact);
      const file = await context.writeImageProductionJson(
        projectId,
        runId,
        "visual-direction-candidate-set.json",
        artifact,
      );
      return envelope(
        "AWAITING_APPROVAL",
        "Direction candidates registered locally; explicit Operator selection is required.",
        {
          project_id: projectId,
          run_id: runId,
          created_records: 1,
          artifacts: [file],
          next_action: "Select exactly one candidate; do not create G4 or Style Lock.",
          details: {
            candidate_count: candidates.length,
            state: "AWAITING_USER_SELECTION",
            formal_delivery_count: 0,
            feishu_formal_write_count: 0,
          },
        },
      );
    },
  },
  {
    name: "content_ops_get_visual_direction_candidates",
    title: "Get Visual Direction Candidates",
    description: "Read the current local direction-candidate set and its preview references.",
    inputSchema: z.object(base).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const value = await context.readImageProductionJson(
        String(input.project_id),
        String(input.run_id),
        "visual-direction-candidate-set.json",
      );
      return envelope(
        value ? "SUCCESS" : "BLOCKED",
        value ? "Direction candidate set loaded." : "Direction candidate set was not found.",
        {
          project_id: String(input.project_id),
          run_id: String(input.run_id),
          details: { candidate_set: value, remote_writes: 0 },
        },
      );
    },
  },
  {
    name: "content_ops_select_visual_direction",
    title: "Select Visual Direction",
    description:
      "Persist one explicit Operator selection locally; this does not create G4, Style Lock, VV-2, or FPV-2 by itself.",
    inputSchema: z
      .object({
        ...base,
        candidate_set_id: z.string().regex(/^VDCS-[A-Z0-9-]+$/),
        candidate_id: z.string().regex(/^VDC-[A-Z0-9-]+$/),
        next_visual_plan_version: z.string().regex(/^VV-[1-9][0-9]*$/),
        selection_comment: z.string().min(1).nullable(),
        selected_at: z.iso.datetime(),
        explicit_operator_selection: z.literal(true),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocal,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const runId = String(input.run_id);
      const set = (await context.readImageProductionJson(
        projectId,
        runId,
        "visual-direction-candidate-set.json",
      )) as { candidates?: Array<{ candidate_id?: string }> } | null;
      if (!set?.candidates?.some((item) => item.candidate_id === input.candidate_id))
        throw Object.assign(new Error("Selected candidate is not in the current set."), {
          code: "VISUAL_DIRECTION_CANDIDATE_NOT_FOUND",
        });
      const artifact = {
        selection_id: `VDS-${String(input.candidate_id).replace(/^VDC-/u, "")}`,
        candidate_set_id: input.candidate_set_id,
        candidate_id: input.candidate_id,
        project_id: projectId,
        content_id: input.content_id,
        selected_by: "OPERATOR",
        selection_comment: input.selection_comment,
        creates_g4: false,
        creates_style_lock: false,
        next_visual_plan_version: input.next_visual_plan_version,
        run_id: runId,
        schema_version: "1.0.0",
        selected_at: input.selected_at,
      };
      await context.validateSchema("visual-direction-selection", artifact);
      const file = await context.writeImageProductionJson(
        projectId,
        runId,
        "visual-direction-selection.json",
        artifact,
      );
      return envelope(
        "SUCCESS",
        "Visual direction selected locally; formal Visual Plan revision is the next separate action.",
        {
          project_id: projectId,
          run_id: runId,
          created_records: 1,
          artifacts: [file],
          details: { creates_g4: false, creates_style_lock: false, feishu_formal_write_count: 0 },
        },
      );
    },
  },
  {
    name: "content_ops_submit_generated_visual_asset",
    title: "Submit Generated Visual Asset",
    description:
      "Register metadata for a Host-generated asset already materialized under Project Home; temporary URLs and arbitrary downloads are not accepted.",
    inputSchema: z
      .object({
        ...base,
        generation_id: z.string().regex(/^GEN-[A-Z0-9-]+$/),
        candidate_id: z
          .string()
          .regex(/^VDC-[A-Z0-9-]+$/)
          .nullable(),
        relative_path: z
          .string()
          .min(1)
          .refine((item) => !item.startsWith("/") && !item.includes("..") && !item.includes(":")),
        checksum: z.string().regex(HASH),
        file_size: z.number().int().positive(),
        mime_type: z.enum(["image/png", "image/jpeg", "image/webp"]),
        host_provider: z.string().min(1),
        host_model: z.string().min(1).nullable(),
        created_at: z.iso.datetime(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocal,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const runId = String(input.run_id);
      const artifact = {
        generation_id: input.generation_id,
        project_id: projectId,
        content_id: input.content_id,
        candidate_id: input.candidate_id,
        relative_path: input.relative_path,
        checksum: input.checksum,
        file_size: input.file_size,
        mime_type: input.mime_type,
        provider: input.host_provider,
        model: input.host_model,
        durable_local_asset: true,
        temporary_url: null,
        run_id: runId,
        created_at: input.created_at,
      };
      const file = await context.writeImageProductionJson(
        projectId,
        runId,
        `${String(input.generation_id)}.json`,
        artifact,
      );
      return envelope("SUCCESS", "Durable Host-generated asset metadata registered locally.", {
        project_id: projectId,
        run_id: runId,
        created_records: 1,
        artifacts: [file],
        details: { production_mock_fallback: false, remote_writes: 0 },
      });
    },
  },
  {
    name: "content_ops_evaluate_image_quality",
    title: "Evaluate Image Quality",
    description:
      "Apply hard blocks and the 100-point five-layer image quality model without granting aesthetic approval.",
    inputSchema: z
      .object({
        ...base,
        asset_id: z.string().regex(/^AST-[A-Z0-9-]+$/),
        role: z.enum(["DIRECTION_CANDIDATE", "FORMAL_ASSET"]),
        ratings: qualityRatings,
        hard_blocks: z.array(z.string().min(1)),
        created_at: z.iso.datetime(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocal,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const runId = String(input.run_id);
      const report = evaluateImageQuality({
        ratings: input.ratings as Record<QualityDimension, number>,
        hardBlocks: strings(input.hard_blocks),
        role: input.role as never,
      });
      const artifact = {
        report_id: `IQR-${String(input.asset_id).replace(/^AST-/u, "")}`,
        project_id: projectId,
        content_id: input.content_id,
        asset_id: input.asset_id,
        asset_role:
          input.role === "DIRECTION_CANDIDATE" ? "DIRECTION_CANDIDATE" : "FORMAL_FIRST_PAGE",
        layers: {
          authenticity_and_integrity: report.result === "BLOCKED" ? "BLOCKED" : "PASS",
          mechanical: report.result === "FAIL" ? "FAIL" : "PASS",
          visual: report.result === "FAIL" ? "FAIL" : "PASS",
          mode_and_project_fit: report.result === "FAIL" ? "FAIL" : "PASS",
          operator_aesthetic: "PENDING",
        },
        dimensions: report.dimensions,
        total_score: report.total_score,
        threshold: report.threshold,
        hard_blocks: input.hard_blocks,
        core_dimension_floor_met: report.core_dimension_floor_met,
        operator_approval_required: true,
        result: report.result,
        run_id: runId,
        schema_version: "1.0.0",
        created_at: input.created_at,
      };
      await context.validateSchema("image-quality-report", artifact);
      const file = await context.writeImageProductionJson(
        projectId,
        runId,
        `${artifact.report_id}.json`,
        artifact,
      );
      return envelope(
        report.result === "PASS_PENDING_OPERATOR" ? "AWAITING_APPROVAL" : "BLOCKED",
        `Image quality result: ${report.result}.`,
        {
          project_id: projectId,
          run_id: runId,
          created_records: 1,
          artifacts: [file],
          details: { ...report, aesthetic_approval_granted: false },
        },
      );
    },
  },
  {
    name: "content_ops_submit_visual_feedback",
    title: "Submit Visual Feedback",
    description:
      "Record minimum-scope visual feedback locally; feedback never becomes a long-term rule automatically.",
    inputSchema: z
      .object({
        ...base,
        event_id: z.string().regex(/^VFE-[A-Z0-9-]+$/),
        feedback_class: z.enum([
          "QUALITY_DEFECT",
          "PRODUCTION_FEEDBACK",
          "VISUAL_PREFERENCE",
          "PROJECT_OR_DOMAIN_CONSTRAINT",
        ]),
        scope: z.enum([
          "CURRENT_ELEMENT",
          "CURRENT_PAGE",
          "CURRENT_SET",
          "CURRENT_PROJECT",
          "INDUSTRY_PACK",
          "GLOBAL_USER_PREFERENCE",
        ]),
        target_type: z.enum(["ELEMENT", "PAGE", "SET", "PROJECT", "INDUSTRY_PACK", "GLOBAL"]),
        target_id: z.string().min(1),
        statement: z.string().min(1),
        is_tool_or_system_defect: z.boolean(),
        created_at: z.iso.datetime(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocal,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const runId = String(input.run_id);
      const artifact = {
        event_id: input.event_id,
        project_id: projectId,
        content_id: input.content_id,
        feedback_class: input.feedback_class,
        scope: input.scope,
        target_type: input.target_type,
        target_id: input.target_id,
        statement: input.statement,
        is_tool_or_system_defect: input.is_tool_or_system_defect,
        long_term_rule_candidate: false,
        creates_long_term_rule: false,
        source: "OPERATOR_FEEDBACK",
        run_id: runId,
        schema_version: "1.0.0",
        created_at: input.created_at,
      };
      await context.validateSchema("visual-feedback-event", artifact);
      const proposal = proposeVisualRule({
        eventId: String(input.event_id),
        feedbackClass: input.feedback_class as never,
        requestedScope: input.scope as never,
        isToolOrSystemDefect: Boolean(input.is_tool_or_system_defect),
        statement: String(input.statement),
      });
      const file = await context.writeImageProductionJson(
        projectId,
        runId,
        `${String(input.event_id)}.json`,
        artifact,
      );
      return envelope(
        "SUCCESS",
        "Visual feedback recorded; any reusable rule still requires a separate candidate and explicit confirmation.",
        {
          project_id: projectId,
          run_id: runId,
          created_records: 1,
          artifacts: [file],
          details: { rule_proposal: proposal, long_term_rule_created: false },
        },
      );
    },
  },
  {
    name: "content_ops_list_visual_rules",
    title: "List Visual Rules",
    description:
      "Read the current project visual rule index, including disabled and superseded history when retained.",
    inputSchema: z.object(base).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const rules = await context.readImageProductionJson(
        String(input.project_id),
        String(input.run_id),
        "visual-rules.json",
      );
      return envelope("SUCCESS", "Visual rule index read locally.", {
        project_id: String(input.project_id),
        run_id: String(input.run_id),
        details: { rules: rules ?? [], remote_writes: 0 },
      });
    },
  },
  {
    name: "content_ops_confirm_visual_rule",
    title: "Confirm Visual Rule",
    description:
      "Promote one eligible Rule Candidate to an Operator-confirmed, versioned project rule.",
    inputSchema: z
      .object({
        ...base,
        rule_id: z.string().regex(/^VR-[A-Z0-9-]+$/),
        source_event_id: z.string().regex(/^VFE-[A-Z0-9-]+$/),
        source_candidate_id: z.string().regex(/^VRC-[A-Z0-9-]+$/),
        rule_statement: z.string().min(1),
        rationale: z.string().min(1),
        scope: z.enum([
          "CURRENT_ELEMENT",
          "CURRENT_PAGE",
          "CURRENT_SET",
          "CURRENT_PROJECT",
          "INDUSTRY_PACK",
          "GLOBAL_USER_PREFERENCE",
        ]),
        rule_type: z.enum([
          "MUST",
          "MUST_NOT",
          "PREFER",
          "AVOID",
          "REFERENCE_POSITIVE",
          "REFERENCE_NEGATIVE",
        ]),
        positive_examples: z.array(z.string().min(1)),
        negative_examples: z.array(z.string().min(1)),
        allowed_exceptions: z.array(z.string().min(1)),
        confirmed_at: z.iso.datetime(),
        explicit_operator_confirmation: z.literal(true),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocal,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const runId = String(input.run_id);
      const artifact = {
        rule_id: input.rule_id,
        project_id: projectId,
        source_event_id: input.source_event_id,
        source_candidate_id: input.source_candidate_id,
        rule_statement: input.rule_statement,
        rationale: input.rationale,
        scope: input.scope,
        rule_type: input.rule_type,
        positive_examples: input.positive_examples,
        negative_examples: input.negative_examples,
        allowed_exceptions: input.allowed_exceptions,
        confirmed_by_user: true,
        status: "ACTIVE",
        version: 1,
        supersedes_version: null,
        run_id: runId,
        schema_version: "1.0.0",
        created_at: input.confirmed_at,
        updated_at: input.confirmed_at,
      };
      await context.validateSchema("visual-rule", artifact);
      const file = await context.writeImageProductionJson(
        projectId,
        runId,
        `${String(input.rule_id)}.json`,
        artifact,
      );
      return envelope("SUCCESS", "Visual rule explicitly confirmed and versioned.", {
        project_id: projectId,
        run_id: runId,
        created_records: 1,
        artifacts: [file],
        details: { rule: artifact },
      });
    },
  },
  {
    name: "content_ops_update_visual_rule",
    title: "Update Visual Rule",
    description: "Create a new rule version or disable an existing rule without deleting history.",
    inputSchema: z
      .object({
        ...base,
        rule_id: z.string().regex(/^VR-[A-Z0-9-]+$/),
        current_version: z.number().int().positive(),
        next_version: z.number().int().positive(),
        action: z.enum(["UPDATE", "DISABLE", "FORGET"]),
        rule_statement: z.string().min(1),
        updated_at: z.iso.datetime(),
        explicit_operator_confirmation: z.literal(true),
      })
      .strict()
      .superRefine((value, ctx) => {
        if (value.next_version !== value.current_version + 1)
          ctx.addIssue({ code: "custom", message: "next_version must increment by one" });
      }),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocal,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const runId = String(input.run_id);
      const artifact = {
        rule_id: input.rule_id,
        action: input.action,
        previous_version: input.current_version,
        version: input.next_version,
        rule_statement: input.rule_statement,
        status: input.action === "UPDATE" ? "ACTIVE" : "DISABLED",
        history_deleted: false,
        forgotten_from_active_resolution: input.action === "FORGET",
        run_id: runId,
        updated_at: input.updated_at,
      };
      const file = await context.writeImageProductionJson(
        projectId,
        runId,
        `${String(input.rule_id)}-v${String(input.next_version)}.json`,
        artifact,
      );
      return envelope(
        "SUCCESS",
        input.action === "FORGET"
          ? "Rule forgotten from active resolution; audit history retained."
          : "Visual rule version updated without deleting history.",
        {
          project_id: projectId,
          run_id: runId,
          updated_records: 1,
          artifacts: [file],
          details: { rule_update: artifact },
        },
      );
    },
  },
  {
    name: "content_ops_plan_full_set_production",
    title: "Plan Full Set Production",
    description: "Plan the final page batch and preserve the G4 gate for pages after the first.",
    inputSchema: z
      .object({
        ...base,
        page_count: z.number().int().min(1).max(20),
        g4_approved: z.boolean(),
        direction_candidate_count: z.number().int().min(0).max(3),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(_context, input) {
      await Promise.resolve();
      const plan = planProductionBatch({
        pageCount: Number(input.page_count),
        g4Approved: Boolean(input.g4_approved),
        directionCandidateCount: Number(input.direction_candidate_count),
      });
      return envelope("SUCCESS", "Full-set batch planned without producing any image.", {
        project_id: String(input.project_id),
        run_id: String(input.run_id),
        details: { ...plan, remote_writes: 0 },
      });
    },
  },
  {
    name: "content_ops_evaluate_group_quality",
    title: "Evaluate Group Quality",
    description:
      "Evaluate whole-set consistency, difference, duplicate sources, and contact-sheet readiness without approving G5.",
    inputSchema: z
      .object({
        ...base,
        visual_mode: visualMode,
        asset_ids: z.array(z.string().regex(/^AST-[A-Z0-9-]+$/)).min(2),
        visual_signatures: z.array(z.string().min(1)).min(2),
        subject_identity_keys: z.array(z.string().min(1)).min(1),
        source_checksums: z.array(z.string().regex(HASH)).min(2),
        contact_sheet_ref: z
          .string()
          .min(1)
          .refine((item) => !item.startsWith("/") && !item.includes("..")),
        created_at: z.iso.datetime(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocal,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const runId = String(input.run_id);
      const result = evaluateGroupQuality({
        assetIds: input.asset_ids as string[],
        visualSignatures: input.visual_signatures as string[],
        subjectIdentityKeys: input.subject_identity_keys as string[],
        sourceChecksums: input.source_checksums as string[],
      });
      const check = (status: string) => ({ status, notes: [] });
      const artifact = {
        report_id: `GQR-${String(input.content_id)}-${String(input.run_id).slice(-6)}`,
        project_id: projectId,
        content_id: input.content_id,
        visual_mode: input.visual_mode,
        asset_ids: input.asset_ids,
        system_consistency: check(result.system_consistency),
        subject_consistency: check(result.subject_consistency),
        page_difference: check(result.page_difference),
        near_duplicate_pairs: result.near_duplicate_pairs,
        source_reuse_findings: result.near_duplicate_pairs.length
          ? ["Exact source checksum was reused."]
          : [],
        contact_sheet_ref: input.contact_sheet_ref,
        hard_blocks: result.result === "FAIL" ? ["GROUP_CONSISTENCY_OR_DIFFERENCE_FAILED"] : [],
        operator_approval_required: true,
        result: result.result,
        run_id: runId,
        schema_version: "1.0.0",
        created_at: input.created_at,
      };
      await context.validateSchema("group-quality-report", artifact);
      const file = await context.writeImageProductionJson(
        projectId,
        runId,
        `${artifact.report_id}.json`,
        artifact,
      );
      return envelope(
        result.result === "PASS_PENDING_OPERATOR" ? "AWAITING_APPROVAL" : "BLOCKED",
        `Group quality result: ${result.result}.`,
        {
          project_id: projectId,
          run_id: runId,
          created_records: 1,
          artifacts: [file],
          details: { ...result, g5_approved: false },
        },
      );
    },
  },
] as const;
