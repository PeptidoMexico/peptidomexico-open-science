# peptide-qc

Inspectable, deterministic quality-control calculations for a standard
20-amino-acid peptide sequence.

The package reports:

- normalized sequence and residue composition;
- elemental formula and average/monoisotopic molecular mass;
- explicit modification mass deltas, without pretending to infer an unknown
  modification structure;
- approximate net charge at a requested pH and an approximate isoelectric point;
- Kyte–Doolittle hydropathy values and a smoothed profile.

## Install

```bash
npm install peptide-qc
```

## Library usage

```ts
import { analyzePeptide } from "peptide-qc";

const result = analyzePeptide("ACDEFGHIK", {
  pH: 7,
  hydropathyWindowSize: 7,
  modifications: [{ name: "phosphorylation", deltaMassDa: 79.966331 }],
});

console.log(result.mass.monoisotopicDa);
console.log(result.charge.netCharge);
```

Whitespace and hyphens are accepted as display separators. The parser rejects
non-standard or ambiguous residue codes instead of silently guessing.

## CLI

```bash
npx peptide-qc analyze \
  --sequence ACDEFGHIK \
  --ph 7 \
  --window-size 7 \
  --json
```

One explicit modification mass can be supplied with
`--modification phosphorylation=79.966331`. The output is deterministic JSON
and the CLI does not access the network.

## Scientific assumptions and limits

Mass is calculated as the sum of standard amino-acid residue formulas plus
water. Average and monoisotopic values use the elemental constants in the
source. A supplied `deltaFormula` is used to calculate a modification mass; a
supplied `deltaMassDa` is kept as an explicit mass delta when the structure is
not represented.

Net charge and pI are transparent approximations using fixed pKa values for
the termini and ionizable side chains. They do not model solvent, temperature,
ionic strength, aggregation, unusual residues, disulfide connectivity,
cyclization, terminal caps or instrument-specific ion chemistry. Hydropathy is
the Kyte–Doolittle scale and is not a solubility or formulation prediction.

This is research-use-only and educational software. It does not certify a
batch, replace a validated analytical method, identify an unknown, provide a
therapeutic dose or give clinical advice. The package is maintained by Péptido
México, a commercial supplier of research materials; that relationship is
disclosed here and in `CITATION.cff`.

## References

- Kyte J, Doolittle RF. A simple method for displaying the hydropathic
  character of a protein. *J Mol Biol.* 1982;157(1):105–132.
  https://doi.org/10.1016/0022-2836(82)90515-0
- Bjellqvist B, et al. The focusing positions of polypeptides in immobilized
  pH gradients can be predicted from their amino acid sequences.
  *Electrophoresis.* 1993;14(1):1023–1031.
  https://doi.org/10.1002/elps.11501401163

## Development

```bash
npm test
npm run pack:check
```

Fixtures use synthetic sequences. Do not add customer data, private batch
records or real certificates of analysis.

The latest suite release is archived on [Zenodo](https://doi.org/10.5281/zenodo.21895679)
with reproducible citation metadata.

## Citation

See `CITATION.cff` and cite the exact release when possible.
