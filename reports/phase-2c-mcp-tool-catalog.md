# Phase 2C MCP tool catalog

Status: COMPLETE. Server: `content-ops-studio` `0.1.0`. Tool count: 15. Names are unique. Every tool has strict input/output schemas, `destructiveHint=false`, structured plus text results and stable redacted errors.

## Read-only tools

- `content_ops_doctor` — Runtime, Plugin Data, Adapter and Lark readiness; readOnly true, openWorld false.
- `content_ops_check_feishu` — supported CLI, OAuth and required scopes; readOnly true, openWorld false.
- `content_ops_list_projects` — local project summaries; readOnly true, openWorld false.
- `content_ops_get_project` — project/Workspace/latest Run summary; readOnly true, openWorld false.
- `content_ops_plan_project_initialization` — canonical Profile dry plan/hash; readOnly true, openWorld false.
- `content_ops_inspect_workspace` — remote structure counts; readOnly true, openWorld false.
- `content_ops_verify_workspace` — Blueprint/mapping verification; readOnly true, openWorld false.
- `content_ops_plan_workspace_repair` — add-only repair dry plan/hash; readOnly true, openWorld false.
- `content_ops_get_run_status` — Run/checkpoint/error/approval state; readOnly true, openWorld false.
- `content_ops_list_pending_approvals` — pending G1-G5 decisions; readOnly true, openWorld false.

## Controlled write tools

- `content_ops_start_feishu_setup` — official browser OAuth start; readOnly false, openWorld true.
- `content_ops_initialize_project` — plan-bound idempotent provision/G1 pause; readOnly false, openWorld true.
- `content_ops_apply_workspace_repair` — current-hash add-only apply/no-op; readOnly false, openWorld true.
- `content_ops_submit_approval` — explicit version-bound Runtime approval; readOnly false, openWorld true.
- `content_ops_resume_run` — legal checkpoint resume/no-op; readOnly false, openWorld true.

## Forbidden surface audit

No name or handler provides shell/exec/run-command, arbitrary Lark CLI, raw Feishu API, delete Base/table/field/record/view, arbitrary file read/write, arbitrary Home, token/keychain/App Secret access, risk-control disablement or a universal `mode` action. Research, images, Renderer, attachment and publishing tools are not registered.
