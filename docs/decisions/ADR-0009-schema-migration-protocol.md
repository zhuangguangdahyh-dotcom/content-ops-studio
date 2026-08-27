# ADR-0009: Conservative schema migration protocol

**Status:** Accepted

## Context

Versioned contracts need an explicit way to plan future changes without rewriting historical project data or inventing migrations that never existed.

## Decision

Migrations are registered definitions with explicit source and target versions, classification, operations, warnings, and history-preservation flags. Planning validates a contiguous path. Execution defaults to pure dry-run, clones JSON input, writes nowhere, and returns a structured report.

PATCH is limited to validation-neutral metadata. MINOR permits backward-compatible optional additions. Field removal, type changes, new required fields, ID/state meaning changes, enum removal or reinterpretation, and relationship changes are MAJOR. Enum additions are POTENTIALLY_BREAKING because older consumers may not understand the new value.

Phase 1A registers only the truthful 1.0.0-to-1.0.0 no-op migration.

## Consequences

- Every future Schema change needs migration notes, classification, fixtures, and tests.
- Dry-run must not mutate input or write files/services.
- No migration deletes history or old finalized outputs.
- Missing paths block with a stable error instead of guessing.

## Alternatives considered

Implicit best-effort migration and destructive rollback were rejected because both make data provenance unreliable.
