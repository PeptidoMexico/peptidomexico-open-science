# `peptide-evidence-map`

`peptide-evidence-map` normalizes DOI, PMID, PMCID, URL and local fixture
identifiers, removes duplicate representations and records the curation
provenance needed to reproduce a literature-mapping pass.

```bash
cd packages/peptide-evidence-map
npm ci
npm test
npx peptide-evidence-map ingest \
  --file examples/evidence.synthetic.json \
  --search-date 2026-08-11 \
  --json
```

The example input is synthetic and clearly marked. Use a real project’s source
export, search strategy, access date and curator decisions as separate,
versioned inputs. The package does not retrieve papers, copy abstracts, rank
study quality, infer efficacy or provide clinical guidance. `evidenceTier` is a
human-supplied label, not an automated scientific judgment.
