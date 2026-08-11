import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import {
  calculateConcentration,
  calculateDilution,
  calculateReconstitution,
  parseMolarMassDa,
} from "../dist/index.js";

test("calculates reconstitution volume from mass and target concentration", () => {
  const result = calculateReconstitution({
    mass: 10,
    massUnit: "mg",
    target: 5,
    concentrationUnit: "mg/mL",
  });

  assert.equal(result.volumeMl, 2);
  assert.equal(result.targetMgPerMl, 5);
});

test("normalizes micrograms and microlitres before calculating concentration", () => {
  const result = calculateConcentration({
    mass: 500,
    massUnit: "µg",
    volume: 250,
    volumeUnit: "µL",
  });

  assert.equal(result.massMg, 0.5);
  assert.equal(result.volumeMl, 0.25);
  assert.equal(result.concentrationMgPerMl, 2);
  assert.equal(result.concentrations["µg/mL"], 2000);
  assert.equal(result.concentrations["µg/µL"], 2);
});

test("calculates molar concentration only when molecular mass is provided", () => {
  const result = calculateConcentration({
    mass: 5,
    massUnit: "mg",
    volume: 1,
    volumeUnit: "mL",
    molarMassDa: 5000,
  });

  assert.equal(result.concentrations.mM, 1);
});

test("calculates dilution stock, diluent and factor", () => {
  const result = calculateDilution({
    stock: 10,
    stockUnit: "mg/mL",
    target: 2,
    targetUnit: "mg/mL",
    finalVolume: 5,
    finalVolumeUnit: "mL",
  });

  assert.equal(result.stockVolumeMl, 1);
  assert.equal(result.diluentVolumeMl, 4);
  assert.equal(result.dilutionFactor, 5);
});

test("rejects a target concentration that is not lower than stock", () => {
  assert.throws(() => calculateDilution({
    stock: 2,
    stockUnit: "mg/mL",
    target: 2,
    targetUnit: "mg/mL",
    finalVolume: 5,
    finalVolumeUnit: "mL",
  }), /lower than stock/);
});

test("requires molar mass for mM reconstitution", () => {
  assert.throws(() => calculateReconstitution({
    mass: 10,
    massUnit: "mg",
    target: 1,
    concentrationUnit: "mM",
  }), /molarMassDa is required/);
});

test("parses a displayed molecular mass", () => {
  assert.equal(parseMolarMassDa("4,731.33 Da"), 4731.33);
  assert.equal(parseMolarMassDa("4731,33 Da"), 4731.33);
});

test("CLI emits JSON for a reproducible reconstitution calculation", () => {
  const output = execFileSync(process.execPath, [
    "dist/cli.js",
    "reconstitution",
    "--mass",
    "10",
    "--target",
    "5",
    "--target-unit",
    "mg/mL",
    "--json",
  ], { encoding: "utf8" });

  assert.equal(JSON.parse(output).volumeMl, 2);
});
