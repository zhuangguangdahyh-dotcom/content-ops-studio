import type { RunEvent } from "../../../contracts/src/generated/1.0/index.js";
import type { Clock, HashProvider, IdFactory } from "../types.js";
import { AppendOnlyJsonlStore, canonicalJson } from "../storage/index.js";
import { redactValue, RuntimeFailure } from "../types.js";

export interface AppendEventInput {
  event_type: RunEvent["event_type"];
  run_id: string;
  project_id: string;
  workflow_id: string;
  step_id: string | null;
  status: RunEvent["status"];
  payload_summary?: Record<string, unknown>;
  artifact_refs?: string[];
  error?: RunEvent["error"];
}

function eventHashInput(event: RunEvent): Record<string, unknown> {
  const { event_hash: _eventHash, ...input } = event;
  void _eventHash;
  return input;
}

export class RunJournal {
  readonly #store: AppendOnlyJsonlStore<RunEvent>;
  constructor(
    file: string,
    private readonly clock: Clock,
    private readonly ids: IdFactory,
    private readonly hashes: HashProvider,
  ) {
    this.#store = new AppendOnlyJsonlStore(file);
  }

  async appendEvent(input: AppendEventInput): Promise<RunEvent> {
    const events = await this.readEvents();
    verifyEventChain(events, this.hashes);
    const previous = events.at(-1);
    const base = {
      event_id: this.ids.next("EVT"),
      sequence: events.length + 1,
      event_type: input.event_type,
      run_id: input.run_id,
      project_id: input.project_id,
      workflow_id: input.workflow_id,
      step_id: input.step_id,
      status: input.status,
      payload_summary: redactValue(input.payload_summary ?? {}) as Record<string, unknown>,
      artifact_refs: [...(input.artifact_refs ?? [])],
      error: input.error ?? null,
      previous_event_hash: previous?.event_hash ?? "GENESIS",
      created_at: this.clock.now().toISOString(),
      schema_version: "1.0.0" as const,
      extensions: {},
    };
    const event: RunEvent = {
      ...base,
      event_hash: this.hashes.sha256(canonicalJson(base)),
    };
    await this.#store.append(event);
    return event;
  }

  readEvents(): Promise<RunEvent[]> {
    return this.#store.readAll();
  }

  async getJournalHead(): Promise<{ sequence: number; hash: string } | null> {
    const events = await this.readEvents();
    verifyEventChain(events, this.hashes);
    const head = events.at(-1);
    return head ? { sequence: head.sequence, hash: head.event_hash } : null;
  }
}

export function verifyEventChain(events: RunEvent[], hashes: HashProvider): void {
  let previous = "GENESIS";
  for (const [index, event] of events.entries()) {
    if (event.sequence !== index + 1)
      throw new RuntimeFailure("JOURNAL_SEQUENCE_CORRUPTION", `Expected sequence ${index + 1}.`, 6);
    if (event.previous_event_hash !== previous)
      throw new RuntimeFailure(
        "JOURNAL_HASH_CHAIN_BROKEN",
        `Previous hash differs at ${index + 1}.`,
        6,
      );
    const expected = hashes.sha256(canonicalJson(eventHashInput(event)));
    if (event.event_hash !== expected)
      throw new RuntimeFailure("JOURNAL_EVENT_TAMPERED", `Event hash differs at ${index + 1}.`, 6);
    previous = event.event_hash;
  }
}

export function rebuildRunState(events: RunEvent[]): {
  completedSteps: string[];
  failedSteps: string[];
  status: string;
} {
  const completedSteps: string[] = [];
  const failedSteps: string[] = [];
  let status = "RUN_CREATED";
  for (const event of events) {
    if (
      event.event_type === "STEP_COMPLETED" &&
      event.step_id &&
      !completedSteps.includes(event.step_id)
    )
      completedSteps.push(event.step_id);
    if (event.event_type === "STEP_FAILED" && event.step_id && !failedSteps.includes(event.step_id))
      failedSteps.push(event.step_id);
    if (event.event_type === "APPROVAL_REQUESTED") status = "AWAITING_APPROVAL";
    if (event.event_type === "RUN_RESUMING") status = "RUN_RESUMING";
    if (event.event_type === "RUN_BLOCKED" || event.event_type === "CORRUPTION_DETECTED")
      status = "RUN_BLOCKED";
    if (event.event_type === "RUN_COMPLETED") status = "RUN_SUCCEEDED";
  }
  return { completedSteps, failedSteps, status };
}

export function detectJournalCorruption(events: RunEvent[], hashes: HashProvider): string[] {
  try {
    verifyEventChain(events, hashes);
    return [];
  } catch (error) {
    return [error instanceof RuntimeFailure ? error.code : "JOURNAL_CORRUPTION"];
  }
}

export async function appendEvent(journal: RunJournal, input: AppendEventInput) {
  return journal.appendEvent(input);
}
export async function readEvents(journal: RunJournal) {
  return journal.readEvents();
}
export async function getJournalHead(journal: RunJournal) {
  return journal.getJournalHead();
}
