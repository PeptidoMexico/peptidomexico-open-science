FROM node:22-bookworm-slim

WORKDIR /work

COPY packages/peptide-calculations /work/packages/peptide-calculations
COPY packages/peptide-qc /work/packages/peptide-qc
COPY packages/lcms-peptide-qc /work/packages/lcms-peptide-qc
COPY repro-lab-kit /work/repro-lab-kit

CMD ["node", "repro-lab-kit/workflow/run.mjs", "--check"]
