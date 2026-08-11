# coa-schema

Versioned JSON Schema and offline validator for structured research-material
certificate-of-analysis records.

## What it does

- defines a small, explicit interchange contract for material, batch, assay,
  document and disclosure fields;
- validates records with Ajv and reports machine-readable JSON errors;
- includes a synthetic fixture and a CLI that never sends data over the network;
- keeps provenance fields structural without asserting that a result is true.

## Install and validate

```bash
npm install coa-schema
npx coa-schema validate --file examples/coa.synthetic.json --json
```

```ts
import { validateCoa } from "coa-schema";

const result = validateCoa(record);
if (!result.valid) console.error(result.errors);
```

The canonical schema is also shipped at `schema/coa.schema.json`.

## Important boundary

Schema validation confirms shape, required fields, primitive types and simple
patterns. It does not confirm identity, purity, the method, a laboratory result,
the provenance hash, a signature or the authenticity of a document. It does not
replace laboratory review, a quality system or a validated method. Use synthetic
or de-identified examples in public repositories; do not commit customer data,
private batch records or real certificates without authorization.

The package is for research-use-only and interoperability/education. It is
maintained by Péptido México, a commercial supplier of research materials; that
relationship is disclosed in `CITATION.cff`.

## Development

```bash
npm test
npm run pack:check
```

## Citation

See `CITATION.cff` and cite the exact release when possible.
