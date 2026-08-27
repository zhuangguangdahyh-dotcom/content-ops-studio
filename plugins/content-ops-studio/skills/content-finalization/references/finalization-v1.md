# Finalization V1 operating contract

## Preconditions

The current Content Version, Copy Version, Visual Plan Version and First Page Version must match explicit G3, G4 and checksum-bound G5 approvals. The current Style Lock must be active and bind the Visual Plan. Every approved formal page must exist, pass single-page QA, carry zero hard blocks and match its PNG dimensions, byte size and SHA-256. Continuity and Group QA must pass with zero group hard blocks.

Missing G5 returns `G5_APPROVAL_REQUIRED` before a Final Manifest is created. Fixture approvals are accepted only by the isolated TEST Runtime and never authorize Production Workspace.

## Immutable artifacts

- `FINAL_MANIFEST_V1` is WRITE_ONCE_OR_REUSE. Same bytes reuse; same Final Manifest Version with a different payload returns `FINAL_MANIFEST_VERSION_CONFLICT`.
- `FINAL_SET_FINGERPRINT` hashes canonical version, approval, Style Lock, ordered page checksum, Group QA, Continuity and Page Count inputs. It excludes timestamps, absolute paths and environment values.
- `DELIVERY_PACKAGE_V1` contains only the approved ordered pages, three approved Contact Sheet previews, the Final Manifest and two delivery reports.
- Audit history remains append-only outside Delivery. Candidate, rejected, failed, superseded, debug, temporary and blind-regression assets never enter Delivery.

## Recovery

- Before Manifest: remain non-finalized.
- Manifest complete but Delivery incomplete: keep Manifest and retry Delivery.
- Delivery complete but Archive incomplete: reuse Manifest and Delivery; do not reproduce assets.
- Feishu sync failure: keep `FINALIZED`; record sync separately as failed or pending retry.

Post-finalization Copy, Page Count, Asset checksum, G4, G5 or Style Lock changes make the current delivery `SUPERSEDED`. Historical Manifest and Delivery versions remain immutable.

## Tool boundary

- `content_ops_plan_finalization` is read-only.
- `content_ops_finalize_delivery` requires explicit local-write confirmation.
- `content_ops_get_finalization_status` is read-only.
- `content_ops_verify_final_delivery` is read-only and reports stale bindings.

Normal Finalization makes zero ImageGen calls, zero Renderer calls, zero implicit Feishu writes and zero attachment uploads.
