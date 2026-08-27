# Phase 2C MCP live tool evidence

Status: PASSED. Date: 2026-08-24. Evidence ID: `MCP-LIVE-908BCE45B73D5CDF`.

The test reused the one retained fictional Phase 2B.2 sandbox and external `CONTENT_OPS_HOME`. Complete project, Run, Base, table, field, view and record identifiers remain only in that Home. Repository evidence contains counts/status only.

## Calls and results

Fourteen SDK MCP calls completed successfully: Doctor; Feishu Check; List Projects; Get Project; Inspect; Verify; Repair Plan; Apply Repair; Run Status; Pending Approvals; Initialization Plan; idempotent Initialize; post-replay Inspect; and post-replay Verify.

- Doctor: SUCCESS; Node 24 and official Lark CLI ready.
- Feishu check: SUCCESS; supported 1.0.63 CLI, user OAuth and all 13 required Base scopes ready; one attachment scope deferred.
- Workspace Verify: `MATCH` before and after replay.
- Repair Plan: zero safe operations, add-only.
- Apply Repair: `PASSED_NO_OP`; no remote mutation attempted.
- Pending approvals: zero because existing G1 is already approved.
- Initialization replay: SUCCESS with the exact existing Project, Run and canonical Profile.
- Table/field/relation/view/record counts: unchanged across replay.
- Controlled MCP write-tool calls: 1 initialization replay plus the repair no-op call.
- Remote mutations: 0.
- New Bases: 0. Deleted resources: 0. Duplicate tables/fields/relations/views/records: 0.

The first diagnostic-only live attempt exposed an installed-copy Doctor composition issue and was not accepted. After the local fix and regression tests, the strict harness required every tool to return SUCCESS and the complete sequence above passed.

`manual_cleanup_required=true` because the pre-existing single sandbox Base remains intentionally retained. Phase 2C created no cleanup asset. The Operator should inspect and manually delete the same sandbox only after preserving external Phase 2B.2/2C evidence.
