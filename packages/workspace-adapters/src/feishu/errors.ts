export type FeishuErrorCode =
  | "FEISHU_CONFIG_MISSING"
  | "FEISHU_CREDENTIALS_MISSING"
  | "FEISHU_AUTH_FAILED"
  | "FEISHU_TOKEN_INVALID"
  | "FEISHU_PERMISSION_DENIED"
  | "FEISHU_PERMISSION_MISSING"
  | "FEISHU_RATE_LIMITED"
  | "FEISHU_REQUEST_TIMEOUT"
  | "FEISHU_API_ERROR"
  | "FEISHU_RESPONSE_INVALID"
  | "FEISHU_SCHEMA_DRIFT"
  | "FEISHU_FIELD_TYPE_UNSUPPORTED"
  | "FEISHU_RELATION_CONFLICT"
  | "FEISHU_RECORD_CONFLICT"
  | "FEISHU_VIEW_CAPABILITY_LIMITED"
  | "FEISHU_ORPHAN_WORKSPACE"
  | "FEISHU_DUPLICATE_WORKSPACE_CANDIDATES"
  | "FEISHU_LIVE_WRITE_DISABLED"
  | "FEISHU_LIVE_WRITE_NOT_CONFIRMED"
  | "FEISHU_LIVE_TEST_NOT_CONFIGURED"
  | "FEISHU_ATTACHMENT_UPLOAD_DEFERRED";

export interface FeishuErrorDetails {
  code: FeishuErrorCode;
  message: string;
  retryable: boolean;
  scope: string;
  recommended_action: string;
  redacted_remote_code: string | null;
}

const SECRET_PATTERN =
  /((?:app[_-]?secret|tenant[_-]?access[_-]?token|authorization|bearer|api[_-]?key)\s*[:=]?\s*)[^\s,;}]+/gi;

export function redactFeishuText(value: string, secrets: string[] = []): string {
  let redacted = value.replace(SECRET_PATTERN, "$1[REDACTED]");
  for (const secret of secrets.filter(Boolean))
    redacted = redacted.replaceAll(secret, "[REDACTED]");
  return redacted;
}

export function redactFeishuValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactFeishuValue);
  if (!value || typeof value !== "object")
    return typeof value === "string" ? redactFeishuText(value) : value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, child]) => [
      key,
      /secret|token|authorization|api[_-]?key/i.test(key) ? "[REDACTED]" : redactFeishuValue(child),
    ]),
  );
}

export class FeishuAdapterError extends Error implements FeishuErrorDetails {
  readonly code: FeishuErrorCode;
  readonly retryable: boolean;
  readonly scope: string;
  readonly recommended_action: string;
  readonly redacted_remote_code: string | null;

  constructor(details: FeishuErrorDetails) {
    super(redactFeishuText(details.message));
    this.name = "FeishuAdapterError";
    this.code = details.code;
    this.retryable = details.retryable;
    this.scope = details.scope;
    this.recommended_action = details.recommended_action;
    this.redacted_remote_code = details.redacted_remote_code;
  }

  toJSON(): FeishuErrorDetails {
    return {
      code: this.code,
      message: this.message,
      retryable: this.retryable,
      scope: this.scope,
      recommended_action: this.recommended_action,
      redacted_remote_code: this.redacted_remote_code,
    };
  }
}

export function feishuError(
  code: FeishuErrorCode,
  message: string,
  options: Partial<Omit<FeishuErrorDetails, "code" | "message">> = {},
): FeishuAdapterError {
  return new FeishuAdapterError({
    code,
    message,
    retryable: options.retryable ?? false,
    scope: options.scope ?? "feishu",
    recommended_action:
      options.recommended_action ?? "Inspect the redacted diagnostic and retry safely.",
    redacted_remote_code: options.redacted_remote_code ?? null,
  });
}
