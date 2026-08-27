# Calibration remaining-page production

> Historical calibration note: the retained Phase 4C-R.2 run predates ADR-0054. Its same-master crop strategy remains immutable evidence, but it is not an acceptable production baseline for a future image-dependent full set and cannot satisfy the new Image Set Continuity contract.

Phase 4C production is current-version-bound. A remaining-page run is eligible only when G3, Visual Plan, first-page asset, current-version QA, G4 and Style Lock all identify the same Project, Content, CV, Copy Version, VV, FPV, Asset ID and checksum.

## High-consistency-risk protocol

Commercial-space sets first render two representative pages with materially different tasks. Both pages must pass deterministic replay, copy fidelity, font resolution, safe area, overflow, clipping, network isolation and raster text/background contrast before the run may continue.

## Asset identity

Identity continuity and asset diversity are separate requirements. A future image-dependent full set must preserve the same Subject/product/space world while using distinct verified source backgrounds and materially different shots or spatial nodes. Different crops, scales, overlays, compositions, information roles or reading paths do not make one raster master into multiple backgrounds.

Reuse is allowed only when the page explicitly declares `REUSE_WITH_MATERIAL_TRANSFORMATION`, the channel requires the same evidence source, and the new page reveals materially different evidence. Pure Typography and precise Programmatic Graphic pages declare `NO_RASTER_BACKGROUND`. When enough coherent assets cannot be verified, production stops instead of fabricating identity.

## Quality gates

Each inner page has 15 non-compensable checks. Group acceptance separately checks visual-system coherence, space identity, page difference, editorial rhythm, typography, color, image treatment, content progression and completion. Any hard block prevents G5 creation.

## Recovery

Failed raster attempts are preserved. Recovery writes to a new immutable output directory and retains the unchanged threshold that exposed the failure. A successful run records the formal assets only, while failure evidence remains available for audit.

## G5 boundary

A passing group creates only an `AWAITING_USER_APPROVAL` request. It does not create a G5 approval or Final Manifest and it does not write Feishu.
