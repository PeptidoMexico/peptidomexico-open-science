# Provenance contract

The workflow has a deliberately small provenance contract:

- `fixtures/input.json` is the complete synthetic input;
- the runner records a SHA-256 hash of the canonical input JSON;
- package names and source paths are listed in the report;
- no wall-clock timestamp, local path or machine identifier enters the expected
  summary;
- `--check` compares the generated summary with
  `workflow/expected-summary.json`.

This is provenance for a software test workflow, not a chain-of-custody record
for customer material or an analytical result.
