# Synthetic reconstitution benchmark

Twelve deterministic cases for checking peptide mass/concentration unit
handling and target reconstitution volume. The benchmark is deliberately small
so a reviewer can inspect every row.

```bash
npm run benchmark:reconstitution
```

The validator prints a pass/fail summary and the SHA-256 of the input file. It
does not download data or infer any scientific property beyond the declared
calculation.
