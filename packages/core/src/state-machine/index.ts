import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateCrossStateInvariants } from "./invariants.js";
import type {
  InvalidationDefinition,
  InvalidationResult,
  StateMachineDefinition,
  StateTransition,
  StateTransitionRequestInput,
  StateTransitionResultOutput,
} from "./types.js";

export * from "./invariants.js";
export * from "./types.js";

export const STATE_MACHINE_ROOT = fileURLToPath(
  new URL("../../../../plugins/content-ops-studio/config/state-machines/", import.meta.url),
);
export const INVALIDATION_RULES_PATH = fileURLToPath(
  new URL("../../../../plugins/content-ops-studio/config/invalidation-rules.json", import.meta.url),
);

export async function loadStateMachineDefinitions(
  root = STATE_MACHINE_ROOT,
): Promise<StateMachineDefinition[]> {
  const files = (await readdir(root)).filter((file) => file.endsWith(".json")).sort();
  return Promise.all(
    files.map(
      async (file) =>
        JSON.parse(await readFile(path.join(root, file), "utf8")) as StateMachineDefinition,
    ),
  );
}

export async function loadInvalidationRules(
  rulesPath = INVALIDATION_RULES_PATH,
): Promise<InvalidationDefinition> {
  return JSON.parse(await readFile(rulesPath, "utf8")) as InvalidationDefinition;
}

export function getAvailableTransitions(
  definitions: StateMachineDefinition[],
  machine: string,
  fromState: string,
): StateTransition[] {
  return (
    definitions
      .find((definition) => definition.machine === machine)
      ?.transitions.filter((transition) => transition.from === fromState) ?? []
  );
}

export function validateStateMachineDefinitions(
  definitions: StateMachineDefinition[],
  registeredStatusCodes: Set<string>,
  ownerSkills: Set<string>,
): string[] {
  const errors: string[] = [];
  const machineNames = new Set<string>();
  for (const definition of definitions) {
    if (machineNames.has(definition.machine))
      errors.push(`Duplicate machine ${definition.machine}.`);
    machineNames.add(definition.machine);
    const localStates = new Set(definition.states);
    for (const state of definition.states)
      if (!registeredStatusCodes.has(state))
        errors.push(`${definition.machine} uses unknown status ${state}.`);
    for (const state of [...definition.initialStates, ...definition.terminalStates])
      if (!localStates.has(state))
        errors.push(`${definition.machine} references undeclared state ${state}.`);
    const transitionKeys = new Set<string>();
    for (const transition of definition.transitions) {
      const key = `${transition.from}|${transition.to}|${transition.trigger}`;
      if (transitionKeys.has(key))
        errors.push(`${definition.machine} has duplicate transition ${key}.`);
      transitionKeys.add(key);
      if (!localStates.has(transition.from) || !localStates.has(transition.to))
        errors.push(`${definition.machine} transition ${key} uses a state outside its machine.`);
      if (!ownerSkills.has(transition.ownerSkill))
        errors.push(
          `${definition.machine} transition ${key} has unknown owner ${transition.ownerSkill}.`,
        );
      if (transition.requiresApprovalGate && transition.ownerSkill !== "content-studio-router")
        errors.push(`${definition.machine} approval transition ${key} must be Router-owned.`);
    }
    for (const state of definition.states.filter(
      (state) => !definition.terminalStates.includes(state),
    ))
      if (!definition.transitions.some((transition) => transition.from === state))
        errors.push(
          `${definition.machine} non-terminal state ${state} has no outgoing transition.`,
        );
  }
  return errors.sort();
}

function unique(values: string[]): string[] {
  return [...new Set(values)].sort();
}

export function calculateInvalidations(
  changedFields: string[],
  definition: InvalidationDefinition,
): InvalidationResult {
  const changed = new Set(changedFields);
  const matched = definition.rules.filter((rule) =>
    rule.changedFields.some((field) => changed.has(field)),
  );
  return {
    matchedRuleIds: matched.map((rule) => rule.ruleId).sort(),
    invalidatedApprovals: unique(matched.flatMap((rule) => rule.invalidatedApprovals)),
    invalidatedArtifacts: unique(matched.flatMap((rule) => rule.invalidatedArtifacts)),
    stateUpdates: Object.assign({}, ...matched.map((rule) => rule.stateUpdates)) as Record<
      string,
      string
    >,
    preserveHistory: true,
  };
}

function rejected(
  request: StateTransitionRequestInput,
  errorCode: NonNullable<StateTransitionResultOutput["error_code"]>,
  reasons: string[],
  requiredGate: StateTransitionResultOutput["required_gate"] = null,
  requiredActions: string[] = [],
): StateTransitionResultOutput {
  return {
    allowed: false,
    machine: request.machine,
    from_state: request.from_state,
    to_state: request.to_state,
    next_state: null,
    error_code: errorCode,
    reasons,
    required_gate: requiredGate,
    invalidated_approvals: [],
    invalidated_artifacts: [],
    required_actions: unique(requiredActions),
    evaluated_at: request.requested_at,
    run_id: request.run_id,
    schema_version: "1.0.0",
  };
}

function validateApproval(
  request: StateTransitionRequestInput,
  transition: StateTransition,
): StateTransitionResultOutput | null {
  const gate = transition.requiresApprovalGate;
  if (!gate) return null;
  const approval = request.approval_event;
  if (!approval)
    return rejected(request, "APPROVAL_REQUIRED", [`Approval gate ${gate} is required.`], gate, [
      `OBTAIN_${gate}_APPROVAL`,
    ]);
  if (approval.deprecated_at)
    return rejected(request, "APPROVAL_STALE", ["Approval event has been deprecated."], gate, [
      `OBTAIN_CURRENT_${gate}_APPROVAL`,
    ]);
  if (approval.target_version !== request.target_version)
    return rejected(request, "APPROVAL_STALE", ["Approval target version is stale."], gate, [
      `OBTAIN_CURRENT_${gate}_APPROVAL`,
    ]);
  if (
    approval.gate !== gate ||
    approval.target_type !== request.target_type ||
    approval.target_id !== request.target_id ||
    approval.decision !== "APPROVE"
  )
    return rejected(
      request,
      "APPROVAL_MISMATCH",
      ["Approval gate, target type, target ID, or decision does not match the transition."],
      gate,
      [`OBTAIN_MATCHING_${gate}_APPROVAL`],
    );
  return null;
}

export function validateTransition(
  definitions: StateMachineDefinition[],
  request: StateTransitionRequestInput,
  invalidationDefinition?: InvalidationDefinition,
): StateTransitionResultOutput {
  const machine = definitions.find((definition) => definition.machine === request.machine);
  if (!machine)
    return rejected(request, "INVALID_TRANSITION", [`Unknown state machine ${request.machine}.`]);
  if (machine.terminalStates.includes(request.from_state))
    return rejected(request, "TERMINAL_STATE", [`${request.from_state} is terminal.`]);
  const transition = machine.transitions.find(
    (candidate) =>
      candidate.from === request.from_state &&
      candidate.to === request.to_state &&
      candidate.trigger === request.trigger,
  );
  if (!transition)
    return rejected(request, "INVALID_TRANSITION", [
      "No configured transition matches from, to, and trigger.",
    ]);
  if (transition.ownerSkill !== request.actor_skill)
    return rejected(
      request,
      "OWNER_SKILL_MISMATCH",
      [`Transition is owned by ${transition.ownerSkill}, not ${request.actor_skill}.`],
      transition.requiresApprovalGate,
      [`ROUTE_TO_${transition.ownerSkill}`],
    );
  const missingContext = transition.requiredContext.filter(
    (key) => request.current_context[key] === undefined || request.current_context[key] === null,
  );
  if (missingContext.length)
    return rejected(
      request,
      "INVARIANT_VIOLATION",
      [`Missing required context: ${missingContext.join(", ")}.`],
      transition.requiresApprovalGate,
      missingContext.map((key) => `PROVIDE_${key.toUpperCase()}`),
    );
  const approvalFailure = validateApproval(request, transition);
  if (approvalFailure) return approvalFailure;
  const invariantViolations = validateCrossStateInvariants(request);
  if (invariantViolations.length)
    return rejected(
      request,
      "INVARIANT_VIOLATION",
      invariantViolations.map((violation) => violation.reason),
      transition.requiresApprovalGate,
      invariantViolations.map((violation) => violation.requiredAction),
    );
  const changedFields = Array.isArray(request.current_context.changed_fields)
    ? request.current_context.changed_fields.filter(
        (value): value is string => typeof value === "string",
      )
    : [];
  const invalidations = invalidationDefinition
    ? calculateInvalidations(changedFields, invalidationDefinition)
    : {
        matchedRuleIds: [],
        invalidatedApprovals: [],
        invalidatedArtifacts: [],
        stateUpdates: {},
        preserveHistory: true as const,
      };
  return {
    allowed: true,
    machine: request.machine,
    from_state: request.from_state,
    to_state: request.to_state,
    next_state: transition.to,
    error_code: null,
    reasons: [],
    required_gate: transition.requiresApprovalGate,
    invalidated_approvals: invalidations.invalidatedApprovals,
    invalidated_artifacts: unique([
      ...transition.invalidates,
      ...invalidations.invalidatedArtifacts,
    ]),
    required_actions: [],
    evaluated_at: request.requested_at,
    run_id: request.run_id,
    schema_version: "1.0.0",
  };
}

export function applyTransition(
  definitions: StateMachineDefinition[],
  request: StateTransitionRequestInput,
  invalidationDefinition?: InvalidationDefinition,
): StateTransitionResultOutput {
  return validateTransition(definitions, request, invalidationDefinition);
}
