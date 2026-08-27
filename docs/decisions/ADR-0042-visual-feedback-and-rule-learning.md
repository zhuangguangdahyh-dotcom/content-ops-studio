# ADR-0042: Visual feedback and rule learning

- Status: Accepted
- Date: 2026-08-25

## Decision

Learning is a three-stage, auditable process: Feedback Event, Rule Candidate, then Operator-confirmed Rule. Feedback is classified as quality defect, production feedback, visual preference, or project/domain constraint and defaults to the smallest applicable scope: element, page, set, project, Industry Pack, or global preference.

Rules are `MUST`, `MUST_NOT`, `PREFER`, `AVOID`, `REFERENCE_POSITIVE`, or `REFERENCE_NEGATIVE` and record statement, rationale, scope, positive and negative examples, exceptions, source event, confirmation, status, and version. G4 creates only the current set's Style Lock; G5 records only the approved set reference. Neither automatically creates a long-term preference.

Confirmed rules are versioned and may be superseded, disabled, rejected before confirmation, or forgotten through removal from active resolution while history remains auditable. System bugs, tool failures, and quality defects never pollute aesthetic profiles.
