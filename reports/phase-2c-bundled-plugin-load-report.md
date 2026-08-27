# Phase 2C bundled Plugin load report

Status: PASSED for installed-copy/equivalent isolated Host. Date: 2026-08-24.

The Plugin was recursively copied to an operating-system temporary cache path without repository `node_modules` or tests. The copied `.mcp.json` resolved its bundle under Plugin Root and its Home under a separate Plugin Data root. The official SDK Client initialized the copied bundle from installed Plugin cwd, received instructions, listed all 15 tools and called `content_ops_list_projects` successfully.

Plugin Root was hashed before and after the Host call and remained unchanged. Runtime data was directed to Plugin Data. The bundle did not use repository cwd or repository dependencies. `.mcp.json` and manifest validation passed with one `content-ops` STDIO server, `node` command, Plugin-relative argument/cwd and no absolute path/path escape.

Current Codex CLI `0.149.0-alpha.4.1` was inspected with an isolated Codex Home. Its MCP management surface is available. It does not expose an automated repo-Plugin installation/discovery command suitable for this test, so native repo-Plugin auto-install is `UNVERIFIED`. This does not overwrite personal Codex configuration. Equivalent installed-copy Host load is the passed local/repo readiness evidence.

No `.app.json`, hook, public service, user marketplace mutation, Plugin version change or runtime write under Plugin Root occurred.
