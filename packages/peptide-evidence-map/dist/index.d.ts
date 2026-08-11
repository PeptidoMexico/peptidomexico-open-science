export declare const EVIDENCE_TIERS: readonly ["unspecified", "review", "mechanistic", "in-vitro", "in-vivo", "observational", "clinical"];
export type EvidenceTier = (typeof EVIDENCE_TIERS)[number];
export type IdentifierType = "doi" | "pmid" | "pmcid" | "url" | "local";
export interface IdentifierInput {
    type?: IdentifierType;
    value: string;
}
export interface EvidenceInputRecord {
    id?: string;
    identifier: string | IdentifierInput;
    title?: string;
    year?: number;
    evidenceTier?: EvidenceTier;
    tags?: string[];
    source?: string;
    notes?: string;
    synthetic?: boolean;
}
export interface NormalizedIdentifier {
    type: IdentifierType;
    value: string;
    key: string;
}
export interface NormalizedEvidenceRecord {
    id: string;
    identifier: NormalizedIdentifier;
    title?: string;
    year?: number;
    evidenceTier: EvidenceTier;
    tags: string[];
    source?: string;
    notes?: string;
    synthetic: boolean;
}
export interface EvidenceMapOptions {
    searchDate?: string;
    source?: string;
    generatedAt?: string;
}
export interface EvidenceMap {
    schemaVersion: "0.1.0";
    records: NormalizedEvidenceRecord[];
    duplicateGroups: Array<{
        key: string;
        recordIds: string[];
    }>;
    summary: {
        inputRecords: number;
        uniqueRecords: number;
        duplicateRecords: number;
        byIdentifierType: Partial<Record<IdentifierType, number>>;
        byEvidenceTier: Partial<Record<EvidenceTier, number>>;
    };
    provenance: {
        searchDate?: string;
        source?: string;
        generatedAt?: string;
        inputSha256: string;
        tool: "peptide-evidence-map@0.1.0";
        limits: string;
    };
}
export declare function normalizeIdentifier(input: string | IdentifierInput): NormalizedIdentifier;
export declare function ingestEvidence(records: EvidenceInputRecord[], options?: EvidenceMapOptions): EvidenceMap;
export declare function parseEvidenceCsv(csv: string): EvidenceInputRecord[];
//# sourceMappingURL=index.d.ts.map