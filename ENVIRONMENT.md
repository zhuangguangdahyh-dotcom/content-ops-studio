# Environment contract

## Required runtime

- Node.js: `>=24 <25`.
- Repository package manager: `pnpm@11.19.0`.
- Supported Renderer pair: `playwright@1.62.1` / `playwright-core@1.62.1` with the matching managed Chromium.
- Supported official Feishu/Lark CLI: `@larksuite/cli@1.0.63`.

## Runtime locations

The Plugin root is read-only. `CONTENT_OPS_HOME` must resolve outside the Plugin root; installed Hosts normally provide `${PLUGIN_DATA}/content-ops-home`. Browser bytes belong under Plugin Data or another explicit repository-external cache. Runtime Project Homes, browser caches and rendered assets are never release-package inputs.

## Integration environment

Official Lark CLI OAuth is the default Workspace Adapter. The Host supplies research and ImageGen capabilities. The Plugin does not require an Operator OpenAI API key.

Legacy Feishu enterprise-app values are optional process secrets. They must never enter chat, CLI arguments, logs, reports or repository files. Live writes also require the environment gate and explicit write confirmation.

See `.env.example` for names only. Empty values mean the optional capability is not configured; they never imply successful live integration.
