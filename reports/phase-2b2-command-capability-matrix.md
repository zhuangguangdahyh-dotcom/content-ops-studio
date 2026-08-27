# Phase 2B.2 command capability matrix

| Capability                   | Contract status                | Live evidence                                              | Result / boundary        |
| ---------------------------- | ------------------------------ | ---------------------------------------------------------- | ------------------------ |
| Config and OAuth status      | Implemented                    | Authenticated user identity                                | LIVE_VERIFIED            |
| Exact required scopes        | 13 required, 1 deferred        | 13 passed, 0 missing                                       | LIVE_VERIFIED            |
| Base create/get              | Typed official CLI             | One Base created and read                                  | LIVE_VERIFIED            |
| Folder placement             | Typed `--folder-token` support | Dedicated sandbox location used                            | LIVE_VERIFIED            |
| Table list/get/create/update | Typed official CLI             | 4 target tables; no duplicates                             | LIVE_VERIFIED            |
| Field list/get/create/update | Typed official CLI             | 141 Blueprint fields mapped                                | LIVE_VERIFIED            |
| Relation fields              | Typed field create             | 5 Blueprint relations; 2 platform reverse fields preserved | LIVE_VERIFIED            |
| View list/create             | `NAME_ONLY` only               | 4 named views plus 4 platform defaults                     | LIVE_VERIFIED            |
| Record search/get/upsert     | Typed official CLI             | 1 unique project record and G1 readback                    | LIVE_VERIFIED            |
| Batch record policy          | Integration cap 200            | One-record live write only; max batch not stress-tested    | IMPLEMENTED_OFFLINE      |
| Read-after-write             | Required by Adapter            | Base, schema, record and G1 verified                       | LIVE_VERIFIED            |
| Idempotent replay            | Runtime-owned                  | Same input replay returned SUCCESS, no duplicates          | LIVE_VERIFIED            |
| Add-only Repair              | Default dry-run                | MATCH, 0 repairs, 0 conflicts, 0 writes                    | LIVE_VERIFIED_NO_OP      |
| Rate-limit retry             | Implemented                    | No live rate limit encountered                             | IMPLEMENTED_OFFLINE      |
| Raw API fallback             | Disabled by default            | Not used                                                   | BLOCKED_BY_POLICY        |
| Delete operations            | Closed allowlist rejection     | Not used                                                   | DENIED                   |
| Attachment upload            | Deferred                       | Not run                                                    | DEFERRED_TO_FUTURE_PHASE |

The exact tested contract is official CLI 1.0.63. Current npm stable 1.0.89 is documented but remains unclaimed until a separate capability probe and regression run. Official risk controls remained enabled.
