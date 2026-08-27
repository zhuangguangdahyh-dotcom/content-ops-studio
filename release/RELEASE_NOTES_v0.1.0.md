# content-ops-studio v0.1.0

The first public open-source release of Content Ops Studio: a local-first, approval-gated content operations Plugin for evidence-backed image-post production.

## Highlights

- Evidence-backed Painpoint research and versioned Content Packages
- G1-G5 human approval gates with checksum- and version-bound decisions
- Dynamic Visual Strategy and cross-industry Image Production
- Multi-channel asset routing, Cover Attention, typography and raster QA
- Image Set Continuity and deterministic Playwright Renderer
- Finalization, delivery packages, integrity verification and versioned archives
- Official Lark CLI / Feishu workspace integration
- Bundled local STDIO MCP with 71 strict tools
- Recovery, journals, checkpoints and idempotent replay

## Requirements

- Node.js `>=24 <25`
- pnpm `11.19.0`
- Host ImageGen capability for generated visuals
- Local Playwright/Chromium capability for Production rendering

## Current limitations

- Feishu final metadata sync is `PARTIAL`.
- Feishu attachment upload is `DEFERRED`.
- Public HTTP MCP, public submission and automatic publishing are not included.
- Generated visuals require the Host ImageGen capability.
- Production rendering requires the pinned local Playwright/Chromium environment and available fonts.

License: MIT. Third-party components retain their original licenses.
