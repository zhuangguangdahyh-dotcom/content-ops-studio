import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import {
  assessProjectProfileDiscovery,
  assignPainpointPriority,
  calculatePainpointWeightedScore,
  compilePainpointFeishuFields,
  normalizeResearchSource,
  validateEvidenceReferences,
  validateProjectResearchReadiness,
  type ResearchPainpoint,
} from "../../../packages/core/src/research/index.js";
import type {
  ResearchEvidence,
  ResearchPainpointBatch,
  ResearchReviewBatch,
} from "../../../packages/runtime/src/research/index.js";
import type { McpContext } from "./context.js";
import { envelope, resultEnvelopeSchema, type ResultEnvelope } from "./result-envelope.js";
import { CONTENT_TOOL_DEFINITIONS } from "./content-tools.js";
import { VISUAL_TOOL_DEFINITIONS } from "./visual-tools.js";
import { RENDERER_TOOL_DEFINITIONS } from "./renderer-tools.js";
import { IMAGE_PRODUCTION_TOOL_DEFINITIONS } from "./image-production-tools.js";
import { FINALIZATION_TOOL_DEFINITIONS } from "./finalization-tools.js";

const PROJECT_ID = /^PRJ-[A-Z0-9][A-Z0-9-]{2,63}$/;
const RUN_ID = /^RUN-[A-Z0-9][A-Z0-9-]{2,95}$/;
const APPROVAL_ID = /^APR-[A-Z0-9][A-Z0-9-]{2,95}$/;
const HASH = /^[a-f0-9]{64}$/;
const SAFE_KEY = /^[A-Za-z0-9][A-Za-z0-9._-]{7,127}$/;
const PAINPOINT_ID = /^P-[0-9]{4}$/;
const RESEARCH_PLAN_ID = /^RPL-[A-Z0-9-]+$/;

const emptyInput = z.object({}).strict();
const projectInput = z.object({ project_id: z.string().regex(PROJECT_ID) }).strict();
const runInput = z
  .object({ project_id: z.string().regex(PROJECT_ID), run_id: z.string().regex(RUN_ID) })
  .strict();
const projectProfile = z.record(z.string(), z.unknown());
const writeConfirmation = {
  request_id: z.string().regex(SAFE_KEY),
  explicit_confirmation: z.literal(true),
};

type Annotation = {
  readOnlyHint: boolean;
  destructiveHint: false;
  openWorldHint: boolean;
};

export interface ToolDefinition {
  name: string;
  title: string;
  description: string;
  inputSchema: z.ZodType<Record<string, unknown>>;
  outputSchema: typeof resultEnvelopeSchema;
  annotations: Annotation;
  handler(context: McpContext, input: Record<string, unknown>): Promise<ResultEnvelope>;
}

const readOnly: Annotation = {
  readOnlyHint: true,
  destructiveHint: false,
  openWorldHint: false,
};
const writeOpen: Annotation = {
  readOnlyHint: false,
  destructiveHint: false,
  openWorldHint: true,
};
const writeLocalClosed: Annotation = {
  readOnlyHint: false,
  destructiveHint: false,
  openWorldHint: false,
};

const scoreInput = z
  .object({
    audience_relevance: z.number().int().min(0).max(5),
    frequency: z.number().int().min(0).max(5),
    urgency: z.number().int().min(0).max(5),
    decision_impact: z.number().int().min(0).max(5),
    real_cost: z.number().int().min(0).max(5),
    subject_advantage_fit: z.number().int().min(0).max(5),
    evidence_strength: z.number().int().min(0).max(5),
    content_potential: z.number().int().min(0).max(5),
    promotion_fit: z.number().int().min(0).max(5),
  })
  .strict();

const researchSourceInput = z
  .object({
    source_id: z.string().regex(/^SRC-[0-9]{4}$/),
    source_type: z.enum([
      "OFFICIAL_SOURCE",
      "FIRST_PARTY_DATA",
      "CUSTOMER_MATERIAL",
      "CUSTOMER_INTERVIEW",
      "INDUSTRY_REPORT",
      "PLATFORM_DOCUMENTATION",
      "SOCIAL_COMMENT",
      "PUBLIC_REVIEW",
      "COMPETITOR_CONTENT",
      "QUESTION_AND_ANSWER",
      "FORUM",
      "NEWS",
      "MANUAL_SOURCE",
    ]),
    title: z.string().min(1).max(300),
    publisher_or_owner: z.string().min(1).max(200),
    source_location: z.string().min(1).max(2000),
    source_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable(),
    retrieved_at: z.iso.datetime(),
    language: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/),
    summary: z.string().min(1).max(1200),
    supported_claims: z.array(z.string().min(1).max(500)).min(1).max(20),
    limitations: z.string().max(1000),
    credibility_notes: z.string().min(1).max(1000),
    is_first_party: z.boolean(),
    is_user_provided: z.boolean(),
    is_current: z.boolean(),
    content_hash: z.string().regex(HASH).optional(),
  })
  .strict();

const painpointCandidateInput = z
  .object({
    painpoint_id: z.string().regex(PAINPOINT_ID),
    painpoint_name: z.string().min(1).max(200),
    business_scenario: z.string().min(1).max(1000),
    audience_type: z.string().min(1).max(300),
    decision_stage: z.enum([
      "PROBLEM_AWARENESS",
      "ACTIVE_SEARCH",
      "SOLUTION_COMPARISON",
      "RISK_EVALUATION",
      "PURCHASE_DECISION",
      "USAGE_EXPERIENCE",
      "REPURCHASE_REFERRAL",
    ]),
    explicit_need: z.string().min(1).max(1000),
    deep_anxiety: z.string().min(1).max(1000),
    trigger_events: z.array(z.string().min(1).max(300)).max(20),
    primary_barriers: z.array(z.string().min(1).max(300)).max(20),
    analysis_reason: z.string().min(1).max(1500),
    commercial_loss_or_real_cost: z.string().min(1).max(1000),
    content_entry_angles: z.array(z.string().min(1).max(300)).max(20),
    subject_advantages_to_express: z.array(z.string().min(1).max(300)).max(20),
    evidence_refs: z
      .array(z.string().regex(/^E-[0-9]{4}$/))
      .min(1)
      .max(20),
    evidence_confidence: z.enum([
      "A_DIRECT_STRONG",
      "B_MULTI_SOURCE",
      "C_SINGLE_OR_INDIRECT",
      "D_HYPOTHESIS",
    ]),
    promotion_priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    duplication_risk: z.enum(["LOW", "MEDIUM", "HIGH"]),
    score: scoreInput,
    score_explanations: z.array(z.string().min(1).max(500)).min(1).max(20),
    score_limitations: z.array(z.string().min(1).max(500)).max(20),
    near_duplicate_reason: z.string().max(1000).nullable(),
  })
  .strict();

const reviewItemInput = z
  .object({
    painpoint_id: z.string().regex(PAINPOINT_ID),
    painpoint_version: z.number().int().min(1),
    decision: z.enum(["APPROVE", "REVISE", "REJECT", "PAUSE"]),
    comment: z.string().max(1000),
    requested_changes: z.array(z.string().min(1).max(500)).max(20),
  })
  .strict();

const painpointReviewBatchInput = z
  .object({
    review_batch_id: z.string().regex(/^PRB-[A-Z0-9-]+$/),
    research_batch_id: z.string().regex(/^RB-[A-Z0-9-]+$/),
    project_id: z.string().regex(PROJECT_ID),
    painpoint_batch_version: z.number().int().min(1),
    review_version: z.number().int().min(1),
    items: z.array(reviewItemInput).min(1).max(100),
    summary_decision: z.enum(["APPROVE", "REVISE", "REJECT", "PAUSE", "MIXED"]),
    approved_count: z.number().int().min(0),
    revision_required_count: z.number().int().min(0),
    rejected_count: z.number().int().min(0),
    paused_count: z.number().int().min(0),
    reviewer_role: z.literal("OPERATOR"),
    source_run_id: z.string().regex(RUN_ID),
    created_at: z.iso.datetime(),
    schema_version: z.literal("1.0.0"),
    extensions: z.record(z.string(), z.unknown()),
  })
  .strict();

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function arrayLength(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

function records(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.map(record) : [];
}

function stateCounts(state: Record<string, unknown>) {
  return {
    tables: Object.keys(record(state.table_states)).length,
    fields:
      Object.keys(record(state.field_states)).length +
      Object.keys(record(state.relation_states)).length,
    relations: Object.keys(record(state.relation_states)).length,
    views: Object.keys(record(state.view_states)).length,
    records: Object.keys(record(state.record_states)).length,
  };
}

function requireProject(input: Record<string, unknown>): string {
  return String(input.project_id);
}

function requireRun(input: Record<string, unknown>): string {
  return String(input.run_id);
}

async function requireState(context: McpContext, projectId: string) {
  const state = await context.readProject(projectId);
  if (!state)
    throw Object.assign(new Error("The project has no local Workspace state."), {
      code: "PROJECT_NOT_RESOLVED",
    });
  return state;
}

async function projectName(context: McpContext, projectId: string): Promise<string> {
  try {
    const raw = JSON.parse(
      await readFile(path.join(context.home, "project-profile.json"), "utf8"),
    ) as Record<string, unknown>;
    if (raw.project_id === projectId && typeof raw.project_name === "string")
      return raw.project_name;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  return projectId;
}

async function buildInitializationPlan(
  context: McpContext,
  profile: Record<string, unknown>,
): Promise<{ hash: string; details: Record<string, unknown> }> {
  await context.validateProjectProfile(profile);
  const gapReport = assessProjectProfileDiscovery(profile);
  await context.validateSchema("project-profile-gap-report", gapReport);
  const projectId = String(profile.project_id);
  const runId = String(profile.last_run_id);
  const name = String(profile.project_name);
  const { value } = await context.invokeCli([
    "feishu",
    "workspace",
    "plan",
    "--project-id",
    projectId,
    "--project-name",
    name,
    "--run-id",
    runId,
    "--dry-run",
  ]);
  const plan = record(value.plan);
  const expected = record(plan.expected);
  const details = {
    profile_complete: gapReport.profile_completeness === 1,
    profile_completeness: gapReport.profile_completeness,
    ready_for_project_confirmation: gapReport.ready_for_project_confirmation,
    ready_for_painpoint_research: gapReport.ready_for_painpoint_research,
    missing_fields: [...gapReport.missing_required_fields, ...gapReport.missing_recommended_fields],
    material_blockers: gapReport.material_blockers,
    non_blocking_gaps: gapReport.non_blocking_gaps,
    inferred_fields: gapReport.inferred_fields.map((item) => item.field),
    gap_report: gapReport,
    platform_pack: profile.platform_pack,
    industry_pack: profile.industry_pack,
    tables: Number(expected.tables ?? 0),
    fields: Number(expected.fields ?? 0),
    relations: Number(expected.relations ?? 0),
    views: Number(expected.views ?? 0),
    records: 1,
    conflicts: Array.isArray(plan.conflicts) ? plan.conflicts.length : 0,
    warnings:
      gapReport.profile_completeness === 1
        ? []
        : ["Project Profile contains explicit gaps or unconfirmed inferences."],
    blueprint_version: plan.blueprintVersion,
  };
  return { hash: context.hash({ profile, details }), details };
}

async function buildRepairPlan(context: McpContext, projectId: string) {
  const { value } = await context.invokeCli([
    "feishu",
    "workspace",
    "repair",
    "--project-id",
    projectId,
    "--dry-run",
  ]);
  const safeRepairs = Array.isArray(value.safe_repairs) ? value.safe_repairs : [];
  const report = record(value.report);
  const details = {
    verification_status: report.overallStatus ?? value.status ?? "UNKNOWN",
    safe_repair_count: safeRepairs.length,
    add_only: safeRepairs.every((item) => record(item).operation !== "DELETE"),
    conflicts: arrayLength(report.conflicts),
  };
  return { hash: context.hash({ project_id: projectId, details }), details, safeRepairs };
}

function researchIds(runId: string): { planId: string; batchId: string } {
  const suffix = runId.replace(/^RUN-/, "");
  return { planId: `RPL-${suffix}`, batchId: `RB-${suffix}` };
}

function approvalIdForRun(runId: string): string {
  const match = /^RUN-([0-9]{8})-[0-9]{6}-([A-Z0-9]{4})$/.exec(runId);
  if (!match)
    throw Object.assign(new Error("Run ID cannot produce a contract-safe approval ID."), {
      code: "RUN_ID_INVALID",
    });
  return `APR-${match[1]}-${match[2]}`;
}

function versionedPack(value: unknown): { id: string; version: string } {
  return { id: String(value), version: "1.0.0" };
}

async function requireResearchProfile(context: McpContext, projectId: string) {
  const profile = await context.readProjectProfile(projectId);
  if (!profile)
    throw Object.assign(new Error("The project has no canonical Project Profile."), {
      code: "PROJECT_PROFILE_NOT_FOUND",
    });
  await context.validateProjectProfile(profile);
  const readiness = validateProjectResearchReadiness(profile);
  if (!readiness.ready)
    throw Object.assign(
      new Error(`Project is not research-ready: ${readiness.material_blockers.join(", ")}.`),
      { code: "PROJECT_PROFILE_NOT_RESEARCH_READY" },
    );
  return { profile, readiness };
}

function toLogicalFields(
  fields: Record<string, unknown>,
  mapping: Array<{ logicalKey: string; currentFieldName: string }>,
): Record<string, unknown> {
  const byName = new Map(mapping.map((item) => [item.currentFieldName, item.logicalKey]));
  return Object.fromEntries(
    Object.entries(fields).flatMap(([name, value]) => {
      const logical = byName.get(name);
      return logical ? [[logical, value]] : [];
    }),
  );
}

function buildPainpointRecord(input: {
  candidate: z.infer<typeof painpointCandidateInput>;
  projectId: string;
  runId: string;
  batchId: string;
  at: string;
}): { painpoint: ResearchPainpoint; scoring: Record<string, unknown> } {
  const weighted = calculatePainpointWeightedScore(input.candidate.score);
  let priority = assignPainpointPriority(weighted);
  if (input.candidate.evidence_confidence === "D_HYPOTHESIS") priority = "SUPPLEMENTARY";
  const limitations = input.candidate.score_limitations;
  const painpoint: ResearchPainpoint = {
    painpoint_id: input.candidate.painpoint_id,
    project_id: input.projectId,
    record_unique_key: `${input.projectId}::painpoint::${input.candidate.painpoint_id}`,
    painpoint_name: input.candidate.painpoint_name,
    review_status: "PAINPOINT_PENDING",
    business_scenario: input.candidate.business_scenario,
    audience_type: input.candidate.audience_type,
    decision_stage: input.candidate.decision_stage,
    explicit_need: input.candidate.explicit_need,
    deep_anxiety: input.candidate.deep_anxiety,
    trigger_events: input.candidate.trigger_events,
    primary_barriers: input.candidate.primary_barriers,
    analysis_reason: input.candidate.analysis_reason,
    commercial_loss_or_real_cost: input.candidate.commercial_loss_or_real_cost,
    content_entry_angles: input.candidate.content_entry_angles,
    subject_advantages_to_express: input.candidate.subject_advantages_to_express,
    evidence_refs: input.candidate.evidence_refs,
    evidence_confidence: input.candidate.evidence_confidence,
    painpoint_priority: priority,
    promotion_priority: input.candidate.promotion_priority,
    contentization_status: "PAINPOINT_NOT_CONTENTIZED",
    related_content_ids: [],
    finalized_content_count: 0,
    latest_content_date: null,
    duplication_risk: input.candidate.duplication_risk,
    version: 1,
    research_batch_id: input.batchId,
    schema_version: "1.0.0",
    last_run_id: input.runId,
    created_at: input.at,
    updated_at: input.at,
    extensions: {
      limitations: limitations.join(" "),
      near_duplicate_reason: input.candidate.near_duplicate_reason,
    },
  };
  return {
    painpoint,
    scoring: {
      scoring_id: `SCR-${input.candidate.painpoint_id.replace(/^P-/, "")}-${input.batchId.replace(/^RB-/, "")}`,
      painpoint_candidate_id: input.candidate.painpoint_id,
      ...input.candidate.score,
      weights: {
        audience_relevance: 15,
        frequency: 10,
        urgency: 10,
        decision_impact: 15,
        real_cost: 10,
        subject_advantage_fit: 10,
        evidence_strength: 15,
        content_potential: 10,
        promotion_fit: 5,
      },
      weighted_score: weighted,
      evidence_confidence: input.candidate.evidence_confidence,
      painpoint_priority: priority,
      promotion_priority: input.candidate.promotion_priority,
      score_explanations: input.candidate.score_explanations,
      score_limitations: limitations,
      created_at: input.at,
      schema_version: "1.0.0",
      extensions: {},
    },
  };
}

export const TOOL_DEFINITIONS: readonly ToolDefinition[] = [
  {
    name: "content_ops_doctor",
    title: "Content Ops Doctor",
    description:
      "Check Node runtime, immutable Plugin/data boundaries, official Lark CLI readiness, Adapter mode and local project state without writing.",
    inputSchema: emptyInput,
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context) {
      const feishu = await context.invokeCli(["feishu", "status"], { allowNonzero: true });
      const projects = await context.listProjects();
      const runtimeMajor = Number(process.versions.node.split(".")[0]);
      const runtimeSupported = runtimeMajor === 24;
      const ready = feishu.value.status === "READY" && runtimeSupported;
      return envelope(
        ready ? "SUCCESS" : "BLOCKED",
        ready ? "Runtime and Lark CLI are ready." : "Doctor found a blocking readiness condition.",
        {
          next_action: ready
            ? "Call a read or plan tool before any write."
            : "Call content_ops_start_feishu_setup if authorization is pending.",
          details: {
            runtime: process.version,
            runtime_supported: runtimeSupported,
            runtime_policy: ">=24 <25",
            workspace_adapter: context.workspaceAdapter,
            runtime_mode: context.runtimeMode,
            plugin_data_configured: Boolean(context.pluginData),
            home_outside_plugin_root: !context.home.startsWith(`${context.pluginRoot}${path.sep}`),
            lark_cli_status: feishu.value.status,
            lark_cli_version: feishu.value.version,
            project_count: projects.length,
            token_exposed: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_check_feishu",
    title: "Check Feishu",
    description:
      "Check the supported official Lark CLI version, user OAuth state and thirteen required Base scopes without exposing identity or tokens.",
    inputSchema: emptyInput,
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context) {
      const status = await context.invokeCli(["feishu", "status"], { allowNonzero: true });
      const scopes = await context.invokeCli(["feishu", "scopes"], { allowNonzero: true });
      const ready = status.value.status === "READY" && scopes.value.status === "SUCCESS";
      return envelope(
        ready ? "SUCCESS" : "AWAITING_USER_AUTHORIZATION",
        ready
          ? "Official Lark CLI user OAuth and required Base scopes are ready."
          : "Feishu authorization or required scopes need attention.",
        {
          next_action: ready
            ? "Use Workspace read or plan tools."
            : "Call content_ops_start_feishu_setup.",
          details: {
            installed: status.value.version !== undefined,
            version: status.value.version,
            version_status: status.value.version_status,
            auth_state: status.value.auth_state,
            required_scope_count: scopes.value.required_scope_count ?? 13,
            granted_scope_count: scopes.value.granted_scope_count ?? 0,
            missing_scope_count: arrayLength(scopes.value.missing_scopes),
            deferred_scope_count: arrayLength(scopes.value.deferred_scopes),
            token_exposed: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_start_feishu_setup",
    title: "Start Feishu Setup",
    description:
      "Start the official Lark CLI browser OAuth flow after explicit confirmation; never accepts or reads an App Secret or token.",
    inputSchema: z.object(writeConfirmation).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeOpen,
    async handler(context) {
      const { value } = await context.invokeCli(["feishu", "login"]);
      return envelope(
        "AWAITING_USER_AUTHORIZATION",
        "Official Lark CLI authorization was started. Complete it in the browser.",
        {
          next_action:
            "Complete the official browser authorization, then call content_ops_check_feishu.",
          details: {
            authorization_url_available: typeof value.authorization_url === "string",
            authorization_url:
              typeof value.authorization_url === "string" ? value.authorization_url : undefined,
            token_exposed: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_list_projects",
    title: "List Projects",
    description:
      "List local registered/discovered projects and non-sensitive Workspace status summaries.",
    inputSchema: emptyInput,
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context) {
      const projects = await context.listProjects();
      return envelope(
        "SUCCESS",
        `Found ${projects.length} local project${projects.length === 1 ? "" : "s"}.`,
        {
          details: { count: projects.length, projects },
        },
      );
    },
  },
  {
    name: "content_ops_get_project",
    title: "Get Project",
    description:
      "Read one project's local configuration state, Workspace status and latest Run summary without remote identifiers.",
    inputSchema: projectInput,
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = requireProject(input);
      const state = await requireState(context, projectId);
      return envelope("SUCCESS", `Project ${projectId} is ${String(state.overall_status)}.`, {
        project_id: projectId,
        ...(typeof state.run_id === "string" ? { run_id: state.run_id } : {}),
        details: {
          status: state.overall_status,
          current_phase: state.current_phase,
          checkpoint_present: Boolean(state.checkpoint_id),
          mapping_version: state.mapping_version,
          ...stateCounts(state),
        },
      });
    },
  },
  {
    name: "content_ops_plan_project_initialization",
    title: "Plan Project Initialization",
    description:
      "Validate a canonical Project Profile and generate a no-write initialization plan bound to a SHA-256 plan hash.",
    inputSchema: z.object({ project_profile: projectProfile }).strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const profile = record(input.project_profile);
      const plan = await buildInitializationPlan(context, profile);
      return envelope(
        plan.details.ready_for_project_confirmation === true ? "SUCCESS" : "BLOCKED",
        plan.details.ready_for_project_confirmation === true
          ? "Project initialization plan is valid and contains no remote write."
          : "Project Profile has material blockers and is not ready for initialization.",
        {
          project_id: String(profile.project_id),
          run_id: String(profile.last_run_id),
          next_action:
            plan.details.ready_for_project_confirmation === true
              ? "Review the gap report; after explicit Operator confirmation, call content_ops_initialize_project with this plan_hash."
              : "Resolve only the material blockers listed in the gap report, then plan again.",
          warnings: Array.isArray(plan.details.warnings) ? (plan.details.warnings as string[]) : [],
          details: { ...plan.details, plan_hash: plan.hash },
        },
      );
    },
  },
  {
    name: "content_ops_initialize_project",
    title: "Initialize Project",
    description:
      "Run the existing production Runtime and Lark CLI Workspace provisioner with locks, idempotency and G1 pause.",
    inputSchema: z
      .object({
        project_profile: projectProfile,
        plan_hash: z.string().regex(HASH),
        idempotency_key: z.string().regex(SAFE_KEY),
        explicit_confirmation: z.literal(true),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeOpen,
    async handler(context, input) {
      const profile = record(input.project_profile);
      const plan = await buildInitializationPlan(context, profile);
      if (plan.details.ready_for_project_confirmation !== true)
        throw Object.assign(new Error("Project Profile has unresolved material blockers."), {
          code: "PROJECT_PROFILE_NOT_CONFIRMABLE",
        });
      if (input.plan_hash !== plan.hash)
        throw Object.assign(new Error("Initialization plan hash is stale or mismatched."), {
          code: "PLAN_HASH_MISMATCH",
        });
      const projectId = String(profile.project_id);
      const runId = String(profile.last_run_id);
      const name = String(profile.project_name);
      const profileFile = await context.writeControlledJson("profiles", projectId, profile);
      const { value } = await context.invokeCli([
        "project",
        "init",
        "--project-id",
        projectId,
        "--project-name",
        name,
        "--run-id",
        runId,
        "--input",
        profileFile,
        "--confirm-live-write",
      ]);
      const awaiting = value.status === "AWAITING_APPROVAL";
      return envelope(
        awaiting ? "AWAITING_APPROVAL" : "SUCCESS",
        awaiting
          ? "Workspace provision completed and stopped at G1 PROJECT_PROFILE."
          : "The idempotent initialization replay completed without duplicate resources.",
        {
          project_id: projectId,
          run_id: runId,
          ...(awaiting
            ? {
                approval_request: {
                  gate: "PROJECT_PROFILE",
                  target_type: "PROJECT",
                  target_id: projectId,
                  target_version: "PROJECT-PROFILE-V1",
                  source_run_id: runId,
                },
              }
            : {}),
          next_action: awaiting
            ? "Ask the Operator for an explicit G1 decision, then call content_ops_submit_approval."
            : "Call content_ops_verify_workspace.",
          details: {
            runtime_status: value.status,
            idempotency_key: input.idempotency_key,
            duplicate_resources_created: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_inspect_workspace",
    title: "Inspect Workspace",
    description:
      "Read the remote Feishu Workspace structure through the existing Adapter and return counts without identifiers.",
    inputSchema: projectInput,
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = requireProject(input);
      const { value } = await context.invokeCli([
        "feishu",
        "workspace",
        "inspect",
        "--project-id",
        projectId,
      ]);
      const snapshot = record(value.snapshot);
      const remoteTables = records(snapshot.tables);
      const remoteFields = remoteTables.flatMap((table) => records(table.fields));
      const state = await requireState(context, projectId);
      const mappedFields = records(record(state.extensions).field_map);
      const mappedRelations = mappedFields.filter(
        (field) => field.fieldType === 18 || field.fieldType === 21,
      );
      const remoteRelations = remoteFields.filter(
        (field) => field.type === 18 || field.type === 21,
      );
      const remoteIdentifiers = record(state.remote_identifiers);
      const blueprintTableCount = Object.keys(remoteIdentifiers).filter((key) =>
        key.startsWith("table:"),
      ).length;
      const blueprintNamedViewCount = Object.keys(remoteIdentifiers).filter((key) =>
        key.startsWith("view:"),
      ).length;
      const remoteViewCount = remoteTables.reduce(
        (count, table) => count + arrayLength(table.views),
        0,
      );
      return envelope(
        "SUCCESS",
        "Workspace structure was inspected through the official Lark CLI Adapter.",
        {
          project_id: projectId,
          ...(typeof state.run_id === "string" ? { run_id: state.run_id } : {}),
          details: {
            table_count: remoteTables.length,
            field_count: remoteFields.length,
            relation_count: remoteRelations.length,
            view_count: remoteViewCount,
            blueprint_table_count: blueprintTableCount,
            blueprint_mapped_field_count: mappedFields.length,
            blueprint_relation_count: mappedRelations.length,
            blueprint_named_view_count: blueprintNamedViewCount,
            platform_generated_or_default_field_count: Math.max(
              0,
              remoteFields.length - mappedFields.length,
            ),
            platform_generated_relation_count: Math.max(
              0,
              remoteRelations.length - mappedRelations.length,
            ),
            platform_default_or_extra_view_count: Math.max(
              0,
              remoteViewCount - blueprintNamedViewCount,
            ),
            project_record_reference_present:
              typeof remoteIdentifiers["record:projectConfig"] === "string",
            local_mapping_field_count: mappedFields.length,
            provisioning_status: state.overall_status,
            current_phase: state.current_phase,
            remote_snapshot_present: Object.keys(snapshot).length > 0,
            remote_identifiers_exposed: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_verify_workspace",
    title: "Verify Workspace",
    description:
      "Compare the remote Workspace with the canonical Blueprint and local mapping using read-only verification.",
    inputSchema: projectInput,
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = requireProject(input);
      const { value } = await context.invokeCli([
        "feishu",
        "workspace",
        "verify",
        "--project-id",
        projectId,
      ]);
      const verification = record(value.verification);
      const verificationPlan = record(verification.plan);
      const pendingOperations = [
        ...records(verificationPlan.tableOperations),
        ...records(verificationPlan.fieldOperations),
        ...records(verificationPlan.relationOperations),
        ...records(verificationPlan.viewOperations),
      ].filter((operation) => {
        const kind = operation.operation;
        return kind !== "SKIP_VERIFIED" && kind !== "UPDATE_MAPPING";
      });
      const conflicts = records(verificationPlan.conflicts);
      const matched = verification.verified === true && conflicts.length === 0;
      const status = matched ? "MATCH" : conflicts.length > 0 ? "CONFLICT" : "REPAIR_AVAILABLE";
      return envelope(
        matched ? "SUCCESS" : status === "CONFLICT" ? "CONFLICT" : "BLOCKED",
        matched
          ? "Workspace matches the canonical Blueprint and local mapping."
          : "Workspace verification found a repair or conflict condition.",
        {
          project_id: projectId,
          details: {
            verification_status: status,
            verified: matched,
            pending_operation_count: pendingOperations.length,
            conflict_count: conflicts.length,
            remote_identifiers_exposed: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_plan_workspace_repair",
    title: "Plan Workspace Repair",
    description: "Create a dry-run add-only repair plan; never proposes or performs deletion.",
    inputSchema: projectInput,
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = requireProject(input);
      const plan = await buildRepairPlan(context, projectId);
      return envelope(
        "SUCCESS",
        plan.safeRepairs.length
          ? `Planned ${plan.safeRepairs.length} add-only repair operation(s).`
          : "Workspace matches; the repair plan has zero operations.",
        {
          project_id: projectId,
          next_action: plan.safeRepairs.length
            ? "Review the plan and call content_ops_apply_workspace_repair with its hash."
            : "No repair write is needed.",
          details: { ...plan.details, plan_hash: plan.hash },
        },
      );
    },
  },
  {
    name: "content_ops_apply_workspace_repair",
    title: "Apply Workspace Repair",
    description:
      "Apply a current add-only repair plan after explicit confirmation, or return a verified no-op.",
    inputSchema: z
      .object({
        project_id: z.string().regex(PROJECT_ID),
        plan_hash: z.string().regex(HASH),
        ...writeConfirmation,
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeOpen,
    async handler(context, input) {
      const projectId = requireProject(input);
      const plan = await buildRepairPlan(context, projectId);
      if (input.plan_hash !== plan.hash)
        throw Object.assign(new Error("Repair plan hash is stale or mismatched."), {
          code: "PLAN_HASH_MISMATCH",
        });
      if (!plan.details.add_only)
        throw Object.assign(new Error("Repair plan contains a forbidden non-add operation."), {
          code: "REPAIR_NOT_ADD_ONLY",
        });
      if (plan.safeRepairs.length === 0)
        return envelope(
          "SUCCESS",
          "Repair result is PASSED_NO_OP; no remote mutation was attempted.",
          {
            project_id: projectId,
            details: {
              repair_status: "PASSED_NO_OP",
              operation_count: 0,
              remote_mutation_attempted: false,
              plan_hash: plan.hash,
            },
          },
        );
      const profileFile = path.join(context.home, "mcp", "profiles", `${projectId}.json`);
      const name = await projectName(context, projectId);
      const state = await requireState(context, projectId);
      await context.invokeCli([
        "feishu",
        "workspace",
        "repair",
        "--project-id",
        projectId,
        "--project-name",
        name,
        "--run-id",
        String(state.run_id),
        "--input",
        profileFile,
        "--confirm-live-write",
      ]);
      return envelope("SUCCESS", "Add-only Workspace repair completed and was read-verified.", {
        project_id: projectId,
        updated_records: plan.safeRepairs.length,
        details: {
          repair_status: "APPLIED",
          operation_count: plan.safeRepairs.length,
          plan_hash: plan.hash,
        },
      });
    },
  },
  {
    name: "content_ops_get_run_status",
    title: "Get Run Status",
    description:
      "Read the Run phase, checkpoint, errors and approval status from local Runtime evidence.",
    inputSchema: runInput,
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = requireProject(input);
      const runId = requireRun(input);
      const state = await requireState(context, projectId);
      if (state.run_id !== runId)
        throw Object.assign(
          new Error("Run ID does not match the current project Workspace state."),
          {
            code: "RUN_PROJECT_MISMATCH",
          },
        );
      return envelope(
        "SUCCESS",
        `Run ${runId} is ${String(state.overall_status)} at phase ${String(state.current_phase)}.`,
        {
          project_id: projectId,
          run_id: runId,
          details: {
            status: state.overall_status,
            current_phase: state.current_phase,
            checkpoint: state.checkpoint_id ? "PRESENT" : "ABSENT",
            failed_operation_count: arrayLength(state.failed_operations),
            pending_operation_count: arrayLength(state.pending_operations),
            approval_status: state.overall_status === "AWAITING_APPROVAL" ? "PENDING" : "NONE",
          },
        },
      );
    },
  },
  {
    name: "content_ops_list_pending_approvals",
    title: "List Pending Approvals",
    description: "List explicit G1-G5 approvals currently pending for a project or Run.",
    inputSchema: projectInput,
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = requireProject(input);
      const state = await requireState(context, projectId);
      const pending = state.overall_status === "AWAITING_APPROVAL";
      const approvals = pending
        ? [
            {
              gate: "PROJECT_PROFILE",
              target_type: "PROJECT",
              target_id: projectId,
              target_version: "PROJECT-PROFILE-V1",
              source_run_id: state.run_id,
            },
          ]
        : [];
      return envelope(
        "SUCCESS",
        pending ? "One explicit G1 approval is pending." : "No approvals are pending.",
        {
          project_id: projectId,
          ...(typeof state.run_id === "string" ? { run_id: state.run_id } : {}),
          details: { count: approvals.length, approvals },
        },
      );
    },
  },
  {
    name: "content_ops_submit_approval",
    title: "Submit Approval",
    description:
      "Record an explicit version-bound approval event through the existing Runtime; never infers satisfaction.",
    inputSchema: z
      .object({
        approval_id: z.string().regex(APPROVAL_ID),
        gate: z.enum(["PROJECT_PROFILE", "PAINPOINTS", "CONTENT_COPY", "FIRST_PAGE", "FINAL_SET"]),
        target_type: z.enum([
          "PROJECT",
          "PAINPOINT_BATCH",
          "CONTENT",
          "CONTENT_PACKAGE",
          "IMAGE_SET",
        ]),
        target_id: z.string().min(1).max(128),
        target_version: z.string().min(1).max(128),
        decision: z.enum(["APPROVE", "REVISE", "REJECT", "PAUSE"]),
        source_run_id: z.string().regex(RUN_ID),
        project_id: z.string().regex(PROJECT_ID),
        project_name: z.string().min(1).max(120),
        comment: z.string().max(1000),
        expected_version: z.string().min(1).max(128),
        project_profile_confirmation: projectProfile.optional(),
        painpoint_review_batch: painpointReviewBatchInput.optional(),
        content_copy_review: z.record(z.string(), z.unknown()).optional(),
        ...writeConfirmation,
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeOpen,
    async handler(context, input) {
      if (input.expected_version !== input.target_version)
        throw Object.assign(new Error("Approval target version does not match expected_version."), {
          code: "APPROVAL_STALE_OR_MISMATCHED",
        });
      const submittedReview = input.painpoint_review_batch as ResearchReviewBatch | undefined;
      const submittedContentReview = input.content_copy_review
        ? record(input.content_copy_review)
        : undefined;
      const approval = {
        approval_id: input.approval_id,
        gate: input.gate,
        target_type: input.target_type,
        target_id: input.target_id,
        target_version: input.target_version,
        decision: input.decision,
        comment: input.comment,
        source_run_id: input.source_run_id,
        created_at:
          input.gate === "PAINPOINTS" && submittedReview
            ? submittedReview.created_at
            : input.gate === "CONTENT_COPY" &&
                typeof submittedContentReview?.created_at === "string"
              ? submittedContentReview.created_at
              : new Date().toISOString(),
        deprecated_at: null,
        schema_version: "1.0.0",
      };
      await context.validateSchema("approval-event", approval);
      const approvalFile = await context.writeControlledJson(
        "approvals",
        String(input.approval_id),
        approval,
      );
      let confirmedProjectProfile: Record<string, unknown> | null = null;
      if (input.gate === "PROJECT_PROFILE" && input.decision === "APPROVE") {
        const currentProfile = await context.readProjectProfile(String(input.project_id));
        const submittedProfile = input.project_profile_confirmation
          ? record(input.project_profile_confirmation)
          : currentProfile;
        if (!submittedProfile)
          throw Object.assign(new Error("G1 approval requires a canonical Project Profile."), {
            code: "PROJECT_PROFILE_NOT_FOUND",
          });
        const expectedProfileVersion = `PROJECT-PROFILE-V${String(
          submittedProfile.configuration_version,
        )}`;
        if (
          submittedProfile.project_id !== input.project_id ||
          submittedProfile.last_run_id !== input.source_run_id ||
          expectedProfileVersion !== input.target_version
        )
          throw Object.assign(
            new Error("G1 Project Profile target, version or source Run is mismatched."),
            { code: "APPROVAL_STALE_OR_MISMATCHED" },
          );
        const submittedExtensions = record(submittedProfile.extensions);
        confirmedProjectProfile = {
          ...submittedProfile,
          project_status: "PROJECT_ACTIVE",
          config_confirmation_status: "CONFIG_CONFIRMED",
          updated_at: new Date().toISOString(),
          extensions: {
            ...submittedExtensions,
            inferred_fields: [],
          },
        };
        await context.validateProjectProfile(confirmedProjectProfile);
        const readiness = validateProjectResearchReadiness(confirmedProjectProfile);
        if (!readiness.ready)
          throw Object.assign(
            new Error(
              `Confirmed G1 Project Profile is not research-ready: ${readiness.material_blockers.join(
                ", ",
              )}.`,
            ),
            { code: "PROJECT_PROFILE_NOT_RESEARCH_READY" },
          );
      }
      if (input.gate === "PAINPOINTS") {
        const review = submittedReview;
        if (!review)
          throw Object.assign(new Error("G2 requires a painpoint_review_batch artifact."), {
            code: "PAINPOINT_REVIEW_BATCH_REQUIRED",
          });
        if (
          review.project_id !== input.project_id ||
          review.source_run_id !== input.source_run_id ||
          review.research_batch_id !== input.target_id ||
          String(review.painpoint_batch_version) !== input.target_version
        )
          throw Object.assign(new Error("G2 review target or version is mismatched."), {
            code: "APPROVAL_STALE_OR_MISMATCHED",
          });
        const decisions = review.items.map((item) => item.decision);
        const expectedCounts = {
          approved_count: decisions.filter((decision) => decision === "APPROVE").length,
          revision_required_count: decisions.filter((decision) => decision === "REVISE").length,
          rejected_count: decisions.filter((decision) => decision === "REJECT").length,
          paused_count: decisions.filter((decision) => decision === "PAUSE").length,
        };
        if (
          review.approved_count !== expectedCounts.approved_count ||
          review.revision_required_count !== expectedCounts.revision_required_count ||
          review.rejected_count !== expectedCounts.rejected_count ||
          review.paused_count !== expectedCounts.paused_count
        )
          throw Object.assign(new Error("G2 review summary counts are inconsistent."), {
            code: "PAINPOINT_REVIEW_COUNT_MISMATCH",
          });
        await context.validateSchema("painpoint-review-batch", review);
        const previous = record(
          await context.readResearchJson(
            String(input.project_id),
            String(input.source_run_id),
            "painpoint-review-batch.json",
          ),
        );
        const previousReviewVersion =
          typeof previous.review_version === "number" ? previous.review_version : 0;
        const exactReplay =
          previousReviewVersion === review.review_version &&
          JSON.stringify(previous) === JSON.stringify(review);
        if (previousReviewVersion >= review.review_version && !exactReplay)
          throw Object.assign(new Error("A different G2 review already exists at this version."), {
            code: "PAINPOINT_REVIEW_REPLAY_CONFLICT",
          });
        const batch = (await context.readResearchJson(
          String(input.project_id),
          String(input.source_run_id),
          "painpoint-batch.json",
        )) as ResearchPainpointBatch | null;
        if (!batch)
          throw Object.assign(new Error("The G2 painpoint batch artifact is missing."), {
            code: "PAINPOINT_BATCH_NOT_FOUND",
          });
        await context.writeResearchJson(
          String(input.project_id),
          String(input.source_run_id),
          "painpoint-review-batch.json",
          review,
        );
        const runtime = await context.researchRuntime(
          String(input.project_id),
          String(input.source_run_id),
        );
        const effect = await runtime.applyG2Review({
          review,
          batch,
          latestReviewVersion: exactReplay ? review.review_version - 1 : previousReviewVersion,
          idempotencyKey: String(input.request_id),
          confirmLiveWrite: true,
        });
        const decidedAt = review.created_at;
        const decisionByPainpoint = new Map(
          review.items.map((item) => [
            item.painpoint_id,
            item.decision === "APPROVE"
              ? "PAINPOINT_CONFIRMED"
              : item.decision === "REVISE"
                ? "PAINPOINT_REVISION_REQUIRED"
                : item.decision === "REJECT"
                  ? "PAINPOINT_REJECTED"
                  : "PAINPOINT_PAUSED",
          ]),
        );
        const reviewedBatch: ResearchPainpointBatch = {
          ...batch,
          painpoints: batch.painpoints.map((painpoint) => ({
            ...painpoint,
            review_status:
              decisionByPainpoint.get(painpoint.painpoint_id) ?? painpoint.review_status,
            updated_at: decisionByPainpoint.has(painpoint.painpoint_id)
              ? decidedAt
              : painpoint.updated_at,
          })),
        };
        await context.validateSchema("painpoint-batch", reviewedBatch);
        await context.writeResearchJson(
          String(input.project_id),
          String(input.source_run_id),
          "painpoint-batch.json",
          reviewedBatch,
        );
        void approvalFile;
        return envelope(
          "SUCCESS",
          "Explicit G2 approval and item decisions were recorded and read-verified.",
          {
            project_id: String(input.project_id),
            run_id: String(input.source_run_id),
            updated_records: effect.updated,
            next_action: "Call content_ops_verify_painpoint_batch.",
            details: {
              gate: "PAINPOINTS",
              decision: input.decision,
              item_decisions: effect.statuses,
              remote_update: "VERIFIED",
              remote_identifiers_exposed: false,
            },
          },
        );
      }
      if (input.gate === "CONTENT_COPY") {
        if (!context.liveWriteEnabled)
          throw Object.assign(new Error("CONTENT_OPS_ENABLE_LIVE_FEISHU must equal 1."), {
            code: "LIVE_WRITE_ENV_GATE_REQUIRED",
          });
        if (input.target_type !== "CONTENT_PACKAGE")
          throw Object.assign(new Error("G3 must target CONTENT_PACKAGE."), {
            code: "APPROVAL_TARGET_TYPE_INVALID",
          });
        if (!input.content_copy_review)
          throw Object.assign(new Error("G3 requires a content_copy_review artifact."), {
            code: "CONTENT_COPY_REVIEW_REQUIRED",
          });
        const review = record(input.content_copy_review);
        await context.validateSchema("content-copy-review", review);
        if (
          review.project_id !== input.project_id ||
          review.content_id !== input.target_id ||
          `${String(review.content_version)}:${String(review.copy_version)}` !==
            input.target_version ||
          review.source_run_id !== input.source_run_id ||
          review.decision !== input.decision
        )
          throw Object.assign(new Error("G3 review target, version, run or decision mismatched."), {
            code: "APPROVAL_STALE_OR_MISMATCHED",
          });
        const packageArtifact = record(
          await context.readContentJson(
            String(input.project_id),
            String(input.source_run_id),
            "content-package.json",
          ),
        );
        const quality = record(
          await context.readContentJson(
            String(input.project_id),
            String(input.source_run_id),
            "content-quality-report.json",
          ),
        );
        const content = record(packageArtifact.content_record);
        if (
          content.content_id !== input.target_id ||
          `${String(content.content_version)}:${String(content.copy_version)}` !==
            input.target_version
        )
          throw Object.assign(new Error("G3 target no longer matches the current package."), {
            code: "APPROVAL_STALE_OR_MISMATCHED",
          });
        if (input.decision === "APPROVE" && quality.ready_for_g3 !== true)
          throw Object.assign(new Error("G3 approval requires a passing quality report."), {
            code: "CONTENT_QUALITY_BLOCKED",
          });
        const runtime = await context.contentRuntime(
          String(input.project_id),
          String(input.source_run_id),
        );
        const effect = await runtime.applyG3({
          contentUniqueKey: String(content.record_unique_key),
          contentVersion: Number(String(content.content_version).replace(/^CV-/, "")),
          decision: input.decision as "APPROVE" | "REVISE" | "REJECT" | "PAUSE",
          reviewedAt: String(review.created_at),
          idempotencyKey: String(input.request_id),
          confirmLiveWrite: true,
        });
        await context.writeContentJson(
          String(input.project_id),
          String(input.source_run_id),
          "content-copy-review.json",
          review,
        );
        await context.writeContentJson(
          String(input.project_id),
          String(input.source_run_id),
          "result.json",
          {
            status: "SUCCESS",
            gate: "CONTENT_COPY",
            decision: input.decision,
            content_status: effect.status,
            eligible_for_visual_planning: input.decision === "APPROVE",
            visual_planning_started: false,
            created_at: review.created_at,
          },
        );
        return envelope("SUCCESS", "Explicit G3 decision was recorded and read-verified.", {
          project_id: String(input.project_id),
          run_id: String(input.source_run_id),
          updated_records: effect.reused ? 0 : 1,
          next_action:
            input.decision === "APPROVE"
              ? "Content is eligible for a future Visual Planning phase; no visual work was started."
              : "Use content_ops_plan_content_revision only when a revision is requested.",
          details: {
            gate: "CONTENT_COPY",
            decision: input.decision,
            content_status: effect.status,
            remote_update: "VERIFIED",
            eligible_for_visual_planning: input.decision === "APPROVE",
            visual_planning_started: false,
            remote_identifiers_exposed: false,
          },
        });
      }
      const { value } = await context.invokeCli([
        "run",
        "approve",
        "--project-id",
        String(input.project_id),
        "--project-name",
        String(input.project_name),
        "--run-id",
        String(input.source_run_id),
        "--approval",
        approvalFile,
        "--confirm-live-write",
      ]);
      if (confirmedProjectProfile)
        await context.writeControlledJson(
          "profiles",
          String(input.project_id),
          confirmedProjectProfile,
        );
      return envelope(
        "SUCCESS",
        "Explicit approval was recorded and the Runtime read-verified its effect.",
        {
          project_id: String(input.project_id),
          run_id: String(input.source_run_id),
          updated_records: 1,
          next_action: "Call content_ops_resume_run only if another legal checkpoint remains.",
          details: {
            gate: input.gate,
            decision: input.decision,
            remote_update: value.remote_update ?? "VERIFIED",
            project_profile_snapshot:
              confirmedProjectProfile === null ? "UNCHANGED" : "CONFIRMED_AND_READ_VERIFIED",
          },
        },
      );
    },
  },
  {
    name: "content_ops_resume_run",
    title: "Resume Run",
    description:
      "Resume from a legal checkpoint without bypassing approval or repeating verified remote resources.",
    inputSchema: z
      .object({
        ...runInput.shape,
        expected_version: z.string().min(1).max(128),
        ...writeConfirmation,
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeOpen,
    async handler(context, input) {
      const projectId = requireProject(input);
      const runId = requireRun(input);
      const [contentCheckpointValue, contentResultValue] = await Promise.all([
        context.readContentJson(projectId, runId, "checkpoint.json"),
        context.readContentJson(projectId, runId, "result.json"),
      ]);
      const contentCheckpoint = record(contentCheckpointValue);
      const contentResult = record(contentResultValue);
      if (
        contentCheckpoint.run_id === runId &&
        contentCheckpoint.gate === "CONTENT_COPY" &&
        contentCheckpoint.target_type === "CONTENT_PACKAGE"
      ) {
        if (contentCheckpoint.target_version !== input.expected_version)
          throw Object.assign(new Error("Content checkpoint version is stale or mismatched."), {
            code: "APPROVAL_STALE_OR_MISMATCHED",
          });
        if (contentResult.status === "SUCCESS" && contentResult.gate === "CONTENT_COPY")
          return envelope("SUCCESS", "G3 Content Run is complete; resume is an idempotent no-op.", {
            project_id: projectId,
            run_id: runId,
            details: {
              resume_status: "PASSED_NO_OP",
              repeated_verified_steps: 0,
              content_status: contentResult.content_status,
              eligible_for_visual_planning: contentResult.eligible_for_visual_planning === true,
              visual_planning_started: false,
            },
          });
        return envelope(
          "AWAITING_APPROVAL",
          "Content Run remains paused at G3; approval cannot be bypassed.",
          {
            project_id: projectId,
            run_id: runId,
            next_action: "Submit the explicit pending G3 decision before resuming.",
          },
        );
      }
      const state = await requireState(context, projectId);
      if (state.run_id !== runId)
        throw Object.assign(new Error("Run ID does not match project state."), {
          code: "RUN_PROJECT_MISMATCH",
        });
      if (state.overall_status === "AWAITING_APPROVAL")
        return envelope(
          "AWAITING_APPROVAL",
          "Run remains paused at G1; approval cannot be bypassed.",
          {
            project_id: projectId,
            run_id: runId,
            next_action: "Submit the explicit pending approval before resuming.",
          },
        );
      if (state.overall_status === "SUCCESS")
        return envelope("SUCCESS", "Run is already complete; resume is an idempotent no-op.", {
          project_id: projectId,
          run_id: runId,
          details: { resume_status: "PASSED_NO_OP", repeated_verified_steps: 0 },
        });
      throw Object.assign(
        new Error("No supported legal resume action exists for the current state."),
        {
          code: "RUN_RESUME_BLOCKED",
        },
      );
    },
  },
  {
    name: "content_ops_get_research_context",
    title: "Get Research Context",
    description:
      "Read the confirmed Project Profile, Pack bindings, current Workspace summary and painpoint-research readiness without exposing remote identifiers.",
    inputSchema: projectInput,
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = requireProject(input);
      const { profile, readiness } = await requireResearchProfile(context, projectId);
      const state = await requireState(context, projectId);
      return envelope("SUCCESS", "Project is ready for evidence-backed painpoint research.", {
        project_id: projectId,
        ...(typeof state.run_id === "string" ? { run_id: state.run_id } : {}),
        next_action: "Call content_ops_plan_painpoint_research before acquiring sources.",
        details: {
          operator_role_separate: record(profile.operator_notes).role === "OPERATOR",
          subject_role_separate: record(profile.subject).role === "SUBJECT",
          audience_role_separate: record(profile.audience_profile).role === "AUDIENCE",
          project_status: profile.project_status,
          configuration_status: profile.config_confirmation_status,
          profile_version: profile.configuration_version,
          primary_platform: profile.primary_platform,
          platform_pack: profile.platform_pack,
          industry_pack: profile.industry_pack,
          subject_summary: {
            subject_type: profile.subject_type,
            industry: profile.industry,
            professional_advantages: profile.professional_advantages,
          },
          audience_summary: profile.audience_profile,
          material_blockers: readiness.material_blockers,
          non_blocking_gaps: readiness.non_blocking_gaps,
          remote_identifiers_exposed: false,
        },
      });
    },
  },
  {
    name: "content_ops_plan_painpoint_research",
    title: "Plan Painpoint Research",
    description:
      "Create and persist a no-network, no-remote-write research plan bound to the active Profile, Packs and Run.",
    inputSchema: z
      .object({
        ...runInput.shape,
        requested_count: z.number().int().min(1).max(100).default(30),
        minimum_acceptable_count: z.number().int().min(1).max(100),
        allow_hypothesis_candidates: z.boolean().default(false),
        research_objective: z.string().min(1).max(1000),
        audience_segments: z.array(z.string().min(1).max(300)).min(1).max(20),
        decision_stages: z
          .array(
            z.enum([
              "PROBLEM_AWARENESS",
              "ACTIVE_SEARCH",
              "SOLUTION_COMPARISON",
              "RISK_EVALUATION",
              "PURCHASE_DECISION",
              "USAGE_EXPERIENCE",
              "REPURCHASE_REFERRAL",
            ]),
          )
          .min(1),
        business_scenarios: z.array(z.string().min(1).max(500)).min(1).max(30),
        region_scope: z.array(z.string().min(1).max(100)).min(1).max(20),
        date_from: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .nullable(),
        date_to: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .nullable(),
        language_scope: z.array(z.string().min(2).max(20)).min(1).max(10),
        query_plan: z
          .array(
            z
              .object({
                query_id: z.string().regex(/^Q-[A-Z0-9-]+$/),
                query: z.string().min(1).max(500),
                purpose: z.string().min(1).max(500),
                source_types: z.array(z.string().min(1).max(80)).min(1).max(10),
              })
              .strict(),
          )
          .min(1)
          .max(30),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = requireProject(input);
      const runId = requireRun(input);
      const { profile } = await requireResearchProfile(context, projectId);
      await requireState(context, projectId);
      if (Number(input.minimum_acceptable_count) > Number(input.requested_count))
        throw Object.assign(new Error("minimum_acceptable_count exceeds requested_count."), {
          code: "RESEARCH_COUNT_POLICY_INVALID",
        });
      const { planId } = researchIds(runId);
      const planSeed = {
        project_id: projectId,
        run_id: runId,
        profile_version: profile.configuration_version,
        requested_count: input.requested_count,
        query_plan: input.query_plan,
      };
      const planHash = context.hash(planSeed);
      const retainedPlan = record(
        await context.readResearchJson(projectId, runId, "painpoint-research-plan.json"),
      );
      const createdAt =
        retainedPlan.plan_hash === planHash && typeof retainedPlan.created_at === "string"
          ? retainedPlan.created_at
          : new Date().toISOString();
      const plan = {
        research_plan_id: planId,
        project_id: projectId,
        run_id: runId,
        project_profile_version: Number(profile.configuration_version),
        platform_pack: versionedPack(profile.platform_pack),
        industry_pack: versionedPack(profile.industry_pack),
        requested_count: Number(input.requested_count),
        minimum_acceptable_count: Number(input.minimum_acceptable_count),
        allow_hypothesis_candidates: Boolean(input.allow_hypothesis_candidates),
        research_objective: input.research_objective,
        audience_segments: input.audience_segments,
        decision_stages: input.decision_stages,
        business_scenarios: input.business_scenarios,
        region_scope: input.region_scope,
        date_scope: { from: input.date_from, to: input.date_to },
        language_scope: input.language_scope,
        source_strategy: [
          "Host-native current public research with visible citations",
          "Manual project sources when supplied by the Operator",
        ],
        query_plan: input.query_plan,
        user_material_refs: [],
        required_source_mix: {
          minimum_sources: 3,
          minimum_source_types: 2,
          require_official_or_first_party: true,
        },
        evidence_requirements: [
          "Every candidate references retained evidence.",
          "B confidence requires two independent sources.",
          "Public comments and news do not prove market prevalence by themselves.",
        ],
        deduplication_policy: [
          "Exact normalized identity, URL and content-hash deduplication only.",
          "Near-semantic decisions require a retained host model reason.",
        ],
        scoring_policy: {
          policy_id: "painpoint-weighted-v1",
          policy_version: "1.0.0",
          core_threshold: 80,
          important_threshold: 65,
        },
        expected_artifacts: [
          "research-source-manifest.json",
          "evidence-records.json",
          "painpoint-candidates.json",
          "painpoint-scoring-records.json",
          "painpoint-research-report.json",
          "painpoint-batch.json",
        ],
        capability_requirements: ["host_native_web_research", "official_lark_cli_workspace"],
        plan_hash: planHash,
        created_at: createdAt,
        schema_version: "1.0.0",
        extensions: {},
      };
      await context.validateSchema("painpoint-research-plan", plan);
      await context.writeResearchJson(projectId, runId, "painpoint-research-plan.json", plan);
      const session = await context.researchAdapter(projectId, runId).createResearchSession(plan);
      return envelope("SUCCESS", "Research plan is valid; no network or remote write occurred.", {
        project_id: projectId,
        run_id: runId,
        next_action:
          "Use host-native search/open tools, retain citations, then call content_ops_submit_research_sources.",
        details: {
          research_plan: plan,
          session_status: session.status,
          host_performs_network: true,
          mcp_performs_network: false,
          remote_write_attempted: false,
        },
      });
    },
  },
  {
    name: "content_ops_submit_research_sources",
    title: "Submit Research Sources",
    description:
      "Validate, normalize, deduplicate and persist bounded host/manual source summaries; never fetches their locations.",
    inputSchema: z
      .object({
        ...runInput.shape,
        research_plan_id: z.string().regex(RESEARCH_PLAN_ID),
        sources: z.array(researchSourceInput).min(1).max(100),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeOpen,
    async handler(context, input) {
      const projectId = requireProject(input);
      const runId = requireRun(input);
      const normalized = (input.sources as z.infer<typeof researchSourceInput>[]).map((source) => {
        const { content_hash: providedHash, ...sourceWithoutHash } = source;
        return normalizeResearchSource({
          ...sourceWithoutHash,
          ...(providedHash ? { content_hash: providedHash } : {}),
          duplicate_of: null,
          extensions: {},
        });
      });
      const adapter = context.researchAdapter(projectId, runId);
      const deduplicated = await adapter.normalizeSources(normalized);
      if (deduplicated.unique.length === 0)
        throw Object.assign(new Error("No unique source remained after validation."), {
          code: "INSUFFICIENT_EVIDENCE",
        });
      const at = new Date().toISOString();
      const counts = Object.fromEntries(
        [...new Set(deduplicated.unique.map((source) => source.source_type))].map((type) => [
          type,
          deduplicated.unique.filter((source) => source.source_type === type).length,
        ]),
      );
      const manifest = {
        manifest_id: `RSM-${runId.replace(/^RUN-/, "")}`,
        research_plan_id: input.research_plan_id,
        project_id: projectId,
        run_id: runId,
        sources: deduplicated.unique,
        source_count: deduplicated.unique.length,
        source_type_counts: counts,
        duplicate_source_count: deduplicated.duplicates.length,
        rejected_source_count: 0,
        retrieved_at: at,
        schema_version: "1.0.0",
        extensions: {},
      };
      const evidence: ResearchEvidence[] = deduplicated.unique.map((source) => ({
        evidence_id: `E-${source.source_id.replace(/^SRC-/, "")}`,
        project_id: projectId,
        source_type: source.source_type,
        source_name: source.title,
        source_location: source.source_location,
        source_date: source.source_date,
        retrieved_at: source.retrieved_at,
        summary: source.summary,
        supported_claims: source.supported_claims,
        confidence: source.is_first_party ? "A_DIRECT_STRONG" : "C_SINGLE_OR_INDIRECT",
        is_first_party: source.is_first_party,
        citation_locator: source.source_location,
        limitations: source.limitations,
        run_id: runId,
        schema_version: "1.0.0",
        created_at: at,
        updated_at: at,
        extensions: { source_id: source.source_id, content_hash: source.content_hash },
      }));
      await context.validateSchema("research-source-manifest", manifest);
      for (const item of evidence) await context.validateSchema("evidence-record", item);
      await adapter.ingestSources(String(input.research_plan_id), manifest);
      await adapter.validateEvidence(evidence);
      await context.writeResearchJson(projectId, runId, "research-source-manifest.json", manifest);
      await context.writeResearchJson(projectId, runId, "evidence-records.json", evidence);
      return envelope(
        "SUCCESS",
        `Retained ${deduplicated.unique.length} unique research source(s).`,
        {
          project_id: projectId,
          run_id: runId,
          created_records: evidence.length,
          next_action:
            "Analyze these sources in the host and call content_ops_submit_painpoint_candidates.",
          details: {
            source_count: deduplicated.unique.length,
            source_type_count: Object.keys(counts).length,
            duplicate_source_count: deduplicated.duplicates.length,
            official_or_first_party_present: deduplicated.unique.some(
              (source) => source.source_type === "OFFICIAL_SOURCE" || source.is_first_party,
            ),
            full_page_bodies_stored: false,
            external_fetch_performed: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_submit_painpoint_candidates",
    title: "Submit Painpoint Candidates",
    description:
      "Validate host-analyzed candidates, evidence references, deterministic scores, D-grade restrictions and exact duplicates, then persist local artifacts only.",
    inputSchema: z
      .object({
        ...runInput.shape,
        research_plan_id: z.string().regex(RESEARCH_PLAN_ID),
        candidates: z.array(painpointCandidateInput).min(1).max(100),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: writeLocalClosed,
    async handler(context, input) {
      const projectId = requireProject(input);
      const runId = requireRun(input);
      const plan = record(
        await context.readResearchJson(projectId, runId, "painpoint-research-plan.json"),
      );
      const evidence = (await context.readResearchJson(
        projectId,
        runId,
        "evidence-records.json",
      )) as ResearchEvidence[] | null;
      if (!evidence?.length)
        throw Object.assign(new Error("Research sources must be submitted before candidates."), {
          code: "RESEARCH_EVIDENCE_REQUIRED",
        });
      const { batchId } = researchIds(runId);
      const at = new Date().toISOString();
      const retainedCandidates = (await context.readResearchJson(
        projectId,
        runId,
        "painpoint-candidates.json",
      )) as ResearchPainpoint[] | null;
      const retainedById = new Map(
        (retainedCandidates ?? []).map((painpoint) => [painpoint.painpoint_id, painpoint]),
      );
      const compiled = (input.candidates as z.infer<typeof painpointCandidateInput>[]).map(
        (candidate) => {
          const retained = retainedById.get(candidate.painpoint_id);
          const built = buildPainpointRecord({
            candidate,
            projectId,
            runId,
            batchId,
            at:
              retained?.record_unique_key ===
                `${projectId}::painpoint::${candidate.painpoint_id}` && retained.version === 1
                ? retained.created_at
                : at,
          });
          if (retained && built.painpoint.created_at === retained.created_at)
            built.painpoint.updated_at = retained.updated_at;
          return built;
        },
      );
      const sourceByEvidence = new Map(
        evidence.map((item) => {
          const contentHash = record(item.extensions).content_hash;
          return [
            item.evidence_id,
            typeof contentHash === "string" ? contentHash : item.evidence_id,
          ];
        }),
      );
      const referenceErrors = validateEvidenceReferences(
        compiled.map((item) => item.painpoint),
        evidence.map((item) => item.evidence_id),
        sourceByEvidence,
      );
      if (referenceErrors.length)
        throw Object.assign(new Error(referenceErrors.join(", ")), {
          code: "RESEARCH_EVIDENCE_REFERENCE_INVALID",
        });
      const painpoints = compiled.map((item) => item.painpoint);
      const scoring = compiled.map((item) => item.scoring);
      const adapter = context.researchAdapter(projectId, runId);
      await adapter.validatePainpointCandidates(
        painpoints,
        plan.allow_hypothesis_candidates === true,
      );
      for (const item of scoring) await context.validateSchema("painpoint-scoring-record", item);
      await adapter.ingestPainpointCandidates(String(input.research_plan_id), painpoints);
      await context.writeResearchJson(projectId, runId, "painpoint-candidates.json", painpoints);
      await context.writeResearchJson(projectId, runId, "painpoint-scoring-records.json", scoring);
      return envelope("SUCCESS", `Retained ${painpoints.length} scored pending candidate(s).`, {
        project_id: projectId,
        run_id: runId,
        created_records: painpoints.length,
        next_action:
          "Review the honest produced count, then explicitly confirm content_ops_finalize_painpoint_research.",
        details: {
          requested_count: plan.requested_count,
          produced_count: painpoints.length,
          evidence_backed_count: painpoints.filter(
            (item) => item.evidence_confidence !== "D_HYPOTHESIS",
          ).length,
          hypothesis_count: painpoints.filter((item) => item.evidence_confidence === "D_HYPOTHESIS")
            .length,
          remote_write_attempted: false,
        },
      });
    },
  },
  {
    name: "content_ops_finalize_painpoint_research",
    title: "Finalize Painpoint Research",
    description:
      "Build the strict research report and idempotently write pending painpoints to the existing Feishu table, read-verify, checkpoint and stop at G2.",
    inputSchema: z
      .object({
        ...runInput.shape,
        research_plan_id: z.string().regex(RESEARCH_PLAN_ID),
        insufficiency_reason: z.string().min(1).max(1000).nullable(),
        decision_chain_summary: z.string().min(1).max(2000),
        business_scenario_summary: z.string().min(1).max(2000),
        audience_summary: z.string().min(1).max(2000),
        source_limitations: z.array(z.string().min(1).max(1000)).max(30),
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
      const projectId = requireProject(input);
      const runId = requireRun(input);
      const plan = record(
        await context.readResearchJson(projectId, runId, "painpoint-research-plan.json"),
      );
      const profile = await context.readProjectProfile(projectId);
      const manifest = record(
        await context.readResearchJson(projectId, runId, "research-source-manifest.json"),
      );
      const evidence = (await context.readResearchJson(
        projectId,
        runId,
        "evidence-records.json",
      )) as ResearchEvidence[] | null;
      const painpoints = (await context.readResearchJson(
        projectId,
        runId,
        "painpoint-candidates.json",
      )) as ResearchPainpoint[] | null;
      const scoring = (await context.readResearchJson(
        projectId,
        runId,
        "painpoint-scoring-records.json",
      )) as Record<string, unknown>[] | null;
      if (!profile || !evidence?.length || !painpoints?.length || !scoring?.length)
        throw Object.assign(new Error("Research artifacts are incomplete."), {
          code: "RESEARCH_ARTIFACTS_INCOMPLETE",
        });
      const requested = Number(plan.requested_count);
      if (painpoints.length < requested && input.insufficiency_reason === null)
        throw Object.assign(new Error("A lower produced count requires insufficiency_reason."), {
          code: "RESEARCH_COUNT_REASON_REQUIRED",
        });
      const { batchId } = researchIds(runId);
      const at = new Date().toISOString();
      const g2Approval = {
        approval_id: approvalIdForRun(runId),
        gate: "PAINPOINTS",
        target_type: "PAINPOINT_BATCH",
        target_id: batchId,
        target_version: "1",
        decision: "PAUSE",
        comment: "Awaiting explicit item-level G2 decisions.",
        source_run_id: runId,
        created_at: at,
        deprecated_at: null,
        schema_version: "1.0.0",
      };
      const batch: ResearchPainpointBatch = {
        research_batch_id: batchId,
        project_id: projectId,
        requested_count: requested,
        produced_count: painpoints.length,
        evidence_backed_count: painpoints.filter(
          (item) => item.evidence_confidence !== "D_HYPOTHESIS",
        ).length,
        hypothesis_count: painpoints.filter((item) => item.evidence_confidence === "D_HYPOTHESIS")
          .length,
        research_scope: String(plan.research_objective),
        date_range: record(plan.date_scope),
        region_scope: plan.region_scope,
        painpoints,
        evidence_records: evidence,
        deduplication_summary:
          "Deterministic source URL/hash and exact painpoint identity checks passed; no embedding claim.",
        partial_failures: [],
        write_summary: "Pending records planned for the existing painpoint table.",
        approval_request: g2Approval,
        run_id: runId,
        schema_version: "1.0.0",
        created_at: at,
        completion_status: painpoints.length >= requested ? "COMPLETE" : "PARTIAL",
      };
      const report = {
        report_id: `RPT-${runId.replace(/^RUN-/, "")}-RESEARCH`,
        research_plan: plan,
        project_profile_snapshot: profile,
        source_manifest: manifest,
        evidence_records: evidence,
        painpoint_candidates: painpoints,
        scoring_records: scoring,
        requested_count: requested,
        produced_count: painpoints.length,
        evidence_backed_count: batch.evidence_backed_count,
        hypothesis_count: batch.hypothesis_count,
        insufficiency_reason: input.insufficiency_reason,
        decision_chain_summary: input.decision_chain_summary,
        business_scenario_summary: input.business_scenario_summary,
        audience_summary: input.audience_summary,
        deduplication_report: batch.deduplication_summary,
        coverage_report: `Produced ${painpoints.length} of ${requested} requested items from ${String(manifest.source_count)} retained sources.`,
        source_limitations: input.source_limitations,
        recommended_painpoints: painpoints
          .filter((item) => item.evidence_confidence !== "D_HYPOTHESIS")
          .map((item) => item.painpoint_id),
        deferred_candidates: painpoints
          .filter((item) => item.evidence_confidence === "D_HYPOTHESIS")
          .map((item) => item.painpoint_id),
        rejected_candidates: [],
        final_painpoint_batch: batch,
        g2_approval_request: g2Approval,
        created_at: at,
        run_id: runId,
        schema_version: "1.0.0",
        extensions: {},
      };
      await context.validateSchema("painpoint-batch", batch);
      await context.validateSchema("painpoint-research-report", report);
      const adapter = context.researchAdapter(projectId, runId);
      await adapter.buildResearchReport(String(input.research_plan_id), report);
      const runtime = await context.researchRuntime(projectId, runId);
      const write = await runtime.finalizePainpoints({
        sessionId: String(input.research_plan_id),
        batch,
        allowHypothesisCandidates: plan.allow_hypothesis_candidates === true,
        idempotencyKey: String(input.idempotency_key),
        confirmLiveWrite: true,
      });
      await adapter.finalizePainpointBatch(String(input.research_plan_id), batch);
      await context.writeResearchJson(projectId, runId, "painpoint-research-report.json", report);
      await context.writeResearchJson(projectId, runId, "painpoint-batch.json", batch);
      return envelope(
        "AWAITING_APPROVAL",
        "Painpoints were read-verified and stopped at G2 PAINPOINTS.",
        {
          project_id: projectId,
          run_id: runId,
          created_records: write.created,
          approval_request: {
            gate: "PAINPOINTS",
            target_type: "PAINPOINT_BATCH",
            target_id: batchId,
            target_version: "1",
            source_run_id: runId,
          },
          next_action:
            "Collect item-level APPROVE/REVISE/REJECT/PAUSE decisions, then call content_ops_submit_approval with painpoint_review_batch.",
          details: {
            requested_count: requested,
            produced_count: painpoints.length,
            writes_attempted: write.attempted,
            writes_succeeded: write.succeeded,
            writes_failed: write.failed,
            remote_records_created: write.created,
            existing_records_reused: write.reused,
            remote_identifiers_exposed: false,
            duplicate_records_created: false,
          },
        },
      );
    },
  },
  {
    name: "content_ops_list_painpoints",
    title: "List Painpoints",
    description:
      "Read painpoint records for one project through the configured Workspace Adapter without exposing remote record identifiers.",
    inputSchema: projectInput,
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = requireProject(input);
      const workspace = await context.painpointWorkspace(projectId);
      const projectField = workspace.fieldMap.find(
        (item) => item.logicalKey === "painpointsProjectId",
      );
      if (!projectField)
        throw Object.assign(new Error("Project field mapping is missing."), {
          code: "WORKSPACE_MAPPING_MISSING",
        });
      const rows = await workspace.adapter.searchRecords(workspace.tableId, "painpoints", {
        conjunction: "and",
        conditions: [
          { field_name: projectField.currentFieldName, operator: "is", value: [projectId] },
        ],
        limit: 200,
      });
      const logical = rows.map((row) => toLogicalFields(row.fields, workspace.fieldMap));
      return envelope("SUCCESS", `Found ${logical.length} painpoint record(s).`, {
        project_id: projectId,
        details: { count: logical.length, painpoints: logical, remote_identifiers_exposed: false },
      });
    },
  },
  {
    name: "content_ops_get_painpoint",
    title: "Get Painpoint",
    description:
      "Read one project painpoint by stable logical ID and unique key without exposing its remote record identifier.",
    inputSchema: z
      .object({
        project_id: z.string().regex(PROJECT_ID),
        painpoint_id: z.string().regex(PAINPOINT_ID),
      })
      .strict(),
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = requireProject(input);
      const workspace = await context.painpointWorkspace(projectId);
      const uniqueKey = `${projectId}::painpoint::${String(input.painpoint_id)}`;
      const row = await workspace.adapter.findRecordByUniqueKey(uniqueKey, {
        tableId: workspace.tableId,
        tableLogicalKey: "painpoints",
        uniqueFieldLogicalKey: "painpointsRecordUniqueKey",
      });
      if (!row)
        throw Object.assign(new Error("Painpoint was not found."), { code: "PAINPOINT_NOT_FOUND" });
      return envelope("SUCCESS", `Painpoint ${String(input.painpoint_id)} was read.`, {
        project_id: projectId,
        details: {
          painpoint: toLogicalFields(row.fields, workspace.fieldMap),
          remote_identifiers_exposed: false,
        },
      });
    },
  },
  {
    name: "content_ops_verify_painpoint_batch",
    title: "Verify Painpoint Batch",
    description:
      "Read-verify every retained painpoint in one Research Batch against the existing Feishu table and report idempotency-safe counts.",
    inputSchema: runInput,
    outputSchema: resultEnvelopeSchema,
    annotations: readOnly,
    async handler(context, input) {
      const projectId = requireProject(input);
      const runId = requireRun(input);
      const batch = (await context.readResearchJson(
        projectId,
        runId,
        "painpoint-batch.json",
      )) as ResearchPainpointBatch | null;
      if (!batch)
        throw Object.assign(new Error("Painpoint batch artifact was not found."), {
          code: "PAINPOINT_BATCH_NOT_FOUND",
        });
      const workspace = await context.painpointWorkspace(projectId);
      const evidence = new Map(batch.evidence_records.map((item) => [item.evidence_id, item]));
      let verified = 0;
      for (const painpoint of batch.painpoints) {
        const row = await workspace.adapter.findRecordByUniqueKey(painpoint.record_unique_key, {
          tableId: workspace.tableId,
          tableLogicalKey: "painpoints",
          uniqueFieldLogicalKey: "painpointsRecordUniqueKey",
        });
        if (!row) continue;
        const expected = compilePainpointFeishuFields(
          painpoint,
          painpoint.evidence_refs.flatMap((reference) => {
            const item = evidence.get(reference);
            return item ? [item] : [];
          }),
        );
        if (await workspace.adapter.verifyWrite(row, expected)) verified += 1;
      }
      const matched = verified === batch.painpoints.length;
      return envelope(
        matched ? "SUCCESS" : "BLOCKED",
        matched
          ? "Every batch record passed remote read verification."
          : "One or more batch records failed remote verification.",
        {
          project_id: projectId,
          run_id: runId,
          details: {
            research_batch_id: batch.research_batch_id,
            expected_count: batch.painpoints.length,
            verified_count: verified,
            failed_count: batch.painpoints.length - verified,
            duplicate_records_detected: false,
            remote_identifiers_exposed: false,
          },
        },
      );
    },
  },
  ...CONTENT_TOOL_DEFINITIONS,
  ...VISUAL_TOOL_DEFINITIONS,
  ...RENDERER_TOOL_DEFINITIONS,
  ...IMAGE_PRODUCTION_TOOL_DEFINITIONS,
  ...FINALIZATION_TOOL_DEFINITIONS,
] as const;

export const TOOL_NAMES = TOOL_DEFINITIONS.map((tool) => tool.name);
