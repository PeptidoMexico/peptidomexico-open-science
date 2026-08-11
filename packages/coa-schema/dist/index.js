import { Ajv2020 } from "ajv/dist/2020.js";
export const COA_SCHEMA = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://github.com/PeptidoMexico/peptidomexico-open-science/blob/main/packages/coa-schema/schema/coa.schema.json",
    title: "Research-material COA record",
    description: "A structural interchange format for research-use-only material records. Validation does not certify a result.",
    type: "object",
    additionalProperties: false,
    required: ["schemaVersion", "recordType", "material", "batch", "assays", "disclosure"],
    properties: {
        schemaVersion: { const: "0.1.0" },
        recordType: { const: "research-material-coa" },
        material: {
            type: "object",
            additionalProperties: false,
            required: ["name"],
            properties: {
                name: { type: "string", minLength: 1, maxLength: 160 },
                catalogId: { type: "string", minLength: 1, maxLength: 80 },
                sequence: { type: "string", pattern: "^[ACDEFGHIKLMNPQRSTVWY]+$" },
                nominalMassDa: { type: "number", exclusiveMinimum: 0 },
            },
        },
        batch: {
            type: "object",
            additionalProperties: false,
            required: ["lotId"],
            properties: {
                lotId: { type: "string", pattern: "^[A-Za-z0-9._-]{1,80}$" },
                manufacturedDate: { type: "string", pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" },
                issuedDate: { type: "string", pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" },
            },
        },
        assays: {
            type: "array",
            minItems: 1,
            items: {
                type: "object",
                additionalProperties: false,
                required: ["name", "result", "unit", "method"],
                properties: {
                    name: { type: "string", minLength: 1, maxLength: 120 },
                    result: {
                        oneOf: [
                            { type: "number" },
                            { type: "string", minLength: 1, maxLength: 120 },
                        ],
                    },
                    unit: { type: "string", minLength: 1, maxLength: 40 },
                    method: { type: "string", minLength: 1, maxLength: 200 },
                    status: { enum: ["reported", "pass", "fail", "not-determined"] },
                    notes: { type: "string", maxLength: 500 },
                },
            },
        },
        documents: {
            type: "array",
            items: {
                type: "object",
                additionalProperties: false,
                required: ["kind", "uri", "sha256"],
                properties: {
                    kind: { type: "string", minLength: 1, maxLength: 80 },
                    uri: { type: "string", pattern: "^https?://" },
                    sha256: { type: "string", pattern: "^[a-fA-F0-9]{64}$" },
                },
            },
        },
        disclosure: {
            type: "object",
            additionalProperties: false,
            required: ["purpose", "limitations"],
            properties: {
                purpose: { type: "string", minLength: 1, maxLength: 300 },
                limitations: { type: "string", minLength: 1, maxLength: 600 },
                source: { type: "string", maxLength: 200 },
            },
        },
    },
};
const validator = new Ajv2020({ allErrors: true, strict: true }).compile(COA_SCHEMA);
function mapError(error) {
    return {
        instancePath: error.instancePath,
        schemaPath: error.schemaPath,
        keyword: error.keyword,
        message: error.message,
        params: error.params,
    };
}
export function validateCoa(value) {
    const valid = validator(value);
    return {
        valid: Boolean(valid),
        errors: (validator.errors ?? []).map(mapError),
    };
}
export function assertValidCoa(value) {
    const result = validateCoa(value);
    if (!result.valid) {
        const details = result.errors
            .map((error) => `${error.instancePath || "/"} ${error.message ?? "is invalid"}`)
            .join("; ");
        throw new Error(`Invalid COA record: ${details}`);
    }
}
//# sourceMappingURL=index.js.map