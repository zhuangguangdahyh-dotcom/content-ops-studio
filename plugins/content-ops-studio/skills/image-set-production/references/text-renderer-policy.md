# Text and Renderer policy

The Renderer owns all formal information text. Host-generated backgrounds must not contain readable text that carries meaning. Native text in authorized real evidence may remain. Renderer compositing may not change identity, product form, spatial structure, evidence meaning, approved copy or global direction.

`DETERMINISTIC_RENDER_CONTEXT_V1` pins viewport, DPR, locale, timezone, color scheme, reduced motion, browser version evidence, blocked external network, stable asset ordering and a version-bound render seed. `Date.now`, runtime `new Date`, `Math.random`, random UUIDs, active render scripts, CSS animation and CSS transition declarations are rejected from formal render input. Fonts and embedded images must be ready; animations and transitions are disabled; selected DOM geometry must match for three consecutive samples.

Formal and replay PNGs come from two fresh, identically prepared browser contexts. Input hash, DOM geometry hash, pixel bytes and final file bytes are reported separately. Hiding text, taking background-only screenshots, changing classes or running contrast analysis occurs only in a separate QA context and never between the formal and replay captures.

Text Layout Preflight uses the actual resolved browser font and glyph geometry. It blocks overflow, clipping, unsafe bounds, text/text collision, foreground graphic collision, insufficient breathing room, orphan Han characters, orphan punctuation, protected semantic-unit splits, forced unnatural breaks and font size below the declared minimum. Composite layers use the font metrics of the actual text-bearing descendants rather than an unstyled parent container.

Recovery cannot rewrite copy. It follows: semantic line breaks → region expansion → local composition movement → bounded font reduction → line height → tracking → page composition. Formal PNG promotion occurs only after Copy Fidelity, Text Layout, Typography Spatial Integrity, Breathing Room, final-raster contrast, background complexity, determinism and all existing semantic/visual/file gates pass.

Graphic sequence numbers, lines and markers are outside Copy Fidelity only when they are explicitly marked as graphics, have a visual function and add no semantic claim. A marker that changes meaning or behaves as a label requires approved copy.
