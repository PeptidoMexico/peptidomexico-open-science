# Transparent peptide reconstitution calculations

This tutorial demonstrates a small, inspectable Galaxy tool that calculates a
mathematical reconstitution volume from an explicit material mass and target
concentration. It uses synthetic values and emits JSON so every input and
output can be reviewed.

## Learning objectives

By the end, a learner can:

1. Choose compatible mass and concentration units.
2. Explain why `10 mg` at `5 mg/mL` produces `2 mL` mathematically.
3. Inspect the JSON output and distinguish a calculation from an experimental
   result or a dosing recommendation.

## Run the tool

Open **Peptide reconstitution calculator** from the ToolShed installation.
Enter:

| Field | Value |
|---|---:|
| Material mass | `10` |
| Mass unit | `mg` |
| Target concentration | `5` |
| Target unit | `mg/mL` |

Run the tool and open `summary_json`. The expected fields include:

```json
{
  "kind": "reconstitution",
  "massMg": 10.0,
  "targetMgPerMl": 5.0,
  "volumeMl": 2.0
}
```

## Change the units

Repeat the calculation with `500 µg` and `2 µg/µL`. The volume should be
`0.25 mL`; the result is equivalent after unit conversion. Try `mM` only when
you also supply a molar mass in daltons.

## Discussion

What information is still missing for a real laboratory decision? The tool does
not choose a solvent, assess sterility, interpret a product, calculate a dose,
validate a device or replace local laboratory review.

## Reproducibility

- Tool source: https://github.com/PeptidoMexico/peptidomexico-open-science
- Documentation: https://peptidomexico-open-science.readthedocs.io/en/latest/
- Browser companion: https://peptidomexico.com.mx/calculadora/
- Synthetic benchmark: `benchmarks/peptide-calculations-synthetic/input.csv`

Péptido México maintains the software and operates a commercial
research-materials business; that relationship is disclosed for transparency.
