# Phase 2A Recoverable Local Deterministic Runtime ExecPlan

Status: implementation complete; final verification passed  
Owner: repository maintainers  
Started: 2026-08-23  
Plugin version: 0.1.0 (frozen)  
Contract version: 1.0.0  
Schema version: 1.0.0

## Goal

Compose the Phase 1A domain/state contracts and Phase 1B visual/finalization contracts into an explicitly invoked, local, deterministic runtime that can initialize fictional projects, resolve versioned Packs, plan and execute Mock workflows, pause for G1/G4/G5, resume without duplicating verified work, audit every side effect, and recover from interruption without deleting history.

## Non-goals

- No production Feishu/Workspace Adapter, external network call, image provider, production Renderer, Playwright/Chromium, attachment upload, publishing, AI analysis/content/visual judgment, production MCP server, `.mcp.json`, `.app.json`, Hook, release, remote, push, license change, customer data, or Plugin version change.
- No implicit default-home creation and no runtime write inside the Plugin or repository during tests.
- No mock result may be represented as production success; `PRODUCTION` remains blocked until production Adapters exist.

## Background and current state

Bootstrap, Phase 1A core hardening, and Phase 1B visual finalization are implemented. The starting contract baseline contains 34 strict Draft 2020-12 schemas, 35 generated TypeScript files including the index, 11 state machines, 9 history-preserving invalidation rules, provider-neutral Adapter boundaries, and 88 passing tests. The repository has no commit, Git identity, or remote, so Phase 2A also creates a deterministic Phase 1B working-tree baseline manifest.

## Phase 1A dependencies

- Canonical schema registry, strict Ajv validation, generated declarations, identifiers, project/registry/workspace/write-log contracts, G1-G5 approval events, state transition runtime, migration protocol, and four-table Workspace Blueprint.

## Phase 1B dependencies

- Visual System, Page Visual Plan, Style Lock, Generation Manifest, Render Report, QA Report, Final Manifest, safe asset/checksum utilities, mock image/renderer boundaries, and version/history invalidation rules.

## Runtime boundary

`@content-ops/runtime` owns explicit filesystem I/O, coordination, journaling, checkpoints, locks, recovery, and dependency composition. `@content-ops/core` remains pure domain logic. Runtime imports Adapter interfaces and receives concrete implementations through composition; it never constructs provider HTTP requests. Runtime module import has no filesystem side effect.

## Composition Root and Runtime Mode

The Composition Root requires explicit `MOCK`, `DRY_RUN`, or `PRODUCTION` mode plus injected Clock, ID/hash providers, stores, registries, Adapters, workflow handlers, approval processor, and recovery manager. No hidden singleton is allowed. `MOCK` permits fixture handlers; `DRY_RUN` plans and validates without business writes; `PRODUCTION` rejects fixtures/mocks and is `BLOCKED` while production capabilities are absent.

## Project Home and Project Registry

Project Home resolution accepts explicit input or `CONTENT_OPS_HOME` without creating on import. Creation is explicit and tests use temporary roots. All paths use canonical containment checks and reject symlink escape. The atomic registry uses Project ID as unique key, permits duplicate names, records idempotency, rejects credentials, detects corruption, and supports auditable repair without silently dropping records.

## Pack loading, priority, and snapshots

Platform and industry packs are validated by formal schemas. Existing scaffold Packs produce warnings and are never labeled complete. Resolution order is safety/compliance/factual/tool permissions, current explicit request, confirmed project rules, platform pack, industry pack, then Plugin defaults. Run overrides are frozen into a resolution/snapshot; historical runs detect rather than absorb later Pack drift.

## Project Runtime Snapshot and Capability Registry

Each run captures project/profile version, Pack resolutions, active/rejected rules, workspace connection metadata without credentials, capabilities, source record versions, run ID, and creation time. Capability states distinguish `AVAILABLE`, `MOCK_ONLY`, `NOT_IMPLEMENTED`, `UNAVAILABLE`, `BLOCKED`, and `UNKNOWN`; probing is local and network-free. Production readiness requires actual production implementations.

## Workflow Definition and Run Plan

Workflow definitions declare deterministic sequences, existing dependencies, handlers, owner Skills, gates, capabilities, state transitions, retry/checkpoint/failure policy, and terminal conditions. Validation rejects duplicate steps, missing dependencies/handlers/gates, cycles, and mock-only production use. Run Plans bind immutable workflow/Pack/snapshot versions, task envelope, step sets, approval state, idempotency key, and resume ancestry.

## Run Store, Event Journal, Write Log, and Checkpoint

Run Store owns explicit per-run files. Event Journal is append-only canonical JSONL with contiguous sequence, genesis marker, previous hash, and SHA-256 event hash. Write Log is append-only and records pre-state, post-state, attempt, verification, and errors for local/Mock side effects. Atomic Checkpoints bind the Journal head, step status, approval state, artifacts, write-log head, and idempotency snapshot; they accelerate recovery but never replace the Journal as evidence.

## Approval resume

The approval processor validates Router ownership semantics, gate, target type/ID/version, decision, source run, deprecation, and idempotency. Approval history is appended to both approval and run event logs. G1/G4/G5 create checkpoints before `AWAITING_APPROVAL`; resume appends `RUN_RESUMING` and never infers approval.

## Idempotency

Canonical input hashes bind keys for project creation, registry upsert, Mock Workspace initialization, run start, steps, approvals, and final results. Same key/same input returns prior verified outcome or safely resumes; same key/different input is `CONFLICT`; completed steps do not normally rerun; only failed or explicitly invalidated work follows retry policy.

## Project Lock

One atomic exclusive write lock exists per project and binds run/owner. Refresh and release validate ownership. Active unknown-owner locks are never deleted. Stale recovery is explicit, preserves the stale record in audit history, and appends a recovery event/reason.

## Atomic writes

Atomic JSON uses a same-directory temporary file, restricted permissions where supported, file sync, rename, read-back, optional schema verification, and hash verification. Append-only JSONL writes one complete line, syncs, and verifies the tail. Partial/middle corruption blocks; logs are not silently truncated or rewritten.

## Crash recovery and corruption detection

Recovery verifies path containment, lock ownership, Journal structure/hash chain, Checkpoint/head binding, Write Log, idempotency, and existing external/local state. Verified successes are not repeated; unverified side effects are read before retry. A valid Journal can rebuild a damaged Checkpoint. Journal corruption blocks even if an older Checkpoint exists. Every recovery attempt appends evidence and preserves the run directory.

## CLI boundary

`content-ops` provides non-interactive doctor, Pack resolution, project create/inspect, run start/status/approve/resume/verify, and baseline create/verify. Required data comes from flags or JSON files, outputs are structured/redacted, no default Home is created, and exit codes distinguish success/awaiting/ready (0), blocked (2), conflict (3), failed (4), invalid input (5), and corruption (6).

## Mock Workspace and reference workflows

The local Mock Workspace materializes the four-table Blueprint in a supplied temporary project directory, uses explicit Mock IDs, supports all planned table/field/view/record operations, read-after-write verification, idempotency, and partial failure injection. `PROJECT_INITIALIZATION_LOCAL_V1` pauses at G1 and proves project activation after current approval. `VISUAL_FINALIZATION_FIXTURE_V1` uses real fictional fixture files and pauses independently at G4/G5; neither can load outside `MOCK`.

## Node 20 evidence strategy

The probe checks only existing commands/managers/containers/Homebrew/system locations. It installs nothing and changes no shell configuration. If a real Node 20 is found, it runs the bounded contract/runtime command set; otherwise it records `NOT_AVAILABLE`. Missing evidence keeps repository compatibility `PARTIAL` without failing Phase 2A implementation.

## Git and no-commit baseline strategy

Git identity remains untouched. With no commits, a read-only `phase-1b-working-tree-baseline.json` records sorted repository-relative path, SHA-256, size, category, exclusions, count, and aggregate hash without file contents or absolute user paths. Baseline creation never overwrites an existing manifest; verification reports added/removed/changed/unchanged files and aggregate drift. It is audit evidence, not a Git replacement.

## New schemas

Eleven closed Draft 2020-12 contracts: Runtime Config, Platform Pack, Industry Pack, Pack Resolution, Project Runtime Snapshot, Workflow Definition, Run Plan, Run Event, Run Checkpoint, Project Lock, and Runtime Diagnostic. All enter the catalog, type generation, fixtures, strict Ajv validation, migration notes, and CI.

## New package and dependencies

Add `packages/runtime` and make CLI depend on it. No new external production or development dependency is planned; Node built-ins plus existing contract/core/Adapter workspaces are sufficient.

## Security and privacy risks

Risks are path/symlink escape, secret leakage into events/diagnostics, mock/production confusion, implicit default-home writes, corrupted logs, and unsafe lock takeover. Controls are canonical containment, explicit modes, closed schemas, redacted summaries, no network default, restricted permissions, read-back/hash verification, capability blocking, and secret scanning. Fixtures remain fictional; no customer chat or workspace identifier is stored.

## Concurrency and recovery risks

Process death can occur after a side effect but before verification/checkpoint; competing runs can race; stale locks and partial JSONL tails can mislead recovery. Exclusive creation, write logs, idempotency, Journal hash chains, Checkpoint/head comparison, explicit stale recovery, and failure injection cover these boundaries. History is never deleted as rollback.

## Files involved

- ADR-0010 through ADR-0013 and Phase 2A documentation/reports.
- Eleven canonical schemas, generated declarations, fixtures, catalog, migration notes/tests.
- `packages/runtime`, expanded `packages/cli`, and expanded local Mock Workspace Adapter.
- Baseline/Node 20 scripts, root commands, CI, references, tests, and report index.

## Test matrix

- Runtime modes/config/Home; registry atomicity/idempotency/corruption; Pack schema/resolution/drift; capability/doctor truthfulness; workflow DAG/handlers/gates/production rejection.
- Atomic JSON/JSONL/path/symlink/checksum/non-overwrite; lock ownership/concurrency/stale recovery; Journal sequence/hash/tamper/reorder/delete/redaction; Checkpoint binding/rebuild/blocking.
- Idempotent project/step/approval/final result; Write Log partial/verified history; recovery after every instructed interruption point.
- Mock Workspace complete interface, read-after-write, partial failure and failed-only retry; project-init G1 E2E; visual G4/G5 E2E with actual fixture files.
- CLI JSON, stable exit codes, missing inputs, doctor, project/run lifecycle, verification, and redaction.
- Phase 1A/1B regression, strict schema/generation, secret/example scans, Node 24 full check, and bounded Node 20 probe.

## Failure recovery

- Repair canonical schemas or resolvers and regenerate; never hand-edit generated types.
- Preserve baseline manifest, journals, checkpoints, approvals, write logs, and run artifacts.
- On Journal corruption, block and emit a diagnostic; never truncate or trust an older Checkpoint.
- On Checkpoint corruption with intact Journal, rebuild a new Checkpoint and append recovery evidence.
- On incomplete local/Mock writes, read existing state and retry only missing/unverified parts.
- If Node 20 is absent, record the gap and continue on Node 24. If Git identity is absent, skip commits and rely on baseline/change reports.

## Implementation steps

1. Complete Preflight, Phase 1B regression check, report wording audit, and establish the Phase 1B working-tree baseline.
2. Add four accepted runtime ADRs and eleven runtime schemas/catalog/fixtures/generated declarations.
3. Build `@content-ops/runtime` composition, config, Home, registry, Packs, capabilities, workflows, run store, and diagnostics.
4. Build atomic storage, Journal, Write Log, Checkpoint, lock, idempotency, approvals, and recovery.
5. Complete the local Mock Workspace Adapter, two MOCK-only reference workflows, and non-interactive CLI.
6. Add focused/failure/E2E/CLI tests, root commands, CI coverage, Node 20 probe, and working-tree change reporting.
7. Update required docs, shared references, CHANGELOG, report index, and six Phase 2A reports.
8. Run the exact final verification sequence, record all exits, and create local commits only if pre-existing Git identity permits.

## Implementation log

- 2026-08-23: Read the complete 3,203-line Phase 2A instruction, global/repository/Plugin instructions, required product/architecture/state/security/testing documents, accepted ADRs, Phase 1A/1B plans and reports, schema/catalog/config/Blueprint/references, package sources, scripts, services, and tests.
- 2026-08-23: Preflight confirmed Node 24.19.0, pnpm 11.19.0, `main` with no commits, no remote, and no configured Git user name/email. No identity or remote was changed.
- 2026-08-23: Untouched Phase 1B baseline `CI=true pnpm check` passed with 16 test files and 88/88 tests; no Phase 1A/1B regression exists.
- 2026-08-23: Historical report wording audit found no remaining claim that uncommitted lockfile, CI, or repository files are committed.
- 2026-08-23: Created the immutable Phase 1B working-tree baseline, accepted ADR-0010 through ADR-0013, added eleven strict runtime contracts and generated types/fixtures, and retained Plugin version 0.1.0.
- 2026-08-23: Implemented Runtime config/composition, explicit Project Home, atomic Registry, Pack resolution/snapshots, capabilities, deterministic workflows/plans, Run Store, atomic storage, hash-chained Journal, Write Log, Checkpoint, Lock, idempotency, approvals, recovery, diagnostics, and CLI.
- 2026-08-23: Implemented the persistent four-table Blueprint Mock Workspace and both temporary-Home reference E2Es with real sanitized fixture files and explicit G1/G4/G5 resume.
- 2026-08-23: Bounded Node 20 probe returned `NOT_AVAILABLE` without installation or download. Node 24.19.0 complete `CI=true pnpm check` passed with 23 test files and 109/109 tests.

## Final result

Phase 2A implementation is `SUCCESS`. Repository compatibility remains `PARTIAL` only because real Node 20 evidence is unavailable. Production capabilities remain explicitly blocked.

## Unresolved questions

- Real Node 20 execution evidence remains open until the bounded probe discovers an existing runtime or remote CI is later available.
- Local commits remain unavailable unless the Operator configures a legitimate Git identity outside this task.
