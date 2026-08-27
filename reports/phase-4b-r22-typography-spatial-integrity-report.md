# Phase 4B-R.2.2 typography spatial integrity report

## Status

- Phase 4B-R.2.2 Implementation Status: `SUCCESS`
- Typography Spatial Integrity: `PASSED`
- Typography Breathing Room: `PASSED`
- F Regression Detection: `PASSED`
- Calibration Selection: `AWAITING_USER_SELECTION`
- Formal FPV / G4 / Style Lock / Feishu writes: `0 / 0 / 0 / 0`

## Contract and runtime result

The pre-score gate now records real text, container and graphic geometry; resolved family, size, weight, line height and letter spacing; minimum text-layer gap; relative title-to-secondary ratio; and separate mathematical and actual-pixel results. Visual Quality scoring cannot run until both typography gates pass.

Stable failures are `TYPOGRAPHY_SPATIAL_INTEGRITY_BLOCKED`, `TEXT_TEXT_OVERLAP`, `TEXT_GRAPHIC_OCCLUSION`, `TEXT_REGION_COLLISION`, `INSUFFICIENT_CONTAINER_PADDING`, `LINE_GLYPH_COLLISION`, `FORCED_TRACKING_DISTORTION`, `ORPHAN_CHARACTER_BREAK`, `COMPETING_PRIMARY_TEXT`, `DENSITY_FORCED_COMPRESSION`, and `TYPOGRAPHIC_BREATHING_ROOM_WEAK`.

Recovery preserves approved copy. A cover that cannot fit returns to Cover Copy Revision; a content page returns to Page Composition Revision. The Renderer does not silently shrink, track, squeeze or overlap text.

## Historical evidence

Candidate F remains immutable at SHA-256 `d418af622f1c0d6930418b55bf419b20a6e62298454643b26684f5887df46791`. Its historical Typography Policy result remains PASS, while the new independent spatial report correctly blocks it with `TEXT_REGION_COLLISION`. Candidate D is a positive reference only for title integrity, hierarchy and mobile legibility. Candidate E is a positive reference only for evidence-bound markers. Neither becomes a reusable template.

## Round 3 result

G and H use the same approved calibration copy and Renderer-owned Chinese text, but different Host assets, composition families, text regions, asset structures and reading paths. Both passed full-size and true-size actual-pixel inspection. Candidate-set diversity is `91`, above the required `85`.

The complete, unsanitized local evidence remains in the repository-external fictional Project Home under run `RUN-20260826-164000-CR06`. The repository contains contracts, tests and sanitized reporting only.

## Isolation

This phase did not select a direction, revise C-0001, create a formal asset or write a current-set preference to Project Visual Profile, Industry Visual Pack or Global User Preference. No Feishu operation ran.

## Validation

- Node: `v24.19.0`
- Strict Ajv: 124 Schemas passed
- Generated TypeScript: 125 files including index; fresh
- Focused typography-spatial suite: 1 file, 22 passed, 0 failed
- Complete `CI=true pnpm check`: exit 0
- Complete tests: 67 files, 331 passed, 0 failed
- Renderer Doctor and installed-copy Renderer: passed
- Plugin/MCP/bootstrap validation: passed
- Secret Scan: passed
- Example Sanitization: passed

The baseline-relative aggregate and sanitized file inventory are in `reports/phase-4b-r22-working-tree-change-report.md`.
