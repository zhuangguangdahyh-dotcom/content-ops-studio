/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface RenderTemplateManifest {
  template_id: "TPL-EDITORIAL-COVER";
  template_version: "1.0.0";
  template_name: string;
  /**
   * @minItems 1
   */
  supported_visual_modes: ["EDITORIAL_SERIES", ..."EDITORIAL_SERIES"[]];
  /**
   * @minItems 1
   */
  supported_page_roles: ["COVER", ..."COVER"[]];
  /**
   * @minItems 1
   */
  supported_asset_strategies: ["PROGRAMMATIC_GRAPHIC", ..."PROGRAMMATIC_GRAPHIC"[]];
  html_template_hash: string;
  css_template_hash: string;
  component_library_version: "1.0.0";
  /**
   * @minItems 3
   */
  allowed_components: [
    "CANVAS" | "GRAPHIC_LAYER" | "TEXT_LAYER",
    "CANVAS" | "GRAPHIC_LAYER" | "TEXT_LAYER",
    "CANVAS" | "GRAPHIC_LAYER" | "TEXT_LAYER",
    ...("CANVAS" | "GRAPHIC_LAYER" | "TEXT_LAYER")[],
  ];
  /**
   * @minItems 1
   */
  allowed_css_properties: [
    (
      | "position"
      | "left"
      | "top"
      | "width"
      | "height"
      | "font-family"
      | "font-size"
      | "font-weight"
      | "line-height"
      | "letter-spacing"
      | "color"
      | "background"
      | "border"
      | "border-radius"
      | "opacity"
      | "z-index"
      | "display"
      | "align-items"
      | "justify-content"
      | "overflow"
      | "box-sizing"
    ),
    ...(
      | "position"
      | "left"
      | "top"
      | "width"
      | "height"
      | "font-family"
      | "font-size"
      | "font-weight"
      | "line-height"
      | "letter-spacing"
      | "color"
      | "background"
      | "border"
      | "border-radius"
      | "opacity"
      | "z-index"
      | "display"
      | "align-items"
      | "justify-content"
      | "overflow"
      | "box-sizing"
    )[],
  ];
  /**
   * @minItems 1
   */
  allowed_layout_primitives: [
    (
      | "RECTANGLE"
      | "ROUNDED_CARD"
      | "LINE"
      | "DIVIDER"
      | "CIRCLE"
      | "NUMBER_MARKER"
      | "BRACKET"
      | "CONNECTOR"
      | "GRID"
      | "FRAME"
      | "ACCENT_BLOCK"
    ),
    ...(
      | "RECTANGLE"
      | "ROUNDED_CARD"
      | "LINE"
      | "DIVIDER"
      | "CIRCLE"
      | "NUMBER_MARKER"
      | "BRACKET"
      | "CONNECTOR"
      | "GRID"
      | "FRAME"
      | "ACCENT_BLOCK"
    )[],
  ];
  /**
   * @minItems 3
   */
  required_typography_roles: [
    "TITLE" | "BODY" | "PAGE_NUMBER",
    "TITLE" | "BODY" | "PAGE_NUMBER",
    "TITLE" | "BODY" | "PAGE_NUMBER",
    ...("TITLE" | "BODY" | "PAGE_NUMBER")[],
  ];
  /**
   * @minItems 4
   */
  required_color_roles: [
    "BACKGROUND" | "PRIMARY_TEXT" | "ACCENT" | "SECONDARY_TEXT",
    "BACKGROUND" | "PRIMARY_TEXT" | "ACCENT" | "SECONDARY_TEXT",
    "BACKGROUND" | "PRIMARY_TEXT" | "ACCENT" | "SECONDARY_TEXT",
    "BACKGROUND" | "PRIMARY_TEXT" | "ACCENT" | "SECONDARY_TEXT",
    ...("BACKGROUND" | "PRIMARY_TEXT" | "ACCENT" | "SECONDARY_TEXT")[],
  ];
  network_allowed: false;
  javascript_allowed: "INTERNAL_MEASUREMENT_ONLY";
  arbitrary_html_allowed: false;
  arbitrary_css_allowed: false;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
