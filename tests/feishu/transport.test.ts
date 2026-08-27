import { describe, expect, it, vi } from "vitest";
import {
  BoundedFeishuRateLimitController,
  NodeFetchFeishuTransport,
  type FeishuAccessTokenProvider,
} from "../../packages/workspace-adapters/src/index.js";

function tokenProvider(): FeishuAccessTokenProvider {
  return { getToken: vi.fn(() => Promise.resolve("token-demo")), invalidate: vi.fn() };
}
function response(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(typeof body === "string" ? body : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

describe("NodeFetchFeishuTransport", () => {
  it("returns validated platform data without exposing authorization", async () => {
    const fetchImpl = vi.fn((_url: URL | RequestInfo, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ authorization: "Bearer token-demo" });
      return Promise.resolve(response({ code: 0, data: { ok: true } }));
    });
    const transport = new NodeFetchFeishuTransport({
      tokenProvider: tokenProvider(),
      fetchImpl: fetchImpl,
    });
    await expect(
      transport.request({
        operation: "LIST_TABLES",
        method: "GET",
        path: "/open-apis/bitable/v1/apps/app-demo/tables",
      }),
    ).resolves.toMatchObject({ data: { ok: true }, attempts: 1 });
  });

  it.each([
    [403, { code: 999, msg: "denied" }, "FEISHU_PERMISSION_DENIED"],
    [400, { code: 1254002, msg: "bad field" }, "FEISHU_API_ERROR"],
  ])("classifies non-retryable HTTP %s", async (status, body, code) => {
    const transport = new NodeFetchFeishuTransport({
      tokenProvider: tokenProvider(),
      fetchImpl: vi.fn(() => Promise.resolve(response(body, status))),
      maxAttempts: 3,
    });
    await expect(
      transport.request({
        operation: "CREATE_FIELD",
        method: "POST",
        path: "/open-apis/bitable/v1/apps/app/tables/table/fields",
        body: {},
      }),
    ).rejects.toMatchObject({ code });
  });

  it("refreshes authentication once", async () => {
    let invalidations = 0;
    const provider: FeishuAccessTokenProvider = {
      getToken: vi.fn(() => Promise.resolve("token-demo")),
      invalidate: () => {
        invalidations += 1;
      },
    };
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(response({ code: 99991663, msg: "expired" }, 401))
      .mockResolvedValueOnce(response({ code: 0, data: { ok: true } }));
    const transport = new NodeFetchFeishuTransport({
      tokenProvider: provider,
      fetchImpl: fetchImpl as typeof fetch,
    });
    await expect(
      transport.request({
        operation: "GET_WORKSPACE",
        method: "GET",
        path: "/open-apis/bitable/v1/apps/app",
      }),
    ).resolves.toMatchObject({ attempts: 2 });
    expect(invalidations).toBe(1);
  });

  it.each([429, 408, 500, 503])("bounds retries for HTTP %s", async (status) => {
    const events: unknown[] = [];
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(response({ code: 1, msg: "retry" }, status, { "retry-after": "0" }))
      .mockResolvedValueOnce(response({ code: 0, data: { ok: true } }));
    const transport = new NodeFetchFeishuTransport({
      tokenProvider: tokenProvider(),
      fetchImpl: fetchImpl as typeof fetch,
      rateLimitController: new BoundedFeishuRateLimitController(
        0,
        0,
        () => Promise.resolve(),
        () => 0,
      ),
      onRetry: (event) => events.push(event),
    });
    await expect(
      transport.request({
        operation: "LIST_TABLES",
        method: "GET",
        path: "/open-apis/bitable/v1/apps/app/tables",
      }),
    ).resolves.toMatchObject({ attempts: 2 });
    expect(events).toHaveLength(1);
  });

  it("rejects invalid JSON and non-allowlisted URLs", async () => {
    const transport = new NodeFetchFeishuTransport({
      tokenProvider: tokenProvider(),
      fetchImpl: vi.fn(() => Promise.resolve(response("not-json"))),
    });
    await expect(
      transport.request({
        operation: "LIST_TABLES",
        method: "GET",
        path: "/open-apis/bitable/v1/apps/app/tables",
      }),
    ).rejects.toMatchObject({ code: "FEISHU_RESPONSE_INVALID" });
    await expect(
      transport.request({ operation: "SSRF", method: "GET", path: "https://example.com/secret" }),
    ).rejects.toMatchObject({ code: "FEISHU_CONFIG_MISSING" });
  });

  it("honors an already-aborted caller signal", async () => {
    const controller = new AbortController();
    controller.abort();
    const transport = new NodeFetchFeishuTransport({
      tokenProvider: tokenProvider(),
      fetchImpl: vi.fn((_url: URL | RequestInfo, init?: RequestInit) => {
        init?.signal?.throwIfAborted();
        return Promise.resolve(response({ code: 0 }));
      }),
    });
    await expect(
      transport.request({
        operation: "LIST_TABLES",
        method: "GET",
        path: "/open-apis/bitable/v1/apps/app/tables",
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({ code: "FEISHU_API_ERROR" });
  });
});
