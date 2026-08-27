# Feishu troubleshooting

For the default path, check pinned version, `auth status`, exact scopes and typed Base capabilities in that order. Do not switch to Bot, Direct or Mock after a permission error. Newer unclaimed official CLI versions require retesting instead of a silent upgrade.

- `FEISHU_CREDENTIALS_MISSING`: configure app ID/secret through the environment; never put the secret on the command line.
- `FEISHU_AUTH_FAILED`: confirm the app identity, published version and tenant installation. Diagnostic output is redacted.
- `FEISHU_PERMISSION_DENIED` or `FEISHU_PERMISSION_MISSING`: compare the app scopes with the manifest and grant the app document access to the folder/Base.
- `FEISHU_LIVE_WRITE_DISABLED` / `FEISHU_LIVE_WRITE_NOT_CONFIRMED`: inspect the plan, then deliberately satisfy both independent gates.
- `FEISHU_ORPHAN_WORKSPACE` / `FEISHU_DUPLICATE_WORKSPACE_CANDIDATES`: inspect same-title Bases and project records manually. Do not rerun creation until exactly one candidate is adopted.
- `FEISHU_SCHEMA_DRIFT`: run `workspace inspect`, then `workspace verify` or add-only `workspace repair --dry-run`. Type conflicts are not automatically changed.
- `FEISHU_RATE_LIMITED`: retain the run and resume after server-directed bounded retry; do not start duplicate provisioning.
- `FEISHU_VIEW_CAPABILITY_LIMITED`: Phase 2B only claims view name/type creation; configure advanced filters manually until separately verified.
- `FEISHU_ATTACHMENT_UPLOAD_DEFERRED`: expected Phase 2B boundary, not a successful upload.

Use project-local state beneath `CONTENT_OPS_HOME` and the redacted write log/checkpoints for recovery. Never copy tokens, authorization headers, app secrets or full platform error bodies into issues or reports.
