# `lcms-peptide-qc`

## Purpose

`lcms-peptide-qc` provides deterministic positive-mode calculations for a
research LC-MS workflow:

- neutral mass and charge to protonated `m/z`;
- observed `m/z` back to neutral mass;
- signed and absolute mass error in ppm;
- charge-state tables and a simple CSV observation parser.

Use the neutral monoisotopic mass from `peptide-qc` when the input is a standard
sequence, then keep the two reports linked in your own provenance record.

```bash
cd packages/lcms-peptide-qc
npm ci
npm test
npx lcms-peptide-qc analyze --mass-da 1000 --charge 2 \
  --observed-mz 501.007376466621 --json
```

## Interpretation boundary

The model uses a fixed proton mass in positive mode. It assumes the supplied
neutral mass is correct and does not infer adducts, isotope envelopes,
fragmentation, retention time, charge from a spectrum or instrument
calibration. An m/z match is not an identity confirmation, and a ppm value is
not a purity certificate. It does not read mzML or replace analyst review or a
validated LC-MS method.

Fixtures are synthetic. Do not add customer data, private batch records or real
analytical files. See the [package README](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/packages/lcms-peptide-qc)
and `CITATION.cff` for citation guidance.
