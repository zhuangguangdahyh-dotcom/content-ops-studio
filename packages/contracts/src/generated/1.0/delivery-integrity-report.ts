/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Read-after-write verification of an approved-only Delivery Package.
 */
export interface DeliveryIntegrityReport {
  report_id: string;
  delivery_package_id: string;
  final_manifest_id: string;
  /**
   * @minItems 18
   */
  checks: [
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    {
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    },
    ...{
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    }[],
  ];
  passed_count: number;
  failed_count: number;
  hard_block_count: number;
  overall_status: "PASSED" | "FAILED";
  verified_at: string;
  run_id: string;
  schema_version: "1.0.0";
}
