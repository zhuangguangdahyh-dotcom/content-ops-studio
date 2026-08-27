# Phase 4B-R.2 Cover Contract Difference

## Additive contract changes

- Added Cover Conversion Plan, Cover Copy Package, Cover Thumbnail QA, Cover Click Clarity Report, Visual Semantic Relevance Report, Cover Concept Candidate Set, Cover Revision Plan and Global User Visual Preference.
- Extended First Page Review with optional `revision_routes`; the existing primary `revision_classification` remains required and backward compatible.
- Extended Project Visual Profile and Dynamic Visual Strategy with optional Cover-specific preferences, inputs, targets and thresholds.
- Extended Visual Rule for versioned Global User Preference records without changing existing project/industry behavior.
- Extended Image Quality Report project references to allow the isolated `CAL-*` namespace.

## Behavioral changes

- G4 `REVISE` can preserve one primary route while carrying multiple validated revision reasons.
- `CONTENT_COPY` remains the C-0001 primary route; `GLOBAL_VISUAL_DIRECTION` is retained as a second reason.
- A generic professional-service lead-generation request with insufficient Audience/Painpoint/Value context blocks with `COVER_CONTEXT_INSUFFICIENT` and one targeted question.
- Commercial-space calibration context is sufficiently concrete and produces three materially distinct strategies.

## Compatibility and migration

All changes are additive. Old required fields, approved assets and state history are preserved. Generated declarations and fixtures are regenerated; migration classification tests explicitly cover R.2. Ajv strict and TypeScript strict remain enabled.

No Schema was weakened to accept the CAL1 rendering defect. The defect was fixed in the harness by materializing the Host asset as an embedded PNG source, and the failed attempt remains append-only evidence.
