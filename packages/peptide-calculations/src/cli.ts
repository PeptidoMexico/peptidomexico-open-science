#!/usr/bin/env node

import {
  calculateConcentration,
  calculateDilution,
  calculateReconstitution,
  type ConcentrationUnit,
  type MassUnit,
  type VolumeUnit,
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
  if (typeof value !== "string" || value.length === 0) {
    throw new Error("Missing required option --" + name + ".");
  }
  return value;
}

function numberOption(args: ParsedArgs, name: string): number {
  const value = Number(required(args, name).replace(",", "."));
  if (!Number.isFinite(value)) throw new Error("Option --" + name + " must be numeric.");
  return value;
}

function massUnit(args: ParsedArgs): MassUnit {
  const value = args["mass-unit"] ?? "mg";
  if (value !== "mg" && value !== "µg") throw new Error("--mass-unit must be mg or µg.");
  return value;
}

function volumeUnit(args: ParsedArgs, name: string): VolumeUnit {
  const value = args[name] ?? "mL";
  if (value !== "mL" && value !== "µL") throw new Error("--" + name + " must be mL or µL.");
  return value;
}

function concentrationUnit(args: ParsedArgs, name: string): ConcentrationUnit {
  const value = args[name] ?? "mg/mL";
  if (value !== "mg/mL" && value !== "µg/mL" && value !== "µg/µL" && value !== "mM") {
    throw new Error("--" + name + " must be mg/mL, µg/mL, µg/µL or mM.");
  }
  return value;
}

function molarMass(args: ParsedArgs): number | null {
  const value = args["molar-mass-da"];
  return typeof value === "string" ? numberOption(args, "molar-mass-da") : null;
}

function printHelp(): void {
  console.log([
    "Peptide Calculations",
    "",
    "Research-use-only numeric calculations for peptide laboratory preparation.",
    "",
    "Commands:",
    "  reconstitution --mass 10 --mass-unit mg --target 5 --target-unit mg/mL",
    "  concentration --mass 10 --mass-unit mg --volume 2 --volume-unit mL",
    "  dilution --stock 10 --stock-unit mg/mL --target 2 --target-unit mg/mL --final-volume 5 --final-volume-unit mL",
    "",
    "Options:",
    "  --molar-mass-da 4731.33   Required for mM conversions",
    "  --json                    Print machine-readable JSON",
  ].join("\n"));
}

function main(): void {
  const { command, args } = parseArgs(process.argv.slice(2));
  if (!command || args.help) {
    printHelp();
    return;
  }

  let result: unknown;
  if (command === "reconstitution") {
    result = calculateReconstitution({
      mass: numberOption(args, "mass"),
      massUnit: massUnit(args),
      target: numberOption(args, "target"),
      concentrationUnit: concentrationUnit(args, "target-unit"),
      molarMassDa: molarMass(args),
    });
  } else if (command === "concentration") {
    result = calculateConcentration({
      mass: numberOption(args, "mass"),
      massUnit: massUnit(args),
      volume: numberOption(args, "volume"),
      volumeUnit: volumeUnit(args, "volume-unit"),
      molarMassDa: molarMass(args),
    });
  } else if (command === "dilution") {
    result = calculateDilution({
      stock: numberOption(args, "stock"),
      stockUnit: concentrationUnit(args, "stock-unit"),
      target: numberOption(args, "target"),
      targetUnit: concentrationUnit(args, "target-unit"),
      finalVolume: numberOption(args, "final-volume"),
      finalVolumeUnit: volumeUnit(args, "final-volume-unit"),
      molarMassDa: molarMass(args),
    });
  } else {
    throw new Error("Unknown command: " + command + ".");
  }

  console.log(JSON.stringify(result, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : "Calculation failed.");
  process.exitCode = 1;
}
