import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { LarkCliError } from "./types.js";

export const LARK_CLI_PACKAGE = "@larksuite/cli";
export const LARK_CLI_TESTED_VERSION = "1.0.63";
export const LARK_CLI_INSTALL_COMMAND = ["npx", "@larksuite/cli@1.0.63", "install"] as const;

export type LarkCliVersionStatus = "SUPPORTED" | "TOO_OLD" | "UNCLAIMED" | "INVALID";

function tuple(version: string): [number, number, number] | null {
  const match = /(?:^|[^0-9])(\d+)\.(\d+)\.(\d+)(?:[^0-9]|$)/.exec(version.trim());
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function compare(left: [number, number, number], right: [number, number, number]): number {
  for (let index = 0; index < 3; index += 1) {
    const delta = (left[index] ?? 0) - (right[index] ?? 0);
    if (delta) return delta;
  }
  return 0;
}

export class LarkCliVersionPolicy {
  readonly testedVersion = LARK_CLI_TESTED_VERSION;

  evaluate(rawVersion: string): { status: LarkCliVersionStatus; version: string | null } {
    const parsed = tuple(rawVersion);
    const tested = tuple(this.testedVersion);
    if (!parsed || !tested) return { status: "INVALID", version: null };
    const version = parsed.join(".");
    const ordering = compare(parsed, tested);
    return {
      status: ordering === 0 ? "SUPPORTED" : ordering < 0 ? "TOO_OLD" : "UNCLAIMED",
      version,
    };
  }

  assertSupported(rawVersion: string): string {
    const result = this.evaluate(rawVersion);
    if (result.status === "SUPPORTED" && result.version) return result.version;
    if (result.status === "TOO_OLD")
      throw new LarkCliError(
        "LARK_CLI_VERSION_TOO_OLD",
        "The detected official CLI is older than the tested version.",
        2,
      );
    if (result.status === "UNCLAIMED")
      throw new LarkCliError(
        "UNCLAIMED_LARK_CLI_VERSION",
        "The detected official CLI version has not been claimed by this release.",
        2,
      );
    throw new LarkCliError(
      "LARK_CLI_VERSION_INVALID",
      "The official CLI version output was invalid.",
      2,
    );
  }
}

export async function resolveLarkCliBinary(
  options: {
    explicitBinary?: string;
    env?: NodeJS.ProcessEnv;
  } = {},
): Promise<string> {
  const candidate = options.explicitBinary ?? options.env?.CONTENT_OPS_LARK_CLI_PATH ?? "lark-cli";
  if (candidate.includes("\0"))
    throw new LarkCliError("LARK_CLI_BINARY_INVALID", "The CLI path is invalid.", 5);
  if (candidate.includes("/") || candidate.includes("\\")) {
    try {
      await access(candidate, constants.X_OK);
    } catch {
      throw new LarkCliError(
        "LARK_CLI_NOT_INSTALLED",
        "The configured official CLI executable is unavailable.",
        2,
      );
    }
  }
  return candidate;
}
