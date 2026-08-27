import { describe, expect, it } from "vitest";
import {
  calculateDeterministicFingerprint,
  normalizeFingerprintInput,
} from "../../packages/contracts/src/fingerprint.js";

const input = {
  painpoint_id: " P-0001 ",
  content_angle: "Evidence\r\n Checklist",
  core_viewpoint: "TRUST  EVIDENCE",
  cover_hook: "Ａ Clear Hook",
  content_structure_type: "CHECKLIST",
  main_conclusion: "Compare before choosing",
};

describe("deterministic content fingerprint", () => {
  it("normalizes NFKC, case, line endings, and whitespace explicitly", () => {
    expect(normalizeFingerprintInput(input)).toEqual({
      painpoint_id: "p-0001",
      content_angle: "evidence checklist",
      core_viewpoint: "trust evidence",
      cover_hook: "a clear hook",
      content_structure_type: "checklist",
      main_conclusion: "compare before choosing",
    });
  });

  it("is stable for equivalent inputs and remains a non-semantic hash", () => {
    const equivalent = Object.fromEntries(
      Object.entries(normalizeFingerprintInput(input)).map(([key, value]) => [key, ` ${value} `]),
    ) as typeof input;
    expect(calculateDeterministicFingerprint(input)).toBe(
      calculateDeterministicFingerprint(equivalent),
    );
    expect(calculateDeterministicFingerprint(input)).toMatch(/^[a-f0-9]{64}$/);
  });
});
