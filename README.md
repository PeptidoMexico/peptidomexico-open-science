# Péptido México Open Science

Reusable, research-use-only software for peptide laboratory calculations and
volume visualization.

The stable `v0.3.0` release is archived on [Zenodo](https://doi.org/10.5281/zenodo.21895595)
with DOI `10.5281/zenodo.21895595`.

## Packages

- [`peptide-calculations`](packages/peptide-calculations/) — deterministic
  reconstitution, concentration, dilution, molarity and unit conversion API plus
  JSON CLI.
- [`syringe-visualizer`](packages/syringe-visualizer/) — accessible client-side
  Three.js visualization of a volume inside a syringe, with an SVG fallback.
- [`peptide-qc`](packages/peptide-qc/) — sequence composition, elemental formula,
  mass, approximate charge, pI and Kyte–Doolittle hydropathy output.
- [`coa-schema`](packages/coa-schema/) — versioned JSON Schema and offline
  validator for structured research-material records.
- [`lcms-peptide-qc`](packages/lcms-peptide-qc/) — positive-mode m/z, charge-state
  and ppm-error calculations for synthetic LC-MS workflow fixtures.

The live integration demo is the [Péptido México reconstitution calculator](https://peptidomexico.com.mx/calculadora/).
The demo connects a peptide presentation and a target concentration to the
calculation engine, then renders the calculated volume in the visualizer. The
visualizer is a geometry and reading aid; it does not decide a dose, protocol,
solvent, route of administration or clinical action.

Read the [versioned package documentation](https://peptidomexico-open-science.readthedocs.io/en/latest/)
for the public API, reproducibility path and scientific boundaries.

## Quick start

```bash
cd packages/peptide-calculations
npm install
npm test
npx peptide-calculations reconstitution \
  --mass 10 --mass-unit mg --target 5 --target-unit mg/mL --json
```

The expected final volume for that synthetic example is `2 mL`.

For the React component:

```bash
cd packages/syringe-visualizer
npm install
npm test
```

See each package README for its API, limits and citation instructions.

## Scope and disclosure

These packages are for research-use-only and educational software. They do not
certify a batch, calibrate a physical device, replace a validated method or
provide medical guidance. The project is maintained by Péptido México, a
commercial supplier of research materials. No customer data, real COAs or private
batch records belong here.

The package source is MIT-licensed at package level. Contributions are governed by
the repository [contribution guide](CONTRIBUTING.md), [security policy](SECURITY.md)
and [code of conduct](CODE_OF_CONDUCT.md).

## Why this repository exists

The goal is to make small scientific tools installable, inspectable, reproducible
and citable. External references should follow actual use, integration, teaching
or citation; this project does not ask for artificial links, votes or ratings.
