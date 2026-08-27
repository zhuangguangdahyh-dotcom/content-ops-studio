# ADR-0041: Industry visual pack architecture

- Status: Accepted
- Date: 2026-08-25

## Decision

Industry Visual Packs are versioned decision defaults, not fixed templates. They rank Visual Modes and asset channels, define identity invariants, hard blocks, specialized checks, consistency, fallbacks, recommended questions, prohibited representations, overlays, and limitations. Visual Mode remains independent of the Pack.

The initial packs are Generic, Commercial Space and Hospitality, Professional Services, Personal IP and Creator, Medical Aesthetics and Health, Product and Consumer, and Food Beverage and Lifestyle. Optional overlays cover person continuity, product identity, space identity, evidence authenticity, regulated claims, before/after integrity, and brand-asset integrity.

A plan binds exact Pack and overlay versions. New Pack versions do not mutate approved plans, first pages, Style Locks, or historic output. Project feedback creates project-scoped candidates; it never writes back to a shared Pack automatically.
