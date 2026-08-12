# CWL reproducibility workflow

The [`workflows/cwl`](https://github.com/PeptidoMexico/peptidomexico-open-science/tree/main/workflows/cwl)
directory contains a CWL 1.2 workflow and command-line tool wrapper for
`repro-lab-kit@0.1.0`. It accepts a synthetic JSON fixture and emits a JSON
summary with sequence, reconstitution, LC-MS and provenance fields.

The workflow is suitable for registry import into tools that understand CWL.
Its container reference is pinned to `docker.io/peptidomexico/repro-lab-kit:0.1.0`
so a future release can be compared against the exact image version.

```bash
python -m pip install cwltool
cwltool --validate workflows/cwl/repro-lab-kit-workflow.cwl
```

The workflow is an offline software test and teaching artifact. It does not
identify samples, certify purity, calibrate an instrument or provide clinical
instructions.
