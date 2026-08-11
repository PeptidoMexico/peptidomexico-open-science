# Contributing to the open-source packages

Thank you for helping make the research tools clearer and more reproducible.

## Scope

This guide applies to the reusable packages under `packages/`. The repository also
contains a commercial storefront; its catalog, checkout, customer data, brand
assets and production operations are not open-source contribution targets.

## Before opening a pull request

1. Read the package README and its stated limits.
2. Keep calculations deterministic and explicit about units, assumptions and
   rounding.
3. Add or update a synthetic fixture and a test for every behavior change.
4. Run the package build, tests and tarball check from the repository root:

   ```bash
   npm ci
   npm run package:calculations:build
   npm run package:calculations:test
   npm run package:calculations:pack
   npm run package:syringe:build
   npm run package:syringe:test
   npm run package:syringe:pack
   ```

   If you cloned the public package repository rather than the integration
   workspace, run the same checks inside each package with `npm ci` followed by
   `npm run pack:check`.

5. Do not add customer records, real certificates of analysis, private batch data,
   personal information or unlicensed datasets.
6. Do not add therapeutic, dosing, administration or clinical claims. These tools
   are for research-use-only and educational calculation/visualization.

## Pull requests

Describe the user problem, the public API change, the fixture that demonstrates it
and any compatibility or scientific limitation. A maintainer will review the
technical behavior, documentation, accessibility and scope before merging.

Please do not request votes, stars or backlinks in issues or pull requests. A
useful contribution is more valuable than a vanity metric.

## Disclosure

Péptido México maintains these packages and operates a commercial research-material
business. That relationship is documented in each package README and citation
file; contributors should preserve the disclosure when adapting the tools.
