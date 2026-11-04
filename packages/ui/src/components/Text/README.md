# Text

Body text: paragraphs, descriptions, inline text. Figma: FOUNDATIONS →
Typography (Small, Tiny, and Heading 4/Regular as `large`).

```tsx
<Text>Log in to your account</Text>
<Text size="tiny" tone="weak">By signing up you agree to our terms.</Text>
<Text as="span" weight="strong">Free</Text>
```

## Props

| Prop | Default | |
|---|---|---|
| `as` | `"p"` | `p`, `span`, `div` |
| `size` | `"small"` | `large` (20/28), `small` (16/24), `tiny` (14/20) |
| `weight` | `"weak"` | `strong` (600), `weak` (400) |
| `tone` | `"strong"` | Text color: `strong` (main text), `weak` (secondary text) |

Native props (`id`, `aria-*`, …) are passed to the element. `className` and
`style` are not accepted: the look is owned by the design system.

## Text vs Heading

Text is never a heading, however large or bold. If it titles a section, use
`Heading`. If it doesn't, don't make it look like one.

## Sizes

`small` is the default body size. `large` is Figma's "Heading 4/Regular": the
heading font at the Heading 4 size, used for lead paragraphs under a page
title. It shares Heading 4's tokens, so it scales with them.

## Uppercase

There is no uppercase size or prop (see `css/tokens/typography.css`). Uppercase
labels aren't part of the current design system.

## `as`

The same small list of tags as in `Heading` (see its README for why not a fully
polymorphic `as`). `label` is not included: labels belong to `Field`. For
emphasis inside text, nest native `<strong>` or `<em>`.

`ref` is not accepted. The three tags have different element types
(`HTMLParagraphElement`, `HTMLSpanElement`, `HTMLDivElement`) and TypeScript
can't type one ref for all of them without a cast. Add it when a use case
appears. It's a non-breaking change.

## Styles

No outer margin: spacing between paragraphs belongs to the parent layout.
