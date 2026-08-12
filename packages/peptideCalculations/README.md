# peptideCalculations

`peptideCalculations` is a dependency-light R package for transparent
laboratory solution calculations:

- reconstitution volume from mass and target concentration;
- concentration from mass and final volume;
- single-step dilution planning;
- molarity from mass, molecular weight, and volume.

The same formulas are available in the [Peptido Mexico calculator](https://peptidomexico.com.mx/calculadora/)
and in the [Python package](../peptide-calculations-python/). All functions
return explicit units in their names and reject non-positive inputs.

This is research-use-only software. It does not provide dosing, administration,
sterility, clinical, or patient-specific instructions. Validate calculations
against your laboratory SOP and product documentation.

## Install

After the package appears on R-universe:

```r
install.packages(
  "peptideCalculations",
  repos = c("https://peptidomexico.r-universe.dev", "https://cloud.r-project.org")
)
```

Or install from source:

```r
pak::pak("PeptidoMexico/peptidomexico-open-science", subdir = "packages/peptideCalculations")
```

## Example

```r
library(peptideCalculations)

reconstitution_volume_ml(mass_mg = 10, target_mg_ml = 2)
dilution_plan(stock_mg_ml = 10, target_mg_ml = 2, final_volume_ml = 5)
molarity_m(mass_mg = 10, molecular_weight_g_mol = 1000, volume_ml = 10)
```

## Citation and provenance

The source repository, release history, license, synthetic fixtures, and
validation workflow are available at
<https://github.com/PeptidoMexico/peptidomexico-open-science>.
