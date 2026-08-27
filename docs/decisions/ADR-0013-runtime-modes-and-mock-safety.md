# ADR-0013: Runtime modes and Mock safety

**Status:** Accepted

## Context

Phase 2A needs executable fixtures and local side effects without making a contract-complete mock look like a production integration.

## Decision

Runtime Mode is always explicit:

- `MOCK` permits fixture workflows, local Mock Workspace, test fixture asset providers, and temporary local project writes. Results identify Mock providers and never claim Feishu/image/render production success.
- `DRY_RUN` validates, resolves, diagnoses, and plans but produces no business side effect.
- `PRODUCTION` rejects fixture workflows and Mock success. Missing production Workspace, research, image, renderer, or asset capabilities returns `BLOCKED`; it never falls back to mocks.

External network is disabled by default and cannot be enabled in Phase 2A. Fixture Adapters and handlers are registered only for test/Mock composition. Capability reports distinguish `AVAILABLE` from `MOCK_ONLY` and `NOT_IMPLEMENTED`.

## Consequences

Local E2E execution is useful without overstating readiness. Production remains intentionally blocked until separately authorized Adapters exist.

## Alternatives considered

One permissive mode, implicit mock fallback, treating Dry Run as a write sandbox, and reporting fixture files as provider outputs were rejected.

## Follow-up

Each production Adapter must add capability evidence, network/credential review, and mode-specific tests before Production readiness can change.
