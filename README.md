# PeptidoMexico Open Science

Reusable, research-use-only software for peptide laboratory calculations and
volume visualization.

This is the open-source program of [Peptido México](https://peptidomexico.com.mx/).
`PeptidoMexico` is the project’s canonical brand; **Open Science** describes the
reusable software and reproducibility program. The project is maintained under
the PeptidoMexico GitHub organization and is separate from the commercial
storefront’s catalog, checkout and customer data.

The current `v0.5.3` release is the maintained package baseline. Archived
release DOIs are listed in [`CITATION.cff`](CITATION.cff).

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
- [`peptide-evidence-map`](packages/peptide-evidence-map/) — deterministic DOI,
  PMID, PMCID and URL normalization, deduplication and curation provenance.
- [`peptideCalculations`](packages/peptideCalculations/) — dependency-light R
  functions for reconstitution volume, concentration, dilution planning and
  molarity, with explicit units and test coverage.

The [`repro-lab-kit`](repro-lab-kit/) runs a synthetic sequence → reconstitution
→ LC-MS calculation workflow offline and compares its JSON output with a
versioned expected summary.

The live integration demo is the [Peptido México reconstitution calculator](https://peptidomexico.com.mx/calculadora/).
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

R users can install the package from the project’s R-universe once its build is
green:

```r
install.packages(
  "peptideCalculations",
  repos = c("https://peptidomexico-openscience.r-universe.dev", "https://cloud.r-project.org")
)
```

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
