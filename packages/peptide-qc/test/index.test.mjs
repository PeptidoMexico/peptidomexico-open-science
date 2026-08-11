import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import {
  analyzePeptide,
  calculateHydropathy,
  calculateIsoelectricPoint,
  calculateNetCharge,
  calculatePeptideMass,
  calculatePeptideFormula,
  formatFormula,
  normalizeSequence,
} from "../dist/index.js";

test("normalizes a spaced sequence and rejects unsupported residues", () => {
  assert.equal(normalizeSequence(" acd-ef "), "ACDEF");
  assert.throws(() => normalizeSequence("ACU"), /Unsupported residue code/);
});

test("calculates composition and elemental formula for a synthetic peptide", () => {
  const formula = calculatePeptideFormula("ACD");
  assert.deepEqual(formula, { C: 10, H: 17, N: 3, O: 6, S: 1 });
  assert.equal(formatFormula(formula), "C10H17N3O6S");
});

test("calculates glycine mass from residue formula plus water", () => {
  const mass = calculatePeptideMass("G");
  assert.equal(mass.formulaText, "C2H5NO2");
  assert.ok(Math.abs(mass.monoisotopicDa - 75.0320284) < 0.00001);
  assert.ok(Math.abs(mass.averageDa - 75.0666) < 0.0001);
});

test("applies an explicit modification delta without pretending to know its formula", () => {
  const base = calculatePeptideMass("ACD");
  const modified = calculatePeptideMass("ACD", [{ name: "phosphorylation", deltaMassDa: 79.966331 }]);
  assert.ok(Math.abs(modified.monoisotopicDa - base.monoisotopicDa - 79.966331) < 0.000001);
  assert.equal(modified.modificationDeltaMassDa, 79.966331);
});

test("net charge falls as pH increases and pI is near zero charge", () => {
  assert.ok(calculateNetCharge("AKDE", 2) > calculateNetCharge("AKDE", 12));
  const pI = calculateIsoelectricPoint("AKDE");
  assert.ok(Math.abs(calculateNetCharge("AKDE", pI)) < 0.000001);
});

test("returns Kyte-Doolittle residue and smoothed values", () => {
  const result = calculateHydropathy("AILM", 3);
  assert.equal(result.windowSize, 3);
  assert.deepEqual(result.residueValues, [1.8, 4.5, 3.8, 1.9]);
  assert.equal(result.mean, 3);
  assert.equal(result.windowedValues.length, 4);
});

test("aggregates a deterministic JSON-ready analysis", () => {
  const result = analyzePeptide("ACDE", { pH: 7, hydropathyWindowSize: 5 });
  assert.equal(result.sequence, "ACDE");
  assert.equal(result.length, 4);
  assert.equal(result.hydropathy.windowSize, 4);
  assert.equal(result.charge.pH, 7);
});

test("CLI emits JSON for a reproducible analysis", () => {
  const output = execFileSync(process.execPath, [
    "dist/cli.js",
    "analyze",
    "--sequence",
    "ACDE",
    "--ph",
    "7",
    "--json",
  ], { encoding: "utf8" });
  const result = JSON.parse(output);
  assert.equal(result.sequence, "ACDE");
  assert.equal(result.formulaText, "C15H24N4O9S");
});
