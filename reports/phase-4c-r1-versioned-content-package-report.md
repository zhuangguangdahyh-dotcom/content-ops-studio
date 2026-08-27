# Phase 4C-R.1 Versioned Content Package report

## Result

- Status: `SUCCESS`
- Calibration Project Content Compatibility: `PASSED`
- Content Package: `CREATED`
- Content: `C-9001`
- Content Version: `CV-2`
- Copy Version: `CV-2`
- Page Count: `6`
- Content QA: `PASSED`
- Quality Score: `97`
- Blocking Failures: `0`
- G3: `AWAITING_USER_APPROVAL`
- G3 decision: `PENDING_OPERATOR`
- G3 Approval: `NOT_CREATED`

## Contract isolation

Four strict additive contracts distinguish canonical Production `PRJ-*` references from isolated fictional Calibration `CAL-*` references. The existing Production Content Package remains unchanged. Every new Calibration artifact records `production_workspace_write_eligible=false` and `feishu_writes=0`.

## Package evidence

- Run: `RUN-20260826-223000-C4R1`
- Package ID: `CCP-CAL-COMMERCIAL-SPACE-001-CV2`
- Package SHA-256: `3d81f3dae06285c104067b3dfd653c1cfe9c43f5182942635dbe071e3080f3cb`
- Content Fingerprint: `53cfb132afef348a2cf1aac4a46640129cac3e6caeeee038bc62bd9ce7a43855`
- QA SHA-256: `0372c8e3d7468e8a21cf23c83674accb51bb5ba1f4ce16140698a9bc7468088e`
- G3 Request SHA-256: `d2a918e466410cfcf110992b6d9c0ed464e4f3263132965898357e8004288184`

The exact Operator Draft Copy is retained across six contiguous pages with one Primary Information Task per page. The narrative is Cover entry, problem reframing, category diagnosis, positioning diagnosis, entrance diagnosis and three-check summary. No CTA, metric, case, guaranteed business outcome or seventh page was added.

## QA

All thirteen requested checks passed. Copy Density and Repetition scored 4/5 because the diagnostic pages deliberately share a repeated checking frame and carry moderate supporting-copy density; both remain non-blocking. All other dimensions scored 5/5. The weighted result is 97 with zero Hard Blocks and no Revision Suggestion.

## Legacy integrity

The complete `CV-1 / Copy CV-1 / VV-1 / FPV-2 / APR-20260826-G4A1 / SLV-1` chain was hashed before and after the run and remained byte-identical. It is `PRESERVED_VALID_FOR_CV1_ONLY`. FPV-2 remains at `616d4eb80d06587f187880ecb9e4a447ce537da937b267b6691436b2672bf274`. C-0001 remains at its recorded checksum.

## Idempotency

The first process created exactly three JSON artifacts. An in-process replay and a second independent process reused all three with unchanged hashes. The focused Runtime test verifies that a different payload at the same version fails with `CALIBRATION_CONTENT_ARTIFACT_VERSION_CONFLICT`.

## Scope boundary

- New Visual Plan: `NOT_CREATED`
- New First Page: `NOT_CREATED`
- New G4: `NOT_CREATED`
- SLV-2: `NOT_CREATED`
- Remaining Pages: `0`
- ImageGen Calls: `0`
- Renderer Calls: `0`
- Feishu Writes: `0`

## Validation

- Node: `v24.19.0`
- Strict Schemas: `144`
- Generated TypeScript: `145` files including index
- Focused tests: `27 passed / 0 failed`
- Full suite: `73 test files / 388 tests passed / 0 failed`
- Renderer Doctor: `READY`, Playwright `1.62.1`, Chromium `151.0.7922.34`
- Installed-copy Renderer: `PASSED`
- MCP bundle and isolated Host: `PASSED`
- Secret Scan: `PASSED`
- Example sanitization: `PASSED`
- Final `CI=true pnpm check`: exit `0`

The first sandboxed complete-check attempt reached Renderer Doctor and stopped because Chromium could not launch inside the filesystem sandbox. The full chain then passed in the approved local browser environment without installing a browser or weakening a gate.
