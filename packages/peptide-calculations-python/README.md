# peptide-calculations (Python)

Unit-safe Python calculations for peptide reconstitution, concentration,
dilution and molarity. The package mirrors the transparent calculation contract
of the JavaScript package while keeping the Python install dependency-free.

## Install and run

```bash
python -m pip install peptide-calculations
peptide-calculations reconstitution --mass 10 --target 5
```

The command returns JSON. For a 10 mg material and a target of 5 mg/mL, the
calculated volume is 2 mL.

The Python API is also available:

```python
from peptide_calculations import calculate_reconstitution

result = calculate_reconstitution(10, "mg", 5, "mg/mL")
assert result["volumeMl"] == 2
```

Use `mM` only when a molecular mass in daltons is supplied. Inputs are unit
checked, and dilution rejects a target concentration that is not lower than the
stock concentration.

For a browser-based companion, see the [Péptido México reconstitution
calculator](https://peptidomexico.com.mx/calculadora/). This is research-use-only
software: it does not calculate a dose, recommend administration or validate a
physical device or analytical method.

## Development

```bash
PYTHONPATH=src python -m unittest discover -s tests -v
python -m build
```

The package is maintained by Péptido México, a commercial supplier of research
materials. That relationship is disclosed so users can distinguish software
maintenance from scientific interpretation.
