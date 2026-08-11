import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { assertValidCoa, validateCoa } from "../dist/index.js";

const fixture = JSON.parse(await readFile(new URL("../examples/coa.synthetic.json", import.meta.url), "utf8"));

test("accepts the synthetic COA fixture", () => {
  const result = validateCoa(fixture);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
  assert.doesNotThrow(() => assertValidCoa(fixture));
});

test("rejects missing required batch identifiers", () => {
  const invalid = structuredClone(fixture);
  delete invalid.batch.lotId;
  const result = validateCoa(invalid);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.instancePath === "/batch"));
  assert.throws(() => assertValidCoa(invalid), /Invalid COA record/);
});

test("rejects a sequence with an ambiguous residue code", () => {
  const invalid = structuredClone(fixture);
  invalid.material.sequence = "ACUX";
  const result = validateCoa(invalid);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.instancePath === "/material/sequence"));
});

test("CLI validates JSON and emits a machine-readable result", () => {
  const output = execFileSync(process.execPath, [
    "dist/cli.js",
    "validate",
    "--file",
    "examples/coa.synthetic.json",
    "--json",
  ], { encoding: "utf8" });
  assert.equal(JSON.parse(output).valid, true);
});
