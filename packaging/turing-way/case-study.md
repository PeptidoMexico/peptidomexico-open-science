# A small reproducibility case study: unit-safe peptide calculations

## Why this case study exists

Research teams often move a calculation between a notebook, a spreadsheet and a bench note. The arithmetic may be simple, but silent unit conversions and undocumented assumptions make the result difficult to review or reproduce. This case study shows how a deliberately small synthetic benchmark can make those assumptions visible.

The example is about a peptide reconstitution calculation: a user specifies an amount of lyophilized material, a target concentration and the molecular mass when a molar target is used. The software returns the required solvent volume together with normalized units and the assumptions used. It is an educational reproducibility example, not a protocol for clinical or therapeutic use.

## What is reproducible

The public repository contains:

1. a versioned calculation library and command-line interface;
2. twelve synthetic input cases covering mass, volume, mass-concentration and molar-concentration units;
3. a JSON schema for the input/output contract;
4. deterministic expected outputs and automated tests;
5. provenance metadata and a citation file; and
6. a containerized CWL workflow that can run the same calculation from a clean environment.

The benchmark intentionally contains no customer, patient, clinical, batch, instrument or experimental data. Each case can be inspected as plain text and executed locally without network access after the package is installed.

## Suggested learner exercise

Run the benchmark from a clean checkout and inspect one case in which the same quantity is expressed in milligrams and micrograms. Compare the normalized volume and concentration fields, then change only one input unit and confirm that the result remains invariant. Next, choose a molar target and supply an explicit molecular mass. Record which values are measurements, which are assumptions and which are derived quantities.

The important lesson is not the peptide-specific arithmetic. It is the workflow: declare the input contract, normalize units at the boundary, preserve provenance, test invariants and publish the exact environment used for the result.

## Limitations and responsible use

This is a synthetic software-quality benchmark. It does not establish product identity, sterility, stability, assay suitability or a safe handling procedure. Any real laboratory work requires the responsible institution's validated methods, product documentation and applicable safety requirements.

## Reuse and links

- [Source repository](https://github.com/PeptidoMexico/peptidomexico-open-science)
- [Synthetic benchmark](https://doi.org/10.5281/zenodo.21896173)
- [Documentation](https://peptidomexico-open-science.readthedocs.io/en/latest/)
- [Public calculation tool](https://peptidomexico.com.mx/calculadora/)

Maintained by Péptido México Open Science. The project is open source and the example values are synthetic; the maintainer is also a commercial research-materials business, which is disclosed here so readers can evaluate the context.
