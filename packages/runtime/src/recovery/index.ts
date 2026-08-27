import type { RunCheckpoint } from "../../../contracts/src/generated/1.0/index.js";
import type { CheckpointStore } from "../checkpoints/index.js";
import { rebuildRunState, type RunJournal, verifyEventChain } from "../journal/index.js";
import type { HashProvider } from "../types.js";
import { RuntimeFailure } from "../types.js";

export interface RecoverabilityReport {
  recoverable: boolean;
  journal_valid: boolean;
  checkpoint_valid: boolean;
  status: "READY" | "REBUILD_CHECKPOINT" | "BLOCKED";
  issues: string[];
}

export class RecoveryManager {
  constructor(
    private readonly journal: RunJournal,
    private readonly checkpoints: CheckpointStore,
    private readonly hashes: HashProvider,
  ) {}

  async inspectRecoverability(): Promise<RecoverabilityReport> {
    let events;
    try {
      events = await this.journal.readEvents();
      verifyEventChain(events, this.hashes);
    } catch (error) {
      return {
        recoverable: false,
        journal_valid: false,
        checkpoint_valid: false,
        status: "BLOCKED",
        issues: [error instanceof RuntimeFailure ? error.code : "JOURNAL_CORRUPTION"],
      };
    }
    try {
      await this.checkpoints.verifyCheckpoint(this.journal);
      return {
        recoverable: true,
        journal_valid: true,
        checkpoint_valid: true,
        status: "READY",
        issues: [],
      };
    } catch (error) {
      return {
        recoverable: true,
        journal_valid: true,
        checkpoint_valid: false,
        status: "REBUILD_CHECKPOINT",
        issues: [error instanceof RuntimeFailure ? error.code : "CHECKPOINT_INVALID"],
      };
    }
  }

  async replayJournal() {
    const events = await this.journal.readEvents();
    verifyEventChain(events, this.hashes);
    return rebuildRunState(events);
  }

  async recoverInterruptedRun(input: {
    runId: string;
    projectId: string;
    workflowId: string;
    workflowVersion: string;
    currentStepId: string | null;
    pendingApproval: Record<string, unknown> | null;
  }): Promise<{ checkpoint: RunCheckpoint; completedSteps: string[] }> {
    const report = await this.inspectRecoverability();
    if (!report.journal_valid)
      throw new RuntimeFailure("RECOVERY_BLOCKED_JOURNAL", report.issues.join("; "), 6);
    const events = await this.journal.readEvents();
    let checkpoint: RunCheckpoint;
    if (!report.checkpoint_valid) {
      checkpoint = await this.checkpoints.rebuildCheckpointFromJournal({
        events,
        runId: input.runId,
        projectId: input.projectId,
        workflowId: input.workflowId,
        workflowVersion: input.workflowVersion,
        currentStepId: input.currentStepId,
        pendingApproval: input.pendingApproval,
      });
    } else checkpoint = await this.checkpoints.readCheckpoint();
    await this.journal.appendEvent({
      event_type: "RUN_RESUMING",
      run_id: input.runId,
      project_id: input.projectId,
      workflow_id: input.workflowId,
      step_id: input.currentStepId,
      status: "RUNNING",
      payload_summary: { completed_steps: checkpoint.completed_steps },
    });
    return { checkpoint, completedSteps: [...checkpoint.completed_steps] };
  }

  rebuildCheckpoint(input: Parameters<CheckpointStore["rebuildCheckpointFromJournal"]>[0]) {
    return this.checkpoints.rebuildCheckpointFromJournal(input);
  }
  resumePendingApproval(input: Parameters<RecoveryManager["recoverInterruptedRun"]>[0]) {
    return this.recoverInterruptedRun(input);
  }
  resumeFailedStep(stepId: string, completedSteps: string[]): string {
    if (completedSteps.includes(stepId))
      throw new RuntimeFailure("VERIFIED_STEP_NOT_RETRYABLE", stepId, 3);
    return stepId;
  }
  async verifyRecoveredState(): Promise<boolean> {
    return (await this.inspectRecoverability()).journal_valid;
  }
}

export async function inspectRecoverability(manager: RecoveryManager) {
  return manager.inspectRecoverability();
}
export async function recoverInterruptedRun(
  manager: RecoveryManager,
  input: Parameters<RecoveryManager["recoverInterruptedRun"]>[0],
) {
  return manager.recoverInterruptedRun(input);
}
export async function replayJournal(manager: RecoveryManager) {
  return manager.replayJournal();
}
export async function rebuildCheckpoint(
  manager: RecoveryManager,
  input: Parameters<CheckpointStore["rebuildCheckpointFromJournal"]>[0],
) {
  return manager.rebuildCheckpoint(input);
}
export async function resumePendingApproval(
  manager: RecoveryManager,
  input: Parameters<RecoveryManager["recoverInterruptedRun"]>[0],
) {
  return manager.resumePendingApproval(input);
}
export function resumeFailedStep(
  manager: RecoveryManager,
  stepId: string,
  completedSteps: string[],
) {
  return manager.resumeFailedStep(stepId, completedSteps);
}
export async function verifyRecoveredState(manager: RecoveryManager) {
  return manager.verifyRecoveredState();
}
