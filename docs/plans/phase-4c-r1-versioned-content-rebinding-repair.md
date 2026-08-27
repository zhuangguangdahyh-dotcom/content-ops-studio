# Phase 4C-R.1 Versioned Content Package and visual rebinding repair

## Objective

Preserve the complete `CV-1 / Copy CV-1 / VV-1 / FPV-2 / G4 / SLV-1` calibration history, create a new six-page `CV-2 / Copy CV-2` Calibration Content Package, run deterministic Content QA and stop at a new version-bound Calibration G3 request with `PENDING_OPERATOR`.

## Current execution boundary

This first execution implements Step A only. It does not create `VV-2`, a rebound First Page asset, a new G4, `SLV-2`, remaining pages, Renderer output, ImageGen output or Feishu writes.

## Contract approach

Add a discriminated Project Reference whose Production branch retains the canonical `PRJ-*` constraint and whose Calibration branch accepts only `CAL-*`. Add independent Calibration Content Package, Content QA and G3 Review Request wrappers. These contracts are additive and do not widen Production Workspace eligibility.

## Versioning

The six-page package is a real semantic addition and therefore uses `CV-2 / Copy CV-2`. The legacy chain remains immutable and valid for `CV-1` only. `SLV-1` is retained only as a future historical calibration reference and does not authorize `CV-2` remaining-page production.

## Content and QA

Use the exact six-page Operator Draft Copy from the Phase 4C-R.1 instruction. Evaluate Cover Promise Alignment, Audience Fit, Painpoint Consistency, Page Role Distinction, Page Intent Fit, One Primary Judgment Per Page, Narrative Progression, Value Delivery, Claim Safety, Unsupported Claim, Copy Density, Repetition and Summary Consistency. Any blocking failure stops before G3 without rewriting the copy.

## Idempotency and integrity

Write every new artifact with immutable write-once-or-reuse behavior and read verification. Identical replay reuses the files; a different payload at the same version fails with a stable conflict. Hash all legacy calibration files and the protected C-0001 asset before and after the run.

## Planned Step B after explicit G3 approval

After a future explicit Operator `G3 APPROVE`, create `VV-2`, verify byte reuse eligibility against the unchanged Page 1 copy and approved PNG, allocate a new First Page Version and Asset ID, rerun current-version QA without Renderer or ImageGen, and stop at a new G4 request. A later explicit G4 approval may create `SLV-2`.

## Step B execution boundary

The Operator explicitly approved the immutable `CV-2 / Copy CV-2` package. Step B creates a checksum-bound Calibration G3 Approval, allocates the next Visual Plan and First Page versions, validates the existing PNG for semantic and byte reuse, creates a new logical First Page binding with current-version QA, and stops at a new pending Calibration G4 request. It does not mutate the legacy FPV-2 Manifest, create a new PNG, call Renderer or ImageGen, create `SLV-2`, produce pages 2–6 or write Feishu.

## Tests

- Strict Ajv valid/invalid fixtures for all four additive contracts.
- Production/Calibration discrimination and CAL Production-write isolation.
- Exact version/page/copy validation, QA hard-block behavior and G3 readiness.
- Immutable replay and same-version different-payload conflict.
- Migration classification as independent additive schemas.
- Full Node 24 `pnpm check`, Secret Scan and example sanitization.

## Implementation record

- 2026-08-26: Confirmed the previous same-version repair was correctly blocked because Pages 2–6 were new semantics.
- 2026-08-26: Selected a bounded Calibration wrapper so the canonical Production `PRJ-*` contracts and Feishu permissions remain unchanged.
- 2026-08-26: Added four strict additive contracts, generated types, valid/invalid fixtures, migration classification and a local-only immutable Runtime.
- 2026-08-26: Materialized the exact six-page `CV-2 / Copy CV-2` package and thirteen-check QA report. QA scored 97 with zero Hard Blocks and no copy mutation.
- 2026-08-26: Created a new version-bound G3 request with `PENDING_OPERATOR`; no Approval Event or downstream visual artifact was created.
- 2026-08-26: Completed in-process and independent-process idempotency replay. All legacy calibration files and C-0001 remained byte-identical.
- 2026-08-26: Completed the Node 24 full regression: 144 strict Schemas, 145 generated TypeScript files, 73 test files and 388 tests passed. Renderer Doctor, installed-copy Renderer, MCP bundle/Host, Secret Scan and example sanitization passed.
- 2026-08-27: Recorded explicit G3 APPROVE as `APR-20260827-G3B1`, precisely bound to the Step A package, fingerprint, QA and review request.
- 2026-08-27: The Version Allocator selected `VV-2` and `FPV-3`. Created `AST-CAL-SPACE-001-FPV3-REBIND` as a new logical `REUSED_VERIFIED_ASSET` binding to the original FPV-2 PNG bytes.
- 2026-08-27: Revalidated 21 current-version QA gates against CV-2 Page 1, the PNG, both thumbnails, Raster Contrast, deterministic replay and Universal Calibration evidence. All passed with zero Hard Blocks.
- 2026-08-27: Created the new G4 request with `PENDING_OPERATOR`; `SLV-2`, pages 2–6 and any new image remain absent. Independent-process replay reused all four artifacts.
- 2026-08-27: Completed Node 24 full regression: 148 strict Schemas, 149 generated TypeScript files, 73 test files and 393 tests passed. Renderer Doctor, installed-copy Renderer, MCP bundle/Host, Secret Scan and example sanitization passed.

## Final result

`SUCCESS`: Step A and Step B are complete. G3 passed; the current chain is `CV-2 / Copy CV-2 / VV-2 / FPV-3`, with unchanged PNG bytes and a new current-version QA binding. Execution is stopped at Calibration G4 `AWAITING_USER_APPROVAL`; no G4 Approval, `SLV-2` or remaining page exists.
