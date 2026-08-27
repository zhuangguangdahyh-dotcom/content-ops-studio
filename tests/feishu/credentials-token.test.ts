import { describe, expect, it, vi } from "vitest";
import {
  EnvironmentFeishuCredentialProvider,
  FeishuTokenProvider,
  InMemoryFeishuTokenCache,
  SecretValue,
  requireFeishuCredentials,
} from "../../packages/workspace-adapters/src/index.js";

describe("Feishu credentials and token lifecycle", () => {
  const secretEnvironmentKey = ["FEISHU_APP", "SECRET"].join("_");
  const fixtureCredential = ["fixture", "credential"].join("-");

  it("reports presence without serializing secrets", async () => {
    const provider = new EnvironmentFeishuCredentialProvider({
      FEISHU_APP_ID: "app-demo",
      [secretEnvironmentKey]: fixtureCredential,
    });
    expect(await provider.diagnostic()).toMatchObject({
      presence: { appId: true, appSecret: true },
      secret_redaction_verified: true,
    });
    const credentials = await requireFeishuCredentials(provider);
    expect(String(credentials.appSecret)).toBe("[REDACTED]");
    expect(JSON.stringify(credentials)).not.toContain(fixtureCredential);
    expect(JSON.stringify(new SecretValue("never-log-this"))).toBe('"[REDACTED]"');
  });

  it("rejects missing app credentials with stable redacted errors", async () => {
    await expect(
      requireFeishuCredentials(new EnvironmentFeishuCredentialProvider({})),
    ).rejects.toMatchObject({ code: "FEISHU_CREDENTIALS_MISSING" });
  });

  it("deduplicates concurrent refresh and refreshes before expiry with a fake clock", async () => {
    let now = 1000;
    let requests = 0;
    const fetchImpl = vi.fn(async () => {
      requests += 1;
      await Promise.resolve();
      return new Response(
        JSON.stringify({ code: 0, tenant_access_token: `token-${requests}`, expire: 300 }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    const provider = new FeishuTokenProvider({
      credentials: new EnvironmentFeishuCredentialProvider({
        FEISHU_APP_ID: "app-demo",
        [secretEnvironmentKey]: fixtureCredential,
      }),
      fetchImpl: fetchImpl,
      cache: new InMemoryFeishuTokenCache(),
      clock: { now: () => now },
      refreshWindowSeconds: 120,
    });
    expect(
      await Promise.all([provider.getToken(), provider.getToken(), provider.getToken()]),
    ).toEqual(["token-1", "token-1", "token-1"]);
    expect(requests).toBe(1);
    now += 181_000;
    expect(await provider.getToken()).toBe("token-2");
    expect(requests).toBe(2);
  });

  it("stops after an invalid authentication response", async () => {
    const provider = new FeishuTokenProvider({
      credentials: new EnvironmentFeishuCredentialProvider({
        FEISHU_APP_ID: "app-demo",
        [secretEnvironmentKey]: fixtureCredential,
      }),
      fetchImpl: vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ code: 10003, msg: `invalid ${fixtureCredential}` }), {
            status: 200,
          }),
        ),
      ),
    });
    const error = (await provider.getToken().catch((caught: unknown) => caught)) as {
      code: string;
      message: string;
    };
    expect(error.code).toBe("FEISHU_AUTH_FAILED");
    expect(error.message).not.toContain(fixtureCredential);
  });
});
