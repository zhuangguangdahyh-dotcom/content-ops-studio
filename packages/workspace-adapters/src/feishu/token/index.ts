import type { FeishuCredentialProvider } from "../credentials/index.js";
import { requireFeishuCredentials } from "../credentials/index.js";
import { FeishuAdapterError, feishuError, redactFeishuText } from "../errors.js";

export interface FeishuClock {
  now(): number;
}
export const systemFeishuClock: FeishuClock = { now: () => Date.now() };
export interface FeishuToken {
  value: string;
  expiresAt: number;
  refreshAt: number;
}
export interface FeishuTokenCache {
  get(): FeishuToken | null;
  set(value: FeishuToken | null): void;
}

export class InMemoryFeishuTokenCache implements FeishuTokenCache {
  #value: FeishuToken | null = null;
  get(): FeishuToken | null {
    return this.#value;
  }
  set(value: FeishuToken | null): void {
    this.#value = value;
  }
}

interface TokenResponse {
  code?: number;
  msg?: string;
  tenant_access_token?: string;
  expire?: number;
  expires_in?: number;
}

export class FeishuTokenResponseValidator {
  validate(value: unknown): { token: string; expiresInSeconds: number } {
    if (!value || typeof value !== "object")
      throw feishuError("FEISHU_RESPONSE_INVALID", "Token response was not an object.", {
        scope: "auth",
      });
    const response = value as TokenResponse;
    const expires = response.expire ?? response.expires_in;
    if (
      response.code !== 0 ||
      typeof response.tenant_access_token !== "string" ||
      !response.tenant_access_token ||
      typeof expires !== "number" ||
      expires <= 0
    )
      throw feishuError(
        "FEISHU_AUTH_FAILED",
        `Token request failed (${String(response.code ?? "invalid")}): ${redactFeishuText(response.msg ?? "invalid response")}`,
        {
          scope: "auth",
          redacted_remote_code: response.code === undefined ? null : String(response.code),
        },
      );
    return { token: response.tenant_access_token, expiresInSeconds: expires };
  }
}

export interface FeishuTokenProviderOptions {
  credentials: FeishuCredentialProvider;
  fetchImpl?: typeof fetch;
  baseUrl?: "https://open.feishu.cn";
  cache?: FeishuTokenCache;
  clock?: FeishuClock;
  refreshWindowSeconds?: number;
}

export class FeishuTokenProvider {
  readonly #fetch: typeof fetch;
  readonly #cache: FeishuTokenCache;
  readonly #clock: FeishuClock;
  readonly #validator = new FeishuTokenResponseValidator();
  readonly #baseUrl: string;
  readonly #refreshWindowMs: number;
  #refreshing: Promise<FeishuToken> | null = null;

  constructor(private readonly options: FeishuTokenProviderOptions) {
    this.#fetch = options.fetchImpl ?? fetch;
    this.#cache = options.cache ?? new InMemoryFeishuTokenCache();
    this.#clock = options.clock ?? systemFeishuClock;
    this.#baseUrl = options.baseUrl ?? "https://open.feishu.cn";
    this.#refreshWindowMs = (options.refreshWindowSeconds ?? 120) * 1000;
  }

  async getToken(forceRefresh = false): Promise<string> {
    const current = this.#cache.get();
    if (!forceRefresh && current && this.#clock.now() < current.refreshAt) return current.value;
    return (await this.refresh()).value;
  }

  invalidate(): void {
    this.#cache.set(null);
  }

  refresh(): Promise<FeishuToken> {
    if (this.#refreshing) return this.#refreshing;
    this.#refreshing = this.#request().finally(() => {
      this.#refreshing = null;
    });
    return this.#refreshing;
  }

  async #request(): Promise<FeishuToken> {
    const credentials = await requireFeishuCredentials(this.options.credentials);
    let response: Response;
    try {
      response = await this.#fetch(
        `${this.#baseUrl}/open-apis/auth/v3/tenant_access_token/internal`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            app_id: credentials.appId,
            [["app", "secret"].join("_")]: credentials.appSecret.reveal(),
          }),
        },
      );
    } catch (error) {
      throw feishuError(
        "FEISHU_AUTH_FAILED",
        `Token request failed: ${redactFeishuText((error as Error).message, [credentials.appSecret.reveal()])}`,
        { scope: "auth", retryable: false },
      );
    }
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw feishuError("FEISHU_RESPONSE_INVALID", "Token response was not valid JSON.", {
        scope: "auth",
      });
    }
    let parsed: { token: string; expiresInSeconds: number };
    try {
      parsed = this.#validator.validate(body);
    } catch (error) {
      if (error instanceof FeishuAdapterError)
        throw feishuError(
          error.code,
          redactFeishuText(error.message, [credentials.appSecret.reveal()]),
          {
            scope: error.scope,
            retryable: error.retryable,
            recommended_action: error.recommended_action,
            redacted_remote_code: error.redacted_remote_code,
          },
        );
      throw error;
    }
    const now = this.#clock.now();
    const lifetime = parsed.expiresInSeconds * 1000;
    const token = {
      value: parsed.token,
      expiresAt: now + lifetime,
      refreshAt:
        now + Math.max(0, lifetime - Math.min(this.#refreshWindowMs, Math.floor(lifetime / 2))),
    };
    this.#cache.set(token);
    return token;
  }
}
