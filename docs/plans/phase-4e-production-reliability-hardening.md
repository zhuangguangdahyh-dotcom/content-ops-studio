# Phase 4E｜Production Reliability Hardening V1

## Objective

Harden the existing Image Production pipeline so a formal asset is never promoted before deterministic rendering, real-font layout safety, semantic line-break safety, final-raster contrast, copy ownership and all existing quality gates pass.

Phase 4D remains an immutable failed regression baseline. Phase 4E reuses the exact Phase 4D source assets, content, visual motifs, page duties, routing, shot signatures and background policies. It does not repeat visual strategy selection and makes no ImageGen call unless a source file is proven damaged.

## Non-goals

- No new visual-aesthetic knowledge or Universal visual principle.
- No Project, Industry or Global visual preference update.
- No C-9001 mutation.
- No Phase 4D history overwrite.
- No Feishu write, G5 decision, Git commit, remote or push.

## Workstreams

### Determinism

Audit input, DOM geometry, pixels and PNG bytes independently. Establish `DETERMINISTIC_RENDER_CONTEXT_V1` with pinned viewport, DPR, locale, timezone, color scheme, reduced motion, browser version, canvas, network block, deterministic seed, stable ordering, font readiness, image decode readiness, disabled animation/transition and consecutive geometry stabilization. Replay uses independently prepared but equivalent render boundaries; QA-only DOM mutations never occur between the formal screenshot and replay comparison.

### Text layout

Add `TEXT_LAYOUT_PREFLIGHT_V1` using real Browser font metrics. It checks overflow, clipping, safe area, text/graphic collision, breathing room, minimum mobile-readable size, orphan glyph/punctuation and unnatural semantic splits. A bounded solver tries semantic break, region expansion, composition-local movement, safe font reduction, line-height and tracking in that order without changing copy.

### Raster contrast

Run final-raster contrast before promotion for every formal text layer. Recovery is local and ordered: text region, foreground, graphic position, local value, crop and composition-local adjustment. Contrast recovery must preserve the current visual-system key.

### Copy and graphic ownership

Approved content belongs only to `CONTENT_TEXT_LAYER`. Decorative or functional markers belong to `GRAPHIC_MARKER`, are excluded from copy fidelity, and may not add claims or new body information. A semantic graphic label not approved by Content blocks with `COPY_CHANGE_REQUIRED`.

### Promotion and recovery

The production sequence is Attempt → Preflight/QA → bounded recovery → QA → Formal Promotion. Failed attempts remain evidence and always have `formal_asset = false`. Promotion requires every existing and new hard gate to pass. Recovery budgets are finite and record the changed variable and reason.

## Frozen regression

- Case A baseline: `CAL-COMMERCIAL-BLIND-001 / RUN-20260827-080000-P4DA`
- Case B baseline: `CAL-PRO-SERVICE-BLIND-001 / RUN-20260827-080100-P4DB`
- Phase 4E writes new external Runs only.
- Case A reuses five source rasters; Case B reuses three ImageGen rasters and two Renderer evidence fixtures.
- ImageGen calls expected: zero.

## Acceptance

Phase 4E succeeds only when the four original reliability categories pass, all old defect fixtures still fail when reintroduced, both Frozen Cases have zero hard blocks, Phase 4D evidence hashes remain unchanged, and the complete repository check passes. Only then may `IMAGE_PRODUCTION_SKILL_V1` be marked `PRODUCTION_READY / FROZEN_FOR_V1`.

## Implementation log

- 2026-08-27: read Phase 4E instruction, current Image Set Production Skill, Renderer, QA and failure policies.
- 2026-08-27: began four-layer determinism audit against the immutable Phase 4D formal/replay PNG pairs.
- 2026-08-27: isolated same-page QA DOM mutation as the compositor-raster root cause; verified that PNG metadata was not responsible and recorded per-page pixel deltas.
- 2026-08-27: implemented the pinned render context, stable seed/input audit, font/image/motion/geometry boundary, fresh-context replay and isolated QA page.
- 2026-08-27: implemented actual-font Text Layout Preflight, protected semantic lines, orphan/collision/shrink blocks, bounded recovery, Copy/Graphic Separation and formal promotion.
- 2026-08-27: retained three failed Phase 4E attempts as evidence. Final frozen Runs `RUN-20260827-141000-P4EA` and `RUN-20260827-141100-P4EB` passed 12/12 formal pages with zero Hard Blocks and zero ImageGen calls; Phase 4D aggregate hashes remained unchanged.
- 2026-08-27: final `CI=true pnpm check` passed with 154 Strict Schemas, 76 test files, 434 tests, zero failures, passing Secret Scan and passing example sanitization.

## Final result

Implementation, frozen regression, full repository check and Secret Scan are complete. `IMAGE_PRODUCTION_SKILL_V1 = PRODUCTION_READY / FROZEN_FOR_V1`.

## Result

Pending.
