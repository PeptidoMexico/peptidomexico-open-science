# Making small scientific calculations reproducible

## Status

Proposal for discussion with The Carpentries Incubator. This document is not an official Carpentries lesson and does not imply endorsement.

## Audience

Researchers, research software engineers and laboratory data stewards who already use a spreadsheet or a short script for routine calculations but want a reviewable, repeatable workflow. The lesson is designed for learners with basic command-line and tabular-data experience.

## Lesson goal

Learners will turn a small unit-sensitive calculation into a reproducible artifact that another person can inspect and run from a clean checkout.

## Learning objectives

By the end of the lesson, learners should be able to:

1. state the input units and identify which fields are measured, assumed or derived;
2. validate a CSV against a documented input/output contract;
3. normalize units at a program boundary without changing the physical result;
4. write an invariant test for an equivalent input expressed in different units;
5. record source, version, license and provenance metadata; and
6. explain why a deterministic calculation does not establish product quality, sterility, stability or a safe laboratory procedure.

## Proposed episodes

### 1. Read the contract before the numbers

Learners inspect a schema and a twelve-row synthetic benchmark. They label each field as input, assumption or derived output and identify missing molecular-mass values.

### 2. Make units explicit

Learners run the command-line calculator on mass-concentration and molar-concentration cases. They compare milligram/millilitre, microgram/microlitre and molar inputs and inspect normalized JSON output.

### 3. Test an invariant

Learners change only the representation of a mass or volume and verify that the normalized result is unchanged. They then introduce an invalid unit and observe a useful validation error.

### 4. Preserve provenance

Learners connect the input fixture to its schema, source revision, citation and execution environment. They record which conclusions are supported by the benchmark and which require a validated laboratory method.

## Synthetic fixture

The exercise uses the public benchmark at [Zenodo](https://doi.org/10.5281/zenodo.21896173) and the matching source files in the [canonical repository](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/benchmarks/peptide-calculations-synthetic). It contains no customer, patient, clinical, batch, instrument or experimental data.

## Assessment

Learners submit a short machine-readable result plus a provenance note. A solution is accepted when the result passes the schema, the unit-equivalence assertion passes, the invalid-unit case is rejected, and the learner states the interpretation boundary in plain language.

## Scope and responsible use

This proposal teaches reproducible computation, not peptide handling or medical decision-making. Real laboratory work must follow the responsible institution's validated methods, product documentation and applicable safety requirements.

## License and maintenance

Proposed lesson text: CC BY 4.0. Example code: MIT. Maintained by Péptido México Open Science, with the commercial research-materials relationship disclosed so the community can evaluate context and conflicts.
