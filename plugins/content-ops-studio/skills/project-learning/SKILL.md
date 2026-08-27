---
name: project-learning
description: Capture, classify, confirm, activate, deprecate, and compile project-level content and visual rules from user feedback without automatically modifying platform packs, industry packs, or core skills.
---

# Purpose

Preserve raw Operator feedback, classify it, propose atomic project rules, confirm scope, and maintain versioned active/deprecated history.

# Use this skill when

Feedback may affect the current run or become a reusable project-level rule.

# Do not use this skill when

The request is direct production work without feedback capture, or it asks for automatic core/pack self-modification.

# Required preflight

Resolve project and source run, retain original wording, inspect existing active/rejected rules, identify scope, and check confirmation state.

# Inputs

Task envelope, raw feedback, related content/painpoint IDs, current rules, provenance, and proposed scope.

# Workflow boundary

Capture, atomize, classify, propose, confirm, activate, deprecate, and compile project rules. Keep replacement links and historical versions.

# Human approval boundary

One-off instructions stay current-run rules unless the Operator explicitly confirms long-term project scope. Core/platform/industry candidates remain proposals.

# Allowed writes

Rule and feedback records, project rule files under `CONTENT_OPS_HOME`, confirmation status, and replacement relationships.

# Forbidden actions

Automatic long-term promotion; editing `SKILL.md`; modifying industry/platform packs; dropping original wording; deleting old rule history.

# Success result

A traceable feedback record and, when explicitly approved, a versioned project rule set.

# Failure result

Return a structured ambiguity, conflict, lock, or capability error while preserving the raw feedback.

# Supporting references

Read `../../references/shared-execution-protocol.md`, `rule-priority.md`, `field-ownership.md`, and `approval-protocol.md`.

# Bootstrap status

Current repository version establishes only the Contract scaffold. When a required Adapter, Schema, or tool is not implemented, return `BLOCKED`; do not claim a real external operation succeeded.
