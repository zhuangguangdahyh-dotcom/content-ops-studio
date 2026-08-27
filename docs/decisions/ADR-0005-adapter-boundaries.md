# ADR-0005: Adapter boundaries

**Status:** Accepted

## Context

Skills must remain portable and cannot safely own provider-specific HTTP behavior.

## Decision

Skills and Core never call external HTTP directly. All external reads and writes pass through an Adapter or MCP boundary.

## Consequences

Mocks can validate contracts without credentials; production integrations require explicit implementations and capability checks.

## Alternatives considered

Direct Feishu and image-provider calls inside Skills were rejected.

## Follow-up

Create an ExecPlan for every concrete external service.
