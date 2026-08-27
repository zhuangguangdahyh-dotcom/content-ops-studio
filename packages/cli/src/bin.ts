#!/usr/bin/env node
import { runCli } from "./runtime-cli.js";

process.exitCode = await runCli(process.argv.slice(2));
