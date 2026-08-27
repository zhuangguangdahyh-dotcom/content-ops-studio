# ADR-0026: Evidence-grounded content authoring

- Status: Accepted
- Date: 2026-08-24

## Decision

Content authoring starts from one `PAINPOINT_CONFIRMED` record and the evidence retained for that painpoint. It does not reopen unbounded industry research. Every claim is classified: external facts require an Evidence Ref; project first-party facts require an approved project source; professional judgments and opinions may omit external evidence only when explicitly labelled as judgments or opinions. Unsupported factual claims block G3.

Invented statistics, rankings, studies, customer stories, performance results, and cases are prohibited. An example must be labelled fictional unless approved case evidence exists. A new unsupported fact is either researched in a separate bounded research run or rewritten as an honest judgment with limitations. A CTA may be empty and, when present, must match a capability the Subject can actually fulfil.

## Consequences

The claim map is a first-class artifact. Content can be useful without pretending every professional judgment is an external fact, while factual accuracy and source boundaries remain auditable. Content Creation never stores full source pages or expands into an implicit Research Adapter.
