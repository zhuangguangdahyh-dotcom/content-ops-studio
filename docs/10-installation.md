# Installation

Requirements and environment ownership are defined in [ENVIRONMENT.md](../ENVIRONMENT.md). Node.js `>=24 <25` is mandatory; repository development uses pnpm `11.19.0`.

## Source checkout

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm release:pack
```

The installable root is `plugins/content-ops-studio/`. The Stage 11 tarball also contains generated TypeScript contracts and Operator documentation. The bundled MCP does not require repository cwd or repository `node_modules` after installation.

## Installed runtime

The Host expands `${PLUGIN_ROOT}` and `${PLUGIN_DATA}` in `.mcp.json`. Runtime data defaults to `${PLUGIN_DATA}/content-ops-home`; the Plugin root remains read-only. See [local Plugin installation](21-local-plugin-installation.md) and [Quick Start](../QUICK_START.md).

For rendering, explicitly install the pinned Chromium under Plugin Data and run Renderer Doctor. The MCP never downloads a browser at startup and never falls back to random system Chrome or Mock in Production. Image generation uses the Host-installed ImageGen capability and requires no Plugin API key.

For Feishu, official `@larksuite/cli@1.0.63` OAuth is the default path. Live writes are separately confirmed and read-verified. Legacy enterprise-app credentials, if used, are process secrets only.
