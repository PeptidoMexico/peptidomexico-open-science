# Synthetic reconstitution benchmark

The repository includes a small, inspectable benchmark for unit-safe
reconstitution calculations. It contains twelve deterministic cases covering
mg/µg, mL/µL, mass concentration and `mM` inputs with an explicit molecular
mass.

Run it from a clean checkout with:

```bash
npm ci
npm run benchmark:reconstitution
```

The validator checks every expected volume and prints the SHA-256 of the CSV.
The dataset is synthetic and is not evidence about a batch, instrument, purity,
identity, efficacy or clinical use. See the [dataset card](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/benchmarks/peptide-calculations-synthetic/DATASET_CARD.md)
and [`PROVENANCE.json`](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/benchmarks/peptide-calculations-synthetic/PROVENANCE.json)
before reusing it.
