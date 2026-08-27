# Phase 4B-R.2.5 raster text-background contrast integrity

## Objective

Record an explicit `REVISE` decision for the current calibration FPV-1, preserve it as a `QUALITY_DEFECT_REFERENCE`, add a hard raster-local contrast and background-complexity gate after Typography Spatial Integrity and before Cover Attention, then produce a new FPV-2 from the existing text-free storefront source when the revised composition passes every gate.

## Non-goals

Do not change the Painpoint, Cover Promise, `TYPE_DOMINANT` direction, CV-1, Copy CV-1, VV-1, C-0001, A–K, Universal Default, Editorial Design Knowledge, Cover Attention Knowledge, Project Visual Profile or Industry Pack. Do not create an approval, formal Style Lock, remaining page, Feishu write or Phase 4C work.

## Starting evidence

- Formal Run: `RUN-20260826-200000-R24G`
- FPV-1 asset: `AST-CAL-SPACE-001-FPV1F`
- FPV-1 checksum: `e4e55909c01a4e72ce4ea897d9bed14aa62dd2e5836f91a65eebb171d5e6133c`
- Existing state: `CALIBRATION_G4 / AWAITING_USER_APPROVAL`
- Operator result: `REVISE`, classified `RENDER_ONLY + PAGE_COMPOSITION`
- Node: `v24.19.0`
- Prior complete regression: 135 strict Schemas, 70 test files, 370 tests passed.

## Raster measurement model

For every formal text layer, retain the foreground color, actual DOM bbox, resolved font and weight, background-region statistics, luminance distribution, local contrast distribution, minimum and median contrast, low-percentile contrast, low-contrast area ratio, contrast variance, edge-conflict ratio, background complexity and actual-pixel result.

The checker uses an internal relative-luminance contrast heuristic. It is not represented as WCAG certification. Primary text targets median >=5.0 and low-percentile >=3.5; secondary/body text targets median >=5.5 and low-percentile >=4.0. Actual pixel inspection remains authoritative.

## Gate order

Mechanical QA → Typography Policy → Typography Spatial Integrity → Text Background Contrast Integrity → Contrast Stability → Background Complexity → Breathing Room → Thumbnail QA → Click/Semantic/Painpoint/Locale/Editorial/Integration → Cover Attention/Visual Mass/Greyscale/Color/Typography as Form/Image Quality → actual-pixel inspection → deterministic replay.

Any contrast, stability or complexity error is a hard block and cannot be offset by aggregate scores.

## Revision strategy

Reuse the existing text-free storefront source first. Keep the Primary Hook at Cover scale, move the text into a more stable natural negative-space region, coordinate crop and line shape, darken Supporting Signal without opacity reduction and use only the smallest necessary local value correction. A visible panel remains the final fallback and is not the default plan. ImageGen is not called unless this sequence cannot produce a stable region.

## Versioning and recovery

FPV-1 remains byte-for-byte immutable. Failed FPV-2 render attempts are retained under sibling attempt directories. The accepted revision uses FPV-2 with a new asset ID, checksum and Run. A checksum conflict or existing different bytes stops rather than overwrites.

## Tests

Add regression coverage for the historical FPV-1 secondary local-contrast failure and primary background-complexity risk; per-layer threshold failures; unstable average-pass regions; edge conflicts; background complexity; secondary opacity/contrast hierarchy; gate order; FPV-2 pass; pending G4; zero downstream writes; C-0001/A–K immutability and deterministic replay. Run the complete Node 24 `pnpm check` and Secret Scan.

## Implementation record

- 2026-08-26: Read the full R.2.5 instruction and verified the immutable FPV-1 checksum.
- 2026-08-26: Confirmed the task is a Renderer/page-composition revision; existing source reuse is required before any ImageGen call.
- 2026-08-26: Added two strict additive Schemas, generated declarations/fixtures and migration coverage.
- 2026-08-26: Implemented per-layer raster luminance/contrast distributions, worst-local-tile, stability, edge-conflict and background-complexity hard gates.
- 2026-08-26: Re-measured immutable FPV-1. Primary 10th-percentile 1.9565 and worst tile 1.0355 exposed its instability; Secondary worst tile 3.1427 exposed the average-pass local failure.
- 2026-08-26: Rendered iterative temporary revisions. The first candidate failed title overflow; the second failed stability because the title still crossed the roof edge. Both remained temporary and were not assigned a formal version.
- 2026-08-26: Reused the existing text-free source and accepted FPV-2 only after moving the title above the roof, deepening the fully opaque Supporting Signal and applying a restrained local upper-sky value correction.
- 2026-08-26: Inspected 1242×1660, 310×414 and 186×248 actual pixels; both text layers, stability and complexity passed with zero hard blocks.
- 2026-08-26: Persisted the FPV-1 REVISE decision and both raster reports in new external Run `RUN-20260826-204500-R25C`; read verification preserved FPV-1 and C-0001 checksums.
- 2026-08-26: Full Node 24 regression passed 71 test files / 378 tests. The initial installed-copy run lacked its required Playwright cache environment; the exact rerun with the existing cache passed, including Secret Scan and sanitization.

## Final result

`SUCCESS`. FPV-1 is preserved as `QUALITY_DEFECT_REFERENCE`; FPV-2 is generated with deterministic full/310/186 evidence and zero contrast hard blocks. Calibration G4 remains `AWAITING_USER_APPROVAL`; no Style Lock, remaining page, Feishu write, preference mutation or C-0001 change was created.

## Unresolved issue

Operator aesthetic approval remains intentionally outside this phase. The restrained local upper-sky value correction and the storefront's premium-retail association remain visible aesthetic risks for G4 judgment.
