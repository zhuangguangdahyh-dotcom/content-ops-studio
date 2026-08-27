# Image production pipeline

The production design has two stages:

1. A future image model generates a text-free visual background: scene, subject, product, illustration, light, material, and photographic mood.
2. A deterministic Renderer places official Chinese information: title, body, helper text, fonts, sizes, line spacing, safe margins, masks, gradients, glass panels, cards, page numbers, logos, and final PNG output.

The first-page sequence is copy approved → visual plan → first-page background → deterministic layout → G4 approval → Style Lock → remaining pages.

The image model is not responsible for official informational Chinese copy. The Renderer cannot shrink text indefinitely to force overflow into a layout.

Phase 1B expresses the pipeline as Visual System → Page Visual Plans → first-page Generation Manifest → G4 → Style Lock → remaining Generation Manifests → Render Reports → four-layer QA → G5 → Final Manifest. Every edge is version-bound; page paths are project-relative and formal assets carry SHA-256.

`ImageGenerationAdapter` provides capability probing, request validation, generation/regeneration, inspection, and cancellation. Its mock and prompt-only implementations do not call a provider or produce image bytes. `RendererAdapter` provides layout validation, page/set rendering, and inspection; `MockRendererAdapter` returns `RENDER_PENDING` and no PNG. No `HtmlCssRendererAdapter`, Playwright browser, Chromium, or production rendering is implemented.

Phase 4A now supplies the formal Visual Handoff Package immediately before this production pipeline. It generates no asset. The next phase must execute only page 1, obtain G4, then create Style Lock; formal Chinese remains a Renderer layer and image models handle only non-informational assets.

# First-page production boundary

Phase 4B-R implements the six-channel pipeline and Host-native ImageGen bridge while retaining deterministic Renderer text. New projects compare real direction candidates first. Selected directions later produce a formal first page and stop at G4; only an approved Style Lock permits remaining-page production. Group QA is implemented as a contract/core path, while current C-0001 deliberately stops before formal production.
