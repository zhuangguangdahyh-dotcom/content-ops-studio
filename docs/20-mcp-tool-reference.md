# MCP tool reference

All tools return a strict envelope in both `structuredContent` and concise text `content`. Errors contain code, redacted message, retryability, scope and recommended action.

Read-only tools:

- `content_ops_doctor`: Node 24, Plugin data boundary, Lark CLI and local project readiness.
- `content_ops_check_feishu`: official CLI version, user OAuth and required Base scopes.
- `content_ops_list_projects`: non-sensitive local project summaries.
- `content_ops_get_project`: one project, Workspace and latest Run summary.
- `content_ops_plan_project_initialization`: canonical Profile validation and dry plan hash.
- `content_ops_inspect_workspace`: remote structural counts without identifiers.
- `content_ops_verify_workspace`: Blueprint/mapping result (`MATCH`, repair, conflict or blocked).
- `content_ops_plan_workspace_repair`: current add-only repair plan and hash.
- `content_ops_get_run_status`: Run phase, checkpoint, failures and approval state.
- `content_ops_list_pending_approvals`: explicit pending G1-G5 decisions.

Controlled write tools:

- `content_ops_start_feishu_setup`: official browser OAuth start; never receives a secret.
- `content_ops_initialize_project`: plan-bound idempotent provision, always pausing at G1 when new.
- `content_ops_apply_workspace_repair`: current-hash add-only apply or `PASSED_NO_OP`.
- `content_ops_submit_approval`: explicit version-bound approval through Runtime.
- `content_ops_resume_run`: legal checkpoint resume or idempotent no-op; never bypasses approval.

Unknown keys are rejected. Project/Run/Approval identifiers use stable formats. Tool inputs cannot contain absolute paths, shell commands, secrets, tokens or Authorization headers. Full remote identifiers remain only under `CONTENT_OPS_HOME`.

Phase 3A adds `content_ops_get_research_context`, `content_ops_plan_painpoint_research`, `content_ops_submit_research_sources`, `content_ops_submit_painpoint_candidates`, `content_ops_finalize_painpoint_research`, `content_ops_list_painpoints`, `content_ops_get_painpoint`, and `content_ops_verify_painpoint_batch`. Source submission and finalization are open-world writes because they persist Host citations or contact Feishu; candidate submission is local-only and closed-world; context/list/get/verify/plan are read-only.

Phase 3B adds `content_ops_get_content_context`, `content_ops_plan_content_creation`, `content_ops_submit_content_draft`, `content_ops_finalize_content_copy`, `content_ops_list_contents`, `content_ops_get_content`, `content_ops_verify_content`, and `content_ops_plan_content_revision`. Context/plan/list/get/verify/revision-plan are read-only; draft submission is a local-only write; finalization is an open-world idempotent Feishu write that stops at G3.

Phase 4A adds `content_ops_get_visual_context`, `content_ops_plan_visual_direction`, `content_ops_submit_visual_plan`, `content_ops_finalize_visual_plan`, `content_ops_get_visual_plan`, `content_ops_verify_visual_plan`, `content_ops_plan_visual_revision`, and `content_ops_get_first_page_handoff`. Six are read-only; submit is local-only; finalize is dual-gated/open-world and read-verifies protected fields.

# Phase 4B tool group

Read: `content_ops_get_renderer_status`, `content_ops_plan_first_page_production`, `content_ops_get_first_page_asset`, `content_ops_verify_first_page`, `content_ops_plan_first_page_revision`.

Bounded write: `content_ops_setup_renderer`, `content_ops_render_first_page`, `content_ops_submit_first_page_review`. Formal G4 continues through the existing approval and resume tools.

Phase 4B-R adds 14 narrow tools. Read-only: image-production context, asset route, direction plan/get, rule list and full-set plan. Local writes: candidate submission/selection, generated-asset metadata, image/group quality, feedback, rule confirmation and rule update. No tool exposes a raw image prompt/API, URL download, browser, shell, arbitrary file, raw Feishu or delete surface.

# Stage 10 Finalization tool group

Read-only: `content_ops_plan_finalization`, `content_ops_get_finalization_status`, `content_ops_verify_final_delivery`.

Explicit-confirmation local write: `content_ops_finalize_delivery`. It can only create/reuse immutable Manifest, fingerprint, Delivery, integrity and Archive artifacts under external Project Home. It never invokes Renderer/ImageGen, writes Feishu, uploads attachments or accepts fixture approval in Production. The computed catalog is 71 tools.
