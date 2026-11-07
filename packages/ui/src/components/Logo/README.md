# Logo

The Prior logo: a brand-colored mark and the "prior" wordmark, as an inline
SVG.

```tsx
<Logo />

// As a link home: the link gets its accessible name from the logo
<a href="/">
  <Logo aria-label="Prior home" />
</a>
```

## Props

Native SVG props (`aria-label`, `aria-hidden`, `id`, …) are passed to the
`<svg>`. `className`, `style` and `children` are not accepted.

## Accessibility

`role="img"` with `aria-label="Prior"`, so screen readers announce it as one
image named "Prior" instead of reading its shapes. Override `aria-label` when
the context needs a different name, or pass `aria-hidden="true"` when the
brand name is already visible next to it. Logos are exempt from the WCAG
contrast minimum (1.4.3, 1.4.11).

## Colors

Colors come from tokens, so the logo follows the light/dark theme:

| Part | Token |
|---|---|
| Mark background | `--color-icon-brand` (`fill-brand`) |
| Mark letter | `--color-icon-strong-inverse` (`stroke-strong-inverse`) |
| Wordmark | `--color-text-strong` (through `currentColor`) |

## Why inline SVG, not an image file

- Colors can come from CSS variables, which an `<img src="logo.svg">` can't
  use. That's what makes it work in dark mode.
- No extra request, and the `ui` package needs no asset loader.
- The letters are strokes, not `<text>`, so they don't depend on a loaded font.

Export PNG copies for places that can't render SVG (email, Open Graph images).

## Size

32px high (113×32). There's no size prop yet. Add one when a screen needs
another size.

Not part of `@workspace/icons`: icons follow the 24×24 Feather grid and come
from Figma. The logo is brand identity.
