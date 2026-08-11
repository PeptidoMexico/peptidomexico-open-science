#!/usr/bin/env node
import { analyzePeptide } from "./index.js";
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
function numeric(args, name, fallback) {
    const value = args[name];
    if (value === undefined && fallback !== undefined)
        return fallback;
    if (typeof value !== "string")
        throw new Error(`Missing required option --${name}.`);
    const parsed = Number(value.replace(",", "."));
    if (!Number.isFinite(parsed))
        throw new Error(`Option --${name} must be numeric.`);
    return parsed;
}
function modification(args) {
    const value = args.modification;
    if (typeof value !== "string")
        return [];
    const separator = value.includes("=") ? "=" : ":";
    const [name, rawMass] = value.split(separator);
    const deltaMassDa = Number(rawMass?.replace(",", "."));
    if (!name || !Number.isFinite(deltaMassDa)) {
        throw new Error("--modification must use name=deltaMassDa, for example phosphorylation=79.966331.");
    }
    return [{ name, deltaMassDa }];
}
function printHelp() {
    console.log([
        "Peptide QC",
        "",
        "Research-use-only sequence, mass, charge and hydropathy analysis.",
        "",
        "Usage:",
        "  peptide-qc analyze --sequence ACDEFGHIK --json",
        "",
        "Options:",
        "  --ph 7                    pH for the approximate net-charge result",
        "  --window-size 7          Kyte-Doolittle profile window",
        "  --modification name=Da   One explicit mass delta, e.g. phosphorylation=79.966331",
        "  --json                   Print machine-readable JSON",
    ].join("\n"));
}
function main() {
    const { command, args } = parseArgs(process.argv.slice(2));
    if (!command || args.help) {
        printHelp();
        return;
    }
    if (command !== "analyze")
        throw new Error(`Unknown command: ${command}.`);
    const result = analyzePeptide(required(args, "sequence"), {
        pH: numeric(args, "ph", 7),
        hydropathyWindowSize: numeric(args, "window-size", 7),
        modifications: modification(args),
    });
    console.log(JSON.stringify(result, null, 2));
}
try {
    main();
}
catch (error) {
    console.error(error instanceof Error ? error.message : "Peptide QC failed.");
    process.exitCode = 1;
}
//# sourceMappingURL=cli.js.map