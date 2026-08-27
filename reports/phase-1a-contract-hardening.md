# Phase 1A contract hardening report

## Result

**PARTIAL**

The Core Domain Contracts and deterministic state-machine implementation is complete and passes the full repository check on local Node 24.19.0. Local Node 20 execution could not be completed because both attempted isolated binary downloads timed out. The required Node 20/24 CI matrix is configured and present in the working tree, but no remote CI was run and no Node 20 success is claimed.

## Delivered scope

- 27 implemented Draft 2020-12 JSON Schemas and 7 honestly planned Phase 1B entries.
- Strict Ajv 2020 runtime registry with `allErrors: true`, real standard formats, resolvable references, stable redacted errors, `assertValid`, and validation-by-ID.
- 27 generated TypeScript declarations plus one generated index with the required header and deterministic temporary-directory freshness comparison.
- Four-table Feishu Workspace Blueprint with 141 fields, stable workspace-wide field logical keys, relations, views, ownership metadata, and a generated Field Map template.
- 11 state machines, 87 configured transitions, all G1-G5 gates, centralized cross-state invariants, owner-Skill checks, terminal-state checks, and 8 version invalidation rules.
- Version-bound approval events with one gate/target/type/ID/version/decision, optional deprecation time, and stale/mismatch rejection.
- Deterministic NFKC, newline, case, and whitespace normalization plus SHA-256 fingerprinting. No embedding or semantic-similarity claim was added.
- Conservative schema migration protocol with PATCH/MINOR/MAJOR/POTENTIALLY_BREAKING classification and only the truthful 1.0.0-to-1.0.0 no-op dry run.
- 124 contract fixture files, 4 state approval-boundary fixtures, a referentially consistent fictional cross-object fixture, and 61 automated tests across 11 test files.
- ADR-0007 through ADR-0009, Schema inventory, state transition matrix, architecture diff, CI matrix, and updated engineering documentation.

## Schema and generation evidence

- Implemented schemas: 27.
- Planned schemas: 7.
- Unique canonical `$id` values: 27.
- Generated TypeScript files: 28, including the index.
- Valid contract fixtures: 28, including the cross-object workflow bundle.
- Invalid contract fixtures: 96.
- Type generation dependency: `json-schema-to-typescript` 15.0.4, development-only.
- Runtime validation dependencies: Ajv 8.20.0-compatible range and `ajv-formats` 3.0.1 in `@content-ops/contracts`.

`json-schema-to-typescript` does not reliably resolve Draft 2020-12 `$defs`. The generator keeps the canonical source unchanged and compiles a temporary fully dereferenced view. Strict Ajv always validates the original Draft 2020-12 schemas. This is documented in ADR-0007 and covered by generation/freshness tests.

## Workspace evidence

- Tables: 4 (`projectConfig`, `painpoints`, `contents`, `rulesAndFeedback`).
- Fields: 141.
- Exactly one primary field per table.
- Field logical keys are globally unique.
- Relation targets and option codes are validated.
- User/system ownership flags are mutually exclusive.
- Field Map is regenerated from Blueprint and compared byte-for-structure by validation.
- No real Base, table, field, view, URL, or credential value is present.

## State-machine evidence

- Machines: 11.
- Transitions: 87.
- Approval-bound transitions: G1 `PROJECT_PROFILE`, G2 `PAINPOINTS`, G3 `CONTENT_COPY`, G4 `FIRST_PAGE`, and G5 `FINAL_SET`.
- Invalidation rules: 8, all `preserveHistory: true`.
- Stable rejection coverage: arbitrary transition, terminal state, owner mismatch, missing approval, stale/deprecated approval, wrong gate, wrong target ID, version mismatch, missing context, and cross-state invariant failure.
- Content finalization and synchronization remain independent, so partial/failed sync does not become an image-generation failure.

## Migration evidence

- Registered real history: only 1.0.0 baseline.
- Migration path: 1.0.0 to 1.0.0 no-op.
- Dry run clones JSON input, writes nowhere, reports changes/warnings/conflicts, and is idempotent.
- Missing paths block with `MIGRATION_PATH_MISSING`.
- Enum addition is classified `POTENTIALLY_BREAKING`; destructive shape/meaning changes are `MAJOR`.

## Security and privacy

- `workspace-connection` rejects undeclared `access_token` and `app_secret` fields using fictional one-character sentinel values in negative fixtures.
- Validation errors do not include full instance values.
- Fixtures use only fictional IDs, names, paths, locations, and workspace placeholders.
- Plugin version remains 0.1.0 and its four-field manifest is unchanged.
- No `.app`, `.mcp.json`, hooks, real external integration, remote, or push was added.

## Git evidence

- Repository remains on `main` with no remote.
- Bootstrap and Phase commits were both skipped because existing local Git `user.name` and `user.email` were absent.
- No local or global Git identity was changed.

## Compatibility evidence

- Node 24.19.0: full repository checks pass locally.
- Node 20.20.2: package metadata was resolved, but the generic npm package failed because its preinstall required unavailable npm, the official archive download timed out, and the architecture-specific package tarball also timed out. The CI workflow has an explicit Node 20 contract job and Node 24 full-check job. Until Node 20 CI or a local binary run succeeds, overall status remains PARTIAL.

## Remaining work

1. Obtain a reachable Node 20 binary or run the configured CI job and record passing evidence.

## Phase 2A.1 runtime-policy addendum

Node 20 was subsequently removed from the supported Runtime target after its upstream EOL status was formally incorporated into ADR-0014. The historical probe result and compatibility status above remain accurate for their execution date but are no longer a release or Phase 2B blocker. Current status is defined by the Phase 2A.1 reports. 2. Create the two requested local commits only after the Operator configures a usable Git identity; do not change identity automatically. 3. Proceed to Phase 1B visual/final schemas only through a new accepted ExecPlan.
