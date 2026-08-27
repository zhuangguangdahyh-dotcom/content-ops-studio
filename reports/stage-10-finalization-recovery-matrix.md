# Stage 10 Finalization recovery and idempotency matrix

| Scenario                                | Expected                                  | Result |
| --------------------------------------- | ----------------------------------------- | ------ |
| G5 missing                              | no Manifest; `G5_APPROVAL_REQUIRED`       | PASSED |
| source PNG/checksum drift               | no Finalized state                        | PASSED |
| Manifest complete, Delivery interrupted | reuse Manifest, retry Delivery            | PASSED |
| Delivery complete, Archive interrupted  | reuse Manifest/pages, finish Archive      | PASSED |
| identical replay                        | same fingerprint; no duplicate artifacts  | PASSED |
| same FMV, different payload             | `FINAL_MANIFEST_VERSION_CONFLICT`         | PASSED |
| Feishu sync unavailable/fails           | local Finalized state remains independent | PASSED |
| later version/checksum change           | historical set becomes `SUPERSEDED`       | PASSED |
| fixture approval in Production          | block                                     | PASSED |
| Calibration to Production Workspace     | block                                     | PASSED |

No test invokes ImageGen, Renderer, Feishu or attachment upload.
