# Phase 4B-R.2.6 Calibration G4 approval report

## Result

- Implementation: `SUCCESS`
- Calibration G4: `PASSED`
- Calibration Style Lock: `CREATED`
- Style Lock Version: `SLV-1`
- Universal Visual Calibration: `CALIBRATION_VALIDATED_V1`
- Remaining-page production eligibility: `ELIGIBLE`
- Remaining pages created: `0`
- Image-generation calls: `0`
- Feishu writes: `0`
- Phase 4C: `NOT_STARTED`

## Exact approval binding

- Project: `CAL-COMMERCIAL-SPACE-001`
- Content: `C-9001`
- Versions: `CV-1 / CV-1 / VV-1 / FPV-2`
- Asset: `AST-CAL-SPACE-001-FPV2C`
- SHA-256: `616d4eb80d06587f187880ecb9e4a447ce537da937b267b6691436b2672bf274`
- Attention Mode: `TYPE_DOMINANT`
- Formal Run: `RUN-20260826-204500-R25C`
- Approval Run: `RUN-20260826-213000-G4A1`
- Approval: `APR-20260826-G4A1`
- Approval evidence: `CG4A-CAL-SPACE-001-FPV2`
- Decision: `APPROVE`

The approval target version contains both content versions, VV, FPV and the complete raster checksum. It binds seven PASS artifacts: formal Cover, raster contrast, full PNG, deterministic replay, 310 thumbnail, 186 thumbnail and background analysis. Hard blocks and requested changes are empty.

The Operator accepted two non-blocking observations: a slight premium-retail association before copy is read, and the restrained upper-right local value correction. Neither is converted into a long-term preference.

## State and integrity

- FPV-1 remains `PRESERVED / QUALITY_DEFECT_REFERENCE` at its original checksum.
- FPV-2 and deterministic replay remain byte-identical at the approved checksum.
- Historical A–K assets, failed Runs, QA and checksums were hashed before and after approval and remained unchanged.
- C-0001 remained byte-identical at its recorded checksum.
- No PNG or other image file exists in the approval Run.
- Project Visual Profile, Industry Visual Pack and Universal Default template were not mutated.

## Idempotency

The approval harness performs an in-process state replay and immutable artifact replay. A second independent process replay reused all six formal JSON artifacts and the approved Runtime state. No duplicate Approval Event, Style Lock or validation record was created.

Structured evidence is stored in the fictional repository-external Project Home. Repository artifacts contain no secret or Feishu identifier.

## Validation

- Node: `v24.19.0`
- pnpm: `11.19.0`
- Strict Schemas: `140`
- Generated TypeScript: `141` files including index
- Focused Calibration G4 / First-page Runtime: `5 passed, 0 failed`
- Immutable artifact Runtime: `3 passed, 0 failed`
- Full suite: `72 test files / 383 tests passed / 0 failed`
- Renderer Doctor: `READY`, Playwright `1.62.1`, Chromium `151.0.7922.34`
- Installed-copy Renderer: `PASSED`
- Plugin package / MCP Host: `PASSED`
- Secret Scan: `PASSED`
- Example sanitization: `PASSED`
- Final `CI=true pnpm check`: exit `0`

The first complete-check attempt stopped at formatting because generated fixtures require formatting after regeneration. The next sandboxed attempt reached Renderer Doctor but could not launch Chromium under filesystem sandboxing. After formatting the generated fixtures and running in the approved local browser environment, the entire chain passed without disabling or bypassing any test.
