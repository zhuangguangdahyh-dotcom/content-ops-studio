# ADR-0051: Calibration Content project reference and version repair

- Status: Accepted
- Date: 2026-08-26

## Context

The fictional Universal Visual Calibration object uses a `CAL-*` project identifier. Canonical Production Content contracts intentionally accept only `PRJ-*`, and the existing Cover chain was created before a complete Content Package existed. Pages 2–6 are new semantic content and cannot be backfilled into the old `CV-1 / Copy CV-1` binding.

## Decision

Keep canonical Production identifiers unchanged. Add a discriminated Project Reference with bounded `PRODUCTION_PROJECT / PRJ-*` and `CALIBRATION_PROJECT / CAL-*` branches. Calibration Content uses independent wrapper contracts with `production_workspace_write_eligible=false`; these wrappers cannot authorize a Production Workspace or Feishu write.

Create the complete six-page package as `CV-2 / Copy CV-2`. Preserve the old `CV-1 / Copy CV-1 / VV-1 / FPV-2 / G4 / SLV-1` chain as immutable historical evidence valid only for CV-1. A new version-bound G3 is mandatory before Visual Planning. Any future byte reuse of the old PNG requires a new logical asset binding, current-version QA and a new explicit G4.

## Consequences

- No Production project-ID pattern is widened.
- No CAL project becomes eligible for Production Workspace writes.
- Same-version different-payload repair is rejected.
- The old G4 and Style Lock never authorize CV-2.
- The additive wrapper schemas are a MINOR contract addition and require no mutation of existing data.
