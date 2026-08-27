# Feishu self-built app setup

> Advanced Direct Feishu Adapter only. Ordinary Operators should use [Official Lark CLI user setup](17-lark-cli-user-setup.md) and must not be asked for App ID or App Secret.

Phase 2B supports only a Feishu China enterprise self-built tenant application. An administrator creates the app in the Feishu Open Platform, enables the Bitable permissions listed in `plugins/content-ops-studio/config/feishu-permission-manifest.json`, publishes the app version, installs it to the tenant, and grants the app document access to the intended folder. Content Ops Studio never creates the platform app.

Required minimum API scopes are `base:app:create`, `base:app:read`, `base:table:create`, `base:table:read`, `base:table:update`, `base:field:create`, `base:field:read`, `base:field:update`, `base:view:read`, `base:view:write_only`, `base:record:create`, `base:record:read`, and `base:record:update`. Attachment upload is deferred and its permission is not required for Phase 2B.

Configure secrets in the process environment, not files or CLI arguments:

```bash
export FEISHU_APP_ID='...'
export FEISHU_APP_SECRET='...'
export FEISHU_PARENT_FOLDER_TOKEN='...'
export FEISHU_TEST_PARENT_FOLDER_TOKEN='...'
export CONTENT_OPS_HOME='/absolute/operator-controlled/path'
```

Run read-only diagnostics and a plan:

```bash
content-ops feishu doctor --probe-auth --json
content-ops feishu permissions --json
content-ops feishu workspace plan --project-id PRJ-... --project-name '示例项目' --run-id RUN-... --json
```

A live provision additionally needs `CONTENT_OPS_ENABLE_LIVE_FEISHU=1`, `--mode PRODUCTION`, and `--confirm-live-write`. Dry-run never writes. A new Base is created in the authorized folder and is never auto-deleted.
