# Phase 4D｜Cross-Industry Blind Full-Set Regression V1

## Objective

Blindly exercise the current Image Production system with two unrelated fictional calibration projects. Each project must be planned before production, rendered as a complete six-page Xiaohongshu set, inspected at actual pixels, and stopped at G5 `AWAITING_USER_APPROVAL`.

This run produces regression evidence only. It does not change system rules, repair production code, update a Project Profile, update an Industry Pack, create a Global Preference, write Feishu, or modify C-9001.

## Runtime boundary

- Repository: `content-ops-studio`
- Runtime: Node.js `>=24 <25`
- Project data: external Phase 4D Project Home, never the Plugin installation directory
- Formal canvas: `1242×1660`
- Required actual thumbnails: `310×414` and `186×248`
- Formal Chinese: Renderer only
- Generated raster assets: text-free and explicitly fictional calibration assets
- Git commit, remote, and push: prohibited

## Case A｜Commercial Space

- Project: `CAL-COMMERCIAL-BLIND-001`
- Industry Pack: `COMMERCIAL_SPACE_HOSPITALITY`
- Overlay: `SPACE_IDENTITY`
- Visual motif: `SILENT_WAYFINDING`
- Visual system key: `A-WARM-STONE-MOSS-ROUTE-V1`
- Rationale: the content asks whether a guest can move, pause, and understand function without explanation. A single fictional boutique-hospitality world is therefore the evidence anchor, while independent source photographs and materially different shot signatures carry the page duties.
- Continuity anchors: one fictional spatial identity; warm limestone, smoked oak and muted moss; subdued daylight from a consistent direction; restrained bronze route line; one modern Chinese Songti-based editorial system.

### Asset sequence and page strategy

1. P1 Cover — `AI_GENERATED_VISUAL`; `DISTINCT_BACKGROUND_REQUIRED`; threshold establishing wide; route ambiguity is visible before copy.
2. P2 Problem — `AI_GENERATED_VISUAL`; `DISTINCT_BACKGROUND_REQUIRED`; entrance transition with competing paths; demonstrates that appearance alone does not explain the next action.
3. P3 Movement — `AI_GENERATED_VISUAL`; `DISTINCT_BACKGROUND_REQUIRED`; oblique turn and sightline; demonstrates wayfinding through focus and passage.
4. P4 Pause — `AI_GENERATED_VISUAL`; `DISTINCT_BACKGROUND_REQUIRED`; lounge pause zone, medium-wide; demonstrates whether scale, light and seating invite staying.
5. P5 Function — `AI_GENERATED_VISUAL`; `DISTINCT_BACKGROUND_REQUIRED`; elevated/diagonal multi-node view; demonstrates readable relationships between functional zones.
6. P6 Summary — `PROGRAMMATIC_GRAPHIC`; `NO_RASTER_BACKGROUND`; abstract route/pause/function decision path; completes the three-part self-check without a CTA.

The five raster pages require five different source checksums and five materially different shot signatures. Same-axis movement, crop, zoom, mask, exposure, or typography changes are not accepted as distinct assets. The identity reference is used only to preserve the fictional world, never as a reusable production raster.

### Asset sequence sufficiency gate

The sequence is sufficient only when all five raster sources exist as real files, pass identity-coherence inspection, have unique checksums, and show the planned distinct spatial nodes and camera relationships. Otherwise Case A blocks before formal rendering.

## Case B｜Professional Services

- Project: `CAL-PRO-SERVICE-BLIND-001`
- Industry Pack: `PROFESSIONAL_SERVICES`
- Visual motif: `SIGNAL_EXTRACTION`
- Visual system key: `B-INK-IVORY-COBALT-SIGNAL-V1`
- Rationale: the content is about helping a client extract identity, priority and proof from information noise. Continuity comes from the fictional consultant identity, typography, palette, signal-line motif, evidence treatment and grid logic—not from architectural continuity.
- Continuity anchors: same fictional consultant; ink/ivory/cobalt palette with one restrained lime accent; consistent image treatment; one modern Chinese Songti-based headline system; evidence marked as fictional and anonymized; repeated signal-line/grid grammar.

### Asset routing and page strategy

1. P1 Cover — `PROJECT_ASSET`; `DISTINCT_BACKGROUND_REQUIRED`; `PORTRAIT_A`; asymmetric portrait/editorial hook composition.
2. P2 Problem — `PROJECT_ASSET`; `DISTINCT_BACKGROUND_REQUIRED`; `WORKSPACE_A`; information-overload workspace composition.
3. P3 Positioning — `PROGRAMMATIC_GRAPHIC`; `NO_RASTER_BACKGROUND`; signal-to-audience relationship diagram.
4. P4 Information — `EVIDENCE_ASSET`; `DISTINCT_BACKGROUND_REQUIRED`; `EVIDENCE_SCREEN_A`; prioritized information hierarchy shown as fictional evidence.
5. P5 Proof — `MIXED_ASSET`; `DISTINCT_BACKGROUND_REQUIRED`; `PORTRAIT_B + EVIDENCE_NOTES_A`; consultant identity and method evidence combined.
6. P6 Summary — `PURE_TYPOGRAPHY`; `NO_RASTER_BACKGROUND`; three-question decision path with no CTA.

No page uses or requires a commercial-space scene, material language, building node, or multi-view spatial continuity. No raster source is reused in the formal set.

### Asset sequence sufficiency gate

The sequence is sufficient only when `PORTRAIT_A`, `PORTRAIT_B`, `WORKSPACE_A`, `EVIDENCE_SCREEN_A`, and `EVIDENCE_NOTES_A` exist as real, authorized fictional calibration fixtures; the two portraits preserve one fictional identity but have distinct shots; evidence contains no real client claims or data. Otherwise Case B blocks before formal rendering.

## Active A–J regression matrix

- A same raster with five crops → expected `FAIL`
- B five files with same-axis minor movements → expected `FAIL`
- C different backgrounds with typography/color/treatment drift → expected `FAIL`
- D one evidence source with true material transformation and new evidence → may `PASS`
- E pure typography with no raster → expected `PASS`
- F programmatic graphic with no raster → expected `PASS`
- G professional services forced into `SPACE_IDENTITY` multi-view rules → expected `FAIL`
- H commercial-space set made from unrelated projects → expected `FAIL`
- I final page containing only “联系我们” → expected `FAIL`
- J useful summary followed by an already-approved CTA → may `PASS`; not used in either formal Case because no CTA is approved

## QA and acceptance

Each formal page is checked for integrity, copy fidelity, resolved real font, safe area, overflow, clipping, canvas/file validity, raster contrast, background complexity, semantic relevance, page-duty fit, image–text integration, actual-pixel readability and blocking failures. Each set is checked for visual motif/system continuity, anchor continuity, page-duty fulfillment, background policy, shot-signature diversity, asset-channel appropriateness, semantic difference, cover-promise delivery, summary-value delivery, mobile readability, contact-sheet actual pixels and the prohibition on aggregate-score overrides.

Phase 4D passes only when both Cases pass with zero hard blocks. Regardless of result, production stops at G5 `AWAITING_USER_APPROVAL` and no G5 decision is created.

## Implementation log

- 2026-08-27: read the Phase 4D instruction and current Image Set Production policies.
- 2026-08-27: established two independent visual strategies and page-level asset routes before image generation.
- 2026-08-27: confirmed the run is evidence-only; core rules and production code are frozen for this blind test.
- 2026-08-27: materialized five independent fictional commercial-space photographs and three fictional professional-service photographs; generated two anonymous evidence fixtures in the Renderer.
- 2026-08-27: the first execution stopped at `ASSET_SEQUENCE_SUFFICIENCY` because temporary generation directories did not match the formal Run IDs. The same source files were archived under the formal Run IDs; no formal page had been rendered before recovery.
- 2026-08-27: rendered twelve formal pages, twelve same-environment replays, twenty-four actual thumbnails and six Contact Sheets. No system rule or production code was changed in response to the result.
- 2026-08-27: actual-pixel inspection confirmed coherent but non-identical Case A spatial views and a cross-industry mixed-channel Case B without commercial-space leakage. It also confirmed visible typography weaknesses, including awkward line breaks and a Case B P6 title/graphic collision.
- 2026-08-27: complete repository validation passed with the existing external Playwright cache: 154 strict Schemas, 75 test files, 404 tests, Renderer Doctor, installed-copy test, Plugin validation, bootstrap verification, Secret Scan and example sanitization all passed. The external cache path is intentionally not persisted in repository evidence.

## Result

`FAILED / REVISION_REQUIRED`. Both Cases produced complete six-page sets and valid strategy/routing evidence, but each has formal hard blocks. Case A has five blocking findings across P1, P2, P4 and P6; Case B has seven blocking findings across P1, P2, P4, P5 and P6. G5 remains `AWAITING_USER_APPROVAL`; no approval event, Feishu write or final manifest was created.
