# ADR-0004: No Hooks in V1

**Status:** Accepted

## Context

Hooks introduce implicit execution and additional trust cost.

## Decision

V1 includes no Hooks or hook manifest.

## Consequences

All actions remain explicitly routed and capability-checked.

## Alternatives considered

Lifecycle hooks for initialization or validation were rejected for V1.

## Follow-up

Any future Hook requires a security review and accepted ADR.
