# ADR-0008: Deterministic data-driven state machines

**Status:** Accepted

## Context

The locked workflow has eleven independent state dimensions and five human approval gates. A distributed set of conditionals would make legal transitions, ownership, invalidation, and failure behavior difficult to audit.

## Decision

Transition topology lives in eleven versioned JSON definitions. Each transition declares from/to state, trigger, owner Skill, approval gate, required context, invalidations, and description. Pure core functions load definitions, list transitions, validate and apply requests, calculate invalidations, and evaluate centralized cross-state invariants.

G1-G5 approval transitions are Router-owned and bind gate, target type, target ID, and target version. Deprecated or stale approvals never advance state. Specialist Skills cannot write Router-owned approval results. State evaluation performs no writes and uses the request timestamp as the deterministic evaluation timestamp.

## Consequences

- New topology is reviewable as data and checked against the canonical status map.
- Business invariants remain centralized code with exhaustive tests rather than duplicated across transitions.
- Content finalization and synchronization remain independent; partial sync never rewrites image or content business status.
- History is preserved; invalidation marks downstream work stale rather than deleting it.

## Alternatives considered

Arbitrary from/to assignment and one monolithic switch were rejected because they obscure ownership and make unsupported transitions easy to introduce.
