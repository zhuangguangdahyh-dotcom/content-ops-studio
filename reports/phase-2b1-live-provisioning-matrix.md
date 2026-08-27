# Phase 2B.1 Live Provisioning Matrix

Date: 2026-08-24. Status: `NOT_CONFIGURED`. Remote identifier hashes are absent because no remote resource exists.

| Phase | Remote operation            | Expected                                  | Actual                                    | Remote identifier hash | Read verification         | Retry | Result  |
| ----- | --------------------------- | ----------------------------------------- | ----------------------------------------- | ---------------------- | ------------------------- | ----- | ------- |
| 0     | Configuration gate          | Four credentials/Home plus both gates     | Required environment configuration absent | n/a                    | Presence-only local check | none  | BLOCKED |
| 1     | Tenant token                | Valid self-built tenant token             | Not attempted                             | n/a                    | Not run                   | none  | NOT_RUN |
| 2     | Required permissions/folder | 13 required scopes and test-folder access | Not attempted                             | n/a                    | Not run                   | none  | NOT_RUN |
| 3     | Create/get Base             | One dedicated sandbox Base                | No Base created                           | n/a                    | Not run                   | none  | NOT_RUN |
| 4     | Default table               | Safely adopt one blank table              | Not attempted                             | n/a                    | Not run                   | none  | NOT_RUN |
| 5     | Tables                      | Four target tables                        | 0 remote tables                           | n/a                    | Not run                   | none  | NOT_RUN |
| 6     | Non-relation fields         | 136 operations                            | 0 remote fields                           | n/a                    | Not run                   | none  | NOT_RUN |
| 7     | Relations                   | Five fields after table IDs               | 0 remote relations                        | n/a                    | Not run                   | none  | NOT_RUN |
| 8     | Views                       | Four `NAME_ONLY` views                    | 0 remote views                            | n/a                    | Not run                   | none  | NOT_RUN |
| 9     | Project record              | One fictional pending draft               | 0 remote records                          | n/a                    | Not run                   | none  | NOT_RUN |
| 10    | G1 pause                    | `AWAITING_APPROVAL`                       | Not reached                               | n/a                    | Not run                   | none  | NOT_RUN |
| 11    | G1 activation               | Explicit approval and remote readback     | Not attempted                             | n/a                    | Not run                   | none  | NOT_RUN |
| 12    | Idempotent replay           | No duplicates                             | Not attempted                             | n/a                    | Not run                   | none  | NOT_RUN |
| 13    | Add-only repair             | One safe add then no-op                   | Not attempted                             | n/a                    | Not run                   | none  | NOT_RUN |

The local dry compiler plan was `FWP-89B3F78792010D76` with 150 estimated operations, but it is not a remote operation and is not counted as live evidence.
