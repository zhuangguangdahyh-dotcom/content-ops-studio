# ADR-0010: Runtime package and Composition Root

**Status:** Accepted

## Context

Phase 1 contracts and pure core validators do not coordinate filesystem state, Adapter calls, locks, checkpoints, or recovery. Putting those effects in `packages/core` would erase the pure-domain boundary and make deterministic testing harder.

## Decision

Create `@content-ops/runtime` for explicit I/O and orchestration. Core remains pure. CLI parses commands and delegates to runtime; it does not own lifecycle rules. Adapters implement provider-neutral interfaces and are injected. A future MCP service may depend on runtime but runtime never depends on MCP or exposes an active server in Phase 2A.

One explicit Composition Root receives Runtime Mode, Clock, ID/hash providers, Home/registry/Pack/capability/workflow/run stores, Adapter interfaces, lock/journal/checkpoint/write-log/idempotency/approval/recovery services, and handler registry. Imports create no directories and no hidden global singleton. Tests inject a fake Clock and deterministic ID factory.

## Consequences

Effects are auditable and replaceable; production cannot silently fall back to mocks. Construction is more verbose, but dependencies and capabilities are reviewable. ADR-0014 additionally requires Runtime composition and executable reference workflows to validate the Node 24 LTS policy; tests may inject an explicit fake Runtime version.

## Alternatives considered

I/O inside Core, CLI-owned orchestration, service-locator globals, and MCP-first runtime composition were rejected because they obscure effects or couple the local engine to an external surface.

## Follow-up

Any production Adapter or live MCP composition requires its own accepted ExecPlan and production-readiness evidence.
