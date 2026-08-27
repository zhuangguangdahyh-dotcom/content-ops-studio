# Testing and evals

Phase 2C adds MCP catalog/schema/annotation/safety tests, official SDK Client STDIO E2E, deterministic bundle comparison, `.mcp.json` validation, installed-cache Plugin tests, isolated Codex CLI Host inspection and an explicit non-CI retained-sandbox harness. Offline MCP tests never connect to Feishu. The live harness requires an external Home and proves Verify `MATCH`, Repair `PASSED_NO_OP` and an unchanged idempotent initialization replay.

Offline Feishu suites cover credentials/tokens, Transport, permissions, Blueprint, field identity, Adapter records, provisioning replay, partial failure, orphan handling, non-destructive repair and live gates. Ordinary CI has no Feishu secrets and never runs the live harness. `pnpm feishu:live-test` returns `NOT_CONFIGURED` unless every gate is explicit.

Unit tests cover IDs, unique keys, Unicode code-point title length, safe filenames, deterministic fingerprints, eleven state machines, cross-state invariants, nine invalidation rules, migrations, safe asset paths, checksums, naming, non-overwrite storage, and visual-pipeline invariants. Contract tests strictly compile 34 Draft 2020-12 schemas, validate complete and invalid fixtures, verify 34 generated declarations, and enforce the four-table Workspace Blueprint.

Phase 1B tests cover deep/array/`oneOf`/`anyOf`/repeated `$ref`, cycle detection, canonical-source non-mutation, page sequence and tokens, copy snapshots, text density, G4/Style Lock, attempt history, render blockers, four-layer QA statistics, G5/finalization, version drift, missing assets/references, unsafe paths, checksums, sync-status independence, and history retention. Adapter integration tests assert no network, browser, output image, or fabricated provider success.

V0.1.0 declares and locally validates only Node 24 LTS with `>=24 <25`. Checked-in CI configuration targets Node 24 explicitly on Ubuntu and macOS; because no remote workflow has run, cross-platform CI evidence remains `UNVERIFIED`. Standard `date`, `date-time`, and URI-family formats come from `ajv-formats`; tests never disable Ajv strict mode.

Phase 2A adds Runtime Config, Project Home, registry, Pack, capability, workflow, plan, lock, idempotency, atomic storage, Journal corruption, checkpoint reconstruction, approval resume, Mock Workspace partial failure, CLI, and two temporary-Home E2E suites. Phase 2A.1 adds policy, version consistency, generic evidence, unsupported/unclaimed Runtime, and text/JSON Doctor tests. `pnpm runtime-evidence:collect` validates only the current Node 24 Runtime and does not install or download another version.

Model evals and pixel-level visual comparison are not run in bootstrap. Future evals cover direct trigger, indirect trigger, missing information, non-trigger, high-risk boundary cases, and actual rendered-image properties after a production Renderer is separately approved.

Phase 3A tests strict research fixtures, Profile readiness, source safety/deduplication, A–D Evidence rules, fixed scoring, honest short counts, Adapter recovery, bundled Schema roots, Feishu field compilation, cross-retry idempotency, G2 partial/version decisions, 23 MCP tools, annotations, installed-copy execution and retained-sandbox reads/writes. Public-source and Feishu evidence remain separate from offline tests.

Phase 3B tests seven strict contracts, 4–8-page structure, Unicode title limits, Claim blocking, exact fingerprinting, assessed semantic duplication, fixed 100-point quality weights, Feishu field compilation, relation/select read normalization, Content/Painpoint idempotency, G3 decisions, completed-run resume/replay, fixed-angle planning, revision planning and 31 MCP tools. The current suite has 46 test files and 225 passing tests; the retained Live run is reported separately from offline evidence.

Phase 4A adds eight strict contract/fixture/type checks, additive migration evidence, exact copy/page drift, five-mode decisions, token/layout/overflow, fixed 100-point Visual quality, handoff boundary, Runtime replay/conflict, 39-tool annotations, Skill policy and retained-sandbox protected-field verification. Live evidence is separate from Mock/offline tests.

# Phase 4B validation

Renderer tests cover safe compilation, text-free graphics, real Chromium PNG dimensions/checksum, network isolation, DOM layout, exact font evidence and whole-set deferral. Runtime tests cover stale G4 binding, Style Lock creation and replay. Installed-copy validation renders outside Plugin Root without root `node_modules`; Live Feishu validation remains an explicit non-CI command.

Phase 4B-R tests strict contracts/migrations, six-channel precedence, no Mock fallback, Host local-file materialization, Pack/overlay inventory, Profile persistence, candidate material difference, 100-point hard-blocking quality, group duplicates, feedback/rule boundaries, 61-tool MCP bundle and a non-Feishu C-0001 direction Live harness.

Phase 4C-R.2 tests current-version G4 and SLV allocation, five distinct remaining-page composition families, Renderer-owned approved copy, Songti descent breathing room, deterministic 1242×1660/310×414/186×248 output, actual-raster text/background contrast, two-page high-consistency-risk trial, the retained historical same-master calibration strategy, three deterministic Contact Sheets, Group Editorial/Color Rhythm, non-compensable Group QA, immutable replay and pending-G5 boundaries.

Post-Phase 4C Image Set Continuity tests close that historical gap. A formal full set now requires a single visual motif and visual-system key, explicit Cover/Value/Summary page duties, unique semantic responsibilities, at least three composition families, per-page continuity anchors, and unique source checksums/shot signatures wherever `DISTINCT_BACKGROUND_REQUIRED` applies. Tests prove that different crops or layouts cannot disguise one repeated master, style drift fails even with unique backgrounds, and all passes remain pending Operator G5 judgment.

Stage 10 adds strict Finalization contract fixtures, checksum-bound approval tests, real PNG re-read verification, candidate/failed/path/secret exclusion, immutable Manifest conflict checks, Manifest/Delivery/Archive partial-failure recovery, 100% idempotent replay, Production/Calibration isolation, stale-currentness detection, four-tool MCP coverage and `PLUGIN_V1_E2E_SMOKE`. These tests make zero ImageGen, Renderer, Feishu and attachment calls.
