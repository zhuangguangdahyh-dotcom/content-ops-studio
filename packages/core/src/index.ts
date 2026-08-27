import { SCHEMA_VERSION } from "../../contracts/src/index.js";

export * from "./state-machine/index.js";
export * from "./assets/index.js";
export * from "./validation-result.js";
export * from "./visual-pipeline/index.js";
export * from "./research/index.js";
export * from "./content/index.js";
export * from "./visual-planning/index.js";
export * from "./image-production/index.js";
export * from "./finalization/index.js";

export interface ProductionState {
  copy: "COPY_PENDING_APPROVAL" | "COPY_REVISION_REQUIRED" | "COPY_APPROVED";
  firstPage:
    | "FIRST_PAGE_NOT_SUBMITTED"
    | "FIRST_PAGE_APPROVAL_PENDING"
    | "FIRST_PAGE_REVISION_REQUIRED"
    | "FIRST_PAGE_APPROVAL_APPROVED"
    | "FIRST_PAGE_APPROVAL_REJECTED";
  images:
    | "IMAGE_NOT_GENERATED"
    | "FIRST_PAGE_GENERATING"
    | "FIRST_PAGE_PENDING_APPROVAL"
    | "FIRST_PAGE_APPROVED"
    | "IMAGE_SET_GENERATING"
    | "IMAGE_SET_GENERATED"
    | "IMAGE_GENERATION_FAILED";
  qaPassed: boolean;
  finalApproval:
    | "FINAL_NOT_SUBMITTED"
    | "FINAL_APPROVAL_PENDING"
    | "FINAL_REVISION_REQUIRED"
    | "FINAL_APPROVAL_APPROVED";
}

export type ProductionAction =
  "GENERATE_FIRST_PAGE" | "GENERATE_REMAINING_PAGES" | "REQUEST_FINAL_REVIEW" | "FINALIZE";

export function canPerformAction(state: ProductionState, action: ProductionAction): boolean {
  switch (action) {
    case "GENERATE_FIRST_PAGE":
      return state.copy === "COPY_APPROVED";
    case "GENERATE_REMAINING_PAGES":
      return state.firstPage === "FIRST_PAGE_APPROVAL_APPROVED";
    case "REQUEST_FINAL_REVIEW":
      return state.images === "IMAGE_SET_GENERATED";
    case "FINALIZE":
      return (
        state.images === "IMAGE_SET_GENERATED" &&
        state.qaPassed &&
        state.finalApproval === "FINAL_APPROVAL_APPROVED"
      );
  }
}

export function assertActionAllowed(state: ProductionState, action: ProductionAction): void {
  if (!canPerformAction(state, action)) throw new Error(`INVALID_STATE: ${action} is not allowed.`);
}

export function assertSchemaVersion(actual: string, expected = SCHEMA_VERSION): void {
  if (actual !== expected)
    throw new Error(`SCHEMA_MISMATCH: expected ${expected}, received ${actual}.`);
}

export function findDuplicateStatusCodes(groups: Record<string, Record<string, string>>): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const group of Object.values(groups)) {
    for (const code of Object.keys(group)) {
      if (seen.has(code)) duplicates.add(code);
      seen.add(code);
    }
  }
  return [...duplicates].sort();
}
