export interface ApprovalEventInput {
  approval_id: string;
  gate: "PROJECT_PROFILE" | "PAINPOINTS" | "CONTENT_COPY" | "FIRST_PAGE" | "FINAL_SET";
  target_type: string;
  target_id: string;
  target_version: string;
  decision: "APPROVE" | "REVISE" | "REJECT" | "PAUSE";
  deprecated_at?: string | null;
}

export interface StateTransition {
  from: string;
  to: string;
  trigger: string;
  ownerSkill: string;
  requiresApprovalGate: ApprovalEventInput["gate"] | null;
  requiredContext: string[];
  invalidates: string[];
  description: string;
}

export interface StateMachineDefinition {
  machine: string;
  version: string;
  states: string[];
  initialStates: string[];
  terminalStates: string[];
  transitions: StateTransition[];
}

export interface StateTransitionRequestInput {
  machine: string;
  from_state: string;
  to_state: string;
  trigger: string;
  actor_skill: string;
  project_id: string;
  target_type: string;
  target_id: string;
  target_version: string;
  approval_event: ApprovalEventInput | null;
  current_context: Record<string, unknown>;
  available_artifacts: Array<{
    artifact_type: string;
    artifact_id: string;
    version: string;
    status: string;
  }>;
  requested_at: string;
  run_id: string;
  schema_version: "1.0.0";
}

export interface StateTransitionResultOutput {
  allowed: boolean;
  machine: string;
  from_state: string;
  to_state: string;
  next_state: string | null;
  error_code:
    | "INVALID_TRANSITION"
    | "APPROVAL_REQUIRED"
    | "APPROVAL_MISMATCH"
    | "APPROVAL_STALE"
    | "INVARIANT_VIOLATION"
    | "OWNER_SKILL_MISMATCH"
    | "TERMINAL_STATE"
    | null;
  reasons: string[];
  required_gate: ApprovalEventInput["gate"] | null;
  invalidated_approvals: string[];
  invalidated_artifacts: string[];
  required_actions: string[];
  evaluated_at: string;
  run_id: string;
  schema_version: "1.0.0";
}

export interface InvalidationRule {
  ruleId: string;
  changeType: string;
  changedFields: string[];
  invalidatedApprovals: string[];
  invalidatedArtifacts: string[];
  stateUpdates: Record<string, string>;
  preserveHistory: true;
  description: string;
}

export interface InvalidationDefinition {
  version: string;
  rules: InvalidationRule[];
}

export interface InvalidationResult {
  matchedRuleIds: string[];
  invalidatedApprovals: string[];
  invalidatedArtifacts: string[];
  stateUpdates: Record<string, string>;
  preserveHistory: true;
}
