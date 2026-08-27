import { FeishuAdapterError, feishuError, redactFeishuValue } from "../errors.js";

export type FeishuHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface FeishuTransportRequest {
  operation: string;
  method: FeishuHttpMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
  authenticated?: boolean;
}

export interface FeishuTransportResponse<T = unknown> {
  status: number;
  requestId: string | null;
  data: T;
  attempts: number;
}

export interface FeishuRetryEvent {
  operation: string;
  attempt_number: number;
  delay_ms: number;
  redacted_remote_code: string | null;
  reason: string;
  outcome: "RETRYING" | "EXHAUSTED";
}

export interface FeishuTransport {
  request<T = unknown>(request: FeishuTransportRequest): Promise<FeishuTransportResponse<T>>;
}

export class FeishuRetryClassifier {
  classify(
    status: number,
    remoteCode: number | null,
  ): "AUTH" | "RATE_LIMIT" | "TIMEOUT" | "SERVER" | "NO_RETRY" {
    if (status === 401 || remoteCode === 99991663 || remoteCode === 99991664) return "AUTH";
    if (status === 429) return "RATE_LIMIT";
    if (status === 408) return "TIMEOUT";
    if (status >= 500 && status <= 599) return "SERVER";
    return "NO_RETRY";
  }
}

export interface FeishuRateLimitController {
  delay(attempt: number, retryAfterHeader: string | null): number;
  wait(milliseconds: number): Promise<void>;
}

export class BoundedFeishuRateLimitController implements FeishuRateLimitController {
  constructor(
    private readonly baseDelayMs = 250,
    private readonly maxDelayMs = 5000,
    private readonly sleeper: (milliseconds: number) => Promise<void> = (milliseconds) =>
      new Promise((resolve) => setTimeout(resolve, milliseconds)),
    private readonly random: () => number = Math.random,
  ) {}
  delay(attempt: number, retryAfterHeader: string | null): number {
    const numeric = retryAfterHeader === null ? Number.NaN : Number(retryAfterHeader);
    if (Number.isFinite(numeric) && numeric >= 0) return Math.min(this.maxDelayMs, numeric * 1000);
    const jitter = Math.floor(this.random() * this.baseDelayMs);
    return Math.min(this.maxDelayMs, this.baseDelayMs * 2 ** Math.max(0, attempt - 1) + jitter);
  }
  wait(milliseconds: number): Promise<void> {
    return this.sleeper(milliseconds);
  }
}

const ALLOWED_PATHS = [
  /^\/open-apis\/bitable\/v1\/apps$/,
  /^\/open-apis\/bitable\/v1\/apps\/[^/]+$/,
  /^\/open-apis\/bitable\/v1\/apps\/[^/]+\/tables(?:\/batch_create)?$/,
  /^\/open-apis\/bitable\/v1\/apps\/[^/]+\/tables\/[^/]+$/,
  /^\/open-apis\/bitable\/v1\/apps\/[^/]+\/tables\/[^/]+\/fields(?:\/[^/]+)?$/,
  /^\/open-apis\/bitable\/v1\/apps\/[^/]+\/tables\/[^/]+\/views$/,
  /^\/open-apis\/bitable\/v1\/apps\/[^/]+\/tables\/[^/]+\/records(?:\/search|\/batch_create|\/batch_update|\/[^/]+)?$/,
];

interface PlatformEnvelope {
  code?: number;
  msg?: string;
  data?: unknown;
}

export interface NodeFetchFeishuTransportOptions {
  tokenProvider: FeishuAccessTokenProvider;
  fetchImpl?: typeof fetch;
  baseUrl?: "https://open.feishu.cn";
  defaultTimeoutMs?: number;
  maxAttempts?: number;
  rateLimitController?: FeishuRateLimitController;
  retryClassifier?: FeishuRetryClassifier;
  onRetry?: (event: FeishuRetryEvent) => void;
}

export interface FeishuAccessTokenProvider {
  getToken(forceRefresh?: boolean): Promise<string>;
  invalidate(): void;
}

export class NodeFetchFeishuTransport implements FeishuTransport {
  readonly #fetch: typeof fetch;
  readonly #baseUrl: string;
  readonly #timeout: number;
  readonly #maxAttempts: number;
  readonly #rateLimit: FeishuRateLimitController;
  readonly #classifier: FeishuRetryClassifier;

  constructor(private readonly options: NodeFetchFeishuTransportOptions) {
    this.#fetch = options.fetchImpl ?? fetch;
    this.#baseUrl = options.baseUrl ?? "https://open.feishu.cn";
    this.#timeout = options.defaultTimeoutMs ?? 30000;
    this.#maxAttempts = options.maxAttempts ?? 3;
    this.#rateLimit = options.rateLimitController ?? new BoundedFeishuRateLimitController();
    this.#classifier = options.retryClassifier ?? new FeishuRetryClassifier();
  }

  async request<T>(request: FeishuTransportRequest): Promise<FeishuTransportResponse<T>> {
    if (
      !request.path.startsWith("/") ||
      !ALLOWED_PATHS.some((allowed) => allowed.test(request.path))
    )
      throw feishuError(
        "FEISHU_CONFIG_MISSING",
        `Operation ${request.operation} uses a path outside the approved Feishu API allowlist.`,
        { scope: "transport" },
      );
    let authRefreshUsed = false;
    for (let attempt = 1; attempt <= this.#maxAttempts; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(new Error("request timeout")),
        request.timeoutMs ?? this.#timeout,
      );
      const signal = request.signal
        ? AbortSignal.any([request.signal, controller.signal])
        : controller.signal;
      try {
        const authenticated = request.authenticated ?? true;
        const token = authenticated
          ? await this.options.tokenProvider.getToken(authRefreshUsed)
          : null;
        const url = new URL(request.path, this.#baseUrl);
        for (const [key, value] of Object.entries(request.query ?? {}))
          if (value !== undefined) url.searchParams.append(key, String(value));
        const response = await this.#fetch(url, {
          method: request.method,
          headers: {
            accept: "application/json",
            ...(request.body === undefined ? {} : { "content-type": "application/json" }),
            ...(token ? { authorization: `Bearer ${token}` } : {}),
          },
          ...(request.body === undefined ? {} : { body: JSON.stringify(request.body) }),
          signal,
        });
        let parsed: unknown;
        try {
          parsed = await response.json();
        } catch {
          throw feishuError("FEISHU_RESPONSE_INVALID", "Feishu response was not valid JSON.", {
            scope: request.operation,
          });
        }
        const envelope = parsed as PlatformEnvelope;
        const remoteCode = typeof envelope.code === "number" ? envelope.code : null;
        const classification = this.#classifier.classify(response.status, remoteCode);
        if (response.ok && (remoteCode === null || remoteCode === 0)) {
          return {
            status: response.status,
            requestId: response.headers.get("x-tt-logid") ?? response.headers.get("x-request-id"),
            data: (remoteCode === null ? parsed : envelope.data) as T,
            attempts: attempt,
          };
        }
        if (classification === "AUTH" && !authRefreshUsed) {
          authRefreshUsed = true;
          this.options.tokenProvider.invalidate();
          this.options.onRetry?.({
            operation: request.operation,
            attempt_number: attempt,
            delay_ms: 0,
            redacted_remote_code: remoteCode === null ? null : String(remoteCode),
            reason: "AUTH_REFRESH",
            outcome: "RETRYING",
          });
          continue;
        }
        if (
          ["RATE_LIMIT", "TIMEOUT", "SERVER"].includes(classification) &&
          attempt < this.#maxAttempts
        ) {
          const delay = this.#rateLimit.delay(attempt, response.headers.get("retry-after"));
          this.options.onRetry?.({
            operation: request.operation,
            attempt_number: attempt,
            delay_ms: delay,
            redacted_remote_code: remoteCode === null ? null : String(remoteCode),
            reason: classification,
            outcome: "RETRYING",
          });
          await this.#rateLimit.wait(delay);
          continue;
        }
        throw this.#platformError(
          response.status,
          remoteCode,
          envelope.msg,
          request.operation,
          classification,
        );
      } catch (error) {
        if (error instanceof FeishuAdapterError) throw error;
        if (request.signal?.aborted)
          throw feishuError("FEISHU_API_ERROR", "Feishu request was aborted by the caller.", {
            scope: request.operation,
          });
        if (controller.signal.aborted) {
          if (attempt < this.#maxAttempts) {
            const delay = this.#rateLimit.delay(attempt, null);
            this.options.onRetry?.({
              operation: request.operation,
              attempt_number: attempt,
              delay_ms: delay,
              redacted_remote_code: null,
              reason: "TIMEOUT",
              outcome: "RETRYING",
            });
            await this.#rateLimit.wait(delay);
            continue;
          }
          throw feishuError(
            "FEISHU_REQUEST_TIMEOUT",
            "Feishu request exceeded the configured timeout.",
            { scope: request.operation, retryable: true },
          );
        }
        if (attempt < this.#maxAttempts) {
          const delay = this.#rateLimit.delay(attempt, null);
          this.options.onRetry?.({
            operation: request.operation,
            attempt_number: attempt,
            delay_ms: delay,
            redacted_remote_code: null,
            reason: "NETWORK",
            outcome: "RETRYING",
          });
          await this.#rateLimit.wait(delay);
          continue;
        }
        throw feishuError(
          "FEISHU_API_ERROR",
          `Feishu network request failed: ${JSON.stringify(redactFeishuValue((error as Error).message))}`,
          { scope: request.operation, retryable: true },
        );
      } finally {
        clearTimeout(timeout);
      }
    }
    throw feishuError("FEISHU_API_ERROR", "Feishu retry limit was exhausted.", {
      scope: request.operation,
      retryable: false,
    });
  }

  #platformError(
    status: number,
    remoteCode: number | null,
    message: string | undefined,
    scope: string,
    classification: string,
  ): FeishuAdapterError {
    const common = {
      scope,
      retryable: false,
      redacted_remote_code: remoteCode === null ? null : String(remoteCode),
    };
    if (status === 403)
      return feishuError(
        "FEISHU_PERMISSION_DENIED",
        `Feishu denied the operation: ${message ?? "permission denied"}`,
        {
          ...common,
          recommended_action:
            "Grant the required API scope and document access, then rerun doctor.",
        },
      );
    if (classification === "AUTH")
      return feishuError(
        "FEISHU_TOKEN_INVALID",
        "Feishu rejected the refreshed tenant access token.",
        common,
      );
    if (classification === "RATE_LIMIT")
      return feishuError("FEISHU_RATE_LIMITED", "Feishu rate-limit retries were exhausted.", {
        ...common,
        retryable: true,
      });
    return feishuError(
      "FEISHU_API_ERROR",
      `Feishu API returned HTTP ${status}: ${message ?? "platform error"}`,
      common,
    );
  }
}
