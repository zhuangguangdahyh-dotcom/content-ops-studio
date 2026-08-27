# ADR-0024: Score painpoints against retained evidence

Status: Accepted  
Date: 2026-08-24

## Context

Painpoint lists are easy to pad with generic model guesses. Production use requires traceable claims, honest confidence, stable scoring, and an explicit explanation when fewer useful items exist than requested.

## Decision

Every painpoint references retained evidence records. Confidence is classified as A direct/strong, B multi-source, C single/indirect, or D hypothesis. B requires at least two independent sources. D is disabled by default, always carries limitations, and can never be `CORE` or have `HIGH`/`CRITICAL` promotion priority.

The deterministic weighted score is: relevance 15, frequency 10, urgency 10, decision impact 15, real cost 10, Subject fit 10, evidence 15, content potential 10, and promotion fit 5. `CORE` is at least 80, `IMPORTANT` is at least 65, and lower scores are `SUPPLEMENTARY`. Exact duplicate identities and duplicate source content are rejected. The requested default is 30, but the report must retain the actual produced count and an insufficiency reason instead of padding.

Public excerpts are summaries and short claim locators, not copied articles. Private materials are not public research and require the same data minimization and consent rules as other project inputs.

## Consequences

Scores are reproducible and reviewable. Weak evidence remains visible, lower counts are honest, and generated hypotheses cannot silently masquerade as market facts.
