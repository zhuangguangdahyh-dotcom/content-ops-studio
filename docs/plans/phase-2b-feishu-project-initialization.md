# Phase 2B — Production project initialization and Feishu Workspace Adapter

Status: SUCCESS for offline implementation; live evidence NOT_CONFIGURED. Owner: repository maintainers. Started and completed: 2026-08-24.

## Objective and non-goals

Deliver an offline-complete, recoverable Production Feishu Workspace Adapter for a China self-built tenant app and connect PROVISION, INSPECT, VERIFY, add-only REPAIR and explicitly approved MIGRATE semantics to project initialization. Preserve Phase 2A runtime, locks, append-only journals, checkpoints and local project-home boundaries.

This phase does not upload attachments, perform research, generate images, render, publish, start MCP, add Playwright, create platform apps, delete remote resources, change version/license, configure remotes, or claim live readiness without evidence.

## Current architecture and research result

The repository has provider-neutral contracts, a deterministic local runtime and a persistent mock. The 2026-08-24 official snapshot confirms Base/Table/Field/View/Record APIs, the new Base default table, numeric field types, field-name keyed record payloads, 1,000-record batch create/update limits, and name/type view creation. Rate limits and tenant document access require runtime evidence.

## Decisions

- Auth: `SELF_BUILT_TENANT_APP`; environment-backed secret references only.
- Transport: Node 24 native fetch, narrow allowlisted `FeishuTransport`, official SDK 1.73.0 evaluated but not installed. See ADR-0015.
- Permissions: minimum manifest with exact documented scope keys; deferred attachment permission does not block this phase.
- Field identity: logical key → stable field ID → current field name; record payloads use current names.
- Provisioning: plan, lock, create/adopt, immediately persist state, read-verify, create non-relations then relations, views, draft record, verify, G1 pause.
- Repair: add-only; extra remote objects preserved; type conflicts blocked.
- Live writes: environment opt-in plus CLI confirmation; live test also requires the test folder token.

## Design

Credential providers expose redacted presence diagnostics and non-stringifying secret values. The token provider uses expiry metadata, a refresh window, fake-clock support and a single-flight promise. Transport provides timeout, AbortSignal, bounded retry/429 handling, one auth refresh, allowlisted paths and redacted errors/log events.

The Adapter owns API payload validation and pagination but exposes provider-neutral records and structural snapshots. The Blueprint compiler deterministically maps all 141 fields; relation requests are a second phase after table IDs exist. Views are compiled as `NAME_ONLY` until advanced configuration has separate verified support. Record compilation checks mapping version and protected fields.

Provisioning state and real remote identifiers are written only beneath Operator-selected `CONTENT_OPS_HOME`; repository fixtures use fictional IDs or hashes. Idempotency combines local state, operation keys, `client_token` where supported and remote reconciliation. An uncommitted Base creation becomes an orphan candidate and blocks duplicate creation.

## Schema and migration

Eight independent additive schemas are introduced at contract version 1.0.0, with generated types, valid/invalid fixtures and catalog validation. This is a pre-release additive schema change; project schema migration remains dry-run by default and never deletes history. Major field changes require explicit approval and `CONFIG_UPDATE_REQUIRED`.

## CLI and live harness

Commands: `feishu doctor`, `feishu permissions`, `feishu workspace plan|provision|inspect|verify|repair`, and `project init`. Plan/inspect/verify are non-writing. Provision and repair enforce both write gates. `pnpm feishu:live-test` returns `NOT_CONFIGURED` without credentials/gates and is excluded from normal tests and CI.

## Risks

- Secret/privacy: strict redaction, no CLI secret flag, no token persistence, allowlisted origin.
- Rate limit: bounded backoff; unknown quotas are not invented.
- Concurrency: project lock, single-flight token refresh, checkpointed phases.
- Crash windows: immediate atomic state persistence and candidate reconciliation.
- Remote drift: no destructive correction; current field names are refreshed by ID.

## Files and dependencies

Changes span contracts, Workspace Adapter, runtime integration helpers, CLI, skills/router references, validation scripts, offline tests, CI documentation and reports. No production dependency is added; existing dev tooling generates the contracts.

## Test matrix

Credential isolation, token refresh, transport response/error/retry behavior, permissions, all field types, field identity, 4/141 Blueprint compilation, provisioning replay/crash/orphan/partial failures, add-only repair, records, write gates, security and explicit live harness status.

## Implementation steps and log

- [x] Preflight Node 24 and full existing check; 119 existing tests passed.
- [x] Freeze Phase 2A.1 working-tree baseline before source edits.
- [x] Research official API and official Node SDK; write human and machine snapshots.
- [x] Record auth/transport, reconciliation, field identity and live-gate ADRs.
- [x] Add schemas, generated types, fixtures and migration evidence.
- [x] Implement credentials, tokens, transport, Adapter and Blueprint compiler.
- [x] Implement provisioning, reconciliation, recovery and project-init routing.
- [x] Add CLI, validations, tests and live harness.
- [x] Update documentation and six reports.
- [x] Run the exact validation sequence and record exit codes.

## Final result and unresolved questions

All prescribed offline validation commands passed under the required Node 24 runtime with ambient `CI=true`: 54 schemas, 55 generated TypeScript files, 31 test files, and 158 tests. The explicit harness returned `NOT_CONFIGURED` with zero writes. Workspace Adapter readiness is therefore UNVERIFIED, and full Plugin production integration remains BLOCKED by the explicitly deferred adapters and services.
