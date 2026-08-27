# ADR-0048: Re-produce a selected calibration direction and stop at pending G4

- Status: Accepted
- Date: 2026-08-26

## Context

Phase 4B-R.2.3 produced I/J/K as direction candidates. Candidate I demonstrates useful `TYPE_DOMINANT` behavior, but candidate approval cannot certify formal production, and copying its PNG would bypass asset, Renderer, QA, version and replay evidence.

## Decision

A calibration selection is represented by a dedicated, current-set-only contract. Formal production must create a new source asset and a new Renderer output whose path and checksum differ from the candidate. Formal readiness requires zero hard blocks and explicit actual-pixel inspection at full, 310 and 186 sizes.

The formal Cover may create only a review request with `decision=PENDING_OPERATOR`. Scores never create an approval. A Style Lock Preview is permitted, but the formal Style Lock, remaining pages and long-term learning remain forbidden until an explicit Operator G4 approval.

Font resolution must be truthful. A rendered attempt that fails the requested font policy is preserved as superseded evidence rather than overwritten or silently accepted.

## Consequences

- Candidate A–K remain immutable historical evidence.
- C-0001 remains byte-for-byte unchanged.
- Formal Cover and content-page typography remain intentionally different.
- The repository gains additive contracts, Renderer logic, tests and a recoverable external harness.
- Phase 4C, Feishu writes and long-term visual learning remain out of scope.
