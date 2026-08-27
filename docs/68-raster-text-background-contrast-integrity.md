# Raster text-background contrast integrity

Phase 4B-R.2.5 adds a hard actual-raster gate for every formal text layer. A page-level grayscale score, declared CSS color or average contrast cannot prove that each glyph remains readable over a real image.

## Gate position

The ordered Cover pipeline is:

`TYPOGRAPHY_SPATIAL_INTEGRITY` → `TEXT_BACKGROUND_CONTRAST_INTEGRITY` → `TEXT_BACKGROUND_CONTRAST_STABILITY` → `BACKGROUND_COMPLEXITY_UNDER_TEXT` → later attention and quality scores.

Any error from these three gates is a hard block. Cover Attention, Click Clarity, Grayscale Hierarchy and Image Quality cannot offset it.

## Per-layer evidence

Every formal `PRIMARY_HOOK`, `SECONDARY_SIGNAL`, `BODY`, `LABEL`, `CAPTION`, `BRAND` and `PAGE_NUMBER` layer records:

- actual text bbox, foreground color and opacity;
- resolved font and weight;
- background luminance and local contrast distributions;
- minimum, 10th-percentile, median and worst-tile contrast;
- low-contrast area ratio, variance, edge conflict and background complexity;
- the authoritative actual-pixel result.

The relative-luminance calculation is an internal Content Ops Studio heuristic. It is not represented as WCAG certification.

## Internal thresholds

Primary Hooks target median contrast ≥5.0 and 10th-percentile contrast ≥3.5. Supporting Signals and body text target median ≥5.5 and 10th-percentile ≥4.0. A failing worst local tile, excessive low-contrast area, unstable variance, background-edge conflict or Operator actual-pixel judgment still blocks a layer whose median passes.

`SECONDARY_TEXT_MUST_REMAIN_LEGIBLE` is a core quality rule. Secondary hierarchy is created with scale, weight, position, spacing, mass and isolation—not by lowering opacity or choosing a foreground close to the background.

## Repair order

The Renderer attempts natural negative space, text-region adjustment, crop, text position, foreground color, local value correction, restrained local mask and only then a visible panel. It must not default to whole-page fog, a white card, a black block or an opaque text panel.

## Calibration regression

Historical FPV-1 is immutable and now serves as `QUALITY_DEFECT_REFERENCE`. The new gate correctly detects the Supporting Signal local-tile failure and the Primary Hook tree/shadow/roof-edge instability that former aggregate scores missed.

FPV-2 reuses the same text-free storefront source. It moves the Primary Hook fully above the roof edge, uses fully opaque deep text for the Supporting Signal and applies only a restrained local upper-sky value correction. Full, 310×414 and 186×248 PNGs pass the raster gates and deterministic replay. This creates G4 eligibility only; G4 remains `AWAITING_USER_APPROVAL`.
