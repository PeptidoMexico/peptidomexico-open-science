# `coa-schema`

## Purpose

`coa-schema` provides a versioned JSON Schema and offline validator for the
structure of research-material COA-style records. It covers material, batch,
assay, document and disclosure fields and includes synthetic fixtures.

```bash
cd packages/coa-schema
npm ci
npm test
npx coa-schema validate --file examples/coa.synthetic.json --json
```

## What validation means

Validation checks required fields, primitive types, simple patterns and the
schema version. It does not confirm identity, purity, a laboratory result, a
method, a provenance hash, a signature or document authenticity. It is not a
certificate, quality-system decision or replacement for laboratory review.

Use synthetic or de-identified records in public repositories. Do not commit
customer data, private batch records or real certificates without authorization.
See the [package README](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/packages/coa-schema)
and `CITATION.cff` for the schema boundary and citation guidance.
