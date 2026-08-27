# Contract

Operations are `DISCOVER`, `PROVISION`, `UPDATE`, `INSPECT`, `VERIFY`, `REPAIR`, and `MIGRATE`. Every call has a project ID, run ID, Runtime mode, Blueprint/schema version, capability report and idempotency scope. `DISCOVER` returns a strict `project-profile-gap-report` with known, missing, conflicting and inferred fields; separate Operator, Subject and Audience knowledge; material blockers; non-blocking gaps; and research readiness. Production writes return a provisioning state, reconciliation report, field map and redacted write evidence. G1 remains Router-owned.

Real identifiers belong only in the project Home. Secret values and tokens are not contract fields. Attachment upload is deferred.
