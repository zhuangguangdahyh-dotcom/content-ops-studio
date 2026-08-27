# ADR-0036: Multi-channel image production

- Status: Accepted
- Date: 2026-08-25

## Decision

Image production uses four explicit layers: Universal Production Core, Industry Visual Pack, Project Visual Profile, and Per-Content Visual Plan. The Core owns versioning, copy fidelity, authenticity, authorization, approvals, mechanical QA, quality gates, idempotency, recovery, history, and file integrity. Packs provide versioned industry defaults; Profiles retain only Operator-confirmed project preferences; each content plan chooses the concrete page roles and composition.

The six asset channels are `PROJECT_ASSET`, `AI_GENERATED_VISUAL`, `PROGRAMMATIC_GRAPHIC`, `EVIDENCE_ASSET`, `PURE_TYPOGRAPHY`, and `MIXED_ASSET`. Mixed production must declare the job of every constituent asset. Routing order is safety and evidence boundaries, the current Operator request, approved Style Lock, confirmed Project Visual Profile, confirmed global preference, content evidence need, Industry Pack and overlays, Visual Mode defaults, then Generic fallback.

Visual Mode describes the coherent expression of a set; asset channel describes how an asset is sourced or constructed. They remain many-to-many so an editorial set can legitimately combine generated, typographic, evidence, or programmatic material without falsifying provenance.

## Consequences

Production cannot silently fall back to Mock. Every output retains channel, mode, source, version, checksum, and attempt history.
