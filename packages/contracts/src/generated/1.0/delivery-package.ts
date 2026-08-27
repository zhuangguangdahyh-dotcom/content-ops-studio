/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Approved-only portable delivery inventory, separate from immutable audit history.
 */
export interface DeliveryPackage {
  delivery_package_id: string;
  delivery_package_version: "1.0.0";
  final_manifest_id: string;
  final_set_fingerprint: string;
  root_ref: string;
  /**
   * @minItems 1
   */
  pages: [
    {
      page_number: number;
      filename: string;
      checksum: string;
    },
    ...{
      page_number: number;
      filename: string;
      checksum: string;
    }[],
  ];
  /**
   * @minItems 3
   * @maxItems 3
   */
  previews: [
    "contact-sheet-full.png" | "contact-sheet-310.png" | "contact-sheet-186.png",
    "contact-sheet-full.png" | "contact-sheet-310.png" | "contact-sheet-186.png",
    "contact-sheet-full.png" | "contact-sheet-310.png" | "contact-sheet-186.png",
  ];
  /**
   * @minItems 2
   */
  reports: [
    "finalization-summary.json" | "delivery-integrity-report.json",
    "finalization-summary.json" | "delivery-integrity-report.json",
    ...("finalization-summary.json" | "delivery-integrity-report.json")[],
  ];
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
}
