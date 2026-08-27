# State machines

MCP tools do not add a state machine. `content_ops_initialize_project` routes the existing initialization transition and pauses at G1; `content_ops_submit_approval` is the only MCP approval write; `content_ops_resume_run` can only use an existing legal checkpoint and never bypasses a pending Gate.

Feishu provisioning progresses through phases 0–13 and checkpoints every verified side effect. The terminal pre-approval state is `AWAITING_APPROVAL` at G1; activation requires an explicit current-version approval. Repair is add-only. Orphan/duplicate candidates, permission failures and schema conflicts block without destructive rollback.

Stable English codes are internal. Chinese labels are presentation values defined in `config/status-map.json`.

The Plugin tracks independent project, configuration, painpoint review, painpoint contentization, content, image, first-page approval, final approval, synchronization, rule, and run states. A transition validator owns legal movement; callers cannot assign terminal or approved states directly.

Approval is scoped to a target version. Creating a revision invalidates approval for the previous version. Partial synchronization retries only the failed side effect and preserves successful history.

Explicitly illegal transitions include:

- unapproved copy → first-page production;
- unapproved first page → remaining-page production;
- incomplete images → final review;
- failed QA → finalized;
- missing explicit approval → approved; and
- expired approval → advancing a newer version.

The canonical code and label list lives in `plugins/content-ops-studio/references/shared-state-machine.md`; machine-readable labels live in `plugins/content-ops-studio/config/status-map.json`. Legal topology remains in eleven files under `config/state-machines/`. Nine history-preserving version rules live in `config/invalidation-rules.json`, including file replacement invalidation.

Each transition is evaluated using machine, from/to state, trigger, actor Skill, required context, available artifacts, target version, and any approval event. The result always returns an allow decision, stable error code, reasons, required gate, invalidated approvals/artifacts, required actions, and next state. Evaluation is pure: it never writes project data or calls an external service.

G1-G5 codes are `PROJECT_PROFILE`, `PAINPOINTS`, `CONTENT_COPY`, `FIRST_PAGE`, and `FINAL_SET`. A usable approval must match the transition gate, target type, target ID, and current target version; it must be an active `APPROVE` decision. Only `content-studio-router` owns those approved transitions.

Visual System statuses are artifact-internal and do not expand the Feishu content state machine. Page-copy/count changes invalidate visual planning through Final Manifest; global visual changes invalidate Style Lock and downstream work; page-local background or layout work preserves G4/Style Lock where specified; file replacement invalidates checksum, File QA, G5, and Final Manifest. Invalidation marks history stale and never deletes it.

Runtime Run states are recorded independently in the Run Plan and Journal. `RUN_CREATED` advances through `RUNNING` to either `AWAITING_APPROVAL`, a blocking terminal state, or `RUN_SUCCEEDED`. Resume requires an active approval whose gate, target type, target ID, target version, and source Run match the pending checkpoint. Recovery reconstructs state from a valid Journal; it never deletes history or re-executes a verified completed step.

Phase 3A stops after read-verified painpoint writes at G2 `PAINPOINTS`. Initial items are `PAINPOINT_PENDING`. Version-bound item decisions transition only reviewed entries to `PAINPOINT_CONFIRMED`, `PAINPOINT_REVISION_REQUIRED`, `PAINPOINT_REJECTED`, or `PAINPOINT_PAUSED`; unreviewed entries remain pending. Only confirmed entries may become future content-creation inputs.

Phase 3B accepts only `PAINPOINT_CONFIRMED`, writes the Content as `COPY_PENDING_APPROVAL`, moves the Painpoint to `PAINPOINT_CONTENT_IN_PROGRESS`, and stops at G3 `CONTENT_COPY`. Version-bound G3 decisions produce `COPY_APPROVED`, `COPY_REVISION_REQUIRED`, `CONTENT_DISCARDED` or `CONTENT_PAUSED`. G3 approval grants eligibility only; it does not start Visual Planning or image work.

Phase 4A reads the still-valid G3-approved snapshot and moves only Content Status to `VISUAL_PLANNING` after plan quality/read verification. First-page/image/final/sync state machines do not move. `FIRST_PAGE_HANDOFF_READY` is a Runtime checkpoint, not G4 or an approval state.

# G4 state boundary

Successful mechanical production moves the Content image state to pending and pauses the Run at `G4 FIRST_PAGE`. APPROVE plus exact version/checksum binding creates Style Lock and makes remaining pages eligible. REVISE, REJECT and PAUSE preserve history and create no Style Lock. G4 does not start page 2 or G5.

Before formal production, immature projects use `DIRECTION_PLANNED` → `DIRECTION_GENERATING` → `AWAITING_USER_SELECTION` → `DIRECTION_SELECTED`. Candidate generation never enters G4. Selection permits, but does not perform, Visual Plan revision and formal first-page production.
