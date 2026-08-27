# Production Render Reliability V1

Phase 4E hardens the existing production pipeline without adding an aesthetic rule, changing a visual strategy or invoking image generation for a healthy frozen source.

## Deterministic boundary

`DETERMINISTIC_RENDER_CONTEXT_V1` pins 1242×1660, DPR 1, `zh-CN`, `Asia/Shanghai`, light color scheme, reduced motion, service-worker blocking, no downloads and no external network. The render seed binds Content, Copy, Visual version, page and stable asset IDs. Runtime time, random and executable DOM sources are rejected.

The formal PNG and deterministic replay are captured from two new equivalent contexts after fonts, embedded images, disabled motion and three consecutive geometry samples are stable. Input, geometry, pixels and file bytes are compared independently. Contrast analysis runs in a third context because hiding text changes Chromium compositing and may alter edge anti-aliasing.

## Text Layout Preflight

Preflight uses the actual browser-resolved font and text-bearing descendant metrics. It blocks overflow, clipping, safe-area failures, text/text and foreground-graphic collisions, insufficient breathing room, orphan Han characters, orphan punctuation, protected semantic-unit splits, unnatural breaks and font size below the page-declared minimum.

Recovery is bounded and ordered: semantic line break, region expansion, local composition adjustment, font reduction above the minimum, line-height adjustment, tracking adjustment, then page-composition revision. Approved copy is normalized and must remain exact.

## Raster contrast and graphics

Final-raster contrast is measured under actual text boxes after all crop, mask, overlay, filter and graphic decisions. It records local distributions and cannot be replaced by an average score. Recovery is local and must preserve the visual-system key.

Purely decorative sequence markers may be graphically rendered and excluded from Copy Fidelity only when they carry no new semantic claim. Functional or semantic labels remain approved copy.

## Formal promotion

Renderer output begins as `ATTEMPT_ONLY`. Formal promotion requires every gate to pass: Mechanical, Copy Fidelity, Text Layout, Typography Spatial Integrity, Breathing Room, Raster Contrast, Background Complexity, Determinism, Semantic Relevance, Page Duty Fit, Image–Text Integration, Image Quality and Actual-Pixel Inspection. `FAIL`, `NOT_RUN` or any hard block leaves the candidate under the attempt path.

G4 and G5 remain independent Operator decisions. Technical promotion never grants aesthetic approval.

## Recovery budgets

- Text Layout: 3 attempts.
- Raster Contrast: 3 attempts.
- Determinism: 2 attempts.

Each attempt records its changed variable and reason. Exhaustion returns `MANUAL_OR_UPSTREAM_REVISION_REQUIRED` and preserves history.

## Frozen evidence

The Phase 4E frozen regression reused the Phase 4D A/B HTML strategies and byte-identical source assets. It invoked ImageGen zero times. The successful final Runs produced 12 formal pages, 12 replay PNGs, 24 thumbnails and two Contact Sheets with zero hard blocks. Aggregate hashes prove both Phase 4D source Runs remained unchanged.
