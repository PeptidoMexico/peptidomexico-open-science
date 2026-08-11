import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const metadata = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

test("publishes the visualizer as a peer-dependency package", () => {
  assert.equal(metadata.name, "syringe-visualizer");
  assert.equal(metadata.license, "MIT");
  assert.equal(metadata.exports["."].import, "./dist/index.js");
  assert.ok(metadata.peerDependencies["@react-three/fiber"]);
  assert.ok(metadata.peerDependencies.three);
});
