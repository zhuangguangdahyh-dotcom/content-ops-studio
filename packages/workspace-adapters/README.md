# @content-ops/workspace-adapters

`LarkCliWorkspaceAdapter` is the Phase 2C MCP production default. MCP never falls back to Mock and never exposes raw official-CLI commands.

Workspace and asset-store interfaces, an in-memory/persistent local Mock, and the Phase 2B Feishu China self-built tenant-app Adapter. Feishu modules isolate credentials, in-memory tokens, allowlisted Node 24 fetch transport, field identity, Blueprint compilation, provisioning, reconciliation and recovery. Production never falls back to Mock, and attachment upload is explicitly deferred.
