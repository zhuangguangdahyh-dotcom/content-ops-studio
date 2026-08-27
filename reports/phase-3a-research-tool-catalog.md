# Phase 3A Research Tool Catalog

| Tool                                      | User goal                                      | Core input/output                               | Annotations             | Handler and write scope                          | Live evidence |
| ----------------------------------------- | ---------------------------------------------- | ----------------------------------------------- | ----------------------- | ------------------------------------------------ | ------------- |
| `content_ops_get_research_context`        | Check confirmed Profile and research readiness | Project ID → role/profile/Pack summary          | read-only, closed-world | Context/Profile read                             | PASSED        |
| `content_ops_plan_painpoint_research`     | Create a Run-bound no-write plan               | scope, counts, queries → strict plan/hash       | read-only, closed-world | local atomic plan/session                        | PASSED        |
| `content_ops_submit_research_sources`     | Retain Host/manual citations                   | bounded sources → manifest/evidence             | write, open-world       | external Project Home only; no fetch             | PASSED        |
| `content_ops_submit_painpoint_candidates` | Validate and score candidates                  | candidate/evidence refs → local records/scoring | write, closed-world     | external Project Home only                       | PASSED        |
| `content_ops_finalize_painpoint_research` | Write verified pending painpoints              | plan/report confirmation → G2 request           | write, open-world       | existing Feishu painpoint table plus local audit | PASSED        |
| `content_ops_list_painpoints`             | List project painpoints                        | Project ID → logical rows                       | read-only, closed-world | Feishu read                                      | PASSED        |
| `content_ops_get_painpoint`               | Read one painpoint                             | Project/Painpoint IDs → logical row             | read-only, closed-world | Feishu read                                      | PASSED        |
| `content_ops_verify_painpoint_batch`      | Read-verify the retained batch                 | Project/Run IDs → verified/failed counts        | read-only, closed-world | Feishu reads plus local batch                    | PASSED        |

All tools have a title, description, strict Zod input, strict result-envelope output, stable structured errors and non-destructive annotations. Representative errors include unsafe source location, insufficient evidence, B-source independence, count reason required, idempotency conflict, stale G2 versions, missing mapping, live-write gate and read-after-write failure.

The total server catalog is 23 tools: 15 read-only, 8 write; 7 are open-world. No arbitrary search, fetch, browser, shell, file, raw Feishu, credential or delete capability is registered.
