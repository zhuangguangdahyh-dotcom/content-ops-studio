import path from "node:path";
import type { RuntimeConfig } from "../../../contracts/src/generated/1.0/index.js";
import type { RuntimeMode } from "../types.js";
import { RuntimeFailure } from "../types.js";
import {
  DEFAULT_RUNTIME_SUPPORT_POLICY,
  evaluateRuntimeSupport,
  type RuntimeSupportPolicy,
} from "../runtime-policy/index.js";

export function validateRuntimeConfig(
  config: RuntimeConfig,
  runtimeVersion = process.version,
  policy: RuntimeSupportPolicy = DEFAULT_RUNTIME_SUPPORT_POLICY,
): string[] {
  const issues: string[] = [];
  if (!path.isAbsolute(config.content_ops_home)) issues.push("CONTENT_OPS_HOME_NOT_ABSOLUTE");
  if (!path.isAbsolute(config.plugin_root)) issues.push("PLUGIN_ROOT_NOT_ABSOLUTE");
  if (config.allow_external_network) issues.push("EXTERNAL_NETWORK_FORBIDDEN");
  if (
    !config.required_runtime_policy ||
    config.required_runtime_policy.policy_version !== policy.policyVersion ||
    config.required_runtime_policy.runtime_name !== policy.primaryRuntime.name ||
    config.required_runtime_policy.primary_major !== policy.primaryRuntime.major ||
    config.required_runtime_policy.supported_range !== policy.primaryRuntime.range
  )
    issues.push("RUNTIME_POLICY_INVALID");
  try {
    const runtime = evaluateRuntimeSupport(policy, runtimeVersion);
    if (runtime.status !== "SUPPORTED")
      issues.push(runtime.status === "UNCLAIMED" ? "UNCLAIMED_RUNTIME" : "UNSUPPORTED_RUNTIME");
  } catch (error) {
    issues.push(error instanceof RuntimeFailure ? error.code : "RUNTIME_VERSION_MISMATCH");
  }
  if (config.runtime_mode === "PRODUCTION") {
    if (config.allow_fixture_workflows) issues.push("PRODUCTION_FIXTURE_WORKFLOW_FORBIDDEN");
    if (config.allow_mock_adapters) issues.push("PRODUCTION_MOCK_ADAPTER_FORBIDDEN");
    for (const selection of [
      config.workspace_adapter,
      config.research_adapter,
      config.image_adapter,
      config.renderer_adapter,
      config.asset_store,
    ])
      if (selection.capability_status !== "AVAILABLE")
        issues.push(`PRODUCTION_CAPABILITY_BLOCKED:${selection.implementation}`);
  }
  if (config.runtime_mode === "DRY_RUN" && config.allow_fixture_workflows)
    issues.push("DRY_RUN_FIXTURE_EXECUTION_FORBIDDEN");
  return issues;
}

export function assertRuntimeConfig(
  config: RuntimeConfig,
  runtimeVersion = process.version,
  policy: RuntimeSupportPolicy = DEFAULT_RUNTIME_SUPPORT_POLICY,
): void {
  const issues = validateRuntimeConfig(config, runtimeVersion, policy);
  if (issues.length) {
    const stableCode = issues.find((issue) =>
      [
        "UNSUPPORTED_RUNTIME",
        "UNCLAIMED_RUNTIME",
        "RUNTIME_VERSION_MISMATCH",
        "RUNTIME_POLICY_INVALID",
      ].includes(issue),
    );
    throw new RuntimeFailure(stableCode ?? "RUNTIME_CONFIG_INVALID", issues.join("; "), 2);
  }
}

export function modeAllowsBusinessWrites(mode: RuntimeMode): boolean {
  return mode === "MOCK";
}

export function assertWorkflowMode(
  mode: RuntimeMode,
  supportedModes: readonly string[],
  fixtureOnly: boolean,
): void {
  if (!supportedModes.includes(mode))
    throw new RuntimeFailure("WORKFLOW_MODE_UNSUPPORTED", `Workflow does not support ${mode}.`, 2);
  if (mode === "PRODUCTION" && fixtureOnly)
    throw new RuntimeFailure(
      "PRODUCTION_FIXTURE_WORKFLOW_FORBIDDEN",
      "Fixture workflow blocked.",
      2,
    );
}
