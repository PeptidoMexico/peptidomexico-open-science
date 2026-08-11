# lcms-peptide-qc

Deterministic positive-mode LC-MS calculations for research peptide workflows.

## What it does

- calculates protonated `m/z` from a neutral monoisotopic mass and integer charge;
- inverts observed `m/z` to neutral mass;
- reports signed and absolute mass error in ppm;
- generates a charge-state table;
- processes a small, explicit CSV fixture format for repeated observations.

Use `peptide-qc` first when the neutral mass comes from a standard sequence, then
pass its `mass.monoisotopicDa` result into this package. Keeping the two steps
separate makes the mass source inspectable.

## Install and use

```bash
npm install lcms-peptide-qc
npx lcms-peptide-qc analyze \
  --mass-da 1000 \
  --charge 2 \
  --observed-mz 501.007376466621 \
  --json
```

For a charge-state table:

```bash
npx lcms-peptide-qc charge-states --mass-da 1000 --max-charge 5 --json
```

For repeated synthetic observations, the CSV header must be exactly
`id,neutralMassDa,charge,observedMz`:

```bash
npx lcms-peptide-qc csv --file examples/observations.csv --json
```

## Scientific assumptions and limits

The model is positive mode and uses the proton mass
`1.007276466621 Da`. It assumes the supplied neutral mass is the correct
monoisotopic neutral mass and does not infer isotope envelopes, adducts,
fragmentation, retention time, charge from a spectrum, or instrument calibration.
An m/z match is not an identity confirmation. It does not read mzML and does not
replace a validated LC-MS method or analyst review.

This is research-use-only and educational software. Do not interpret a ppm value
as a certificate of purity or identity. The package is maintained by Péptido
México, a commercial supplier of research materials; that relationship is
disclosed in `CITATION.cff`.

## Development

```bash
npm test
npm run pack:check
```

Fixtures are synthetic and contain no customer data, private batch records or
real analytical files.

The latest suite release is archived on [Zenodo](https://doi.org/10.5281/zenodo.21895679)
with reproducible citation metadata.

## Citation

See `CITATION.cff` and cite the exact release when possible.
