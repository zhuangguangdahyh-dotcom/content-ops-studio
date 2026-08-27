# @content-ops/renderer

Deterministic Chinese layout Adapter contract with capability probing, layout validation, page/set render planning, and inspection. `MockRendererAdapter` is explicitly `MOCK_ONLY`, returns no PNG, and installs or starts no Playwright browser or Chromium.

Phase 4A hands exact Text Layers/tokens/constraints to a future production Renderer but does not render. Planning feasibility is not represented as measured output; Style Lock remains impossible until a real Cover passes G4.

Phase 4B implements `PlaywrightHtmlCssRendererAdapter` for one Cover using `playwright-core@1.62.1` and its matching managed Chromium. It compiles allowlisted, text-free programmatic geometry and exactly three Handoff Text Layers; measures DOM layout, actual platform fonts and safe-area/overflow state; writes a deterministic PNG and closes the isolated browser. Network and arbitrary HTML/CSS/JS/navigation are forbidden. `renderSet` remains deferred.

Phase 4B-R retains this boundary: Host-generated imagery is a background/source asset, never the owner of formal Chinese copy. Direction previews may combine a validated Host source with deterministic Renderer typography and precise structure; the production tool surface still exposes no arbitrary HTML/CSS/JS or browser access.
