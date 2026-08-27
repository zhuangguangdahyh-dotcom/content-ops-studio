import { feishuError } from "../errors.js";

export type FeishuCredentialName =
  "appId" | "appSecret" | "parentFolderToken" | "testParentFolderToken";

export class SecretValue {
  readonly #value: string;
  constructor(value: string) {
    this.#value = value;
    Object.freeze(this);
  }
  reveal(): string {
    return this.#value;
  }
  toString(): string {
    return "[REDACTED]";
  }
  toJSON(): string {
    return "[REDACTED]";
  }
}

export interface FeishuCredentialSet {
  appId: string;
  appSecret: SecretValue;
  parentFolderToken: SecretValue | null;
  testParentFolderToken: SecretValue | null;
}

export interface RedactedCredentialDiagnostic {
  provider: "FEISHU";
  source: string;
  presence: Record<FeishuCredentialName, boolean>;
  secret_redaction_verified: true;
}

export interface FeishuCredentialProvider {
  get(name: FeishuCredentialName): Promise<string | null>;
  diagnostic(): Promise<RedactedCredentialDiagnostic>;
}

const ENV_NAMES: Record<FeishuCredentialName, string> = {
  appId: "FEISHU_APP_ID",
  appSecret: "FEISHU_APP_SECRET",
  parentFolderToken: "FEISHU_PARENT_FOLDER_TOKEN",
  testParentFolderToken: "FEISHU_TEST_PARENT_FOLDER_TOKEN",
};

export class EnvironmentFeishuCredentialProvider implements FeishuCredentialProvider {
  constructor(private readonly environment: NodeJS.ProcessEnv = process.env) {}
  get(name: FeishuCredentialName): Promise<string | null> {
    const value = this.environment[ENV_NAMES[name]];
    return Promise.resolve(value?.trim() || null);
  }
  async diagnostic(): Promise<RedactedCredentialDiagnostic> {
    const entries = await Promise.all(
      (Object.keys(ENV_NAMES) as FeishuCredentialName[]).map(
        async (name) => [name, Boolean(await this.get(name))] as const,
      ),
    );
    return {
      provider: "FEISHU",
      source: "ENVIRONMENT",
      presence: Object.fromEntries(entries) as Record<FeishuCredentialName, boolean>,
      secret_redaction_verified: true,
    };
  }
}

export class CompositeFeishuCredentialProvider implements FeishuCredentialProvider {
  constructor(private readonly providers: FeishuCredentialProvider[]) {}
  async get(name: FeishuCredentialName): Promise<string | null> {
    for (const provider of this.providers) {
      const value = await provider.get(name);
      if (value) return value;
    }
    return null;
  }
  async diagnostic(): Promise<RedactedCredentialDiagnostic> {
    const entries = await Promise.all(
      (Object.keys(ENV_NAMES) as FeishuCredentialName[]).map(
        async (name) => [name, Boolean(await this.get(name))] as const,
      ),
    );
    return {
      provider: "FEISHU",
      source: "COMPOSITE",
      presence: Object.fromEntries(entries) as Record<FeishuCredentialName, boolean>,
      secret_redaction_verified: true,
    };
  }
}

export async function requireFeishuCredentials(
  provider: FeishuCredentialProvider,
  requireTestFolder = false,
): Promise<FeishuCredentialSet> {
  const [appId, appSecret, parentFolderToken, testParentFolderToken] = await Promise.all([
    provider.get("appId"),
    provider.get("appSecret"),
    provider.get("parentFolderToken"),
    provider.get("testParentFolderToken"),
  ]);
  const missing = [
    !appId && "FEISHU_APP_ID",
    !appSecret && "FEISHU_APP_SECRET",
    requireTestFolder && !testParentFolderToken && "FEISHU_TEST_PARENT_FOLDER_TOKEN",
  ].filter(Boolean);
  if (missing.length)
    throw feishuError(
      "FEISHU_CREDENTIALS_MISSING",
      `Missing required credential references: ${missing.join(", ")}.`,
      {
        scope: "credentials",
        recommended_action:
          "Configure the missing environment variables; never pass the secret on the CLI.",
      },
    );
  return {
    appId: appId ?? "",
    appSecret: new SecretValue(appSecret ?? ""),
    parentFolderToken: parentFolderToken ? new SecretValue(parentFolderToken) : null,
    testParentFolderToken: testParentFolderToken ? new SecretValue(testParentFolderToken) : null,
  };
}
