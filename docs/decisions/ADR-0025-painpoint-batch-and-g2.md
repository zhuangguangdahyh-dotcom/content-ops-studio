# ADR-0025: Review painpoints item by item at G2

Status: Accepted  
Date: 2026-08-24

## Context

A research batch can contain strong, weak, revisable, and rejected painpoints at the same time. A single batch-level approval would lose those distinctions and could overwrite review history.

## Decision

Finalization writes an idempotent painpoint batch, performs read-after-write verification, persists remote mappings and then pauses at G2 `PAINPOINTS`. Review uses the existing `content_ops_submit_approval` entry point with an explicit item-decision artifact. Every item decision binds the painpoint ID, version, source Run, decision, and optional revision note. APPROVE maps to `PAINPOINT_CONFIRMED`, REVISE to `PAINPOINT_REVISION_REQUIRED`, REJECT to `PAINPOINT_REJECTED`, and PAUSE to `PAINPOINT_PAUSED`.

Only approved items become eligible for later content planning. Revision, rejection, and pause never delete records or history. Replayed finalization and review use stable unique keys and must not create duplicate painpoints or duplicate approval effects.

## Consequences

G2 supports partial acceptance without losing evidence or rejected directions. Recovery resumes from retained artifacts, and later content phases can consume only explicitly confirmed painpoints.
