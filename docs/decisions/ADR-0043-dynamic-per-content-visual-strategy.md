# ADR-0043: Dynamic per-content visual strategy

- Status: Accepted
- Date: 2026-08-25

## Decision

Image Production resolves a Dynamic Visual Strategy for every Content before channel, Visual Mode, candidate count or layout decisions. The input includes Project, Subject, Audience, platform, Industry Pack/overlays, Project Visual Profile, confirmed global preferences, current painpoint/Content/page roles, current Operator request, authorized/evidence assets, approved/rejected references, gate/feedback/rule history and cost/time/quality constraints.

Visual Mode is a composable primitive and Industry Pack is an industry prior plus risk boundary. Neither is a final style template. Per-content strategy makes the final decision within safety, authenticity, authorization and confirmed Project boundaries. A current explicit Operator request outranks compatible defaults for that Run and does not mutate long-term state.

Profile maturity controls exploration: COLD_START produces two or three content-derived directions, LEARNING produces one or two, compatible MATURE defaults to one formal first-page direction, and REVIEW_REQUIRED blocks reuse. Candidate letters have no fixed channel meaning. Material difference may come from subject, view, scale, axis, evidence behavior, composition or visual argument even when channels match.

Strategy synthesis is read-only. Project learning requires Feedback Event → Rule Candidate → explicit confirmation, creates a new immutable Profile version and never edits an Industry Pack or global preference. Revoke/forget preserve historic rule/Profile bindings and remove the rule from future active resolution.

## Consequences

Plans must expose detailed page routing, typography, color/effects, quantities, batches, thresholds, confidence, ambiguity and decision reasons. Tests must compare different industries and content, exercise all maturity states, prove precedence and current-set override, and verify cross-Run confirmation/revoke behavior in a separate fictional Project Home.
