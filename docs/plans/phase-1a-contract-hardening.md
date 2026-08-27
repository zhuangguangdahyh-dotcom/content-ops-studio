# Phase 1A Contract Hardening ExecPlan

Status: implementation complete; compatibility evidence partial  
Owner: repository maintainers  
Started: 2026-08-23  
Plugin version: 0.1.0 (frozen)  
Contract version: 1.0.0  
Schema version: 1.0.0

## Goal

Harden the deterministic core domain boundary before any production integration is added. The repository will use versioned Draft 2020-12 JSON Schemas as the single source of truth, generated TypeScript declarations, strict Ajv runtime validation, machine-readable Feishu workspace metadata, data-driven state machines, version-bound approval gates, explicit invalidation rules, and a non-destructive migration protocol.

## Non-goals

- No real Feishu, research, image generation, renderer, publishing, attachment upload, MCP, hook, or service integration.
- No `.app`, `.mcp.json`, or hook additions.
- No remote repository or push.
- No license decision or publisher metadata.
- No Plugin version change and no automatic changes to core Skills, platform packs, or industry packs.
- The seven visual/final artifact contracts remain planned rather than implemented.

## Current contracts

Bootstrap contains six initial schemas and handwritten TypeScript interfaces. The schemas use a non-standard top-level `version` keyword and tests currently disable Ajv strictness. The catalog is a pair of name arrays, the Feishu template is a README placeholder, and core production checks are encoded as a small handwritten switch rather than versioned machine data.

## Implemented schema target

Twenty-seven formal schemas:

- Existing, hardened: common-definitions, task-envelope, task-result, error, approval-event, run-manifest.
- Domain: project-profile, project-registry, workspace-connection, workspace-field-map, workspace-blueprint, evidence-record, painpoint-record, painpoint-batch, content-page, content-record, content-package, content-fingerprint, feedback-record, active-project-rules, rejected-directions, write-log, capabilities.
- State and migration: state-transition-request, state-transition-result, schema-migration, migration-report.

## Planned schema target

Seven contracts remain cataloged as planned: visual-system, page-visual-plan, style-lock, generation-manifest, render-report, qa-report, final-manifest.

## JSON Schema single source of truth

- Canonical source: `plugins/content-ops-studio/schemas/1.0/*.schema.json`.
- Draft: JSON Schema 2020-12.
- Every schema has a stable `$id`, title, description, and version metadata carried through `$comment` and catalog fields.
- Closed objects use `additionalProperties: false`; deliberately extensible payloads expose a controlled `extensions` object.
- Identifiers, semantic versions, timestamps, dates, relative paths, and status enums are centralized in common definitions and referenced from domain schemas.

## TypeScript generation

- Generate committed declarations under `packages/contracts/src/generated/1.0/`.
- Use `json-schema-to-typescript` only after proving representative cross-file `$ref` generation on Node 20/24-compatible package versions.
- Generated files carry the required do-not-edit header.
- `contracts:check-generated` renders into a temporary directory and fails on missing, stale, or extra generated files without modifying the working tree.

## Ajv runtime validation

- Use `Ajv2020` with `strict: true` and `allErrors: true`.
- Register standard formats through `ajv-formats`; do not substitute permissive format stubs.
- Load and register the entire implemented catalog before compiling validators.
- Return stable, redacted error objects containing schema ID, instance path, schema path, keyword, message, and params without echoing full input values.

## Workspace Blueprint

- Canonical file: `plugins/content-ops-studio/templates/feishu/workspace-v1.json`.
- Four logical tables: Projects, Painpoints, Content Library, and Feedback & Rules.
- Field metadata records stable logical keys, labels, types, requirements, primary field, uniqueness, mutability ownership, relations, options, and descriptions.
- Logical keys are unique workspace-wide and each table has exactly one primary field.
- `workspace-field-map` is generated and validated from the blueprint rather than authored independently.

## State-machine structure

Eleven JSON definitions under `plugins/content-ops-studio/config/state-machines/`: project status, config confirmation, painpoint review, painpoint contentization, content status, image status, first-page approval, final approval, sync status, rule status, and run status. Each declares machine name, version, states, initial and terminal states, and transitions with trigger, owner Skill, required context, approval gate, invalidations, and description.

## Approval version binding

G1-G5 approvals bind one gate to one target type, ID, and version. A transition accepts an approval only when the gate, target type, target ID, target version, approving decision, and non-deprecated status all match the transition request. Stale or superseded approvals never authorize downstream work.

## Cross-state invariants

Centralized deterministic checks will enforce project/config readiness, reviewed painpoints, approved and current copy, first-page approval, style-set readiness, QA readiness, final approval, stale approval rejection, and transition ownership. Invariants stay in core code while transition topology stays in versioned data.

## Invalidation rules

`plugins/content-ops-studio/config/invalidation-rules.json` maps upstream changes to explicit approval/artifact/state invalidations. Invalidation is additive and traceable; it never deletes history or overwrites approved content.

## Migration protocol

- Schema migration and migration report contracts are versioned schemas.
- A registry and planner classify changes as PATCH, MINOR, MAJOR, or POTENTIALLY_BREAKING.
- Baseline provides only an honest 1.0.0-to-1.0.0 no-op migration.
- Execution defaults to dry-run, does not mutate its input, is deterministic, idempotent, and reports planned/applied operations.

## Files and directories

- Schema source and catalog: `plugins/content-ops-studio/schemas/1.0/`.
- Blueprint/templates: `plugins/content-ops-studio/templates/feishu/`.
- State data: `plugins/content-ops-studio/config/state-machines/` and `invalidation-rules.json`.
- Generated declarations: `packages/contracts/src/generated/1.0/`.
- Validation, generation support, fingerprints, migrations: `packages/contracts/src/`.
- State-machine runtime: `packages/core/src/state-machine/`.
- Fixtures: `tests/fixtures/contracts/1.0/`.
- Reports: `reports/phase-1a-*.md`.

## Dependencies

- `ajv-formats`: production contract validation requires real Draft 2020-12 date/date-time/URI format checks.
- `json-schema-to-typescript`: development-only compiler used to derive declarations from the canonical schemas and eliminate handwritten drift.
- No other production dependency is planned.

## Security and privacy

- Workspace connection contracts store identifiers and verification state, never credentials or access tokens.
- Strict schemas reject undeclared secret-like properties.
- Validation errors avoid full instance values.
- Fixtures are fictional and sanitized.
- Existing secret scanning and example sanitization remain mandatory.

## Compatibility strategy

- Node 20: contract generation, freshness, schema validation, contract tests, typecheck, and relevant security checks.
- Node 24: complete repository check.
- CI uses a Node 20/24 matrix with the above scope split.

## Test matrix

- Schema meta-validation and strict compilation.
- Catalog completeness and source/generated parity.
- Valid fixtures for every implemented schema.
- Missing-required and invalid-enum fixtures for every implemented schema, plus malformed ID/version, stale approval, and secret-field rejection.
- Blueprint uniqueness, primary field, relation, and generated field-map checks.
- Generated declaration freshness and representative cross-schema types.
- State transition positive, negative, ownership, approval, invariant, invalidation, and purity cases.
- Migration planning, no-op, dry-run, idempotency, and non-mutation.
- Node 20 and Node 24 command evidence.

## Failure recovery

- If dependency compatibility fails, pin the last compatible package version or replace it with a documented equivalent without relaxing schema strictness.
- If schema generation fails, repair the source schema or resolver; never hand-edit generated declarations.
- If a state test fails, correct either the machine data or the centralized invariant with an explicit test; do not bypass gates.
- If a compatibility target cannot be executed locally, report PARTIAL with exact missing evidence rather than claiming success.

## Execution steps

1. Revalidate bootstrap, correct its report, and create a baseline commit only if local identity is already usable.
2. Add dependencies and prove schema compiler compatibility.
3. Replace schema source, catalog, blueprint, and generated field-map.
4. Implement declaration generation/freshness and strict runtime validation.
5. Implement fingerprints, migrations, state definitions, invalidations, and state runtime.
6. Generate fixtures and add tests.
7. Update CI, ADRs, docs, inventory, matrix, and final reports.
8. Run all required checks on Node 20 and Node 24.
9. Create the Phase commit only if local identity is already usable.

## Progress log

- 2026-08-23: Read all mandatory preflight documents and shared references.
- 2026-08-23: `CI=true pnpm check` passed on the untouched bootstrap baseline (19 tests).
- 2026-08-23: Corrected the bootstrap report to say the lockfile is generated and present in the working tree.
- 2026-08-23: Baseline commit skipped because no local Git user name or email is configured; global or local identity was not modified.
- 2026-08-23: Implemented and strictly compiled 27 canonical schemas; kept seven Phase 1B schemas honestly planned.
- 2026-08-23: Generated 27 TypeScript declarations plus an index with deterministic freshness checking.
- 2026-08-23: Added the four-table, 141-field Workspace Blueprint and generated Field Map.
- 2026-08-23: Added eleven state machines, 87 transitions, G1-G5 validation, cross-state invariants, and eight invalidation rules.
- 2026-08-23: Added deterministic fingerprints, the 1.0.0 no-op migration protocol, 124 contract fixtures, and approval-boundary state fixtures.
- 2026-08-23: Added Node 20/24 CI matrix and passed 61 tests locally on Node 24.
- 2026-08-23: Local Node 20 execution remains unverified because both the official archive and architecture-specific npm tarball timed out during download.

## Final verification

`CI=true pnpm check` passes on Node 24.19.0: formatting, lint, typecheck, strict validation of 27 schemas, generated-type freshness, Workspace Blueprint validation, 61 tests, Plugin validation, Bootstrap verification, secret scanning, and example sanitization. Local Node 20 evidence is blocked by binary download timeout; CI is configured to execute it. Phase status is therefore PARTIAL rather than SUCCESS.

## Unresolved decisions

- `json-schema-to-typescript` 15.0.4 is pinned and proven through deterministic generation. Its Draft 2020-12 `$defs` limitation is handled by an isolated fully dereferenced compiler view documented in ADR-0007.
- Actual local Node 20 execution still needs a reachable Node 20 binary; CI contains the required Node 20 contract job.
