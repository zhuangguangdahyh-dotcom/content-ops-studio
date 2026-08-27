# MCP troubleshooting

- `Connection closed` before initialize: run the bundle with Node 24 and inspect redacted stderr. Confirm the file contains one leading shebang and no stale build with `pnpm mcp:check-bundle`.
- Tools are absent: validate `plugin.json` declares `"mcpServers": "./.mcp.json"`, the server key is `content-ops`, and Host placeholders resolve.
- `CONTENT_OPS_HOME_INVALID`: configure a writable absolute Home outside Plugin Root. Tool input cannot change it.
- `LARK_CLI_NOT_INSTALLED` or version failure: install the exact supported official CLI or set a Host-owned `CONTENT_OPS_LARK_CLI_PATH`; do not hardcode a personal path in the Plugin.
- `AWAITING_USER_AUTHORIZATION`: call the setup tool, finish browser OAuth, then rerun the Feishu check. Tokens and keychain data are never diagnostic output.
- `PLAN_HASH_MISMATCH`: rerun the corresponding plan/repair-plan tool and review the new result before confirming.
- `AWAITING_APPROVAL`: show the exact G1 request to the Operator. Only an explicit `content_ops_submit_approval` call can continue.
- `CONFLICT`: do not guess among candidate resources or alter field types. Preserve assets and resolve the reported mismatch.
- Repair returns `PASSED_NO_OP`: the Workspace already matches; no remote mutation was attempted.

MCP Inspector UI validation is optional/manual when an interactive UI is required. The automated source of truth is the official SDK Client + STDIO E2E, installed-copy package test and redacted live evidence.
