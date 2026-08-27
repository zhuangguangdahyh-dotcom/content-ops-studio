# Phase 4B Renderer MCP tool catalog

| Tool                                     | Goal / principal output           | Annotation              | Write boundary                      | Live evidence  |
| ---------------------------------------- | --------------------------------- | ----------------------- | ----------------------------------- | -------------- |
| `content_ops_get_renderer_status`        | Managed-browser readiness         | read-only, closed world | none                                | PASSED         |
| `content_ops_setup_renderer`             | Fixed Chromium setup plan         | write, open world       | controlled cache; confirmation      | PASSED         |
| `content_ops_plan_first_page_production` | Version/hash-bound dry-run plan   | read-only, closed world | none                                | PASSED         |
| `content_ops_render_first_page`          | One PNG plus bounded evidence     | write, open world       | external Project Home; confirmation | PASSED         |
| `content_ops_get_first_page_asset`       | Current FPV/checksum/path summary | read-only, closed world | none                                | PASSED         |
| `content_ops_verify_first_page`          | File/report/QA/G4 verification    | read-only, closed world | none                                | PASSED         |
| `content_ops_plan_first_page_revision`   | Classified dry-run revision       | read-only, closed world | none                                | OFFLINE PASSED |
| `content_ops_submit_first_page_review`   | Persist checksum-bound Review     | write, closed world     | local artifact only                 | AWAITING G4    |

All tools have strict Zod input/output envelopes and stable bounded errors. No arbitrary Browser, navigation, screenshot, HTML, CSS, JavaScript, shell, file, raw Feishu, delete or image-model tool was added. Total: 47; read: 32; write: 15.
