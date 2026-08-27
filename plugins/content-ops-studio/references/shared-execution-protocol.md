# Shared execution protocol

For Feishu writes, preflight additionally validates self-built-app credentials by presence only, minimum scopes, authorized parent-folder reference, Blueprint/type compilation, project lock and both live gates. Persist the returned Base reference atomically before later writes, verify every operation by read, and checkpoint. Production cannot fall back to Mock.

## Task envelope

```json
{
  "contract_version": "1.0.0",
  "schema_version": "1.0.0",
  "run_id": "RUN-YYYYMMDD-HHMMSS-XXXX",
  "project_id": "PRJ-YYYYMMDD-XXXX",
  "task_type": "CREATE_CONTENT",
  "operation": "CREATE_NEW",
  "source": "conversation",
  "raw_instruction": "Operator current instruction",
  "targets": {
    "painpoint_ids": [],
    "content_ids": [],
    "page_numbers": []
  },
  "overrides": {},
  "approval_event": null,
  "resume": {
    "from_run_id": null,
    "from_step": null
  },
  "dry_run": false
}
```

## Task result

```json
{
  "status": "SUCCESS",
  "skill": "skill-name",
  "run_id": "RUN-ID",
  "project_id": "PROJECT-ID",
  "state_before": {},
  "state_after": {},
  "created_records": [],
  "updated_records": [],
  "artifacts": [],
  "approval_request": null,
  "warnings": [],
  "errors": [],
  "next_route": null
}
```

Allowed top-level results are `SUCCESS`, `PARTIAL`, `AWAITING_APPROVAL`, `BLOCKED`, `CONFLICT`, `FAILED`, and `CANCELLED`.

## Write discipline

For every future external write: read current state → check Schema version → check record version → check field lock → check unique key → write → read again → compare critical fields → record the write log.

Never perform destructive rollback. On partial success, retry only failed side effects. Preserve raw instructions and structured errors without secret material.

## Visual and finalization artifacts

After G3, every visual artifact carries current content, copy, visual-plan, Style Lock, and asset versions as applicable. G4 authorizes Style Lock only for its exact first-page target/version; G5 authorizes a Final Manifest only after current four-layer QA has zero blocking failures. Generation attempts, render reports, QA, approvals, final manifests, and old asset directories are append-only history. Prompt snapshots belong to runtime project data and never to Plugin source; repository fixtures use fictional prompts only.

## Recoverable local execution

Every Run binds a Workflow Definition, Project Runtime Snapshot, and Pack Resolution before executing. A verified write is journaled and never repeated on recovery. Checkpoints are caches tied to the current Journal hash; an intact Journal may rebuild a damaged checkpoint, while a damaged Journal blocks execution. Project locks are owner-bound and stale locks require an explicit recovery reason.

Before Runtime composition or reference-workflow execution, validate the current Runtime against `runtime-support-policy.json`. V0.2.0 permits Node 24 (`>=24 <25`); unsupported and unclaimed majors return stable blocking errors. Runtime evidence and production capability checks remain separate.
