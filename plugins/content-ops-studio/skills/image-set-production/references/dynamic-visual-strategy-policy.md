# Dynamic visual strategy policy

Synthesize one strategy per Content before choosing channels, modes, candidate count or layout. Required sources are Project Profile, Subject, Audience, Platform Pack, Industry Pack, overlays, Project Visual Profile, confirmed global preferences, current painpoint, Content Package, page roles, current Operator request, authorized Project/evidence assets, approved/rejected references, historic G4/G5 results, Feedback Events, Confirmed Rules and cost/time/quality constraints.

Decision order is safety/authenticity/authorization → current Operator request → compatible Style Lock → confirmed Project rules/Profile → confirmed global preference → per-content evidence/asset/semantic need → Industry Pack/overlays → Visual Mode primitives → generic fallback. A lower layer cannot override a higher layer. Strategy synthesis never mutates the Profile, Pack or global preference.

The plan records the article summary and, per page, channel, mode, background, subject, composition, realism, color, font character, title/body size strategy, weight, line height, tracking, alignment, text region, text-image ratio, effects/mask/shadow/gradient/border/texture, selection reason and consistency risk. It also records image/candidate counts, batches, quality thresholds, confidence, major ambiguity and at most three useful clarification questions.

Maturity behavior:

- `COLD_START`: plan 2–3 content-derived directions.
- `LEARNING`: apply confirmed rules and plan 1–2 directions where uncertainty remains.
- `MATURE`: when context remains compatible, plan one formal first-page direction.
- `REVIEW_REQUIRED`: block reuse after material Subject, Audience, platform, industry or brand change.

Candidates must differ in their actual visual argument, subject, scale, axis, composition or evidence behavior. They are not fixed channel slots. The same industry or Project may choose different strategies for different content while remaining inside confirmed Project boundaries.
