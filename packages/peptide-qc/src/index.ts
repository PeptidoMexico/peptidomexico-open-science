export const AMINO_ACID_CODES = [
  "A", "R", "N", "D", "C", "E", "Q", "G", "H", "I",
  "L", "K", "M", "F", "P", "S", "T", "W", "Y", "V",
] as const;

export type AminoAcidCode = (typeof AMINO_ACID_CODES)[number];
export type Element = "C" | "H" | "N" | "O" | "S";
export type PeptideFormula = Record<Element, number>;
export type MassMode = "monoisotopic" | "average";

export interface AminoAcidDefinition {
  code: AminoAcidCode;
  threeLetter: string;
  name: string;
  residueFormula: PeptideFormula;
  kyteDoolittle: number;
}

export interface PeptideModification {
  name: string;
  /** Used when no elemental delta formula is supplied. */
  deltaMassDa?: number;
  /** Optional elemental delta. If supplied, its calculated mass is used. */
  deltaFormula?: Partial<PeptideFormula>;
}

export interface PeptideMass {
  formula: PeptideFormula;
  formulaText: string;
  monoisotopicDa: number;
  averageDa: number;
  modificationDeltaMassDa: number;
}

export interface HydropathyResult {
  scale: "Kyte-Doolittle";
  windowSize: number;
  residueValues: number[];
  windowedValues: number[];
  mean: number;
  minimum: number;
  maximum: number;
}

export interface PeptideAnalysisOptions {
  modifications?: PeptideModification[];
  pH?: number;
  hydropathyWindowSize?: number;
}

export interface PeptideAnalysis {
  sequence: string;
  length: number;
  composition: Record<AminoAcidCode, number>;
  formula: PeptideFormula;
  formulaText: string;
  mass: PeptideMass;
  charge: {
    pH: number;
    netCharge: number;
  };
  isoelectricPoint: number;
  hydropathy: HydropathyResult;
}

const WATER: PeptideFormula = { C: 0, H: 2, N: 0, O: 1, S: 0 };
const ELEMENTS: Element[] = ["C", "H", "N", "O", "S"];

export const AMINO_ACIDS: Readonly<Record<AminoAcidCode, AminoAcidDefinition>> = {
  A: { code: "A", threeLetter: "Ala", name: "alanine", residueFormula: { C: 3, H: 5, N: 1, O: 1, S: 0 }, kyteDoolittle: 1.8 },
  R: { code: "R", threeLetter: "Arg", name: "arginine", residueFormula: { C: 6, H: 12, N: 4, O: 1, S: 0 }, kyteDoolittle: -4.5 },
  N: { code: "N", threeLetter: "Asn", name: "asparagine", residueFormula: { C: 4, H: 6, N: 2, O: 2, S: 0 }, kyteDoolittle: -3.5 },
  D: { code: "D", threeLetter: "Asp", name: "aspartic acid", residueFormula: { C: 4, H: 5, N: 1, O: 3, S: 0 }, kyteDoolittle: -3.5 },
  C: { code: "C", threeLetter: "Cys", name: "cysteine", residueFormula: { C: 3, H: 5, N: 1, O: 1, S: 1 }, kyteDoolittle: 2.5 },
  E: { code: "E", threeLetter: "Glu", name: "glutamic acid", residueFormula: { C: 5, H: 7, N: 1, O: 3, S: 0 }, kyteDoolittle: -3.5 },
  Q: { code: "Q", threeLetter: "Gln", name: "glutamine", residueFormula: { C: 5, H: 8, N: 2, O: 2, S: 0 }, kyteDoolittle: -3.5 },
  G: { code: "G", threeLetter: "Gly", name: "glycine", residueFormula: { C: 2, H: 3, N: 1, O: 1, S: 0 }, kyteDoolittle: -0.4 },
  H: { code: "H", threeLetter: "His", name: "histidine", residueFormula: { C: 6, H: 7, N: 3, O: 1, S: 0 }, kyteDoolittle: -3.2 },
  I: { code: "I", threeLetter: "Ile", name: "isoleucine", residueFormula: { C: 6, H: 11, N: 1, O: 1, S: 0 }, kyteDoolittle: 4.5 },
  L: { code: "L", threeLetter: "Leu", name: "leucine", residueFormula: { C: 6, H: 11, N: 1, O: 1, S: 0 }, kyteDoolittle: 3.8 },
  K: { code: "K", threeLetter: "Lys", name: "lysine", residueFormula: { C: 6, H: 12, N: 2, O: 1, S: 0 }, kyteDoolittle: -3.9 },
  M: { code: "M", threeLetter: "Met", name: "methionine", residueFormula: { C: 5, H: 9, N: 1, O: 1, S: 1 }, kyteDoolittle: 1.9 },
  F: { code: "F", threeLetter: "Phe", name: "phenylalanine", residueFormula: { C: 9, H: 9, N: 1, O: 1, S: 0 }, kyteDoolittle: 2.8 },
  P: { code: "P", threeLetter: "Pro", name: "proline", residueFormula: { C: 5, H: 7, N: 1, O: 1, S: 0 }, kyteDoolittle: -1.6 },
  S: { code: "S", threeLetter: "Ser", name: "serine", residueFormula: { C: 3, H: 5, N: 1, O: 2, S: 0 }, kyteDoolittle: -0.8 },
  T: { code: "T", threeLetter: "Thr", name: "threonine", residueFormula: { C: 4, H: 7, N: 1, O: 2, S: 0 }, kyteDoolittle: -0.7 },
  W: { code: "W", threeLetter: "Trp", name: "tryptophan", residueFormula: { C: 11, H: 10, N: 2, O: 1, S: 0 }, kyteDoolittle: -0.9 },
  Y: { code: "Y", threeLetter: "Tyr", name: "tyrosine", residueFormula: { C: 9, H: 9, N: 1, O: 2, S: 0 }, kyteDoolittle: -1.3 },
  V: { code: "V", threeLetter: "Val", name: "valine", residueFormula: { C: 5, H: 9, N: 1, O: 1, S: 0 }, kyteDoolittle: 4.2 },
};

const MONOISOTOPIC_ATOMIC_MASS: Record<Element, number> = {
  C: 12,
  H: 1.00782503223,
  N: 14.00307400443,
  O: 15.99491461957,
  S: 31.9720711744,
};

const AVERAGE_ATOMIC_MASS: Record<Element, number> = {
  C: 12.0107,
  H: 1.00794,
  N: 14.0067,
  O: 15.9994,
  S: 32.065,
};

const POSITIVE_PKA = { N_TERMINUS: 8.6, K: 10.5, R: 12.5, H: 6.0 } as const;
const NEGATIVE_PKA = { C_TERMINUS: 3.6, D: 3.9, E: 4.1, C: 8.3, Y: 10.1 } as const;

function assertFinite(value: number, name: string): void {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite.`);
}

function addFormula(target: PeptideFormula, source: Partial<PeptideFormula>, multiplier = 1): void {
  for (const element of ELEMENTS) {
    const value = source[element] ?? 0;
    target[element] += value * multiplier;
  }
}

function validateModification(modification: PeptideModification): void {
  if (!modification.name.trim()) throw new RangeError("Modification name must not be empty.");
  if (modification.deltaFormula === undefined && modification.deltaMassDa === undefined) {
    throw new RangeError(`Modification ${modification.name} needs deltaMassDa or deltaFormula.`);
  }
  if (modification.deltaMassDa !== undefined) {
    assertFinite(modification.deltaMassDa, `${modification.name}.deltaMassDa`);
  }
  if (modification.deltaFormula !== undefined) {
    for (const element of ELEMENTS) {
      const value = modification.deltaFormula[element] ?? 0;
      if (!Number.isInteger(value)) {
        throw new RangeError(`${modification.name}.deltaFormula values must be integers.`);
      }
    }
  }
}

function validateModifications(modifications: PeptideModification[]): void {
  modifications.forEach(validateModification);
}

function modificationDeltaMass(modification: PeptideModification): number {
  if (modification.deltaFormula !== undefined) return formulaMass(modification.deltaFormula, "monoisotopic");
  return modification.deltaMassDa ?? 0;
}

function formulaMass(formula: Partial<PeptideFormula>, mode: MassMode): number {
  const atomicMass = mode === "monoisotopic" ? MONOISOTOPIC_ATOMIC_MASS : AVERAGE_ATOMIC_MASS;
  return ELEMENTS.reduce((sum, element) => sum + (formula[element] ?? 0) * atomicMass[element], 0);
}

export function normalizeSequence(sequence: string): string {
  if (typeof sequence !== "string") throw new TypeError("sequence must be a string.");
  const normalized = sequence.replace(/[\s-]+/g, "").toUpperCase();
  if (normalized.length === 0) throw new RangeError("sequence must contain at least one standard amino acid.");

  const unsupported = [...new Set([...normalized].filter((code) => !(code in AMINO_ACIDS)))];
  if (unsupported.length > 0) {
    throw new RangeError(`Unsupported residue code(s): ${unsupported.join(", ")}. Use the standard 20 amino-acid codes.`);
  }
  return normalized;
}

export function calculateComposition(sequence: string): Record<AminoAcidCode, number> {
  const normalized = normalizeSequence(sequence);
  const composition = Object.fromEntries(AMINO_ACID_CODES.map((code) => [code, 0])) as Record<AminoAcidCode, number>;
  for (const code of normalized) composition[code as AminoAcidCode] += 1;
  return composition;
}

export function calculatePeptideFormula(
  sequence: string,
  modifications: PeptideModification[] = [],
): PeptideFormula {
  const normalized = normalizeSequence(sequence);
  validateModifications(modifications);
  const formula: PeptideFormula = { C: 0, H: 0, N: 0, O: 0, S: 0 };
  for (const code of normalized) addFormula(formula, AMINO_ACIDS[code as AminoAcidCode].residueFormula);
  addFormula(formula, WATER);
  for (const modification of modifications) {
    if (modification.deltaFormula !== undefined) addFormula(formula, modification.deltaFormula);
  }
  for (const element of ELEMENTS) {
    if (formula[element] < 0) throw new RangeError(`Calculated formula has a negative ${element} count.`);
  }
  return formula;
}

export function formatFormula(formula: PeptideFormula): string {
  return ELEMENTS
    .filter((element) => formula[element] !== 0)
    .map((element) => `${element}${formula[element] === 1 ? "" : formula[element]}`)
    .join("") || "1";
}

export function calculateModificationDeltaMass(modifications: PeptideModification[] = []): number {
  validateModifications(modifications);
  return modifications.reduce((sum, modification) => sum + modificationDeltaMass(modification), 0);
}

export function calculatePeptideMass(
  sequence: string,
  modifications: PeptideModification[] = [],
): PeptideMass {
  const formula = calculatePeptideFormula(sequence, modifications);
  const formulaModificationMass = modifications
    .filter((modification) => modification.deltaFormula !== undefined)
    .reduce((sum, modification) => sum + modificationDeltaMass(modification), 0);
  const explicitModificationMass = modifications
    .filter((modification) => modification.deltaFormula === undefined)
    .reduce((sum, modification) => sum + (modification.deltaMassDa ?? 0), 0);

  return {
    formula,
    formulaText: formatFormula(formula),
    monoisotopicDa: formulaMass(formula, "monoisotopic") + explicitModificationMass,
    averageDa: formulaMass(formula, "average") + explicitModificationMass,
    modificationDeltaMassDa: formulaModificationMass + explicitModificationMass,
  };
}

function fractionProtonatedBase(pH: number, pKa: number): number {
  return 1 / (1 + 10 ** (pH - pKa));
}

function fractionDeprotonatedAcid(pH: number, pKa: number): number {
  return 1 / (1 + 10 ** (pKa - pH));
}

export function calculateNetCharge(sequence: string, pH = 7): number {
  const normalized = normalizeSequence(sequence);
  assertFinite(pH, "pH");
  if (pH < 0 || pH > 14) throw new RangeError("pH must be between 0 and 14 for this approximation.");
  const composition = calculateComposition(normalized);
  let positive = fractionProtonatedBase(pH, POSITIVE_PKA.N_TERMINUS);
  positive += composition.K * fractionProtonatedBase(pH, POSITIVE_PKA.K);
  positive += composition.R * fractionProtonatedBase(pH, POSITIVE_PKA.R);
  positive += composition.H * fractionProtonatedBase(pH, POSITIVE_PKA.H);

  let negative = fractionDeprotonatedAcid(pH, NEGATIVE_PKA.C_TERMINUS);
  negative += composition.D * fractionDeprotonatedAcid(pH, NEGATIVE_PKA.D);
  negative += composition.E * fractionDeprotonatedAcid(pH, NEGATIVE_PKA.E);
  negative += composition.C * fractionDeprotonatedAcid(pH, NEGATIVE_PKA.C);
  negative += composition.Y * fractionDeprotonatedAcid(pH, NEGATIVE_PKA.Y);
  return positive - negative;
}

export function calculateIsoelectricPoint(sequence: string): number {
  normalizeSequence(sequence);
  let low = 0;
  let high = 14;
  for (let iteration = 0; iteration < 80; iteration += 1) {
    const midpoint = (low + high) / 2;
    if (calculateNetCharge(sequence, midpoint) > 0) low = midpoint;
    else high = midpoint;
  }
  return (low + high) / 2;
}

export function calculateHydropathy(sequence: string, windowSize = 7): HydropathyResult {
  const normalized = normalizeSequence(sequence);
  if (!Number.isInteger(windowSize) || windowSize < 1) {
    throw new RangeError("windowSize must be a positive integer.");
  }
  const effectiveWindow = Math.min(windowSize, normalized.length);
  const residueValues = [...normalized].map((code) => AMINO_ACIDS[code as AminoAcidCode].kyteDoolittle);
  const windowedValues = residueValues.map((_, index) => {
    const half = Math.floor(effectiveWindow / 2);
    let start = Math.max(0, index - half);
    let end = start + effectiveWindow;
    if (end > residueValues.length) {
      end = residueValues.length;
      start = Math.max(0, end - effectiveWindow);
    }
    const values = residueValues.slice(start, end);
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  });
  const mean = residueValues.reduce((sum, value) => sum + value, 0) / residueValues.length;
  return {
    scale: "Kyte-Doolittle",
    windowSize: effectiveWindow,
    residueValues,
    windowedValues,
    mean,
    minimum: Math.min(...residueValues),
    maximum: Math.max(...residueValues),
  };
}

export function analyzePeptide(sequence: string, options: PeptideAnalysisOptions = {}): PeptideAnalysis {
  const normalized = normalizeSequence(sequence);
  const modifications = options.modifications ?? [];
  const pH = options.pH ?? 7;
  const mass = calculatePeptideMass(normalized, modifications);
  const hydropathy = calculateHydropathy(normalized, options.hydropathyWindowSize ?? 7);
  return {
    sequence: normalized,
    length: normalized.length,
    composition: calculateComposition(normalized),
    formula: mass.formula,
    formulaText: mass.formulaText,
    mass,
    charge: { pH, netCharge: calculateNetCharge(normalized, pH) },
    isoelectricPoint: calculateIsoelectricPoint(normalized),
    hydropathy,
  };
}
