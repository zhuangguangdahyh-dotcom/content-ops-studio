# Phase 1B Visual Production and Finalization Contracts ExecPlan

Status: implementation complete; repository compatibility partial  
Owner: repository maintainers  
Started: 2026-08-23  
Plugin version: 0.1.0 (frozen)  
Contract version: 1.0.0  
Schema version: 1.0.0

## Goal

Implement machine-verifiable contracts for visual planning, first-page approval and Style Lock, background-generation history, deterministic layout reporting, four-layer QA, G5 finalization, safe versioned assets, and provider-neutral Adapter boundaries without adding a production external integration.

## Non-goals

- No real image provider, Feishu, research, publishing, attachment upload, MCP, hook, `.app.json`, `.mcp.json`, browser, Playwright, Chromium, or production renderer.
- No external credential reading, network request, remote repository, push, release, publish, license decision, publisher metadata, or Plugin version change.
- No automatic modification of core Skills, platform packs, or industry packs.
- No runtime project data under the Plugin installation directory or a real `CONTENT_OPS_HOME`.

## Phase 1A dependencies and current state

Phase 1A supplies 27 strict Draft 2020-12 schemas, generated declarations, strict Ajv validation, G1-G5 approval contracts, eleven data-driven state machines, eight history-preserving invalidation rules, migration checks, and a four-table Workspace Blueprint. The untouched baseline passed `CI=true pnpm check` on Node 24.19.0 with 61 tests. Local Node 20 remains unavailable and is a carried compatibility blocker.

The seven catalog entries `visual-system`, `page-visual-plan`, `style-lock`, `generation-manifest`, `render-report`, `qa-report`, and `final-manifest` are planned and will become implemented.

## Schema and common-definition changes

- Extend canonical common definitions with Asset Reference, Canvas, Safe Area, Bounding Box, Typography Token, Color Token, Text Layer, Image Treatment, Check Result, and Version Binding.
- Add seven closed Draft 2020-12 schemas with controlled `extensions` only.
- Keep canonical Schema validation on original documents; generated TypeScript continues through the isolated dereferenced compiler view.
- Catalog every new Schema with source, generated type, fixture directory, ownership, and version metadata.
- Treat the additions as independent 1.0 contracts under the existing truthful 1.0.0 baseline; update migration documentation and tests without fabricating a historical data migration.

## Visual System and Page Visual Plan

The Visual System binds content/copy/visual versions, visual mode, canvas, safe area, tokens, global image/layout/brand/page-number rules, pack snapshots, and a complete consecutive page plan. Page Visual Plans bind an executable per-page copy snapshot, optional mode-specific photographic direction, regions, text layers, image treatment, density, safe overflow strategies, constraints, variations, fallback, and approval dependency.

## Style Lock and approval boundary

Style Lock creation requires an active Router-created `APPROVE` event at G4 `FIRST_PAGE`, matching target type, target ID, content ID, content/copy/visual-plan versions, and first-page artifact. Remaining-page generation requires the current Style Lock. Stale, deprecated, wrong-gate, wrong-target, or wrong-version approval is rejected with stable reason codes.

## Generation Manifest

Generation manifests preserve every consecutive attempt and bind project, content, page, versions, inputs, references, prompt snapshot, requested output, results, status, warnings, and failures. First-page generation may omit Style Lock; remaining pages may not. Provider metadata never contains credentials, authorization headers, signed URLs, or fabricated success.

## Renderer and Render Report

Renderer contracts validate layout and report deterministic page output. Overflow, clipping, missing required assets, wrong canvas, unsafe regions, absent output/checksum, unsafe path, or wrong page number blocks a successful report. Font substitutions record requested/actual font, reason, impact, and blocking status.

## Four-layer QA and final manifest

QA has explicit CONTENT, VISUAL, FILE, and DATA check arrays plus deterministic statistics. Any failed BLOCKING check prevents final approval readiness. Final Manifest requires current passed QA, active version-matched G5 `FINAL_SET` approval, complete consecutive page assets, SHA-256 checksums, and safe project-relative paths. Business, image, and synchronization status remain independent. Historical manifests and assets are never overwritten or deleted.

## Adapter boundaries

- `packages/image-adapters`: `ImageGenerationAdapter` with capability probe, request validation, generate/regenerate, result inspection, and cancellation; only mock and prompt-only implementations.
- `packages/renderer`: `RendererAdapter` with capability probe, layout validation, page/set rendering, and inspection; only a mock implementation marked `MOCK_ONLY`.
- `packages/core/src/assets`: `AssetStore`, `AssetWriter`, `AssetReader`, and `AssetHasher`; in-memory and temporary-filesystem implementations only.

## Asset references, paths, checksums, and manifests

Core pure functions validate safe project-relative paths, SHA-256 values, normalized references, expected/versioned file names, page completeness, manifest references, and actual checksum content. Temporary filesystem writes reject existing targets and remain rooted in a caller-supplied temporary directory.

## Visual-pipeline pure functions

Implement deterministic structured-result validators for visual systems, page sequence, token references, version bindings, Style Lock eligibility, remaining-page eligibility, generation manifests, render reports, QA readiness, finalization eligibility, and visual invalidations. These functions perform no image generation, Adapter call, network request, Feishu operation, or production render.

## Version, approval, invalidation, and history rules

Every artifact binds current project/content/page and content/copy/visual/style/asset versions as applicable. Page-copy or page-count changes invalidate downstream visual artifacts and approvals; global visual change preserves history while invalidating Style Lock and downstream work; page background regeneration or layout adjustment invalidates only its dependent reports/QA/final manifest; file replacement invalidates checksum/File QA/final manifest. All invalidation rules retain `preserveHistory: true`.

## Type generation and deep-reference risk

Add generated declarations for all seven schemas and keep the required generated header. Tests cover three-level cross-file references, arrays, `oneOf`, `anyOf`, repeated common definitions, deeply nested asset/check/version definitions, deterministic output, canonical-source non-mutation, and explicit cycle rejection. Ajv always validates canonical Draft 2020-12 schemas.

## Dependencies

No new production dependency is planned. Node built-ins provide temporary file I/O and SHA-256. Existing Ajv, `ajv-formats`, and development-only `json-schema-to-typescript` remain sufficient.

## Files involved

- Canonical schemas and catalog under `plugins/content-ops-studio/schemas/1.0/`.
- Invalidation configuration and shared Plugin references.
- Generated contracts under `packages/contracts/src/generated/1.0/`.
- Adapter interfaces/mocks in `packages/image-adapters` and `packages/renderer`.
- Asset and visual-pipeline logic in `packages/core/src/`.
- Fixture generation and fixtures under `scripts/` and `tests/fixtures/contracts/1.0/`.
- Unit, contract, visual, integration, finalization, and failure-injection tests under `tests/`.
- Root scripts/CI, documentation, reports, and report index.

## Security and privacy risks

Schemas and validators reject absolute paths, path traversal, undeclared token/secret fields, credential-bearing provider data, and unsafe URLs. Errors contain stable codes and summaries without echoing full prompt content. All fixtures are fictional and sanitized. Temporary storage never writes to a real customer project.

## Test plan

- Strict Schema compilation, unique IDs, resolvable references, required/enum/additional-property/path/checksum/secret fixtures.
- Visual page sequence, role, token, copy snapshot, mode compatibility, density, and overflow invariants.
- G4 Style Lock and G5 finalization approval binding, stale/deprecated approval rejection, and version drift.
- Generation attempt history, Style Lock boundary, render blockers, four-layer QA statistics/readiness, status independence, and history preservation.
- Adapter and Asset Store capability/mocking, non-overwrite behavior, safe paths, naming, and checksum validation.
- Deep-reference and cycle failure injection, missing references/pages/assets, old reports/QA/approvals, and damaged outputs.
- All Phase 1A checks and required final command sequence.

## Failure recovery

- Fix canonical Schema or resolver defects; never hand-edit generated output.
- Return stable structured failures from pure validators; never turn a failure into fabricated success.
- Leave earlier attempts, approvals, reports, manifests, and assets intact.
- If Node 20 remains unavailable, report repository compatibility as PARTIAL and Phase 1B implementation independently from that blocker.
- Do not change Git identity. Skip commits when identity is unavailable.

## Implementation steps

1. Complete preflight and baseline validation; correct Phase 1A wording and create report index.
2. Extend common definitions and implement the seven schemas/catalog entries.
3. Generate types and prove strict canonical/deep-reference validation.
4. Implement Adapter contracts/mocks, Asset Store, asset utilities, and visual-pipeline validators.
5. Extend history-preserving invalidation rules and shared documentation.
6. Generate fixtures and add contract, unit, integration, visual, security, and failure-injection tests.
7. Add required commands to root check and CI; update docs and four Phase 1B reports.
8. Run the exact final verification sequence, record exit codes, and create a commit only if existing Git identity permits it.

## Implementation log

- 2026-08-23: Read the complete Phase 1B instruction, mandatory repository/Plugin instructions, accepted ADR counterparts, docs 00-12, Phase 1A plan/reports, state/approval references, and relevant package/configuration sources.
- 2026-08-23: Confirmed the instruction's ADR-0007 and ADR-0008 names map to the accepted repository files `ADR-0007-json-schema-type-generation.md` and `ADR-0008-deterministic-state-machines.md`; no duplicate ADR was added.
- 2026-08-23: Untouched baseline `CI=true pnpm check` passed on Node 24.19.0 with 61 tests.
- 2026-08-23: Node 20 executable is unavailable; per Phase 1B rules no additional binary download was attempted.
- 2026-08-23: Baseline commit skipped because Git user name/email remain unconfigured; no Git identity was changed.
- 2026-08-23: Implemented all seven planned Draft 2020-12 contracts, generated their TypeScript declarations, and changed the schema catalog to 34 implemented and zero planned entries.
- 2026-08-23: Implemented deterministic visual-pipeline validators, versioned asset-store contracts and utilities, provider-neutral image/renderer boundaries, and network-free mock/prompt-only adapters.
- 2026-08-23: Added 8 valid and 85 invalid Phase 1B fixtures, deep-reference and cycle tests, history-preserving invalidation coverage, and finalization failure injection; the full suite now contains 16 files and 88 tests.
- 2026-08-23: Added all Phase 1B validation commands to the root check and Node 20/24 CI contract job; updated Plugin/shared references, package documentation, repository documentation, CHANGELOG, and four indexed Phase 1B reports.
- 2026-08-23: A first non-CI frozen install attempt exited 1 because pnpm refused an interactive modules-directory recreation without a TTY. The approved `CI=true pnpm install --no-frozen-lockfile` recovery reused the local pnpm store, downloaded zero packages, restored `node_modules`, and refreshed the lockfile only for the new workspace-local contracts dependency; no external dependency was added.
- 2026-08-23: The first ordered verification stopped at `format:check` because two newly written reports required Prettier formatting. After formatting them, the complete ordered verification was rerun from the frozen install step.
- 2026-08-23: Final Node 24.19.0 verification passed: 34 strict schemas, 35 generated TypeScript files including index, 11 state machines, four Blueprint tables, migration checks, all Phase 1B focused suites, 16 test files/88 tests, Plugin validation, bootstrap verification, secret scan, example sanitization, and root `pnpm check`.
- 2026-08-23: Because sandbox and authorized PTY execution exposed different pnpm store visibility, two non-PTY frozen installs failed with the documented no-TTY purge guard and two incomplete cross-boundary attempts were interrupted during registry retries. Dependencies were restored from the local store with zero downloads, then the entire final command sequence ran continuously in one authorized PTY and exited 0 through the aggregate check. The report preserves every recovery exit rather than presenting an interrupted attempt as final evidence.
- 2026-08-23: Final Git inspection still shows `main` with no commits, no remote, and all repository files untracked. Phase 1B and baseline commits remain skipped because Git identity is unavailable; no identity, remote, or system-level Node configuration was changed.

## Final result

Phase 1B implementation is **SUCCESS**. Repository-wide compatibility remains **PARTIAL** solely because no real local or CI Node 20 execution evidence exists. All in-scope deterministic contracts, fixtures, tests, documentation, and Node 24.19.0 validation are complete; production integrations remain explicitly out of scope.

## Unresolved questions

- Local Node 20 evidence remains a carried compatibility blocker that must close before a production Feishu Adapter phase.
- Local commits remain blocked until the Operator configures Git identity outside this task.
