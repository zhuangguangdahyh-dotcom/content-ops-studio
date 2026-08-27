/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Evidence that privacy-bearing PNG chunks were removed without re-encoding the compressed pixel stream.
 */
export interface PngMetadataSanitizationReport {
  report_id: string;
  final_manifest_id: string;
  /**
   * @minItems 1
   */
  pages: [
    {
      page_number: number;
      filename: string;
      source_sha256: string;
      output_sha256: string;
      width: number;
      height: number;
      bit_depth: 1 | 2 | 4 | 8 | 16;
      color_type: 0 | 2 | 3 | 4 | 6;
      idat_sha256: string;
      removed_chunk_count: number;
      removed_chunk_types: ("caBX" | "eXIf" | "tEXt" | "zTXt" | "iTXt" | "tIME")[];
      pixel_stream_unchanged: true;
      dimensions_unchanged: true;
      bit_depth_unchanged: true;
      color_type_unchanged: true;
      pixel_reencoded: false;
    },
    ...{
      page_number: number;
      filename: string;
      source_sha256: string;
      output_sha256: string;
      width: number;
      height: number;
      bit_depth: 1 | 2 | 4 | 8 | 16;
      color_type: 0 | 2 | 3 | 4 | 6;
      idat_sha256: string;
      removed_chunk_count: number;
      removed_chunk_types: ("caBX" | "eXIf" | "tEXt" | "zTXt" | "iTXt" | "tIME")[];
      pixel_stream_unchanged: true;
      dimensions_unchanged: true;
      bit_depth_unchanged: true;
      color_type_unchanged: true;
      pixel_reencoded: false;
    }[],
  ];
  page_count: number;
  removed_chunk_count: number;
  pixel_reencoded: false;
  generated_at: string;
  run_id: string;
  schema_version: "1.0.0";
}
