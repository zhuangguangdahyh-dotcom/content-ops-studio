/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualAmbiguityReport {
  report_id: string;
  strategy_plan_id: string;
  major_ambiguities: {
    code: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "BLOCKING";
    description: string;
    /**
     * @minItems 1
     */
    affected_decisions: [string, ...string[]];
  }[];
  blocking: boolean;
  /**
   * @maxItems 3
   */
  recommended_clarification_questions: [] | [string] | [string, string] | [string, string, string];
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
