# Péptido México Open Science

Small, inspectable and reproducible tools for peptide laboratory calculations and
volume visualization.

## What is available

- [`peptide-calculations`](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/packages/peptide-calculations)
  calculates reconstitution volume, concentration, dilution, molarity and unit
  conversions from explicit inputs.
- [`syringe-visualizer`](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/packages/syringe-visualizer)
  renders a volume inside a syringe using Three.js and provides a 2D fallback.
- [`peptide-qc`](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/packages/peptide-qc)
  reports sequence composition, elemental formula, mass, approximate charge/pI
  and Kyte–Doolittle hydropathy.
- [`coa-schema`](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/packages/coa-schema)
  validates the structure of research-material records with a versioned JSON
  Schema and an offline CLI.
- [`lcms-peptide-qc`](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/packages/lcms-peptide-qc)
  calculates positive-mode m/z, charge states and signed/absolute ppm error.
- [`peptide-evidence-map`](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/packages/peptide-evidence-map)
  normalizes and deduplicates curator-supplied literature identifiers with a
  provenance hash; it does not fetch or interpret papers.
- [`peptide-calculations` for Python](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/packages/peptide-calculations-python)
  provides a dependency-free Python API and CLI for the same unit-aware
  calculations.

The [`repro-lab-kit`](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/repro-lab-kit)
connects three package outputs in an offline synthetic workflow and checks a
versioned expected summary.

The [CWL workflow](cwl-workflow.md) wraps the same run in a portable workflow
description, and the OCI image includes a CycloneDX SBOM for the three package
dependencies.

The browser integration is the [Péptido México reconstitution calculator](https://peptidomexico.com.mx/calculadora/).
The calculated volume is shared with the visualizer, so the scene is an explanation
of the numeric result rather than an unrelated animation.

## Five-minute path

1. Choose a package in the repository.
2. Read its scope and limits.
3. Run `npm ci` inside the package.
4. Run `npm test` and `npm pack --dry-run`.
5. Use the synthetic example or add a fixture for your own reproducible case.

## Scientific boundary

These tools are for research-use-only and education. They do not calculate a
therapeutic dose, select a solvent or protocol, calibrate a physical syringe,
certify a batch, replace a validated laboratory method or provide clinical advice.

Péptido México maintains the packages and operates a commercial research-material
business. That relationship is disclosed in the package READMEs and citation files.
