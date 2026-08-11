# peptide-calculations

Unit-safe, research-use-only calculations for peptide laboratory preparation.

The package currently provides:

- reconstitution volume from mass and target concentration;
- concentration from mass and total volume;
- dilution stock/diluent volumes and dilution factor;
- conversions between mg/mL, µg/mL, µg/µL and mM;
- a small CLI that emits reproducible JSON.

It intentionally does not calculate therapeutic doses, recommend administration, select a protocol, certify a batch or replace a validated laboratory method.

## Install

    npm install peptide-calculations

## Library usage

    import { calculateReconstitution } from "peptide-calculations";

    const result = calculateReconstitution({
      mass: 10,
      massUnit: "mg",
      target: 5,
      concentrationUnit: "mg/mL",
    });

    console.log(result.volumeMl); // 2

All calculations use explicit units. A molecular mass is required for mM conversions.

## CLI

    npx peptide-calculations reconstitution \
      --mass 10 \
      --mass-unit mg \
      --target 5 \
      --target-unit mg/mL \
      --json

The CLI has no network access and produces deterministic output from the supplied inputs.

## Scope and disclosure

This software is for research-use-only and educational laboratory calculations. It is maintained by Péptido México, a commercial supplier of research materials. The project is independent of any particular product catalog, batch, protocol or clinical use.

## Development

    npm test
    npm run pack:check

The test suite uses synthetic numeric fixtures. No customer data, certificates of analysis or private batch records belong in this repository.

## Citation

See CITATION.cff. Releases will receive a DOI after the public repository is connected to Zenodo.
