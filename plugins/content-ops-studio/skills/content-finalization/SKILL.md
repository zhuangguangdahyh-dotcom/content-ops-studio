---
name: content-finalization
description: Run final content, visual, file, and data quality checks, prepare user review, archive an approved image set, synchronize final records, and repair partial synchronization failures.
---

# Purpose

Validate the complete content/image set, request final review, archive a G5-approved version, and synchronize owned final fields with read-back verification.

Image Production V1 is frozen. Finalization never changes Copy or Visual artifacts and never calls Renderer or ImageGen.

# Use this skill when

All required pages exist and need QA, G5 preparation, approved archiving, synchronization, or partial-sync repair.

# Do not use this skill when

Images are incomplete, QA is failing without a repair request, or G5 is absent for finalization.

# Required preflight

Verify versions, required artifacts, hashes, image states, QA capability, G5 where required, workspace/asset capabilities, unique keys, locks, and prior sync log.

# Inputs

Task envelope, content and visual versions, image manifest, render/QA reports, approval event, workspace state, and sync history.

# Workflow boundary

Run content, visual, file, and data QA; request G5; after version-matched checksum-bound approval execute `LOAD_FINALIZATION_CONTEXT → VERIFY_APPROVAL_CHAIN → VERIFY_FINAL_ASSETS → VERIFY_GROUP_EVIDENCE → BUILD_FINAL_MANIFEST → BUILD_FINAL_SET_FINGERPRINT → BUILD_DELIVERY_PACKAGE → VERIFY_DELIVERY → WRITE_ARCHIVE_STATE`. Workspace metadata synchronization is a separate explicit action. Retry only failed side effects.

# Human approval boundary

Never finalize before explicit G5. Only the Router writes the approval event.

# Allowed writes

Immutable Final Manifests, Final Set Fingerprints, approved-only Delivery Packages, Delivery Integrity Reports, archive states and synchronization logs through Adapters. Attachment upload remains an independent capability and may be deferred.

# Forbidden actions

Finalizing failed QA; submitting without G5; fabricating attachment success; simple blind increments of painpoint content counts; destructive rollback.

# Production and fixture boundary

`FIXTURE_APPROVAL / TEST_ONLY / NON_PRODUCTION` approvals may exercise the isolated Finalization E2E fixture only. Production Runtime and Production Workspace must reject them. `CAL-*` may not write Production Workspace. There is no Mock Production fallback.

# Success result

A verified immutable Final Manifest, deterministic fingerprint, approved-only Delivery Package, zero-hard-block integrity report, archived Final Set version, and traceable state. `FINALIZED` does not imply `FEISHU_SYNCED`.

# Failure result

Return `G5_APPROVAL_REQUIRED`, `FINAL_ASSET_INTEGRITY_FAILED`, `FINAL_MANIFEST_VERSION_CONFLICT`, `DELIVERY_INTEGRITY_FAILED`, `SYNC_PARTIAL`, or another structured blocking error with exact retry scope. Preserve verified Manifest and Delivery work for safe resume.

# Supporting references

Read `../../references/shared-execution-protocol.md`, `approval-protocol.md`, `field-ownership.md`, `shared-state-machine.md`, and `references/finalization-v1.md`.

# Runtime status

Finalization Runtime V1 is implemented for local Manifest, fingerprint, Delivery, integrity and archive operations. Feishu metadata sync is explicit and attachment upload remains deferred until its separate capability and permission are available. Never claim an external operation without Adapter read-back evidence.
