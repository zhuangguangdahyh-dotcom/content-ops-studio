# Error codes

| Code                       | Meaning                                                        |
| -------------------------- | -------------------------------------------------------------- |
| `INPUT_MISSING`            | A required input is absent.                                    |
| `PROJECT_NOT_RESOLVED`     | No single project was resolved.                                |
| `PROJECT_NOT_CONFIRMED`    | G1 or confirmed project state is missing.                      |
| `WORKSPACE_NOT_READY`      | Required workspace structures are unavailable.                 |
| `SCHEMA_MISMATCH`          | Contract and data Schema versions differ.                      |
| `INVALID_STATE`            | The requested transition is illegal.                           |
| `LOCKED_FIELD`             | The operation would overwrite an owned or approved field.      |
| `CONFLICT_DETECTED`        | Version, unique key, or concurrent state conflicts.            |
| `TOOL_UNAVAILABLE`         | A required tool or Adapter capability is absent.               |
| `PERMISSION_DENIED`        | The Operator or integration lacks permission.                  |
| `INSUFFICIENT_EVIDENCE`    | Research evidence is too weak for the claim.                   |
| `DUPLICATE_RISK`           | The proposed record substantially duplicates existing work.    |
| `UNSUPPORTED_CLAIM`        | Copy relies on an unsupported claim.                           |
| `GENERATION_FAILED`        | Background generation failed.                                  |
| `RENDER_FAILED`            | Deterministic rendering failed.                                |
| `QA_FAILED`                | Final quality requirements failed.                             |
| `SYNC_PARTIAL`             | Some synchronization side effects succeeded and others failed. |
| `USER_APPROVAL_REQUIRED`   | A version-matched human Gate is required.                      |
| `UNSUPPORTED_REQUEST`      | The request is outside supported scope.                        |
| `UNSUPPORTED_RUNTIME`      | The current Runtime is explicitly outside project policy.      |
| `UNCLAIMED_RUNTIME`        | The project has no compatibility claim for this Runtime.       |
| `RUNTIME_VERSION_MISMATCH` | Runtime, version files, CI, or evidence disagree.              |
| `RUNTIME_EVIDENCE_MISSING` | Required actual execution evidence is absent or incomplete.    |
| `RUNTIME_POLICY_INVALID`   | Runtime policy is missing, malformed, or contradictory.        |

Error objects use:

```json
{
  "code": "INVALID_STATE",
  "message": "Readable error description",
  "retryable": false,
  "scope": "content:C-0001",
  "recommended_action": "Explicit recovery action"
}
```

Runtime adds stable operational categories surfaced through `RuntimeFailure`: invalid input/path/Home (`5`), blocked capability or production boundary (`2`), lock/idempotency/stale-approval conflict (`3`), execution failure (`4`), and Journal/checkpoint/registry corruption (`6`). CLI output redacts secret-like values and never maps a real failure to exit `0`.

`NODE20_NOT_AVAILABLE` and `NODE20_COMPATIBILITY_BLOCKER` are obsolete and must not be used for current decisions. Node 20 is represented through the generic policy/evidence combination `UPSTREAM_EOL` plus `NOT_REQUIRED`.

Phase 2B adds stable Feishu categories: `FEISHU_CONFIG_MISSING`, `FEISHU_CREDENTIALS_MISSING`, `FEISHU_AUTH_FAILED`, `FEISHU_TOKEN_INVALID`, `FEISHU_PERMISSION_DENIED`, `FEISHU_PERMISSION_MISSING`, `FEISHU_RATE_LIMITED`, `FEISHU_REQUEST_TIMEOUT`, `FEISHU_API_ERROR`, `FEISHU_RESPONSE_INVALID`, `FEISHU_SCHEMA_DRIFT`, `FEISHU_FIELD_TYPE_UNSUPPORTED`, `FEISHU_RELATION_CONFLICT`, `FEISHU_RECORD_CONFLICT`, `FEISHU_VIEW_CAPABILITY_LIMITED`, `FEISHU_ORPHAN_WORKSPACE`, `FEISHU_DUPLICATE_WORKSPACE_CANDIDATES`, `FEISHU_LIVE_WRITE_DISABLED`, `FEISHU_LIVE_WRITE_NOT_CONFIRMED`, `FEISHU_LIVE_TEST_NOT_CONFIGURED`, and `FEISHU_ATTACHMENT_UPLOAD_DEFERRED`. Each carries `code`, redacted `message`, `retryable`, `scope`, `recommended_action`, and `redacted_remote_code`.
