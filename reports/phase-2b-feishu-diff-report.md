# Phase 2B planned-to-actual difference report

Date: 2026-08-24. Baseline: `BASELINE-PHASE-2A1-WORKING-TREE-20260824`.

## Planned and delivered

The plan requested a production Feishu China Bitable Adapter without changing the provider-neutral core or Phase 2A recovery model. The delivered composition keeps credentials, token lifecycle, HTTP payloads, and Feishu field semantics inside `packages/workspace-adapters`; Runtime continues to own mode, lock, journal, write log, approval pause, and project-local storage.

Four tables, 141 fields, five relations, four named views, and one pending project record are compiled deterministically. Provisioning is replayable and add-only. It saves table, field, view, and record identifiers only below the selected project Home and pauses at G1. G1 activation now performs a remote record update and another schema read verification before local success.

## Official-interface adjustments

- Record field maps use current `field_name`, not `field_id`. Stable `field_id` remains the remote identity and drift key, producing the three-layer mapping `logicalKey → field_id → current field_name`.
- Base creation returns a default table. The implementation adopts exactly one unambiguous blank default table and never deletes it.
- Direct view creation is represented as `NAME_ONLY`: only view name and grid type are claimed. Blueprint filter/sort intent is not reported as remotely applied.
- Relation fields are compiled only after every target table ID exists. Reverse-field behavior is not guessed and remains subject to live evidence.
- Record batch create/update uses the documented maximum of 1,000. A missing/unverified returned item is reconciled and retried individually; verified items are not repeated.
- The official SDK describes record-get as historic. Search Records is the unique-key default; record-get is retained only as a compatibility read for read-after-write evidence.

## Transport, permission, and dependency adjustments

The official Node SDK 1.73.0 was inspected but not added. Native Node 24 `fetch` was selected to make fake-clock token refresh, single-flight, endpoint allowlisting, retry evidence, caller cancellation, and secret redaction explicit. This caused no lockfile dependency addition.

The exact permission manifest contains 13 required scopes. Attachment upload permission is deferred and does not block Phase 2B. Runtime tenant installation and document access cannot be inferred from a static manifest, so offline implementation status remains separate from live verification.

## Provisioning and recovery adjustments

Because the selected Bitable API surface does not provide a safe project-level idempotency key for Base creation or a proven folder-candidate reconciliation call, the implementation writes a create-intent state before the request. A crash with an unknown remote result becomes `FEISHU_ORPHAN_WORKSPACE` and blocks a second create until Operator reconciliation. Known returned identifiers are saved atomically before continuing.

Repair never updates conflicting field types, renames user fields, clears relations, or deletes extras. Extra remote tables, fields, and views are preserved. Same run/project input drift conflicts through a deterministic input fingerprint.

## Risk and downstream impact

Live permissions, relation behavior, rate quotas, parent-folder access, and payload acceptance remain unverified. The explicit live harness is outside ordinary tests and CI, leaves a fictional Base for manual cleanup, and stores only hashes in shareable evidence. Workspace readiness therefore remains UNVERIFIED and entire Plugin production readiness remains BLOCKED.
