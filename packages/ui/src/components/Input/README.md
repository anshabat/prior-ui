# Input

A single-line text control. Renders a native `<input>` inside a positioning
`<div>` (the same structure with or without icons) and accepts all native input
props except the ones the design system owns.

```tsx
<label htmlFor="email">Email</label>
<Input id="email" type="email" name="email" required />
```

Input has no label of its own: link a `<label>` or pass `aria-label`. A
placeholder is not a label: it disappears on typing and many screen readers
don't treat it as a name.

## Props

| Prop | Default | Notes |
|---|---|---|
| `size` | `"medium"` | `"small"` (32px) or `"medium"` (48px), matching Button's heights and text sizes. Replaces the native `size` attribute (width in characters) |
| `type` | `"text"` | Any native text-like type: `email`, `password`, `search`, … |
| `startIcon`, `endIcon` | — | An icon or an icon button inside the input (see Icons) |
| `className`, `style` | — | Not accepted: the input's look is owned by the design system |

Everything else (`name`, `value`, `required`, `disabled`, `aria-*`, `ref`, …) is
passed to the `<input>`.

## States

| State | Triggered by | Look |
|---|---|---|
| Rest | — | White background, strong border |
| Focus | `:focus-visible` | 2px focus outline, 2px offset |
| Disabled | `disabled` | Disabled border, text and placeholder; `not-allowed` cursor |
| Invalid | `aria-invalid="true"` | Error background, 2px error stroke |

There is no hover or press state: an approved deviation from Figma (white at
rest, focus ring only), as in shadcn/ui and Stripe.

## Icons

```tsx
<Input aria-label="Search" name="q" startIcon={<Search />} />
<Input aria-label="Search" name="q" endIcon={<button type="button" aria-label="Clear" onClick={…}><X /></button>} />
```

- **Overlay, not a frame.** Icons are absolutely positioned over the input's
  own padding; the input keeps its border and states. Padding is either/or per
  side: the edge padding alone, or edge + icon + gap so the text clears the
  icon (Figma: medium 16px edge + 24px icon + 8px gap = 48px; small
  12 + 16 + 4 = 32px).
- **Centered with flex.** The slot is `flex`, so the icon is a flex item
  rather than inline content; an inline `<svg>` sits on the text baseline and
  the space left below it shifts the icon off center.
- **Clicks.** A plain icon is `pointer-events-none`, so clicking it focuses the
  input underneath, without JavaScript. A slot that contains a `<button>` takes
  clicks (`has-[button]:pointer-events-auto`).
- **Accessibility belongs to the content.** Icons from `@workspace/icons` are
  `aria-hidden` by default; an icon button needs its own `aria-label`.
- **Size is forced, color is a default.** The slot's size is layout (the padding
  is calculated for it), so the icon is made to fill it: `*:size-full` sizes the
  direct child (an icon or a button), and `[&_svg]:size-full` gives an icon
  nested in a button the same size. These selectors are more specific than a
  size class on the element itself, so they win. The color is inherited:
  the slot sets `text-icon-neutral` (`text-icon-disabled` when disabled), and
  icons draw with `currentColor`, so an icon's own color class or `color` prop
  still wins.

### Why not a frame wrapper

An earlier version moved the border and states to a wrapper `<div>` and made
the `<input>` bare inside it, so content could sit beside the input within one
border (an attached button). Without that need, the overlay is simpler:

- The input keeps its own state selectors (`focus-visible:`, `disabled:`, …).
  A frame has to watch its child with `:has()`, and must target the input
  specifically (`:has(input:focus-visible)`, not `:focus-within`, which would
  also light up when a focusable element inside the frame is focused).
- `ref` and the browser's autofill background apply to the visible box, not to
  a bare element inside it.

## Invalid state

### Styled through `aria-invalid`

Screen readers announce "invalid entry" from `aria-invalid`. Styling the same
attribute keeps the visual state and the announced state in sync: one can't
change without the other. Pair it with a visible error message linked through
`aria-describedby`, so users know what to fix (WCAG 3.3.1).

### Why not `:invalid` or `:user-invalid`

- `:invalid` follows browser validation, so a `required` field is red as soon
  as the page loads, before the user has done anything.
- `:user-invalid` waits for interaction, but still only knows browser rules.
  It can't show server or async errors ("email already in use").

Whether a field is valid is decided by the application, so the application
sets `aria-invalid`.

### `aria-[invalid=true]`, not `aria-invalid`

The selector `[aria-invalid]` matches whenever the attribute exists, including
`aria-invalid="false"` (React renders `aria-invalid={false}` that way) and the
`"grammar"` / `"spelling"` values. Matching `="true"` lets consumers pass
`false` safely.

### The `enabled:` prefix

`disabled:` and `aria-[invalid=true]:` selectors have the same specificity, and
Tailwind emits `aria-*` rules after `disabled:`, so a disabled invalid input
would stay red. `enabled:aria-[invalid=true]:` only matches enabled inputs, so
disabled always wins.

### The 2px stroke without layout shift

Figma's error stroke is 2px. A 2px border would push the text 1px inward, so
the stroke is a 1px border plus a 1px inset ring (`ring-1 ring-inset`), which
is drawn with `box-shadow` and takes no space.

## Accessibility

- **Focus uses `outline`, not `box-shadow`.** In Windows forced-colors (high
  contrast) mode, box shadows are removed but outlines stay visible.
- **`:focus-visible`** always matches on text inputs (keyboard and mouse both
  show it), so for Input it behaves like `:focus`. It's used for consistency
  with Button, where it only shows for keyboard focus.
- **Contrast.** The border needs 3:1 against the background (WCAG 1.4.11).
  Disabled text is exempt from text contrast rules (WCAG 1.4.3), but is kept
  readable on purpose.

## Implementation notes

- **No preflight dependency.** `dist/tailwind.css` (used by non-Tailwind apps)
  is built without Tailwind's reset, so the input resets the browser defaults
  it relies on itself: `box-border`, `border-solid`, `placeholder:opacity-100`
  (Firefox dims placeholders by default) and `appearance-none` (Safari draws
  `type="search"` as a native search field otherwise).
- **Props order.** `className` is set before the native props spread, as in
  every `ui` component (see `AGENTS.md`). A `className` that bypasses the types
  (for example a spread from untyped code) replaces the input's styles.
- **Autofill.** Browsers paint autofilled inputs with their own background
  using `!important`. That is left as is: it tells the user the browser filled
  the value, and the border and error message still show.
