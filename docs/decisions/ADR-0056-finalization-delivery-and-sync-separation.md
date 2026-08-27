# ADR-0056: Immutable Finalization, approved-only Delivery and separate Workspace sync

- Status: Accepted
- Date: 2026-08-27

## Decision

The Plugin closes a current approved Final Set through `FINALIZATION_AND_DELIVERY_V1`. It re-verifies source bytes, writes or reuses an immutable versioned Final Manifest, derives an environment-independent fingerprint, creates an approved-only Delivery Package, verifies it, and archives that Final Set version. It never calls ImageGen or Renderer.

Finalization state and Workspace synchronization state are independent. `FINALIZED` never implies `SYNC_COMPLETED`; Feishu metadata sync requires a later explicit operation and attachment upload is separately deferred.

Fixture approval is accepted only in isolated TEST Runtime. Production Runtime and Production Workspace reject fixture approvals, and Calibration projects cannot write Production Workspace.

## Consequences

- Same payload and version replays idempotently.
- Same Final Manifest Version with different payload conflicts instead of overwriting.
- Partial delivery/archive failures resume from verified immutable artifacts.
- Post-finalization drift makes the old delivery `SUPERSEDED` but preserves history.
- Dedicated Feishu fields for Final Manifest ID and Final Set Fingerprint remain a reported V1 field gap rather than an implicit Blueprint refactor.
