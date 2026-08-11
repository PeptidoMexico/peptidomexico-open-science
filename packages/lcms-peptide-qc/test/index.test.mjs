import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  PROTON_MASS_DA,
  analyzeCsvObservations,
  analyzeMzObservation,
  calculateChargeStates,
  calculateNeutralMass,
  calculateMz,
  calculatePpmError,
} from "../dist/index.js";

test("calculates positive-mode m/z from neutral mass and charge", () => {
  const mz = calculateMz({ neutralMassDa: 1000, charge: 2 });
  assert.equal(mz, (1000 + 2 * PROTON_MASS_DA) / 2);
});

test("inverts an observed m/z to neutral mass", () => {
  const mz = calculateMz({ neutralMassDa: 1000, charge: 3 });
  assert.ok(Math.abs(calculateNeutralMass({ observedMz: mz, charge: 3 }) - 1000) < 0.000000001);
});

test("reports signed and absolute ppm error", () => {
  const result = analyzeMzObservation({
    id: "peak-1",
    neutralMassDa: 1000,
    charge: 2,
    observedMz: 501.007376466621,
  });
  assert.equal(result.id, "peak-1");
  assert.ok(Math.abs(result.signedPpmError - 0.19959789941605832) < 0.000000001);
  assert.equal(result.absolutePpmError, Math.abs(result.signedPpmError));
  assert.ok(Math.abs(calculatePpmError(501.007, result.theoreticalMz) - (result.signedPpmError + (501.007 - result.observedMz) / result.theoreticalMz * 1_000_000)) < 0.000000001);
});

test("creates a deterministic charge-state table", () => {
  const table = calculateChargeStates(1000, 3);
  assert.deepEqual(table.map((row) => row.charge), [1, 2, 3]);
  assert.ok(table[0].theoreticalMz > table[1].theoreticalMz);
});

test("parses the synthetic CSV fixture", async () => {
  const csv = await readFile(new URL("../examples/observations.csv", import.meta.url), "utf8");
  const results = analyzeCsvObservations(csv);
  assert.equal(results.length, 2);
  assert.equal(results[0].id, "synthetic-2+");
  assert.ok(results.every((result) => result.absolutePpmError < 0.3));
});

test("rejects malformed CSV headers", () => {
  assert.throws(() => analyzeCsvObservations("id,mass,charge,mz\na,1000,2,501"), /CSV header/);
});

test("CLI emits JSON for a reproducible analysis", () => {
  const output = execFileSync(process.execPath, [
    "dist/cli.js",
    "analyze",
    "--mass-da",
    "1000",
    "--charge",
    "2",
    "--observed-mz",
    "501.007376466621",
    "--json",
  ], { encoding: "utf8" });
  assert.equal(JSON.parse(output).charge, 2);
});
