import { Ajv2020, type ErrorObject, type ValidateFunction } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { loadImplementedSchemas, SCHEMA_ROOT } from "../schema-catalog.js";

export interface StableValidationError {
  schema_id: string;
  instance_path: string;
  schema_path: string;
  keyword: string;
  message: string;
  params: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  errors: StableValidationError[];
}

const registerStandardFormats = addFormats as unknown as (ajv: Ajv2020) => Ajv2020;

export function formatValidationErrors(
  schemaId: string,
  errors: ErrorObject[] | null | undefined,
): StableValidationError[] {
  return (errors ?? []).map((error) => ({
    schema_id: schemaId,
    instance_path: error.instancePath,
    schema_path: error.schemaPath,
    keyword: error.keyword,
    message: error.message ?? "Validation failed.",
    params: { ...error.params },
  }));
}

export class ContractValidationError extends Error {
  readonly code = "SCHEMA_MISMATCH";

  constructor(readonly validationErrors: StableValidationError[]) {
    super(
      `Contract validation failed with ${validationErrors.length} error(s): ${validationErrors
        .map((error) => `${error.instance_path || "/"} ${error.message}`)
        .join("; ")}`,
    );
    this.name = "ContractValidationError";
  }
}

export class SchemaRegistry {
  readonly ajv: Ajv2020;

  constructor(readonly schemas: Array<Record<string, unknown>>) {
    this.ajv = new Ajv2020({ strict: true, allErrors: true, validateFormats: true });
    registerStandardFormats(this.ajv);
    registerSchemas(this.ajv, schemas);
  }

  get(schemaId: string): ValidateFunction {
    const validator = this.ajv.getSchema(schemaId);
    if (!validator) throw new Error(`Unknown schema ID: ${schemaId}`);
    return validator;
  }

  validateBySchemaId(schemaId: string, value: unknown): ValidationResult {
    const validator = this.get(schemaId);
    const valid = validator(value);
    return { valid, errors: valid ? [] : formatValidationErrors(schemaId, validator.errors) };
  }

  assertValid(schemaId: string, value: unknown): void {
    const result = this.validateBySchemaId(schemaId, value);
    if (!result.valid) throw new ContractValidationError(result.errors);
  }
}

export function registerSchemas(ajv: Ajv2020, schemas: Array<Record<string, unknown>>): Ajv2020 {
  const ids = new Set<string>();
  for (const schema of schemas) {
    const id = schema.$id;
    if (typeof id !== "string" || id.length === 0)
      throw new Error("Schema is missing a string $id.");
    if (ids.has(id)) throw new Error(`Duplicate schema $id: ${id}`);
    ids.add(id);
    ajv.addSchema(schema);
  }
  for (const id of ids) {
    if (!ajv.getSchema(id)) throw new Error(`Schema failed to compile: ${id}`);
  }
  return ajv;
}

export async function loadSchemaRegistry(schemaRoot = SCHEMA_ROOT): Promise<SchemaRegistry> {
  return new SchemaRegistry(await loadImplementedSchemas(schemaRoot));
}

export async function validateBySchemaId(
  schemaId: string,
  value: unknown,
  schemaRoot = SCHEMA_ROOT,
): Promise<ValidationResult> {
  return (await loadSchemaRegistry(schemaRoot)).validateBySchemaId(schemaId, value);
}

export async function assertValid(
  schemaId: string,
  value: unknown,
  schemaRoot = SCHEMA_ROOT,
): Promise<void> {
  (await loadSchemaRegistry(schemaRoot)).assertValid(schemaId, value);
}
