# ADR-0020: Bundle a local STDIO MCP server with the Plugin

Status: Accepted  
Date: 2026-08-24

## Context

The deterministic Runtime and official Lark CLI Workspace Adapter exist, but Codex cannot invoke them as Plugin tools. A source-only server or a server that depends on repository `node_modules` would fail after Plugin installation. A remote server would add hosting and credential boundaries that are outside version 0.1.0.

## Decision

Ship one ESM STDIO MCP bundle at `runtime/dist/content-ops-mcp.mjs`, declared by Plugin-relative `.mcp.json`. Use the official TypeScript MCP SDK with `McpServer` and `StdioServerTransport`. Bundle workspace code, SDK and Zod; externalize only Node built-ins. Runtime data defaults to `${PLUGIN_DATA}/content-ops-home`, never Plugin Root. Initialization registers tools and reads safe configuration only; it performs no login, remote write or project mutation.

STDIO stdout is protocol-only. Diagnostics are redacted and use stderr. The installed Plugin copy must run without repository cwd or `node_modules`. Current MCP SDK and Zod versions are exact locks and bundle freshness is checked deterministically.

## Consequences

The Plugin is portable as a local package and has no remote MCP hosting requirement. Node 24 and the supported official `lark-cli` executable are the only allowed external runtime dependencies. Bundle size increases, and each dependency update requires rebuild, SDK E2E, package-copy validation and security review.
