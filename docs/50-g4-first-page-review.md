# G4 first-page review

G4 is an explicit Operator decision on the real PNG. The target binds Content Version, Copy Version, Visual Plan Version, First Page Version, asset ID and SHA-256. A `FirstPageReview` stores detailed feedback; the formal `ApprovalEvent` remains a separate Runtime event.

`APPROVE` requires no requested changes. `REVISE` is classified as render-only, page Visual Plan, global Visual Plan or Content Copy. Visual Plan changes return to Phase 4A; copy changes return to Phase 3B. `REJECT` and `PAUSE` preserve all assets and evidence.

No G4 decision may be inferred from mechanical QA. Until the Operator explicitly approves, the Runtime remains `AWAITING_USER_APPROVAL`, Style Lock is absent and remaining pages are ineligible.

Direction selection is an earlier independent decision. It records which aesthetic route may be developed; it neither approves a formal cover nor creates G4. Image-quality score and `PASS_PENDING_OPERATOR` also do not constitute approval.
