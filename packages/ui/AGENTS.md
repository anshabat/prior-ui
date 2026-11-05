# @workspace/ui

## Sources of truth
- **Tokens** (`src/css/tokens`, `src/theme`) decide every design value: colors,
  spacing, radii, typography, shadows.
- **Figma** decides variants, states and which token role applies to each
  property (fill, stroke, text, shadow, size, spacing, radius, text style).
  The token decides the actual value, even when it differs from Figma.
  Figma is the look we aim for, not a pixel-perfect spec (see Rules).
  - Design file: https://www.figma.com/design/vLd7saIPGNhXmCxIBlBTjI/Practical-UI-design-system
  - Read the component with the Figma MCP server before implementing or changing it.
- **Industry standards** (WAI-ARIA practices, established design systems) decide
  structure: HTML elements, nesting, component parts, props API, accessibility.
  Don't mirror Figma's layer tree in markup.

## Rules
- Style only with the Tailwind classes the theme generates. No hardcoded or
  arbitrary design values (`bg-[#…]`, `p-[13px]`). Arbitrary layout values that
  aren't design tokens are allowed, e.g. a grid template
  (`grid-cols-[auto_minmax(0,1fr)_auto]`).
- Don't change, rename or add tokens while building components.
- If no token is a close match for a Figma value, stop and escalate to the
  maintainer with the value and the closest candidates.
- **Code quality first, Figma second.** Don't chase a 100% match. When matching
  a Figma detail exactly needs complex or hacky code (extra wrappers, magic
  offsets, one-off special cases, absolute positioning to fake a layout), choose
  the cleaner solution and accept the small visual difference. No approval
  needed: note the difference in the component README and in your summary.
- Don't add visual features Figma doesn't have (extra states, shadows,
  animations) without approval. Approved so far:
  - Text inputs (Input, later Textarea and Select): no hover or press states,
    white at rest, focus ring only.
  - Field: the description dims to `text-disabled` with the label when the field
    is disabled (Figma keeps it `text-weak`).

## Component conventions
- **Server-component safe:** no `"use client"`, context, `useState`/`useEffect`
  or internal event handlers; apps own state. Wire parts with props or render
  props (see `Field`). `useId` is allowed.
- **Closed styling API:** no `className` or `style` props: omit them from the
  public type (`Omit<ComponentProps<"button">, "className" | "style">`). Set
  `className` first, spread native props after it, so a wrapper can pass its
  classes down (planned `asChild`). The types are what keep callers from
  passing `className`.
- **No preflight:** `dist/tailwind.css` is built without it, so components reset
  the browser defaults they rely on (`m-0`, `box-border`, `border-solid`, …).
- **No class merging** (`tailwind-variants/lite`): classes for the same CSS
  property must be either/or variants, never both applied.
- **Defaults live in props:** set variant defaults as default parameter values
  (`size = "large"`) and always pass every variant to `tv`. No `defaultVariants`:
  a second copy drifts, and child parts would need their own defaults.
- **Files:** one folder per component (`Button/Button.tsx` + `index.ts`), `tv`
  styles at the bottom of the component file, public exports listed in `src/index.ts`.
