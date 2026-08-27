# Phase 1B Schema inventory

Contract version: 1.0.0  
Schema version: 1.0.0  
Phase 1B implemented: 7  
Phase 1B planned: 0

All sources use JSON Schema Draft 2020-12, strict closed roots, controlled `extensions`, canonical cross-file references, generated TypeScript, and fictional fixtures.

| Schema              | `$id`                                                                          | Source                                                                   | Status      | TypeScript output                                             | Valid fixtures | Invalid fixtures | Owner domain |
| ------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------- | -------------: | ---------------: | ------------ |
| visual-system       | `https://content-ops-studio.local/schemas/1.0/visual-system.schema.json`       | `plugins/content-ops-studio/schemas/1.0/visual-system.schema.json`       | implemented | `packages/contracts/src/generated/1.0/visual-system.ts`       |              1 |                6 | visual       |
| page-visual-plan    | `https://content-ops-studio.local/schemas/1.0/page-visual-plan.schema.json`    | `plugins/content-ops-studio/schemas/1.0/page-visual-plan.schema.json`    | implemented | `packages/contracts/src/generated/1.0/page-visual-plan.ts`    |              1 |                6 | visual       |
| style-lock          | `https://content-ops-studio.local/schemas/1.0/style-lock.schema.json`          | `plugins/content-ops-studio/schemas/1.0/style-lock.schema.json`          | implemented | `packages/contracts/src/generated/1.0/style-lock.ts`          |              1 |               14 | visual       |
| generation-manifest | `https://content-ops-studio.local/schemas/1.0/generation-manifest.schema.json` | `plugins/content-ops-studio/schemas/1.0/generation-manifest.schema.json` | implemented | `packages/contracts/src/generated/1.0/generation-manifest.ts` |              1 |               12 | production   |
| render-report       | `https://content-ops-studio.local/schemas/1.0/render-report.schema.json`       | `plugins/content-ops-studio/schemas/1.0/render-report.schema.json`       | implemented | `packages/contracts/src/generated/1.0/render-report.ts`       |              1 |               11 | production   |
| qa-report           | `https://content-ops-studio.local/schemas/1.0/qa-report.schema.json`           | `plugins/content-ops-studio/schemas/1.0/qa-report.schema.json`           | implemented | `packages/contracts/src/generated/1.0/qa-report.ts`           |              1 |               10 | production   |
| final-manifest      | `https://content-ops-studio.local/schemas/1.0/final-manifest.schema.json`      | `plugins/content-ops-studio/schemas/1.0/final-manifest.schema.json`      | implemented | `packages/contracts/src/generated/1.0/final-manifest.ts`      |              1 |               16 | production   |

The full visual-workflow bundle adds one valid end-to-end fixture and ten invalid cross-artifact chains. Phase 1B therefore has 8 valid visual/finalization fixtures and 85 invalid visual/finalization fixtures when the workflow bundle is included. The full contract fixture tree contains 217 files.
