import { z } from "zod";

export const STATUS_VALUES = [
  "SUCCESS",
  "PARTIAL",
  "AWAITING_APPROVAL",
  "AWAITING_USER_AUTHORIZATION",
  "BLOCKED",
  "CONFLICT",
  "FAILED",
  "CANCELLED",
] as const;

export type McpStatus = (typeof STATUS_VALUES)[number];

export interface McpErrorItem {
  code: string;
  message: string;
  retryable: boolean;
  scope: string;
  recommended_action: string;
}

export interface ResultEnvelope {
  status: McpStatus;
  summary: string;
  project_id?: string;
  run_id?: string;
  created_records: number;
  updated_records: number;
  artifacts: string[];
  approval_request?: Record<string, unknown>;
  next_action?: string;
  warnings: string[];
  errors: McpErrorItem[];
  details?: Record<string, unknown>;
}

export const resultEnvelopeSchema = z
  .object({
    status: z.enum(STATUS_VALUES),
    summary: z.string().min(1),
    project_id: z.string().optional(),
    run_id: z.string().optional(),
    created_records: z.number().int().nonnegative(),
    updated_records: z.number().int().nonnegative(),
    artifacts: z.array(z.string()),
    approval_request: z.record(z.string(), z.unknown()).optional(),
    next_action: z.string().optional(),
    warnings: z.array(z.string()),
    errors: z.array(
      z
        .object({
          code: z.string(),
          message: z.string(),
          retryable: z.boolean(),
          scope: z.string(),
          recommended_action: z.string(),
        })
        .strict(),
    ),
    details: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export function envelope(
  status: McpStatus,
  summary: string,
  extra: Partial<Omit<ResultEnvelope, "status" | "summary">> = {},
): ResultEnvelope {
  const parsed = resultEnvelopeSchema.parse({
    status,
    summary,
    created_records: 0,
    updated_records: 0,
    artifacts: [],
    warnings: [],
    errors: [],
    ...extra,
  });
  return Object.fromEntries(
    Object.entries(parsed).filter(([, value]) => value !== undefined),
  ) as unknown as ResultEnvelope;
}

export function toolResult(value: ResultEnvelope, isError = false) {
  const structuredContent = resultEnvelopeSchema.parse(value) as unknown as Record<string, unknown>;
  return {
    structuredContent,
    content: [{ type: "text" as const, text: value.summary }],
    ...(isError ? { isError: true } : {}),
  };
}
