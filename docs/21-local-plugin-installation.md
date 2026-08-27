# Local Plugin installation and validation

Requirements: Node.js 24 (`>=24 <25`), pnpm for repository development, and the supported official `@larksuite/cli@1.0.63` for live Workspace operations.

Build and validate:

```bash
pnpm install --frozen-lockfile
pnpm mcp:build
pnpm mcp:check-bundle
pnpm mcp:validate-config
pnpm mcp:e2e
pnpm plugin:package-test
pnpm mcp:host-test
```

The installable root is `plugins/content-ops-studio/`. Copy that single directory into a Host-supported Plugin location or use the repo marketplace entry. Do not copy repository `node_modules`; the bundled server is self-contained. The Host expands `${PLUGIN_ROOT}` and `${PLUGIN_DATA}` from `.mcp.json`. Default runtime artifacts go only to `${PLUGIN_DATA}/content-ops-home`.

The source package test copies the Plugin to an isolated cache path, launches its bundle with repository cwd removed, lists/calls tools and proves Plugin Root unchanged. Stage 11 additionally installs the release tarball in a repository-external clean environment and runs installed validation and E2E. Current Codex CLI MCP management is also inspected under an isolated Codex Home. If a Host lacks an automated repo-Plugin install command, its native discovery remains `UNVERIFIED`; SDK/install-copy evidence must not be mislabeled.

For Feishu, use `content_ops_check_feishu`; when needed, explicitly call `content_ops_start_feishu_setup` and complete the official browser flow. Never paste a secret into chat or a tool call.

For research, the Host must make its native research capability available to the Skill. The bundled MCP remains network-closed. Run `pnpm research:test`, `pnpm mcp:e2e` and `pnpm plugin:package-test` before live use; `research:live-test` is explicit, non-CI and must reuse a fictional external sandbox.

For Content Creation, run `pnpm content-creation:test`, `content-duplication:test`, `content-quality:test`, `g3-review:test`, `content-revision:test`, `mcp:e2e` and `plugin:package-test`. `content:live-test` is explicit, dual-gated, non-CI, reuses the retained fictional sandbox and pauses before G3 approval.

For Visual Planning, run contract, visual-planning, layout, handoff, MCP, Plugin package and installed-copy tests. `visual-planning:live-test -- --confirm-live-write` is explicit, dual-gated and reuses the existing fictional Content; it creates no Base, Content, image or G4.

# Installed Renderer

The installed Plugin Root remains immutable. Put the exact Chromium cache under Plugin Data, keep `CONTENT_OPS_HOME` external and run Renderer Doctor. The installed-copy test launches the bundled MCP from a separate working directory, discovers all 72 tools, renders a fixture Cover, verifies the output and proves the Plugin Root hash is unchanged.
