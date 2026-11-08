# @workspace/ui

## Sources of truth
- **Tokens** (`src/css/tokens`, `src/theme`) decide every design value: colors,
  spacing, radii, typography, shadows.
- **Figma** decides variants, states and which token role applies to each
  property (fill, stroke, text, shadow, size, spacing, radius, text style).
  The token decides the actual value, even when it differs from Figma.
  Figma is the look we aim for, not a pixel-perfect spec (see Rules).
  - Design file: https://www.figma.com/design/sEyUa9IlqNOU1lPVqIJQVt/Practical-UI-design-system
  - Read the component with the Figma MCP server before implementing or changing it.
- **Industry standards** (WAI-ARIA practices, established design systems) decide
  structure: HTML elements, nesting, component parts, props API, accessibility.
  Don't mirror Figma's layer tree in markup.

## Rules
- Style only with the Tailwind classes the theme generates. No hardcoded or
  arbitrary design values (`bg-[#…]`, `p-[13px]`). Arbitrary layout values that
  aren't design tokens are allowed, e.g. a grid template
  (`grid-cols-[auto_minmax(0,1fr)_auto]`).
- **Tokens and theme are the maintainer's.** Don't add, change, rename or remove
  tokens or theme config (`src/css/tokens`, `src/theme`): the maintainer
  controls how they grow. If no token is a close match for a Figma value, stop
  and escalate with the value and the closest candidates. This is the only
  thing that needs approval.
- **Follow Figma, but code quality wins.** Aim for Figma's variants, states and
  look, not a 100% match. When matching it needs complex or hacky code (extra
  wrappers, magic offsets, one-off special cases, absolute positioning to fake a
  layout), choose the cleaner solution. The same goes for what Figma lacks: add
  a state or behaviour a component needs (e.g. Button `loading`) when the clean
  solution calls for it. Note every difference from Figma in the component
  README and in your summary.

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
  property must be either/or: in a base slot or in a variant, never both, and
  never in two variants applied together. The closed styling API is why merging
  isn't needed. Don't switch to full `tailwind-variants`/`tailwind-merge`
  without registering the theme with `extendTailwindMerge`: its default config
  misreads custom tokens and drops them silently
  (`text-heading-4 text-strong-inverse` → `text-strong-inverse`,
  `font-body font-strong` → `font-strong`).
- **Parts are slots by default:** style a component's parts (icon, label, …)
  with `tv` slots, so each variant is declared once and decides every part
  (see `Alert`, `Button`). Make a part a separate component only when it has its
  own markup or behaviour (`DismissButton`) or is a public building block
  (`FieldLabel`). Repeated markup alone isn't a reason: render the slot twice.
- **Defaults live in props:** set variant defaults as default parameter values
  (`size = "large"`) and always pass every variant to `tv`. No `defaultVariants`:
  a second copy drifts, and child parts would need their own defaults.
- **Files:** one folder per component (`Button/Button.tsx` + `index.ts`), `tv`
  styles at the bottom of the component file, public exports listed in `src/index.ts`.
