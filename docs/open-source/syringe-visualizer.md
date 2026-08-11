# `syringe-visualizer`

## Purpose

The visualizer turns a calculated volume and a syringe capacity into a readable
visual reference. The fluid level is driven by `volumeMl`; it is not a decorative
water animation.

```tsx
import { SyringeVisualizer } from "syringe-visualizer";

export function Example() {
  return <SyringeVisualizer capacityMl={3} volumeMl={2} />;
}
```

It includes glass, barrel graduations, plunger, fluid fill, controlled orbit
interaction, reduced-motion handling, an accessible text label and an SVG fallback
when WebGL cannot render.

## Integration contract

The component accepts only geometric inputs: syringe capacity and volume in mL.
The web calculator obtains the volume from `peptide-calculations` and passes it to
this component. That separation keeps the visualization honest and reusable.

## Limits

It does not calibrate a physical device or make claims about accuracy. It does not
provide dosing, body-weight calculations, administration instructions, compound
selection or clinical interpretation.
