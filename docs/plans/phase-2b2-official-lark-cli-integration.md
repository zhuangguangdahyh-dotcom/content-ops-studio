# Phase 2B.2 — Official Lark CLI Integration and Default Feishu Path

Status: COMPLETE. Owner: repository maintainers. Started: 2026-08-24. Completed: 2026-08-24.

## Goal

Make the official `@larksuite/cli` the default Workspace execution boundary for ordinary individual and team Operators. Content Ops Studio retains ownership of the Blueprint, state machine, plans, locks, idempotency, Journal, Write Log, Checkpoints and read-after-write verification; the official CLI owns user OAuth, credential storage and Feishu OpenAPI invocation.

## Non-goals

This phase does not remove the Direct Feishu Adapter, weaken its gates, add attachment upload, Research, image generation, a production Renderer, Playwright, MCP, publishing, automatic resource deletion, Plugin publishing, a version change, a Git remote or a push. It never copies or modifies official Lark CLI or Skill source.

## Current state

Phase 2B is offline-complete for the advanced self-built tenant-app path. Phase 2B.1 Direct live evidence remains unverified and no Base was created by that run. The old App Secret session was stopped and is not continued. Node is `v24.19.0`; Git is unborn `main` with no identity or remote. The Phase 2B.2 baseline is `BASELINE-PHASE-2B2-WORKING-TREE-20260824`, 756 files, aggregate `c242c80a866626a34ff7685cca9f0848acaedcb35095fcbe669f324be45a9e9a`.

## Official CLI research

Only official sources are used: Feishu Open Platform, `larksuite/cli`, `@larksuite/cli` on npm and the embedded `lark-shared`/`lark-base` content of the detected official binary. On 2026-08-24 npm reports stable `1.0.89`. The existing official binary is `1.0.63`, outside PATH but executable at an Operator-owned location; it is not upgraded or overwritten. It already supports success/error JSON envelopes, separate stdout/stderr, process exit status, `--dry-run`, `schema`, Base shortcuts, raw API, `--as user|bot`, system-keychain redaction and default risk controls.

Observed contract corrections:

- `auth status` uses `--json`; `--format json` is invalid on 1.0.63.
- Success is exit 0 plus `ok=true`; errors are non-zero plus `ok=false`. OpenAPI `code==0` is not the CLI success contract.
- AI authorization supports split flow through `auth login --no-wait --json`, followed in a later turn by `--device-code`.
- `config init --new` is an interactive/browser setup flow and is never run when an existing compatible configuration is present.
- Base batch writes are limited to 200 records by the official Base Skill for this CLI generation.
- Risk control stays at its official default; `config risk-control off` is forbidden.

## CLI version and installation strategy

`plugins/content-ops-studio/config/lark-cli-support.json` records the official package, exact tested version, narrow supported range, current stable observation, fixed installation command, binary name, required embedded Skills, domains, commands, JSON contract and capability probes. Existing supported binaries are reused. Missing installation returns a plan and requires explicit Operator confirmation before the fixed official npm command. Older or newer untested versions are never silently replaced or claimed.

## Authentication and identity

Default identity is explicitly `--as user`. Setup checks config, login and required Base scopes. Missing config starts `config init --new`; missing login starts split-flow OAuth and returns `AWAITING_USER_AUTHORIZATION`, the opaque URL and next action. The Runtime never reads keychain content, copies auth files, persists tokens or logs authentication caches. `--as bot` is allowed only after an explicit `bot`/`enterprise-direct`/`tenant-app` selection; no permission failure causes a silent identity switch.

## Permission verification

The required set is derived from actual Base commands and checked with `auth check --scope`. `--recommend` may assist login but is not evidence of exact scope coverage. Base app/table/field/view/record read/write scopes are requested; attachment remains deferred. Administrator approval returns `AWAITING_ADMIN_APPROVAL`.

## LarkCliRunner and security

The Runner uses `spawn(binary, argv, {shell:false})`, an argv array, timeout and `AbortSignal`. It validates commands against a closed allowlist, rejects delete/risk-control-off/arbitrary raw API operations, separates stdout/stderr, accepts only strict JSON envelopes and redacts identifiers that look like credentials. Raw API fallback is disabled by default and can only use explicit non-delete method/path entries proven by the capability probe. Operator content is data arguments, never a command name.

## Schema introspection and command mapping

Capability probes inspect version/help/schema without writes. Typed Base shortcuts map create/get/list/create/update/search/batch operations. The Blueprint remains four tables, 141 fields, five relations and four `NAME_ONLY` views. Attachment remains `DEFERRED_TO_FUTURE_PHASE`. When a shortcut is absent, the adapter blocks unless the exact non-destructive raw fallback is configured and tested.

## LarkCliWorkspaceAdapter

`packages/workspace-adapters/src/lark-cli/` contains the Runner, version/auth/capability model and adapter. The adapter presents the existing Feishu provisioning surface while translating official shortcut JSON into provider-neutral values. It performs structural reads and read-after-write verification. It never imports official CLI source or SDK types.

## Existing Adapters and selection

- `LarkCliWorkspaceAdapter`: default for ordinary Operators via `AUTO`/`LARK_CLI`.
- `DirectFeishuWorkspaceAdapter`: retained as advanced enterprise mode, disabled unless explicitly selected and configured.
- `MockWorkspaceAdapter`: tests and explicit `MOCK` only; never a Production fallback.

The selection values are `AUTO`, `LARK_CLI`, `DIRECT_FEISHU` and `MOCK`. `AUTO` selects an installed, supported, authenticated Lark CLI. Installed-but-unauthenticated returns `AWAITING_USER_AUTHORIZATION`; missing returns `LARK_CLI_NOT_INSTALLED`. It never implicitly chooses Direct or Mock.

## Project initialization and Runtime integration

Project initialization continues through the current Run Plan, project lock, Journal, Write Log, Checkpoints and G1. Only the Workspace side-effect driver changes. Production plans remain dry by default and require explicit confirmation before any official CLI write. Complete remote identifiers remain below `CONTENT_OPS_HOME`; repository evidence stores hashes/counts only.

## Agent Skills

The detected official binary embeds `lark-shared` 1.0.0 and `lark-base` 1.2.2. They are documentation aids for Agent command choice and authorization. Runtime depends only on the executable and strict JSON contracts. No Skill source is copied, patched or made a hidden Runtime dependency.

## Safety, privacy and prompt injection

The command allowlist is immutable at Runtime. Prompt or remote text cannot add a command. Shell parsing, arbitrary executable paths from record data, delete commands, `--yes`, risk-control disablement and unapproved raw paths are rejected. Output is redacted before persistence. No Token, App Secret, keychain value, auth cache, real remote URL or identifier enters Git/reports.

## Version drift and failure recovery

Unsupported versions fail with `LARK_CLI_VERSION_TOO_OLD` or `UNCLAIMED_LARK_CLI_VERSION`. JSON/command drift fails closed and records the redacted diagnostic. A write with an unknown result follows the existing orphan/remote reconciliation rule; a deterministic CLI rejection remains safely retryable after correction. No failure triggers deletion or Mock fallback.

## Schema and migration

Add six independent 1.0 contracts: integration config, runtime evidence, command, result, capability report and auth diagnostic. Add catalog entries, generated TypeScript, valid/invalid fixtures and an additive pre-release migration note/test. Existing Feishu schemas remain intact.

## Files involved

- `packages/workspace-adapters/src/lark-cli/` and exports.
- `packages/cli/src/runtime-cli.ts` and CLI tests.
- Runtime selection helpers and tests.
- Six Plugin schemas, catalog, generated types and fixtures.
- `plugins/content-ops-studio/config/lark-cli-support.json`.
- ADR-0019, docs 01/04/05/06/10/12/13/14/15 and new docs 16/17/18.
- README, CHANGELOG, SECURITY, PRIVACY and Phase 2B.2 reports.

## Test matrix and commands

Tests cover installation/version decisions, success/error/non-JSON envelopes, timeout/abort, exit codes, stdout/stderr separation, argv and shell injection, redaction, auth states/scopes/admin wait/cancel, capability drift, allowlisted raw fallback, Base planning and translation, AUTO/DIRECT/MOCK selection, no Production Mock fallback and security restrictions. Final validation is `CI=true pnpm check`, `CI=true pnpm scan:secrets` and final Git inspection.

## Implementation record

- 2026-08-24: Read the mandatory repository rules, Phase 2B/2B.1 docs, ADRs, reports, capability files, Blueprint and relevant Workspace/Runtime/CLI source.
- 2026-08-24: Stopped the old Phase 2B.1 App Secret route; no old-path write was active and its last recorded exit remained failed with zero created Bases.
- 2026-08-24: Preflight confirmed Node `v24.19.0`, pnpm `11.19.0`, unborn `main`, no Git identity/remote, no PATH `lark-cli`, and one reusable official `1.0.63` binary at an Operator-owned path.
- 2026-08-24: Read-only official CLI inspection found an existing Feishu config, user identity selected, OAuth status `needs_refresh`, keychain-backed secret redaction and embedded `lark-shared`/`lark-base`. No Token or keychain content was read.
- 2026-08-24: Official npm reported stable `1.0.89`; no install or upgrade was performed. The existing 1.0.63 binary is the only exact version presently tested for repository integration.
- 2026-08-24: Created the Phase 2B.2 working-tree baseline before implementation edits.
- 2026-08-24: Added ADR-0019, exact 1.0.63 version policy, fixed official npm installation plan, Runner, closed non-delete allowlist, capability probe, Adapter, AUTO selection and CLI setup/status/login/logout/scopes/doctor/install/upgrade-plan commands.
- 2026-08-24: Added six independent strict 1.0 Schemas, 18 valid/invalid fixtures, generated TypeScript and additive migration coverage. The catalog now contains 60 implemented contracts and generated output contains 61 TypeScript files including index.
- 2026-08-24: Compiled the unchanged Blueprint through the official field JSON grammar: four tables, 141 fields, five links and four name-only views. Official CLI batch policy is capped at 200 records.
- 2026-08-24: Actual token-free status found supported 1.0.63, existing config, explicit user identity and OAuth `needs_refresh`. The official login flow was started; no Token/keychain content was read or persisted and no remote write occurred.
- 2026-08-24: Final `CI=true pnpm check` passed with 36 test files and 176 tests. Strict Ajv, generated-contract freshness, Secret Scan and example sanitization passed.
- 2026-08-24: Final working-tree comparison was generated from the Phase 2B.2 baseline; exact counts and aggregate are stored in the excluded working-tree change report so the evidence does not hash itself.
- 2026-08-24: Operator completed official browser OAuth. `feishu status`, `feishu cli doctor` and exact Scope checks then returned authenticated/ready with all 13 required Base scopes and the attachment scope still deferred.
- 2026-08-24: A controlled fictional sandbox dry plan compiled 4 tables, 141 fields, 5 relations, 4 `NAME_ONLY` views, no unsupported fields and one project draft record.
- 2026-08-24: Live provisioning created one Base and completed through G1 without creating or deleting a second Base. The stored state reached phase 13 `SUCCESS` with a verified Base reference, project lock history, Journal, Write Log and Checkpoint.
- 2026-08-24: Live behavior exposed official 1.0.63 response differences: Base create can omit the default table ID; table metadata carries the primary field; record search requires keyword/search fields and returns columnar rows; view create can omit the created ID and is eventually consistent; single-select reads can be singleton arrays. The Adapter was corrected narrowly and regression tests were added before resuming the same recoverable Run.
- 2026-08-24: Remote verification passed for all 4 tables, all 141 Blueprint fields, all 5 Blueprint relations and all 4 named views. Five platform-owned extras were preserved: three Base defaults and two automatically generated reverse-link fields. Remote totals are therefore 146 fields, 7 visible relation fields and 8 total views while Blueprint counts remain 141/5/4.
- 2026-08-24: Formal G1 approval was routed through Runtime. Remote readback returned project status `已启用` and confirmation status `已确认`. The same project/run/input fingerprint was replayed and returned `SUCCESS` without duplicate resources.
- 2026-08-24: Add-only Repair dry-run returned `MATCH`, zero missing items, zero conflicts and zero write operations. Automatic deletion was never invoked; manual cleanup of the single sandbox Base remains required.
- 2026-08-24: Final validation passed with 36 test files and 184 tests. All 60 strict Schemas, type checks, generated declarations, Secret Scan and example sanitization passed.

## Final result

Implementation and controlled official-CLI live validation are complete. Phase status is `SUCCESS`; official Lark CLI live status is `PASSED`; the Lark CLI Adapter is `READY`. Direct Feishu remains `UNVERIFIED`, and overall Plugin Production Integration Readiness remains `BLOCKED` because Research, image generation, Production Renderer, attachments, MCP and publishing are outside this phase.

## Unresolved issues

- Current stable 1.0.89 is documented but untested locally; it is not silently claimed or installed.
- The single sandbox Base is intentionally retained for manual inspection and cleanup; complete remote identifiers remain only under the external `CONTENT_OPS_HOME`.
- The add-only Repair live command was exercised against a complete workspace and correctly produced a no-op. No destructive fault was manufactured.
