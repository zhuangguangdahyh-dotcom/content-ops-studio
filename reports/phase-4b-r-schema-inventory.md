# Phase 4B-R schema inventory

- Previous implemented Schemas: 89
- Added independent Schemas: 15
- Current implemented Schemas: 104
- Generated TypeScript files: 105 including index
- Contract version / Schema version: 1.0.0 / 1.0.0
- Ajv: Draft 2020-12 strict

Added: Image Production Policy/Context, Visual Asset Routing Plan, Visual Direction Candidate Set/Comparison Set/Selection, Image Production Batch Plan, Image Quality Report, Group Quality Report, Host Generated Asset Submission, Project Visual Profile, Visual Feedback Event, Visual Rule Candidate, Visual Rule, and Industry Visual Pack. The Comparison Set is an additive follow-up contract for equal-copy complete previews and a same-scale external-label contact sheet.

Existing contracts were changed minimally: two additive Visual Modes, Host/candidate provenance values, candidate/formal roles, the three-part Style Lock structure, and an optional false-only `long_term_rule_candidate` feedback marker. Additive schemas and optional fields classify MINOR; enum expansion remains `POTENTIALLY_BREAKING`; required-field expansion remains MAJOR under the migration protocol. Valid and invalid fixtures exist for every new Schema.
