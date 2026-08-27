# ExecPlan standard

An ExecPlan is required before any change that:

- implements or modifies the Feishu MCP service;
- changes a core Schema or state machine;
- adds a platform or industry pack;
- changes the image-rendering architecture or customer project directory;
- adds an external service;
- refactors more than three packages; or
- migrates data.

Store plans under `docs/plans/`. Keep each plan current while work proceeds. A plan must contain:

1. Goal
2. Non-goals
3. Background
4. Current state
5. Files involved
6. Interface changes
7. Data changes
8. Migration approach
9. Security risks
10. Privacy risks
11. Test plan
12. Failure recovery
13. Implementation steps
14. Implementation log
15. Final result
16. Unresolved questions

Do not create a plan merely to imply that unstarted implementation exists.

Runtime support-policy or evidence-contract changes require an ExecPlan and Accepted ADR. They must identify the actually validated Runtime separately from CI configuration and production integration readiness.

Phase 3B work is tracked in `docs/plans/phase-3b-evidence-grounded-content-creation.md`. Its mandatory pause after the first Live Content write is an implementation milestone, not final success; approval, resume and replay evidence are recorded only after an explicit Operator G3 decision.

Phase 4B-R.2 work is tracked in `docs/plans/phase-4b-r2-cover-conversion-semantic-relevance.md`. It records C-0001 G4 `REVISE`, versioned Global User Visual Rules and local commercial-space comparison evidence, then stops at `AWAITING_USER_SELECTION` without a formal calibration FPV, G4 or Style Lock.
