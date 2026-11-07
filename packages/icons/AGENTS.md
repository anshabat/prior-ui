# @workspace/icons

## Source of truth
- Figma → Foundations → **Icons** page:
  https://www.figma.com/design/sEyUa9IlqNOU1lPVqIJQVt/Practical-UI-design-system?node-id=3819-28711
- The base set is **Feather** (feathericons.com, MIT). Figma's "Custom" icons
  extend it in the same style.
- Only add icons that exist on that page. If one is missing, escalate to the
  maintainer instead of drawing it or taking it from another set.

## Every icon follows the same rules
- **Grid:** drawn on 24×24, `viewBox="0 0 24 24"`, with Feather's built-in
  padding. Never use a trimmed export (Figma's per-layer assets come out
  e.g. 20×20 with `preserveAspectRatio`): export the 24×24 icon component,
  or use the canonical Feather path.
- **Style:** UI icons are outline only: `fill="none"`, 2px stroke, round caps
  and joins. No filled or duotone variants of them. (Brand icons follow their
  Figma set, which is filled.)
- **Color:** UI icons (Feather and Custom) have one color, `stroke="currentColor"`
  on the root `<svg>`. No colors, opacity or stroke attributes on paths. Consumers
  set the color with icon token utilities (`stroke-neutral`, `stroke-error`, …) or
  by inheriting text color.
  Multi-color icons (e.g. brand icons from Figma's Social media set) keep their
  colors as hex values in the SVG; the pipeline turns each one into an
  overridable `--color-N` variable. Keep that support in the pipeline and template.
- **Size:** 24px default (`width`/`height` 24). Components use 24 (medium) and
  16 (small) via classes like `size-16`. The stroke scales with the icon (2px at
  24, 1.33px at 16), matching Figma; don't use `vector-effect: non-scaling-stroke`.
- **Accessibility:** `aria-hidden="true"` by default: icons are decorative and
  the meaning belongs to the parent control (`aria-label="Clear search"`).
- **Naming:** from the Figma name, describing the shape, not its use (`X`, not
  `Close`). `X octagon` → file `svg/xOctagon.svg`, component `XOctagon`,
  `data-icon="x-octagon"`.

## Source file template
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
  aria-hidden="true" data-icon="x-octagon">
  <path d="…" />
</svg>
```

## Pipeline
`svg/*.svg` → `scripts/process-svg.js` (colors → `var(--color-0, currentColor)`)
→ svgr (`svgr.config.js`, keeps `viewBox`) → `generated/*.tsx` → tsc → `dist/`.
Run `pnpm build`. Never edit `generated/` by hand.
