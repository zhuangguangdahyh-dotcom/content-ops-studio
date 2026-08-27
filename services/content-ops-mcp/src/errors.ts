import { envelope, type ResultEnvelope } from "./result-envelope.js";

const SECRET_PATTERN =
  /((?:token|secret|authorization|api[_-]?key|app[_-]?id|open[_-]?id)\s*[:=]\s*)[^\s,}]+/gi;

export function redactMessage(value: unknown): string {
  const raw = value instanceof Error ? value.message : String(value);
  return raw.replace(SECRET_PATTERN, "$1[REDACTED]").slice(0, 500);
}

export function errorEnvelope(error: unknown, scope = "MCP_TOOL"): ResultEnvelope {
  const candidate = error as { code?: unknown; message?: unknown };
  const code = typeof candidate?.code === "string" ? candidate.code : "MCP_TOOL_FAILED";
  const message = redactMessage(candidate?.message ?? error);
  const conflict = /CONFLICT|MISMATCH|STALE/.test(code);
  const authorization = /AUTHORIZATION|NOT_LOGGED|AUTH_/.test(code);
  const blocked = /BLOCKED|FORBIDDEN|MISSING|NOT_FOUND|NOT_RESOLVED|INVALID/.test(code);
  return envelope(
    conflict ? "CONFLICT" : authorization || blocked ? "BLOCKED" : "FAILED",
    message,
    {
      next_action: authorization
        ? "Complete official Lark CLI user authorization, then retry the read check."
        : "Correct the reported condition and retry the same idempotent request.",
      errors: [
        {
          code,
          message,
          retryable: authorization || /TIMEOUT|RATE|RETRY/.test(code),
          scope,
          recommended_action: authorization
            ? "Run content_ops_start_feishu_setup."
            : "Review the redacted error and retry only after correction.",
        },
      ],
    },
  );
}
