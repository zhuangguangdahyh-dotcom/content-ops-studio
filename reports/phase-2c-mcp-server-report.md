# Phase 2C MCP server report

Date: 2026-08-24  
Phase 2C Implementation Status: SUCCESS  
Bundled MCP Server Evidence: PASSED  
Bundled Plugin Host Load Evidence: PASSED (installed-copy/equivalent isolated Host); native Codex repo-Plugin auto-install UNVERIFIED  
Local / Repo Plugin Readiness: READY  
Universal Public Plugin Readiness: BLOCKED  
Plugin Production Integration Readiness: BLOCKED

## Baseline and environment

The unchanged Phase 2B.2 baseline is `BASELINE-PHASE-2B2-WORKING-TREE-20260824`: 756 files, aggregate `c242c80a866626a34ff7685cca9f0848acaedcb35095fcbe669f324be45a9e9a`. Runtime is Node `v24.19.0`, pnpm `11.19.0`, darwin/arm64. Git remains unborn `main`, with no commit, identity, remote or push.

## Official requirements and dependencies

Current official OpenAI Plugin/MCP guidance was rechecked before implementation. The server uses `McpServer` and `StdioServerTransport` from exact `@modelcontextprotocol/sdk@1.30.0`, with exact `zod@4.4.3`. Server name/version are `content-ops-studio`/`0.1.0`. The safety instructions put plan-before-write, explicit G1, no delete, stable IDs and honest external results in the first 512 characters.

## Implementation

`services/content-ops-mcp` implements context/portability validation, strict result envelopes, redacted errors, tool catalog and STDIO entrypoint. It composes existing `runCli`, Runtime, canonical Ajv registry and `LarkCliWorkspaceAdapter`. It does not implement another registry, Blueprint, state machine, approval processor, lock, Journal, Write Log, Checkpoint, idempotency or reconciliation engine.

The Plugin contains `.mcp.json`, declares `mcpServers` in its manifest and includes one 1,407,997-byte ESM bundle. Deterministic hash is `0c54b9947c89f35da474d52ceb78400b4adbcba07135af2c64bb898618ac3580`. The bundle contains SDK/Zod/workspace code, no source map or personal path, and requires only Node plus the supported official Lark CLI.

## Safety

Exactly fifteen user-goal tools are registered. All have title, description, strict input, strict output and accurate annotations. Write tools require explicit confirmation plus an idempotency/request key and current plan/version binding. There is no delete, shell, arbitrary file, raw CLI/API, token, keychain, secret, arbitrary Home or risk-control tool. STDIO stdout is protocol-only; tool failures return structured redacted errors.

## Validation

- Pre-change `CI=true pnpm check`: exit 0; 36 files/184 tests; 60 strict Schemas; Secret Scan passed.
- MCP unit/safety: 2 files/9 tests, passed.
- Official SDK STDIO E2E: 1 file/1 test, passed; initialize, instructions, tools/list, valid/invalid calls and clean close.
- Installed Plugin copy: passed; 15 tools; no repository `node_modules` or cwd; Plugin Root unchanged; data in Plugin Data.
- Isolated Codex CLI MCP management surface: passed. Current CLI has no automated repo-Plugin installation command, recorded as native auto-install `UNVERIFIED` rather than fabricated.
- Live retained-sandbox MCP: passed; Verify `MATCH`, Repair `PASSED_NO_OP`, idempotent initialization counts unchanged, zero remote mutations.
- Final complete `CI=true pnpm check`: exit 0; 39 test files/194 tests; all non-live MCP, Plugin, strict Schema, Secret Scan and example checks passed.

## Deferred boundaries

Research Adapter, production image generation, Production Renderer, attachment upload, Playwright, public Streamable HTTP MCP, publishing and public Plugin distribution remain unimplemented. Therefore Universal/Public and whole-Plugin production readiness remain BLOCKED.
