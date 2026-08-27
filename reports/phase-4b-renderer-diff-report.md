# Phase 4B Renderer difference report

| Area               | Planned                 | Actual                                                | Impact                                         |
| ------------------ | ----------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| Playwright         | Exact matching packages | 1.62.1 / 1.62.1                                       | No drift                                       |
| Browser            | Managed Chromium only   | 151.0.7922.34, external cache                         | No browser bytes in Plugin Root                |
| Font               | Actual resolved family  | Chromium platform-font inspection reports PingFang SC | Stronger than computed stack text              |
| Determinism        | Same-environment repeat | Two PNG SHA-256 values match                          | No cross-platform claim                        |
| Template           | Closed Cover template   | Three exact Handoff layers; no auxiliary text         | Initial internal deviation corrected before G4 |
| Safe area/tokens   | Exact VV-1              | T96/R84/B96/L84 and approved type/color tokens        | Initial 104px deviation corrected              |
| Programmatic asset | Text-free geometry      | SVG with allowlisted frames/lines/markers             | Not AI generation                              |
| MCP                | +8 tools                | 47 total, 32 read, 15 write                           | Existing names retained                        |
| Feishu             | Bounded pending update  | One mutation, read verify, 0 replay mutations         | No attachment/copy/VV mutation                 |

The main live-contract corrections were: `PROGRAMMATIC` as an additive asset-source enum; SVG represented as an Image asset; user-managed single-select fields written only with explicit permission; Feishu DateTime passed as ISO and compared semantically; Content-table field mapping filtered to avoid duplicate display-name ambiguity. These changes remain narrow and do not affect image providers or remaining-page production.
