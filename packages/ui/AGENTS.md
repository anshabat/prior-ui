# @workspace/ui

## Sources of truth
- **Tokens** (`src/css/tokens`, `src/theme`) decide every design value: colors,
  spacing, radii, typography, shadows.
- **Figma** decides variants, states and which token role applies to each
  property (fill, stroke, text, shadow, size, spacing, radius, text style).
  The token decides the actual value, even when it differs from Figma.
  - Design file: https://www.figma.com/design/vLd7saIPGNhXmCxIBlBTjI/Practical-UI-design-system
  - Read the component with the Figma MCP server before implementing or changing it.
- **Industry standards** (WAI-ARIA practices, established design systems) decide
  structure: HTML elements, nesting, component parts, props API, accessibility.
  Don't mirror Figma's layer tree in markup.

## Rules
- Style only with the Tailwind classes the theme generates. No hardcoded or
  arbitrary values (`bg-[#…]`, `p-[13px]`).
- Don't change, rename or add tokens while building components.
- If no token is a close match for a Figma value, stop and escalate to the
  maintainer with the value and the closest candidates.
- Don't add, simplify or "improve" styles. Escalate deviations from Figma and
  wait for a decision. Approved so far:
  - Text inputs (Input, later Textarea and Select): no hover or press states,
    white at rest, focus ring only.

## Component conventions
- **Server-component safe:** no `"use client"`, context, `useState`/`useEffect`
  or internal event handlers; apps own state. Wire parts with props or render
  props (see `Field`). `useId` is allowed.
- **Closed styling API:** no `className` or `style` props. Spread native props
  first, set `className` last.
- **No preflight:** `dist/tailwind.css` is built without it, so components reset
  the browser defaults they rely on (`m-0`, `box-border`, `border-solid`, …).
- **No class merging** (`tailwind-variants/lite`): classes for the same CSS
  property must be either/or variants, never both applied.
- **Files:** one folder per component (`Button/Button.tsx` + `index.ts`), `tv`
  styles at the bottom of the component file, public exports listed in `src/index.ts`.
