# Phase 2C MCP difference report

Status: COMPLETE. Date: 2026-08-24.

## Planned versus actual

- Planned official SDK/Zod: implemented with exact 1.30.0/4.4.3.
- Planned single STDIO bundle: implemented at the Plugin-relative runtime path; SDK, Zod and workspace packages are bundled.
- Planned fifteen tools: all implemented; no additional generic or destructive tool.
- Planned `.mcp.json`/manifest wiring: implemented without absolute paths, `.app.json`, hooks, public URL or version change.
- Planned Runtime/Lark CLI reuse: implemented through the existing CLI composition and Adapter. The CLI root resolver was generalized for installed Plugin cwd.
- Planned Skill dependency metadata: added only to Router and Project Initialization using current `agents/openai.yaml` MCP dependency fields.
- Planned official SDK E2E, installed-copy and Host checks: passed. Native Codex repo-Plugin auto-install remains `UNVERIFIED` because the current CLI exposes MCP management but no automated repo-Plugin install command.

## Observed corrections

1. The first bundle build had two shebangs because both source and esbuild banner supplied one. SDK connection closed with a syntax error. The redundant banner was removed; a regression SDK E2E now launches the actual bundle.
2. Official Lark CLI auth state `needs_refresh` means refreshable user OAuth, not unauthenticated. The CLI summary now treats it as authenticated unless explicitly logged out/unauthenticated; real Feishu checks and remote reads passed.
3. Repository Doctor depended on a repository report absent from installed Plugin copies. MCP Doctor now validates the packaged Node 24 Runtime policy and Lark readiness rather than treating absent repository evidence as an installed-runtime failure. The first live run was not accepted; the strict harness was changed to fail any non-SUCCESS required tool and the complete live run was repeated.
4. Current Codex CLI can list/manage MCP registrations but cannot automatically install this repo Plugin in isolation. Equivalent installed-copy Host evidence is PASSED and the narrower native auto-install status remains UNVERIFIED.

No official MCP protocol or `.mcp.json` shape change was needed beyond the documented Agent Plugin structure. No API difference required widening schemas, weakening validation or hardcoding a remote identifier.
