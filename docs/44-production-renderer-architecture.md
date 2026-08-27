# Production Renderer architecture

Phase 4B adds `PLAYWRIGHT_HTML_CSS`, a deterministic first-page Renderer implemented in `packages/renderer`. It accepts only a version-bound First-Page Handoff, closed template data and plain text. It emits a text-free programmatic SVG, controlled HTML/CSS, one PNG and browser-measured evidence under the external Project Home.

`playwright-core@1.62.1` is the Runtime library. The matching `playwright@1.62.1` package is used only for explicit Chromium setup. Chromium and fonts are not bundled. Browser setup never occurs on Server startup or a normal render call, and Production never falls back to `MockRendererAdapter`.

The Renderer creates a fresh context with a fixed 1242×1660 viewport, scale 1, `zh-CN`, `Asia/Shanghai`, light color scheme, reduced motion, no downloads, blocked service workers and no stored profile. CSP and request routing prevent network access. The Page, Context and Browser are closed after every run.

`renderPage` is implemented for page 1 only. `renderSet` returns `REMAINING_PAGE_PRODUCTION_DEFERRED`; pages 2–6 remain Phase 4C work.
