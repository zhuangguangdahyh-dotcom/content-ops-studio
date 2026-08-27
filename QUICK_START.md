# Content Ops Studio Quick Start

## 1. Check the environment

Use Node.js `>=24 <25` and pnpm `11.19.0`:

```bash
node --version
pnpm --version
```

## 2. Install and validate

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm mcp:build
pnpm validate:plugin
pnpm plugin:package-test
```

For production rendering, install the pinned managed Chromium and run `pnpm renderer:doctor`. Do not place browser bytes inside the Plugin or Project Home.

## 3. Install the Plugin

Use `plugins/content-ops-studio/` as the Plugin root, or install the Stage 11 release tarball and use its nested Plugin root. The Host expands `${PLUGIN_ROOT}` and `${PLUGIN_DATA}` from `.mcp.json`; do not edit those placeholders into personal paths.

## 4. Initialize one Project

Call the tools in this order:

1. `content_ops_doctor`
2. `content_ops_plan_project_initialization`
3. `content_ops_initialize_project` after explicit confirmation
4. submit the exact G1 decision
5. `content_ops_resume_run`
6. `content_ops_verify_workspace`

Use fictional data for evaluation. Feishu is optional; official Lark CLI OAuth is the default live workspace path.

## 5. Run the minimum deterministic example

```bash
pnpm plugin-v1:e2e
```

This TEST-only fixture exercises the logical chain through checksum-bound G5 and Finalization without ImageGen, Feishu writes or publishing.

## 6. Find outputs

Project artifacts live under external `CONTENT_OPS_HOME` or the Host-managed `${PLUGIN_DATA}/content-ops-home`, never in the Plugin installation. Inspect `projects/<project-id>/runs/<run-id>/` for plans, journals, checkpoints, QA, delivery and archive evidence.

## 7. Recover a failed Run

Read the Run status and last checkpoint before retrying. Resume with the same Project, Run, version and idempotency scope. Do not delete partial artifacts or create a second workspace blindly. Renderer failure requires Renderer Doctor; Feishu failure requires Lark/permission Doctor; stale approval requires a new human Gate decision.
