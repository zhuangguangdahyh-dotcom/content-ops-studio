# Phase 4B Renderer Schema inventory

All eight additive Schemas are strict, cataloged, fixture-tested and TypeScript-generated. The repository total is 89 Schemas and 90 generated files including the index.

| Schema / `$id` suffix         | Generated TypeScript               | Valid fixture | Invalid fixtures   | Owner    | Status |
| ----------------------------- | ---------------------------------- | ------------- | ------------------ | -------- | ------ |
| renderer-config               | `renderer-config.ts`               | complete      | missing/additional | Renderer | PASSED |
| renderer-capability-report    | `renderer-capability-report.ts`    | complete      | missing/additional | Renderer | PASSED |
| renderer-environment-evidence | `renderer-environment-evidence.ts` | complete      | missing/additional | Renderer | PASSED |
| render-template-manifest      | `render-template-manifest.ts`      | complete      | missing/additional | Renderer | PASSED |
| first-page-production-plan    | `first-page-production-plan.ts`    | complete      | missing/additional | Runtime  | PASSED |
| first-page-production-report  | `first-page-production-report.ts`  | complete      | missing/additional | Runtime  | PASSED |
| first-page-review             | `first-page-review.ts`             | complete      | missing/additional | Runtime  | PASSED |
| first-page-revision-plan      | `first-page-revision-plan.ts`      | complete      | missing/additional | Runtime  | PASSED |

Every `$id` is `https://content-ops-studio.local/schemas/1.0/<name>.schema.json`. Existing Generation Manifest, Render Report, QA Report, Approval Event, Style Lock and common asset-source contracts were changed additively; Ajv strict and `additionalProperties` remain enforced.
