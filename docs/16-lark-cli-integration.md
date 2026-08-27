# Official Lark CLI integration

Phase 2C consumes this Adapter only through the bundled MCP composition. MCP Doctor summarizes version/auth readiness without returning identity, Scope strings, token metadata or raw CLI stdout/stderr.

The default Feishu Workspace boundary is the official `@larksuite/cli` through `LarkCliWorkspaceAdapter`. The current tested contract is exactly `1.0.63`; npm stable `1.0.89` was observed on 2026-08-24 but is unclaimed until retested.

The Adapter translates the unchanged four-table, 141-field, five-relation and four-name-only-view Blueprint into official Base shortcuts. Every call uses `--as user`, JSON output, argv arrays and a closed allowlist. Records are searched by the existing unique key, written in batches no larger than 200, then read back. Add-only repair creates missing resources and preserves extra remote resources. Attachment upload returns `DEFERRED_TO_FUTURE_PHASE`.

AUTO selects only an installed, supported and authenticated official CLI. It does not fall back to Direct Feishu or Mock. The Direct Adapter remains available only through `--workspace-adapter DIRECT_FEISHU` and retains its App Secret and double-gate rules.

Official sources: [Feishu CLI guide](https://open.feishu.cn/document/mcp_open_tools/feishu-cli-let-ai-actually-do-your-work-in-feishu), [larksuite/cli](https://github.com/larksuite/cli), [official npm package](https://www.npmjs.com/package/@larksuite/cli), and [official lark-base Skill](https://github.com/larksuite/cli/tree/main/skills/lark-base).
