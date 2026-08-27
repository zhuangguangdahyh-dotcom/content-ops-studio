# Content Ops local MCP server

Phase 2C introduced the local STDIO MCP server bundled at `runtime/dist/content-ops-mcp.mjs`. The current server is `content-ops-studio` version `0.2.0`, uses the official TypeScript MCP SDK, registers 72 narrow user-goal tools and composes the deterministic Runtime plus the official Lark CLI Workspace Adapter.

The server performs no login, Base creation or project mutation during import/startup. STDIO stdout is reserved for MCP protocol frames; diagnostics use redacted stderr. Node 24 and a supported official `lark-cli` are the only external runtime dependencies. SDK, Zod and workspace code are bundled into one file.

`.mcp.json` starts the bundle from `${PLUGIN_ROOT}` and defaults `CONTENT_OPS_HOME` to `${PLUGIN_DATA}/content-ops-home`. Plugin Root is immutable. An explicit external Home is allowed only through Host/process configuration, must be outside Plugin Root and is never accepted as a tool argument.

Before writes, tools require Doctor plus the corresponding plan/inspect call, explicit confirmation, an idempotency/request key and a plan/version binding. Initialization uses locks, Journal, Write Log, Checkpoint, recovery and read-after-write, and stops at G1. Repair is add-only. No delete, shell, arbitrary file, raw Feishu, token, keychain or universal execution tool exists.

This local server is suitable for ChatGPT desktop, Codex CLI, Codex IDE Extension, repo marketplace testing and local Git distribution when those Hosts support local Plugin MCP loading. It is not a public ChatGPT Web Plugin: that requires separately approved stable Streamable HTTP hosting, authentication, deployment, monitoring, availability and public review.

Phase 3A increases the catalog from 15 to 23 tools. Research acquisition stays in the Host. The server accepts bounded cited source summaries, validates/scorers candidates, writes only to the existing painpoint table and stops at G2. It exposes no generic web search or fetch tool.

Phase 3B increases the catalog from 23 to 31 tools. Content Creation consumes one confirmed Painpoint, one core problem and one core viewpoint; factual Claims retain Evidence; unsupported/high-duplicate drafts block; finalization writes one Content row and stops at G3. No tool starts Visual Planning, creates images, deletes records or exposes raw Feishu.

Phase 4A increases the catalog from 31 to 39 tools (27 read, 12 write). Visual local submission is closed-world; finalization is the only new open-world write and can update six allowlisted logical fields. No image/Renderer/G4/Style-Lock/delete/raw-Feishu tool is added.

# Renderer tools

The bundled STDIO catalog now contains 47 tools: 32 read and 15 write. Eight Phase 4B tools cover status/setup, first-page plan/render/get/verify, revision planning and Review storage. No arbitrary Browser, screenshot, HTML, CSS, JavaScript, shell, file or delete tool is exposed.
