# ADR-0007: JSON Schema to TypeScript generation

**Status:** Accepted

## Context

ADR-0003 made versioned JSON Schema the intended contract source, but Bootstrap still carried handwritten TypeScript interfaces. Dual authoring permits fields, enums, and optionality to drift.

## Decision

Draft 2020-12 JSON Schemas under `plugins/content-ops-studio/schemas/1.0/` are the single source of truth. `json-schema-to-typescript` 15.0.4 generates committed declarations under `packages/contracts/src/generated/1.0/`. A freshness check renders into a temporary directory and rejects missing, stale, or extra output without editing the working tree.

The compiler does not natively resolve Draft 2020-12 `$defs` reliably. The generator therefore builds a temporary, fully dereferenced compiler view, strips Schema-only metadata, and compiles that view. Canonical source files remain unchanged and strict Ajv validates the original Draft 2020-12 documents.

## Consequences

- Generated declarations are never hand-edited.
- A Schema change must regenerate declarations and pass freshness and TypeScript checks.
- The compatibility adapter is deterministic and isolated from runtime validation.
- `json-schema-to-typescript` is development-only; Ajv and `ajv-formats` are runtime dependencies of the contracts package.

## Alternatives considered

Handwritten types, permissive `any`, and downgrading the canonical schemas to Draft-07 were rejected because each weakens the contract boundary.
