import type { StateTransitionRequestInput } from "./types.js";

export interface InvariantViolation {
  reason: string;
  requiredAction: string;
}

function equals(context: Record<string, unknown>, key: string, expected: unknown): boolean {
  return context[key] === expected;
}

export function validateCrossStateInvariants(
  request: StateTransitionRequestInput,
): InvariantViolation[] {
  const context = request.current_context;
  const violations: InvariantViolation[] = [];
  const reject = (reason: string, requiredAction: string): void => {
    violations.push({ reason, requiredAction });
  };

  if (request.trigger === "START_PAINPOINT_RESEARCH") {
    if (!equals(context, "project_status", "PROJECT_ACTIVE"))
      reject("Project must be active before formal painpoint research.", "ACTIVATE_PROJECT");
    if (!equals(context, "config_confirmation_status", "CONFIG_CONFIRMED"))
      reject(
        "Project configuration must be confirmed before formal painpoint research.",
        "CONFIRM_CONFIGURATION",
      );
  }

  if (["CREATE_FORMAL_CONTENT", "START_CONTENT_PLANNING"].includes(request.trigger)) {
    if (!equals(context, "painpoint_review_status", "PAINPOINT_CONFIRMED"))
      reject("Painpoint must be confirmed before formal content creation.", "CONFIRM_PAINPOINT");
    if (equals(context, "painpoint_contentization_status", "PAINPOINT_PAUSED"))
      reject("Paused painpoint cannot create formal content by default.", "RESUME_PAINPOINT");
  }

  if (request.trigger === "START_FIRST_PAGE_GENERATION") {
    if (!equals(context, "content_status", "COPY_APPROVED"))
      reject("Copy must be approved before first-page generation.", "APPROVE_COPY");
    if (typeof context.visual_plan_version !== "string" || context.visual_plan_version.length === 0)
      reject("A visual plan is required before first-page generation.", "CREATE_VISUAL_PLAN");
    if (context.visual_plan_content_version !== request.target_version)
      reject("Visual plan is not bound to the current content version.", "REBUILD_VISUAL_PLAN");
  }

  if (request.trigger === "START_IMAGE_SET_GENERATION") {
    if (!equals(context, "first_page_approval_status", "FIRST_PAGE_APPROVAL_APPROVED"))
      reject("First page must be approved before remaining pages.", "APPROVE_FIRST_PAGE");
    if (typeof context.style_lock_version !== "string" || context.style_lock_version.length === 0)
      reject("Style Lock is required before remaining pages.", "CREATE_STYLE_LOCK");
    if (context.style_lock_content_version !== request.target_version)
      reject("Style Lock is not bound to the current content version.", "REBUILD_STYLE_LOCK");
  }

  if (["SUBMIT_FINAL_REVIEW", "SUBMIT_FINAL_VERSION"].includes(request.trigger)) {
    if (!equals(context, "image_status", "IMAGE_SET_GENERATED"))
      reject("Complete image set is required for final review.", "COMPLETE_IMAGE_SET");
    if (
      typeof context.generated_page_count !== "number" ||
      context.generated_page_count !== context.expected_page_count
    )
      reject("Generated page count must match the expected page count.", "COMPLETE_MISSING_PAGES");
  }

  if (["SUBMIT_FINAL_VERSION", "FINALIZE_CONTENT"].includes(request.trigger)) {
    if (context.auto_qa_passed !== true)
      reject("Automatic QA must pass before final submission.", "PASS_AUTOMATIC_QA");
  }

  return violations;
}
