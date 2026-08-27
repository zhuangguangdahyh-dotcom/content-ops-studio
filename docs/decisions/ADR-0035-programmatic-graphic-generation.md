# ADR-0035: Programmatic Graphic Generation

Status: Accepted. Date: 2026-08-25.

## Decision

`PROGRAMMATIC_GRAPHIC` is deterministic local construction from allowlisted geometric primitives. It is not AI image generation. It may produce a text-free SVG or controlled HTML graphic layer but never carries formal informational Chinese text; all official copy remains Renderer-owned Text Layers.

Allowed primitives are rectangles, rounded cards, lines, dividers, circles, number markers, brackets, connectors, grids, frames and accent blocks. Arbitrary HTML/CSS/JavaScript, URLs, logos, certificates, screenshots, official UI and random decoration are forbidden. This is a suitable asset strategy for the current restrained `EDITORIAL_SERIES`; Generated Background remains unsupported.
