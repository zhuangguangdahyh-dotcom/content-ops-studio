# Finalization and Delivery V1

Stage 10 closes an already approved image-post set. Image Production Skill V1 is `PRODUCTION_READY / FROZEN`; this stage does not add or call visual generation, rendering or design logic.

## Eligibility

Finalization requires exact Content, Copy, Visual Plan and First Page versions; explicit current G3 and G4; an active current Style Lock; all remaining pages; passing single-page QA; passing Image Set Continuity and Group QA; zero hard blocks; and an explicit checksum-bound G5 approval. A missing G5 returns `G5_APPROVAL_REQUIRED` before a Final Manifest exists.

The isolated `FINALIZATION_E2E_FIXTURE` is marked `FIXTURE_APPROVAL / TEST_ONLY / NON_PRODUCTION`. Production Runtime and Production Workspace reject fixture approval. Calibration projects cannot write Production Workspace.

## Runtime flow

`FINALIZATION_AND_DELIVERY_V1` executes:

1. Load Finalization context.
2. Verify the exact approval chain.
3. Re-read every final PNG and verify path, type, dimensions, byte size and SHA-256.
4. Verify per-page and group evidence.
5. write-once or reuse `FINAL_MANIFEST_V1`.
6. build the canonical `FINAL_SET_FINGERPRINT`.
7. remove privacy-bearing PNG metadata chunks without decoding or re-encoding pixels.
8. copy only sanitized approved formal pages and approved Contact Sheets into `DELIVERY_PACKAGE_V1`.
9. read-verify 18 delivery integrity checks with zero hard blocks, including absent privacy chunks and unchanged IDAT bytes.
10. archive this Final Set version and mark it current.
11. optionally export sanitized final pages to a marker-owned leaf under an Operator-specified directory.
12. stop. Workspace metadata sync is a separate explicit action.

Normal Finalization makes zero ImageGen calls, zero Renderer calls, zero implicit Feishu writes and zero attachment uploads.

## Delivery layout

```text
final-manifest.json
pages/
  01-cover.png
  02-content.png
  ...
  NN-summary.png
previews/
  contact-sheet-full.png
  contact-sheet-310.png
  contact-sheet-186.png
reports/
  finalization-summary.json
  png-metadata-sanitization-report.json
  delivery-integrity-report.json
```

The Delivery Package contains no candidate, rejected, failed, superseded, debug, fixture, blind-regression or temporary asset. Audit History remains separate and append-only.

The original approved asset remains byte-for-byte unchanged and stays bound to G5 and the immutable Final Manifest. Delivery always removes privacy-bearing `caBX`, `eXIf`, and `tIME`, and removes `tEXt`, `zTXt`, or `iTXt` only when its metadata is privacy-bearing. Non-private textual chunks remain intact. Retained PNG chunks are copied verbatim, preserving Canvas, bit depth, color type and every compressed `IDAT` byte. `content_ops_export_sanitized_pngs` requires explicit confirmation and an absolute destination; it never writes inside Plugin Root.

## Immutable version and recovery behavior

`FINAL_MANIFEST_V1` is `WRITE_ONCE_OR_REUSE`. An identical payload reuses the existing version; a different payload under the same Final Manifest Version returns `FINAL_MANIFEST_VERSION_CONFLICT`.

- Failure before Manifest leaves no `FINALIZED` state.
- Failure after Manifest preserves it and retries Delivery.
- Failure after Delivery reuses both Manifest and copied assets while completing Archive.
- Feishu sync failure does not corrupt `FINALIZED`; sync is tracked separately.
- A later Copy, Page Count, Asset checksum, G4, G5 or Style Lock change makes the old set `SUPERSEDED`, while its historical artifacts remain immutable.

## Feishu V1 boundary

The current Blueprint supports final Content status, G5 status, page count, relative output reference and finalized time. It lacks dedicated `Final Manifest ID` and `Final Set Fingerprint` fields; `contentsContentFingerprint` is not repurposed because it owns a different semantic identity. Therefore Feishu final metadata sync remains `PARTIAL / FEISHU_FINAL_SYNC_FIELD_GAP`. Attachment upload remains `DEFERRED` under `drive:file:upload` and does not block local Finalization V1.
