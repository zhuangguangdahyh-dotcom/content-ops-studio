# Phase 3B Content Duplication Matrix

| Case                                     | Evidence                                                    | Blocking                                                | Result                             |
| ---------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------- |
| Exact candidate versus prior Content     | Stable normalized fingerprint; no prior match before create | Yes when matched                                        | LOW / PASSED                       |
| Near semantic                            | Host-reasoned assessment; no embedding claim                | HIGH only                                               | LOW / PASSED                       |
| Same Painpoint                           | One current C-0001 for P-0001                               | Alternate requires material angle/conclusion difference | PASSED                             |
| Alternate angle                          | Fixed-angle dry-run plan                                    | Must not write remotely                                 | PASSED; 0 writes                   |
| Same-Run idempotent recovery             | Existing C-0001 found and relation-normalized verified      | No; recovery, not duplicate                             | PASSED; reused 1                   |
| Final replay after G3                    | Approved remote version/fingerprint/status re-read          | Conflicts block                                         | PASSED; 0 mutations                |
| Different request, identical fingerprint | Different Run/request with C-0001 fingerprint               | Yes                                                     | `CONTENT_DUPLICATION_BLOCKED`      |
| P-0003 / P-0005 boundary                 | Non-confirmed Painpoints rejected before write              | Yes                                                     | `PAINPOINT_NOT_CONFIRMED` for both |

The final remote Content count is exactly one. No duplicate row was created during recovery, approval, approval replay, finalization replay or different-request duplicate testing, and no remote record was deleted.
