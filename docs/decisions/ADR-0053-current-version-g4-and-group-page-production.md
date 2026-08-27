# ADR-0053: Current-version G4 binding and deterministic group-page production

- Status: Accepted
- Date: 2026-08-27

## Context

The calibration cover pixels were valid, but CV-2 required a new logical FPV binding, a new G4 decision and a current-version Style Lock before Pages 2–6 could be produced. Commercial-space identity also made five unrelated generated viewpoints unsafe.

## Decision

1. G4 approvals bind the full CV, Copy, VV, FPV, Asset ID, checksum, source run, G3 and current-version QA chain.
2. Style Lock versions are ordinal and additive; SLV-1 remains historical and SLV-2 is active only for CV-2.
3. High-consistency-risk groups must pass a representative two-page trial before completing the set.
4. A checksum-verified text-free master may supply multiple semantically distinct crops. New viewpoints are not required when their identity cannot be verified.
5. All formal Chinese remains in deterministic Renderer layers.
6. Raster contrast, overflow and hard blocks are non-compensable.
7. Group completion creates a pending G5 request only.

## Consequences

Identity is auditable and recovery is non-destructive. Viewpoint diversity is intentionally narrower when identity proof is stronger. Failed attempts remain available, and successful formal assets are immutable and reproducible.
