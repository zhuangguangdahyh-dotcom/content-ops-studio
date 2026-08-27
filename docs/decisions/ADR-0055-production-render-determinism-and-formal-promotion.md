# ADR-0055: Production render determinism and formal promotion

## Status

Accepted — 2026-08-27

## Context

Phase 4D proved that a page can pass semantic and aggregate visual scoring while failing output determinism, real-font layout, local raster contrast or Copy ownership. The failed replay pairs differed by 14–36 real pixels along text, clip-path and graphic compositing edges. The prior harness captured once, hid text for QA on the same page, restored it and then captured replay, forcing a compositor rebuild between the two formal comparisons.

## Decision

Formal and replay captures use fresh, identical contexts and no intervening QA DOM mutation. Final-raster analysis uses a separate context. Formal inputs reject unstable time/random/script/motion sources, stabilize font/image/geometry state and bind a deterministic seed.

Every formal page runs actual-font Text Layout Preflight and Copy/Graphic Separation before promotion. Recovery is bounded and copy-preserving. A candidate is written to a formal path only when all technical, semantic, visual, file and actual-pixel gates are `PASS`; otherwise it remains an immutable attempt.

## Consequences

Tiny but real browser-compositor changes can no longer be hidden as a replay pass. Layout failures are detected before formal write rather than by later Contact Sheet review. Decorative markers no longer corrupt Copy Fidelity. Recovery may change only the failing engineering variable and cannot silently replace the selected strategy or visual system.

Phase 4D remains `FAILED`; Phase 4E evidence is a separate Run and does not rewrite historical results.
