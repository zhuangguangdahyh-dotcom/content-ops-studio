# Human approval protocol

Five explicit Gates control the workflow:

- G1 `PROJECT_PROFILE`: project data confirmed.
- G2 `PAINPOINTS`: painpoint batch/item decisions confirmed.
- G3 `CONTENT_COPY`: content copy confirmed.
- G4 `FIRST_PAGE`: first rendered page confirmed.
- G5 `FINAL_SET`: complete image set confirmed.

Decisions are `APPROVE`, `REVISE`, `REJECT`, and `PAUSE`. An approval applies only to the named target version. A revision creates a new version and invalidates earlier approval for advancement.

```json
{
  "approval_id": "APR-YYYYMMDD-XXXX",
  "gate": "FIRST_PAGE",
  "targets": [
    {
      "target_id": "C-0001",
      "target_version": "visual-v1",
      "decision": "APPROVE"
    }
  ],
  "comment": "Operator original decision",
  "source_run_id": "RUN-ID",
  "created_at": "ISO-8601"
}
```

Only `content-studio-router` may transform explicit Operator language into an approval event. Specialist Skills never infer satisfaction or approval.

G3 additionally requires a separate `content-copy-review` artifact. Its target type is `CONTENT_PACKAGE`, target ID is the stable Content ID, and target version is `<content_version>:<copy_version>`. APPROVE requires a passing current Quality Report. Any copy change creates a new Copy Version and invalidates the old G3. Approval makes copy eligible for Visual Planning; it never starts visual work.

G4 Style Lock eligibility additionally requires a `CONTENT` target whose ID matches the current content, target version equals the current visual-plan version, decision is `APPROVE`, and `deprecated_at` is empty. G5 Final Manifest eligibility requires an `IMAGE_SET` target, matching final target version, current passed QA, zero blocking failures, complete assets, and safe checksums. An earlier approval is historical evidence, never authorization for a new version.

The local Approval Processor appends idempotent decisions to `approvals.jsonl` and the Run Journal. The same approval ID with different content is a conflict. Deprecated, stale, wrong-gate, wrong-target, wrong-version, wrong-source-Run, or non-Router commands cannot resume a Run. `REVISE`, `REJECT`, and `PAUSE` preserve artifacts and do not become inferred approval.
