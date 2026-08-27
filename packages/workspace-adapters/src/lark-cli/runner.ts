import { spawn } from "node:child_process";
import { LarkCliError, type LarkCliCommand, type LarkCliExecution } from "./types.js";

const MANAGEMENT = new Set([
  "--version",
  "config init",
  "config show",
  "auth login",
  "auth logout",
  "auth status",
  "auth check",
  "auth scopes",
  "whoami",
  "schema",
]);

const BASE = new Set([
  "+base-create",
  "+base-get",
  "+title-resolve",
  "+base-block-list",
  "+table-list",
  "+table-create",
  "+table-get",
  "+table-update",
  "+field-list",
  "+field-get",
  "+field-create",
  "+field-delete",
  "+field-update",
  "+record-list",
  "+record-search",
  "+record-get",
  "+record-upsert",
  "+record-batch-create",
  "+record-batch-update",
  "+view-list",
  "+view-create",
  "+view-rename",
]);

const FORBIDDEN = /(?:delete|remove|\brm\b|risk-control|\beval\b|\bshell\b)/i;
const SENSITIVE_KEY = /^(?:--)?(?:app-secret|secret|token|authorization|api-key|access-token)$/i;
const SECRET_TEXT =
  /((?:app[_-]?secret|access[_-]?token|refresh[_-]?token|authorization|api[_-]?key)\s*[":=]\s*["']?)[^\s,"'}]+/gi;

export function redactLarkCliText(value: string): string {
  return value.replace(SECRET_TEXT, "$1[REDACTED]");
}

export function assertLarkCliCommandAllowed(command: LarkCliCommand): void {
  if (!command.argv.length)
    throw new LarkCliError("LARK_CLI_COMMAND_DENIED", "Empty CLI command.", 5);
  const joined = command.argv.slice(0, 3).join(" ");
  const controlledFieldDelete =
    command.argv[0] === "base" &&
    command.argv[1] === "+field-delete" &&
    command.argv.includes("--yes") &&
    command.allowHighRiskUpdate === true;
  if (FORBIDDEN.test(joined) && !controlledFieldDelete)
    throw new LarkCliError(
      "LARK_CLI_COMMAND_DENIED",
      "Destructive or risk-control commands are forbidden.",
      5,
    );
  for (let index = 0; index < command.argv.length; index += 1) {
    const item = command.argv[index] ?? "";
    if (SENSITIVE_KEY.test(item))
      throw new LarkCliError(
        "LARK_CLI_SECRET_ARGUMENT_DENIED",
        "Credentials are forbidden in CLI arguments.",
        5,
      );
    if (item === "--yes" && !command.allowHighRiskUpdate)
      throw new LarkCliError(
        "LARK_CLI_HIGH_RISK_UPDATE_DENIED",
        "High-risk updates require an explicit migration path.",
        5,
      );
  }
  const key =
    command.argv[0] === "base"
      ? `base ${command.argv[1] ?? ""}`
      : command.argv[0] === "config" || command.argv[0] === "auth"
        ? `${command.argv[0]} ${command.argv[1] ?? ""}`
        : (command.argv[0] ?? "");
  const allowed = key.startsWith("base ") ? BASE.has(command.argv[1] ?? "") : MANAGEMENT.has(key);
  if (!allowed)
    throw new LarkCliError("LARK_CLI_COMMAND_DENIED", `Command ${key} is not allowlisted.`, 5);
}

export interface LarkCliProcessResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}
export type LarkCliExecutor = (
  binary: string,
  argv: string[],
  timeoutMs: number,
  signal?: AbortSignal,
) => Promise<LarkCliProcessResult>;

async function execute(
  binary: string,
  argv: string[],
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<LarkCliProcessResult> {
  return await new Promise((resolve, reject) => {
    const controller = new AbortController();
    const onAbort = () => controller.abort(signal?.reason);
    signal?.addEventListener("abort", onAbort, { once: true });
    const timer = setTimeout(() => controller.abort(new Error("timeout")), timeoutMs);
    const child = spawn(binary, argv, {
      shell: false,
      signal: controller.signal,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.setEncoding("utf8").on("data", (chunk: string) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      resolve({ exitCode: code ?? 4, stdout, stderr });
    });
  });
}

function parseObject(value: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function managementCommand(argv: string[]): boolean {
  return (
    argv[0] !== "base" &&
    (argv[0] === "auth" ||
      argv[0] === "config" ||
      argv[0] === "schema" ||
      argv[0] === "whoami" ||
      argv[0] === "--version")
  );
}

export class LarkCliRunner {
  constructor(
    readonly binary = "lark-cli",
    private readonly executor: LarkCliExecutor = execute,
    private readonly defaultTimeoutMs = 30_000,
  ) {}

  async run<T = unknown>(command: LarkCliCommand): Promise<LarkCliExecution<T>> {
    assertLarkCliCommandAllowed(command);
    const started = Date.now();
    let raw: LarkCliProcessResult;
    try {
      raw = await this.executor(
        this.binary,
        [...command.argv],
        command.timeoutMs ?? this.defaultTimeoutMs,
        command.signal,
      );
    } catch (error) {
      const code = command.signal?.aborted
        ? "LARK_CLI_CANCELLED"
        : (error as Error).name === "AbortError"
          ? "LARK_CLI_TIMEOUT"
          : "LARK_CLI_EXECUTION_FAILED";
      throw new LarkCliError(
        code,
        code === "LARK_CLI_TIMEOUT"
          ? "Official CLI command timed out."
          : "Official CLI command could not run.",
        4,
      );
    }
    const stdout = redactLarkCliText(raw.stdout.trim());
    const stderr = redactLarkCliText(raw.stderr.trim());
    const primary =
      parseObject(raw.exitCode === 0 ? stdout : stderr) ??
      parseObject(stdout) ??
      (command.argv[0] === "--version" && /\d+\.\d+\.\d+/.test(stdout)
        ? { version: stdout }
        : null);
    const durationMs = Date.now() - started;
    if (!primary)
      throw new LarkCliError(
        "LARK_CLI_NON_JSON_OUTPUT",
        "Official CLI output was not a JSON object.",
        4,
      );
    if (raw.exitCode === 0) {
      if (primary.ok === false)
        throw new LarkCliError(
          "LARK_CLI_EXIT_CODE_MISMATCH",
          "Official CLI returned ok=false with exit code 0.",
          4,
        );
      if (primary.ok !== true && !managementCommand(command.argv))
        throw new LarkCliError(
          "LARK_CLI_ENVELOPE_INVALID",
          "Official CLI success envelope omitted ok=true.",
          4,
        );
      return {
        ok: true,
        exitCode: 0,
        operation: command.operation,
        data: (primary.data ?? primary) as T,
        stdout,
        stderr,
        durationMs,
      };
    }
    if (primary.ok !== false)
      throw new LarkCliError(
        "LARK_CLI_ENVELOPE_INVALID",
        "Official CLI error envelope omitted ok=false.",
        4,
      );
    const errorValue =
      primary.error && typeof primary.error === "object"
        ? (primary.error as Record<string, unknown>)
        : {};
    return {
      ok: false,
      exitCode: raw.exitCode,
      operation: command.operation,
      error: {
        code: typeof errorValue.code === "string" ? errorValue.code : "LARK_CLI_ERROR",
        message: redactLarkCliText(
          typeof errorValue.message === "string"
            ? errorValue.message
            : "Official CLI command failed.",
        ),
      },
      stdout,
      stderr,
      durationMs,
    };
  }

  async require<T = unknown>(command: LarkCliCommand): Promise<T> {
    const result = await this.run<T>(command);
    if (!result.ok)
      throw new LarkCliError(result.error.code, result.error.message, result.exitCode);
    return result.data;
  }
}
