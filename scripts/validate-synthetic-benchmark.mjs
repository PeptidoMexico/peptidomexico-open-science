import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { calculateReconstitution } from "../packages/peptide-calculations/dist/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const benchmarkDir = path.join(root, "benchmarks/peptide-calculations-synthetic");
const inputPath = path.join(benchmarkDir, "input.csv");
const csv = await readFile(inputPath, "utf8");
const lines = csv.trim().split(/\r?\n/);
const expectedHeader = [
  "case_id",
  "mass",
  "mass_unit",
  "target",
  "target_unit",
  "molar_mass_da",
  "expected_volume_ml",
];
const header = lines.shift().split(",");
if (header.join(",") !== expectedHeader.join(",")) {
  throw new Error(`Benchmark header must be exactly: ${expectedHeader.join(",")}.`);
}

const seen = new Set();
const rows = lines.map((line, index) => {
  const fields = line.split(",");
  if (fields.length !== expectedHeader.length) {
    throw new Error(`Benchmark row ${index + 2} has ${fields.length} fields.`);
  }
  const [caseId, mass, massUnit, target, targetUnit, molarMassDa, expectedVolumeMl] = fields;
  if (seen.has(caseId)) throw new Error(`Duplicate case_id: ${caseId}.`);
  seen.add(caseId);
  const result = calculateReconstitution({
    mass: Number(mass),
    massUnit,
    target: Number(target),
    concentrationUnit: targetUnit,
    molarMassDa: molarMassDa ? Number(molarMassDa) : undefined,
  });
  const expected = Number(expectedVolumeMl);
  if (!Number.isFinite(expected) || Math.abs(result.volumeMl - expected) > 1e-9) {
    throw new Error(`${caseId} expected ${expected} mL, got ${result.volumeMl} mL.`);
  }
  return caseId;
});

const inputSha256 = createHash("sha256").update(csv).digest("hex");
console.log(JSON.stringify({
  status: "pass",
  dataset: "synthetic-peptide-reconstitution-v0.1.0",
  rows: rows.length,
  inputSha256,
}, null, 2));
