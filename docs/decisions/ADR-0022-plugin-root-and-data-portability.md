# ADR-0022: Separate immutable Plugin Root from portable Plugin Data

Status: Accepted  
Date: 2026-08-24

## Context

Plugin installation paths are cache-owned and may change. Writing Runs, mappings, journals or credentials beside installed code would break upgrades, package verification and privacy. Accepting an arbitrary Home from tool input would permit path escape.

## Decision

Treat `${PLUGIN_ROOT}` as immutable code/assets and `${PLUGIN_DATA}` as the default writable data boundary. `.mcp.json` launches the Plugin-relative bundle with `CONTENT_OPS_HOME=${PLUGIN_DATA}/content-ops-home`. A separately configured external Home is accepted only from process configuration, must be absolute, must not equal or descend from Plugin Root and is never accepted from MCP tool input.

Composition resolves repository development layout and installed Plugin layout explicitly. All project artifacts, locks, journals, write logs, checkpoints and full remote identifiers remain below the validated Home. Tests snapshot Plugin Root before and after tool calls and reject path traversal, absolute user paths in tool input and runtime writes into the package.

## Consequences

Installed copies remain immutable and relocatable. Operators can deliberately reuse an external Home without exposing it as a model-controlled argument. Host integrations must supply `${PLUGIN_ROOT}` and `${PLUGIN_DATA}` correctly, and package tests must validate both values.
