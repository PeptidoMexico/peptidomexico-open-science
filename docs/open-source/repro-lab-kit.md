# `repro-lab-kit`

The repository-level `repro-lab-kit` is an offline integration workflow for the
released packages. It calculates a sequence mass, a synthetic reconstitution
volume and a positive-mode LC-MS error, then compares the result with a
versioned JSON summary.

The same workflow is available as the installable [`repro-lab-kit` npm
package](https://www.npmjs.com/package/repro-lab-kit), which accepts a JSON
fixture and exposes the workflow as a CLI and JavaScript function.

```bash
npm ci --prefix packages/peptide-calculations
npm ci --prefix packages/peptide-qc
npm ci --prefix packages/lcms-peptide-qc
npm run repro:lab-kit
```

The kit also includes a Dockerfile, a synthetic fixture, a provenance contract
an SBOM, a CWL wrapper and a citation file. It proves software reproducibility only; it is not a
validated analytical method, identity confirmation, purity certificate or
clinical protocol.
