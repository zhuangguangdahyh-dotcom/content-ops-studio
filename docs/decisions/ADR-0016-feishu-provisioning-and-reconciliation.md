# ADR-0016: Feishu provisioning and reconciliation

Status: Accepted  
Date: 2026-08-24

## Decision

Provisioning is a checkpointed plan: preflight, lock, create/adopt Base, immediately persist its reference, safely reuse the returned blank default table as `01 项目配置`, create the remaining tables, create non-relation fields, create relations after all table IDs exist, create name/type views, write a pending project draft, read-verify and pause at G1.

A crash after remote Base creation but before local persistence is recovered by inspecting same-title candidates in the authorized folder. Ambiguous candidates are `FEISHU_ORPHAN_WORKSPACE` or `FEISHU_DUPLICATE_WORKSPACE_CANDIDATES`; a second Base is not created. Reconciliation emits matching/missing/extra/conflicting sets. Repair may only add missing tables, fields, relations, views or owned draft values and refresh mappings. It never deletes or overwrites remote history, extra objects or user fields. Type conflicts require a manual decision.

## Consequences

Recovery can resume from stored operations and remote state. Remote clutter may require manual cleanup; this is intentional protection against destructive rollback.
