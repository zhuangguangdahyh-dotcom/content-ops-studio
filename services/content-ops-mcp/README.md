# Content Ops MCP service

Phase 2C implements the bundled local STDIO service with official MCP SDK `1.30.0` and Zod `4.4.3`. Phase 4A adds eight Visual Planning tools after the original 31. Phase 4B adds eight bounded Renderer and first-page tools, for 47 narrow tools: 32 read and 15 write. The Renderer tools expose only fixed setup, planning, one-page rendering, controlled asset verification, revision planning and checksum-bound review; they do not expose arbitrary browser, HTML, CSS, JavaScript, shell or file access.

Build with `pnpm mcp:build`. The single output is packaged at `plugins/content-ops-studio/runtime/dist/content-ops-mcp.mjs`; `.mcp.json` launches it with Plugin-relative placeholders. Runtime and Lark CLI composition remain authoritative. Import/startup performs no external write, login or project mutation.

Use `pnpm mcp:test`, `mcp:e2e`, `plugin:package-test`, `mcp:host-test`, research/content/visual tests for offline evidence. Live harnesses are explicit, non-CI and may only reuse an external fictional sandbox. G3 makes copy eligible; Visual Planning never auto-starts image work, creates G4 or produces Style Lock.

Phase 4B-R adds 14 narrow Image Production tools, bringing the computed catalog to 61. Six are read-only and eight write only controlled local artifacts. Host generation remains a Skill/Host action; MCP accepts no API key, arbitrary prompt execution, URL download, browser, shell, arbitrary file, raw Feishu or delete operation.
