# ADR-0044: Cover conversion and semantic QA

- Status: Accepted
- Date: 2026-08-26

## Context

Page-one content copy and mechanically valid rendering do not prove that a small Xiaohongshu cover can filter the intended Audience or communicate a click reason. A visually polished but unrelated decorative background can also pass generic image quality while failing industry and content relevance.

## Decision

Add a Cover Conversion layer between approved content and visual planning. Keep publish title, primary hook, secondary line, supporting copy, and page-one copy distinct and version-bound. Resolve Account Goal and Cover Objective independently. Generic lead-generation context blocks before cover direction generation.

Require real 310×414 and 186×248 Renderer outputs, a 100-point Click Clarity report, and a 100-point Semantic Relevance report. Lead generation requires 85 and 80 respectively, with no hard block. Decorative-only backgrounds are not valid lead-generation cover backgrounds. Abstract visuals are allowed only when content-grounded and Project-compatible.

Extend First-Page Review additively with `revision_routes`; retain the legacy primary classification. A G4 REVISE preserves the reviewed FPV and may route to more than one bounded specialist. It never creates Style Lock.

Global visual preferences are immutable versions of explicitly confirmed global rules. They do not mutate Industry Packs or silently absorb current-set production feedback.

## Consequences

Content Creation produces a Cover Copy Package for G3. Visual Planning consumes it and declares cover conversion and semantic choices. Image Production renders both true-size thumbnails and keeps passing results pending Operator selection. The MCP surface adds only six narrow cover tools. The Xiaohongshu Platform Pack advances to 1.1.0 while historical 1.0.0 remains loadable.

Tests cover generic-context blocking, copy density, thumbnail legibility, click clarity, semantic hard blocks, multi-route REVISE, global preference immutability, calibration diversity, and historical Platform Pack loading.
