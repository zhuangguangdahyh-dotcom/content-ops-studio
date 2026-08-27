# ADR-0050: Calibration G4 approval and non-template Style Lock

- Status: Accepted
- Date: 2026-08-26

## Context

The verified calibration FPV-2 was awaiting an explicit Operator decision. The generic G4 Runtime already enforced version/checksum binding and one Style Lock, but Calibration evidence also needed to preserve the distinction between reusable design/QA logic and a forbidden Universal copy of one Cover.

## Decision

Use the generic `ApprovalEvent` and `FirstPageRuntime` as state authority. Add strict Calibration approval, Calibration Style Lock and Universal Visual Calibration validation envelopes. Widen the existing First-page Review and Style Lock project-reference pattern to accept isolated `CAL-*` calibration projects without relaxing any version, checksum or approval invariant.

Calibration Style Lock V1 has four rule groups. Its Universal-template flag is false and it explicitly excludes layout, color, storefront, title position, crop and `TYPE_DOMINANT`. `CALIBRATION_VALIDATED_V1` applies only to rules, knowledge, QA and decision systems.

All approval artifacts use immutable write-once-or-reuse behavior. Remaining-page eligibility is a state outcome; generation remains a separate future action.

## Consequences

- The existing FPV-2 and all historical assets remain byte-identical.
- The Operator approval is auditable and bound to seven formal QA artifacts.
- A replay creates no second event or Style Lock.
- Calibration approval does not modify C-0001, Feishu, long-term profiles, industry packs or Universal templates.
