# Project Profile Discovery

Phase 3A uses `DISCOVER` to determine whether the canonical Project Profile contains enough confirmed context for painpoint research. It does not invent a customer brief and does not use chat memory as project data.

The discovery result is a strict `project-profile-gap-report` containing known fields, material blockers, non-blocking gaps, conflicts, explicitly marked inferences and the smallest recommended questions. Missing required fields, an inactive project or unconfirmed configuration block research. Recommended fields remain visible but do not create artificial blockers.

`content_ops_plan_project_initialization` now returns this semantic gap report inside the read-only plan. Exact placeholder values such as `待确认`, plus fields declared in `extensions.unresolved_fields` or `extensions.inferred_fields`, cannot be reported as a complete Profile merely because the JSON Schema is structurally valid. Non-blocking gaps may proceed to G1 after they are shown to the Operator; material blockers prevent initialization. Research remains blocked until the project and configuration are explicitly approved.

Project initialization is a long-running, recoverable write because each remote object is read-verified. The MCP server emits a non-sensitive progress heartbeat for write tools when the Host requests progress notifications. Hosts must reset their per-request timeout on progress or provide an adequate total timeout; a Host timeout never authorizes a second Base, and recovery must reuse the saved project, Run and idempotency scope.

G1 `APPROVE` promotes the exact version-bound canonical Project Profile to `PROJECT_ACTIVE` and `CONFIG_CONFIRMED` only after Schema and research-readiness validation. A Profile confirmation supplied with the approval may incorporate Operator-confirmed non-material fields gathered while G1 was pending, such as project-scoped visual preferences. Confirmed inference markers are cleared, unresolved non-blocking fields remain explicit, the remote status update is read-verified first, and then the canonical local Profile snapshot is atomically persisted. The approval never modifies a core Skill, Platform Pack or Industry Pack.

Operator, Subject and Audience remain separate roles. Operator facts describe who runs the Plugin; Subject facts describe the entity represented by content; Audience facts describe the people whose decisions the content should influence. A value inferred from context remains unconfirmed unless the Operator explicitly confirms it or an already verified approval artifact supports it.

For the retained Phase 3A sandbox, the original profile is preserved. A project-scoped version-2 snapshot records the current explicitly fictional Xiaohongshu research scope, while the gap report records the verified prior G1 basis and confirms that no remote profile overwrite occurred.
