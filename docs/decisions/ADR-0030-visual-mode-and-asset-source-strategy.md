# ADR-0030: Visual mode and explicit asset-source strategy

- Status: Accepted
- Date: 2026-08-24

## Context

Different subjects and content structures need different evidence and image behavior. Treating every project as a photo series creates false evidence, unnecessary generation and weak information design.

## Decision

The system supports `SCENE_SERIES`, `EDITORIAL_SERIES`, `PRODUCT_LIFESTYLE`, `EVIDENCE_LED` and `MIXED`. Selection weighs industry, content structure, Evidence, authorized project assets, Project preferences, Platform constraints and text density. Commercial-space content may prefer `SCENE_SERIES`, but this is never hard-coded. Professional services may prefer `EDITORIAL_SERIES`, including an entirely programmatic graphic system with no person or generated photo.

Every page declares one asset-source strategy: Project asset, user reference, historical approved style, Evidence screenshot, generated background, programmatic graphic, licensed asset or no background asset. Evidence screenshots must resolve to an Evidence Record and authorized asset. A visual reference is not factual Evidence. Certificates, official marks, qualifications, screenshots and logos must never be fabricated or assigned an invented permission status.

Image models do not render final Chinese titles, body copy or tables. Those belong to the later deterministic Renderer. `GENERATED_BACKGROUND` and `PROGRAMMATIC_GRAPHIC` are future requirements, not claims that an asset or render exists. When imagery has no information or emotional job, a programmatic graphic is preferred over forced generation.

## Consequences

Asset absence does not block a feasible editorial or programmatic plan. Asset-dependent modes block or use an explicit safe fallback. Phase 4A produces no asset path and calls no image provider.
