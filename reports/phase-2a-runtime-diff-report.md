# Phase 2A Runtime Diff Report

> Historical snapshot addendum (2026-08-24): ADR-0014 supersedes Node 20 as a current compatibility target and release blocker. The current V0.1.0 baseline is Node 24 LTS (`>=24 <25`); Phase 2A.1 provides the generic runtime evidence contract.

## Planned versus implemented

The accepted plan was implemented without a production-scope expansion: one new Runtime package, CLI composition, eleven additive schemas/types/fixtures, explicit Project Home and Registry, normalized scaffold Pack resolution, capability gating, deterministic workflow/run plans, atomic storage, Journal, Write Log, Checkpoint, Lock, idempotency, approval resume, recovery, persistent Mock Workspace, two Mock E2E workflows, bounded Node 20 probe, tests, docs, and reports.

## Adjustments

- Existing Pack source files were not auto-modified. The Runtime loader normalizes and validates their current scaffold format, emits warnings, and freezes hashes in per-Run resolutions.
- The complete file-backed Mock Workspace was added as `PersistentLocalMockWorkspaceAdapter`; the bootstrap in-memory Adapter remains for backward compatibility.
- The CLI delegates lifecycle behavior to `ReferenceRuntimeEngine`; CLI parsing and structured output remain separate.
- The `run-event` previous hash contract uses one exact regular expression for `GENESIS` or lowercase SHA-256, avoiding an imprecise generated `"GENESIS" | string` type.
- The Phase 1B fixture generator was extended for all runtime contracts and regenerated deterministic fixtures; no customer fixture was introduced.

## Dependency and storage effects

No external dependency was added. Workspace-only dependencies were added to Runtime and CLI, with the lockfile refreshed. Runtime tests write only to operating-system temporary directories. Atomic JSON uses same-directory temporary files, sync, rename, read-back, and hash verification; JSONL remains append-only.

## Risk and follow-up

No material Phase 2A runtime deviations. Production services remain blocked. The notable open risk is missing real Node 20 evidence; Pack sources also remain explicit scaffolds. Neither condition is hidden by Mock success.
