# Phase 4B-R.2.6 Calibration G4 approval

## Objective

Execute the Operator's explicit Calibration G4 `APPROVE` against the already-produced FPV-2, create Calibration Style Lock V1, mark six rule/knowledge/QA capabilities `CALIBRATION_VALIDATED_V1`, and make remaining-page production eligible without generating any remaining page.

## Preconditions

- Project: `CAL-COMMERCIAL-SPACE-001`
- Content: `C-9001`
- Versions: `CV-1 / CV-1 / VV-1 / FPV-2`
- Asset: `AST-CAL-SPACE-001-FPV2C`
- SHA-256: `616d4eb80d06587f187880ecb9e4a447ce537da937b267b6691436b2672bf274`
- Formal Run: `RUN-20260826-204500-R25C`
- Current G4: `AWAITING_USER_APPROVAL`
- Raster contrast result: PASS with zero hard blocks.

Any binding, checksum, QA, state or historical-integrity mismatch stops with conflict. FPV-2 is read-only and must not be regenerated.

## Contracts

Add strict, independent contracts for the Calibration G4 approval envelope, Calibration Style Lock V1 and Universal Visual Calibration validation. Retain the generic `ApprovalEvent` as the state-machine authority. All additions are minor contract additions with generated types, fixtures and migration tests.

## Approval binding

The approval binds Project, Content, CV, Copy Version, VV, FPV, Asset ID, complete checksum, formal Run and every current formal QA artifact. The decision is `APPROVE`, requested changes are empty and the two known aesthetic risks are accepted only as non-blocking current-calibration observations.

## Style Lock boundary

Calibration Style Lock V1 contains four explicit groups: Cover locked rules, group-shared rules, content-page allowed variations and prohibited deviations. It locks design/QA logic, not the current coordinates, storefront, crop, color, title position or `TYPE_DOMINANT` as a Universal template.

## Calibration validation boundary

The six named systems become `CALIBRATION_VALIDATED_V1` only as rule, knowledge, QA and decision systems. No Project Visual Profile, Industry Pack, Universal Default template or long-term layout preference is mutated.

## Idempotency and recovery

Approval artifacts use immutable write-once-or-reuse semantics. The same input replays to the same files and hashes with no duplicate event or Style Lock. A different payload at an existing target returns a version conflict. Every write is followed by read verification.

## Scope exclusions

Do not render or generate an image, create FPV-3, alter FPV-1/FPV-2/A–K/failed Runs, generate remaining pages, write Feishu, change C-0001 or enter Phase 4C.

## Tests

Add contract, state binding, Style Lock separation, non-template scope, stale-checksum, hard-block, write-conflict and replay coverage. Run the complete Node 24 `pnpm check`, Secret Scan and example sanitization.

## Implementation record

- 2026-08-26: Verified the explicit Operator `APPROVE` request targets the current FPV-2 and is not a repeat render request.
- 2026-08-26: Verified FPV-2 and deterministic replay checksums are identical; current review is pending with no Approval Event, Style Lock, remaining page or Feishu write.
- 2026-08-26: Added three strict Calibration contracts, immutable write-once-or-reuse support and focused stale-binding/Hard-Block/non-template/replay tests.
- 2026-08-26: Widened First-page Review and Style Lock project references only to admit isolated `CAL-*` projects; all approval and checksum invariants remain unchanged.
- 2026-08-26: Executed `APR-20260826-G4A1` against the exact formal target and seven current QA artifacts. The generic G4 Runtime transitioned to `APPROVED` and created its first Style Lock.
- 2026-08-26: Created Calibration Style Lock `CSL-CAL-SPACE-001-V1` and validation `UVCV-CAL-SPACE-001-V1`. No Universal template, profile, pack, image, remaining page or Feishu write was created.
- 2026-08-26: Replayed the complete approval harness in a second process; all artifacts and Runtime state were reused and all historical hashes remained unchanged.
- 2026-08-26: Completed the Node 24 regression: 140 strict Schemas, 141 generated TypeScript files, 72 test files and 383 tests passed; Renderer Doctor, Secret Scan and final `pnpm check` passed.

## Final result

`SUCCESS`: Calibration G4 is `PASSED`, Calibration Style Lock V1 is `CREATED`, the six systems are `CALIBRATION_VALIDATED_V1`, remaining-page production is `ELIGIBLE`, and Remaining Pages remain `0`. Full regression evidence is recorded in the Phase R.2.6 report.
