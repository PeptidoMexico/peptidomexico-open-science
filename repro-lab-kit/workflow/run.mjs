import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { calculateReconstitution } from "../../packages/peptide-calculations/dist/index.js";
import { analyzePeptide } from "../../packages/peptide-qc/dist/index.js";
import { analyzeMzObservation, calculateMz } from "../../packages/lcms-peptide-qc/dist/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const inputPath = path.join(root, "repro-lab-kit/fixtures/input.json");
const expectedPath = path.join(root, "repro-lab-kit/workflow/expected-summary.json");
const inputText = fs.readFileSync(inputPath, "utf8");
const input = JSON.parse(inputText);
const inputSha256 = createHash("sha256").update(JSON.stringify(input)).digest("hex");

const peptide = analyzePeptide(input.sequence);
const reconstitution = calculateReconstitution(input.reconstitution);
const theoreticalMz = calculateMz({ neutralMassDa: peptide.mass.monoisotopicDa, charge: input.lcms.charge });
const observedMz = theoreticalMz + input.lcms.observedOffsetDa;
const lcms = analyzeMzObservation({
  id: "synthetic-fixture",
  neutralMassDa: peptide.mass.monoisotopicDa,
  charge: input.lcms.charge,
  observedMz,
});

const round = (value, digits = 8) => Number(value.toFixed(digits));
const summary = {
  schemaVersion: "0.1.0",
  sequence: peptide.sequence,
  peptide: {
    length: peptide.length,
    formula: peptide.formulaText,
    monoisotopicDa: round(peptide.mass.monoisotopicDa),
  },
  reconstitution: {
    targetMgPerMl: reconstitution.targetMgPerMl,
    volumeMl: round(reconstitution.volumeMl),
  },
  lcms: {
    charge: lcms.charge,
    theoreticalMz: round(lcms.theoreticalMz),
    observedMz: round(lcms.observedMz),
    absolutePpmError: round(lcms.absolutePpmError, 4),
  },
  provenance: {
    inputSha256,
    workflow: "repro-lab-kit@0.1.0",
    packages: ["peptide-calculations", "peptide-qc", "lcms-peptide-qc"],
  },
};

if (process.argv.includes("--check")) {
  const expected = JSON.parse(fs.readFileSync(expectedPath, "utf8"));
  if (JSON.stringify(summary) !== JSON.stringify(expected)) {
    console.error(JSON.stringify({ expected, actual: summary }, null, 2));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({ status: "pass", summary }, null, 2));
  }
} else {
  console.log(JSON.stringify(summary, null, 2));
}
