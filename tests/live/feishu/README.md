# Explicit Feishu live harness

This directory marks the separately authorized Feishu China live-integration boundary. Ordinary `pnpm test`, `pnpm check`, and CI do not execute a live test or read Feishu secrets.

Run `pnpm feishu:live-test -- --confirm-live-write` only after configuring the documented tenant-app credentials, `FEISHU_TEST_PARENT_FOLDER_TOKEN`, `CONTENT_OPS_HOME`, and `CONTENT_OPS_ENABLE_LIVE_FEISHU=1`. The harness uses fictional data, leaves its Base for manual cleanup, stores full project-local identifiers only under `CONTENT_OPS_HOME`, and writes only hashes to shareable evidence.

Without every gate, `pnpm feishu:live-test` exits successfully with the explicit `NOT_CONFIGURED` status and zero writes; that is not passing live evidence.
