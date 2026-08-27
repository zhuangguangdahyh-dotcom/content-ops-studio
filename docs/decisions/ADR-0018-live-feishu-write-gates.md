# ADR-0018: Live Feishu write gates

Status: Accepted  
Date: 2026-08-24

## Decision

All real writes default off and require both `CONTENT_OPS_ENABLE_LIVE_FEISHU=1` and CLI `--confirm-live-write`. Dry-run never writes. The sandbox harness additionally requires `FEISHU_APP_ID`, `FEISHU_APP_SECRET` and `FEISHU_TEST_PARENT_FOLDER_TOKEN`. It uses fictional content, stores complete identifiers only under the chosen project home, reports hashes in repository evidence, and never auto-deletes the test Base.

Live tests are excluded from ordinary tests and CI. Missing configuration returns `NOT_CONFIGURED`, not pass or skip-success. A later authorized live CI must be separately reviewed.

## Consequences

Accidental external writes require two independent mistakes. Manual sandbox cleanup is explicit. Offline implementation can succeed, but Workspace readiness stays `UNVERIFIED` until live evidence passes.
