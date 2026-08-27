/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Honest Skill or runtime capability status.
 */
export interface Capabilities {
  capability_id: string;
  implementation_status: "SCAFFOLD" | "NOT_IMPLEMENTED" | "MOCK_ONLY";
  required: boolean;
  provider:
    "LOCAL" | "FEISHU" | "RESEARCH" | "IMAGE_GENERATION" | "RENDERER" | "PUBLISHING" | "MOCK";
  /**
   * @minItems 1
   */
  operations: [string, ...string[]];
  /**
   * @minItems 1
   */
  limitations: [string, ...string[]];
  last_verified_at: string;
}
