# Péptido México Open Science packages

This directory contains the reusable software extracted from the Péptido México
research tools. The packages are intentionally small, installable and testable
without access to the storefront or to customer data.

## Current release candidates

| Package | What it does | Status |
| --- | --- | --- |
| [`peptide-calculations`](./peptide-calculations/) | Reconstitution, concentration, dilution and unit conversion with a deterministic TypeScript API and CLI. | `0.1.0` release candidate |
| [`syringe-visualizer`](./syringe-visualizer/) | Client-side Three.js visualization of a volume inside a syringe, with an accessible 2D fallback. | `0.1.0` release candidate |
| [`peptide-qc`](./peptide-qc/) | Sequence composition, formula, mass, approximate charge/pI and Kyte–Doolittle hydropathy with a JSON CLI. | `0.1.0` release candidate |
| [`coa-schema`](./coa-schema/) | Versioned JSON Schema and offline validator for structured research-material records, with synthetic fixtures. | `0.1.0` release candidate |

The web calculator at [`/calculadora/`](https://peptidomexico.com.mx/calculadora/)
is an integration demo and the first owner page. It is not a substitute for a
validated laboratory method, device calibration, a protocol review or a clinical
decision.

## Future scope

`lcms-peptide-qc`, `peptide-evidence-map` and `repro-lab-kit` remain roadmap
projects. They must not be listed as released tools until their input contracts,
fixtures, tests, documentation and scientific limits exist in this repository.

## Repository boundary

The MIT license files inside each package govern that package's source and
distribution. The commercial storefront, product catalog, brand assets, customer
flows and private operational data are outside the scope of these package
licenses.

See the repository-level [contribution guide](../CONTRIBUTING.md),
[security policy](../SECURITY.md) and [open-source execution plan](../docs/seo/OPEN-SOURCE-50-ONE-SHOT-EXECUTION-PLAN.md).
