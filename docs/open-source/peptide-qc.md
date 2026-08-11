# `peptide-qc`

## Purpose

`peptide-qc` turns a standard 20-amino-acid sequence into an inspectable,
deterministic report:

- residue composition and elemental formula;
- average and monoisotopic molecular mass;
- approximate net charge at a requested pH and approximate pI;
- Kyte–Doolittle hydropathy values and a smoothed profile.

## Quick start

```bash
cd packages/peptide-qc
npm ci
npm test
npx peptide-qc analyze --sequence ACDEFGHIK --ph 7 --json
```

The parser accepts whitespace and hyphens as display separators and rejects
unsupported or ambiguous residue codes. An explicit unknown modification can be
represented as a mass delta, for example
`--modification phosphorylation=79.966331`.

## Interpretation boundary

The mass model sums standard residue formulas plus water. Charge and pI use
fixed pKa assumptions and are approximations; they do not model solvent,
temperature, ionic strength, aggregation, unusual residues, disulfides,
cyclization, terminal caps or instrument-specific ion chemistry. Kyte–Doolittle
hydropathy is not a solubility or formulation prediction.

This is research-use-only and educational software. It does not identify an
unknown, certify a batch, replace a validated analytical method or provide
clinical advice. See the [package README](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/packages/peptide-qc)
and `CITATION.cff` for references and citation guidance.
