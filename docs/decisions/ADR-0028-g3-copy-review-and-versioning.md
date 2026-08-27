# ADR-0028: G3 copy review and versioning

- Status: Accepted
- Date: 2026-08-24

## Decision

`Content ID` is stable identity. `Content Version` changes when the core problem, viewpoint, structure, page count, or full concept changes. `Copy Version` changes for every copy change, including title, body, CTA, or page text. `CREATE_NEW`, `CREATE_ALTERNATE`, and `REVISE` are distinct operations.

G3 uses gate `CONTENT_COPY`, target type `CONTENT_PACKAGE`, target ID `content_id`, and target version `<content_version>:<copy_version>`. An APPROVE, REVISE, REJECT, or PAUSE decision is recorded only through the Router and formal approval tool. A Content Copy Review retains detailed business feedback separately from the generic Approval Event. Editing copy invalidates the old G3 because its version target no longer matches.

Unapproved copy cannot enter Visual Planning. APPROVE makes it eligible but does not start visuals. REVISE creates a new version plan; REJECT and PAUSE preserve all history and never delete the Content record or artifacts.

## Consequences

Version mismatch is a hard error. Every revised version repeats claim validation, duplicate analysis, quality checks, and G3. Old approvals remain immutable historical evidence.
