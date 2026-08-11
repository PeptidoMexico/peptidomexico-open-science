export const PROTON_MASS_DA = 1.007276466621;

export interface MzCalculationInput {
  neutralMassDa: number;
  charge: number;
}

export interface MzObservationInput extends MzCalculationInput {
  observedMz: number;
  id?: string;
}

export interface MzObservationResult {
  id?: string;
  neutralMassDa: number;
  charge: number;
  theoreticalMz: number;
  observedMz: number;
  signedPpmError: number;
  absolutePpmError: number;
}

export interface ChargeStateResult {
  charge: number;
  theoreticalMz: number;
}

function assertPositiveFinite(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be greater than zero.`);
}

function assertCharge(charge: number): void {
  if (!Number.isInteger(charge) || charge < 1 || charge > 100) {
    throw new RangeError("charge must be an integer between 1 and 100 for this positive-mode model.");
  }
}

export function calculateMz({ neutralMassDa, charge }: MzCalculationInput): number {
  assertPositiveFinite(neutralMassDa, "neutralMassDa");
  assertCharge(charge);
  return (neutralMassDa + charge * PROTON_MASS_DA) / charge;
}

export function calculateNeutralMass({ observedMz, charge }: { observedMz: number; charge: number }): number {
  assertPositiveFinite(observedMz, "observedMz");
  assertCharge(charge);
  return observedMz * charge - charge * PROTON_MASS_DA;
}

export function calculatePpmError(observedMz: number, theoreticalMz: number): number {
  assertPositiveFinite(observedMz, "observedMz");
  assertPositiveFinite(theoreticalMz, "theoreticalMz");
  return ((observedMz - theoreticalMz) / theoreticalMz) * 1_000_000;
}

export function analyzeMzObservation(input: MzObservationInput): MzObservationResult {
  const theoreticalMz = calculateMz(input);
  const signedPpmError = calculatePpmError(input.observedMz, theoreticalMz);
  return {
    ...(input.id === undefined ? {} : { id: input.id }),
    neutralMassDa: input.neutralMassDa,
    charge: input.charge,
    theoreticalMz,
    observedMz: input.observedMz,
    signedPpmError,
    absolutePpmError: Math.abs(signedPpmError),
  };
}

export function calculateChargeStates(neutralMassDa: number, maxCharge = 5): ChargeStateResult[] {
  assertPositiveFinite(neutralMassDa, "neutralMassDa");
  if (!Number.isInteger(maxCharge) || maxCharge < 1 || maxCharge > 100) {
    throw new RangeError("maxCharge must be an integer between 1 and 100.");
  }
  return Array.from({ length: maxCharge }, (_, index) => {
    const charge = index + 1;
    return { charge, theoreticalMz: calculateMz({ neutralMassDa, charge }) };
  });
}

function parseCsvLine(line: string, lineNumber: number): string[] {
  const fields = line.split(",").map((field) => field.trim());
  if (fields.some((field) => field.includes('"'))) {
    throw new Error(`CSV line ${lineNumber} contains quotes; use the simple unquoted fixture format.`);
  }
  return fields;
}

export function analyzeCsvObservations(csv: string): MzObservationResult[] {
  const lines = csv.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error("CSV must include a header and at least one observation.");
  const header = parseCsvLine(lines[0], 1);
  const expectedHeader = ["id", "neutralMassDa", "charge", "observedMz"];
  if (header.length !== expectedHeader.length || header.some((value, index) => value !== expectedHeader[index])) {
    throw new Error(`CSV header must be exactly: ${expectedHeader.join(",")}.`);
  }

  return lines.slice(1).map((line, index) => {
    const lineNumber = index + 2;
    const fields = parseCsvLine(line, lineNumber);
    if (fields.length !== expectedHeader.length) throw new Error(`CSV line ${lineNumber} has the wrong number of fields.`);
    const neutralMassDa = Number(fields[1]);
    const charge = Number(fields[2]);
    const observedMz = Number(fields[3]);
    if (![neutralMassDa, charge, observedMz].every(Number.isFinite)) {
      throw new Error(`CSV line ${lineNumber} contains a non-numeric value.`);
    }
    return analyzeMzObservation({
      id: fields[0] || undefined,
      neutralMassDa,
      charge,
      observedMz,
    });
  });
}
