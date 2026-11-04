# Heading

A section heading, `h1` to `h6`. Figma: FOUNDATIONS → Typography (Display,
Heading 1–4).

```tsx
<Heading as="h1">Sign up free</Heading>
<Heading as="h2" size="heading-4">Billing details</Heading>
```

## Props

| Prop | Default | |
|---|---|---|
| `as` | required | `h1` … `h6`: the heading's level in the page outline |
| `size` | from `as` | `display`, `heading-1` … `heading-4`: how it looks |

Native heading props (`id`, `aria-*`, `ref`, …) are passed to the element.
`className` and `style` are not accepted: the look is owned by the design
system.

## Level and size are separate

`as` is what the heading **is** and `size` is what it **looks like**. Screen
reader users jump between headings and read the outline by level, so the
level must follow the page structure (WCAG 1.3.1, 2.4.6), even when the design
wants a smaller or larger look.

`as` is required so the level is always a decision, never a default. `size`
defaults from the level:

| `as` | Default `size` |
|---|---|
| `h1` | `heading-1` |
| `h2` | `heading-2` |
| `h3` | `heading-3` |
| `h4`, `h5`, `h6` | `heading-4` |

`display` is never a default. It's for hero text and is chosen explicitly.

Rules of thumb:

- One `h1` per page, describing the page.
- Don't skip levels going down (`h2` → `h4`). Changing `size` is how you
  make a heading look smaller.
- Bold text that isn't a heading should use `Text`, not `Heading`. If it looks
  like a heading, it probably should be one.

## Why `as` only accepts heading tags

`as` is not the fully polymorphic pattern (any tag or component, props
inferred from it, as in Chakra or styled-components). It's a small fixed list
of tags, as in Polaris `Text` and Atlassian `Heading`:

- **Correct HTML.** `<Heading as="span">` or `as={Link}` wouldn't compile, so
  a Heading is always a real heading.
- **Simple types.** All six tags are the same `HTMLHeadingElement` with the same
  attributes, so one `ComponentProps<"h1">` type covers them. No generics, no
  slow type-checking or hard-to-read errors.
- **Easy to widen later.** Accepting more tags later breaks no one. Taking
  them away would be a breaking change.

A fully polymorphic `as` fits components that don't care what they render
(`Box`, layout primitives). To render another component, e.g. a router
`Link`, prefer `asChild` (Radix Slot pattern) to `as={Component}`.

## Styles

Always the heading font, strong weight and strong text color. Size, line
height and letter spacing come from the typography tokens, so
`data-typography="mobile"` scales Display, Heading 1 and Heading 2 down without
any prop. Display (-1px) and Heading 1 (-0.5px) have negative letter spacing,
the same px value in both modes, as in Figma.

No outer margin: spacing between a heading and its content belongs to the
parent layout.
