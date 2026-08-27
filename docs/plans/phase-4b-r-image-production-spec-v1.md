# Phase 4B-R — Image Production Specification V1 and First-Page Rebaseline

Status: COMPLETE. Owner: repository maintainers. Started and completed: 2026-08-25.

## Task goal

Integrate the Operator-confirmed Image Production Specification V1 across contracts, deterministic Core, Runtime, MCP, Skills, Industry Visual Packs, Project Visual Profile, quality evaluation and feedback/rule learning. Rebaseline the retained fictional `C-0001` workflow by producing two or three materially different visual direction candidates and stop at `VISUAL_DIRECTION_SELECTION / AWAITING_USER_SELECTION`.

## Non-goals

Do not modify or submit `FPV-1`; create `VV-2`, `FPV-2`, G4, Style Lock or pages 2–6; write formal visual fields to Feishu; create a Base or Content; change approved copy/page count; add a third-party image API; request an API key; use Mock as a Production fallback; upload attachments; publish; enter Phase 4C; change Plugin version/license; configure a Git remote; commit or push.

## Current Specification Hold

`C-0001` remains bound to Content `CV-1`, Copy `CV-1`, Visual Plan `VV-1` and technical sample `FPV-1`. Its checksum is `68e9a0647f5a9ef00bc32eeb3516a519804192012208c4ad9e63fa987dd8b292`; G4 is `AWAITING_USER_APPROVAL`; Style Lock is `NOT_CREATED`; remaining pages are `NOT_ELIGIBLE`; Image Production Skill is `PAUSED_PENDING_NEW_SPECIFICATION`. `FPV-1` and its Generation Manifest, Render Report, QA, Journal, Write Log and Checkpoint are immutable retained evidence and are not a visual-preference or Style-Lock source.

## Confirmed eight modules

1. Multi-channel backgrounds and asset routing.
2. AI background, formal text and Renderer ownership.
3. Final count, candidate count and batch count separation.
4. Direction selection, G4 aesthetic approval and Style Lock.
5. Single-image quality.
6. Group consistency and page difference.
7. Industry Visual Packs and overlays.
8. Feedback classification, confirmed rules and long-term learning.

## Four-layer production architecture

Production resolves Universal Production Core + versioned Industry Visual Pack/overlays + versioned Project Visual Profile + Per-Content Visual Plan. Safety, truth, authorization and evidence lead; explicit current Operator requirements may request a Style Lock revision but never silently bypass it. Project rules never mutate an Industry Pack, and one-content feedback never becomes a Project rule automatically.

## Multi-channel asset architecture

Support `PROJECT_ASSET`, `AI_GENERATED_VISUAL`, `PROGRAMMATIC_GRAPHIC`, `EVIDENCE_ASSET`, `PURE_TYPOGRAPHY` and `MIXED_ASSET`. Visual mode is orthogonal to channel. Routing records source eligibility, authorization, capability, intended purpose, evidence boundary, fallbacks and why the selected channel is executable. Production never falls back to Mock.

## Host-Native ImageGen Bridge

The installed OpenAI `imagegen` Skill exposes the built-in `image_gen` Host tool for generation and editing without `OPENAI_API_KEY`. The Skill invokes the Host; MCP never calls an image API. The Bridge creates a structured request and validates a submitted Host result. Only a real local/mounted file that can be safely copied into Project Home is durable; a temporary conversation URL is rejected as `HOST_IMAGE_ASSET_UNMATERIALIZABLE`. If Host capability is absent, return `UNAVAILABLE` and use only genuinely available non-AI channels.

## Formal text and Renderer boundary

All formal informational text is a deterministic Renderer layer. AI backgrounds carry no readable information text. Native text in real evidence/project assets may remain, while explanatory labels are rendered. Renderer may crop, scale, mask, grade, blur, composite, annotate and add controlled geometry without changing Subject identity, product form, space structure, evidence meaning, copy or global direction.

## Image quantity and batches

Default final count is 4–8, commonly 5–6, with explicit Operator count taking precedence. Candidate, formal, source, attempt, failure and retained-history counts remain independent. A content/page-count change after G3 returns to Content Revision. Direction selection, G4 and G5 are the only default human nodes.

## Direction candidates

New or visually immature projects receive two or three material visual candidates; mature compatible profiles or explicit visual requirements may skip the candidate stage. Candidates use Candidate Asset IDs, not FPV versions; stay in Project Home; never enter formal Feishu fields, G4 or Style Lock; score at least 75 with zero hard blocks. Color/font/border-only variants are rejected.

## G4 and Style Lock

Direction selection is not G4. After explicit direction selection, a future continuation may create `VV-2`, handoff and formal `FPV-2`, then stop at G4. G4 requires mechanical quality, aesthetic quality and project fit plus explicit Operator approval. Style Lock separates `locked_rules`, `allowed_variations` and `prohibited_deviations`; it locks a language, not exact Cover coordinates/background/subject.

## Single-image quality

Evaluate truth/integrity, mechanical quality, visual quality, mode/project fit and Operator aesthetic approval. Hard blockers cannot be offset. The deterministic 100-point score is 20 semantic fit, 15 composition/focus, 15 hierarchy/readability, 15 asset quality/integrity, 10 Project/Audience fit, 10 distinctiveness, 10 mode execution and 5 platform/mobile. Candidate threshold is 75; formal threshold is 85 with core dimensions at least 3. AI attempts stop after three materially targeted strategies; Renderer fixes stop after two before escalation.

## Group quality

Evaluate system identity, Subject/product/space continuity, page difference, narrative rhythm, type/color/treatment consistency and completion/platform fit. Formal groups require 85, zero blockers and core dimensions at least 3. Two or more near-duplicate compositions, identity drift, missing/wrong pages, false evidence, Style Lock drift and text drift block.

## Industry Visual Packs

Add seven versioned read-only packs: Generic, Commercial Space & Hospitality, Professional Services, Personal IP & Creator, Medical Aesthetics & Health, Product & Consumer, and Food/Beverage/Lifestyle. Add seven composable overlays: Person Continuity, Product Identity, Space Identity, Evidence Authenticity, Regulated Claims, Before/After Integrity and Brand Asset Integrity. Packs contain defaults and checks, never customer assets, logos, copyrighted images, fixed finished templates or permanent prompts.

## Project Visual Profile

Store versioned maturity, confirmed palette/type/image/reference/person/brand rules, long-term `PREFER`, `AVOID`, `MUST`, `MUST_NOT`, positive/negative references and prohibited directions under Project Home or Plugin Data. The initial `C-0001` profile is intentionally `IMMATURE` and contains no invented preference.

## Feedback events and rules

Separate `QUALITY_DEFECT`, `PRODUCTION_FEEDBACK`, `VISUAL_PREFERENCE` and `PROJECT_OR_DOMAIN_CONSTRAINT`; use the smallest unambiguous scope. Feedback creates a Rule Candidate, never an active long-term rule. Only explicit confirmation creates a versioned Confirmed Rule with rationale, scope, type, examples, exceptions and source; update, disable, supersede, revoke and forget preserve audit history. G4/G5 do not automatically produce long-term preferences, and system defects never enter aesthetic learning.

## MCP tools

Retain all existing tools and add the fourteen bounded tools enumerated by the specification for production context, routing, candidate planning/submission/read/selection, Host asset submission, image/group evaluation, feedback/rule list/confirm/update and full-set planning. The prose count of thirteen is a specification arithmetic mismatch; the named list is authoritative. Six are read-only and eight are controlled local writes. Every tool has strict schemas, annotations, structured/readable content and stable redacted errors. No prompt/API/shell/arbitrary-file/URL/browser/raw-Feishu/delete tool is added.

## Skill and Router

Refactor `image-set-production` into a concise Skill plus detailed references for routing, text/Renderer, quantity, candidate selection, G4/Style Lock, single/group quality, packs, feedback learning, Host ImageGen and failures. Router recognizes the new user-goal intents, selects no direction automatically, asks at most one materially necessary question, confirms no long-term rule automatically, calls neither Lark CLI nor an image API directly, and never enters Phase 4C.

## Current C-0001 recalibration

Create a new Image Production Context, determine the Project Visual Profile is immature, plan two or three materially different candidates, submit real candidate assets under the external Project Home, validate hashes and quality, show them, and stop. Do not modify `VV-1`, `FPV-1`, Feishu formal visual fields or copy. Candidate directions may include AI + Renderer, Pure Typography and Mixed Asset, but actual output must follow available capabilities and must not claim unavailable AI evidence.

## VV-2 and FPV-2 boundary

Neither version exists in this turn. Only a later exact Candidate ID selection may create a Visual Direction Selection artifact, preserve `VV-1`, create `VV-2`, generate `FPV-2`, run mechanical/aesthetic/project QA, show it and stop at G4. Target binding remains `CV-1:CV-1:VV-2:FPV-2:<checksum>`.

## Data and migration approach

Add fourteen strict 1.0 Schemas and minimally extend existing visual/generation/render/QA/Style Lock contracts without removing enums. Additive enum/property changes are recorded under the existing migration protocol with migration tests. Generated TypeScript and fixtures are produced by repository generators only. The four-table/141-field Feishu Blueprint does not change.

## Security and privacy

No API key, token, remote identifier, temporary URL, absolute personal path, generated image byte, customer material or browser binary enters source/reports/bundle. Candidate bytes stay in external Project Home. Host capability and Provider metadata are allowlisted and redacted. File submission requires project containment, supported raster format, size/dimension validation and checksum. Production has no Mock fallback.

## Failure recovery

Retain every verified attempt and candidate. Reject missing, unsafe, temporary-only or unmaterializable Host assets without fabricating paths. Replays reuse identical artifacts; conflicting identity/input blocks. Candidate failure creates no `VV-2`, FPV, G4, Style Lock or Feishu write. Resume from local Journal/Checkpoint only after validating retained hashes.

## Files involved

Canonical Schemas/catalog/fixtures/generated types; seven ADRs; image/Core/Runtime packages; MCP/CLI; seven Industry Packs and overlays; Skill/Router; scripts/tests; docs 53–63 and affected existing docs/readmes; nine Phase reports; external Project Home candidate evidence.

## Test matrix

Cover routing precedence and every channel; Host ready/unavailable/materialization failures/no API key/no Mock fallback; text boundary; quantity/batches; two/three/skip/material-difference candidates; five-layer scoring/hard blocks/retries; G4/Style Lock classifications; group identity/difference/contact sheet; seven packs/overlays/versioning; feedback scopes/candidates/confirmation/update/disable/forget/bug exclusion; current `C-0001` FPV-1 checksum and no downstream writes; MCP/installed-copy/security/full regression.

## Implementation steps

1. Complete official-source review and preflight; freeze the Specification Hold baseline.
2. Add Accepted ADR-0036–0042 and strict contracts/migration evidence.
3. Implement routing, quality, packs, profile, feedback/rules and Host submission/materialization boundaries.
4. Compose Runtime, all fourteen MCP tools enumerated by the specification, CLI/harness, Skill and Router.
5. Update docs/reports and run complete offline/installed-copy/security validation.
6. Create and validate real `C-0001` direction candidates without formal or remote state changes.
7. Display candidates and stop at `AWAITING_USER_SELECTION`.

## Implementation record

- 2026-08-25: Read the complete Phase 4B-R instruction, repository/Plugin rules, current Phase 4A/4B contracts, reports and retained specification hold.
- 2026-08-25: Confirmed built-in OpenAI `imagegen` Skill generation/edit path, no-key Host mode, project materialization rule and explicit no-silent-API-fallback boundary. Official OpenAI sources confirm Skills/Plugin packaging and current GPT Image generation/edit capability; MCP remains a separate tool boundary.
- 2026-08-25: Preflight confirmed Node v24.19.0, pnpm 11.19.0, official CLI 1.0.63 with verified user identity, unborn `main`, no Git identity, no remote and no push.
- 2026-08-25: Initial full `CI=true pnpm check` passed with Renderer READY, 89 Schemas, 47 MCP tools, 51 test files and 243/243 tests.
- 2026-08-25: Created immutable `BASELINE-PHASE-4B-SPEC-HOLD-20260825`: 1161 files, aggregate `816c1f421da887fe130a03d0588f2a19a83a211456c562aa2eeb96baa76f90ca`.
- 2026-08-25: Added and strictly validated 14 independent Image Production contracts, valid/invalid fixtures and generated types. Current inventory is 103 Schemas and 104 generated TypeScript files including index; enum additions remain conservatively migration-classified.
- 2026-08-25: Accepted ADR-0036–0042; implemented six-channel routing, Host ImageGen request/submission/materialization, external Image Production Runtime, five-layer/100-point quality, Group QA and feedback/rule eligibility.
- 2026-08-25: Added seven versioned Industry Visual Packs and seven overlays with no customer assets, plus Project Visual Profile binding and validation.
- 2026-08-25: Added all 14 names enumerated in the task's MCP list (one prose count says thirteen), bringing the computed catalog to 61: six new reads and eight controlled local writes, with no arbitrary image API, URL, Browser, shell, file, Feishu or delete tool.
- 2026-08-25: Refactored the Image Production Skill and Router for Host-native `$imagegen`, formal Renderer text, direction selection, G4/Style Lock separation, group QA and explicit rule confirmation.
- 2026-08-25: Generated two real text-free Host ImageGen sources and one Pure Typography direction; deterministically rendered three 1242×1660 C-0001 previews. Candidate A/B/C scores are 87/85/89 with zero hard blocks. Source and preview bytes exist only under external Project Home.
- 2026-08-25: Live harness verified the frozen FPV-1 checksum, wrote Context, Candidate Set, attempts, quality reports and Checkpoint, and stopped at `VISUAL_DIRECTION_SELECTION / AWAITING_USER_SELECTION`. Formal Feishu writes remained zero; VV-2, FPV-2, G4, Style Lock and pages 2–6 were not created.
- 2026-08-25: Final sandboxed `pnpm check` reached Renderer Doctor and correctly reported that the external browser cache could not launch inside the restricted sandbox; the identical check was rerun with approved access to that existing cache.
- 2026-08-25: Final `CI=true pnpm check` exited 0 with Renderer READY, 103 strict Schemas, 104 generated TypeScript files including index, 61 MCP tools, 55 test files and 253/253 tests. Plugin validation, installed-copy checks, Secret Scan and example sanitization passed.
- 2026-08-25: Replayed the direction Live Harness after final lint/type fixes. Candidate A/B/C hashes remained unchanged, FPV-1 remained unchanged, and the checkpoint remained `AWAITING_USER_SELECTION` with zero formal Feishu writes and no downstream artifact creation.
- 2026-08-25: Operator deferred direction selection and classified the missing full-direction comparison as `PRODUCTION_FEEDBACK / CURRENT_SET`, explicitly not a long-term Rule Candidate.
- 2026-08-25: Added the independent Visual Direction Comparison Set contract, fixed Core so Production Feedback remains current-work-only, and added Renderer templates/tests for equal approved copy and external-label Contact Sheets. Current inventory is 104 Schemas and 105 generated TypeScript files including index.
- 2026-08-25: Preserved all original Candidate assets, checksums and quality reports. Rendered three separate complete previews using identical approved title/body text, rescored them at A/B/C = 92/94/93, and created a same-scale Contact Sheet. Visual QA retained one comparison attempt and corrected only a cross-line split inside “专业” in the final comparison Run.
- 2026-08-25: Comparison checkpoint remains `VISUAL_DIRECTION_SELECTION / AWAITING_USER_SELECTION`; formal Feishu writes, VV-2, FPV-2, G4 artifact, Style Lock and pages 2–6 remain zero/not created.
- 2026-08-25: Post-comparison `CI=true pnpm check` exited 0 with Renderer READY, 104 strict Schemas, 105 generated TypeScript files including index, 61 MCP tools, 56 test files and 258/258 tests. Installed-copy checks, Secret Scan and example sanitization passed.
- 2026-08-25: Operator explicitly selected `VDC-C-0001-A` for the current C-0001 set as `PRODUCTION_FEEDBACK / CURRENT_SET`, with no long-term Rule Candidate. Created `VDS-C-0001-A`, preserved VV-1/FPV-1, created six-page VV-2, generated and materialized one new text-free Host raster, and rendered FPV-2 without Feishu writes.
- 2026-08-25: Actual-image QA retained the first FPV-2 Renderer attempt after detecting undesirable phrase splits, then performed one Renderer-only retry with unchanged copy, background and direction. Final FPV-2 checksum is `b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5`; same-environment replay matched, formal quality is 93 with zero hard blocks, and the Run stopped at G4 `AWAITING_USER_APPROVAL` with no Style Lock or pages 2–6.
- 2026-08-25: Final post-selection `CI=true pnpm check` exited 0 with Renderer READY, 104 strict Schemas, 105 generated TypeScript files including index, 61 MCP tools, 57 test files and 261/261 tests. Installed-copy Renderer/Plugin checks, Secret Scan and example sanitization passed.

## Final result

Implementation, complete comparison, explicit direction selection, VV-2 and FPV-2 formal Cover production are complete. C-0001 is intentionally paused at G4 `AWAITING_USER_APPROVAL`. No G4 decision, Style Lock or page 2–6 asset exists.

## Unresolved issues

- `C-0001` G4 decision, Style Lock and remaining pages are intentionally unresolved until an explicit future Operator approval.
