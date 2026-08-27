import { describe, expect, it } from "vitest";
import {
  LarkCliCapabilityProbe,
  LarkCliVersionPolicy,
  REQUIRED_LARK_BASE_COMMANDS,
} from "../../packages/workspace-adapters/src/lark-cli/index.js";

describe("official CLI version and capabilities", () => {
  it("claims only the exact tested version", () => {
    const policy = new LarkCliVersionPolicy();
    expect(policy.evaluate("lark-cli version 1.0.63")).toEqual({
      status: "SUPPORTED",
      version: "1.0.63",
    });
    expect(policy.evaluate("1.0.62").status).toBe("TOO_OLD");
    expect(policy.evaluate("1.0.89").status).toBe("UNCLAIMED");
    expect(policy.evaluate("latest").status).toBe("INVALID");
  });

  it("fails closed when a required typed command is absent", () => {
    const probe = new LarkCliCapabilityProbe();
    const ready = probe.inspectHelp(REQUIRED_LARK_BASE_COMMANDS.join("\n"));
    expect(ready.status).toBe("READY");
    expect(ready.rawApiFallbackEnabled).toBe(false);
    const blocked = probe.inspectHelp(
      REQUIRED_LARK_BASE_COMMANDS.filter((item) => item !== "+view-create").join("\n"),
    );
    expect(blocked.status).toBe("BLOCKED");
    expect(blocked.missingCommands).toEqual(["+view-create"]);
  });
});
