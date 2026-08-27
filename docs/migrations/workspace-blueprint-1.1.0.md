# Workspace Blueprint 1.1.0 migration note

## Change classification

This is a display-order and display-label migration for new Feishu workspaces. Stable table keys, field logical keys, field types, relation definitions and internal option codes do not change. One independent `png-metadata-sanitization-report` Schema is additive; adding that required report to a Delivery Package is potentially breaking for older package consumers.

## New workspaces

New provisioning uses Blueprint `1.1.0`, Chinese predefined option labels and the requested leading columns. During the same create Run it narrowly removes only the three exact platform-seeded auxiliary fields from the persisted default table.

## Existing workspaces

No automatic destructive migration is allowed. Existing fields and records remain intact. Reordering or relabeling must use an explicit migration plan, stable field IDs, pre-write inspection, idempotency state, read-after-write verification and an audit record. The normal add-only repair path must not perform this migration.

The Plugin `0.1.0 → 0.2.0` installation migration is a clean versioned Plugin copy. It does not rewrite an existing Project Home. A Project may continue to use its retained Blueprint `1.0.0` mapping until an Operator separately approves a live workspace migration; new projects use Blueprint `1.1.0`.

## Rollback

History is preserved rather than deleted. If an explicit existing-workspace migration fails, stop at the verified checkpoint and repair forward; do not delete fields, tables, records or the Base.
