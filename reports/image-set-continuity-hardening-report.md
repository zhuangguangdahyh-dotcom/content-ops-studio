# Image set continuity hardening report

## Status

- Implementation: COMPLETE
- Existing C-9001 images regenerated: no
- Existing C-9001 artifacts overwritten: no
- C-9001 G5: AWAITING_USER_APPROVAL
- G5 approval: NOT_CREATED
- Final Manifest: NOT_CREATED
- Feishu writes: 0
- C-0001: unchanged

## Problem confirmed

The prior six-page calibration set used one raster master for every inner page. Layout and crop differences created technical composition diversity but did not provide distinct backgrounds, viewpoints or sufficiently rich same-world visual progression. The old report therefore proved Renderer and QA mechanics, not the newly required full-set production quality.

## Industry-neutral rules migrated

- one visual motif and one visual-system key per set;
- continuity anchors preserve Subject/product/space identity, palette, typography and image treatment;
- page 1 owns click entry, middle pages own value delivery, final page owns useful summary and conversion;
- each page has one distinct semantic responsibility;
- image-dependent pages use distinct source backgrounds and materially different shot signatures;
- layout can vary while typography/color/grid logic remains coherent;
- actual mobile readability outranks decorative whitespace;
- contact-sheet QA examines actual pixels, not Zone labels or metadata;
- hard blocks cannot be offset by aggregate scores.

## Rules deliberately not migrated

- commercial-renovation audience or customer thresholds;
- 200㎡ project scale;
- commercial-space-only scene and material requirements;
- specific business types, camera routes or venue bans;
- public-price restrictions;
- the `弥敦道九号装饰` signature;
- any fixed commercial-space template.

## Implementation

- Core: `planImageSetProductionStrategy` and `evaluateImageSetContinuity`.
- Contracts: `image-set-production-strategy` and `image-set-continuity-report`.
- Skill: mandatory full-set strategy before remaining-page generation and continuity report before G5.
- Policy: explicit separation between visual-system consistency and asset/shot/page difference.
- History: C-9001 retained unchanged and marked as pre-ADR-0054 technical evidence, not a future production benchmark.

## Validation

- Strict Ajv: 154 implemented schemas passed.
- Generated TypeScript: 155 files passed freshness validation.
- Focused contracts/Core/migration suite: 5 test files, 46 tests, all passed.
- Group Quality command: 2 test files, 11 tests, all passed.
- Complete repository suite: 75 test files, 404 tests, all passed.
- Renderer Doctor: READY, Playwright 1.62.1, Chromium 151.0.7922.34.
- Plugin validation: 8 Skills passed.
- MCP/Plugin package: 67 tools passed; deterministic bundle unchanged.
- Secret scan: passed.
- Example sanitization: passed.
- Final `CI=true pnpm check`: exit code 0.
