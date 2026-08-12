FROM node:20-bookworm-slim

ARG REPRO_LAB_KIT_VERSION=0.1.0

LABEL org.opencontainers.image.title="repro-lab-kit" \
      org.opencontainers.image.description="Offline synthetic peptide sequence, reconstitution and LC-MS reproducibility workflow" \
      org.opencontainers.image.version="${REPRO_LAB_KIT_VERSION}" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.url="https://peptidomexico.com.mx/calculadora/" \
      org.opencontainers.image.documentation="https://peptidomexico-open-science.readthedocs.io/en/latest/repro-lab-kit/" \
      org.opencontainers.image.source="https://github.com/PeptidoMexico/peptidomexico-open-science"

RUN npm install --global --omit=dev "repro-lab-kit@${REPRO_LAB_KIT_VERSION}" \
    && npm cache clean --force

USER node
WORKDIR /work

ENTRYPOINT ["repro-lab-kit"]
