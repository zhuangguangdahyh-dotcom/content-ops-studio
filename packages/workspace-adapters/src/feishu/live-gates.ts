import { feishuError } from "./errors.js";

export interface FeishuLiveGateResult {
  environmentEnabled: boolean;
  cliConfirmed: boolean;
  dryRun: boolean;
  allowed: boolean;
  status: "DISABLED" | "ENVIRONMENT_ONLY" | "CLI_ONLY" | "CONFIRMED";
}

export function evaluateFeishuLiveWriteGate(options: {
  environment?: NodeJS.ProcessEnv;
  cliConfirmed: boolean;
  dryRun?: boolean;
}): FeishuLiveGateResult {
  const environmentEnabled =
    (options.environment ?? process.env).CONTENT_OPS_ENABLE_LIVE_FEISHU === "1";
  const dryRun = options.dryRun ?? false;
  const status =
    environmentEnabled && options.cliConfirmed
      ? "CONFIRMED"
      : environmentEnabled
        ? "ENVIRONMENT_ONLY"
        : options.cliConfirmed
          ? "CLI_ONLY"
          : "DISABLED";
  return {
    environmentEnabled,
    cliConfirmed: options.cliConfirmed,
    dryRun,
    allowed: !dryRun && status === "CONFIRMED",
    status,
  };
}

export function assertFeishuLiveWriteAllowed(result: FeishuLiveGateResult): void {
  if (result.dryRun)
    throw feishuError("FEISHU_LIVE_WRITE_DISABLED", "Dry-run forbids remote writes.", {
      scope: "live-write-gate",
    });
  if (!result.environmentEnabled)
    throw feishuError(
      "FEISHU_LIVE_WRITE_DISABLED",
      "CONTENT_OPS_ENABLE_LIVE_FEISHU is not enabled.",
      {
        scope: "live-write-gate",
        recommended_action: "Set CONTENT_OPS_ENABLE_LIVE_FEISHU=1 only for an authorized write.",
      },
    );
  if (!result.cliConfirmed)
    throw feishuError(
      "FEISHU_LIVE_WRITE_NOT_CONFIRMED",
      "The CLI live-write confirmation is missing.",
      {
        scope: "live-write-gate",
        recommended_action: "Review the plan, then pass --confirm-live-write.",
      },
    );
}
