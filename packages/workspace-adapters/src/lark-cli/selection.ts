export type WorkspaceAdapterPreference = "AUTO" | "LARK_CLI" | "DIRECT_FEISHU" | "MOCK";
export type WorkspaceAdapterSelection =
  | { status: "READY"; adapter: "LARK_CLI" | "DIRECT_FEISHU" | "MOCK" }
  | { status: "AWAITING_USER_AUTHORIZATION"; adapter: "LARK_CLI" }
  | {
      status: "BLOCKED";
      code:
        | "LARK_CLI_NOT_INSTALLED"
        | "DIRECT_FEISHU_NOT_EXPLICIT"
        | "PRODUCTION_MOCK_ADAPTER_FORBIDDEN";
    };

export function selectWorkspaceAdapter(input: {
  preference?: WorkspaceAdapterPreference;
  production: boolean;
  larkInstalled: boolean;
  larkAuthenticated: boolean;
  directExplicitlyConfigured?: boolean;
}): WorkspaceAdapterSelection {
  const preference = input.preference ?? "AUTO";
  if (preference === "MOCK")
    return input.production
      ? { status: "BLOCKED", code: "PRODUCTION_MOCK_ADAPTER_FORBIDDEN" }
      : { status: "READY", adapter: "MOCK" };
  if (preference === "DIRECT_FEISHU")
    return input.directExplicitlyConfigured
      ? { status: "READY", adapter: "DIRECT_FEISHU" }
      : { status: "BLOCKED", code: "DIRECT_FEISHU_NOT_EXPLICIT" };
  if (!input.larkInstalled) return { status: "BLOCKED", code: "LARK_CLI_NOT_INSTALLED" };
  if (!input.larkAuthenticated)
    return { status: "AWAITING_USER_AUTHORIZATION", adapter: "LARK_CLI" };
  return { status: "READY", adapter: "LARK_CLI" };
}
