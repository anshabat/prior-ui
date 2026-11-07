# @workspace/icons

Turns the SVG files in `svg/` into typed React components.

```tsx
import { Search } from "@workspace/icons";

<Search className="size-16 stroke-neutral" />
```

Every icon renders an inline `<svg>` and accepts all SVG props (`className`,
`width`, `aria-*`, …) plus color props (see "Coloring an icon"). Authoring rules
for new icons are in `AGENTS.md`.

## How it works

`pnpm build` runs four stages:

| Stage | Tool | Input → output | What it does |
|---|---|---|---|
| 1. Clean | `rimraf` | | Empties `dist/` and `generated/`, so removed icons don't linger |
| 2. Process | `scripts/process-svg.js` (svgo) | `svg/` → `dist/svg/` | Replaces every color with a CSS variable that falls back to the original: `stroke="currentColor"` → `stroke="var(--color-0, currentColor)"` |
| 3. Generate | svgr (`svgr.config.js`) | `dist/svg/` → `generated/` | Turns each SVG into a `.tsx` component and writes `generated/index.tsx` |
| 4. Compile | `tsc` | `index.ts` + `generated/` → `dist/` | Emits the JS and `.d.ts` files that apps import |

`svg/` is the only source. `generated/` is build output: never edit it by hand.

## `svgr.config.js`

svgr converts an SVG file into a React component. The config decides what that
component looks like:

- **Output:** TypeScript (`.tsx`) files in `generated/`, using the automatic JSX
  runtime (no `import React`).
- **`template`:** the code wrapped around every SVG. It adds the color props
  `color`, `color2`, `color3`, `color4`, which set the `--color-0`…`--color-3`
  variables from stage 2, merges them into `style`, and spreads all other props
  onto the `<svg>`.
- **`svgProps`:** puts `style={iconStyle}` on the root `<svg>`, so the variables
  from the template reach the element.
- **`svgoConfig`:** svgr optimizes every SVG with svgo's default preset, which
  removes `viewBox` when `width`/`height` are set. That's turned off: without a
  `viewBox` an icon is cropped instead of scaled when you resize it.

## Coloring an icon

**Single-color icons** (all current icons except `GoogleBrand`) have one color,
`currentColor`.
Two ways to set it:

- **Class (preferred in components):** `className="stroke-error"`. CSS beats
  the SVG attribute, so the token utility wins. Filled icons like `Github` have
  no stroke: set their color through the surrounding text color instead.
- **Prop:** `color="red"` sets `--color-0`, which the generated `stroke`
  attribute reads before falling back to `currentColor`.

With neither, the icon takes the surrounding text color.

**Multi-color icons** (for example brand icons) are supported too. Stage 2 gives
each distinct color in the SVG its own variable, in order of appearance:
`--color-0`, `--color-1`, … Each keeps its original color as the fallback, and
can be overridden with `color`, `color2`, `color3`, `color4`:

```tsx
<GoogleBrand />                              // original colors
<GoogleBrand color="white" color2="black" /> // first two colors overridden
```
