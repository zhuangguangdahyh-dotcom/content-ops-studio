# Official Lark CLI user setup

MCP Operators call `content_ops_check_feishu` and, only when needed, explicitly call `content_ops_start_feishu_setup`. The latter starts the official browser flow and returns a next action; it never asks for an App Secret or exposes token/keychain data.

Ordinary setup does not require an App ID, App Secret or tenant-token environment variable.

1. Run `content-ops feishu status --json`.
2. If missing, run `content-ops feishu cli install`; review the pinned official npm plan, then rerun with `--confirm-install`.
3. Run `content-ops feishu setup --json`. Existing compatible configuration is reused.
4. When status is `AWAITING_USER_AUTHORIZATION`, open the returned opaque Feishu URL and finish browser authorization. If the tenant requires administrator approval, wait for it; do not bypass it.
5. Rerun `content-ops feishu scopes --json`, then `content-ops feishu setup --json`.
6. Generate `feishu workspace plan` before any write. Provision and real repair require `--confirm-live-write`.

An Operator-owned executable outside PATH can be selected with `--binary <path>` or `CONTENT_OPS_LARK_CLI_PATH`. Tokens remain in storage owned by the official CLI. Do not copy auth caches into `CONTENT_OPS_HOME` or the repository.

Advanced enterprise deployments may explicitly choose `DIRECT_FEISHU`; see the existing self-built app guide. That path is not an AUTO fallback.
