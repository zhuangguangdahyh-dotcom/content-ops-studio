import type { RunCheckpoint, RunEvent } from "../../../contracts/src/generated/1.0/index.js";
import type { Clock, IdFactory } from "../types.js";
import { AtomicJsonStore } from "../storage/index.js";
import { rebuildRunState, type RunJournal, verifyEventChain } from "../journal/index.js";
import type { HashProvider } from "../types.js";
import { RuntimeFailure } from "../types.js";

export class CheckpointStore {
  readonly #store: AtomicJsonStore<RunCheckpoint>;
  constructor(
    file: string,
    private readonly clock: Clock,
    private readonly ids: IdFactory,
    private readonly hashes: HashProvider,
  ) {
    this.#store = new AtomicJsonStore(file);
  }

  createCheckpoint(checkpoint: RunCheckpoint): Promise<{ sha256: string }> {
    return this.#store.write(checkpoint);
  }

  async readCheckpoint(): Promise<RunCheckpoint> {
    try {
      return await this.#store.read();
    } catch (error) {
      if (error instanceof SyntaxError)
        throw new RuntimeFailure("CHECKPOINT_CORRUPTION", "Checkpoint JSON is invalid.", 6);
      throw error;
    }
  }

  async verifyCheckpoint(journal: RunJournal): Promise<{ valid: true }> {
    const [checkpoint, head] = await Promise.all([this.readCheckpoint(), journal.getJournalHead()]);
    if (!head) throw new RuntimeFailure("CHECKPOINT_WITHOUT_JOURNAL", "Journal has no head.", 6);
    if (
      checkpoint.journal_head_sequence !== head.sequence ||
      checkpoint.journal_head_hash !== head.hash
    )
      throw new RuntimeFailure("CHECKPOINT_HEAD_MISMATCH", "Checkpoint is stale or invalid.", 6);
    return { valid: true };
  }

  async rebuildCheckpointFromJournal(input: {
    events: RunEvent[];
    runId: string;
    projectId: string;
    workflowId: string;
    workflowVersion: string;
    currentStepId: string | null;
    pendingApproval: Record<string, unknown> | null;
    artifactIndex?: Record<string, string>;
    idempotencySnapshot?: Record<string, string>;
  }): Promise<RunCheckpoint> {
    verifyEventChain(input.events, this.hashes);
    const head = input.events.at(-1);
    if (!head) throw new RuntimeFailure("JOURNAL_EMPTY", "Cannot rebuild from empty Journal.", 6);
    const state = rebuildRunState(input.events);
    const checkpoint: RunCheckpoint = {
      checkpoint_id: this.ids.next("CHK"),
      run_id: input.runId,
      project_id: input.projectId,
      workflow_id: input.workflowId,
      workflow_version: input.workflowVersion,
      journal_head_sequence: head.sequence,
      journal_head_hash: head.event_hash,
      current_step_id: input.currentStepId,
      run_status: state.status as RunCheckpoint["run_status"],
      completed_steps: state.completedSteps,
      failed_steps: state.failedSteps,
      pending_approval: input.pendingApproval,
      artifact_index: input.artifactIndex ?? {},
      write_log_head: { entry_count: 0, last_write_id: null },
      idempotency_snapshot: input.idempotencySnapshot ?? {},
      created_at: this.clock.now().toISOString(),
      schema_version: "1.0.0",
      extensions: { rebuilt_from_journal: true },
    };
    await this.createCheckpoint(checkpoint);
    return checkpoint;
  }

  async compareCheckpointWithJournal(journal: RunJournal): Promise<string[]> {
    try {
      await this.verifyCheckpoint(journal);
      return [];
    } catch (error) {
      return [error instanceof RuntimeFailure ? error.code : "CHECKPOINT_INVALID"];
    }
  }

  async invalidateCheckpoint(reason: string): Promise<RunCheckpoint> {
    const checkpoint = await this.readCheckpoint();
    checkpoint.extensions = {
      ...checkpoint.extensions,
      invalidated: true,
      invalidation_reason: reason,
    };
    await this.createCheckpoint(checkpoint);
    return checkpoint;
  }
}

export async function createCheckpoint(store: CheckpointStore, checkpoint: RunCheckpoint) {
  return store.createCheckpoint(checkpoint);
}
export async function readCheckpoint(store: CheckpointStore) {
  return store.readCheckpoint();
}
export async function verifyCheckpoint(store: CheckpointStore, journal: RunJournal) {
  return store.verifyCheckpoint(journal);
}
export async function rebuildCheckpointFromJournal(
  store: CheckpointStore,
  input: Parameters<CheckpointStore["rebuildCheckpointFromJournal"]>[0],
) {
  return store.rebuildCheckpointFromJournal(input);
}
export async function compareCheckpointWithJournal(store: CheckpointStore, journal: RunJournal) {
  return store.compareCheckpointWithJournal(journal);
}
export async function invalidateCheckpoint(store: CheckpointStore, reason: string) {
  return store.invalidateCheckpoint(reason);
}
