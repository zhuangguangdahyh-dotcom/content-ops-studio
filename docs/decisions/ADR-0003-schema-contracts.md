# ADR-0003: Versioned Schema contracts

**Status:** Accepted

## Context

Hand-maintained JSON Schema and TypeScript domain types can drift.

## Decision

Versioned contracts are the future single source of truth. Bootstrap implements only clear common JSON Schemas; domain Schemas remain planned.

## Consequences

Schema changes require migration documentation and tests. Type generation must replace long-term dual hand-authoring.

## Alternatives considered

Unversioned objects and a complete speculative Schema set were rejected.

## Follow-up

Fulfilled by the Phase 1A ExecPlan and ADR-0007. JSON Schema is now the implemented single source of truth for 27 formal contracts.
