# Phase 4C-R.2 — CV-2 G4, SLV-2 and full remaining-page production

## Objective

Approve the exact `C-9001 / CV-2 / Copy CV-2 / VV-2 / FPV-3` binding, create an active current-version `SLV-2`, produce Pages 2–6, validate the six-page group, and stop at a pending Calibration G5 decision.

## Non-goals

- No FPV regeneration or byte mutation.
- No automatic G5 approval or Final Manifest.
- No Feishu write.
- No C-0001, Production Project, Industry Pack, Project Visual Profile, Global Preference, or universal-template mutation.

## Bound sources

- G3 approval: `APR-20260827-G3B1`.
- Current QA binding: `CVQA-CAL-SPACE-001-FPV3`, 21/21 PASS.
- Cover asset: `AST-CAL-SPACE-001-FPV3-REBIND`.
- Cover checksum: `616d4eb80d06587f187880ecb9e4a447ce537da937b267b6691436b2672bf274`.
- Text-free master checksum: `225ce45052665ec76310f2e8f192b52bd0145c9d769d0c1ce7e4900a6a3c1f20`.

## Production sequence

1. Validate CV-2, G3, VV-2, FPV-3 and all current QA bindings.
2. Create exact G4 approval `APR-20260827-G4C2`.
3. Allocate and create `SLV-2`, preserving historical `SLV-1` for CV-1.
4. Create the six-page Group Editorial Rhythm Plan.
5. Trial Page 2 and Page 3 under `HIGH_CONSISTENCY_RISK`.
6. Continue Pages 4–6 only after the trial passes.
7. Create 1242×1660, 310×414 and 186×248 assets.
8. Run per-page QA, space-identity QA, editorial/color rhythm QA and Group QA.
9. Create three Contact Sheets and a pending Calibration G5 request.
10. Replay immutable writes and run the full repository regression.

## Asset strategy

The approved text-free master is the sole spatial-identity source. Each page changes crop, scale, visual task, composition, reading path and information role. ImageGen calls remain zero because unverified new viewpoints would weaken, not strengthen, the Space Identity contract.

## Implementation log

- Added four additive strict schemas and generated TypeScript declarations.
- Added a deterministic Playwright remaining-page and Contact Sheet renderer.
- Page 2 trial initially exposed an orphan-line defect, then a Songti descent/overflow boundary. Both failed assets were preserved; the final layer adds 8px of real glyph descent breathing room without weakening overflow detection.
- Page 5 actual-pixel QA exposed label contrast of 1.39 and then 4.41. The final local top-value correction passes the unchanged 4.5 low-percentile threshold.
- Final formal assets use Page 2/3/4 recovery set `v4` and Page 5/6 recovery set `v6`; failed recovery assets remain preserved.
- Formal page calls: 5. Contact Sheet calls: 3. ImageGen calls: 0.

## Result

- G4: PASSED.
- Style Lock: `SLV-2 / ACTIVE`.
- Remaining pages: 5/5 generated.
- Single-page QA: PASSED, hard blocks 0.
- Space Identity, Group Editorial Rhythm and Group Color Rhythm: PASSED.
- Group QA: 95/100.
- Calibration G5: `AWAITING_USER_APPROVAL`.
- G5 approval and Final Manifest: NOT_CREATED.

## Remaining decision

The Operator must judge the actual six-page group at G5. The known aesthetic limitation is that one verified master maximizes identity certainty but limits viewpoint diversity; this is not promoted into a universal rule.
