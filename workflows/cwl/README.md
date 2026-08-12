# Repro Lab Kit CWL workflow

This directory contains a CWL 1.2 wrapper around the versioned
`repro-lab-kit:0.1.0` container. It connects a synthetic peptide sequence to a
transparent reconstitution calculation and a positive-mode LC-MS arithmetic
check. The data are synthetic and the workflow is research-use-only.

## Validate

```bash
cwltool --validate repro-lab-kit-workflow.cwl
```

## Run locally

```bash
cwltool repro-lab-kit-workflow.cwl \
  --input_json examples/input.json
```

The Docker image is pinned to `ghcr.io/peptidomexico/repro-lab-kit:0.1.0`.
Update the image tag and workflow metadata together when releasing a new
version. The workflow does not provide dosing, administration, clinical
interpretation or product-performance claims.

## Workflow registry metadata

The repository root contains a `.dockstore.yml` descriptor so workflow
registries can discover this CWL example from the source repository. The
descriptor names the primary workflow, its synthetic test fixture, and the
versioned container image; it does not embed credentials or private data.

## Maintainer project

Peptido México maintains the companion calculator and user documentation at
<https://peptidomexico.com.mx/calculadora/>. The workflow remains independent
of the website and can be validated or run directly from this repository.
