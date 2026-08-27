# Calibration Content version repair

Calibration Content repair exists only for fictional local `CAL-*` projects. It creates a new semantic Content/Copy version and never rewrites an older approved chain.

The Step A command is:

```bash
CONTENT_OPS_HOME=/absolute/path/outside/the/repository pnpm calibration-content:repair
```

The command validates the complete legacy Cover/G4/Style Lock binding and checksums, validates the exact six-page CV-2 package, runs thirteen Content QA checks and writes three immutable artifacts under the new Run's `content/` directory:

- `content-quality-report.json`
- `content-package.json`
- `calibration-g3-review-request.json`

The request stops at `AWAITING_USER_APPROVAL / PENDING_OPERATOR`. It creates no Approval Event, Visual Plan, First Page asset, G4, Style Lock, remaining page, Renderer call, ImageGen call or Feishu write. An identical replay reuses the same bytes; a different payload at the same target returns `CALIBRATION_CONTENT_ARTIFACT_VERSION_CONFLICT`.

The CAL wrapper is never a Production Content Package. `production_workspace_write_eligible` is always false, and the canonical `PRJ-*` contracts remain unchanged.
