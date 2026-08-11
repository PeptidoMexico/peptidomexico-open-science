#!/usr/bin/env node
import fs from "node:fs";
import { ingestEvidence, parseEvidenceCsv } from "./index.js";
function parseArgs(values) {
    const [command, ...rest] = values;
    const args = {};
    for (let index = 0; index < rest.length; index += 1) {
        const token = rest[index];
        if (!token.startsWith("--"))
            continue;
        const key = token.slice(2);
        const next = rest[index + 1];
        if (!next || next.startsWith("--")) {
            args[key] = true;
            continue;
        }
        args[key] = next;
        index += 1;
    }
    return { command, args };
}
function required(args, name) {
    const value = args[name];
    if (typeof value !== "string" || value.length === 0)
        throw new Error(`Missing required option --${name}.`);
    return value;
}
function printHelp() {
    console.log([
        "Peptide Evidence Map",
        "",
        "Normalize and deduplicate user-supplied evidence identifiers without fetching literature.",
        "",
        "Usage:",
        "  peptide-evidence-map ingest --file records.json --json",
        "  peptide-evidence-map ingest --file records.csv --format csv --search-date 2026-08-11 --json",
        "",
        "Options:",
        "  --format json|csv          Input format; JSON is the default",
        "  --search-date YYYY-MM-DD  Date of the literature search or curation pass",
        "  --source name              Source registry or project name",
        "  --generated-at ISO         Optional generated timestamp; omit for reproducibility",
        "  --json                     Print machine-readable JSON",
    ].join("\n"));
}
function main() {
    const { command, args } = parseArgs(process.argv.slice(2));
    if (!command || args.help) {
        printHelp();
        return;
    }
    if (command !== "ingest")
        throw new Error(`Unknown command: ${command}.`);
    const file = required(args, "file");
    const format = typeof args.format === "string" ? args.format : file.toLowerCase().endsWith(".csv") ? "csv" : "json";
    const text = fs.readFileSync(file, "utf8");
    let records;
    if (format === "csv") {
        records = parseEvidenceCsv(text);
    }
    else if (format === "json") {
        const parsed = JSON.parse(text);
        records = Array.isArray(parsed) ? parsed : parsed.records;
    }
    else {
        throw new Error("--format must be json or csv.");
    }
    if (!Array.isArray(records))
        throw new Error("Input JSON must be an array or an object with a records array.");
    const result = ingestEvidence(records, {
        ...(typeof args["search-date"] === "string" ? { searchDate: args["search-date"] } : {}),
        ...(typeof args.source === "string" ? { source: args.source } : {}),
        ...(typeof args["generated-at"] === "string" ? { generatedAt: args["generated-at"] } : {}),
    });
    console.log(JSON.stringify(result, null, 2));
}
try {
    main();
}
catch (error) {
    console.error(error instanceof Error ? error.message : "Evidence map failed.");
    process.exitCode = 1;
}
//# sourceMappingURL=cli.js.map