# Phase 4B-R.2 cover conversion and semantic relevance

## Objective

Harden Xiaohongshu cover conversion, true thumbnail readability, click clarity and visual semantic relevance without rebuilding the image-production system. Preserve all historic assets and versions. Record C-0001 FPV-2 as a current-set negative reference through an explicit G4 REVISE, then stop that Content at copy revision. Separately create three fictional commercial-space calibration candidates and stop for Operator selection.

## Non-goals and boundaries

Do not regenerate C-0001, create FPV-3, approve G4, create a Style Lock, produce pages 2–6, write Feishu, publish, modify Project/Industry preferences from C-0001 production feedback, or enter Phase 4C. Calibration artifacts are local previews, not formal FPVs or delivery assets. Global rules are created only because this instruction explicitly confirms them at `GLOBAL_USER_PREFERENCE` scope.

## Starting state

C-0001 binds `CV-1:CV-1:VV-2:FPV-2`, selection `VDS-C-0001-A`, asset `AST-C0001-FPV2` and SHA-256 `b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5`. G4 is `AWAITING_USER_APPROVAL`; Style Lock and pages 2–6 do not exist. Phase 4B-R.1 passed with 107 strict Schemas, 61 tools, 59 test files and 278/278 tests.

## Baseline

`BASELINE-PHASE-4B-R2-20260826` records 1340 repository files and aggregate `88e80aa275e7da4efd52c8c003792cf345c295d79543fcc110912660a5c3dfd3`. Baseline manifests exclude runtime/cache/secrets and contain no file bodies or absolute Project Home paths.

## Contract and migration approach

Add seven strict contracts for conversion planning, cover copy, click clarity, thumbnail QA, semantic relevance, concept candidates and revision planning. Extend First Page Review with optional `revision_routes`; extend Project Visual Profile and Dynamic Strategy additively. Generate types/fixtures, retain all legacy required fields, add migration tests and keep Ajv strict.

## C-0001 revision route

Create a checksum-bound `REVISE` review with primary `CONTENT_COPY` and routes `CONTENT_COPY + GLOBAL_VISUAL_DIRECTION`. Use Router/Runtime semantics, persist Review/Approval/negative-reference evidence append-only, update Runtime to `REVISION_REQUIRED`, read-verify, and preserve the PNG, generation manifest, render report, QA and checksum unchanged. Next route is `COVER_COPY_REVISION_REQUIRED`.

## Global learning

Persist one explicit Operator Feedback Event, five confirmed versioned Global Visual Rules and a new immutable Global User Visual Preference version. Do not create an unconfirmed Candidate. Rules prohibit only semantically unrelated decoration; they do not universally ban abstract visuals, posters, still life or generated imagery. Project and Industry Packs remain unchanged.

## Cover conversion and policy

Separate publish title, primary hook, optional secondary line, supporting copy, Page 1 content copy, publish body and DM hook. Account Goal and Cover Objective remain independent. Xiaohongshu lead-generation defaults use short single-reason hooks, true thumbnail targets and explicit Audience/Painpoint/Value signals while allowing other account goals to use different policies.

## QA and routing

Generate real 310×414 and 186×248 thumbnails. Evaluate legibility, text density/prominence, one-second comprehension, audience/Painpoint/value signal, promise alignment and background competition. Evaluate background semantic role and relevance; `DECORATIVE_ONLY` is blocked for lead generation and weak abstract metaphors require review. Dynamic Strategy consumes and emits cover-specific constraints rather than selecting from a fixed visual type.

## Skills and MCP

Update Content Creation to produce and reapprove a Cover Copy Package at G3, Visual Planning to consume only approved cover copy, Image Production to enforce thumbnail/click/semantic QA, and Router to route combined revision reasons. Prefer existing MCP tools; add only narrow tools when the current registry cannot express the operation.

## Commercial-space calibration

Use fictional `CAL-COMMERCIAL-SPACE-001` under a repository-external local Home, with `COMMERCIAL_SPACE_HOSPITALITY + SPACE_IDENTITY`, Xiaohongshu and `LEAD_GENERATION`. Dynamically plan three materially different hooks, strategies, compositions, views, text-image ratios and semantic roles. Generate text-free Host-native backgrounds, materialize them, render formal Chinese locally, produce both thumbnails and three contact sheets, run all QA, and stop at `CALIBRATION_COVER_SELECTION / AWAITING_USER_SELECTION` with zero Feishu writes, FPVs, G4s and Style Locks.

## Failure handling

Any C-0001 checksum/version mismatch returns `ARTIFACT_CONFLICT` without repair-by-overwrite. Any invalid schema, policy, unsupported claim, weak semantic relation, unreadable thumbnail, Renderer failure or generated-asset defect blocks the affected stage. Retain attempts and use only targeted, non-destructive retries. Never downgrade validation or fabricate scores/evidence.

## Files involved

Core cover/image-production logic; First Page and visual-learning Runtime; strict Schemas, generated types and fixtures; Xiaohongshu Platform Pack; MCP registry/handlers; three Plugin Skills and focused references; focused tests and calibration harness; architecture/ADR/docs/reports; external fictional Project Home only for live-local artifacts.

## Validation commands

Run all requested cover commands, MCP build/bundle/test/e2e/host/package checks, the explicit local calibration harness, complete `CI=true pnpm check`, Secret Scan, Skill validation and final baseline-relative aggregation. Renderer validation uses the existing repository-external controlled Playwright cache.

## Implementation record

- 2026-08-26: Read the full R.2 instruction, repository/Plugin rules, Skill Creator and ImageGen instructions, relevant Skills, policies, state-machine documents and accepted ADRs.
- 2026-08-26: Audited the existing Review/Runtime and confirmed only one revision classification is currently supported; cover conversion, dual thumbnail QA and semantic relevance contracts are absent.
- 2026-08-26: Initial sandboxed preflight located the browser cache but could not launch Chromium; the identical full check passed outside the sandbox against the existing controlled cache.
- 2026-08-26: Pre-implementation `CI=true pnpm check` passed: 107 strict Schemas, 61 tools, 59 test files, 278/278 tests, Renderer READY and Secret Scan clean.
- 2026-08-26: Created the immutable R.2 baseline: 1340 files, aggregate `88e80aa275e7da4efd52c8c003792cf345c295d79543fcc110912660a5c3dfd3`.
- 2026-08-26: Added eight strict Cover/Global contracts, 116 generated TypeScript files for 115 source Schemas, fixtures and additive migration coverage. Added Cover Conversion core policy, two-size thumbnail, Click Clarity and Semantic Relevance evaluators.
- 2026-08-26: Executed C-0001 G4 `REVISE` through the Runtime with primary `CONTENT_COPY` plus `GLOBAL_VISUAL_DIRECTION`; read-verification confirmed `REVISION_REQUIRED`, no Style Lock/pages 2–6, and byte-identical FPV-2.
- 2026-08-26: Persisted and read-verified `GUVPV-1` with five explicit version-1 Global User Visual Rules. No inferred Candidate, Project Profile mutation or Industry Pack mutation was created.
- 2026-08-26: Added Xiaohongshu Platform Pack 1.1.0 Cover policy with an immutable 1.0.0 snapshot; updated four Skills and added six narrow MCP tools, bringing the bounded catalog to 67 tools.
- 2026-08-26: CAL1 actual-image inspection detected unresolved `file://` backgrounds despite mechanical checks. Retained the failed attempt, embedded materialized PNG inputs in CAL2, regenerated only the calibration compositions and visually inspected all candidates and Contact Sheets.
- 2026-08-26: CAL2 produced three full 1242×1660 candidates, six real thumbnails and three Contact Sheets with zero Feishu/formal-FPV/G4/Style-Lock writes. Same-environment deterministic replay matched 12/12 checksums.
- 2026-08-26: All requested Cover commands, MCP build/bundle/test/E2E/Host/package checks, Plugin validation and explicit local calibration passed. Skill Creator's Python helper was unavailable because PyYAML is not installed; strict Ruby YAML parsing plus repository Plugin validation passed all eight Skills without adding a dependency.
- 2026-08-26: Final Vitest summary passed 65/65 files and 291/291 tests. Final complete `CI=true pnpm check` and Secret Scan passed under Node 24.19.0 with the controlled repository-external Chromium cache.

## Final result

`SUCCESS`. Cover Conversion Layer, Xiaohongshu Lead-Generation Cover Policy, Cover Thumbnail QA, Cover Click Clarity, Visual Semantic Relevance, Global User Visual Rules, C-0001 G4 Revision and Commercial-Space Calibration are implemented and validated. C-0001 remains `REVISION_REQUIRED`; calibration remains `AWAITING_USER_SELECTION`. No candidate selection, formal calibration FPV, G4, Style Lock, later page, Feishu write or Phase 4C transition occurred.

## Unresolved issue

The three calibration candidates require Operator selection after this phase; no candidate may be selected automatically. Their retained aesthetic risks are intentionally unresolved until that judgment.
