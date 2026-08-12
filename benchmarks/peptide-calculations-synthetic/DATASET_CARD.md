# Synthetic peptide-calculations benchmark

## Purpose

This fixture tests unit conversion, reconstitution volume and the molecular-mass
requirement for `mM` targets. It is intended for software regression tests,
teaching and reproducibility demonstrations.

It is not a measurement dataset. No vial, batch, patient, instrument or
analytical result is represented here.

## Generation method

Each row is a deterministic test case authored from the equation

`volume_mL = mass_mg / target_mg_per_mL`.

The conversion rules and `mM` relationship are documented in
`packages/peptide-calculations` and its Python counterpart. Values were chosen
to cover mg/µg, mL/µL, mass concentration and molar concentration paths without
pretending that the fixture is experimental evidence.

## License and provenance

- Data license: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Schema: [`schema.json`](./schema.json).
- Input: [`input.csv`](./input.csv).
- Validation: `npm run benchmark:reconstitution`.
- Source repository: [Peptido México Open Science](https://github.com/PeptidoMexico/peptidomexico-open-science).

The maintainer is a commercial supplier of research materials. The benchmark
contains no commercial claims and must not be interpreted as a product or
clinical validation.
