# ADR-0011: Append-only Journal and Checkpoints

**Status:** Accepted

## Context

Runs can stop after a step or side effect but before verification or checkpointing. A mutable status file alone cannot prove what occurred or distinguish stale state from verified history.

## Decision

Use an append-only JSONL Journal. Events have a continuous sequence, explicit genesis previous hash, previous-event hash, and SHA-256 hash over canonical event data excluding `event_hash`. History is never rewritten.

Atomic Checkpoints cache the current step, run status, completed/failed steps, approval state, artifact/index and idempotency snapshots, and bind the exact Journal head sequence/hash. Checkpoints are acceleration data, not the sole fact source. Recovery replays the Journal, appends a recovery event, and may rebuild a damaged Checkpoint only when the full Journal chain is valid. Journal corruption blocks; an older Checkpoint cannot authorize continuation.

## Consequences

Interruption and tampering are detectable and replay is deterministic. Journals grow over time and need later retention policy, but destructive compaction is outside this phase.

## Alternatives considered

Mutable run JSON, Checkpoint-only recovery, truncating a damaged tail, and rewriting historical events were rejected because they destroy provenance.

## Follow-up

Future retention or archival work must preserve verifiable history and require a separate migration/ADR.
