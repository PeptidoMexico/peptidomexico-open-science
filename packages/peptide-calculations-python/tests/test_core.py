import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from peptide_calculations import (  # noqa: E402
    calculate_concentration,
    calculate_dilution,
    calculate_reconstitution,
    parse_molar_mass_da,
)


class CalculationTests(unittest.TestCase):
    def test_reconstitution(self):
        result = calculate_reconstitution(10, "mg", 5, "mg/mL")
        self.assertEqual(result["volumeMl"], 2.0)
        self.assertEqual(result["targetMgPerMl"], 5.0)

    def test_unit_normalization(self):
        result = calculate_concentration(500, "µg", 250, "µL")
        self.assertEqual(result["massMg"], 0.5)
        self.assertEqual(result["volumeMl"], 0.25)
        self.assertEqual(result["concentrationMgPerMl"], 2.0)
        self.assertEqual(result["concentrations"]["µg/mL"], 2000.0)

    def test_molarity_requires_mass(self):
        with self.assertRaisesRegex(ValueError, "molar_mass_da"):
            calculate_reconstitution(10, "mg", 1, "mM")

    def test_dilution(self):
        result = calculate_dilution(10, "mg/mL", 2, "mg/mL", 5, "mL")
        self.assertEqual(result["stockVolumeMl"], 1.0)
        self.assertEqual(result["diluentVolumeMl"], 4.0)
        self.assertEqual(result["dilutionFactor"], 5.0)

    def test_dilution_target_must_be_lower(self):
        with self.assertRaisesRegex(ValueError, "lower than stock"):
            calculate_dilution(2, "mg/mL", 2, "mg/mL", 5, "mL")

    def test_parse_mass(self):
        self.assertEqual(parse_molar_mass_da("4,731.33 Da"), 4731.33)
        self.assertEqual(parse_molar_mass_da("4731,33 Da"), 4731.33)

    def test_module_cli(self):
        completed = subprocess.run(
            [sys.executable, "-m", "peptide_calculations", "reconstitution", "--mass", "10", "--target", "5"],
            cwd=ROOT,
            env={**__import__("os").environ, "PYTHONPATH": str(ROOT / "src")},
            check=True,
            capture_output=True,
            text=True,
        )
        self.assertEqual(json.loads(completed.stdout)["volumeMl"], 2.0)


if __name__ == "__main__":
    unittest.main()
