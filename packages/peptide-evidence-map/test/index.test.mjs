import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import {
  ingestEvidence,
  normalizeIdentifier,
  parseEvidenceCsv,
} from "../dist/index.js";

test("normalizes DOI, PMID, PMCID and URL forms", () => {
  assert.deepEqual(normalizeIdentifier("https://doi.org/10.1234/ABC.1."), {
    type: "doi",
    value: "10.1234/abc.1",
    key: "doi:10.1234/abc.1",
  });
  assert.deepEqual(normalizeIdentifier("https://pubmed.ncbi.nlm.nih.gov/12345/"), {
    type: "pmid",
    value: "12345",
    key: "pmid:12345",
  });
  assert.deepEqual(normalizeIdentifier("pmc987654"), {
    type: "pmcid",
    value: "PMC987654",
    key: "pmcid:PMC987654",
  });
});

test("deduplicates identifiers and preserves provenance counts", () => {
  const result = ingestEvidence([
    { id: "a", identifier: "10.1234/ABC", evidenceTier: "review" },
    { id: "b", identifier: "doi:10.1234/abc", evidenceTier: "clinical" },
    { id: "c", identifier: "PMID:42", evidenceTier: "in-vitro" },
  ], { searchDate: "2026-08-11", source: "synthetic-test" });
  assert.equal(result.summary.inputRecords, 3);
  assert.equal(result.summary.uniqueRecords, 2);
  assert.equal(result.summary.duplicateRecords, 1);
  assert.deepEqual(result.duplicateGroups, [{ key: "doi:10.1234/abc", recordIds: ["a", "b"] }]);
  assert.equal(result.provenance.searchDate, "2026-08-11");
  assert.match(result.provenance.inputSha256, /^[a-f0-9]{64}$/);
});

test("CSV parser accepts quoted fields and semicolon tags", () => {
  const records = parseEvidenceCsv([
    "id,identifierType,identifier,title,year,evidenceTier,tags,source,notes,synthetic",
    'one,pmid,42,"A title, with comma",2025,observational,"one;two",manual,"keep source text outside this tool",false',
  ].join("\n"));
  assert.equal(records[0].title, "A title, with comma");
  assert.deepEqual(records[0].tags, ["one", "two"]);
  assert.equal(records[0].synthetic, false);
});

test("rejects invalid search dates and evidence tiers", () => {
  assert.throws(() => ingestEvidence([{ identifier: "PMID:1" }], { searchDate: "2026-02-30" }), /valid calendar date/);
  assert.throws(() => ingestEvidence([{ identifier: "PMID:1", evidenceTier: "efficacy" }]), /Unsupported evidenceTier/);
});

test("CLI emits a deterministic JSON evidence map", () => {
  const output = execFileSync(process.execPath, [
    "dist/cli.js",
    "ingest",
    "--file",
    "examples/evidence.synthetic.json",
    "--search-date",
    "2026-08-11",
    "--json",
  ], { encoding: "utf8" });
  const result = JSON.parse(output);
  assert.equal(result.summary.inputRecords, 4);
  assert.equal(result.summary.uniqueRecords, 3);
  assert.equal(result.duplicateGroups[0].key, "doi:10.0000/example.duplicate");
});
