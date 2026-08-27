# Phase 4B-R.2.4 formal calibration Cover report

## Status

- Implementation: `SUCCESS`
- Formal Calibration Cover: `PASSED`
- Calibration G4: `AWAITING_USER_APPROVAL`
- Formal Style Lock: `NOT_CREATED`
- Remaining pages: `0`
- Feishu writes: `0`

## Binding and asset

- Project: `CAL-COMMERCIAL-SPACE-001`
- Content: `C-9001`
- Selected direction: `CCC-CAL-SPACE-001-I`
- Attention mode: `TYPE_DOMINANT`
- Versions: `CV-1 / CV-1 / VV-1 / FPV-1`
- Formal asset: `AST-CAL-SPACE-001-FPV1F`
- Run: `RUN-20260826-200000-R24G`
- SHA-256: `e4e55909c01a4e72ce4ea897d9bed14aa62dd2e5836f91a65eebb171d5e6133c`
- Canvas: 1242×1660 PNG
- Thumbnails: 310×414 and 186×248 PNG
- External Project Home: repository-external fictional calibration Home; full paths remain in local run evidence.

Candidate I remained at checksum `cc00f772b018e1b674385c3d899d702221182db9660ad1b6b49c486bacbdbae3`. Its path and bytes were not reused.

## Copy and composition

- Primary Hook: `门头没说清，顾客就走了`
- Supporting Signal: `门店老板先查品类、定位和入口`
- Composition family: `ASYMMETRIC_NEGATIVE_SPACE`
- Asset channel: `AI_GENERATED_VISUAL + Renderer`
- Visual mode: `EDITORIAL_SERIES`

The formal composition uses a real-looking Chinese urban storefront and visible entrance as scene evidence. The title is the dominant mass in natural upper negative space; supporting copy is visibly subordinate. No panel or gradient mask is used.

## Font and mechanical evidence

- Requested: modern Chinese serif
- Title resolved: `Songti SC`, weight 700
- Supporting resolved: `Songti SC`, weight 400
- Font download/embed/synthetic outline: none
- Copy Fidelity: PASS
- Safe Area: PASS
- Overflow: none
- Clipping: none
- Canvas/file: PASS
- Network requests: 0
- Deterministic replay: byte-identical

An earlier internal Run resolved the Supporting Signal to PingFang SC. It was marked `SUPERSEDED_BEFORE_OPERATOR_PRESENTATION`, retained without deletion or overwrite, and was not assigned as the formal Operator-facing FPV.

## Quality result

- Cover Attention: 94
- Click Clarity: 95
- Semantic Relevance: 92
- Painpoint–Scene: 91
- Editorial Spatial: 92
- Image–Text Integration: 92
- Image Quality: 93
- Grayscale structure: 95
- Primary Hook mass: 94
- Hard blocks: 0

All mandatory authenticity, mechanical, typography, spatial, breathing-room, thumbnail, locale, mass, grayscale, color, typography-as-form and actual-pixel gates passed. The 186 thumbnail preserves an immediately recognizable title and storefront entrance.

## Operator-facing rationale

The first visual is the oversized serif statement; the second is the recognizable storefront and doorway. It earns a pause because the hook is legible at feed thumbnail size and the scene is a direct business-identity cue. A shop owner can identify the problem as their own before reading detail, and the Supporting Signal promises a concrete check of category, positioning and entrance.

Current aesthetic risks remain: the minimalist storefront can still suggest premium retail before the copy is read, and the Supporting Signal is intentionally secondary at 186×248. These are not technical failures and remain subject to Operator judgment.

## Integrity and scope

- A–K: checksum snapshot unchanged
- C-0001 FPV-2: checksum remains `b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5`
- Project Visual Profile writes: 0
- Industry Pack writes: 0
- Global Preference writes: 0
- Approval Events: 0
- Git commits/remotes/pushes: 0

The Phase 4B-R.2.4 implementation stops at Operator aesthetic review and does not enter Phase 4C.

## Final offline regression

- Node: `v24.19.0`
- Strict Schemas: 135
- Generated TypeScript: 136 files including index
- Test files: 70
- Tests: 370 passed, 0 failed
- Renderer Doctor: READY, Playwright 1.62.1, Chromium 151.0.7922.34
- Full `CI=true pnpm check`: exit 0
- Secret Scan: PASS
- Example sanitization: PASS
