# Phase 4A — Formal Visual Planning and First-Page Production Handoff

Status: COMPLETE. Owner: repository maintainers. Started and completed: 2026-08-24.

## Task goal

Turn the exact G3-approved `C-0001` copy into a deterministic, evidence-backed formal Visual Plan: three direction candidates, one selected direction, one versioned Visual System, six Page Visual Plans, asset requirements, layout feasibility, quality evidence, a protected Feishu summary write and a first-page production handoff.

## Non-goals

No image generation, image API, PNG, Style Lock, G4, Renderer, Playwright, attachment upload, Research expansion, publishing, automatic deletion, new Base, customer project, Plugin version/license change, Git remote or push.

## Current Live status

The retained fictional sandbox contains exactly one `C-0001`, remotely `COPY_APPROVED` at `CV-1:CV-1`, with six copy pages and no formal Visual Plan. Image, first-page, final and sync states remain untouched. The prior temporary Runtime Home was cleaned by the OS; retained remote state was recovered through an official-CLI read-only title lookup and will be reconstructed only in a new external test Home.

## Visual-planning eligibility

Eligibility requires `COPY_APPROVED`, matching Content/Copy versions, 4–8 contiguous pages, exact copy snapshots and no conflicting current Visual Plan. A stale version, copy drift, page-count drift, duplicate candidate, missing Workspace mapping or approved-copy mutation blocks before remote write.

## Source hierarchy and evidence

Inputs are repository contracts, accepted Phase 3B evidence, the current Project Profile/rules/packs, and read-verified Feishu data. Chat memory is not project evidence. Exact copy is hashed after NFKC normalization without semantic rewriting.

## Visual direction candidates and selection

Create `EDITORIAL_SERIES`, `EVIDENCE_LED` and `MIXED`. Select `EDITORIAL_SERIES`; preserve every candidate, rationale, trade-off and rejection reason. Selection is version-bound to `C-0001`, `CV-1:CV-1` and the six-page copy hash.

## Visual System and Page Visual Plans

Use a 1242×1660 3:4 canvas, editorial warm-white and low-saturation blue-gray system, tokenized typography/color/spacing, continuous page numbering and six page-specific layouts. No people, logos, fake certificates, fake screenshots, fake UI evidence or fabricated data. Existing `visual-system` and `page-visual-plan` remain canonical contracts.

## Asset requirements and safety

Every required asset records page, purpose, category, source eligibility, evidence need, generation/production boundary and safety constraints. Phase 4A may plan assets only. It never creates files, calls an image provider or writes image paths.

## Layout feasibility

Check safe areas, text-box bounds, hierarchy, minimum text size, density, line capacity, overflow and page sequence. Copy drift, page-count drift and text overflow return stable blocking errors without a remote write.

## Quality scoring

Weights total 100: Content fidelity 20, mode fit 15, group consistency 15, page specificity 15, readability 15, asset feasibility 10, project fit 5 and platform fit 5. Handoff readiness requires score at least 80 and zero blockers.

## Feishu mapping and protected write

Reuse the existing Content row and field map. The only allowed business-field updates are formal background direction, visual-plan summary, visual-plan version, content status `VISUAL_PLANNING`, last Run ID and update time. Copy, title/body, Painpoint link/status, image, first-page, final and sync fields are protected and read-verified unchanged.

## MCP tools, Skill and Router

Add eight narrow MCP tools: get context, plan direction, submit plan, finalize plan, get plan, verify plan, plan revision and get first-page handoff. Expected catalog: 39 total, 27 read and 12 write. Implement the Visual Planning Skill and Router intents without giving either direct CLI/Feishu ownership.

## Idempotency and conflict behavior

Identical key/input replay performs zero remote updates and reuses the retained plan. Same key with different input blocks. Finalization uses lock, Journal, Write Log, Checkpoint, pre-write state, bounded update and read-after-write verification. No rollback deletes history.

## Revision behavior

A revision plan is versioned, retains current and proposed scope, invalidates no G4 because G4 is out of scope, and defaults to dry-run. Phase 4A Live evidence exercises a zero-write revision dry-run only.

## First-page handoff boundary

The handoff carries the exact Cover copy snapshot/hash, selected direction, Visual System version, page-one layout, required assets, constraints and readiness evidence. It must contain no Style Lock, G4 approval, generated asset, render manifest, attachment or image path.

## Live sandbox workflow

Recover the unique existing fictional Base into a new external test Home; read-verify `C-0001`; produce/submit/finalize the plan with both live gates; verify remote protected fields; replay identically; test conflict, drift, page-count, overflow and revision dry-run boundaries; produce redacted Live evidence. No Base/table/field/record is created or deleted.

## Security and privacy

Secrets are environment/auth-store only. No secret CLI argument, token persistence, authorization header, full identifier, full URL, absolute personal runtime path, customer material or raw remote error enters source or reports. Complete mapping stays in the external Runtime Home.

## Failure handling

Any offline regression blocks Live writes. Ambiguous Base/Content, stale version, mapping gap, write/read mismatch or API drift stops at the recoverable checkpoint. Preserve existing remote assets, report the narrow recovery action and never blind-retry creation or delete history.

## Files involved

Eight strict Schemas/catalog/types/fixtures; Visual Planning Core and Runtime; Workspace/MCP wiring; Skill/Router; three ADRs; docs 36–43 and affected architecture/security/test/install/readiness docs; Live Harness, tests and eight phase reports.

## Test commands

Run the task-specified contract, Core, Runtime, Workspace, MCP, Skill, CLI, Plugin, installed-copy, Secret Scan and full `CI=true pnpm check` sequence before Live; repeat full regression and Secret Scan afterward.

## Implementation steps

1. Complete preflight, immutable Phase 3B baseline and read-only data audit.
2. Add ADR-0029–0031 and eight strict contracts with fixtures/generated types.
3. Implement deterministic direction, fidelity, layout, quality, handoff and revision Core/Runtime behavior.
4. Add eight MCP tools, Visual Planning Skill and Router wiring with exact annotations.
5. Update architecture/security/testing/installation/readiness documentation and reports.
6. Run pre-Live full regression.
7. Execute the existing-sandbox Live workflow with protected read verification and no image action.
8. Complete replay/conflict/drift/overflow/revision evidence, final regression and baseline-relative diff.

## Implementation record

- 2026-08-24: Read the complete Phase 4A instruction, repository/global rules, relevant accepted ADRs, visual/content contracts, Core/Runtime/MCP/Skill structure and Phase 3B evidence.
- 2026-08-24: Confirmed Node v24.19.0, pnpm 11.19.0, official Lark CLI 1.0.63, valid user OAuth, unborn `main`, no Git identity, no remote and no push.
- 2026-08-24: Initial `CI=true pnpm check` passed with 73 Schemas, 31 tools, 46 test files, 225 tests, Secret Scan and example sanitization.
- 2026-08-24: Created the immutable Phase 3B baseline before Phase 4A source changes: 1005 files, aggregate `14898d01ffe6685a4604eb3a8dcac9a0e91903c974acc518c73c388f1874e7bd`.
- 2026-08-24: Official-CLI read-only audit confirmed one eligible `C-0001`, exact approved `CV-1:CV-1` six-page copy, empty visual fields, unchanged downstream states, correct `P-0001` relation/state and no keyed blank row. The cleaned prior Runtime Home is explicitly recorded; no remote write occurred.
- 2026-08-24: Accepted ADR-0029–0031; added eight strict Schemas, generated types and fixtures; implemented deterministic Visual Planning Core/Runtime, eight MCP tools, formal Skill/Router wiring and docs 36–43.
- 2026-08-24: Pre-Live full `CI=true pnpm check` passed with 81 Schemas, 39 MCP tools, 48 test files and 236 tests after synchronizing two additive count assertions.
- 2026-08-24: Live run `RUN-20260824-223000-P4A1` reused the unique retained sandbox and one existing `C-0001`; one bounded six-field update passed read-after-write, protected fields stayed unchanged, and no Base/Content/image/G4/Style Lock was created.
- 2026-08-24: Live evidence passed for 3 candidates, `EDITORIAL_SERIES`, `VV-1`, 6 pages, layout PASS, quality 95.8, READY first-page handoff, zero-update replay, idempotency conflict, copy/page drift, overflow and zero-write revision boundaries.

## Final result

SUCCESS. Visual Planning Skill, contracts, page plans, layout feasibility, Feishu write, idempotency and first-page handoff evidence passed. Visual Planning Production Readiness is READY; overall Plugin Production Integration Readiness remains BLOCKED by deferred production capabilities.

## Unresolved issues

- Native repo-Plugin automatic installation remains outside the accepted installed-copy/SDK Host path unless this phase produces new evidence.
- Image production, G4/Style Lock, Renderer, attachment upload, publishing and public production MCP remain deferred.
