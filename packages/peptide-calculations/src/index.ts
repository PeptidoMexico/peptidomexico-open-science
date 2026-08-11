export type MassUnit = "mg" | "µg";
export type VolumeUnit = "mL" | "µL";
export type ConcentrationUnit = "mg/mL" | "µg/mL" | "µg/µL" | "mM";

export interface ConcentrationInput {
  mass: number;
  massUnit: MassUnit;
  volume: number;
  volumeUnit: VolumeUnit;
  molarMassDa?: number | null;
}

export interface ReconstitutionInput {
  mass: number;
  massUnit: MassUnit;
  target: number;
  concentrationUnit: ConcentrationUnit;
  molarMassDa?: number | null;
}

export interface DilutionInput {
  stock: number;
  stockUnit: ConcentrationUnit;
  target: number;
  targetUnit: ConcentrationUnit;
  finalVolume: number;
  finalVolumeUnit: VolumeUnit;
  molarMassDa?: number | null;
}

export interface ConcentrationValues {
  "mg/mL": number;
  "µg/mL": number;
  "µg/µL": number;
  mM: number | null;
}

export interface ConcentrationCalculation {
  kind: "concentration";
  massMg: number;
  volumeMl: number;
  molarMassDa: number | null;
  concentrationMgPerMl: number;
  concentrations: ConcentrationValues;
}

export interface ReconstitutionCalculation {
  kind: "reconstitution";
  massMg: number;
  targetMgPerMl: number;
  target: number;
  concentrationUnit: ConcentrationUnit;
  molarMassDa: number | null;
  volumeMl: number;
}

export interface DilutionCalculation {
  kind: "dilution";
  stockMgPerMl: number;
  targetMgPerMl: number;
  finalVolumeMl: number;
  stockVolumeMl: number;
  diluentVolumeMl: number;
  dilutionFactor: number;
  molarMassDa: number | null;
}

function assertPositiveFinite(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(name + " must be a finite number greater than zero.");
  }
}

function normalizeMolarMass(molarMassDa: number | null | undefined): number | null {
  if (molarMassDa === null || molarMassDa === undefined) return null;
  assertPositiveFinite(molarMassDa, "molarMassDa");
  return molarMassDa;
}

function requireMolarMass(molarMassDa: number | null): number {
  if (molarMassDa === null) {
    throw new RangeError("molarMassDa is required when the concentration unit is mM.");
  }
  return molarMassDa;
}

export function normalizeMassToMg(value: number, unit: MassUnit): number {
  assertPositiveFinite(value, "mass");
  return unit === "mg" ? value : value / 1000;
}

export function normalizeVolumeToMl(value: number, unit: VolumeUnit): number {
  assertPositiveFinite(value, "volume");
  return unit === "mL" ? value : value / 1000;
}

/** Convert a concentration to the internal mg/mL representation. */
export function concentrationToMgPerMl(
  value: number,
  unit: ConcentrationUnit,
  molarMassDa: number | null,
): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  if (unit === "mg/mL" || unit === "µg/µL") return value;
  if (unit === "µg/mL") return value / 1000;
  if (molarMassDa === null || !Number.isFinite(molarMassDa) || molarMassDa <= 0) return null;
  return (value * molarMassDa) / 1000;
}

/** Convert an internal mg/mL concentration to the requested unit. */
export function mgPerMlToConcentration(
  mgPerMl: number,
  unit: ConcentrationUnit,
  molarMassDa: number | null,
): number | null {
  if (!Number.isFinite(mgPerMl) || mgPerMl <= 0) return null;
  if (unit === "mg/mL" || unit === "µg/µL") return mgPerMl;
  if (unit === "µg/mL") return mgPerMl * 1000;
  if (molarMassDa === null || !Number.isFinite(molarMassDa) || molarMassDa <= 0) return null;
  return (mgPerMl / molarMassDa) * 1000;
}

export function parseMolarMassDa(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const numeric = value.trim().replace(/\s+/g, "").replace(/[^0-9,.-]/g, "");
  const commaIndex = numeric.lastIndexOf(",");
  const dotIndex = numeric.lastIndexOf(".");
  let normalized = numeric;

  if (commaIndex >= 0 && dotIndex >= 0) {
    const decimalSeparator = commaIndex > dotIndex ? "," : ".";
    const groupingSeparator = decimalSeparator === "," ? "." : ",";
    normalized = numeric.replaceAll(groupingSeparator, "").replace(decimalSeparator, ".");
  } else if (commaIndex >= 0) {
    normalized = numeric.replace(",", ".");
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function getConcentrationValues(mgPerMl: number, molarMassDa: number | null): ConcentrationValues {
  return {
    "mg/mL": mgPerMl,
    "µg/mL": mgPerMl * 1000,
    "µg/µL": mgPerMl,
    mM: mgPerMlToConcentration(mgPerMl, "mM", molarMassDa),
  };
}

export function calculateConcentration(input: ConcentrationInput): ConcentrationCalculation {
  const massMg = normalizeMassToMg(input.mass, input.massUnit);
  const volumeMl = normalizeVolumeToMl(input.volume, input.volumeUnit);
  const molarMassDa = normalizeMolarMass(input.molarMassDa);
  const concentrationMgPerMl = massMg / volumeMl;

  return {
    kind: "concentration",
    massMg,
    volumeMl,
    molarMassDa,
    concentrationMgPerMl,
    concentrations: getConcentrationValues(concentrationMgPerMl, molarMassDa),
  };
}

export function calculateReconstitution(input: ReconstitutionInput): ReconstitutionCalculation {
  const massMg = normalizeMassToMg(input.mass, input.massUnit);
  const molarMassDa = normalizeMolarMass(input.molarMassDa);
  const targetMgPerMl = concentrationToMgPerMl(input.target, input.concentrationUnit, molarMassDa);

  if (targetMgPerMl === null) {
    if (input.concentrationUnit === "mM") requireMolarMass(molarMassDa);
    throw new RangeError("target must be a finite number greater than zero.");
  }

  return {
    kind: "reconstitution",
    massMg,
    targetMgPerMl,
    target: input.target,
    concentrationUnit: input.concentrationUnit,
    molarMassDa,
    volumeMl: massMg / targetMgPerMl,
  };
}

export function calculateDilution(input: DilutionInput): DilutionCalculation {
  const molarMassDa = normalizeMolarMass(input.molarMassDa);
  const stockMgPerMl = concentrationToMgPerMl(input.stock, input.stockUnit, molarMassDa);
  const targetMgPerMl = concentrationToMgPerMl(input.target, input.targetUnit, molarMassDa);

  if (stockMgPerMl === null || targetMgPerMl === null) {
    if (input.stockUnit === "mM" || input.targetUnit === "mM") requireMolarMass(molarMassDa);
    throw new RangeError("stock and target concentrations must be finite numbers greater than zero.");
  }
  if (targetMgPerMl >= stockMgPerMl) {
    throw new RangeError("target concentration must be lower than stock concentration.");
  }

  const finalVolumeMl = normalizeVolumeToMl(input.finalVolume, input.finalVolumeUnit);
  const stockVolumeMl = (targetMgPerMl * finalVolumeMl) / stockMgPerMl;

  return {
    kind: "dilution",
    stockMgPerMl,
    targetMgPerMl,
    finalVolumeMl,
    stockVolumeMl,
    diluentVolumeMl: finalVolumeMl - stockVolumeMl,
    dilutionFactor: stockMgPerMl / targetMgPerMl,
    molarMassDa,
  };
}
