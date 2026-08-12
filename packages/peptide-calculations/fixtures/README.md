# Reconstitution test vectors

The CSV in this directory contains deterministic expected outputs for software that implements:

```text
volume = mass / target concentration
```

These fixtures exercise compatible mg/mL and µg/µL representations, mixed scales after normalization and decimal inputs. They are reference values for tests and educational review, not a laboratory method.

Exact unit relationships used by the fixtures:

- 1 mg = 1000 µg.
- 1 mL = 1000 µL.
- 1 mg/mL = 1 µg/µL.

The same fixture release is archived at [Zenodo DOI 10.5281/zenodo.21909490](https://doi.org/10.5281/zenodo.21909490). The related software record is [Figshare DOI 10.6084/m9.figshare.33235407](https://doi.org/10.6084/m9.figshare.33235407).

Research-use-only scope: the fixtures do not specify a solvent, preparation procedure, dose, administration route or stability claim.
