# Phase 4B-R.1 dynamic visual strategy and learning hardening

## Objective

Replace the fixed candidate-slot behavior with a deterministic per-content strategy synthesizer that combines Project, Subject, Audience, platform, Pack/overlay priors, Project Visual Profile, current content semantics, authorized assets, references, history, confirmed rules and current Operator overrides. Prove durable cross-Run project learning without mutating Industry Packs or global preferences.

## Non-goals

No new image generation, customer data, remote Feishu write, G4 decision, Style Lock, remaining-page production, Phase 4C, attachment, publishing or Pack auto-learning is authorized.

## Starting state and compatibility note

The pasted R.1 instruction assumes C-0001 remains at direction selection with VV-2 and FPV-2 absent. That assumption is older than the immediately preceding explicit Operator selection: the repository and external Project Home already contain `VDS-C-0001-A`, VV-2 and FPV-2, with G4 `AWAITING_USER_APPROVAL`. History will not be deleted or misreported. R.1 implementation treats C-0001 as read-only and does not advance G4, create a Style Lock or produce pages 2–6.

## Baseline

`BASELINE-PHASE-4B-R1-20260825` records the pre-implementation working tree under `reports/baselines/` with repository-relative checksums only. Starting inventory: 1311 files, aggregate `fa1becda916849d80ddf67d23318776bb76c7921c2abb2e22f891f4397d9f509`, Node v24.19.0. The complete preflight `CI=true pnpm check` passed with 104 strict Schemas, 57 test files and 261/261 tests.

## Contract approach

Add independent strict contracts for Dynamic Visual Strategy Plan, confidence and ambiguity. Extend Project Visual Profile additively with the requested granular dimensions and four-state maturity while preserving legacy stored profiles. Record migration behavior and regenerate fixtures/types through repository generators.

## Strategy precedence

Safety, authenticity and authorization remain absolute. Within valid choices: current explicit Operator request → active Style Lock when applicable → confirmed Project rules/Profile → confirmed global preferences → per-content evidence and semantic needs → Industry Pack/overlays as priors and risk boundaries → Visual Mode primitives → generic fallback. Per-content strategy makes the final decision; neither industry name nor mode is a finished style.

## Learning lifecycle

Use a separate fictional Project Home. Run 1 starts COLD_START and synthesizes content-derived candidates. A fictional explicit project preference creates Feedback Event and Rule Candidate; only explicit confirmation creates an active versioned rule and Profile version 2. Run 2 loads that exact Profile and applies it to different content without reusing Run 1 layout. A CURRENT_SET dark override wins for one Run without mutating the Profile. Revoke/forget retain audit evidence, increment Profile versions and stop future application while historic Run bindings remain unchanged.

## Commercial-space isolation

Harden `COMMERCIAL_SPACE_HOSPITALITY + SPACE_IDENTITY` with spatial DNA, structure, viewpoints, material/light credibility, design-change authorization, first-page gating and group consistency. Tests must prove these constraints do not become aesthetic defaults for unrelated industries.

## Files involved

Core and Runtime image-production packages; strict Schemas, generated contracts and fixtures; Industry Pack/overlay; Image Production Skill and focused references; migration/core/runtime tests; R.1 validation harness; architecture, Profile, Pack and learning documentation; phase reports and sanitized working-tree comparison.

## Validation

Run fixture/type generation, strict Ajv, migration tests, focused dynamic-strategy and cross-Run tests, Industry Pack validation, Skill validation, full `CI=true pnpm check`, Secret Scan and example sanitization. Evidence remains local and fictional.

## Implementation record

- 2026-08-25: Read the full R.1 instruction, repository/Plugin rules, Skill Creator guidance, Image Production Skill and normative routing/selection/Pack/learning references.
- 2026-08-25: Audited current core and found the fixed AI / Pure Typography / Mixed candidate slots and only `UNMATURE/MATURE` Profile maturity.
- 2026-08-25: Confirmed the C-0001 state discrepancy and froze the actual prior artifacts at G4 `AWAITING_USER_APPROVAL` without further production.
- 2026-08-25: Pre-implementation `CI=true pnpm check` passed: 104 strict Schemas, 57 test files, 261/261 tests, Renderer READY and Secret Scan clean.
- 2026-08-25: Created immutable R.1 baseline: 1311 files, aggregate `fa1becda916849d80ddf67d23318776bb76c7921c2abb2e22f891f4397d9f509`.
- 2026-08-25: Added three strict strategy/confidence/ambiguity contracts, extended Project Visual Profile granularity additively and regenerated 108 TypeScript contract files from 107 Schemas.
- 2026-08-25: Implemented content-derived strategy synthesis, four-state maturity, explicit learning confirmation, current-set override and revoke/forget lifecycle without automatic Profile or Pack mutation.
- 2026-08-25: Added immutable Project Home Profile versions, atomic active pointer, idempotency/conflict protection and read verification in Runtime.
- 2026-08-25: Ran the fictional four-Run live-local learning harness outside the Plugin tree; cross-Run loading, override, revoke and historic binding checks passed with zero Feishu writes and zero generated images.
- 2026-08-25: Hardened `COMMERCIAL_SPACE_HOSPITALITY + SPACE_IDENTITY` and retained their previous 1.0.0 snapshots; unrelated-industry isolation tests passed.
- 2026-08-25: Updated the Image Production Skill and focused references. The Skill Creator Python validator could not start because host Python lacks PyYAML; equivalent Ruby YAML/frontmatter checks and repository Plugin validation passed.
- 2026-08-25: Final `CI=true pnpm check` passed: 107 strict Schemas, 61 MCP tools, 59 test files and 278/278 tests; Renderer, installed distribution, Plugin Skills, Secret Scan and example sanitization all passed.

## Final result

Implementation and validation completed successfully. The dynamic strategy, granular Profile, cross-Run learning, current-set override, revoke/forget, commercial-space baseline and unrelated-industry isolation evidence all passed. Existing C-0001 production history remains unchanged and paused at G4 Operator approval.

## Unresolved issues

- Final C-0001 G4 decision remains an Operator action outside this phase.
