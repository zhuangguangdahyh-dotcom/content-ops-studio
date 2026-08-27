# Stage 10 Finalization MCP tool catalog

Total Plugin tools after Stage 10: 71.

- `content_ops_plan_finalization`: read-only eligibility and exact binding plan.
- `content_ops_finalize_delivery`: explicit-confirmation local write; immutable Manifest, Delivery, integrity and archive.
- `content_ops_get_finalization_status`: read-only evidence-backed state.
- `content_ops_verify_final_delivery`: read-only fingerprint currentness check.

All inputs use strict Zod objects and reject unknown keys. The tools expose no raw shell, browser, arbitrary network, raw Feishu, credential, delete, ImageGen or Renderer operation. Production has no Mock fallback.
