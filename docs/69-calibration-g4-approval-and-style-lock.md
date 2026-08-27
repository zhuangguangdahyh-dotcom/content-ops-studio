# Calibration G4 approval and Style Lock

Calibration G4 is an explicit Operator decision over one already-verified calibration Cover. It does not render, revise or replace that Cover.

The formal approval target is the complete tuple `Project / Content / CV / Copy Version / VV / FPV / Asset ID / SHA-256 / formal Run`. The approval envelope also binds the formal Cover report, actual-raster contrast report, full PNG, deterministic replay, both thumbnails and background-analysis raster. Any mismatch or Hard Block prevents approval.

An approved Calibration G4 creates two linked records:

- the generic G4 state-machine Style Lock, which establishes approval authority and remaining-page eligibility;
- Calibration Style Lock V1, which separates Cover rules, group-shared rules, allowed content-page variation and prohibited deviation.

The Calibration lock preserves design and QA logic. It does not turn the approved Cover's coordinates, color, storefront, title position, crop or `TYPE_DOMINANT` Attention Mode into a Universal template.

`CALIBRATION_VALIDATED_V1` applies only to the named rule, knowledge, QA and decision systems. It does not mutate Project Visual Profile, Industry Visual Pack or Universal Default templates.

Approval artifacts are immutable. The same command reuses byte-identical JSON and the approved Runtime state; a different payload at the same version returns a conflict. Approval makes remaining-page production `ELIGIBLE`, but it does not itself generate remaining pages.
