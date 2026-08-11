import { type AnySchema } from "ajv";
export interface CoaValidationError {
    instancePath: string;
    schemaPath: string;
    keyword: string;
    message?: string;
    params: Record<string, unknown>;
}
export interface CoaValidationResult {
    valid: boolean;
    errors: CoaValidationError[];
}
export declare const COA_SCHEMA: AnySchema;
export declare function validateCoa(value: unknown): CoaValidationResult;
export declare function assertValidCoa(value: unknown): void;
//# sourceMappingURL=index.d.ts.map