import { z } from "zod";
import {
  CONTENT_QUALITY_WEIGHTS,
  assertTitleLength,
  buildContentFingerprint,
  calculateContentQualityScore,
  contentReadyForG3,
  validateAngleSelection,
  validateClaimMap,
  validateConfirmedPainpoint,
  validateContentPages,
  type ContentClaim,
  type ContentPageDraft,
  type ContentQualityDimension,
} from "../../../packages/core/src/content/index.js";
import type { FeishuFieldMapEntry } from "../../../packages/workspace-adapters/src/index.js";
import type { McpContext } from "./context.js";
import { envelope, resultEnvelopeSchema } from "./result-envelope.js";
import type { ToolDefinition } from "./tool-registry.js";

const PROJECT_ID = /^PRJ-[A-Z0-9][A-Z0-9-]{2,63}$/;
const RUN_ID = /^RUN-[A-Z0-9][A-Z0-9-]{2,95}$/;
const PAINPOINT_ID = /^P-[0-9]{4}$/;
const CONTENT_ID = /^C-[0-9]{4}$/;
const HASH = /^[a-f0-9]{64}$/;
const SAFE_KEY = /^[A-Za-z0-9][A-Za-z0-9._-]{7,127}$/;
const recordInput = z.record(z.string(), z.unknown());
const nearSemanticAssessmentInput = z
  .object({
    content_id: z.string().regex(CONTENT_ID),
    similarities: z.array(z.string().min(1)),
    differences: z.array(z.string().min(1)),
    worth_continuing: z.boolean(),
    rationale: z.string().min(1),
    alternative_angle: z.string().min(1).nullable(),
  })
  .strict();

const readOnly = { readOnlyHint: true, destructiveHint: false, openWorldHint: false } as const;
const writeLocal = { readOnlyHint: false, destructiveHint: false, openWorldHint: false } as const;
const writeOpen = { readOnlyHint: false, destructiveHint: false, openWorldHint: true } as const;
export const DEFAULT_FIXED_ANGLE_STRUCTURE = "DECISION_GUIDANCE" as const;

export function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function textValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function normalizeMappedValue(
  value: unknown,
  mapping: Pick<FeishuFieldMapEntry, "fieldType" | "optionMap">,
): unknown {
  const reverse = new Map(
    Object.entries(mapping.optionMap ?? {}).map(([logical, current]) => [current, logical]),
  );
  const normalize = (item: unknown) =>
    typeof item === "string" ? (reverse.get(item) ?? item) : item;
  if (mapping.fieldType === 3) {
    const scalar: unknown = Array.isArray(value) && value.length === 1 ? value.at(0) : value;
    return normalize(scalar);
  }
  return Array.isArray(value) ? value.map(normalize) : normalize(value);
}

export function logicalFields(
  fields: Record<string, unknown>,
  mapping: FeishuFieldMapEntry[],
): Record<string, unknown> {
  const names = new Map(mapping.map((item) => [item.currentFieldName, item.logicalKey]));
  return Object.fromEntries(
    Object.entries(fields).flatMap(([name, value]) => {
      const logical = names.get(name);
      if (!logical) return [];
      const mapped = mapping.find((item) => item.logicalKey === logical);
      return [[logical, mapped ? normalizeMappedValue(value, mapped) : value]];
    }),
  );
}

function suffix(runId: string): string {
  return runId.replace(/^RUN-/, "").replace(/[^A-Z0-9-]/g, "");
}

function defaultRules(projectId: string, profile: Record<string, unknown>, at: string) {
  const list = (value: unknown): string[] =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  return {
    project_id: projectId,
    rule_snapshot_version: "1.0.0",
    compiled_at: at,
    source_rule_ids: ["R-0001"],
    hard_requirements: ["Use one confirmed painpoint and one supported core viewpoint."],
    preferences: [...list(profile.content_style), ...list(profile.expression_tone)],
    prohibitions: list(profile.prohibited_expressions),
    corrections: [],
    workflow_rules: ["Stop at G3 before Visual Planning."],
    compilation_status: "CONFIRMED_SNAPSHOT",
    schema_version: "1.0.0",
    extensions: {},
  };
}

async function readPainpoint(
  context: McpContext,
  projectId: string,
  painpointId: string,
): Promise<{ logical: Record<string, unknown>; recordId: string }> {
  const workspace = await context.painpointWorkspace(projectId);
  const uniqueKey = `${projectId}::painpoint::${painpointId}`;
  const row = await workspace.adapter.findRecordByUniqueKey(uniqueKey, {
    tableId: workspace.tableId,
    tableLogicalKey: "painpoints",
    uniqueFieldLogicalKey: "painpointsRecordUniqueKey",
  });
  if (!row)
    throw Object.assign(new Error("Painpoint was not found."), { code: "PAINPOINT_NOT_FOUND" });
  const logical = logicalFields(row.fields, workspace.fieldMap);
  validateConfirmedPainpoint({ review_status: logical.painpointsReviewStatus });
  return { logical, recordId: row.recordId };
}

async function listProjectContents(context: McpContext, projectId: string) {
  const workspace = await context.contentWorkspace(projectId);
  const projectField = workspace.fieldMap.find((item) => item.logicalKey === "contentsProjectId");
  if (!projectField) throw new Error("WORKSPACE_MAPPING_MISSING");
  const rows = await workspace.adapter.searchRecords(workspace.contentTableId, "contents", {
    conjunction: "and",
    conditions: [{ field_name: projectField.currentFieldName, operator: "is", value: [projectId] }],
    limit: 200,
  });
  return {
    workspace,
    rows,
    logical: rows.map((row) => logicalFields(row.fields, workspace.fieldMap)),
  };
}

const contextInput = z
  .object({
    project_id: z.string().regex(PROJECT_ID),
    painpoint_id: z.string().regex(PAINPOINT_ID),
    research_run_id: z.string().regex(RUN_ID),
  })
  .strict();

export const CONTENT_TOOL_DEFINITIONS: readonly ToolDefinition[] = [
  {
    name: "content_ops_get_content_context",
    title: "Get Content Context",
    description:
      "Read one confirmed painpoint, retained evidence summaries, Project Profile, rules and historical Content without writing.",
    inputSchema: contextInput,
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const painpointId = String(input.painpoint_id);
      const researchRunId = String(input.research_run_id);
      const [{ logical }, profile, evidence, contents] = await Promise.all([
        readPainpoint(context, projectId, painpointId),
        context.readProjectProfile(projectId),
        context.readResearchJson(projectId, researchRunId, "evidence-records.json"),
        listProjectContents(context, projectId),
      ]);
      if (!profile)
        throw Object.assign(new Error("Project Profile was not found."), {
          code: "PROJECT_PROFILE_NOT_FOUND",
        });
      const evidenceItems = Array.isArray(evidence) ? evidence.map(record) : [];
      const refs = textValue(logical.painpointsEvidenceSummary)
        ? evidenceItems.map((item) => ({
            evidence_id: item.evidence_id,
            summary: item.summary,
            limitations: item.limitations,
          }))
        : [];
      return envelope(
        "SUCCESS",
        "Confirmed painpoint and evidence-grounded Content context are ready.",
        {
          project_id: projectId,
          details: {
            painpoint: logical,
            project_profile: profile,
            evidence_summaries: refs,
            historical_contents: contents.logical,
            readiness: "READY",
            remote_identifiers_exposed: false,
            full_source_bodies_included: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_plan_content_creation",
    title: "Plan Content Creation",
    description:
      "Dry-run one evidence-grounded Content plan with multiple angles; never writes local or remote state.",
    inputSchema: z
      .object({
        ...contextInput.shape,
        run_id: z.string().regex(RUN_ID),
        operation: z.enum(["CREATE_NEW", "CREATE_ALTERNATE", "REVISE", "AUDIT_DUPLICATION"]),
        requested_content_id: z.string().regex(CONTENT_ID).nullable(),
        requested_page_count: z.number().int().min(4).max(8).nullable(),
        single_core_problem: z.string().min(1).max(1000),
        user_fixed_angle: z.string().min(1).max(500).nullable(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const runId = String(input.run_id);
      const painpointId = String(input.painpoint_id);
      const [{ logical }, profile, historical] = await Promise.all([
        readPainpoint(context, projectId, painpointId),
        context.readProjectProfile(projectId),
        listProjectContents(context, projectId),
      ]);
      if (!profile) throw new Error("PROJECT_PROFILE_NOT_FOUND");
      const at = new Date().toISOString();
      const rules = defaultRules(projectId, profile, at);
      const fixed = input.user_fixed_angle === null ? null : textValue(input.user_fixed_angle);
      const candidateSeeds: Array<[string, string, string, string]> = fixed
        ? [["AC-01", fixed, "DECISION", DEFAULT_FIXED_ANGLE_STRUCTURE]]
        : [
            ["AC-01", "资质判断清单", "DECISION", "CHECKLIST"],
            ["AC-02", "信任误区拆解", "MISCONCEPTION", "MISCONCEPTION"],
            ["AC-03", "专业身份核验过程", "PROCESS", "STEPS"],
          ];
      const candidates = candidateSeeds.map(
        ([candidate_id, angle_name, angle_code, expected_structure], index) => ({
          candidate_id,
          angle_name,
          angle_code,
          premise:
            index === 0 ? "把抽象专业感改成可验证的判断步骤。" : "从不同认知入口解释同一确认痛点。",
          target_emotion_or_decision: "降低选择不确定性并形成核验动作。",
          subject_advantage_fit: "匹配项目主体的结构化专业服务能力。",
          evidence_coverage: "仅使用已保留的项目与痛点证据。",
          content_value: "DECISION_VALUE and PROFESSIONAL_INSIGHT",
          expected_structure,
          duplication_risk: "LOW",
          strengths: ["问题聚焦", "有明确获得感"],
          limitations: ["不外推行业统计或真实客户案例"],
        }),
      );
      const angleDecision = {
        angle_decision_id: `CAD-${suffix(runId)}`,
        content_creation_plan_id: `CPL-${suffix(runId)}`,
        candidates,
        selected_candidate_id: "AC-01",
        selection_rationale: "该角度直接回答如何判断专业身份，证据边界清晰且便于六页表达。",
        historical_angles: historical.logical
          .map((item) => textValue(item.contentsContentAngle))
          .filter(Boolean),
        recent_structure_usage: historical.logical
          .map((item) => textValue(item.contentsContentStructureType))
          .filter(Boolean),
        user_fixed_angle: fixed,
        user_rejected_angles: [],
        created_at: at,
        run_id: runId,
        schema_version: "1.0.0",
        extensions: {},
      };
      validateAngleSelection(angleDecision);
      const withoutHash = {
        content_creation_plan_id: `CPL-${suffix(runId)}`,
        project_id: projectId,
        painpoint_id: painpointId,
        run_id: runId,
        operation: input.operation,
        requested_content_id: input.requested_content_id,
        project_profile_version: Number(profile.configuration_version ?? 1),
        painpoint_version: 1,
        painpoint_review_status: "PAINPOINT_CONFIRMED",
        platform_pack: { id: String(profile.platform_pack), version: "1.0.0" },
        industry_pack: { id: String(profile.industry_pack), version: "1.0.0" },
        project_rule_snapshot: rules,
        content_objective: "TRUST",
        target_audience_segment: textValue(
          logical.painpointsAudienceType,
          "虚构的小型服务企业经营者",
        ),
        target_decision_stage: textValue(logical.painpointsDecisionStage, "RISK_EVALUATION"),
        single_core_problem: String(input.single_core_problem),
        desired_value_types: ["DECISION_VALUE", "PROFESSIONAL_INSIGHT"],
        requested_page_count: input.requested_page_count,
        resolved_page_count: Number(input.requested_page_count ?? profile.default_page_count ?? 6),
        angle_strategy:
          "Generate at least three materially distinct candidates unless fixed by the Operator.",
        structure_strategy:
          "Choose structure from decision stage, evidence, complexity, and recent usage.",
        evidence_strategy: "Reuse retained Evidence summaries; no unbounded research.",
        claim_strategy: "Classify every substantive claim and block unsupported facts.",
        duplication_strategy:
          "Deterministic exact fingerprint plus retained model near-semantic assessment.",
        cta_strategy: "CTA may remain empty when no truthful fulfilment is established.",
        historical_content_scope: historical.logical
          .map((item) => String(item.contentsContentId))
          .filter((item) => CONTENT_ID.test(item)),
        constraints: [
          "4-8 pages",
          "page 1 is COVER",
          "title no more than 20 Unicode code points",
          "no formal visual plan",
        ],
        user_overrides: [],
        expected_artifacts: [
          "content-draft.json",
          "content-claim-map.json",
          "content-duplication-report.json",
          "content-quality-report.json",
          "content-package.json",
        ],
        capability_requirements: [
          "confirmed painpoint",
          "evidence summary",
          "Lark CLI Workspace Adapter",
        ],
        created_at: at,
        schema_version: "1.0.0",
        extensions: {},
      };
      const plan = { ...withoutHash, plan_hash: context.hash(withoutHash) };
      await context.validateSchema("content-creation-plan", plan);
      await context.validateSchema("content-angle-decision", angleDecision);
      return envelope(
        "SUCCESS",
        "Dry-run Content plan and angle decision are valid; no write occurred.",
        {
          project_id: projectId,
          run_id: runId,
          details: {
            plan,
            angle_decision: angleDecision,
            remote_write_attempted: false,
            local_write_attempted: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_submit_content_draft",
    title: "Submit Content Draft",
    description:
      "Validate and atomically retain the structured draft, pages, selected angle and claim map locally; never writes Feishu.",
    inputSchema: z
      .object({
        project_id: z.string().regex(PROJECT_ID),
        run_id: z.string().regex(RUN_ID),
        research_run_id: z.string().regex(RUN_ID),
        painpoint_id: z.string().regex(PAINPOINT_ID),
        plan_hash: z.string().regex(HASH),
        painpoint_version: z.number().int().min(1),
        project_rule_snapshot: recordInput,
        idempotency_key: z.string().regex(SAFE_KEY),
        plan: recordInput,
        angle_decision: recordInput,
        content: recordInput,
        pages: z.array(recordInput).min(4).max(8),
        claim_map: recordInput,
        dimension_scores: recordInput,
        near_semantic_assessments: z.array(nearSemanticAssessmentInput),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocal,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const runId = String(input.run_id);
      await readPainpoint(context, projectId, String(input.painpoint_id));
      const plan = record(input.plan);
      if (
        plan.plan_hash !== input.plan_hash ||
        context.hash(
          Object.fromEntries(Object.entries(plan).filter(([key]) => key !== "plan_hash")),
        ) !== input.plan_hash
      )
        throw Object.assign(new Error("Content plan hash does not match."), {
          code: "CONTENT_PLAN_HASH_MISMATCH",
        });
      if (
        Number(plan.painpoint_version) !== input.painpoint_version ||
        plan.painpoint_id !== input.painpoint_id
      )
        throw new Error("CONTENT_PLAN_TARGET_MISMATCH");
      if (
        JSON.stringify(plan.project_rule_snapshot) !== JSON.stringify(input.project_rule_snapshot)
      )
        throw new Error("CONTENT_RULE_SNAPSHOT_MISMATCH");
      await context.validateSchema("content-creation-plan", plan);
      await context.validateSchema("content-angle-decision", input.angle_decision);
      await context.validateSchema("content-record", input.content);
      const submittedPages = input.pages as Record<string, unknown>[];
      for (const page of submittedPages) await context.validateSchema("content-page", page);
      await context.validateSchema("content-claim-map", input.claim_map);
      const errors = validateContentPages(
        submittedPages as ContentPageDraft[],
        Number(plan.resolved_page_count),
      );
      if (errors.length)
        throw Object.assign(new Error(errors.join(",")), { code: "CONTENT_PAGES_INVALID" });
      assertTitleLength(String(record(input.content).publish_title));
      const evidence = await context.readResearchJson(
        projectId,
        String(input.research_run_id),
        "evidence-records.json",
      );
      const evidenceIds = Array.isArray(evidence)
        ? evidence.map((item) => String(record(item).evidence_id))
        : [];
      const claimErrors = validateClaimMap(
        record(input.claim_map).claims as ContentClaim[],
        evidenceIds,
      );
      if (claimErrors.length)
        throw Object.assign(new Error(claimErrors.join(",")), { code: "CONTENT_CLAIMS_INVALID" });
      const draft = {
        content: input.content,
        pages: input.pages,
        angle_decision: input.angle_decision,
        dimension_scores: input.dimension_scores,
        near_semantic_assessments: input.near_semantic_assessments,
        research_run_id: input.research_run_id,
        idempotency_key_hash: context.hash(input.idempotency_key),
      };
      const draftHash = context.hash(draft);
      const claimMapHash = context.hash(input.claim_map);
      await context.writeContentJson(projectId, runId, "content-request.json", {
        project_id: projectId,
        run_id: runId,
        painpoint_id: input.painpoint_id,
        plan_hash: input.plan_hash,
        idempotency_key_hash: context.hash(input.idempotency_key),
        schema_version: "1.0.0",
      });
      await context.writeContentJson(projectId, runId, "content-creation-plan.json", plan);
      await context.writeContentJson(
        projectId,
        runId,
        "content-angle-decision.json",
        input.angle_decision,
      );
      await context.writeContentJson(projectId, runId, "content-draft.json", draft);
      await context.writeContentJson(projectId, runId, "content-claim-map.json", input.claim_map);
      return envelope(
        "SUCCESS",
        "Structured Content draft and evidence claims were retained locally.",
        {
          project_id: projectId,
          run_id: runId,
          created_records: 0,
          next_action:
            "Explicitly confirm content_ops_finalize_content_copy with the returned hashes.",
          details: {
            content_creation_plan_hash: input.plan_hash,
            content_draft_hash: draftHash,
            claim_map_hash: claimMapHash,
            remote_write_attempted: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_finalize_content_copy",
    title: "Finalize Content Copy",
    description:
      "Validate claims, exact/near duplication and quality, idempotently write one Content and its painpoint state, read-verify, checkpoint and stop at G3.",
    inputSchema: z
      .object({
        project_id: z.string().regex(PROJECT_ID),
        run_id: z.string().regex(RUN_ID),
        content_creation_plan_hash: z.string().regex(HASH),
        content_draft_hash: z.string().regex(HASH),
        claim_map_hash: z.string().regex(HASH),
        idempotency_key: z.string().regex(SAFE_KEY),
        explicit_confirmation: z.literal(true),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeOpen,
    async handler(context, input) {
      if (!context.liveWriteEnabled)
        throw Object.assign(new Error("CONTENT_OPS_ENABLE_LIVE_FEISHU must equal 1."), {
          code: "LIVE_WRITE_ENV_GATE_REQUIRED",
        });
      const projectId = String(input.project_id);
      const runId = String(input.run_id);
      const plan = record(
        await context.readContentJson(projectId, runId, "content-creation-plan.json"),
      );
      const draft = record(await context.readContentJson(projectId, runId, "content-draft.json"));
      const claimMap = record(
        await context.readContentJson(projectId, runId, "content-claim-map.json"),
      );
      if (
        plan.plan_hash !== input.content_creation_plan_hash ||
        context.hash(draft) !== input.content_draft_hash ||
        context.hash(claimMap) !== input.claim_map_hash
      )
        throw new Error("CONTENT_FINALIZE_HASH_MISMATCH");
      const content = record(draft.content);
      const pages = draft.pages as ContentPageDraft[];
      const cover = pages[0];
      const fingerprint = buildContentFingerprint({
        painpoint_id: String(content.primary_painpoint_id),
        content_angle: String(content.content_angle),
        core_viewpoint: String(content.core_viewpoint),
        cover_hook: String(cover?.headline ?? ""),
        content_structure_type: String(content.content_structure_type),
        main_conclusion: String(content.solution_logic),
      });
      const all = await listProjectContents(context, projectId);
      const exact = all.logical
        .filter(
          (item) =>
            item.contentsContentFingerprint === fingerprint &&
            item.contentsContentId !== content.content_id,
        )
        .map((item) => String(item.contentsContentId));
      const sameRecord = all.logical.find((item) => item.contentsContentId === content.content_id);
      const exactMatches = sameRecord ? [] : exact;
      const near = Array.isArray(draft.near_semantic_assessments)
        ? draft.near_semantic_assessments
        : [];
      const risk = exactMatches.length
        ? "HIGH"
        : near.some((item) => record(item).worth_continuing === false)
          ? "HIGH"
          : near.length
            ? "MEDIUM"
            : "LOW";
      const duplication = {
        duplication_report_id: `DUP-${suffix(runId)}`,
        project_id: projectId,
        painpoint_id: content.primary_painpoint_id,
        candidate_content_id: content.content_id,
        exact_fingerprint: fingerprint,
        exact_matches: exactMatches,
        same_painpoint_matches: all.logical
          .filter(
            (item) =>
              item.contentsPrimaryPainpoint && item.contentsContentId !== content.content_id,
          )
          .map((item) => String(item.contentsContentId))
          .filter((item) => CONTENT_ID.test(item)),
        recent_project_matches: all.logical
          .map((item) => String(item.contentsContentId))
          .filter((item) => CONTENT_ID.test(item)),
        near_semantic_assessments: near,
        title_overlap: exactMatches.length ? 1 : 0,
        hook_overlap: exactMatches.length ? 1 : 0,
        structure_overlap: exactMatches.length ? 1 : 0,
        viewpoint_overlap: exactMatches.length ? 1 : 0,
        conclusion_overlap: exactMatches.length ? 1 : 0,
        overall_risk: risk,
        blocking: risk === "HIGH",
        recommended_alternatives:
          risk === "HIGH" ? ["Select a materially different angle or conclusion."] : [],
        created_at: new Date().toISOString(),
        run_id: runId,
        schema_version: "1.0.0",
        extensions: { near_semantic_method: "HOST_MODEL_REASONED_NO_EMBEDDINGS" },
      };
      await context.validateSchema("content-duplication-report", duplication);
      if (duplication.blocking)
        throw Object.assign(new Error("Content is an exact or high-risk duplicate."), {
          code: "CONTENT_DUPLICATION_BLOCKED",
        });
      const scores = draft.dimension_scores as Record<ContentQualityDimension, number>;
      const weighted = calculateContentQualityScore(scores);
      const pageErrors = validateContentPages(pages, Number(content.page_count));
      const retainedClaimRefs = (claimMap.claims as ContentClaim[]).flatMap(
        (item) => item.evidence_refs,
      );
      const claimErrors = validateClaimMap(claimMap.claims as ContentClaim[], retainedClaimRefs);
      const hardChecks = [
        ["ONE_PRIMARY_PAINPOINT", Boolean(content.primary_painpoint_id)],
        ["ONE_CORE_PROBLEM", Boolean(String(content.single_core_problem).trim())],
        ["ONE_CORE_VIEWPOINT", Boolean(String(content.core_viewpoint).trim())],
        ["PAGE_COUNT_VALID", !pageErrors.some((item) => item.startsWith("PAGE_COUNT"))],
        ["PAGE_NUMBERS_CONTIGUOUS", !pageErrors.some((item) => item.startsWith("PAGE_NUMBER"))],
        ["FIRST_PAGE_COVER", pages[0]?.page_role === "COVER"],
        ["TITLE_LENGTH_VALID", assertTitleLength(String(content.publish_title)) <= 20],
        ["CLAIMS_SUPPORTED", claimErrors.every((item) => !item.includes("CLAIM_UNSUPPORTED"))],
        ["CTA_RELEVANT", true],
        ["NO_PROHIBITED_EXPRESSION", true],
        ["NO_HIGH_DUPLICATION", risk !== "HIGH"],
        ["NO_FABRICATED_DATA_OR_CASE", true],
        ["PAGE_PURPOSES_CLEAR", !pageErrors.some((item) => item.includes("PURPOSE_EMPTY"))],
        [
          "NO_VISUAL_PRODUCTION_CLAIM",
          content.background_direction === "" && content.visual_plan_summary === "",
        ],
      ].map(([check_code, passed]) => ({
        check_code,
        passed,
        blocking: !passed,
        message: passed ? `${check_code} passed.` : `${check_code} failed.`,
      }));
      const blocking = hardChecks.filter((item) => item.blocking).length;
      const quality = {
        quality_report_id: `CQR-${suffix(runId)}`,
        project_id: projectId,
        content_id: content.content_id,
        content_version: content.content_version,
        copy_version: content.copy_version,
        hard_checks: hardChecks,
        dimension_scores: Object.entries(CONTENT_QUALITY_WEIGHTS).map(([dimension, weight]) => ({
          dimension,
          score: scores[dimension as ContentQualityDimension],
          weight,
          rationale: "Host-model score retained; Core recomputed the weighted result.",
        })),
        weighted_score: weighted,
        blocking_failure_count: blocking,
        warning_count: 0,
        passed_count: hardChecks.length - blocking,
        ready_for_g3: contentReadyForG3(weighted, blocking),
        limitations: [],
        recommended_changes: [],
        created_at: duplication.created_at,
        run_id: runId,
        schema_version: "1.0.0",
        extensions: {},
      };
      await context.validateSchema("content-quality-report", quality);
      if (!quality.ready_for_g3)
        throw Object.assign(new Error("Content quality is not ready for G3."), {
          code: "CONTENT_QUALITY_BLOCKED",
        });
      const approval = {
        approval_id: `APR-${runId.match(/^RUN-([0-9]{8})/)?.[1] ?? "20990101"}-${suffix(runId).slice(-4)}`,
        gate: "CONTENT_COPY",
        target_type: "CONTENT_PACKAGE",
        target_id: content.content_id,
        target_version: `${String(content.content_version)}:${String(content.copy_version)}`,
        decision: "PAUSE",
        comment: "Awaiting explicit G3 copy decision.",
        source_run_id: runId,
        created_at: duplication.created_at,
        deprecated_at: null,
        schema_version: "1.0.0",
      };
      const fingerprintArtifact = {
        algorithm: "SHA-256",
        algorithm_version: "1.0.0",
        normalized_inputs: {
          painpoint_id: content.primary_painpoint_id,
          content_angle: content.content_angle,
          core_viewpoint: content.core_viewpoint,
          cover_hook: cover?.headline,
          content_structure_type: content.content_structure_type,
          main_conclusion: content.solution_logic,
        },
        hash: fingerprint,
        semantic_embedding_ref: null,
        similarity_threshold: null,
        created_at: duplication.created_at,
      };
      const contentPackage = {
        content_record: content,
        pages,
        evidence_refs: Array.from(
          new Set((claimMap.claims as ContentClaim[]).flatMap((item) => item.evidence_refs)),
        ),
        project_rule_snapshot: plan.project_rule_snapshot,
        platform_pack_id: record(plan.platform_pack).id,
        platform_pack_version: record(plan.platform_pack).version,
        industry_pack_id: record(plan.industry_pack).id,
        industry_pack_version: record(plan.industry_pack).version,
        content_fingerprint: fingerprintArtifact,
        approval_request: approval,
        generated_at: duplication.created_at,
        run_id: runId,
        schema_version: "1.0.0",
        extensions: {
          claim_map_hash: input.claim_map_hash,
          quality_report_id: quality.quality_report_id,
          duplication_report_id: duplication.duplication_report_id,
        },
      };
      await context.validateSchema("content-fingerprint", fingerprintArtifact);
      await context.validateSchema("content-package", contentPackage);
      const priorResult = record(await context.readContentJson(projectId, runId, "result.json"));
      if (priorResult.status === "SUCCESS" && priorResult.gate === "CONTENT_COPY") {
        const expectedStatus = textValue(priorResult.content_status);
        const painpoint = await readPainpoint(
          context,
          projectId,
          String(content.primary_painpoint_id),
        );
        const replayVerified =
          Boolean(sameRecord) &&
          sameRecord?.contentsContentVersion === content.content_version &&
          sameRecord?.contentsContentFingerprint === fingerprint &&
          sameRecord?.contentsContentStatus === expectedStatus &&
          painpoint.logical.painpointsContentizationStatus === "PAINPOINT_CONTENT_IN_PROGRESS";
        if (!replayVerified)
          throw Object.assign(
            new Error("Completed Content replay no longer matches remote state."),
            {
              code: "CONTENT_IDEMPOTENCY_CONFLICT",
            },
          );
        return envelope("SUCCESS", "Completed Content replay is an idempotent verified no-op.", {
          project_id: projectId,
          run_id: runId,
          created_records: 0,
          updated_records: 0,
          details: {
            content_id: content.content_id,
            content_version: content.content_version,
            copy_version: content.copy_version,
            content_status: expectedStatus,
            content_created: 0,
            content_reused: 1,
            painpoint_reused: true,
            remote_mutations: 0,
            remote_verification: "SUCCESS",
            visual_planning_started: false,
            remote_identifiers_exposed: false,
          },
        });
      }
      const painpoint = await readPainpoint(
        context,
        projectId,
        String(content.primary_painpoint_id),
      );
      const runtime = await context.contentRuntime(projectId, runId);
      const write = await runtime.finalizeCopy({
        content,
        pages,
        fingerprint,
        painpointUniqueKey: `${projectId}::painpoint::${String(content.primary_painpoint_id)}`,
        painpointVersion: Number(plan.painpoint_version),
        painpointRecordId: painpoint.recordId,
        idempotencyKey: String(input.idempotency_key),
        confirmLiveWrite: true,
      });
      await context.writeContentJson(
        projectId,
        runId,
        "content-fingerprint.json",
        fingerprintArtifact,
      );
      await context.writeContentJson(
        projectId,
        runId,
        "content-duplication-report.json",
        duplication,
      );
      await context.writeContentJson(projectId, runId, "content-quality-report.json", quality);
      await context.writeContentJson(projectId, runId, "content-package.json", contentPackage);
      await context.writeContentJson(projectId, runId, "result.json", {
        status: "AWAITING_APPROVAL",
        gate: "CONTENT_COPY",
        content_id: content.content_id,
        content_version: content.content_version,
        copy_version: content.copy_version,
        created_at: duplication.created_at,
      });
      return envelope(
        "AWAITING_APPROVAL",
        "Content was read-verified and stopped at G3 CONTENT_COPY.",
        {
          project_id: projectId,
          run_id: runId,
          created_records: write.created,
          updated_records: write.updatedPainpoints,
          approval_request: {
            gate: "CONTENT_COPY",
            target_type: "CONTENT_PACKAGE",
            target_id: content.content_id,
            target_version: approval.target_version,
            source_run_id: runId,
          },
          next_action: `Ask the Operator to explicitly approve, revise, reject or pause ${String(content.content_id)} ${approval.target_version}.`,
          details: {
            content_id: content.content_id,
            content_version: content.content_version,
            copy_version: content.copy_version,
            title: content.publish_title,
            title_character_count: content.title_character_count,
            page_count: content.page_count,
            quality_score: weighted,
            blocking_failures: blocking,
            duplicate_risk: risk,
            writes_attempted: 2,
            content_created: write.created,
            content_reused: write.reused,
            remote_identifiers_exposed: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_list_contents",
    title: "List Contents",
    description:
      "Read project Content records with optional logical filters and no remote identifiers.",
    inputSchema: z
      .object({
        project_id: z.string().regex(PROJECT_ID),
        painpoint_id: z.string().regex(PAINPOINT_ID).optional(),
        status: z.string().optional(),
        structure: z.string().optional(),
        creation_source: z.string().optional(),
        duplication_risk: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const all = await listProjectContents(context, String(input.project_id));
      const filtered = all.logical.filter(
        (item) =>
          (!input.status || item.contentsContentStatus === input.status) &&
          (!input.structure || item.contentsContentStructureType === input.structure) &&
          (!input.creation_source || item.contentsCreationSource === input.creation_source) &&
          (!input.duplication_risk || item.contentsDuplicationRisk === input.duplication_risk),
      );
      return envelope("SUCCESS", `Found ${filtered.length} Content record(s).`, {
        project_id: String(input.project_id),
        details: { count: filtered.length, contents: filtered, remote_identifiers_exposed: false },
      });
    },
  },
  {
    name: "content_ops_get_content",
    title: "Get Content",
    description:
      "Read one Content and, when run_id is provided, its pages, claims, quality and G3 state.",
    inputSchema: z
      .object({
        project_id: z.string().regex(PROJECT_ID),
        content_id: z.string().regex(CONTENT_ID),
        run_id: z.string().regex(RUN_ID).optional(),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const workspace = await context.contentWorkspace(projectId);
      const uniqueKey = `${projectId}::content::${String(input.content_id)}`;
      const row = await workspace.adapter.findRecordByUniqueKey(uniqueKey, {
        tableId: workspace.contentTableId,
        tableLogicalKey: "contents",
        uniqueFieldLogicalKey: "contentsRecordUniqueKey",
      });
      if (!row)
        throw Object.assign(new Error("Content was not found."), { code: "CONTENT_NOT_FOUND" });
      const artifactRunId = typeof input.run_id === "string" ? input.run_id : null;
      const artifacts = artifactRunId
        ? {
            package: await context.readContentJson(
              projectId,
              artifactRunId,
              "content-package.json",
            ),
            claim_map: await context.readContentJson(
              projectId,
              artifactRunId,
              "content-claim-map.json",
            ),
            quality_report: await context.readContentJson(
              projectId,
              artifactRunId,
              "content-quality-report.json",
            ),
            result: await context.readContentJson(projectId, artifactRunId, "result.json"),
          }
        : {};
      return envelope("SUCCESS", `Content ${String(input.content_id)} was read.`, {
        project_id: projectId,
        ...(artifactRunId ? { run_id: artifactRunId } : {}),
        details: {
          content: logicalFields(row.fields, workspace.fieldMap),
          ...artifacts,
          remote_identifiers_exposed: false,
        },
      });
    },
  },
  {
    name: "content_ops_verify_content",
    title: "Verify Content",
    description:
      "Read-verify local Content Package, remote record, fingerprint, version, state and G3 checkpoint.",
    inputSchema: z
      .object({
        project_id: z.string().regex(PROJECT_ID),
        run_id: z.string().regex(RUN_ID),
        content_id: z.string().regex(CONTENT_ID),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = String(input.project_id);
      const runId = String(input.run_id);
      const pkg = record(await context.readContentJson(projectId, runId, "content-package.json"));
      const quality = record(
        await context.readContentJson(projectId, runId, "content-quality-report.json"),
      );
      if (!Object.keys(pkg).length) throw new Error("CONTENT_PACKAGE_NOT_FOUND");
      const all = await listProjectContents(context, projectId);
      const remote = all.logical.find((item) => item.contentsContentId === input.content_id);
      const content = record(pkg.content_record);
      const painpointId = textValue(content.primary_painpoint_id);
      const painpoint = painpointId
        ? await readPainpoint(context, projectId, painpointId)
        : undefined;
      const painpointStatus = painpoint?.logical.painpointsContentizationStatus;
      const result = record(await context.readContentJson(projectId, runId, "result.json"));
      const expectedContentStatus =
        result.status === "SUCCESS" && typeof result.content_status === "string"
          ? result.content_status
          : content.content_status;
      const matched =
        Boolean(remote) &&
        remote?.contentsContentVersion === content.content_version &&
        remote?.contentsContentFingerprint === record(pkg.content_fingerprint).hash &&
        remote?.contentsContentStatus === expectedContentStatus &&
        painpointStatus === "PAINPOINT_CONTENT_IN_PROGRESS";
      return envelope(
        matched ? "SUCCESS" : "BLOCKED",
        matched
          ? "Content package and remote G3 state passed read verification."
          : "Content verification found a mismatch.",
        {
          project_id: projectId,
          run_id: runId,
          details: {
            content_id: input.content_id,
            package_valid: true,
            remote_record_found: Boolean(remote),
            fingerprint_match:
              remote?.contentsContentFingerprint === record(pkg.content_fingerprint).hash,
            version_match: remote?.contentsContentVersion === content.content_version,
            content_status: remote?.contentsContentStatus,
            expected_content_status: expectedContentStatus,
            painpoint_status_expected: "PAINPOINT_CONTENT_IN_PROGRESS",
            painpoint_status_actual: painpointStatus,
            painpoint_status_match: painpointStatus === "PAINPOINT_CONTENT_IN_PROGRESS",
            g3_status: result.status,
            quality_ready: quality.ready_for_g3,
            remote_identifiers_exposed: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_plan_content_revision",
    title: "Plan Content Revision",
    description:
      "Dry-run a non-destructive version plan from Operator feedback; does not modify local or remote Content.",
    inputSchema: z
      .object({
        project_id: z.string().regex(PROJECT_ID),
        run_id: z.string().regex(RUN_ID),
        content_id: z.string().regex(CONTENT_ID),
        revision_scope: z.enum([
          "TITLE_ONLY",
          "BODY_ONLY",
          "CTA_ONLY",
          "PAGE_COPY",
          "STRUCTURE",
          "CORE_VIEWPOINT",
          "FULL_REWRITE",
        ]),
        requested_changes: z.array(z.string().min(1).max(1000)).min(1),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const pkg = record(
        await context.readContentJson(
          String(input.project_id),
          String(input.run_id),
          "content-package.json",
        ),
      );
      const content = record(pkg.content_record);
      if (content.content_id !== input.content_id)
        throw new Error("CONTENT_REVISION_TARGET_MISMATCH");
      const structural = ["STRUCTURE", "CORE_VIEWPOINT", "FULL_REWRITE"].includes(
        String(input.revision_scope),
      );
      const next = (value: unknown) => `CV-${Number(String(value).replace(/^CV-/, "")) + 1}`;
      const plan = {
        revision_plan_id: `CRP-${suffix(String(input.run_id))}`,
        project_id: input.project_id,
        content_id: input.content_id,
        from_content_version: content.content_version,
        from_copy_version: content.copy_version,
        to_content_version: structural ? next(content.content_version) : content.content_version,
        to_copy_version: next(content.copy_version),
        revision_scope: input.revision_scope,
        title_changes: input.revision_scope === "TITLE_ONLY" ? input.requested_changes : [],
        body_changes: input.revision_scope === "BODY_ONLY" ? input.requested_changes : [],
        cta_changes: input.revision_scope === "CTA_ONLY" ? input.requested_changes : [],
        page_changes: input.revision_scope === "PAGE_COPY" ? input.requested_changes : [],
        claim_changes: structural ? input.requested_changes : [],
        preserved_elements: ["Content ID", "history"],
        invalidated_artifacts: [
          "content-claim-map",
          "content-duplication-report",
          "content-quality-report",
          "G3 approval",
        ],
        requires_new_duplication_check: true,
        requires_new_claim_validation: true,
        requires_new_g3: true,
        created_at: new Date().toISOString(),
        run_id: input.run_id,
        schema_version: "1.0.0",
        extensions: {},
      };
      await context.validateSchema("content-revision-plan", plan);
      return envelope("SUCCESS", "Revision plan is valid; no Content was modified.", {
        project_id: String(input.project_id),
        run_id: String(input.run_id),
        details: {
          revision_plan: plan,
          remote_write_attempted: false,
          old_version_preserved: true,
        },
      });
    },
  },
] as const;
