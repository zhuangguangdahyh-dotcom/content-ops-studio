# Phase 4B-R.2.5 raster text-background contrast report

## Status

- Implementation: `SUCCESS`
- FPV-1 decision: `REVISE`
- Revision classification: `RENDER_ONLY + PAGE_COMPOSITION`
- FPV-1 disposition: `PRESERVED / QUALITY_DEFECT_REFERENCE`
- FPV-2: `GENERATED`
- Calibration G4: `AWAITING_USER_APPROVAL`
- Formal Style Lock: `NOT_CREATED`
- Remaining pages: `0`
- Feishu writes: `0`
- C-0001: `UNCHANGED`

## Binding

- Project: `CAL-COMMERCIAL-SPACE-001`
- Content: `C-9001`
- Versions: `CV-1 / CV-1 / VV-1 / FPV-2`
- Direction: `CCC-CAL-SPACE-001-I`
- Attention mode: `TYPE_DOMINANT`
- Asset: `AST-CAL-SPACE-001-FPV2C`
- Run: `RUN-20260826-204500-R25C`
- FPV-2 SHA-256: `616d4eb80d06587f187880ecb9e4a447ce537da937b267b6691436b2672bf274`
- Canvas: 1242×1660 PNG
- File size: 2,187,756 bytes
- 310 thumbnail SHA-256: `3a0736933db007ad136467851fd60fc62d88adfaa8346e339f910800b3aa29f0`
- 186 thumbnail SHA-256: `8204a2ffdafe1dd22bbad4e774762dd09600247d64dba90b0cbfbe16cc7329ef`

Full external paths and structured evidence remain in the repository-external fictional Project Home.

## FPV-1 regression result

FPV-1 remains at SHA-256 `e4e55909c01a4e72ce4ea897d9bed14aa62dd2e5836f91a65eebb171d5e6133c`. Its new raster result is FAIL:

- Primary median: 15.9589, 10th percentile: 1.9565, worst tile: 1.0355
- Primary low-contrast area: 0.1420, variance: 29.8248, complexity: 0.0215
- Secondary median: 7.2702, 10th percentile: 6.4139, worst tile: 3.1427
- Stable errors include local contrast, low-area, instability, complexity and secondary-layer failure.

This proves the intended regression: former `Grayscale 95 / Cover Attention 94 / Click 95 / Hard Blocks 0` did not protect actual local text readability.

## FPV-2 contrast gates

- Primary Hook Contrast: `PASS`
- Supporting Signal Contrast: `PASS`
- Contrast Stability: `PASS`
- Background Complexity: `PASS`
- Actual Pixel Visual QA: `PASS`
- Hard blocks: `0`

Primary raster evidence:

- foreground: `#101010`, opacity 1, Songti SC 700
- median: 16.9662
- 10th percentile: 14.9752
- worst local tile median: 5.0291
- low-contrast area: 0.0003
- variance: 2.8156
- complexity/edge conflict: 0.0053

Supporting raster evidence:

- foreground: `#111111`, opacity 1, Songti SC 400
- median: 10.7539
- 10th percentile: 9.4324
- worst local tile median: 8.7571
- low-contrast area: 0
- variance: 0.6728
- complexity/edge conflict: 0

The metric is an internal relative-luminance heuristic, not WCAG certification.

## Actual-pixel observations

- 1242×1660: the title remains entirely above the roof edge; important glyphs are not interrupted by tree, roof or shadow structure. Supporting copy is deep black and clear against the facade.
- 310×414: both title and Supporting Signal read without zoom, with the title retaining the first visual mass.
- 186×248: the title remains immediately recognizable and Supporting Signal remains independently legible while visibly secondary.
- No opacity reduction creates hierarchy. No white card, black block or opaque panel was introduced.
- Current aesthetic risk: the restrained upper-right value correction remains visible as a soft sky tonal change, and the minimalist storefront may still signal premium retail before copy is read. These remain Operator aesthetic judgments, not technical failures.

## Mechanical and quality evidence

- Copy Fidelity: PASS
- Safe Area: PASS
- Overflow: none
- Clipping: none
- Canvas/file: PASS
- Resolved fonts: Songti SC 700 / 400
- Network requests: 0
- Deterministic replay: byte-identical
- Cover Attention: 94
- Click Clarity: 95
- Semantic Relevance: 92
- Painpoint Scene: 91
- Editorial Spatial: 93
- Image–Text Integration: 94
- Image Quality: 93

Scores were evaluated only after the contrast hard gates passed and did not create approval.

## Integrity and scope

- FPV-1 checksum before/after: unchanged
- C-0001 FPV-2 checksum: `b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5`
- Painpoint, promise, CV, Copy CV, VV and TYPE_DOMINANT: unchanged
- Universal Default, Editorial Knowledge, Cover Attention Knowledge, Project Profile and Industry Pack: unchanged
- ImageGen calls: 0; the current text-free source was reused
- Approval Events: 0
- Style Locks: 0
- Remaining pages: 0
- Feishu writes: 0

## Validation

- Node: `v24.19.0`
- Strict Schemas: 137
- Generated TypeScript: 138 files including index
- Test files: 71
- Tests: 378 passed, 0 failed
- Focused raster/Renderer tests: 10 passed, 0 failed
- Renderer Doctor: READY, Playwright 1.62.1, Chromium 151.0.7922.34
- Full `CI=true pnpm check` with the existing local Playwright cache: exit 0
- Secret Scan: PASS
- Example sanitization: PASS

The first full-check attempt stopped only because the installed-copy test requires an explicit local `PLAYWRIGHT_BROWSERS_PATH`. Re-running with the existing local cache passed the complete chain; no test or safety gate was bypassed.
