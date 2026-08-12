cwlVersion: v1.2
class: Workflow

label: "repro-lab-kit CWL workflow"
doc: |
  A single-step CWL workflow for a public synthetic example. The input and
  output are JSON files so the run can be archived, compared and cited without
  an instrument or private sample data.

inputs:
  input_json:
    type: File
    doc: "Synthetic input JSON for repro-lab-kit."

steps:
  run_repro_lab_kit:
    run: repro-lab-kit.cwl
    in:
      input_json: input_json
    out: [summary_json]

outputs:
  summary_json:
    type: File
    outputSource: run_repro_lab_kit/summary_json
