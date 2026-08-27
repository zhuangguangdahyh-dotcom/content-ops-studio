# Phase 4E Determinism Root-Cause Report

## Finding

Phase 4D replay failure was caused by a QA mutation inside the same Chromium page used for the formal and replay comparison. The harness captured the formal PNG, hid every `.text-layer` to obtain a background-only raster, restored the layer state and captured replay. That mutation rebuilt compositing layers and changed a small number of edge pixels even though content and source assets were unchanged.

The PNGs contain only `IHDR`, `IDAT` and `IEND`, so this is not timestamp or metadata drift. Pixel comparison found real differences concentrated at text, clip-path and graphic edges:

- A-P2: 23 pixels, maximum channel delta 6.
- A-P6: 23 pixels, maximum channel delta 8.
- B-P1: 15 pixels, maximum channel delta 8.
- B-P2: 18 pixels, maximum channel delta 1.
- B-P4: 31 pixels, maximum channel delta 2.
- B-P5: 14 pixels, maximum channel delta 2.
- B-P6: 36 pixels, maximum channel delta 28.

## Correction

The formal and replay captures now use independent, identically configured contexts. No QA mutation occurs between them. A third context performs text hiding and raster analysis. Fonts, embedded images, animations, transitions and DOM geometry are stabilized before capture. Input, geometry, pixel and byte determinism are reported separately.

The final frozen Runs passed all four determinism layers for 12 of 12 pages.
