cwlVersion: v1.2
class: CommandLineTool

label: "repro-lab-kit synthetic peptide workflow"
doc: |
  Execute the deterministic offline workflow for a synthetic peptide input.
  The workflow reports sequence QC, a target reconstitution volume and a
  positive-mode LC-MS calculation with provenance. It does not interpret a
  sample, certify purity or provide clinical instructions.

requirements:
  - class: DockerRequirement
    dockerPull: ghcr.io/peptidomexico/repro-lab-kit:0.1.0

baseCommand: ["repro-lab-kit"]

inputs:
  input_json:
    type: File
    doc: "Synthetic JSON input for the reproducible workflow."
    inputBinding:
      prefix: "--input"

outputs:
  summary_json:
    type: stdout

stdout: summary.json
