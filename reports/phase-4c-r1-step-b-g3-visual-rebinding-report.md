# Phase 4C-R.1 Step B G3 and visual rebinding report

## Result

- Phase Status: `SUCCESS`
- G3: `PASSED`
- G3 Approval ID: `APR-20260827-G3B1`
- Content: `C-9001`
- Content Version: `CV-2`
- Copy Version: `CV-2`
- Visual Plan: `VV-2`
- Existing Cover Asset Reuse: `PASSED`
- New First Page Version: `FPV-3`
- New First Page Asset: `AST-CAL-SPACE-001-FPV3-REBIND`
- Image SHA-256: `616d4eb80d06587f187880ecb9e4a447ce537da937b267b6691436b2672bf274`
- Image Bytes: `UNCHANGED`
- Current-Version QA: `PASSED`
- New Calibration G4: `AWAITING_USER_APPROVAL`
- New G4 Approval: `NOT_CREATED`
- SLV-2: `NOT_CREATED`
- Remaining Pages: `0`
- Renderer Calls: `0`
- ImageGen Calls: `0`
- Feishu Writes: `0`

## Exact G3 binding

The approval is bound to Package `CCP-CAL-COMMERCIAL-SPACE-001-CV2`, Package SHA-256 `3d81f3dae06285c104067b3dfd653c1cfe9c43f5182942635dbe071e3080f3cb`, Content Fingerprint `53cfb132afef348a2cf1aac4a46640129cac3e6caeeee038bc62bd9ce7a43855`, the 97-point QA report, pending G3 request, Source Run `RUN-20260826-223000-C4R1` and Page Count 6. A different package hash cannot reuse this approval.

## Version allocation and visual plan

The allocator inspected the historical chain and selected `VV-2` after `VV-1`, and `FPV-3` after `FPV-1 / FPV-2`. The six-page Visual Plan binds every current copy snapshot, Page Role, Page Intent, Audience, Painpoint, Content Value and narrative. Universal Calibration systems are active; `SLV-1` is recorded only as `HISTORICAL_CALIBRATION_STYLE_REFERENCE`, with no active Style Lock for CV-2.

## Existing Cover reuse

Page 1's UTF-8 glyph stream is byte-equivalent after layout-whitespace normalization to the approved Cover text. Content Promise, Page Role and Page Intent are equivalent. The actual PNG was reread as 1242 by 1660, and its SHA-256 matches the recorded value. The new logical Asset points to the original immutable PNG path; no copy, save, recompression, Renderer or ImageGen operation occurred.

## Current-version QA

Twenty-one gates were freshly rebound to `CV-2:CV-2:VV-2:FPV-3:<image-sha256>`: Copy Fidelity, Typography Policy, Typography Spatial Integrity, Typography Breathing Room, Raster Text-Background Contrast Integrity, Contrast Stability, Background Complexity, Thumbnail QA, Cover Click Clarity, Semantic Relevance, Painpoint-Scene Congruence, Editorial Spatial, Image-Text Integration, Cover Attention, Visual Mass, Greyscale Hierarchy, Color Intelligence, Typography as Form, Image Quality, Actual Pixel QA and Deterministic Asset Verification. All passed with zero Hard Blocks.

## Artifact hashes

- G3 Approval: `38c2b855cbfa8f848bf01d498e7bcd413238894192baef60b0289196d8e0b24f`
- Visual Plan: `b4ed09f7011507cad5d2c281137c56c84aa041d94ba832fd2da99ad86a665a13`
- Rebound First Page Manifest: `54e65eb249ba75338d6b984bb494146cc31000924fdde4ece4a329786ac8a1a4`
- G4 Review Request: `37710595ae732b8426155ae1a5814ce3b91cbd93c393ab7f383b5c9a4d4e9e97`

The artifacts live under `projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260827-001500-C4B1/content/` in the external Project Home.

## Integrity and idempotency

The complete historical project tree, including the old FPV-2 Manifest, PNG, G4 Approval and `SLV-1`, remained byte-identical. C-0001 retained its recorded checksum. A second independent process reused all four Step B artifacts. Same-version payload drift is rejected with `CALIBRATION_CONTENT_ARTIFACT_VERSION_CONFLICT`.

## Validation

- Strict Schemas: `148`
- Generated TypeScript: `149` files including index
- Focused contract/runtime/migration tests: `32 passed / 0 failed`
- Full suite: `73 test files / 393 tests passed / 0 failed`
- Renderer Doctor: `READY`, Playwright `1.62.1`, Chromium `151.0.7922.34`
- Installed-copy Renderer, MCP bundle and isolated Host: `PASSED`
- Secret Scan and example sanitization: `PASSED`
- Final `CI=true pnpm check`: exit `0`

## Stop boundary

The current G4 decision remains `PENDING_OPERATOR`. No G4 Approval, `SLV-2`, remaining-page image or Production Workspace write exists. Step B stops here.
