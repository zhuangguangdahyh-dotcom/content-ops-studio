# ADR-0049: Hard-gate formal text against actual raster backgrounds

- Status: Accepted
- Date: 2026-08-26

## Context

The first formal calibration Cover passed grayscale, attention, thumbnail and image-quality scores, yet the Operator correctly identified that its Supporting Signal merged with the facade and parts of the Primary Hook crossed unstable tree, shadow and roof-edge regions. Page-level and average metrics produced a false positive.

## Decision

Every formal text layer is measured against the actual raster beneath its bbox after Typography Spatial Integrity and before Cover Attention. Integrity, stability and background-complexity failures are hard blocks. The checker retains distributions, worst local tiles and actual-pixel observations; Operator visual judgment remains authoritative over numeric thresholds.

Secondary hierarchy may not be manufactured through low opacity or low contrast. Renderer repair follows the least-invasive order from natural negative space through restrained local value correction, with a visible panel only as the final fallback.

A REVISE decision preserves the rejected asset as a quality-defect reference. It does not create a long-term preference, mutate a visual pack or authorize Style Lock and remaining-page production.

## Consequences

- FPV-1 remains byte-for-byte preserved and its earlier scores remain historical evidence, not current validity.
- The gate can reject an average-pass layer when the worst local region fails.
- FPV-2 uses the existing source and Renderer-owned copy; no ImageGen call was needed.
- Two additive strict Schemas retain revision and raster evidence.
- Calibration G4 remains an explicit Operator decision after all technical gates pass.
