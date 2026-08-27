# Phase 4B-R.2.1 universal visual baseline and calibration

## Objective

Create Universal Default Visual Baseline V1 as a lowest-priority cold-start fallback, persist six explicitly confirmed Global User Visual Preference rules, add strict typography/editorial/image-text/diversity/Painpoint-scene/locale QA, and generate a materially diverse fictional commercial-space calibration Round 2. Preserve Round 1 and C-0001 history and stop for Operator selection.

## Non-goals

Do not select a calibration candidate; create a formal FPV, G4, Style Lock, remaining page or Final Manifest; write Feishu; alter C-0001; overwrite Round 1 A/B/C; promote D/E/F to a Project Visual Profile or fixed template; mutate an Industry Pack; download or redistribute fonts; enter Phase 4C.

## Starting state and baseline

Phase 4B-R.2 is complete with 115 strict Schemas, 116 generated TypeScript files, 67 MCP tools, 65 test files and 291 passing tests. C-0001 is `REVISION_REQUIRED`; FPV-2 is retained at checksum `b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5`. Calibration Round 1 A/B/C is retained at `RUN-20260826-131500-CAL2` and remains unselected.

`BASELINE-PHASE-4B-R21-20260826` records 1408 repository files and aggregate `2412d142b048ffb2f5cc092efd8600dd4ed8f6ec39fcfbfd072884ed8bff7441`. Baseline manifests contain no file bodies or absolute Project Home paths.

## Universal default and precedence

The Universal Default is not a visual style or an Industry Pack. It applies only when no higher-level rule resolves the decision. Precedence remains: safety/authenticity/authorization → current Operator instruction → Style Lock → Project Visual Profile → Global User Preference → current Content/Painpoint/evidence/assets → Industry Pack/Overlay → Platform Pack → Universal Default.

The default includes modern Chinese serif preference, real available title weight, regular/medium subordinate copy, dynamic color/effects, editorial spatial relationships, soft type geometry and text-area guidance, approved composition primitives and explicit anti-template boundaries. Every value remains overrideable where the instruction defines it.

## Contract approach

Prefer strict additive extensions. Add independent Schemas only where lifecycle or cross-candidate evidence requires a standalone artifact: Universal Visual Default Policy, Typography Default Policy, Editorial Spatial Composition Report, Image Text Integration Report, Candidate Set Visual Diversity Report, Painpoint Scene Congruence Report and Locale Scene Fit Report. Extend Dynamic Visual Strategy and Project Visual Profile additively. Keep Ajv strict, regenerate TypeScript and fixtures, and add migration classification/tests.

## Global learning

Append one explicit Operator Feedback Event, six confirmed version-1 Global Visual Rules and a new immutable Global User Visual Preference version after GUVPV-1. Do not create an unconfirmed Candidate. Font files are never copied. No Industry Pack or Project Profile is changed.

## Font resolution

Probe the actual Renderer environment before calibration. Prefer Songti SC; if the requested true title weight is unavailable, probe Source Han Serif SC, Noto Serif CJK SC, Noto Serif SC, STSong and other Renderer-verified Chinese serif families. Record requested/resolved family and weight. Never silently fall back to PingFang SC and never download a font. If no viable Chinese serif is available, block Round 2 with `SONGTI_FONT_UNAVAILABLE` and report the candidate chain.

## QA and error handling

Add the requested error codes and deterministic evaluators. Lead-generation thresholds are Click 85, Semantic 80, Painpoint–Scene 85, Image Quality 85 and Candidate Diversity 85; Typography and Thumbnail must pass; hard blocks must be zero. A perfect storefront cannot evidence a failure Painpoint unless a real comparison structure exists. Diagnostic markers must point to visible regions. Generic photo-plus-left-title layouts block.

## Calibration Round 2

Create D/E/F with identical Cover copy but materially different design logic:

- D: a restrained imperfect Chinese-city storefront evidencing the Painpoint.
- E: a customer/owner approach view with three evidence-bound diagnostic regions.
- F: one complete storefront plus three legal crops from that same image in a multi-evidence editorial composition.

Host ImageGen creates text-free backgrounds only. Renderer owns the exact Chinese copy. Generate 1242×1660, 310×414 and 186×248 PNGs plus three Contact Sheets. Inspect actual pixels, record typography resolution and all QA layers, then stop at `CALIBRATION_COVER_SELECTION / AWAITING_USER_SELECTION` with zero formal FPV/G4/Style Lock/Feishu writes.

## Files involved

Strict Schemas, generated contracts/fixtures, Cover and Dynamic Strategy core, Profile/Global Preference Runtime, MCP definitions, Image Production/Visual Planning/Router Skills, docs/ADR/tests, baseline and phase reports, local calibration harness, and repository-external fictional runtime evidence.

## Validation

Run focused contract, typography, composition, image-text, diversity, Painpoint-scene, locale, Dynamic Strategy, isolation, MCP and Skill checks; validate actual calibration images and deterministic replay; then run full `CI=true pnpm check`, Secret Scan and baseline-relative aggregation under Node 24 with the controlled repository-external Chromium cache.

## Failure recovery

Retain every failed Host/Renderer attempt and create a new run or versioned sibling; never overwrite Round 1. If a font, image, locale, diagnostic marker or diversity gate fails, stop the affected calibration stage, preserve evidence and perform only a targeted non-destructive correction. Scores never select a candidate.

## Implementation record

- 2026-08-26: Read the full R.2.1 instruction, repository/Plugin rules, ImageGen Skill, R.2 Cover policy/ADR/ExecPlan and current state.
- 2026-08-26: Created immutable baseline `BASELINE-PHASE-4B-R21-20260826`: 1408 files, aggregate `2412d142b048ffb2f5cc092efd8600dd4ed8f6ec39fcfbfd072884ed8bff7441`.
- 2026-08-26: Added seven strict contracts, generated 122 schema declarations plus index, additive Dynamic Strategy/Profile fields, core evaluators, migration coverage and Skill routing.
- 2026-08-26: Validated the committed `UVDPV-1` and `TDPV-1` policies and resolved installed Songti SC real 700/400 weights without font download or silent PingFang fallback.
- 2026-08-26: Persisted and read-verified `GUVPV-2` with 11 active rules (five preserved plus six newly confirmed); no Industry Pack or Project Profile mutation.
- 2026-08-26: Generated three independent text-free Host ImageGen backgrounds. Renderer produced D/E/F full PNGs, two true-size thumbnails each, three Contact Sheets and deterministic replays.
- 2026-08-26: Actual pixel inspection superseded CR02 due to D's forced narrow-column first phrase. CR03 preserved D's source and ID, corrected only Renderer layout and passed reinspection.
- 2026-08-26: Stopped at `CALIBRATION_COVER_SELECTION / AWAITING_USER_SELECTION`; formal FPV/G4/Style Lock/Feishu writes remain zero.
- 2026-08-26: Final Node 24 repository validation passed with the controlled external Playwright cache: 122 strict Schemas, 66 test files, 308 tests, Plugin/bootstrap validation, Secret Scan and example sanitization all passed.

## Final result

Implementation, calibration evidence and full repository validation passed. Operator selection remains intentionally pending.

## Unresolved issue

Round 2 D/E/F requires Operator aesthetic selection; no candidate may be selected automatically.
