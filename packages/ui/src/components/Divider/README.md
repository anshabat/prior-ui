# Divider

A thin line that separates or groups content. With `children`, the line is split
around a short label. Figma: COMPONENTS → Divider, and the "Divider with text"
frame in EXAMPLES → Login.

```tsx
<Divider />
<Divider tone="strong" />
<Divider>OR</Divider>
```

## Props

| Prop | Default | |
|---|---|---|
| `tone` | `"weak"` | `weak`, `strong`. Figma: "Type" |
| `children` | | Optional label, centered on the line |

Native props (`id`, `aria-*`, …) are passed to the root. `className` and `style`
are not accepted. Divider has no outer margin: the parent sets the space around
it (see `Stack`).

## Accessibility

| | Element | Screen reader |
|---|---|---|
| No label | `<hr>` | A separator, from the native element |
| With label | `<div>` | The label as ordinary text |

- **A labeled divider has no `role="separator"`.** In WAI-ARIA, the children of a
  separator are presentational, so the label would be removed from the
  accessibility tree. "OR" between two ways to log in is content, and it should
  be read. MUI does use `role="separator"` here; we chose the label over the role.
- **`<hr>` can't have children** (HTML spec: its content model is nothing), which
  is why the root changes.

## Casing

The label is displayed as written, and there is no uppercase option. Figma's "OR"
is typed in capitals with the Small/Regular text style, not the Uppercase one.

## Design decisions

### One component with an optional label

The label only changes how the line is drawn, not what the component is for, so
it is `children` and not a second `DividerWithText`. MUI and Ant Design do the
same. Radix `Separator` has no label.

### `line + label + line`, not a label on top of a line

Figma draws one line and puts a white label over it. That only works on one
background: on any other surface, in dark mode or on a raised card, the box would
show. A flex row with two lines needs no background at all.

### Differences from Figma

- **Line:** Figma fills a 1px box with the stroke color. Here it's a 1px top
  border, because stroke colors are exposed through `border-*` utilities only.
- **Spacing:** Figma's frame includes 16px of padding above the label. Divider has
  no outer spacing, so the parent adds it.

### Not implemented yet

Vertical dividers and label alignment (start, end) are left out until a product
needs them. Adding a prop later is easy; removing one is a breaking change.
