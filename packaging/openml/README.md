# OpenML dataset: synthetic peptide reconstitution benchmark

This directory contains the OpenML dataset source and metadata for the public synthetic benchmark. OpenML assigned dataset ID `47274`; the record is verified and publicly discoverable.

The dataset is intentionally small and transparent: it is a regression-oriented teaching and validation fixture whose target is `expected_volume_ml`. It is useful for checking that a client preserves units and handles mass-concentration and molar-concentration inputs. It must not be presented as experimental, clinical, patient, product-quality or dosing data.

## Files

- `reconstitution-benchmark.arff` is the OpenML-compatible source file.
- `dataset-metadata.json` contains the submitted metadata and source/citation links.
- `VALIDATION.md` records the publication checks.

The ASCII-safe values `ug` and `ug/uL` represent `µg` and `µg/µL` from the canonical CSV so that nominal ARFF values remain portable across clients.

## Publication state

The dataset was uploaded from the brand-owned `Peptido Mexico Open Science` account after the ARFF parsed, the 12 expected rows were checked, the default target was set to `expected_volume_ml`, and the CC BY 4.0 attribution was reviewed. Public record: https://www.openml.org/d/47274. Anonymous audit shows `verified`, 7 features and the expected target metadata.
