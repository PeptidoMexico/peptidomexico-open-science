#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { assertValidCoa, validateCoa } from "./index.js";

type ParsedArgs = Record<string, string | boolean>;

function parseArgs(values: string[]): { command?: string; args: ParsedArgs } {
  const [command, ...rest] = values;
  const args: ParsedArgs = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = rest[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return { command, args };
}

function required(args: ParsedArgs, name: string): string {
  const value = args[name];
  if (typeof value !== "string" || value.length === 0) throw new Error(`Missing required option --${name}.`);
  return value;
}

function printHelp(): void {
  console.log([
    "COA Schema",
    "",
    "Validate structured research-material records offline.",
    "",
    "Usage:",
    "  coa-schema validate --file examples/coa.synthetic.json --json",
  ].join("\n"));
}

async function main(): Promise<void> {
  const { command, args } = parseArgs(process.argv.slice(2));
  if (!command || args.help) {
    printHelp();
    return;
  }
  if (command !== "validate") throw new Error(`Unknown command: ${command}.`);
  const input = JSON.parse(await readFile(required(args, "file"), "utf8")) as unknown;
  const result = validateCoa(input);
  if (args.json) console.log(JSON.stringify(result, null, 2));
  else console.log(result.valid ? "valid" : result.errors.map((error) => `${error.instancePath || "/"} ${error.message}`).join("\n"));
  if (!result.valid) assertValidCoa(input);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "COA validation failed.");
  process.exitCode = 1;
});
