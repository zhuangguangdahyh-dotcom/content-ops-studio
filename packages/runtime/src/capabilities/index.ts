import type { RuntimeMode } from "../types.js";
import type { CapabilityStatus, Clock } from "../types.js";
import { RuntimeFailure } from "../types.js";

export interface CapabilityRecord {
  capability: string;
  provider: string;
  status: CapabilityStatus;
  limitations: string[];
  last_verified_at: string;
  blocking_reason: string | null;
}

export class CapabilityRegistry {
  readonly #records = new Map<string, CapabilityRecord>();
  constructor(private readonly clock: Clock) {}

  registerCapability(
    capability: string,
    provider: string,
    status: CapabilityStatus,
    limitations: string[] = [],
    blockingReason: string | null = null,
  ): CapabilityRecord {
    const record: CapabilityRecord = {
      capability,
      provider,
      status,
      limitations: [...limitations],
      last_verified_at: this.clock.now().toISOString(),
      blocking_reason: blockingReason,
    };
    this.#records.set(capability, record);
    return structuredClone(record);
  }

  probeCapabilities(): CapabilityRecord[] {
    return [...this.#records.values()].map((record) => structuredClone(record));
  }

  requireCapabilities(requirements: readonly string[], mode: RuntimeMode): CapabilityRecord[] {
    const selected = requirements.map((capability) => {
      const record = this.#records.get(capability);
      if (!record)
        return this.registerCapability(
          capability,
          "unregistered",
          "UNKNOWN",
          [],
          "Capability is not registered.",
        );
      return record;
    });
    const blocked = selected.filter(
      (record) =>
        record.status !== "AVAILABLE" && !(mode === "MOCK" && record.status === "MOCK_ONLY"),
    );
    if (blocked.length)
      throw new RuntimeFailure(
        "CAPABILITY_BLOCKED",
        blocked.map((record) => `${record.capability}:${record.status}`).join("; "),
        2,
      );
    return selected.map((record) => structuredClone(record));
  }

  assertProductionReady(requirements: readonly string[]): void {
    this.requireCapabilities(requirements, "PRODUCTION");
  }

  buildDiagnosticReport(mode: RuntimeMode): {
    capabilities: CapabilityRecord[];
    ready: boolean;
    warnings: string[];
  } {
    const capabilities = this.probeCapabilities();
    const ready = capabilities.every(
      (record) =>
        record.status === "AVAILABLE" || (mode === "MOCK" && record.status === "MOCK_ONLY"),
    );
    return {
      capabilities,
      ready,
      warnings: capabilities
        .filter((record) => record.status === "MOCK_ONLY")
        .map((record) => `${record.capability} is MOCK_ONLY.`),
    };
  }
}

export function registerCapability(
  registry: CapabilityRegistry,
  capability: string,
  provider: string,
  status: CapabilityStatus,
) {
  return registry.registerCapability(capability, provider, status);
}
export function probeCapabilities(registry: CapabilityRegistry) {
  return registry.probeCapabilities();
}
export function requireCapabilities(
  registry: CapabilityRegistry,
  capabilities: string[],
  mode: RuntimeMode,
) {
  return registry.requireCapabilities(capabilities, mode);
}
export function buildDiagnosticReport(registry: CapabilityRegistry, mode: RuntimeMode) {
  return registry.buildDiagnosticReport(mode);
}
export function assertProductionReady(registry: CapabilityRegistry, requirements: string[]) {
  return registry.assertProductionReady(requirements);
}
