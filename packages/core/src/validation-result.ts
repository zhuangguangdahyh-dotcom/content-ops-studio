export interface ValidationIssue {
  code: string;
  reason: string;
  path: string;
}

export interface ValidationOutcome {
  valid: boolean;
  issues: ValidationIssue[];
}

export function validationOutcome(issues: ValidationIssue[]): ValidationOutcome {
  return { valid: issues.length === 0, issues };
}

export function issue(code: string, reason: string, path = "/"): ValidationIssue {
  return { code, reason, path };
}
