import type {
  RunPlan,
  TaskEnvelope,
  WorkflowDefinition,
} from "../../../contracts/src/generated/1.0/index.js";
import type { RuntimeMode } from "../types.js";
import { canonicalJson, sha256 } from "../storage/index.js";
import { RuntimeFailure } from "../types.js";
import { assertWorkflowMode } from "../config/index.js";

export interface StepContext {
  runId: string;
  projectId: string;
  stepId: string;
  artifacts: Record<string, unknown>;
}

export interface StepHandler {
  mockOnly: boolean;
  execute(context: StepContext): Promise<Record<string, unknown>>;
}

export class StepHandlerRegistry {
  readonly #handlers = new Map<string, StepHandler>();
  register(name: string, handler: StepHandler): void {
    if (this.#handlers.has(name))
      throw new RuntimeFailure("HANDLER_DUPLICATE", `Handler ${name} is already registered.`, 3);
    this.#handlers.set(name, handler);
  }
  has(name: string): boolean {
    return this.#handlers.has(name);
  }
  get(name: string): StepHandler {
    const handler = this.#handlers.get(name);
    if (!handler) throw new RuntimeFailure("HANDLER_NOT_FOUND", `Handler ${name} is missing.`, 2);
    return handler;
  }
}

export class WorkflowRegistry {
  readonly #workflows = new Map<string, WorkflowDefinition>();
  constructor(private readonly handlers: StepHandlerRegistry) {}

  registerWorkflow(workflow: WorkflowDefinition): void {
    validateWorkflowDefinition(workflow, this.handlers);
    const key = `${workflow.workflow_id}@${workflow.workflow_version}`;
    if (this.#workflows.has(key))
      throw new RuntimeFailure("WORKFLOW_DUPLICATE", `Workflow ${key} already exists.`, 3);
    this.#workflows.set(key, structuredClone(workflow));
  }

  loadWorkflowDefinition(id: string, version = "1.0.0"): WorkflowDefinition {
    const workflow = this.#workflows.get(`${id}@${version}`);
    if (!workflow)
      throw new RuntimeFailure("WORKFLOW_NOT_FOUND", `Workflow ${id}@${version} missing.`, 5);
    return structuredClone(workflow);
  }
}

export function detectWorkflowCycles(workflow: WorkflowDefinition): string[] {
  const graph = new Map(workflow.steps.map((step) => [step.step_id, step.depends_on]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const cycles: string[] = [];
  function visit(step: string): void {
    if (visiting.has(step)) {
      cycles.push(step);
      return;
    }
    if (visited.has(step)) return;
    visiting.add(step);
    for (const dependency of graph.get(step) ?? []) visit(dependency);
    visiting.delete(step);
    visited.add(step);
  }
  for (const step of graph.keys()) visit(step);
  return cycles;
}

export function resolveStepDependencies(workflow: WorkflowDefinition): string[] {
  const byId = new Map(workflow.steps.map((step) => [step.step_id, step]));
  const output: string[] = [];
  const visited = new Set<string>();
  function add(stepId: string): void {
    if (visited.has(stepId)) return;
    const step = byId.get(stepId);
    if (!step) throw new RuntimeFailure("WORKFLOW_DEPENDENCY_MISSING", stepId, 5);
    for (const dependency of step.depends_on) add(dependency);
    visited.add(stepId);
    output.push(stepId);
  }
  for (const step of [...workflow.steps].sort((left, right) => left.sequence - right.sequence))
    add(step.step_id);
  return output;
}

export function validateWorkflowDefinition(
  workflow: WorkflowDefinition,
  handlers: StepHandlerRegistry,
): void {
  const ids = new Set<string>();
  const sequences = new Set<number>();
  for (const step of workflow.steps) {
    if (ids.has(step.step_id)) throw new RuntimeFailure("WORKFLOW_STEP_DUPLICATE", step.step_id, 5);
    if (sequences.has(step.sequence))
      throw new RuntimeFailure("WORKFLOW_SEQUENCE_DUPLICATE", String(step.sequence), 5);
    ids.add(step.step_id);
    sequences.add(step.sequence);
    if (!handlers.has(step.handler))
      throw new RuntimeFailure("WORKFLOW_HANDLER_MISSING", step.handler, 5);
    if (step.failure_policy === "AWAIT_APPROVAL" && !step.approval_gate)
      throw new RuntimeFailure("WORKFLOW_GATE_MISSING", step.step_id, 5);
  }
  for (const step of workflow.steps)
    for (const dependency of step.depends_on)
      if (!ids.has(dependency))
        throw new RuntimeFailure("WORKFLOW_DEPENDENCY_MISSING", dependency, 5);
  if (detectWorkflowCycles(workflow).length)
    throw new RuntimeFailure("WORKFLOW_CYCLE", "Workflow dependency cycle detected.", 5);
  resolveStepDependencies(workflow);
}

export interface BuildRunPlanInput {
  runId: string;
  projectId: string;
  mode: RuntimeMode;
  workflow: WorkflowDefinition;
  taskEnvelope: TaskEnvelope;
  projectSnapshotId: string;
  packResolutionId: string;
  createdAt: string;
  parentRunId?: string | null;
  resumeFromRunId?: string | null;
}

export function buildRunPlan(input: BuildRunPlanInput): RunPlan {
  const fixtureOnly = input.workflow.extensions.mock_only === true;
  assertWorkflowMode(input.mode, input.workflow.supported_runtime_modes, fixtureOnly);
  const ordered = resolveStepDependencies(input.workflow);
  const stepsById = new Map(input.workflow.steps.map((step) => [step.step_id, step]));
  return {
    run_id: input.runId,
    project_id: input.projectId,
    workflow_id: input.workflow.workflow_id,
    workflow_version: input.workflow.workflow_version,
    task_envelope: structuredClone(input.taskEnvelope),
    runtime_mode: input.mode,
    project_snapshot_id: input.projectSnapshotId,
    pack_resolution_id: input.packResolutionId,
    steps: ordered.map((stepId) => ({
      step_id: stepId,
      sequence: stepsById.get(stepId)?.sequence ?? 0,
      status: "PENDING",
      attempts: 0,
    })) as RunPlan["steps"],
    current_step_id: ordered[0] ?? null,
    completed_step_ids: [],
    failed_step_ids: [],
    skipped_step_ids: [],
    pending_approval: null,
    capability_report: input.workflow.capability_requirements.map((capability) => ({
      capability,
      status: "UNKNOWN",
    })),
    idempotency_key: sha256(
      canonicalJson({
        project_id: input.projectId,
        workflow_id: input.workflow.workflow_id,
        workflow_version: input.workflow.workflow_version,
        task_envelope: input.taskEnvelope,
      }),
    ),
    parent_run_id: input.parentRunId ?? null,
    resume_from_run_id: input.resumeFromRunId ?? null,
    plan_status: "RUN_CREATED",
    created_at: input.createdAt,
    updated_at: input.createdAt,
    schema_version: "1.0.0",
    extensions: { workflow_hash: sha256(canonicalJson(input.workflow)) },
  };
}

function step(
  stepId: string,
  sequence: number,
  dependency: string | null,
  ownerSkill: WorkflowDefinition["steps"][number]["owner_skill"],
  options: {
    gate?: WorkflowDefinition["steps"][number]["approval_gate"];
    checkpoint?: boolean;
    capabilities?: string[];
    handler?: string;
  } = {},
): WorkflowDefinition["steps"][number] {
  return {
    step_id: stepId,
    sequence,
    owner_skill: ownerSkill,
    handler: options.handler ?? "executeReferenceStep",
    depends_on: dependency ? [dependency] : [],
    required_capabilities: options.capabilities ?? [],
    input_artifacts: [],
    output_artifacts: [stepId],
    state_transition: null,
    idempotency_scope: options.gate ? "APPROVAL" : "STEP",
    retry_policy: { max_attempts: 2, retry_failed_only: true },
    checkpoint_after: options.checkpoint ?? false,
    approval_gate: options.gate ?? null,
    failure_policy: options.gate ? "AWAIT_APPROVAL" : "BLOCK",
  };
}

function linearSteps(
  definitions: Array<{
    id: string;
    owner: WorkflowDefinition["steps"][number]["owner_skill"];
    gate?: WorkflowDefinition["steps"][number]["approval_gate"];
    checkpoint?: boolean;
    capabilities?: string[];
  }>,
): WorkflowDefinition["steps"] {
  if (definitions.length === 0)
    throw new RuntimeFailure("WORKFLOW_STEPS_EMPTY", "Workflow needs at least one step.", 5);
  return definitions.map((definition, index) => {
    const options: Parameters<typeof step>[4] = {};
    if (definition.gate !== undefined) options.gate = definition.gate;
    if (definition.checkpoint !== undefined) options.checkpoint = definition.checkpoint;
    if (definition.capabilities !== undefined) options.capabilities = definition.capabilities;
    return step(
      definition.id,
      index + 1,
      definitions[index - 1]?.id ?? null,
      definition.owner,
      options,
    );
  }) as WorkflowDefinition["steps"];
}

export const PROJECT_INITIALIZATION_LOCAL_V1: WorkflowDefinition = {
  workflow_id: "PROJECT_INITIALIZATION_LOCAL_V1",
  workflow_version: "1.0.0",
  display_name: "Local project initialization fixture",
  description: "MOCK-only project registry, Pack, workspace, G1, and recovery workflow.",
  supported_runtime_modes: ["MOCK"],
  task_types: ["PROJECT_INITIALIZATION"],
  input_schema_id: "https://content-ops-studio.local/schemas/1.0/task-envelope.schema.json",
  output_schema_id: "https://content-ops-studio.local/schemas/1.0/task-result.schema.json",
  steps: linearSteps([
    { id: "PREFLIGHT", owner: "project-initialization", capabilities: ["workspace.write"] },
    { id: "RESOLVE_PACKS", owner: "project-initialization" },
    { id: "ACQUIRE_PROJECT_LOCK", owner: "project-initialization" },
    { id: "INITIALIZE_PROJECT_HOME", owner: "project-initialization" },
    { id: "UPSERT_PROJECT_REGISTRY", owner: "project-initialization" },
    {
      id: "INITIALIZE_MOCK_WORKSPACE",
      owner: "project-initialization",
      capabilities: ["workspace.write"],
    },
    { id: "WRITE_PROJECT_PROFILE_DRAFT", owner: "project-initialization" },
    { id: "CREATE_PROJECT_RUNTIME_SNAPSHOT", owner: "project-initialization" },
    { id: "CHECKPOINT_BEFORE_G1", owner: "project-initialization", checkpoint: true },
    {
      id: "AWAIT_G1_PROJECT_PROFILE",
      owner: "content-studio-router",
      gate: "PROJECT_PROFILE",
      checkpoint: true,
    },
    { id: "PROCESS_G1_APPROVAL", owner: "content-studio-router" },
    { id: "ACTIVATE_LOCAL_PROJECT", owner: "project-initialization" },
    { id: "VERIFY_PROJECT", owner: "project-initialization" },
    { id: "RELEASE_PROJECT_LOCK", owner: "project-initialization" },
    { id: "COMPLETE_RUN", owner: "content-studio-router" },
  ]),
  approval_gates: ["PROJECT_PROFILE"],
  capability_requirements: ["workspace.write"],
  terminal_conditions: ["RUN_SUCCEEDED", "RUN_BLOCKED", "RUN_FAILED"],
  recovery_policy: {
    resume_verified_steps: false,
    retry_failed_steps: true,
    block_on_journal_corruption: true,
  },
  schema_version: "1.0.0",
  extensions: { mock_only: true },
};

export const VISUAL_FINALIZATION_FIXTURE_V1: WorkflowDefinition = {
  workflow_id: "VISUAL_FINALIZATION_FIXTURE_V1",
  workflow_version: "1.0.0",
  display_name: "Visual finalization fixture",
  description: "MOCK-only Phase 1B fixture validation with independent G4 and G5 pauses.",
  supported_runtime_modes: ["MOCK"],
  task_types: ["VISUAL_FINALIZATION"],
  input_schema_id: "https://content-ops-studio.local/schemas/1.0/task-envelope.schema.json",
  output_schema_id: "https://content-ops-studio.local/schemas/1.0/task-result.schema.json",
  steps: linearSteps([
    { id: "PREFLIGHT", owner: "content-finalization", capabilities: ["fixture.assets"] },
    { id: "LOAD_CONTENT_PACKAGE_FIXTURE", owner: "content-finalization" },
    { id: "VALIDATE_VISUAL_SYSTEM", owner: "visual-planning" },
    { id: "VALIDATE_PAGE_VISUAL_PLANS", owner: "visual-planning" },
    { id: "REGISTER_FIRST_PAGE_FIXTURE_ASSET", owner: "image-set-production" },
    { id: "VALIDATE_FIRST_PAGE_GENERATION_MANIFEST", owner: "image-set-production" },
    { id: "CHECKPOINT_BEFORE_G4", owner: "content-finalization", checkpoint: true },
    {
      id: "AWAIT_G4_FIRST_PAGE",
      owner: "content-studio-router",
      gate: "FIRST_PAGE",
      checkpoint: true,
    },
    { id: "PROCESS_G4_APPROVAL", owner: "content-studio-router" },
    { id: "VALIDATE_STYLE_LOCK", owner: "image-set-production" },
    { id: "REGISTER_REMAINING_FIXTURE_ASSETS", owner: "image-set-production" },
    { id: "VALIDATE_REMAINING_GENERATION_MANIFESTS", owner: "image-set-production" },
    { id: "VALIDATE_RENDER_REPORTS", owner: "content-finalization" },
    { id: "VALIDATE_QA_REPORT", owner: "content-finalization" },
    { id: "CHECKPOINT_BEFORE_G5", owner: "content-finalization", checkpoint: true },
    {
      id: "AWAIT_G5_FINAL_SET",
      owner: "content-studio-router",
      gate: "FINAL_SET",
      checkpoint: true,
    },
    { id: "PROCESS_G5_APPROVAL", owner: "content-studio-router" },
    { id: "VALIDATE_FINAL_MANIFEST", owner: "content-finalization" },
    { id: "COMPLETE_RUN", owner: "content-studio-router" },
  ]),
  approval_gates: ["FIRST_PAGE", "FINAL_SET"],
  capability_requirements: ["fixture.assets"],
  terminal_conditions: ["RUN_SUCCEEDED", "RUN_BLOCKED", "RUN_FAILED"],
  recovery_policy: {
    resume_verified_steps: false,
    retry_failed_steps: true,
    block_on_journal_corruption: true,
  },
  schema_version: "1.0.0",
  extensions: { mock_only: true },
};

export const FINALIZATION_AND_DELIVERY_V1: WorkflowDefinition = {
  workflow_id: "FINALIZATION_AND_DELIVERY_V1",
  workflow_version: "1.0.0",
  display_name: "Finalization and Delivery V1",
  description:
    "Verify an explicitly approved current Final Set, create immutable delivery evidence and archive that version without rendering, ImageGen or implicit Workspace sync.",
  supported_runtime_modes: ["DRY_RUN", "PRODUCTION"],
  task_types: ["FINALIZATION_AND_DELIVERY"],
  input_schema_id: "https://content-ops-studio.local/schemas/1.0/task-envelope.schema.json",
  output_schema_id: "https://content-ops-studio.local/schemas/1.0/task-result.schema.json",
  steps: linearSteps([
    { id: "LOAD_FINALIZATION_CONTEXT", owner: "content-finalization" },
    { id: "VERIFY_APPROVAL_CHAIN", owner: "content-finalization" },
    {
      id: "VERIFY_FINAL_ASSETS",
      owner: "content-finalization",
      capabilities: ["asset-store.read"],
    },
    { id: "VERIFY_GROUP_EVIDENCE", owner: "content-finalization" },
    { id: "BUILD_FINAL_MANIFEST", owner: "content-finalization", checkpoint: true },
    { id: "BUILD_FINAL_SET_FINGERPRINT", owner: "content-finalization" },
    {
      id: "BUILD_DELIVERY_PACKAGE",
      owner: "content-finalization",
      capabilities: ["asset-store.write"],
    },
    { id: "VERIFY_DELIVERY", owner: "content-finalization" },
    { id: "WRITE_ARCHIVE_STATE", owner: "content-finalization", checkpoint: true },
    {
      id: "OPTIONAL_SYNC",
      owner: "content-finalization",
      capabilities: ["workspace.write"],
    },
    { id: "COMPLETE_RUN", owner: "content-studio-router" },
  ]),
  approval_gates: ["CONTENT_COPY", "FIRST_PAGE", "FINAL_SET"],
  capability_requirements: ["asset-store.read", "asset-store.write"],
  terminal_conditions: ["RUN_SUCCEEDED", "RUN_BLOCKED", "RUN_FAILED"],
  recovery_policy: {
    resume_verified_steps: false,
    retry_failed_steps: true,
    block_on_journal_corruption: true,
  },
  schema_version: "1.0.0",
  extensions: {
    imagegen_calls: 0,
    renderer_calls: 0,
    workspace_sync_is_explicit: true,
    attachment_upload_is_independent: true,
    mock_production_fallback: false,
  },
};

export function registerWorkflow(registry: WorkflowRegistry, workflow: WorkflowDefinition): void {
  registry.registerWorkflow(workflow);
}
export function loadWorkflowDefinition(
  registry: WorkflowRegistry,
  id: string,
  version?: string,
): WorkflowDefinition {
  return registry.loadWorkflowDefinition(id, version);
}
