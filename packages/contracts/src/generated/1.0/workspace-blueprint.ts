/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Machine-readable four-table logical workspace design.
 */
export interface WorkspaceBlueprint {
  blueprint_id: string;
  blueprint_version: string;
  provider: "FEISHU";
  display_name_pattern: string;
  /**
   * @minItems 4
   * @maxItems 4
   */
  tables: [
    {
      logicalKey: string;
      displayName: string;
      description: string;
      primaryFieldLogicalKey: string;
      /**
       * @minItems 1
       */
      fields: [
        {
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          fieldType:
            | "TEXT"
            | "LONG_TEXT"
            | "NUMBER"
            | "BOOLEAN"
            | "DATE"
            | "DATETIME"
            | "SINGLE_SELECT"
            | "MULTI_SELECT"
            | "RELATION"
            | "ATTACHMENT"
            | "URL";
          required: boolean;
          primary: boolean;
          hiddenByDefault: boolean;
          systemManaged: boolean;
          userManaged: boolean;
          immutableAfterCreate: boolean;
          ownerSkill: string;
          defaultValue: unknown;
          options: {
            code: string;
            displayName: string;
          }[];
          description: string;
          targetTableLogicalKey: string;
          relationship: "NONE" | "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_MANY";
          bidirectional: boolean;
        },
        ...{
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          fieldType:
            | "TEXT"
            | "LONG_TEXT"
            | "NUMBER"
            | "BOOLEAN"
            | "DATE"
            | "DATETIME"
            | "SINGLE_SELECT"
            | "MULTI_SELECT"
            | "RELATION"
            | "ATTACHMENT"
            | "URL";
          required: boolean;
          primary: boolean;
          hiddenByDefault: boolean;
          systemManaged: boolean;
          userManaged: boolean;
          immutableAfterCreate: boolean;
          ownerSkill: string;
          defaultValue: unknown;
          options: {
            code: string;
            displayName: string;
          }[];
          description: string;
          targetTableLogicalKey: string;
          relationship: "NONE" | "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_MANY";
          bidirectional: boolean;
        }[],
      ];
      /**
       * @minItems 1
       */
      views: [
        {
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          filterDescription: string;
          sortDescription: string;
        },
        ...{
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          filterDescription: string;
          sortDescription: string;
        }[],
      ];
    },
    {
      logicalKey: string;
      displayName: string;
      description: string;
      primaryFieldLogicalKey: string;
      /**
       * @minItems 1
       */
      fields: [
        {
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          fieldType:
            | "TEXT"
            | "LONG_TEXT"
            | "NUMBER"
            | "BOOLEAN"
            | "DATE"
            | "DATETIME"
            | "SINGLE_SELECT"
            | "MULTI_SELECT"
            | "RELATION"
            | "ATTACHMENT"
            | "URL";
          required: boolean;
          primary: boolean;
          hiddenByDefault: boolean;
          systemManaged: boolean;
          userManaged: boolean;
          immutableAfterCreate: boolean;
          ownerSkill: string;
          defaultValue: unknown;
          options: {
            code: string;
            displayName: string;
          }[];
          description: string;
          targetTableLogicalKey: string;
          relationship: "NONE" | "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_MANY";
          bidirectional: boolean;
        },
        ...{
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          fieldType:
            | "TEXT"
            | "LONG_TEXT"
            | "NUMBER"
            | "BOOLEAN"
            | "DATE"
            | "DATETIME"
            | "SINGLE_SELECT"
            | "MULTI_SELECT"
            | "RELATION"
            | "ATTACHMENT"
            | "URL";
          required: boolean;
          primary: boolean;
          hiddenByDefault: boolean;
          systemManaged: boolean;
          userManaged: boolean;
          immutableAfterCreate: boolean;
          ownerSkill: string;
          defaultValue: unknown;
          options: {
            code: string;
            displayName: string;
          }[];
          description: string;
          targetTableLogicalKey: string;
          relationship: "NONE" | "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_MANY";
          bidirectional: boolean;
        }[],
      ];
      /**
       * @minItems 1
       */
      views: [
        {
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          filterDescription: string;
          sortDescription: string;
        },
        ...{
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          filterDescription: string;
          sortDescription: string;
        }[],
      ];
    },
    {
      logicalKey: string;
      displayName: string;
      description: string;
      primaryFieldLogicalKey: string;
      /**
       * @minItems 1
       */
      fields: [
        {
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          fieldType:
            | "TEXT"
            | "LONG_TEXT"
            | "NUMBER"
            | "BOOLEAN"
            | "DATE"
            | "DATETIME"
            | "SINGLE_SELECT"
            | "MULTI_SELECT"
            | "RELATION"
            | "ATTACHMENT"
            | "URL";
          required: boolean;
          primary: boolean;
          hiddenByDefault: boolean;
          systemManaged: boolean;
          userManaged: boolean;
          immutableAfterCreate: boolean;
          ownerSkill: string;
          defaultValue: unknown;
          options: {
            code: string;
            displayName: string;
          }[];
          description: string;
          targetTableLogicalKey: string;
          relationship: "NONE" | "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_MANY";
          bidirectional: boolean;
        },
        ...{
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          fieldType:
            | "TEXT"
            | "LONG_TEXT"
            | "NUMBER"
            | "BOOLEAN"
            | "DATE"
            | "DATETIME"
            | "SINGLE_SELECT"
            | "MULTI_SELECT"
            | "RELATION"
            | "ATTACHMENT"
            | "URL";
          required: boolean;
          primary: boolean;
          hiddenByDefault: boolean;
          systemManaged: boolean;
          userManaged: boolean;
          immutableAfterCreate: boolean;
          ownerSkill: string;
          defaultValue: unknown;
          options: {
            code: string;
            displayName: string;
          }[];
          description: string;
          targetTableLogicalKey: string;
          relationship: "NONE" | "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_MANY";
          bidirectional: boolean;
        }[],
      ];
      /**
       * @minItems 1
       */
      views: [
        {
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          filterDescription: string;
          sortDescription: string;
        },
        ...{
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          filterDescription: string;
          sortDescription: string;
        }[],
      ];
    },
    {
      logicalKey: string;
      displayName: string;
      description: string;
      primaryFieldLogicalKey: string;
      /**
       * @minItems 1
       */
      fields: [
        {
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          fieldType:
            | "TEXT"
            | "LONG_TEXT"
            | "NUMBER"
            | "BOOLEAN"
            | "DATE"
            | "DATETIME"
            | "SINGLE_SELECT"
            | "MULTI_SELECT"
            | "RELATION"
            | "ATTACHMENT"
            | "URL";
          required: boolean;
          primary: boolean;
          hiddenByDefault: boolean;
          systemManaged: boolean;
          userManaged: boolean;
          immutableAfterCreate: boolean;
          ownerSkill: string;
          defaultValue: unknown;
          options: {
            code: string;
            displayName: string;
          }[];
          description: string;
          targetTableLogicalKey: string;
          relationship: "NONE" | "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_MANY";
          bidirectional: boolean;
        },
        ...{
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          fieldType:
            | "TEXT"
            | "LONG_TEXT"
            | "NUMBER"
            | "BOOLEAN"
            | "DATE"
            | "DATETIME"
            | "SINGLE_SELECT"
            | "MULTI_SELECT"
            | "RELATION"
            | "ATTACHMENT"
            | "URL";
          required: boolean;
          primary: boolean;
          hiddenByDefault: boolean;
          systemManaged: boolean;
          userManaged: boolean;
          immutableAfterCreate: boolean;
          ownerSkill: string;
          defaultValue: unknown;
          options: {
            code: string;
            displayName: string;
          }[];
          description: string;
          targetTableLogicalKey: string;
          relationship: "NONE" | "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_MANY";
          bidirectional: boolean;
        }[],
      ];
      /**
       * @minItems 1
       */
      views: [
        {
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          filterDescription: string;
          sortDescription: string;
        },
        ...{
          logicalKey: string;
          displayName: string;
          tableLogicalKey: string;
          filterDescription: string;
          sortDescription: string;
        }[],
      ];
    },
  ];
  /**
   * @minItems 4
   */
  views: [
    {
      logicalKey: string;
      displayName: string;
      tableLogicalKey: string;
      filterDescription: string;
      sortDescription: string;
    },
    {
      logicalKey: string;
      displayName: string;
      tableLogicalKey: string;
      filterDescription: string;
      sortDescription: string;
    },
    {
      logicalKey: string;
      displayName: string;
      tableLogicalKey: string;
      filterDescription: string;
      sortDescription: string;
    },
    {
      logicalKey: string;
      displayName: string;
      tableLogicalKey: string;
      filterDescription: string;
      sortDescription: string;
    },
    ...{
      logicalKey: string;
      displayName: string;
      tableLogicalKey: string;
      filterDescription: string;
      sortDescription: string;
    }[],
  ];
  status_options: {
    [k: string]: {
      code: string;
      displayName: string;
    }[];
  };
  schema_version: "1.0.0";
}
