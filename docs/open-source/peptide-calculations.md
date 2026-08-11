# `peptide-calculations`

## Purpose

This package turns explicit mass, volume, concentration and molecular-mass inputs
into deterministic laboratory calculations. The API is unit-aware so a value such
as `500 µg` is not silently treated as `500 mg`.

## Install and test

```bash
cd packages/peptide-calculations
npm ci
npm test
```

## Reconstitution example

```ts
import { calculateReconstitution } from "peptide-calculations";

const result = calculateReconstitution({
  mass: 10,
  massUnit: "mg",
  target: 5,
  concentrationUnit: "mg/mL",
});

console.log(result.volumeMl); // 2
```

The underlying relationship is:

`volume (mL) = mass (mg) ÷ concentration (mg/mL)`

The package also exposes concentration, dilution and unit-conversion helpers. mM
requires a molecular mass in daltons; the package never invents that value.

## CLI

```bash
npx peptide-calculations reconstitution \
  --mass 10 --mass-unit mg --target 5 --target-unit mg/mL --json
```

The CLI has no network access and emits deterministic JSON for the supplied input.

## Limits

The output is a mathematical result, not a validated protocol. It does not select
the compound, solvent, container, route, dose or administration method. Confirm
units, material identity, laboratory method and device markings independently.
