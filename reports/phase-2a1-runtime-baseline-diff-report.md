# Phase 2A.1 Runtime Baseline Diff Report

## Approved correction

The original current policy declared Node 20+ and treated unavailable Node 20 execution as a repository compatibility blocker. ADR-0014 replaces it with one bounded V0.1.0 baseline: Node 24 LTS, `>=24 <25`. Node 20 is upstream EOL and unsupported; Node 22/25/26 are unclaimed without an incompatibility claim.

## Contract and implementation changes

- Added generic Runtime Evidence Schema, generated declaration, valid/invalid fixtures, semantic validation, collection, and evidence validation.
- Corrected unpublished Runtime Config with required policy, enforcement, and unclaimed-version controls.
- Corrected unpublished Runtime Diagnostic by replacing `node20_evidence` with generic policy, evidence, current Runtime, lifecycle, and split-readiness fields.
- Added stable `UNSUPPORTED_RUNTIME`, `UNCLAIMED_RUNTIME`, `RUNTIME_VERSION_MISMATCH`, `RUNTIME_EVIDENCE_MISSING`, and `RUNTIME_POLICY_INVALID` errors.
- Enforced the policy in Config, Composition Root, reference Runtime construction, and non-Doctor CLI execution. Doctor diagnoses unsupported/unclaimed Runtime versions instead of failing before it can report them.

## Script and command changes

The obsolete `scripts/probe-node20-evidence.ts` and `pnpm node20:probe` were deleted because this repository is unpublished and has no external command consumer. They were replaced by:

- `pnpm runtime-policy:validate`
- `pnpm runtime-evidence:collect`
- `pnpm runtime-evidence:validate`

Evidence collection never installs or downloads a Runtime and never stores command output bodies.

## CI and distribution changes

All three workflows now use explicit Node 24 and current official Action v7 configuration. The main CI matrix covers Ubuntu and macOS. Root engines and version-manager files agree on major 24. Plugin version remains 0.1.0; no license, remote, release, or publish configuration changed.

CI configuration is not presented as executed CI evidence. The distribution support surface is intentionally narrower than `>=20` and does not include untested future majors.

## Documentation and historical evidence

Current policy, installation, architecture, testing, security, release, roadmap, Plugin reference, Runtime, and CLI documents were updated. Historical Phase 1A/1B/2A reports keep their original dates and results; addenda point to ADR-0014 and explain why Node 20 is no longer a current blocker. The historical Node 20 machine evidence remains untouched and is not reinterpreted as generic Runtime Evidence.

## Compatibility impact

Node 24 patches from 24.0.0 through the bounded major are supported by policy. Node 20/23 are blocked as unsupported. Node 22/25/26 are blocked by default as unclaimed and can be used only by explicit test/development override; this does not create a production support claim.

No material deviations beyond the approved Node Runtime policy correction.
