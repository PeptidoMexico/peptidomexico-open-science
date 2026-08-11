#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import {
  analyzeCsvObservations,
  analyzeMzObservation,
  calculateChargeStates,
} from "./index.js";

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

function numeric(args: ParsedArgs, name: string, fallback?: number): number {
  const value = args[name];
  if (value === undefined && fallback !== undefined) return fallback;
  if (typeof value !== "string") throw new Error(`Missing required option --${name}.`);
  const parsed = Number(value.replace(",", "."));
  if (!Number.isFinite(parsed)) throw new Error(`Option --${name} must be numeric.`);
  return parsed;
}

function printHelp(): void {
  console.log([
    "LC-MS Peptide QC",
    "",
    "Deterministic positive-mode m/z and ppm calculations for research workflows.",
    "",
    "Usage:",
    "  lcms-peptide-qc analyze --mass-da 1000 --charge 2 --observed-mz 501.0073 --json",
    "  lcms-peptide-qc charge-states --mass-da 1000 --max-charge 5 --json",
    "  lcms-peptide-qc csv --file examples/observations.csv --json",
  ].join("\n"));
}

async function main(): Promise<void> {
  const { command, args } = parseArgs(process.argv.slice(2));
  if (!command || args.help) {
    printHelp();
    return;
  }

  let result: unknown;
  if (command === "analyze") {
    result = analyzeMzObservation({
      neutralMassDa: numeric(args, "mass-da"),
      charge: numeric(args, "charge"),
      observedMz: numeric(args, "observed-mz"),
    });
  } else if (command === "charge-states") {
    result = calculateChargeStates(numeric(args, "mass-da"), numeric(args, "max-charge", 5));
  } else if (command === "csv") {
    result = analyzeCsvObservations(await readFile(required(args, "file"), "utf8"));
  } else {
    throw new Error(`Unknown command: ${command}.`);
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "LC-MS QC failed.");
  process.exitCode = 1;
});
