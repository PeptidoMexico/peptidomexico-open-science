# Repro Lab Kit

An offline, container-friendly workflow that connects the released Péptido
México packages into one auditable synthetic run:

1. `peptide-qc` calculates the neutral monoisotopic mass from a sequence.
2. `peptide-calculations` calculates a target reconstitution volume.
3. `lcms-peptide-qc` compares a synthetic observed `m/z` with the theoretical
   positive-mode value.
4. The workflow emits a JSON report and a SHA-256 provenance record.

## Run from a clean clone

```bash
npm ci --prefix packages/peptide-calculations
npm ci --prefix packages/peptide-qc
npm ci --prefix packages/lcms-peptide-qc
node repro-lab-kit/workflow/run.mjs --check
```

The workflow is offline after dependencies are installed. It uses synthetic
inputs only and does not infer identity, purity, efficacy, dose, clinical
meaning or instrument validity.

## Container

```bash
docker build -f repro-lab-kit/Dockerfile -t peptido-repro-lab-kit .
docker run --rm peptido-repro-lab-kit
```

The same image is published anonymously through GitHub Container Registry:

```bash
docker run --rm \
  --volume "$PWD/workflows/cwl/examples:/inputs:ro" \
  ghcr.io/peptidomexico/repro-lab-kit:0.1.0 \
  --input /inputs/input.json
```

The exact fixture and the expected summary are versioned beside the runner.
The runner intentionally omits timestamps and machine-specific paths so the
same input can be compared across environments.

## Provenance boundary

This kit proves that the declared synthetic workflow can be rerun from the
repository artifacts. It is not a laboratory validation, an analytical
certificate, a clinical protocol or evidence of product performance. Péptido
México maintains the software and also operates a commercial supplier of
research materials; that relationship is disclosed in the citation file.
