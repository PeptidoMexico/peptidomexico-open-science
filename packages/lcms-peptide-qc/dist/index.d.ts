export declare const PROTON_MASS_DA = 1.007276466621;
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
export declare function calculateMz({ neutralMassDa, charge }: MzCalculationInput): number;
export declare function calculateNeutralMass({ observedMz, charge }: {
    observedMz: number;
    charge: number;
}): number;
export declare function calculatePpmError(observedMz: number, theoreticalMz: number): number;
export declare function analyzeMzObservation(input: MzObservationInput): MzObservationResult;
export declare function calculateChargeStates(neutralMassDa: number, maxCharge?: number): ChargeStateResult[];
export declare function analyzeCsvObservations(csv: string): MzObservationResult[];
//# sourceMappingURL=index.d.ts.map