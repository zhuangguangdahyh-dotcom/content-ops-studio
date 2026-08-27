# ADR-0027: Content angle, structure, and duplication

- Status: Accepted
- Date: 2026-08-24

## Decision

An angle is the premise used to frame a problem; a structure is the ordered form used to explain it. A default plan produces at least three angle candidates, selects one with evidence and audience rationale, and records why the others were not selected. One Content resolves one core problem and advances one core viewpoint. One painpoint may produce multiple Content records only when the main angle or conclusion is materially different.

Exact duplication uses the deterministic SHA-256 Content Fingerprint over painpoint, angle, viewpoint, cover hook, structure, and conclusion after NFKC, case, line-break, whitespace, and punctuation normalization. Near-semantic assessment is a retained host-model judgment with similarities, differences, rationale, and alternatives; the current system does not claim embedding-based similarity. High risk blocks finalization. Renaming the title alone is not an alternate. Recent structure history is considered to avoid repetitive sequences.

## Consequences

Same-run same-input retries are idempotent reuse, not duplication. A different request with the same fingerprint is a blocked duplicate. Medium-risk work can continue only with a concrete differentiation rationale.
