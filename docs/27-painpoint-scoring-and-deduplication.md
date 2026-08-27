# Painpoint Scoring and Deduplication

Evidence confidence is explicit:

- `A_DIRECT_STRONG`: direct strong first-party or equivalent evidence.
- `B_MULTI_SOURCE`: at least two independently identified retained sources.
- `C_SINGLE_OR_INDIRECT`: one source or an indirect connection, with limitations.
- `D_HYPOTHESIS`: an unverified hypothesis. It is disabled by default, cannot be `CORE`, cannot have high/critical promotion priority and must retain limitations.

The deterministic score uses nine 0–5 dimensions and fixed weights: Audience relevance 15, frequency 10, urgency 10, decision impact 15, real cost 10, Subject advantage fit 10, evidence strength 15, content potential 10 and promotion fit 5. The total weight is exactly 100.

Priority thresholds are `CORE >= 80`, `IMPORTANT >= 65`, otherwise `SUPPLEMENTARY`. Score explanations and limitations remain beside the numeric result. Public comments or news alone do not prove prevalence, and advertising-product documentation is not treated as direct evidence for organic conversion.
