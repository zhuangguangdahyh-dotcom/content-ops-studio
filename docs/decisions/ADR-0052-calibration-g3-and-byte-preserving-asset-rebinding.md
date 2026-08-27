# ADR-0052: Calibration G3 and byte-preserving asset rebinding

- Status: Accepted
- Date: 2026-08-27

## Context

The complete `C-9001 CV-2 / Copy CV-2` package has been explicitly approved at G3. Its Page 1 is textually and semantically equivalent to the previously approved CV-1 Cover, while Pages 2–6 are new and remain unproduced. Rewriting the old FPV-2 binding would destroy history; rerendering the same Cover would create unnecessary pixel drift.

## Decision

Keep the entire CV-1 chain immutable. Create a new Calibration G3 Approval bound to the exact Step A artifacts. Allocate the next Visual Plan and First Page versions. When strict eligibility passes, create a new logical `REUSED_VERIFIED_ASSET` binding that points to the original PNG and checksum without copying, recompressing or modifying the file. Attach a new current-version QA binding and require a new explicit G4 decision.

## Consequences

- Historical FPV-2 remains valid only for CV-1 and is never rebound in place.
- Identical pixels do not inherit historical approval authority.
- The current CV-2 First Page receives a new FPV and Asset identity.
- `SLV-1` is a historical reference only; it does not authorize CV-2 remaining pages.
- A different package hash, copy, role, intent, canvas or asset checksum blocks reuse.
- Calibration artifacts remain in the external Project Home and cannot authorize Production Workspace or Feishu writes.
