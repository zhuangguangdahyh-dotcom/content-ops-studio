# Phase 2C — Bundled Local MCP Server and Plugin Tool Wiring

Status: COMPLETE. Owner: repository maintainers. Started: 2026-08-24. Completed: 2026-08-24.

## Goal

Ship a bundled, local STDIO MCP server inside the existing `content-ops-studio` Plugin. Expose fifteen narrow user-goal tools that compose the existing Runtime and default official Lark CLI Workspace Adapter without duplicating domain state, approvals, recovery or Feishu logic. Validate the installed Plugin copy, not only repository source, and reuse the retained fictional Phase 2B.2 sandbox for no-new-resource live evidence.

## Non-goals

This phase does not add Research, production image generation, a Production Renderer, attachment upload, Playwright, publishing, remote MCP hosting, public distribution, automatic deletion, a version change, a Git remote or a push. It does not modify official Lark CLI source, disable its risk controls, collect credentials, expose raw shell/OpenAPI tools or treat Workspace readiness as whole-Plugin production readiness.

## Current state

Phase 2B.2 is complete with one retained fictional sandbox Base and an external `CONTENT_OPS_HOME`. The official Lark CLI is the default Workspace path; Direct Feishu remains separately unverified. The repository is unborn `main`, with no commit, identity or remote. Phase 2C reuses the unchanged Phase 2B.2 baseline `BASELINE-PHASE-2B2-WORKING-TREE-20260824` (756 files, aggregate `c242c80a866626a34ff7685cca9f0848acaedcb35095fcbe669f324be45a9e9a`).

## Official requirements and pinned dependencies

The 2026-08-24 OpenAI Agent Plugin guidance requires `.codex-plugin/plugin.json` and supports bundled MCP declaration through `.mcp.json`. The official MCP guide recommends the official TypeScript SDK, `McpServer`, explicit Zod input/output schemas, accurate annotations, structured and human-readable results, and concise server instructions. Registry checks on 2026-08-24 resolve `@modelcontextprotocol/sdk` `1.30.0` and `zod` `4.4.3`; both will be exact dependencies.

## Architecture and composition

- `services/content-ops-mcp` owns MCP framing, boundary schemas, result envelopes, error mapping and tool registration.
- The composition root resolves Plugin Root, Plugin Data and a validated `CONTENT_OPS_HOME`; tool input can never set an arbitrary root.
- Workspace operations call the existing CLI/Runtime/`LarkCliWorkspaceAdapter` composition rather than reimplementing Blueprint, state, approval, locks, Journal, Write Log, Checkpoint, idempotency or reconciliation.
- Production defaults are `LARK_CLI` and `PRODUCTION`; Production never falls back to Mock.
- The server performs no external write, login or project mutation during module import or initialization.

## Tool surface

Register exactly: `content_ops_doctor`, `content_ops_check_feishu`, `content_ops_start_feishu_setup`, `content_ops_list_projects`, `content_ops_get_project`, `content_ops_plan_project_initialization`, `content_ops_initialize_project`, `content_ops_inspect_workspace`, `content_ops_verify_workspace`, `content_ops_plan_workspace_repair`, `content_ops_apply_workspace_repair`, `content_ops_get_run_status`, `content_ops_list_pending_approvals`, `content_ops_submit_approval`, and `content_ops_resume_run`. No delete, shell, arbitrary file, raw Feishu or universal mode tool is allowed.

## Safety and data boundary

All boundary objects reject unknown keys. Write tools require an idempotency/request key, a plan/version binding and explicit confirmation. Project and Run identifiers use existing stable formats. CLI results are field-level summarized; tokens, secrets, keychain contents, authorization data, complete remote identifiers, raw stdout/stderr and arbitrary paths are never returned. STDIO stdout is protocol-only and diagnostics use redacted stderr.

## Bundle and portability

Build one deterministic ESM file at `plugins/content-ops-studio/runtime/dist/content-ops-mcp.mjs`. Bundle workspace packages, MCP SDK and Zod; externalize only Node built-ins. The installed copy must run without repository `node_modules` or repository cwd. `.mcp.json` uses `${PLUGIN_ROOT}` and `${PLUGIN_DATA}`, with runtime data defaulting to `${PLUGIN_DATA}/content-ops-home`; no execution data may enter Plugin Root.

## Testing and host validation

Unit tests cover initialization, the exact catalog, schemas, annotations, envelopes, redaction, error mapping and safety. SDK E2E uses `Client` and `StdioClientTransport` against the built file. Package tests copy the Plugin to a temporary install/cache path, provide separate Plugin Data, verify no repository dependency, list/call tools and assert Plugin Root remains unchanged. Host validation first inspects current Codex CLI support and uses isolated configuration only; inability to automate a real Host is reported as `UNVERIFIED`, never fabricated.

## Live MCP validation

Reuse the retained Phase 2B.2 external Home and Base. Call the required read tools plus repair plan/apply no-op through an SDK MCP client. Verify Workspace `MATCH`, zero safe repair operations and `PASSED_NO_OP`. An identical initialization replay may be used only with the same stable project/run/input and must create no second Base or duplicate remote object. Approval validation is limited to an idempotent replay of the already approved G1. No automatic cleanup occurs.

## Files involved

- `services/content-ops-mcp/**`
- `plugins/content-ops-studio/.mcp.json`, manifest, bundled runtime and affected Skill metadata
- root scripts/config/workflows needed for reproducible build and validation
- ADR-0020 through ADR-0022
- README, CHANGELOG, security/privacy, architecture, installation, testing, release and roadmap documentation
- six Phase 2C reports and the working-tree comparison

## Test commands

`pnpm mcp:build`, `pnpm mcp:check-bundle`, `pnpm mcp:validate-config`, `pnpm mcp:test`, `pnpm mcp:e2e`, `pnpm mcp:host-test`, `pnpm plugin:package-test`, `pnpm check`, `pnpm scan:secrets`, and, when the retained sandbox is available, `pnpm mcp:live-test`.

## Implementation record

- 2026-08-24: Read the task, repository/Plugin instructions, current architecture/Runtime/Feishu/MCP scaffolds, accepted ADRs and Phase 2B.2 evidence.
- 2026-08-24: Confirmed Node `v24.19.0`, pnpm `11.19.0`, Codex CLI `0.149.0-alpha.4.1`, unborn `main`, no Git identity/remote and the existing 1.0.63 official Lark CLI binary.
- 2026-08-24: Rechecked current official OpenAI Plugin and MCP guidance before implementation; exact dependency resolution is SDK `1.30.0`, Zod `4.4.3`.
- 2026-08-24: Fresh pre-change `CI=true pnpm check` passed: 36 test files, 184 tests, 60 strict Schemas, generated declarations, Secret Scan and example sanitization.
- 2026-08-24: Read-only Lark auth status found Bot ready and user OAuth refreshable. Full identity output is classified as sensitive transport detail and will not be exposed by MCP.
- 2026-08-24: Added Accepted ADR-0020/21/22, exact SDK/Zod locks, strict result/error boundaries and exactly fifteen narrow tools. Existing Runtime and Lark CLI composition remain authoritative.
- 2026-08-24: Added Plugin `.mcp.json`, manifest wiring and a deterministic single-file ESM bundle. Bundle hash is `0c54b9947c89f35da474d52ceb78400b4adbcba07135af2c64bb898618ac3580` at 1,407,997 bytes.
- 2026-08-24: Official SDK STDIO E2E, installed-cache Plugin copy, Plugin Data immutability and isolated Codex CLI MCP management checks passed. Native Codex repo-Plugin auto-install is explicitly UNVERIFIED because the current CLI exposes no automated install command.
- 2026-08-24: First live diagnostic run exposed installed-copy Doctor coupling to a repository-only evidence file; it was not accepted. Doctor now validates packaged Node 24 plus Lark readiness, and the harness rejects any required non-SUCCESS result.
- 2026-08-24: Repeated live MCP validation passed against the retained fictional sandbox: all required tools SUCCESS, Workspace MATCH, Repair PASSED_NO_OP, exact initialization replay SUCCESS, counts unchanged and zero remote mutations/new Bases/deletions.
- 2026-08-24: Added the two supported Skill MCP dependency manifests, five MCP documents, six phase reports, CI/build/test commands and Phase 2B.2 baseline-relative change evidence.
- 2026-08-24: Final `CI=true pnpm check` passed with 39 test files and 194 tests; 60 strict Schemas, generated declarations, bundle freshness, installed-copy tests, Secret Scan and example sanitization passed.

## Final result

Phase 2C implementation, installed-copy/equivalent Host validation and retained-sandbox live MCP evidence are complete. Implementation status is SUCCESS; Bundled MCP Server Evidence and MCP Live Tool Evidence are PASSED; Local/Repo Plugin Readiness is READY. Universal Public Plugin Readiness and whole-Plugin Production Integration Readiness remain BLOCKED.

## Unresolved issues

- Current Codex CLI has no automated repo-Plugin installation command. Native auto-install remains UNVERIFIED, while the isolated installed-copy/equivalent Host path is PASSED.
- The retained sandbox must remain untouched except for explicit idempotent/no-op calls; if missing, live evidence becomes `NOT_RUN` rather than creating replacement assets.
