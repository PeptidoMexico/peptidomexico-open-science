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
| [`lcms-peptide-qc`](./lcms-peptide-qc/) | Positive-mode m/z, charge-state and ppm-error calculations with a deterministic CSV parser. | `0.1.0` release candidate |
| [`peptide-evidence-map`](./peptide-evidence-map/) | Identifier normalization, deduplication and provenance for curator-supplied literature evidence maps. | `0.1.0` release candidate |

The web calculator at [`/calculadora/`](https://peptidomexico.com.mx/calculadora/)
is an integration demo and the first owner page. It is not a substitute for a
validated laboratory method, device calibration, a protocol review or a clinical
decision.

## Future scope

`peptide-evidence-map` is available as a release candidate. The repository-level
`repro-lab-kit` is an offline workflow release candidate; it is not an npm package
and does not claim to validate a laboratory method.

## Repository boundary

The MIT license files inside each package govern that package's source and
distribution. The commercial storefront, product catalog, brand assets, customer
flows and private operational data are outside the scope of these package
licenses.

See the repository-level [contribution guide](../CONTRIBUTING.md),
[security policy](../SECURITY.md) and [open-source execution plan](../docs/seo/OPEN-SOURCE-50-ONE-SHOT-EXECUTION-PLAN.md).
