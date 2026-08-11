export declare const AMINO_ACID_CODES: readonly ["A", "R", "N", "D", "C", "E", "Q", "G", "H", "I", "L", "K", "M", "F", "P", "S", "T", "W", "Y", "V"];
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
export declare const AMINO_ACIDS: Readonly<Record<AminoAcidCode, AminoAcidDefinition>>;
export declare function normalizeSequence(sequence: string): string;
export declare function calculateComposition(sequence: string): Record<AminoAcidCode, number>;
export declare function calculatePeptideFormula(sequence: string, modifications?: PeptideModification[]): PeptideFormula;
export declare function formatFormula(formula: PeptideFormula): string;
export declare function calculateModificationDeltaMass(modifications?: PeptideModification[]): number;
export declare function calculatePeptideMass(sequence: string, modifications?: PeptideModification[]): PeptideMass;
export declare function calculateNetCharge(sequence: string, pH?: number): number;
export declare function calculateIsoelectricPoint(sequence: string): number;
export declare function calculateHydropathy(sequence: string, windowSize?: number): HydropathyResult;
export declare function analyzePeptide(sequence: string, options?: PeptideAnalysisOptions): PeptideAnalysis;
//# sourceMappingURL=index.d.ts.map