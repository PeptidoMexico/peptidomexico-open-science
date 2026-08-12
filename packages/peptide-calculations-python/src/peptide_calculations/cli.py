"""Command-line interface for peptide-calculations."""

from __future__ import annotations

import argparse
import json

from .core import calculate_concentration, calculate_dilution, calculate_reconstitution


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Unit-safe peptide laboratory calculations.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    reconstitution = subparsers.add_parser("reconstitution")
    reconstitution.add_argument("--mass", type=float, required=True)
    reconstitution.add_argument("--mass-unit", default="mg")
    reconstitution.add_argument("--target", type=float, required=True)
    reconstitution.add_argument("--target-unit", default="mg/mL")
    reconstitution.add_argument("--molar-mass-da", type=float)

    concentration = subparsers.add_parser("concentration")
    concentration.add_argument("--mass", type=float, required=True)
    concentration.add_argument("--mass-unit", default="mg")
    concentration.add_argument("--volume", type=float, required=True)
    concentration.add_argument("--volume-unit", default="mL")
    concentration.add_argument("--molar-mass-da", type=float)

    dilution = subparsers.add_parser("dilution")
    dilution.add_argument("--stock", type=float, required=True)
    dilution.add_argument("--stock-unit", default="mg/mL")
    dilution.add_argument("--target", type=float, required=True)
    dilution.add_argument("--target-unit", default="mg/mL")
    dilution.add_argument("--final-volume", type=float, required=True)
    dilution.add_argument("--final-volume-unit", default="mL")
    dilution.add_argument("--molar-mass-da", type=float)
    return parser


def main() -> None:
    args = _parser().parse_args()
    if args.command == "reconstitution":
        result = calculate_reconstitution(args.mass, args.mass_unit, args.target, args.target_unit, args.molar_mass_da)
    elif args.command == "concentration":
        result = calculate_concentration(args.mass, args.mass_unit, args.volume, args.volume_unit, args.molar_mass_da)
    else:
        result = calculate_dilution(
            args.stock,
            args.stock_unit,
            args.target,
            args.target_unit,
            args.final_volume,
            args.final_volume_unit,
            args.molar_mass_da,
        )
    print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))
