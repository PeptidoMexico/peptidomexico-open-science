"""Unit-safe calculations shared by the Python package and its CLI.

The functions deliberately return plain dictionaries so their results can be
serialized without a custom model layer. They are calculation helpers, not
instructions for administration or a substitute for laboratory validation.
"""

from __future__ import annotations

import math
from typing import Optional


MASS_TO_MG = {"mg": 1.0, "µg": 0.001, "ug": 0.001}
VOLUME_TO_ML = {"mL": 1.0, "ml": 1.0, "µL": 0.001, "uL": 0.001}
CONCENTRATION_UNITS = {"mg/mL", "mg/ml", "µg/mL", "ug/ml", "µg/µL", "ug/ul", "mM"}


def _positive(value: float, name: str) -> float:
    if not isinstance(value, (int, float)) or not math.isfinite(value) or value <= 0:
        raise ValueError(f"{name} must be a finite number greater than zero.")
    return float(value)


def _molar_mass(value: Optional[float]) -> Optional[float]:
    if value is None:
        return None
    return _positive(value, "molar_mass_da")


def normalize_mass_to_mg(value: float, unit: str) -> float:
    _positive(value, "mass")
    try:
        return float(value) * MASS_TO_MG[unit]
    except KeyError as error:
        raise ValueError("mass unit must be mg or µg.") from error


def normalize_volume_to_ml(value: float, unit: str) -> float:
    _positive(value, "volume")
    try:
        return float(value) * VOLUME_TO_ML[unit]
    except KeyError as error:
        raise ValueError("volume unit must be mL or µL.") from error


def concentration_to_mg_per_ml(value: float, unit: str, molar_mass_da: Optional[float] = None) -> Optional[float]:
    if not isinstance(value, (int, float)) or not math.isfinite(value) or value <= 0:
        return None
    if unit in {"mg/mL", "mg/ml", "µg/µL", "ug/ul"}:
        return float(value)
    if unit in {"µg/mL", "ug/ml"}:
        return float(value) / 1000
    if unit == "mM":
        mass = _molar_mass(molar_mass_da)
        if mass is None:
            return None
        return float(value) * mass / 1000
    raise ValueError(f"Unsupported concentration unit: {unit}.")


def mg_per_ml_to_concentration(mg_per_ml: float, unit: str, molar_mass_da: Optional[float] = None) -> Optional[float]:
    _positive(mg_per_ml, "mg_per_ml")
    if unit in {"mg/mL", "mg/ml", "µg/µL", "ug/ul"}:
        return float(mg_per_ml)
    if unit in {"µg/mL", "ug/ml"}:
        return float(mg_per_ml) * 1000
    if unit == "mM":
        mass = _molar_mass(molar_mass_da)
        if mass is None:
            return None
        return float(mg_per_ml) * 1000 / mass
    raise ValueError(f"Unsupported concentration unit: {unit}.")


def _concentration_values(mg_per_ml: float, molar_mass_da: Optional[float]) -> dict:
    return {
        "mg/mL": mg_per_ml,
        "µg/mL": mg_per_ml * 1000,
        "µg/µL": mg_per_ml,
        "mM": mg_per_ml_to_concentration(mg_per_ml, "mM", molar_mass_da),
    }


def calculate_concentration(
    mass: float,
    mass_unit: str,
    volume: float,
    volume_unit: str,
    molar_mass_da: Optional[float] = None,
) -> dict:
    mass_mg = normalize_mass_to_mg(mass, mass_unit)
    volume_ml = normalize_volume_to_ml(volume, volume_unit)
    molar_mass = _molar_mass(molar_mass_da)
    concentration = mass_mg / volume_ml
    return {
        "kind": "concentration",
        "massMg": mass_mg,
        "volumeMl": volume_ml,
        "molarMassDa": molar_mass,
        "concentrationMgPerMl": concentration,
        "concentrations": _concentration_values(concentration, molar_mass),
    }


def calculate_reconstitution(
    mass: float,
    mass_unit: str,
    target: float,
    target_unit: str,
    molar_mass_da: Optional[float] = None,
) -> dict:
    mass_mg = normalize_mass_to_mg(mass, mass_unit)
    molar_mass = _molar_mass(molar_mass_da)
    target_mg_per_ml = concentration_to_mg_per_ml(target, target_unit, molar_mass)
    if target_mg_per_ml is None:
        if target_unit == "mM" and molar_mass is None:
            raise ValueError("molar_mass_da is required when target_unit is mM.")
        raise ValueError("target must be a finite number greater than zero.")
    return {
        "kind": "reconstitution",
        "massMg": mass_mg,
        "targetMgPerMl": target_mg_per_ml,
        "target": target,
        "concentrationUnit": target_unit,
        "molarMassDa": molar_mass,
        "volumeMl": mass_mg / target_mg_per_ml,
    }


def calculate_dilution(
    stock: float,
    stock_unit: str,
    target: float,
    target_unit: str,
    final_volume: float,
    final_volume_unit: str,
    molar_mass_da: Optional[float] = None,
) -> dict:
    molar_mass = _molar_mass(molar_mass_da)
    stock_mg_per_ml = concentration_to_mg_per_ml(stock, stock_unit, molar_mass)
    target_mg_per_ml = concentration_to_mg_per_ml(target, target_unit, molar_mass)
    if stock_mg_per_ml is None or target_mg_per_ml is None:
        raise ValueError("stock and target must be finite concentrations.")
    final_volume_ml = normalize_volume_to_ml(final_volume, final_volume_unit)
    if target_mg_per_ml >= stock_mg_per_ml:
        raise ValueError("target concentration must be lower than stock concentration.")
    stock_volume_ml = (target_mg_per_ml * final_volume_ml) / stock_mg_per_ml
    return {
        "kind": "dilution",
        "stockMgPerMl": stock_mg_per_ml,
        "targetMgPerMl": target_mg_per_ml,
        "finalVolumeMl": final_volume_ml,
        "stockVolumeMl": stock_volume_ml,
        "diluentVolumeMl": final_volume_ml - stock_volume_ml,
        "dilutionFactor": stock_mg_per_ml / target_mg_per_ml,
        "molarMassDa": molar_mass,
    }


def parse_molar_mass_da(value: Optional[str]) -> Optional[float]:
    if not value:
        return None
    cleaned = value.strip().replace(" ", "").replace("Da", "")
    if "," in cleaned and "." in cleaned:
        cleaned = cleaned.replace(".", "").replace(",", ".") if cleaned.rfind(",") > cleaned.rfind(".") else cleaned.replace(",", "")
    elif "," in cleaned:
        cleaned = cleaned.replace(",", ".")
    try:
        parsed = float(cleaned)
    except ValueError:
        return None
    return parsed if math.isfinite(parsed) and parsed > 0 else None
