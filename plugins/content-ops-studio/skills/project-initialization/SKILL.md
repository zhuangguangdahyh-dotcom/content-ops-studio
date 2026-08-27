---
name: project-initialization
description: Structure a new or existing client content project, prepare its local workspace contract, and plan or validate its Feishu content workspace without creating painpoints, content, or images.
---

# Purpose

Define and validate project identity, Subject and Audience profiles, local project-location contracts, and the production Feishu Workspace lifecycle.

# Use this skill when

The Operator needs DISCOVER, PROVISION, UPDATE, REPAIR, or MIGRATE behavior for a project workspace.

# Do not use this skill when

The request is research, content production, visual work, finalization, or feedback learning for an already active project.

# Required preflight

Resolve operation, permissions, project ID, Schema version, unique keys, existing workspace state, and available Workspace/AssetStore capabilities.

For `DISCOVER`, call `content_ops_plan_project_initialization`, then compile a `project-profile-gap-report`. Keep Operator, Subject and Audience fields separate. Ask only material blockers, in a small answerable group; do not repeat known information. Mark every automatic value as `inferred` until the Operator confirms it. An existing active project uses its current profile and only asks about material change; a major change sets `CONFIG_UPDATE_REQUIRED` instead of silently changing confirmed facts.

# Inputs

Task envelope, project profile draft, operation, existing workspace summary, field map, and capability report.

# Workflow boundary

Route `DISCOVER`, `PROVISION`, `UPDATE`, `INSPECT`, `VERIFY`, `REPAIR`, and `MIGRATE` through Runtime. Production Feishu writes are allowed only through the Adapter after both live gates. `REPAIR` is add-only and `MIGRATE` needs explicit non-destructive approval.

For the bundled MCP path, follow this exact sequence: call `content_ops_doctor`; if Feishu is not authorized, call `content_ops_start_feishu_setup`; call `content_ops_plan_project_initialization` for every new project; only after explicit Operator confirmation call `content_ops_initialize_project`; stop when it returns the G1 approval request and show that request to the Operator; only after an explicit version-matched decision call `content_ops_submit_approval`; then call `content_ops_resume_run`; finish with `content_ops_verify_workspace`. Never skip the plan, infer G1, or turn a tool error into success.

# Human approval boundary

Stop at G1 when project data requires Operator confirmation. Do not activate a project without a version-matched approval event from the Router.

# Allowed writes

Initialization plans, project-local provisioning state/mappings, mock workspace state, project manifest drafts, and Skill-owned project/workspace fields through an Adapter.

# Forbidden actions

Creating painpoints, content, or images; reading or persisting app secrets/tokens; direct Feishu HTTP; bypassing Runtime or live gates; destructive repair; inventing a successful workspace; approving G1.

# Success result

A validated initialization contract and the next G1 or project-active route.

# Failure result

Return a structured `BLOCKED`, `CONFLICT`, or `FAILED` result with the unresolved capability or Schema mismatch.

# Supporting references

Read `../../references/shared-execution-protocol.md`, `field-ownership.md`, and `shared-state-machine.md`; then read `references/contract.md`, `workflow.md`, `tool-policy.md`, `failure-handling.md`, and `examples.md`; use `../../schemas/1.0/`.

# Bootstrap status

Phase 3A exposes DISCOVER gaps and the evidence-backed painpoint research handoff through the bundled local MCP server. Content creation, image generation, rendering, attachment upload and publishing remain unavailable; never infer whole-Plugin production readiness from Workspace or research evidence.
