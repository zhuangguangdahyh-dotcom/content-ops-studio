import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import type {
  ApprovalEvent,
  ProjectProfile,
  ProjectRegistry,
  RunCheckpoint,
  RunPlan,
  TaskEnvelope,
  TaskResult,
  WorkflowDefinition,
  WriteLog,
} from "../../../contracts/src/generated/1.0/index.js";
import {
  loadSchemaRegistry,
  type SchemaRegistry,
} from "../../../contracts/src/validation/index.js";
import type { WorkspaceBlueprintDefinition } from "../../../contracts/src/workspace-blueprint.js";
import { PersistentLocalMockWorkspaceAdapter } from "../../../workspace-adapters/src/persistent-local-mock.js";
import { ApprovalProcessor, type ApprovalCommand } from "../approvals/index.js";
import { CheckpointStore } from "../checkpoints/index.js";
import { RunJournal } from "../journal/index.js";
import { ProjectLockManager } from "../locks/index.js";
import { loadIndustryPack, loadPlatformPack, resolvePacks } from "../packs/index.js";
import {
  initializeProjectDirectory,
  initializeProjectHome,
  resolveProjectDirectory,
  resolveRunDirectory,
} from "../project-home/index.js";
import { ProjectRegistryStore } from "../project-registry/index.js";
import { RunStore } from "../runs/index.js";
import { AtomicJsonStore, canonicalJson, sha256 } from "../storage/index.js";
import {
  DeterministicIdFactory,
  nodeHashProvider,
  RuntimeFailure,
  type Clock,
  type IdFactory,
} from "../types.js";
import {
  buildRunPlan,
  PROJECT_INITIALIZATION_LOCAL_V1,
  VISUAL_FINALIZATION_FIXTURE_V1,
} from "../workflows/index.js";
import { WriteLogStore } from "../write-log/index.js";
import {
  assertRuntimeSupported,
  DEFAULT_RUNTIME_SUPPORT_POLICY,
  type RuntimeSupportPolicy,
} from "../runtime-policy/index.js";

const PROFILE_SCHEMA = "https://content-ops-studio.local/schemas/1.0/project-profile.schema.json";
const SNAPSHOT_SCHEMA =
  "https://content-ops-studio.local/schemas/1.0/project-runtime-snapshot.schema.json";
const VISUAL_SCHEMAS: Record<string, string> = {
  content_package: "content-package.schema.json",
  visual_system: "visual-system.schema.json",
  page_visual_plans: "page-visual-plan.schema.json",
  first_page_generation_manifest: "generation-manifest.schema.json",
  first_page_approval: "approval-event.schema.json",
  style_lock: "style-lock.schema.json",
  remaining_generation_manifests: "generation-manifest.schema.json",
  render_reports: "render-report.schema.json",
  qa_report: "qa-report.schema.json",
  final_approval: "approval-event.schema.json",
  final_manifest: "final-manifest.schema.json",
};

export interface ReferenceRuntimeOptions {
  home: string;
  pluginRoot: string;
  clock?: Clock;
  ids?: IdFactory;
  schemas?: SchemaRegistry;
  runtimeVersion?: string;
  runtimePolicy?: RuntimeSupportPolicy;
}

export interface ProjectStartInput {
  envelope: TaskEnvelope;
  profile: ProjectProfile;
}

export interface VisualStartInput {
  envelope: TaskEnvelope;
  projectName: string;
  fixture: Record<string, unknown>;
  assetFiles: [string, string, string, string];
}

interface RunContext {
  runDirectory: string;
  runStore: RunStore;
  journal: RunJournal;
  checkpoint: CheckpointStore;
  writeLog: WriteLogStore;
  approvals: ApprovalProcessor;
}

function approvalRequest(
  runId: string,
  gate: ApprovalEvent["gate"],
  targetType: ApprovalEvent["target_type"],
  targetId: string,
  targetVersion: string,
  now: string,
): ApprovalEvent {
  return {
    approval_id: `APR-REQUEST-${runId}-${gate}`,
    gate,
    target_type: targetType,
    target_id: targetId,
    target_version: targetVersion,
    decision: "PAUSE",
    comment: "Explicit Operator approval is required.",
    source_run_id: runId,
    created_at: now,
    deprecated_at: null,
    schema_version: "1.0.0",
  };
}

function taskResult(
  status: TaskResult["status"],
  runId: string,
  projectId: string,
  approval: ApprovalEvent | null,
  nextRoute: string | null,
  artifacts: Record<string, unknown>[] = [],
): TaskResult {
  return {
    status,
    skill: "content-studio-router",
    run_id: runId,
    project_id: projectId,
    state_before: {},
    state_after: { runtime_mode: "MOCK", run_status: status },
    created_records: [],
    updated_records: [],
    artifacts,
    approval_request: approval,
    warnings: ["MOCK runtime only; no Feishu write or production generation occurred."],
    errors: [],
    next_route: nextRoute,
  };
}

function markSteps(plan: RunPlan, completedThrough: string, pendingGateStep?: string): void {
  for (const step of plan.steps) {
    if (step.step_id === pendingGateStep) {
      step.status = "AWAITING_APPROVAL";
      plan.current_step_id = step.step_id;
      break;
    }
    step.status = "COMPLETED";
    if (!plan.completed_step_ids.includes(step.step_id)) plan.completed_step_ids.push(step.step_id);
    if (step.step_id === completedThrough) break;
  }
}

export class ReferenceRuntimeEngine {
  readonly #clock: Clock;
  readonly #ids: IdFactory;
  #schemas: SchemaRegistry | undefined;

  constructor(private readonly options: ReferenceRuntimeOptions) {
    assertRuntimeSupported(
      options.runtimePolicy ?? DEFAULT_RUNTIME_SUPPORT_POLICY,
      options.runtimeVersion ?? process.version,
    );
    this.#clock = options.clock ?? { now: () => new Date() };
    this.#ids = options.ids ?? new DeterministicIdFactory("RUNTIME");
    this.#schemas = options.schemas;
  }

  async #schemaRegistry(): Promise<SchemaRegistry> {
    this.#schemas ??= await loadSchemaRegistry(path.join(this.options.pluginRoot, "schemas/1.0"));
    return this.#schemas;
  }

  #registry(schemas: SchemaRegistry): ProjectRegistryStore {
    return new ProjectRegistryStore(this.options.home, schemas, () =>
      this.#clock.now().toISOString(),
    );
  }

  #runContext(projectDirectory: string, runId: string): RunContext {
    const runDirectory = resolveRunDirectory(projectDirectory, runId);
    const journal = new RunJournal(
      path.join(runDirectory, "events.jsonl"),
      this.#clock,
      this.#ids,
      nodeHashProvider,
    );
    return {
      runDirectory,
      runStore: new RunStore(runDirectory),
      journal,
      checkpoint: new CheckpointStore(
        path.join(runDirectory, "checkpoint.json"),
        this.#clock,
        this.#ids,
        nodeHashProvider,
      ),
      writeLog: new WriteLogStore(path.join(runDirectory, "write-log.jsonl")),
      approvals: new ApprovalProcessor(path.join(runDirectory, "approvals.jsonl"), journal),
    };
  }

  async #appendCompletedSteps(
    journal: RunJournal,
    workflow: WorkflowDefinition,
    runId: string,
    projectId: string,
    fromIndex: number,
    toIndex: number,
  ): Promise<void> {
    for (const step of workflow.steps.slice(fromIndex, toIndex + 1)) {
      await journal.appendEvent({
        event_type: "STEP_STARTED",
        run_id: runId,
        project_id: projectId,
        workflow_id: workflow.workflow_id,
        step_id: step.step_id,
        status: "RUNNING",
      });
      await journal.appendEvent({
        event_type: "STEP_COMPLETED",
        run_id: runId,
        project_id: projectId,
        workflow_id: workflow.workflow_id,
        step_id: step.step_id,
        status: "SUCCESS",
      });
    }
  }

  async #checkpoint(
    context: RunContext,
    workflow: WorkflowDefinition,
    plan: RunPlan,
    pendingApproval: Record<string, unknown> | null,
  ): Promise<RunCheckpoint> {
    await context.journal.appendEvent({
      event_type: "CHECKPOINT_CREATED",
      run_id: plan.run_id,
      project_id: plan.project_id,
      workflow_id: workflow.workflow_id,
      step_id: plan.current_step_id,
      status: "RECORDED",
      payload_summary: { pending_gate: plan.pending_approval?.gate ?? null },
    });
    const head = await context.journal.getJournalHead();
    if (!head) throw new RuntimeFailure("JOURNAL_EMPTY", "Cannot checkpoint an empty run.", 6);
    const writes = await context.writeLog.readAll();
    const checkpoint: RunCheckpoint = {
      checkpoint_id: this.#ids.next("CHK"),
      run_id: plan.run_id,
      project_id: plan.project_id,
      workflow_id: workflow.workflow_id,
      workflow_version: workflow.workflow_version,
      journal_head_sequence: head.sequence,
      journal_head_hash: head.hash,
      current_step_id: plan.current_step_id,
      run_status: plan.plan_status,
      completed_steps: [...plan.completed_step_ids],
      failed_steps: [...plan.failed_step_ids],
      pending_approval: pendingApproval,
      artifact_index: {},
      write_log_head: {
        entry_count: writes.length,
        last_write_id: writes.at(-1)?.write_id ?? null,
      },
      idempotency_snapshot: {},
      created_at: this.#clock.now().toISOString(),
      schema_version: "1.0.0",
      extensions: {},
    };
    await context.checkpoint.createCheckpoint(checkpoint);
    return checkpoint;
  }

  async #recordMockWrite(
    store: WriteLogStore,
    runId: string,
    projectId: string,
    key: string,
    targetType: string,
    targetId: string,
  ): Promise<void> {
    const now = this.#clock.now().toISOString();
    const record: WriteLog = {
      write_id: this.#ids.next("WLOG"),
      run_id: runId,
      project_id: projectId,
      owner_skill: "project-initialization",
      provider: "MOCK",
      operation: "UPSERT",
      target_type: targetType,
      target_id: targetId,
      idempotency_key: key,
      state_before: {},
      state_after: { target_id: targetId },
      request_summary: "Sanitized deterministic mock write.",
      response_summary: "Mock state persisted; this is not a Feishu write.",
      verification_status: "NOT_RUN",
      verification_details: "Pending read-after-write verification.",
      attempt_number: 1,
      retryable: true,
      error: null,
      started_at: now,
      completed_at: null,
    };
    await store.appendWriteAttempt(record);
    await store.markWriteVerified(key, now);
  }

  async startProjectInitialization(input: ProjectStartInput): Promise<TaskResult> {
    if (input.envelope.run_id !== input.profile.last_run_id)
      throw new RuntimeFailure("INVALID_INPUT", "Profile last_run_id must match the request.", 5);
    const schemas = await this.#schemaRegistry();
    schemas.assertValid(PROFILE_SCHEMA, input.profile);
    await initializeProjectHome(this.options.home);
    const projectDirectory = await initializeProjectDirectory(
      this.options.home,
      input.profile.project_name,
      input.profile.project_id,
    );
    const context = this.#runContext(projectDirectory, input.envelope.run_id);
    const now = this.#clock.now().toISOString();
    const [platform, industry] = await Promise.all([
      loadPlatformPack(this.options.pluginRoot, input.profile.platform_pack, "1.0.0", schemas),
      loadIndustryPack(this.options.pluginRoot, input.profile.industry_pack, "1.0.0", schemas),
    ]);
    const resolution = resolvePacks(
      {
        resolutionId: `PRES-${input.envelope.run_id}`,
        projectId: input.profile.project_id,
        runId: input.envelope.run_id,
        resolvedAt: now,
        platform,
        industry,
        pluginDefaults: { runtime_mode: "MOCK" },
        projectRules: { configuration_version: input.profile.configuration_version },
        runOverrides: input.envelope.overrides,
      },
      schemas,
    );
    const snapshot = {
      snapshot_id: `SNAP-${input.envelope.run_id}`,
      project_id: input.profile.project_id,
      project_profile: input.profile,
      project_profile_version: input.profile.configuration_version,
      platform_pack_resolution: {
        id: platform.id,
        version: platform.version,
        sha256: resolution.platform_pack.snapshot_sha256,
      },
      industry_pack_resolution: {
        id: industry.id,
        version: industry.version,
        sha256: resolution.industry_pack.snapshot_sha256,
      },
      active_project_rules: [],
      rejected_directions: [],
      workspace_connection_snapshot: {
        provider: "MOCK",
        status: "MOCK_ONLY",
        workspace_label: `MOCK:${input.profile.project_id}`,
      },
      capability_snapshot: [
        {
          capability: "workspace.write",
          provider: "local-mock",
          status: "MOCK_ONLY",
          checked_at: now,
        },
      ],
      source_record_versions: { project_profile: input.profile.configuration_version },
      created_at: now,
      run_id: input.envelope.run_id,
      schema_version: "1.0.0",
      extensions: {},
    } as const;
    schemas.assertValid(SNAPSHOT_SCHEMA, snapshot);
    const plan = buildRunPlan({
      runId: input.envelope.run_id,
      projectId: input.profile.project_id,
      mode: "MOCK",
      workflow: PROJECT_INITIALIZATION_LOCAL_V1,
      taskEnvelope: input.envelope,
      projectSnapshotId: snapshot.snapshot_id,
      packResolutionId: resolution.resolution_id,
      createdAt: now,
    });
    await context.runStore.initialize(input.envelope, plan);
    await context.journal.appendEvent({
      event_type: "RUN_CREATED",
      run_id: plan.run_id,
      project_id: plan.project_id,
      workflow_id: plan.workflow_id,
      step_id: null,
      status: "RECORDED",
    });
    const lockManager = new ProjectLockManager(
      path.join(this.options.home, "locks"),
      this.#clock,
      this.#ids,
      { processId: "MOCK-PROCESS", hostLabel: "MOCK-HOST" },
      86_400_000,
    );
    await lockManager.acquireProjectWriteLock(plan.project_id, plan.run_id);
    const registryEntry: ProjectRegistry = {
      project_id: input.profile.project_id,
      display_name: input.profile.project_name,
      subject_name: input.profile.subject_name,
      project_root: path.relative(this.options.home, projectDirectory),
      project_status: "PROJECT_PENDING_CONFIRMATION",
      last_active_at: now,
      schema_version: "1.0.0",
      connection_status: "UNVERIFIED",
      latest_run_id: plan.run_id,
      created_at: now,
      updated_at: now,
    };
    await this.#registry(schemas).upsertProject(
      registryEntry,
      `REGISTRY:${plan.project_id}:CREATE`,
    );
    await this.#recordMockWrite(
      context.writeLog,
      plan.run_id,
      plan.project_id,
      `REGISTRY:${plan.project_id}:CREATE`,
      "PROJECT_REGISTRY",
      plan.project_id,
    );
    const blueprint = JSON.parse(
      await readFile(
        path.join(this.options.pluginRoot, "templates/feishu/workspace-v1.json"),
        "utf8",
      ),
    ) as WorkspaceBlueprintDefinition;
    const workspace = new PersistentLocalMockWorkspaceAdapter({
      stateFile: path.join(projectDirectory, "workspace/mock-workspace.json"),
      blueprint,
    });
    const workspaceResult = await workspace.createWorkspace(
      input.profile.project_name,
      `WORKSPACE:${plan.project_id}:CREATE`,
    );
    if ((await workspace.listTables()).length !== 4)
      throw new RuntimeFailure(
        "WORKSPACE_NOT_READY",
        "Mock workspace does not have four tables.",
        4,
      );
    await this.#recordMockWrite(
      context.writeLog,
      plan.run_id,
      plan.project_id,
      `WORKSPACE:${plan.project_id}:CREATE`,
      "MOCK_WORKSPACE",
      workspaceResult.workspaceId,
    );
    await Promise.all([
      new AtomicJsonStore(path.join(projectDirectory, "project.json")).write(input.profile),
      new AtomicJsonStore(path.join(context.runDirectory, "pack-resolution.json")).write(
        resolution,
      ),
      new AtomicJsonStore(path.join(context.runDirectory, "project-snapshot.json")).write(snapshot),
    ]);
    await this.#appendCompletedSteps(
      context.journal,
      PROJECT_INITIALIZATION_LOCAL_V1,
      plan.run_id,
      plan.project_id,
      0,
      8,
    );
    const request = approvalRequest(
      plan.run_id,
      "PROJECT_PROFILE",
      "PROJECT",
      plan.project_id,
      String(input.profile.configuration_version),
      now,
    );
    await context.journal.appendEvent({
      event_type: "APPROVAL_REQUESTED",
      run_id: plan.run_id,
      project_id: plan.project_id,
      workflow_id: plan.workflow_id,
      step_id: "AWAIT_G1_PROJECT_PROFILE",
      status: "AWAITING_APPROVAL",
      payload_summary: {
        gate: request.gate,
        target_id: request.target_id,
        target_version: request.target_version,
      },
    });
    markSteps(plan, "CHECKPOINT_BEFORE_G1", "AWAIT_G1_PROJECT_PROFILE");
    plan.plan_status = "AWAITING_APPROVAL";
    plan.pending_approval = {
      gate: request.gate,
      target_type: request.target_type,
      target_id: request.target_id,
      target_version: request.target_version,
    };
    plan.updated_at = now;
    await context.runStore.writePlan(plan);
    await this.#checkpoint(context, PROJECT_INITIALIZATION_LOCAL_V1, plan, plan.pending_approval);
    const result = taskResult(
      "AWAITING_APPROVAL",
      plan.run_id,
      plan.project_id,
      request,
      "run approve",
    );
    await context.runStore.writeResult(result);
    return result;
  }

  async startVisualFinalization(input: VisualStartInput): Promise<TaskResult> {
    const schemas = await this.#schemaRegistry();
    await initializeProjectHome(this.options.home);
    const projectDirectory = await initializeProjectDirectory(
      this.options.home,
      input.projectName,
      input.envelope.project_id,
    );
    for (const asset of input.assetFiles) await stat(asset);
    for (const [key, schemaFile] of Object.entries(VISUAL_SCHEMAS)) {
      const value = input.fixture[key];
      if (Array.isArray(value))
        for (const item of value)
          schemas.assertValid(`https://content-ops-studio.local/schemas/1.0/${schemaFile}`, item);
      else schemas.assertValid(`https://content-ops-studio.local/schemas/1.0/${schemaFile}`, value);
    }
    const context = this.#runContext(projectDirectory, input.envelope.run_id);
    const now = this.#clock.now().toISOString();
    const plan = buildRunPlan({
      runId: input.envelope.run_id,
      projectId: input.envelope.project_id,
      mode: "MOCK",
      workflow: VISUAL_FINALIZATION_FIXTURE_V1,
      taskEnvelope: input.envelope,
      projectSnapshotId: `SNAP-${input.envelope.run_id}`,
      packResolutionId: `PRES-${input.envelope.run_id}`,
      createdAt: now,
    });
    await context.runStore.initialize(input.envelope, plan);
    await new AtomicJsonStore(path.join(context.runDirectory, "visual-fixture.json")).write(
      input.fixture,
    );
    await new AtomicJsonStore(path.join(context.runDirectory, "asset-index.json")).write({
      files: await Promise.all(
        input.assetFiles.map(async (file) => ({
          path: path.basename(file),
          sha256: sha256(await readFile(file)),
        })),
      ),
    });
    await context.journal.appendEvent({
      event_type: "RUN_CREATED",
      run_id: plan.run_id,
      project_id: plan.project_id,
      workflow_id: plan.workflow_id,
      step_id: null,
      status: "RECORDED",
    });
    await this.#appendCompletedSteps(
      context.journal,
      VISUAL_FINALIZATION_FIXTURE_V1,
      plan.run_id,
      plan.project_id,
      0,
      6,
    );
    const contentId = String(
      (input.fixture.content_package as { content_record?: { content_id?: string } }).content_record
        ?.content_id ?? "C-FIXTURE",
    );
    const request = approvalRequest(plan.run_id, "FIRST_PAGE", "CONTENT", contentId, "GV-1", now);
    await context.journal.appendEvent({
      event_type: "APPROVAL_REQUESTED",
      run_id: plan.run_id,
      project_id: plan.project_id,
      workflow_id: plan.workflow_id,
      step_id: "AWAIT_G4_FIRST_PAGE",
      status: "AWAITING_APPROVAL",
      payload_summary: {
        gate: request.gate,
        target_id: request.target_id,
        target_version: request.target_version,
      },
      artifact_refs: [path.basename(input.assetFiles[0])],
    });
    markSteps(plan, "CHECKPOINT_BEFORE_G4", "AWAIT_G4_FIRST_PAGE");
    plan.plan_status = "AWAITING_APPROVAL";
    plan.pending_approval = {
      gate: "FIRST_PAGE",
      target_type: "CONTENT",
      target_id: contentId,
      target_version: "GV-1",
    };
    plan.updated_at = now;
    await context.runStore.writePlan(plan);
    await this.#checkpoint(context, VISUAL_FINALIZATION_FIXTURE_V1, plan, plan.pending_approval);
    const result = taskResult(
      "AWAITING_APPROVAL",
      plan.run_id,
      plan.project_id,
      request,
      "run approve",
      [{ fixture_asset: path.basename(input.assetFiles[0]) }],
    );
    await context.runStore.writeResult(result);
    return result;
  }

  async resume(projectName: string, runId: string, approval: ApprovalEvent): Promise<TaskResult> {
    const projectId = await this.#projectIdForRun(runId);
    const projectDirectory = resolveProjectDirectory(this.options.home, projectName, projectId);
    const context = this.#runContext(projectDirectory, runId);
    const plan = await context.runStore.readPlan();
    if (plan.plan_status !== "AWAITING_APPROVAL" || !plan.pending_approval)
      throw new RuntimeFailure("RUN_NOT_AWAITING_APPROVAL", "Run has no pending approval.", 3);
    const command: ApprovalCommand = {
      event: approval,
      projectId: plan.project_id,
      workflowId: plan.workflow_id,
      actorSkill: "content-studio-router",
      expectedGate: plan.pending_approval.gate,
      expectedTargetType: plan.pending_approval.target_type as ApprovalEvent["target_type"],
      expectedTargetId: plan.pending_approval.target_id,
      expectedTargetVersion: plan.pending_approval.target_version,
      sourceRunId: plan.run_id,
    };
    const decision = await context.approvals.resumeFromApproval(command);
    if (!decision.resumable) {
      const result = taskResult(
        approval.decision === "REJECT" ? "BLOCKED" : "AWAITING_APPROVAL",
        plan.run_id,
        plan.project_id,
        null,
        approval.decision === "REVISE" ? "revise target" : null,
      );
      await context.runStore.writeResult(result);
      return result;
    }
    await context.journal.appendEvent({
      event_type: "RUN_RESUMING",
      run_id: plan.run_id,
      project_id: plan.project_id,
      workflow_id: plan.workflow_id,
      step_id: plan.current_step_id,
      status: "RUNNING",
    });
    if (plan.workflow_id === PROJECT_INITIALIZATION_LOCAL_V1.workflow_id) {
      await this.#appendCompletedSteps(
        context.journal,
        PROJECT_INITIALIZATION_LOCAL_V1,
        plan.run_id,
        plan.project_id,
        9,
        14,
      );
      await this.#registry(await this.#schemaRegistry()).markProjectStatus(
        plan.project_id,
        "PROJECT_ACTIVE",
      );
      await this.#registry(await this.#schemaRegistry()).setLastActiveProject(plan.project_id);
      const lockManager = new ProjectLockManager(
        path.join(this.options.home, "locks"),
        this.#clock,
        this.#ids,
        { processId: "MOCK-PROCESS", hostLabel: "MOCK-HOST" },
        86_400_000,
      );
      await lockManager.releaseProjectWriteLock(plan.project_id);
      for (const step of plan.steps) step.status = "COMPLETED";
      plan.completed_step_ids = plan.steps.map((step) => step.step_id);
    } else {
      const pendingGate = plan.pending_approval.gate;
      if (pendingGate === "FIRST_PAGE") {
        await this.#appendCompletedSteps(
          context.journal,
          VISUAL_FINALIZATION_FIXTURE_V1,
          plan.run_id,
          plan.project_id,
          7,
          14,
        );
        const request = approvalRequest(
          plan.run_id,
          "FINAL_SET",
          "IMAGE_SET",
          `IMGSET-${plan.project_id}`,
          "FV-1",
          this.#clock.now().toISOString(),
        );
        await context.journal.appendEvent({
          event_type: "APPROVAL_REQUESTED",
          run_id: plan.run_id,
          project_id: plan.project_id,
          workflow_id: plan.workflow_id,
          step_id: "AWAIT_G5_FINAL_SET",
          status: "AWAITING_APPROVAL",
          payload_summary: {
            gate: request.gate,
            target_id: request.target_id,
            target_version: request.target_version,
          },
        });
        markSteps(plan, "CHECKPOINT_BEFORE_G5", "AWAIT_G5_FINAL_SET");
        plan.plan_status = "AWAITING_APPROVAL";
        plan.pending_approval = {
          gate: "FINAL_SET",
          target_type: "IMAGE_SET",
          target_id: request.target_id,
          target_version: "FV-1",
        };
        plan.updated_at = this.#clock.now().toISOString();
        await context.runStore.writePlan(plan);
        await this.#checkpoint(
          context,
          VISUAL_FINALIZATION_FIXTURE_V1,
          plan,
          plan.pending_approval,
        );
        const result = taskResult(
          "AWAITING_APPROVAL",
          plan.run_id,
          plan.project_id,
          request,
          "run approve",
        );
        await context.runStore.writeResult(result);
        return result;
      }
      await this.#appendCompletedSteps(
        context.journal,
        VISUAL_FINALIZATION_FIXTURE_V1,
        plan.run_id,
        plan.project_id,
        15,
        18,
      );
      for (const step of plan.steps) step.status = "COMPLETED";
      plan.completed_step_ids = plan.steps.map((step) => step.step_id);
    }
    plan.plan_status = "RUN_SUCCEEDED";
    plan.pending_approval = null;
    plan.current_step_id = null;
    plan.updated_at = this.#clock.now().toISOString();
    await context.journal.appendEvent({
      event_type: "RUN_COMPLETED",
      run_id: plan.run_id,
      project_id: plan.project_id,
      workflow_id: plan.workflow_id,
      step_id: null,
      status: "SUCCESS",
    });
    await context.runStore.writePlan(plan);
    await this.#checkpoint(
      context,
      plan.workflow_id === PROJECT_INITIALIZATION_LOCAL_V1.workflow_id
        ? PROJECT_INITIALIZATION_LOCAL_V1
        : VISUAL_FINALIZATION_FIXTURE_V1,
      plan,
      null,
    );
    const result = taskResult("SUCCESS", plan.run_id, plan.project_id, null, null);
    await context.runStore.writeResult(result);
    return result;
  }

  async #projectIdForRun(runId: string): Promise<string> {
    const registry = await this.#registry(await this.#schemaRegistry()).readRegistry();
    const found = registry.entries.find((entry) => entry.latest_run_id === runId);
    if (found) return found.project_id;
    const projectsDirectory = path.join(this.options.home, "projects");
    const { readdir } = await import("node:fs/promises");
    for (const directory of await readdir(projectsDirectory)) {
      const planFile = path.join(projectsDirectory, directory, "runs", runId, "plan.json");
      try {
        const plan = JSON.parse(await readFile(planFile, "utf8")) as RunPlan;
        return plan.project_id;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
    }
    throw new RuntimeFailure("PROJECT_NOT_RESOLVED", "Run is not registered.", 5);
  }

  async inspect(
    projectName: string,
    projectId: string,
    runId: string,
  ): Promise<{
    plan: RunPlan;
    result: TaskResult;
  }> {
    const context = this.#runContext(
      resolveProjectDirectory(this.options.home, projectName, projectId),
      runId,
    );
    return { plan: await context.runStore.readPlan(), result: await context.runStore.readResult() };
  }

  async verify(
    projectName: string,
    projectId: string,
    runId: string,
  ): Promise<{
    valid: true;
    eventCount: number;
    writeCount: number;
    checkpointValid: true;
  }> {
    const context = this.#runContext(
      resolveProjectDirectory(this.options.home, projectName, projectId),
      runId,
    );
    const events = await context.journal.readEvents();
    await context.journal.getJournalHead();
    const writes = await context.writeLog.verifyWriteHistory();
    await context.checkpoint.verifyCheckpoint(context.journal);
    return {
      valid: true,
      eventCount: events.length,
      writeCount: writes.entries,
      checkpointValid: true,
    };
  }
}

export function approvalFor(
  result: TaskResult,
  decision: ApprovalEvent["decision"],
  at: string,
): ApprovalEvent {
  const request = result.approval_request;
  if (!request) throw new RuntimeFailure("APPROVAL_REQUIRED", "Result has no approval request.", 5);
  return {
    ...request,
    approval_id: `APR-${result.run_id}-${request.gate}-${decision}`,
    decision,
    comment: `Fixture ${decision.toLowerCase()} decision.`,
    created_at: at,
  };
}

export function runtimeInputHash(input: unknown): string {
  return sha256(canonicalJson(input));
}
