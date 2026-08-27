# Phase 2B.1 Operator Setup

Date: 2026-08-24. Status: `NOT_CONFIGURED`. This guide uses placeholders and never asks the Operator to paste a secret into chat or store one in the repository.

## Missing process configuration

- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- `FEISHU_TEST_PARENT_FOLDER_TOKEN`
- `CONTENT_OPS_HOME`
- `CONTENT_OPS_ENABLE_LIVE_FEISHU=1`

No live permission result is available because authentication was not configured. This is not evidence that any particular Feishu scope is missing.

## 1. Create and install a dedicated self-built app

In the Feishu China Open Platform, an administrator must create an enterprise self-built tenant app used only for this sandbox validation, publish/enable its current version, install it to the test tenant and allow it to access the dedicated test folder. Do not use a customer or production app/folder.

Configure all 13 required scopes from `plugins/content-ops-studio/config/feishu-permission-manifest.json`:

```text
base:app:create
base:app:read
base:table:create
base:table:read
base:table:update
base:field:create
base:field:read
base:field:update
base:view:read
base:view:write_only
base:record:create
base:record:read
base:record:update
```

`drive:file:upload` is deferred and must not block Phase 2B.1.

## 2. Create the dedicated test folder

Create a new Feishu folder reserved for `Content Ops Studio Phase 2B.1 Sandbox`. Grant the self-built app access to that folder and obtain its folder token from the folder URL or Feishu tooling. Do not reuse an enterprise business folder. The harness never deletes the Base it creates.

## 3. Configure the current local shell securely

Choose an absolute test Home outside `/Users/zhuangguangda/Desktop/content-ops-studio`. Do not use a real project Home. Enter secrets only into the local terminal's current process; `read -s` avoids shell-history exposure.

```bash
export CONTENT_OPS_HOME="/absolute/path/outside-the-repository/content-ops-phase2b1-sandbox"
export CONTENT_OPS_ENABLE_LIVE_FEISHU=1
read -r FEISHU_APP_ID
export FEISHU_APP_ID
read -rs FEISHU_APP_SECRET
export FEISHU_APP_SECRET
read -rs FEISHU_TEST_PARENT_FOLDER_TOKEN
export FEISHU_TEST_PARENT_FOLDER_TOKEN
```

Do not place these values in `.env.example`, another repository file, CLI arguments, screenshots, reports or chat. Never pass `--app-secret`, `--token` or `--authorization`.

## 4. Re-run offline validation

From the repository root under Node `>=24 <25`:

```bash
CI=true pnpm check
CI=true pnpm scan:secrets
```

Both must exit 0 before any network write.

## 5. Run read-only diagnostics

The repository executable in this checkout is:

```bash
CI=true node --import tsx packages/cli/src/bin.ts feishu doctor --probe-auth --json
CI=true node --import tsx packages/cli/src/bin.ts feishu permissions --json
```

Current implementation note: `feishu permissions` validates and prints the checked-in manifest as `DOCUMENTED`; it does not by itself prove tenant-granted scopes. Do not treat that output as live permission evidence. The repeat Phase 2B.1 run must verify the token, app installation, all 13 required scopes and test-folder access before Base creation.

The separate local `feishu-cli` is available at `/Users/zhuangguangda/Documents/Codex/2026-06-28/cli-github/work/bin/feishu-cli` (observed version `1.0.63`) for Operator environment checks, but its user OAuth state must not substitute for the repository's tenant-app credential, gates or evidence.

## 6. Inspect the deterministic dry plan

Generate a system Run ID and Project ID in the repeat run, then use the repository syntax:

```bash
CI=true node --import tsx packages/cli/src/bin.ts feishu workspace plan --project-id '<SYSTEM_PROJECT_ID>' --project-name 'ContentOpsStudio Phase2B1 沙箱测试' --run-id '<SYSTEM_RUN_ID>' --dry-run --json
```

Expected compiler result: four tables, 136 non-relation field operations plus five relation fields (141 Blueprint fields total), five relations, four `NAME_ONLY` views, one project draft record and 150 estimated create/write operations. Save the full plan only under `CONTENT_OPS_HOME`; repository reports may store only counts and the plan hash.

## 7. Run the live sandbox only after preflight passes

The checked script requires pnpm argument separation and both live gates:

```bash
CI=true pnpm feishu:live-test -- --confirm-live-write
```

The environment gate comes from `CONTENT_OPS_ENABLE_LIVE_FEISHU=1`; the CLI confirmation comes from `--confirm-live-write`. Keep the fixed fictional Phase 2B.1 data and title pattern `ContentOpsStudio｜Phase2B1沙箱｜RUN-ID`. A repeat of this Phase 2B.1 instruction must perform Doctor → live permission/folder checks → saved dry plan → provision → inspect/verify → formal G1 approval → replay → safe add-only repair → evidence validation.

Do not use ordinary `FEISHU_PARENT_FOLDER_TOKEN` or the generic `project init` route as a shortcut for the sandbox test-folder requirement.

## 8. Inspect and clean up manually

After evidence is safely retained under `CONTENT_OPS_HOME`, inspect every created test Base in Feishu: title, folder, four tables, field/relation/view counts and fictional record. Manually delete test Bases only after retaining the schema-valid evidence, provisioning state, mapping, journal, write log and checkpoints. No repository command may delete them automatically.
