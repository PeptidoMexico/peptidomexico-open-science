# syringe-visualizer

An accessible Three.js syringe visualization for laboratory education and research tools.

The component receives a syringe capacity and a volume in millilitres. It renders:

- a realistic Three.js scene with glass, plunger, fluid, barrel graduations and controlled orbit interaction;
- a 2D SVG fallback when WebGL cannot render;
- a text alternative through the component label;
- reduced-motion support;
- no compound selector, dose recommendation, body model, administration instruction or clinical interpretation.

## Install

    npm install syringe-visualizer three @react-three/fiber @react-three/drei

## Usage

    import { SyringeVisualizer } from "syringe-visualizer";

    export function Example() {
      return <SyringeVisualizer capacityMl={3} volumeMl={2} />;
    }

The component is intentionally a visual volume aid. It does not calibrate a physical device and does not decide which concentration, solvent or protocol a researcher should use.

## Scope and disclosure

This software is for research-use-only and educational visualization. It is maintained by Péptido México, a commercial supplier of research materials. The project is independent of any product catalog, batch, protocol or clinical use.

## Development

    npm test
    npm run pack:check

## Citation

See CITATION.cff. Releases will receive a DOI after the public repository is connected to Zenodo.
