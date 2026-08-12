# OpenML validation

The submitted dataset was checked before upload:

1. The relation name is stable and the file declares seven attributes.
2. Exactly twelve data rows are present.
3. `expected_volume_ml` is numeric and is the proposed default target.
4. Missing `molar_mass_da` values are represented as `?`; non-missing values are positive.
5. `case_id` values are unique and correspond to `recon-001` through `recon-012`.
6. The source repository, canonical calculator and Figshare DOI are preserved in the metadata.

The OpenML record is synthetic and research-use-only. It does not contain customer, clinical, patient, product-quality, batch, instrument or dosing data.
