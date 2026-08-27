/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Distinguishes canonical Production projects from isolated fictional Calibration projects without widening Production project identifiers.
 */
export type ProjectReference =
  | {
      project_kind: "PRODUCTION_PROJECT";
      project_id: string;
    }
  | {
      project_kind: "CALIBRATION_PROJECT";
      project_id: string;
    };
