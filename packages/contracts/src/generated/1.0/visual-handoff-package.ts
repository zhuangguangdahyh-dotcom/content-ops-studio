/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualHandoffPackage {
  visual_handoff_package_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  visual_context_ref: string;
  visual_direction_decision: {
    visual_direction_decision_id: string;
    visual_context_id: string;
    /**
     * @minItems 1
     */
    candidates: [
      {
        candidate_id: string;
        visual_mode:
          | "SCENE_SERIES"
          | "EDITORIAL_SERIES"
          | "PRODUCT_LIFESTYLE"
          | "EVIDENCE_LED"
          | "MIXED"
          | "CHARACTER_SERIES"
          | "PURE_TYPOGRAPHY";
        direction_name: string;
        direction_summary: string;
        content_fit: string;
        industry_fit: string;
        platform_fit: string;
        project_fit: string;
        asset_feasibility: string;
        text_density_fit: string;
        background_strategy: string;
        typography_strategy: string;
        color_strategy: string;
        layout_strategy: string;
        evidence_strategy: string;
        strengths: string[];
        limitations: string[];
        blocking_risks: string[];
        score: number;
      },
      ...{
        candidate_id: string;
        visual_mode:
          | "SCENE_SERIES"
          | "EDITORIAL_SERIES"
          | "PRODUCT_LIFESTYLE"
          | "EVIDENCE_LED"
          | "MIXED"
          | "CHARACTER_SERIES"
          | "PURE_TYPOGRAPHY";
        direction_name: string;
        direction_summary: string;
        content_fit: string;
        industry_fit: string;
        platform_fit: string;
        project_fit: string;
        asset_feasibility: string;
        text_density_fit: string;
        background_strategy: string;
        typography_strategy: string;
        color_strategy: string;
        layout_strategy: string;
        evidence_strategy: string;
        strengths: string[];
        limitations: string[];
        blocking_risks: string[];
        score: number;
      }[],
    ];
    selected_candidate_id: string;
    selection_rationale: string;
    user_fixed_mode:
      | (
          | "SCENE_SERIES"
          | "EDITORIAL_SERIES"
          | "PRODUCT_LIFESTYLE"
          | "EVIDENCE_LED"
          | "MIXED"
          | "CHARACTER_SERIES"
          | "PURE_TYPOGRAPHY"
        )
      | null;
    user_fixed_direction: string | null;
    user_rejected_modes: (
      | "SCENE_SERIES"
      | "EDITORIAL_SERIES"
      | "PRODUCT_LIFESTYLE"
      | "EVIDENCE_LED"
      | "MIXED"
      | "CHARACTER_SERIES"
      | "PURE_TYPOGRAPHY"
    )[];
    user_rejected_directions: string[];
    industry_mode_preferences: (
      | "SCENE_SERIES"
      | "EDITORIAL_SERIES"
      | "PRODUCT_LIFESTYLE"
      | "EVIDENCE_LED"
      | "MIXED"
      | "CHARACTER_SERIES"
      | "PURE_TYPOGRAPHY"
    )[];
    platform_constraints: string[];
    asset_feasibility: string[];
    created_at: string;
    run_id: string;
    schema_version: "1.0.0";
    extensions: {
      [k: string]: unknown;
    };
  };
  visual_reference_manifest: {
    visual_reference_manifest_id: string;
    project_id: string;
    content_id: string;
    references: {
      reference_id: string;
      reference_type:
        | "PROJECT_ASSET"
        | "USER_REFERENCE"
        | "HISTORICAL_APPROVED_STYLE"
        | "EVIDENCE_ASSET"
        | "LICENSED_EXTERNAL_REFERENCE"
        | "INTERNAL_DESIGN_TOKEN";
      source_type: "PROJECT_HOME" | "EVIDENCE_RECORD" | "LICENSED_SOURCE" | "INTERNAL_TOKEN";
      asset_ref: string | null;
      source_location: string | null;
      evidence_id: string | null;
      description: string;
      allowed_usage: string[];
      prohibited_usage: string[];
      copyright_or_permission_status: "AUTHORIZED" | "LICENSED" | "RESTRICTED" | "UNKNOWN";
      style_attributes: string[];
      content_relevance: string;
      page_relevance: number[];
      approved: boolean;
      rejection_reason: string | null;
    }[];
    reference_count: number;
    reference_type_counts: {
      [k: string]: number;
    };
    approved_count: number;
    rejected_count: number;
    created_at: string;
    run_id: string;
    schema_version: "1.0.0";
    extensions: {
      [k: string]: unknown;
    };
  };
  /**
   * Version-bound global visual rules and the complete ordered page system.
   */
  visual_system: {
    visual_system_id: string;
    project_id: string;
    content_id: string;
    content_version: string;
    copy_version: string;
    visual_plan_version: string;
    visual_mode:
      | "SCENE_SERIES"
      | "EDITORIAL_SERIES"
      | "PRODUCT_LIFESTYLE"
      | "EVIDENCE_LED"
      | "MIXED"
      | "CHARACTER_SERIES"
      | "PURE_TYPOGRAPHY";
    visual_status:
      | "VISUAL_DRAFT"
      | "VISUAL_VALIDATED"
      | "FIRST_PAGE_READY"
      | "STYLE_LOCKED"
      | "VISUAL_INVALIDATED";
    canvas: {
      width: number;
      height: number;
      aspect_ratio: string;
      orientation: "PORTRAIT" | "LANDSCAPE" | "SQUARE";
      resolution_unit: "PX";
    };
    safe_area: {
      top: number;
      right: number;
      bottom: number;
      left: number;
      unit: "PX" | "PERCENT";
    };
    grid_system: {
      rules: string[];
    };
    /**
     * @minItems 1
     */
    typography_tokens: [
      {
        token_id: string;
        role: "TITLE" | "BODY" | "SUPPORTING" | "PAGE_NUMBER" | "BRAND";
        font_family: string;
        font_weight: number;
        font_size: number;
        line_height: number;
        letter_spacing: number;
        alignment: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFY";
        max_lines: number;
        overflow_strategy:
          "REFLOW" | "MOVE_TO_NEXT_PAGE" | "REVISE_COPY" | "CHANGE_LAYOUT" | "BLOCK_AND_RETURN";
      },
      ...{
        token_id: string;
        role: "TITLE" | "BODY" | "SUPPORTING" | "PAGE_NUMBER" | "BRAND";
        font_family: string;
        font_weight: number;
        font_size: number;
        line_height: number;
        letter_spacing: number;
        alignment: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFY";
        max_lines: number;
        overflow_strategy:
          "REFLOW" | "MOVE_TO_NEXT_PAGE" | "REVISE_COPY" | "CHANGE_LAYOUT" | "BLOCK_AND_RETURN";
      }[],
    ];
    /**
     * @minItems 1
     */
    color_tokens: [
      {
        token_id: string;
        role: "BACKGROUND" | "PRIMARY_TEXT" | "SECONDARY_TEXT" | "ACCENT" | "OVERLAY" | "BRAND";
        value: string;
        color_space: "SRGB" | "DISPLAY_P3" | "HEX" | "RGBA";
        opacity: number;
      },
      ...{
        token_id: string;
        role: "BACKGROUND" | "PRIMARY_TEXT" | "SECONDARY_TEXT" | "ACCENT" | "OVERLAY" | "BRAND";
        value: string;
        color_space: "SRGB" | "DISPLAY_P3" | "HEX" | "RGBA";
        opacity: number;
      }[],
    ];
    global_image_treatment: {
      brightness: number;
      contrast: number;
      saturation: number;
      blur: number;
      overlay: string;
      gradient: string;
      mask: string;
      crop_strategy: "COVER" | "CONTAIN" | "FOCAL_POINT" | "NONE";
    };
    global_layout_rules: {
      rules: string[];
    };
    brand_mark_rules: {
      rules: string[];
    };
    page_number_rules: {
      rules: string[];
    };
    global_visual_direction: string;
    global_background_strategy: string;
    global_negative_constraints: string[];
    project_rule_snapshot_id: string;
    platform_pack_id: string;
    platform_pack_version: string;
    industry_pack_id: string;
    industry_pack_version: string;
    /**
     * @minItems 1
     */
    pages: [
      {
        page_visual_plan_id: string;
        project_id: string;
        content_id: string;
        page_number: number;
        page_role:
          | "COVER"
          | "PROBLEM"
          | "SCENARIO"
          | "MISCONCEPTION"
          | "ANALYSIS"
          | "EVIDENCE"
          | "SOLUTION"
          | "STEP"
          | "COMPARISON"
          | "CASE"
          | "SUMMARY"
          | "CTA";
        content_version: string;
        copy_version: string;
        visual_plan_version: string;
        visual_mode:
          | "SCENE_SERIES"
          | "EDITORIAL_SERIES"
          | "PRODUCT_LIFESTYLE"
          | "EVIDENCE_LED"
          | "MIXED"
          | "CHARACTER_SERIES"
          | "PURE_TYPOGRAPHY";
        visual_purpose: string;
        copy_snapshot: {
          copy_version: string;
          headline: string;
          body: string;
          supporting_text: string;
        };
        background_direction: string;
        visual_evidence_requirement: string;
        asset_requirements: string[];
        composition: string;
        camera_and_lens_direction: string | null;
        lighting_direction: string | null;
        material_and_texture_direction: string | null;
        character_or_subject_direction: string | null;
        /**
         * @minItems 1
         */
        layout_regions: [
          {
            region_id: string;
            role: "BACKGROUND" | "TEXT" | "IMAGE" | "BRAND" | "PAGE_NUMBER";
            bbox: {
              x: number;
              y: number;
              width: number;
              height: number;
              unit: "PX" | "PERCENT";
            };
            z_index: number;
          },
          ...{
            region_id: string;
            role: "BACKGROUND" | "TEXT" | "IMAGE" | "BRAND" | "PAGE_NUMBER";
            bbox: {
              x: number;
              y: number;
              width: number;
              height: number;
              unit: "PX" | "PERCENT";
            };
            z_index: number;
          }[],
        ];
        text_layers: {
          layer_id: string;
          role: "TITLE" | "BODY" | "SUPPORTING" | "PAGE_NUMBER" | "BRAND";
          content_source: string;
          content_snapshot: string;
          bbox: {
            x: number;
            y: number;
            width: number;
            height: number;
            unit: "PX" | "PERCENT";
          };
          typography_token_id: string;
          color_token_id: string;
          z_index: number;
          required: boolean;
        }[];
        image_treatment: {
          brightness: number;
          contrast: number;
          saturation: number;
          blur: number;
          overlay: string;
          gradient: string;
          mask: string;
          crop_strategy: "COVER" | "CONTAIN" | "FOCAL_POINT" | "NONE";
        };
        safe_area: {
          top: number;
          right: number;
          bottom: number;
          left: number;
          unit: "PX" | "PERCENT";
        };
        estimated_text_density: number;
        max_text_density: number;
        overflow_strategy:
          "REFLOW" | "MOVE_TO_NEXT_PAGE" | "REVISE_COPY" | "CHANGE_LAYOUT" | "BLOCK_AND_RETURN";
        negative_constraints: string[];
        allowed_variations: string[];
        fallback_strategy: string;
        approval_dependency: "COPY_APPROVED" | "FIRST_PAGE_APPROVED";
        run_id: string;
        schema_version: "1.0.0";
        created_at: string;
        updated_at: string;
        extensions: {
          [k: string]: unknown;
        };
      },
      ...{
        page_visual_plan_id: string;
        project_id: string;
        content_id: string;
        page_number: number;
        page_role:
          | "COVER"
          | "PROBLEM"
          | "SCENARIO"
          | "MISCONCEPTION"
          | "ANALYSIS"
          | "EVIDENCE"
          | "SOLUTION"
          | "STEP"
          | "COMPARISON"
          | "CASE"
          | "SUMMARY"
          | "CTA";
        content_version: string;
        copy_version: string;
        visual_plan_version: string;
        visual_mode:
          | "SCENE_SERIES"
          | "EDITORIAL_SERIES"
          | "PRODUCT_LIFESTYLE"
          | "EVIDENCE_LED"
          | "MIXED"
          | "CHARACTER_SERIES"
          | "PURE_TYPOGRAPHY";
        visual_purpose: string;
        copy_snapshot: {
          copy_version: string;
          headline: string;
          body: string;
          supporting_text: string;
        };
        background_direction: string;
        visual_evidence_requirement: string;
        asset_requirements: string[];
        composition: string;
        camera_and_lens_direction: string | null;
        lighting_direction: string | null;
        material_and_texture_direction: string | null;
        character_or_subject_direction: string | null;
        /**
         * @minItems 1
         */
        layout_regions: [
          {
            region_id: string;
            role: "BACKGROUND" | "TEXT" | "IMAGE" | "BRAND" | "PAGE_NUMBER";
            bbox: {
              x: number;
              y: number;
              width: number;
              height: number;
              unit: "PX" | "PERCENT";
            };
            z_index: number;
          },
          ...{
            region_id: string;
            role: "BACKGROUND" | "TEXT" | "IMAGE" | "BRAND" | "PAGE_NUMBER";
            bbox: {
              x: number;
              y: number;
              width: number;
              height: number;
              unit: "PX" | "PERCENT";
            };
            z_index: number;
          }[],
        ];
        text_layers: {
          layer_id: string;
          role: "TITLE" | "BODY" | "SUPPORTING" | "PAGE_NUMBER" | "BRAND";
          content_source: string;
          content_snapshot: string;
          bbox: {
            x: number;
            y: number;
            width: number;
            height: number;
            unit: "PX" | "PERCENT";
          };
          typography_token_id: string;
          color_token_id: string;
          z_index: number;
          required: boolean;
        }[];
        image_treatment: {
          brightness: number;
          contrast: number;
          saturation: number;
          blur: number;
          overlay: string;
          gradient: string;
          mask: string;
          crop_strategy: "COVER" | "CONTAIN" | "FOCAL_POINT" | "NONE";
        };
        safe_area: {
          top: number;
          right: number;
          bottom: number;
          left: number;
          unit: "PX" | "PERCENT";
        };
        estimated_text_density: number;
        max_text_density: number;
        overflow_strategy:
          "REFLOW" | "MOVE_TO_NEXT_PAGE" | "REVISE_COPY" | "CHANGE_LAYOUT" | "BLOCK_AND_RETURN";
        negative_constraints: string[];
        allowed_variations: string[];
        fallback_strategy: string;
        approval_dependency: "COPY_APPROVED" | "FIRST_PAGE_APPROVED";
        run_id: string;
        schema_version: "1.0.0";
        created_at: string;
        updated_at: string;
        extensions: {
          [k: string]: unknown;
        };
      }[],
    ];
    created_by_skill: "visual-planning";
    run_id: string;
    schema_version: "1.0.0";
    created_at: string;
    updated_at: string;
    extensions: {
      [k: string]: unknown;
    };
  };
  /**
   * @minItems 1
   */
  page_visual_plans: [
    {
      page_visual_plan_id: string;
      project_id: string;
      content_id: string;
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      content_version: string;
      copy_version: string;
      visual_plan_version: string;
      visual_mode:
        | "SCENE_SERIES"
        | "EDITORIAL_SERIES"
        | "PRODUCT_LIFESTYLE"
        | "EVIDENCE_LED"
        | "MIXED"
        | "CHARACTER_SERIES"
        | "PURE_TYPOGRAPHY";
      visual_purpose: string;
      copy_snapshot: {
        copy_version: string;
        headline: string;
        body: string;
        supporting_text: string;
      };
      background_direction: string;
      visual_evidence_requirement: string;
      asset_requirements: string[];
      composition: string;
      camera_and_lens_direction: string | null;
      lighting_direction: string | null;
      material_and_texture_direction: string | null;
      character_or_subject_direction: string | null;
      /**
       * @minItems 1
       */
      layout_regions: [
        {
          region_id: string;
          role: "BACKGROUND" | "TEXT" | "IMAGE" | "BRAND" | "PAGE_NUMBER";
          bbox: {
            x: number;
            y: number;
            width: number;
            height: number;
            unit: "PX" | "PERCENT";
          };
          z_index: number;
        },
        ...{
          region_id: string;
          role: "BACKGROUND" | "TEXT" | "IMAGE" | "BRAND" | "PAGE_NUMBER";
          bbox: {
            x: number;
            y: number;
            width: number;
            height: number;
            unit: "PX" | "PERCENT";
          };
          z_index: number;
        }[],
      ];
      text_layers: {
        layer_id: string;
        role: "TITLE" | "BODY" | "SUPPORTING" | "PAGE_NUMBER" | "BRAND";
        content_source: string;
        content_snapshot: string;
        bbox: {
          x: number;
          y: number;
          width: number;
          height: number;
          unit: "PX" | "PERCENT";
        };
        typography_token_id: string;
        color_token_id: string;
        z_index: number;
        required: boolean;
      }[];
      image_treatment: {
        brightness: number;
        contrast: number;
        saturation: number;
        blur: number;
        overlay: string;
        gradient: string;
        mask: string;
        crop_strategy: "COVER" | "CONTAIN" | "FOCAL_POINT" | "NONE";
      };
      safe_area: {
        top: number;
        right: number;
        bottom: number;
        left: number;
        unit: "PX" | "PERCENT";
      };
      estimated_text_density: number;
      max_text_density: number;
      overflow_strategy:
        "REFLOW" | "MOVE_TO_NEXT_PAGE" | "REVISE_COPY" | "CHANGE_LAYOUT" | "BLOCK_AND_RETURN";
      negative_constraints: string[];
      allowed_variations: string[];
      fallback_strategy: string;
      approval_dependency: "COPY_APPROVED" | "FIRST_PAGE_APPROVED";
      run_id: string;
      schema_version: "1.0.0";
      created_at: string;
      updated_at: string;
      extensions: {
        [k: string]: unknown;
      };
    },
    ...{
      page_visual_plan_id: string;
      project_id: string;
      content_id: string;
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      content_version: string;
      copy_version: string;
      visual_plan_version: string;
      visual_mode:
        | "SCENE_SERIES"
        | "EDITORIAL_SERIES"
        | "PRODUCT_LIFESTYLE"
        | "EVIDENCE_LED"
        | "MIXED"
        | "CHARACTER_SERIES"
        | "PURE_TYPOGRAPHY";
      visual_purpose: string;
      copy_snapshot: {
        copy_version: string;
        headline: string;
        body: string;
        supporting_text: string;
      };
      background_direction: string;
      visual_evidence_requirement: string;
      asset_requirements: string[];
      composition: string;
      camera_and_lens_direction: string | null;
      lighting_direction: string | null;
      material_and_texture_direction: string | null;
      character_or_subject_direction: string | null;
      /**
       * @minItems 1
       */
      layout_regions: [
        {
          region_id: string;
          role: "BACKGROUND" | "TEXT" | "IMAGE" | "BRAND" | "PAGE_NUMBER";
          bbox: {
            x: number;
            y: number;
            width: number;
            height: number;
            unit: "PX" | "PERCENT";
          };
          z_index: number;
        },
        ...{
          region_id: string;
          role: "BACKGROUND" | "TEXT" | "IMAGE" | "BRAND" | "PAGE_NUMBER";
          bbox: {
            x: number;
            y: number;
            width: number;
            height: number;
            unit: "PX" | "PERCENT";
          };
          z_index: number;
        }[],
      ];
      text_layers: {
        layer_id: string;
        role: "TITLE" | "BODY" | "SUPPORTING" | "PAGE_NUMBER" | "BRAND";
        content_source: string;
        content_snapshot: string;
        bbox: {
          x: number;
          y: number;
          width: number;
          height: number;
          unit: "PX" | "PERCENT";
        };
        typography_token_id: string;
        color_token_id: string;
        z_index: number;
        required: boolean;
      }[];
      image_treatment: {
        brightness: number;
        contrast: number;
        saturation: number;
        blur: number;
        overlay: string;
        gradient: string;
        mask: string;
        crop_strategy: "COVER" | "CONTAIN" | "FOCAL_POINT" | "NONE";
      };
      safe_area: {
        top: number;
        right: number;
        bottom: number;
        left: number;
        unit: "PX" | "PERCENT";
      };
      estimated_text_density: number;
      max_text_density: number;
      overflow_strategy:
        "REFLOW" | "MOVE_TO_NEXT_PAGE" | "REVISE_COPY" | "CHANGE_LAYOUT" | "BLOCK_AND_RETURN";
      negative_constraints: string[];
      allowed_variations: string[];
      fallback_strategy: string;
      approval_dependency: "COPY_APPROVED" | "FIRST_PAGE_APPROVED";
      run_id: string;
      schema_version: "1.0.0";
      created_at: string;
      updated_at: string;
      extensions: {
        [k: string]: unknown;
      };
    }[],
  ];
  asset_requirements_plan: {
    asset_requirements_plan_id: string;
    project_id: string;
    content_id: string;
    content_version: string;
    copy_version: string;
    visual_plan_version: string;
    /**
     * @minItems 1
     */
    pages: [
      {
        page_number: number;
        page_role:
          | "COVER"
          | "PROBLEM"
          | "SCENARIO"
          | "MISCONCEPTION"
          | "ANALYSIS"
          | "EVIDENCE"
          | "SOLUTION"
          | "STEP"
          | "COMPARISON"
          | "CASE"
          | "SUMMARY"
          | "CTA";
        asset_source_strategy:
          | "PROJECT_ASSET"
          | "USER_REFERENCE"
          | "HISTORICAL_STYLE"
          | "EVIDENCE_SCREENSHOT"
          | "GENERATED_BACKGROUND"
          | "PROGRAMMATIC_GRAPHIC"
          | "LICENSED_ASSET"
          | "NO_BACKGROUND_ASSET";
        asset_purpose: string;
        asset_description: string;
        required_assets: string[];
        optional_assets: string[];
        reference_asset_ids: string[];
        generation_required: boolean;
        programmatic_render_required: boolean;
        evidence_asset_required: boolean;
        aspect_ratio: "3:4";
        composition: string;
        subject: string | null;
        environment: string | null;
        camera_direction: string | null;
        lighting_direction: string | null;
        material_direction: string | null;
        prohibited_content: string[];
        informational_text_in_background_allowed: false;
        fallback_strategy: string;
      },
      ...{
        page_number: number;
        page_role:
          | "COVER"
          | "PROBLEM"
          | "SCENARIO"
          | "MISCONCEPTION"
          | "ANALYSIS"
          | "EVIDENCE"
          | "SOLUTION"
          | "STEP"
          | "COMPARISON"
          | "CASE"
          | "SUMMARY"
          | "CTA";
        asset_source_strategy:
          | "PROJECT_ASSET"
          | "USER_REFERENCE"
          | "HISTORICAL_STYLE"
          | "EVIDENCE_SCREENSHOT"
          | "GENERATED_BACKGROUND"
          | "PROGRAMMATIC_GRAPHIC"
          | "LICENSED_ASSET"
          | "NO_BACKGROUND_ASSET";
        asset_purpose: string;
        asset_description: string;
        required_assets: string[];
        optional_assets: string[];
        reference_asset_ids: string[];
        generation_required: boolean;
        programmatic_render_required: boolean;
        evidence_asset_required: boolean;
        aspect_ratio: "3:4";
        composition: string;
        subject: string | null;
        environment: string | null;
        camera_direction: string | null;
        lighting_direction: string | null;
        material_direction: string | null;
        prohibited_content: string[];
        informational_text_in_background_allowed: false;
        fallback_strategy: string;
      }[],
    ];
    global_asset_rules: string[];
    shared_assets: string[];
    unresolved_assets: string[];
    generation_required_count: number;
    programmatic_graphic_count: number;
    project_asset_count: number;
    evidence_asset_count: number;
    no_asset_count: number;
    ready_for_first_page: boolean;
    created_at: string;
    run_id: string;
    schema_version: "1.0.0";
    extensions: {
      [k: string]: unknown;
    };
  };
  layout_feasibility_report: {
    layout_feasibility_report_id: string;
    project_id: string;
    content_id: string;
    content_version: string;
    copy_version: string;
    visual_plan_version: string;
    /**
     * @minItems 1
     */
    page_results: [
      {
        page_number: number;
        page_role:
          | "COVER"
          | "PROBLEM"
          | "SCENARIO"
          | "MISCONCEPTION"
          | "ANALYSIS"
          | "EVIDENCE"
          | "SOLUTION"
          | "STEP"
          | "COMPARISON"
          | "CASE"
          | "SUMMARY"
          | "CTA";
        headline_codepoints: number;
        body_codepoints: number;
        supporting_codepoints: number;
        total_codepoints: number;
        estimated_density: "LOW" | "MEDIUM" | "HIGH" | "EXCESSIVE";
        estimated_line_count: number;
        available_text_regions: number;
        /**
         * @minItems 1
         */
        typography_token_refs: [string, ...string[]];
        safe_area_fit: boolean;
        max_lines_fit: boolean;
        hierarchy_fit: boolean;
        contrast_feasibility: boolean;
        overflow_strategy:
          | "REFLOW"
          | "CHANGE_LAYOUT"
          | "MOVE_SUPPORTING_TEXT"
          | "REDUCE_DECORATION"
          | "CONTENT_REVISION_REQUIRED"
          | "BLOCK_AND_RETURN";
        status: "PASS" | "WARNING" | "BLOCKED";
        warnings: string[];
        blocking_reason: string | null;
      },
      ...{
        page_number: number;
        page_role:
          | "COVER"
          | "PROBLEM"
          | "SCENARIO"
          | "MISCONCEPTION"
          | "ANALYSIS"
          | "EVIDENCE"
          | "SOLUTION"
          | "STEP"
          | "COMPARISON"
          | "CASE"
          | "SUMMARY"
          | "CTA";
        headline_codepoints: number;
        body_codepoints: number;
        supporting_codepoints: number;
        total_codepoints: number;
        estimated_density: "LOW" | "MEDIUM" | "HIGH" | "EXCESSIVE";
        estimated_line_count: number;
        available_text_regions: number;
        /**
         * @minItems 1
         */
        typography_token_refs: [string, ...string[]];
        safe_area_fit: boolean;
        max_lines_fit: boolean;
        hierarchy_fit: boolean;
        contrast_feasibility: boolean;
        overflow_strategy:
          | "REFLOW"
          | "CHANGE_LAYOUT"
          | "MOVE_SUPPORTING_TEXT"
          | "REDUCE_DECORATION"
          | "CONTENT_REVISION_REQUIRED"
          | "BLOCK_AND_RETURN";
        status: "PASS" | "WARNING" | "BLOCKED";
        warnings: string[];
        blocking_reason: string | null;
      }[],
    ];
    total_pages: number;
    pass_count: number;
    warning_count: number;
    blocked_count: number;
    overall_status: "PASS" | "WARNING" | "BLOCKED";
    copy_revision_required: boolean;
    created_at: string;
    run_id: string;
    schema_version: "1.0.0";
    extensions: {
      [k: string]: unknown;
    };
  };
  visual_quality_report: {
    visual_quality_report_id: string;
    project_id: string;
    content_id: string;
    content_version: string;
    copy_version: string;
    visual_plan_version: string;
    /**
     * @minItems 18
     */
    hard_checks: [
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      {
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      },
      ...{
        check_code: string;
        status: "PASS" | "WARNING" | "FAIL";
        blocking: boolean;
        details: string;
      }[],
    ];
    /**
     * @minItems 8
     * @maxItems 8
     */
    dimension_scores: [
      {
        dimension:
          | "CONTENT_FIDELITY"
          | "VISUAL_MODE_FIT"
          | "GROUP_CONSISTENCY"
          | "PAGE_SPECIFIC_RELEVANCE"
          | "READABILITY_FEASIBILITY"
          | "ASSET_FEASIBILITY"
          | "PROJECT_FIT"
          | "PLATFORM_FIT";
        score: number;
        weight: number;
        rationale: string;
      },
      {
        dimension:
          | "CONTENT_FIDELITY"
          | "VISUAL_MODE_FIT"
          | "GROUP_CONSISTENCY"
          | "PAGE_SPECIFIC_RELEVANCE"
          | "READABILITY_FEASIBILITY"
          | "ASSET_FEASIBILITY"
          | "PROJECT_FIT"
          | "PLATFORM_FIT";
        score: number;
        weight: number;
        rationale: string;
      },
      {
        dimension:
          | "CONTENT_FIDELITY"
          | "VISUAL_MODE_FIT"
          | "GROUP_CONSISTENCY"
          | "PAGE_SPECIFIC_RELEVANCE"
          | "READABILITY_FEASIBILITY"
          | "ASSET_FEASIBILITY"
          | "PROJECT_FIT"
          | "PLATFORM_FIT";
        score: number;
        weight: number;
        rationale: string;
      },
      {
        dimension:
          | "CONTENT_FIDELITY"
          | "VISUAL_MODE_FIT"
          | "GROUP_CONSISTENCY"
          | "PAGE_SPECIFIC_RELEVANCE"
          | "READABILITY_FEASIBILITY"
          | "ASSET_FEASIBILITY"
          | "PROJECT_FIT"
          | "PLATFORM_FIT";
        score: number;
        weight: number;
        rationale: string;
      },
      {
        dimension:
          | "CONTENT_FIDELITY"
          | "VISUAL_MODE_FIT"
          | "GROUP_CONSISTENCY"
          | "PAGE_SPECIFIC_RELEVANCE"
          | "READABILITY_FEASIBILITY"
          | "ASSET_FEASIBILITY"
          | "PROJECT_FIT"
          | "PLATFORM_FIT";
        score: number;
        weight: number;
        rationale: string;
      },
      {
        dimension:
          | "CONTENT_FIDELITY"
          | "VISUAL_MODE_FIT"
          | "GROUP_CONSISTENCY"
          | "PAGE_SPECIFIC_RELEVANCE"
          | "READABILITY_FEASIBILITY"
          | "ASSET_FEASIBILITY"
          | "PROJECT_FIT"
          | "PLATFORM_FIT";
        score: number;
        weight: number;
        rationale: string;
      },
      {
        dimension:
          | "CONTENT_FIDELITY"
          | "VISUAL_MODE_FIT"
          | "GROUP_CONSISTENCY"
          | "PAGE_SPECIFIC_RELEVANCE"
          | "READABILITY_FEASIBILITY"
          | "ASSET_FEASIBILITY"
          | "PROJECT_FIT"
          | "PLATFORM_FIT";
        score: number;
        weight: number;
        rationale: string;
      },
      {
        dimension:
          | "CONTENT_FIDELITY"
          | "VISUAL_MODE_FIT"
          | "GROUP_CONSISTENCY"
          | "PAGE_SPECIFIC_RELEVANCE"
          | "READABILITY_FEASIBILITY"
          | "ASSET_FEASIBILITY"
          | "PROJECT_FIT"
          | "PLATFORM_FIT";
        score: number;
        weight: number;
        rationale: string;
      },
    ];
    weighted_score: number;
    blocking_failure_count: number;
    warning_count: number;
    passed_count: number;
    ready_for_first_page: boolean;
    limitations: string[];
    recommended_changes: string[];
    created_at: string;
    run_id: string;
    schema_version: "1.0.0";
    extensions: {
      [k: string]: unknown;
    };
  };
  first_page_handoff: {
    page_number: 1;
    page_role: "COVER";
    page_visual_plan_id: string;
    content_version: string;
    copy_version: string;
    visual_plan_version: string;
    copy_snapshot: {
      headline: string;
      body: string;
      supporting_text: string;
    };
    copy_snapshot_hash: string;
    canvas: {
      width: number;
      height: number;
      aspect_ratio: string;
      orientation: "PORTRAIT" | "LANDSCAPE" | "SQUARE";
      resolution_unit: "PX";
    };
    safe_area: {
      top: number;
      right: number;
      bottom: number;
      left: number;
      unit: "PX" | "PERCENT";
    };
    /**
     * @minItems 1
     */
    typography_tokens: [
      {
        token_id: string;
        role: "TITLE" | "BODY" | "SUPPORTING" | "PAGE_NUMBER" | "BRAND";
        font_family: string;
        font_weight: number;
        font_size: number;
        line_height: number;
        letter_spacing: number;
        alignment: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFY";
        max_lines: number;
        overflow_strategy:
          "REFLOW" | "MOVE_TO_NEXT_PAGE" | "REVISE_COPY" | "CHANGE_LAYOUT" | "BLOCK_AND_RETURN";
      },
      ...{
        token_id: string;
        role: "TITLE" | "BODY" | "SUPPORTING" | "PAGE_NUMBER" | "BRAND";
        font_family: string;
        font_weight: number;
        font_size: number;
        line_height: number;
        letter_spacing: number;
        alignment: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFY";
        max_lines: number;
        overflow_strategy:
          "REFLOW" | "MOVE_TO_NEXT_PAGE" | "REVISE_COPY" | "CHANGE_LAYOUT" | "BLOCK_AND_RETURN";
      }[],
    ];
    /**
     * @minItems 1
     */
    color_tokens: [
      {
        token_id: string;
        role: "BACKGROUND" | "PRIMARY_TEXT" | "SECONDARY_TEXT" | "ACCENT" | "OVERLAY" | "BRAND";
        value: string;
        color_space: "SRGB" | "DISPLAY_P3" | "HEX" | "RGBA";
        opacity: number;
      },
      ...{
        token_id: string;
        role: "BACKGROUND" | "PRIMARY_TEXT" | "SECONDARY_TEXT" | "ACCENT" | "OVERLAY" | "BRAND";
        value: string;
        color_space: "SRGB" | "DISPLAY_P3" | "HEX" | "RGBA";
        opacity: number;
      }[],
    ];
    grid_system: {
      rules: string[];
    };
    asset_requirement: {
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      asset_source_strategy:
        | "PROJECT_ASSET"
        | "USER_REFERENCE"
        | "HISTORICAL_STYLE"
        | "EVIDENCE_SCREENSHOT"
        | "GENERATED_BACKGROUND"
        | "PROGRAMMATIC_GRAPHIC"
        | "LICENSED_ASSET"
        | "NO_BACKGROUND_ASSET";
      asset_purpose: string;
      asset_description: string;
      required_assets: string[];
      optional_assets: string[];
      reference_asset_ids: string[];
      generation_required: boolean;
      programmatic_render_required: boolean;
      evidence_asset_required: boolean;
      aspect_ratio: "3:4";
      composition: string;
      subject: string | null;
      environment: string | null;
      camera_direction: string | null;
      lighting_direction: string | null;
      material_direction: string | null;
      prohibited_content: string[];
      informational_text_in_background_allowed: false;
      fallback_strategy: string;
    };
    background_strategy: string;
    text_layers: {
      layer_id: string;
      role: "TITLE" | "BODY" | "SUPPORTING" | "PAGE_NUMBER" | "BRAND";
      content_source: string;
      content_snapshot: string;
      bbox: {
        x: number;
        y: number;
        width: number;
        height: number;
        unit: "PX" | "PERCENT";
      };
      typography_token_id: string;
      color_token_id: string;
      z_index: number;
      required: boolean;
    }[];
    image_treatment: {
      brightness: number;
      contrast: number;
      saturation: number;
      blur: number;
      overlay: string;
      gradient: string;
      mask: string;
      crop_strategy: "COVER" | "CONTAIN" | "FOCAL_POINT" | "NONE";
    };
    negative_constraints: string[];
    required_capabilities: string[];
    generation_required: boolean;
    programmatic_render_required: boolean;
    ready: boolean;
    blocking_reasons: string[];
  };
  platform_pack_version: string;
  industry_pack_version: string;
  project_rule_snapshot: string;
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
