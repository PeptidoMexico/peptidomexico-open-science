import { createHash } from "node:crypto";
export const EVIDENCE_TIERS = [
    "unspecified",
    "review",
    "mechanistic",
    "in-vitro",
    "in-vivo",
    "observational",
    "clinical",
];
const DOI_PREFIX = /^(?:https?:\/\/)?(?:dx\.)?doi\.org\//i;
const DOI_LABEL = /^doi:\s*/i;
const PMID_URL = /^https?:\/\/(?:www\.)?pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)\/?(?:\?.*)?$/i;
const PMCID_URL = /^https?:\/\/(?:www\.)?ncbi\.nlm\.nih\.gov\/pmc\/articles\/(PMC\d+)\/?(?:\?.*)?$/i;
function cleanText(value, field) {
    if (typeof value !== "string")
        throw new TypeError(`${field} must be a string.`);
    const cleaned = value.trim();
    if (!cleaned)
        throw new RangeError(`${field} must not be empty.`);
    return cleaned;
}
function validateYear(year) {
    if (year === undefined)
        return undefined;
    if (!Number.isInteger(year) || year < 1800 || year > 2100) {
        throw new RangeError("year must be an integer between 1800 and 2100.");
    }
    return year;
}
function validateDate(value, field) {
    if (value === undefined)
        return undefined;
    const cleaned = cleanText(value, field);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cleaned))
        throw new RangeError(`${field} must use YYYY-MM-DD.`);
    const parsed = new Date(`${cleaned}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== cleaned) {
        throw new RangeError(`${field} must be a valid calendar date.`);
    }
    return cleaned;
}
function normalizeUrl(value) {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol))
        throw new RangeError("URL identifiers must use http or https.");
    url.hash = "";
    url.search = "";
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url.toString();
}
function normalizeDoi(value) {
    return cleanText(value, "DOI")
        .replace(DOI_PREFIX, "")
        .replace(DOI_LABEL, "")
        .replace(/[.,;]+$/, "")
        .toLowerCase();
}
function normalizeIdentifierValue(input) {
    const raw = typeof input === "string" ? input : input.value;
    const value = cleanText(raw, "identifier");
    const explicitType = typeof input === "string" ? undefined : input.type;
    if (explicitType === "doi") {
        const normalized = normalizeDoi(value);
        if (!/^10\.\d{4,9}\/\S+$/.test(normalized))
            throw new RangeError("Invalid DOI identifier.");
        return { type: "doi", value: normalized, key: `doi:${normalized}` };
    }
    if (explicitType === "pmid") {
        const normalized = value.replace(/^pmid:/i, "");
        if (!/^\d+$/.test(normalized))
            throw new RangeError("PMID identifiers must contain digits only.");
        return { type: "pmid", value: normalized, key: `pmid:${normalized}` };
    }
    if (explicitType === "pmcid") {
        const normalized = value.replace(/^pmc:/i, "").toUpperCase();
        if (!/^PMC\d+$/.test(normalized))
            throw new RangeError("PMCID identifiers must use the PMC123 format.");
        return { type: "pmcid", value: normalized, key: `pmcid:${normalized}` };
    }
    if (explicitType === "url") {
        const normalized = normalizeUrl(value);
        return { type: "url", value: normalized, key: `url:${normalized}` };
    }
    if (explicitType === "local") {
        const normalized = value.replace(/\s+/g, " ");
        return { type: "local", value: normalized, key: `local:${normalized}` };
    }
    const pmidMatch = value.match(PMID_URL);
    if (pmidMatch)
        return { type: "pmid", value: pmidMatch[1], key: `pmid:${pmidMatch[1]}` };
    const pmcidMatch = value.match(PMCID_URL);
    if (pmcidMatch) {
        const normalized = pmcidMatch[1].toUpperCase();
        return { type: "pmcid", value: normalized, key: `pmcid:${normalized}` };
    }
    if (/^(?:pmid:)?\d+$/i.test(value)) {
        const normalized = value.replace(/^pmid:/i, "");
        return { type: "pmid", value: normalized, key: `pmid:${normalized}` };
    }
    if (/^(?:pmc:)?PMC\d+$/i.test(value)) {
        const normalized = value.replace(/^pmc:/i, "").toUpperCase();
        return { type: "pmcid", value: normalized, key: `pmcid:${normalized}` };
    }
    if (DOI_PREFIX.test(value) || DOI_LABEL.test(value) || /^10\.\d{4,9}\//.test(value)) {
        const normalized = normalizeDoi(value);
        if (!/^10\.\d{4,9}\/\S+$/.test(normalized))
            throw new RangeError("Invalid DOI identifier.");
        return { type: "doi", value: normalized, key: `doi:${normalized}` };
    }
    if (/^https?:\/\//i.test(value)) {
        const normalized = normalizeUrl(value);
        return { type: "url", value: normalized, key: `url:${normalized}` };
    }
    return { type: "local", value: value.replace(/\s+/g, " "), key: `local:${value.replace(/\s+/g, " ")}` };
}
export function normalizeIdentifier(input) {
    return normalizeIdentifierValue(input);
}
function stableValue(value) {
    if (Array.isArray(value))
        return value.map(stableValue);
    if (value && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, entry]) => [key, stableValue(entry)]));
    }
    return value;
}
function stableJson(value) {
    return JSON.stringify(stableValue(value));
}
function hashRecords(records) {
    return createHash("sha256").update(stableJson(records)).digest("hex");
}
function normalizeRecord(record, index, options) {
    const identifier = normalizeIdentifierValue(record.identifier);
    const id = cleanText(record.id ?? `record-${String(index + 1).padStart(4, "0")}`, "id");
    const evidenceTier = record.evidenceTier ?? "unspecified";
    if (!EVIDENCE_TIERS.includes(evidenceTier))
        throw new RangeError(`Unsupported evidenceTier: ${evidenceTier}.`);
    const tags = [...new Set((record.tags ?? []).map((tag) => cleanText(tag, "tag").toLowerCase()))].sort();
    const title = record.title === undefined ? undefined : cleanText(record.title, "title");
    const source = record.source === undefined ? options.source : cleanText(record.source, "source");
    const notes = record.notes === undefined ? undefined : cleanText(record.notes, "notes");
    return {
        id,
        identifier,
        ...(title === undefined ? {} : { title }),
        ...(validateYear(record.year) === undefined ? {} : { year: record.year }),
        evidenceTier,
        tags,
        ...(source === undefined ? {} : { source }),
        ...(notes === undefined ? {} : { notes }),
        synthetic: record.synthetic ?? false,
    };
}
export function ingestEvidence(records, options = {}) {
    if (!Array.isArray(records) || records.length === 0)
        throw new RangeError("records must contain at least one record.");
    const searchDate = validateDate(options.searchDate, "searchDate");
    const generatedAt = options.generatedAt === undefined ? undefined : cleanText(options.generatedAt, "generatedAt");
    const normalized = records.map((record, index) => normalizeRecord(record, index, options));
    const groups = new Map();
    for (const record of normalized)
        groups.set(record.identifier.key, [...(groups.get(record.identifier.key) ?? []), record.id]);
    const duplicateGroups = [...groups.entries()]
        .filter(([, recordIds]) => recordIds.length > 1)
        .map(([key, recordIds]) => ({ key, recordIds }));
    const uniqueRecords = normalized.filter((record, index) => normalized.findIndex((candidate) => candidate.identifier.key === record.identifier.key) === index);
    const byIdentifierType = {};
    const byEvidenceTier = {};
    for (const record of uniqueRecords) {
        byIdentifierType[record.identifier.type] = (byIdentifierType[record.identifier.type] ?? 0) + 1;
        byEvidenceTier[record.evidenceTier] = (byEvidenceTier[record.evidenceTier] ?? 0) + 1;
    }
    return {
        schemaVersion: "0.1.0",
        records: uniqueRecords,
        duplicateGroups,
        summary: {
            inputRecords: normalized.length,
            uniqueRecords: uniqueRecords.length,
            duplicateRecords: normalized.length - uniqueRecords.length,
            byIdentifierType,
            byEvidenceTier,
        },
        provenance: {
            ...(searchDate === undefined ? {} : { searchDate }),
            ...(options.source === undefined ? {} : { source: cleanText(options.source, "source") }),
            ...(generatedAt === undefined ? {} : { generatedAt }),
            inputSha256: hashRecords(normalized),
            tool: "peptide-evidence-map@0.1.0",
            limits: "This tool normalizes user-supplied identifiers and labels; it does not retrieve, validate, rank or interpret literature evidence.",
        },
    };
}
function parseCsvLine(line, lineNumber) {
    const fields = [];
    let field = "";
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
        const character = line[index];
        if (character === '"') {
            if (quoted && line[index + 1] === '"') {
                field += '"';
                index += 1;
            }
            else {
                quoted = !quoted;
            }
        }
        else if (character === "," && !quoted) {
            fields.push(field.trim());
            field = "";
        }
        else {
            field += character;
        }
    }
    if (quoted)
        throw new Error(`CSV line ${lineNumber} has an unterminated quoted field.`);
    fields.push(field.trim());
    return fields;
}
export function parseEvidenceCsv(csv) {
    const lines = csv.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length < 2)
        throw new Error("CSV must include a header and at least one record.");
    const header = parseCsvLine(lines[0], 1);
    const expected = ["id", "identifierType", "identifier", "title", "year", "evidenceTier", "tags", "source", "notes", "synthetic"];
    if (header.length !== expected.length || header.some((value, index) => value !== expected[index])) {
        throw new Error(`CSV header must be exactly: ${expected.join(",")}.`);
    }
    return lines.slice(1).map((line, index) => {
        const fields = parseCsvLine(line, index + 2);
        if (fields.length !== expected.length)
            throw new Error(`CSV line ${index + 2} has the wrong number of fields.`);
        const year = fields[4] ? Number(fields[4]) : undefined;
        if (fields[4] && !Number.isInteger(year))
            throw new Error(`CSV line ${index + 2} has an invalid year.`);
        return {
            ...(fields[0] ? { id: fields[0] } : {}),
            identifier: { type: (fields[1] || undefined), value: fields[2] },
            ...(fields[3] ? { title: fields[3] } : {}),
            ...(year === undefined ? {} : { year }),
            ...(fields[5] ? { evidenceTier: fields[5] } : {}),
            ...(fields[6] ? { tags: fields[6].split(";").map((tag) => tag.trim()).filter(Boolean) } : {}),
            ...(fields[7] ? { source: fields[7] } : {}),
            ...(fields[8] ? { notes: fields[8] } : {}),
            ...(fields[9] ? { synthetic: fields[9].toLowerCase() === "true" } : {}),
        };
    });
}
//# sourceMappingURL=index.js.map