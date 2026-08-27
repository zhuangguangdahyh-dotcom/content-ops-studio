# Phase 1A architecture diff report

## Baseline

- Six common schemas with a non-standard top-level `version` keyword.
- Handwritten task/result/approval interfaces.
- Ajv tests compiled with strict mode disabled and permissive format stubs.
- Schema catalog stored only implemented/planned name arrays.
- Feishu workspace and field map were documentation placeholders.
- Core workflow checks were a small handwritten action switch.
- No migration registry, deterministic fingerprint, domain fixtures, or Node matrix.

## Phase 1A

- Twenty-seven canonical Draft 2020-12 schemas, strict Ajv runtime validation, standard formats, stable redacted errors, and a structured 34-entry catalog.
- Twenty-seven generated declarations plus a generated index, required headers, temporary-directory freshness comparison, and no handwritten domain contract duplication.
- A four-table, 141-field Workspace Blueprint and a field-map template derived from its stable logical keys.
- Eleven versioned state-machine definitions with 87 transitions, G1-G5 binding, centralized cross-state invariants, owner enforcement, and eight history-preserving invalidation rules.
- Deterministic NFKC/lowercase/whitespace normalization with SHA-256 hashing; no embedding or semantic-deduplication claim.
- A conservative migration registry and truthful 1.0.0 no-op dry run.
- 124 contract fixture files plus four approval-boundary state fixtures.
- Node 20/24 CI matrix, three accepted ADRs, inventories, transition matrix, and expanded tests.

## Deliberately unchanged

- Plugin version remains 0.1.0.
- Plugin manifest shape and publisher metadata remain unchanged.
- No real Feishu, research, image generation, renderer, publishing, attachment upload, MCP, hook, `.app`, or `.mcp.json` behavior was added.
- The seven Phase 1B visual/final schemas remain planned without empty placeholders.
- No customer data, credentials, or real external identifiers were added.
