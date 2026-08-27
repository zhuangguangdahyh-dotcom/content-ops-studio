export type LarkCliIdentity = "user" | "bot";

export interface LarkCliCommand {
  argv: string[];
  operation: string;
  timeoutMs?: number;
  signal?: AbortSignal;
  allowHighRiskUpdate?: boolean;
}

export interface LarkCliResult<T = unknown> {
  ok: true;
  exitCode: 0;
  operation: string;
  data: T;
  stdout: string;
  stderr: string;
  durationMs: number;
}

export interface LarkCliFailure {
  ok: false;
  exitCode: number;
  operation: string;
  error: { code: string; message: string };
  stdout: string;
  stderr: string;
  durationMs: number;
}

export type LarkCliExecution<T = unknown> = LarkCliResult<T> | LarkCliFailure;

export class LarkCliError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly exitCode = 4,
  ) {
    super(message);
    this.name = "LarkCliError";
  }
}

export type LarkCliAuthState =
  | "NOT_CONFIGURED"
  | "AWAITING_USER_AUTHORIZATION"
  | "AWAITING_ADMIN_APPROVAL"
  | "AUTHENTICATED"
  | "BLOCKED";

export interface LarkCliAuthStatus {
  state: LarkCliAuthState;
  identity: LarkCliIdentity;
  configured: boolean;
  authenticated: boolean;
  missingScopes: string[];
  authorizationUrl?: string;
  nextAction?: string;
}
