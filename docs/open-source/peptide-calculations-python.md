# `peptide-calculations` for Python

The Python distribution exposes dependency-free reconstitution, concentration,
dilution and molarity calculations for laboratory scripts and teaching
notebooks.

```bash
python -m pip install peptide-calculations
peptide-calculations reconstitution --mass 10 --target 5
```

The API returns JSON-serializable dictionaries and requires a molecular mass
when the requested unit is `mM`. The package documents its formulas and rejects
invalid units or a dilution target that is not lower than the stock.

The source package, tests and citation metadata live in
[`packages/peptide-calculations-python`](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/packages/peptide-calculations-python).
The browser companion is the [Péptido México reconstitution calculator](https://peptidomexico.com.mx/calculadora/).

This is research-use-only and educational software. It does not calculate a
therapeutic dose, recommend administration, validate a physical device or
certify a laboratory result.
