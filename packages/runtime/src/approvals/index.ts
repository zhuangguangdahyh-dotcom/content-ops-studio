import type { ApprovalEvent } from "../../../contracts/src/generated/1.0/index.js";
import { AppendOnlyJsonlStore, canonicalJson } from "../storage/index.js";
import type { RunJournal } from "../journal/index.js";
import { RuntimeFailure } from "../types.js";

export interface ApprovalCommand {
  event: ApprovalEvent;
  projectId: string;
  workflowId: string;
  actorSkill: string;
  expectedGate: ApprovalEvent["gate"];
  expectedTargetType: ApprovalEvent["target_type"];
  expectedTargetId: string;
  expectedTargetVersion: string;
  sourceRunId: string;
}

export function validateApprovalCommand(command: ApprovalCommand): void {
  if (command.actorSkill !== "content-studio-router")
    throw new RuntimeFailure("APPROVAL_OWNER_INVALID", "Only Router may record approval.", 5);
  const event = command.event;
  if (
    event.gate !== command.expectedGate ||
    event.target_type !== command.expectedTargetType ||
    event.target_id !== command.expectedTargetId ||
    event.target_version !== command.expectedTargetVersion ||
    event.source_run_id !== command.sourceRunId
  )
    throw new RuntimeFailure("STALE_APPROVAL", "Approval target or version is stale.", 3);
  if (event.deprecated_at)
    throw new RuntimeFailure("APPROVAL_DEPRECATED", "Approval is deprecated.", 3);
}

export class ApprovalProcessor {
  readonly #store: AppendOnlyJsonlStore<ApprovalEvent>;
  constructor(
    file: string,
    private readonly journal: RunJournal,
  ) {
    this.#store = new AppendOnlyJsonlStore(file);
  }

  async appendApprovalEvent(command: ApprovalCommand): Promise<ApprovalEvent> {
    validateApprovalCommand(command);
    const history = await this.#store.readAll();
    const sameId = history.find((event) => event.approval_id === command.event.approval_id);
    if (sameId) {
      if (canonicalJson(sameId) !== canonicalJson(command.event))
        throw new RuntimeFailure("APPROVAL_CONFLICT", "Approval ID has different content.", 3);
      return sameId;
    }
    await this.#store.append(command.event);
    await this.journal.appendEvent({
      event_type: "APPROVAL_RECORDED",
      run_id: command.event.source_run_id,
      project_id: command.projectId,
      workflow_id: command.workflowId,
      step_id: null,
      status: "RECORDED",
      payload_summary: {
        approval_id: command.event.approval_id,
        gate: command.event.gate,
        decision: command.event.decision,
        target_version: command.event.target_version,
      },
    });
    return command.event;
  }

  applyApproval(command: ApprovalCommand): Promise<ApprovalEvent> {
    return this.appendApprovalEvent(command);
  }

  async resumeFromApproval(command: ApprovalCommand): Promise<{
    decision: ApprovalEvent["decision"];
    resumable: boolean;
  }> {
    const event = await this.appendApprovalEvent(command);
    return { decision: event.decision, resumable: event.decision === "APPROVE" };
  }

  rejectStaleApproval(command: ApprovalCommand): void {
    validateApprovalCommand(command);
  }

  async deprecateApproval(approvalId: string, deprecatedAt: string): Promise<ApprovalEvent> {
    const history = await this.#store.readAll();
    const event = [...history].reverse().find((item) => item.approval_id === approvalId);
    if (!event) throw new RuntimeFailure("APPROVAL_NOT_FOUND", approvalId, 5);
    const deprecated = { ...event, deprecated_at: deprecatedAt };
    await this.#store.append(deprecated);
    return deprecated;
  }
}

export async function appendApprovalEvent(processor: ApprovalProcessor, command: ApprovalCommand) {
  return processor.appendApprovalEvent(command);
}
export async function applyApproval(processor: ApprovalProcessor, command: ApprovalCommand) {
  return processor.applyApproval(command);
}
export async function resumeFromApproval(processor: ApprovalProcessor, command: ApprovalCommand) {
  return processor.resumeFromApproval(command);
}
export function rejectStaleApproval(command: ApprovalCommand) {
  return validateApprovalCommand(command);
}
export async function deprecateApproval(
  processor: ApprovalProcessor,
  approvalId: string,
  deprecatedAt: string,
) {
  return processor.deprecateApproval(approvalId, deprecatedAt);
}
