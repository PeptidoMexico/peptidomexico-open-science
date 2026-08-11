# peptide-evidence-map

Deterministic normalization and deduplication for peptide-literature evidence
records. The package accepts identifiers and curator-supplied labels, produces
machine-readable provenance, and keeps the evidence boundary explicit.

## What it does

- normalizes DOI, PMID, PMCID, URL and local fixture identifiers;
- deduplicates equivalent identifiers without deleting the original IDs from
  the duplicate report;
- preserves optional title, year, evidence tier, tags, source and notes;
- computes an input SHA-256 hash for a reproducible curation pass;
- reads JSON or a documented CSV shape and emits a JSON evidence map.

## Install and use

```bash
npm install peptide-evidence-map
npx peptide-evidence-map ingest \
  --file examples/evidence.synthetic.json \
  --search-date 2026-08-11 \
  --json
```

The example file is explicitly synthetic. A real project should keep the
original search strategy, source export, access date, identifier list and
curator decisions next to the generated map.

## Scientific boundary

This package does not download papers, copy abstracts, judge study quality,
infer efficacy, resolve conflicting clinical claims or turn preclinical
evidence into medical advice. `evidenceTier` is a transparent curator label,
not an automated assessment. The tool is research-use-only and educational
software. Péptido México is a commercial supplier of research materials; that
relationship is disclosed in `CITATION.cff`.

## Development

```bash
npm test
npm run pack:check
```

Fixtures contain no customer data and no real literature claims. Cite the exact
package release and the source records used in your own analysis. The latest
suite release is archived on [Zenodo](https://doi.org/10.5281/zenodo.21895679).
