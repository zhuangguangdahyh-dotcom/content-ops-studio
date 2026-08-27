import type { ApprovalEvent, TaskEnvelope, TaskResult } from "../../contracts/src/index.js";

export function mockTaskEnvelope(): TaskEnvelope {
  return {
    contract_version: "1.0.0",
    schema_version: "1.0.0",
    run_id: "RUN-20990101-010203-DEMO",
    project_id: "PRJ-20990101-DEMO",
    task_type: "PROJECT_INITIALIZATION",
    operation: "DISCOVER",
    source: "mock",
    raw_instruction: "Fictional bootstrap contract fixture",
    targets: { painpoint_ids: [], content_ids: [], page_numbers: [] },
    overrides: {},
    approval_event: null,
    resume: { from_run_id: null, from_step: null },
    dry_run: true,
  };
}

export function mockApprovalEvent(): ApprovalEvent {
  return {
    approval_id: "APR-20990101-DEMO",
    gate: "PROJECT_PROFILE",
    target_type: "PROJECT",
    target_id: "PRJ-20990101-DEMO",
    target_version: "1",
    decision: "APPROVE",
    comment: "Fictional approval fixture",
    source_run_id: "RUN-20990101-010203-DEMO",
    created_at: "2099-01-01T01:02:03.000Z",
    deprecated_at: null,
    schema_version: "1.0.0",
  };
}

export function mockTaskResult(): TaskResult {
  return {
    status: "SUCCESS",
    skill: "project-initialization",
    run_id: "RUN-20990101-010203-DEMO",
    project_id: "PRJ-20990101-DEMO",
    state_before: { project: "PROJECT_INITIALIZING" },
    state_after: { project: "PROJECT_PENDING_CONFIRMATION" },
    created_records: [],
    updated_records: [],
    artifacts: [],
    approval_request: mockApprovalEvent(),
    warnings: [],
    errors: [],
    next_route: "content-studio-router",
  };
}
