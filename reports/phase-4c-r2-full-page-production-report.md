# Phase 4C-R.2 full-page production report

## Status

- Phase: SUCCESS
- Project: `CAL-COMMERCIAL-SPACE-001`
- Content: `C-9001`
- Current binding: `CV-2 / Copy CV-2 / VV-2 / FPV-3`
- Run: `RUN-20260827-100000-C4R2`
- G4: PASSED (`APR-20260827-G4C2`)
- Style Lock: `SLV-2 / ACTIVE`
- Calibration G5: `AWAITING_USER_APPROVAL`
- G5 Approval: NOT_CREATED
- Final Manifest: NOT_CREATED

## Post-run continuity reassessment

The Operator subsequently rejected the set-level asset strategy: Pages 2–6 reused one raster master through crops and layout changes instead of extending the approved visual world with distinct coherent backgrounds. The retained run remains valid technical and historical evidence under its original contract, but it does not satisfy ADR-0054 or the new Image Set Continuity gate. It must not be presented as the future production-quality benchmark. G5 remains `AWAITING_USER_APPROVAL`; no approval or Final Manifest was created.

## Exact first-page binding

- Asset: `AST-CAL-SPACE-001-FPV3-REBIND`
- SHA-256: `616d4eb80d06587f187880ecb9e4a447ce537da937b267b6691436b2672bf274`
- G3: `APR-20260827-G3B1`
- Current QA: `CVQA-CAL-SPACE-001-FPV3`, 21/21 PASS, hard blocks 0
- FPV bytes: preserved; no FPV-4 and no ImageGen call

## Production

- Remaining pages planned/generated: 5/5
- Total pages: 6
- Formal Renderer calls: 8 (5 pages + 3 Contact Sheets)
- ImageGen calls: 0
- Feishu writes: 0
- Master source SHA-256: `225ce45052665ec76310f2e8f192b52bd0145c9d769d0c1ce7e4900a6a3c1f20`

| Page | Intent            | Composition              | Intensity | Editorial | Image/Text | Image | SHA-256                                                            |
| ---- | ----------------- | ------------------------ | --------- | --------: | ---------: | ----: | ------------------------------------------------------------------ |
| P2   | CONTENT_EDITORIAL | EDITORIAL_SPLIT          | MEDIUM    |        92 |         93 |    91 | `523c8e0bf38bf355c0a4e7f054fd372349903bd7eb5895790755ce2f6e83cac4` |
| P3   | DIAGNOSTIC_PAGE   | DIAGNOSTIC_COMPOSITION   | MEDIUM    |        92 |         91 |    90 | `3fe80655a8a32f6e20c35812d0d1f57e4d92c4724bbbc7e0d5097cabbe0ec0b4` |
| P4   | DIAGNOSTIC_PAGE   | EVIDENCE_DOMINANT        | LOW       |        94 |         93 |    92 | `35db794483c33236ca92ed9875e7838e706f1ba483f245e7628de7beb8acc425` |
| P5   | DIAGNOSTIC_PAGE   | IMAGE_DOMINANT           | HIGH      |        93 |         94 |    92 | `c7059eda58a10d286aa1e88ad630f8fae4b93c24058c0a9093ae6978602592d0` |
| P6   | SUMMARY_PAGE      | MULTI_EVIDENCE_EDITORIAL | LOW       |        94 |         92 |    91 | `ba8d6073a5231580800132dbcd27ccfc8d558f9b6e7ac6862a3c0561f7a91046` |

Every page passed all 15 single-page checks; hard blocks are zero. Full, 310×414 and 186×248 assets were inspected.

## Group QA

- Score: 95/100
- Visual intensity: HIGH → MEDIUM → MEDIUM → LOW → HIGH → LOW
- Space Identity Continuity: PASSED
- Group Editorial Rhythm: PASSED
- Group Color Rhythm: PASSED
- Content progression and group completion: PASSED
- Hard blocks: 0

Known aesthetic risks:

- One verified master limits viewpoint diversity while maximizing space-identity certainty.
- P3 diagnoses the absent category-information zone; its frame requires the approved page copy for full meaning.
- P6 intentionally repeats the same-space facade across three evidence strips; Operator may still prefer more differentiated verified crops at G5.

## Recovery evidence

- Page 2 first exposed an orphan line, then a Songti descent/overflow boundary. Failed raster directories were retained.
- Page 5 Section Label contrast progressed from 1.39 to 4.41 before the final asset passed the unchanged 4.5 threshold.
- No failed asset was promoted into the formal production report.

## Integrity

- Immutable artifact replay: PASS
- Historical Calibration artifacts: unchanged
- C-0001 checksum: unchanged
- Production/Industry/Profile/Global rules: unchanged
- Universal template created: false

## Regression

- Command: `PLAYWRIGHT_BROWSERS_PATH=<existing-local-cache> CI=true pnpm check`
- Exit code: 0
- Strict Ajv validation: 152 schemas passed
- Generated contracts: 153 TypeScript files including index; fresh
- Renderer Doctor: READY (`Playwright 1.62.1`, `Chromium 151.0.7922.34`)
- Vitest: 74 test files, 398 tests, 398 passed, 0 failed
- Installed Plugin copy: 67 tools passed
- Plugin package: 67 tools passed
- Plugin validation: 8 Skills passed
- Bootstrap verification: 51 paths passed
- Secret scan: passed
- Example sanitization: passed
