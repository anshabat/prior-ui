# Button

Triggers an action. Renders a native `<button>`. Figma: COMPONENTS → Button.

```tsx
<Button onClick={save}>Save</Button>
<Button variant="secondary" tone="neutral" startIcon={<GoogleBrand />}>
  Log in with Google
</Button>
```

## Props

| Prop | Default | |
|---|---|---|
| `variant` | `"primary"` | `primary`, `secondary`, `tertiary`. Figma: "Type" |
| `tone` | `"brand"` | `brand`, `neutral`, `destructive`, `inverse` |
| `size` | `"large"` | `small`, `medium`, `large` |
| `startIcon`, `endIcon` | | An icon before or after the label |

Native button props (`type`, `onClick`, `disabled`, `aria-*`, …) are passed to the
`<button>`. `className` and `style` are not accepted.

A button stretches to fill a parent that stretches its children, like `Stack`, so
there is no `fullWidth` prop.

## Icons

The prop names match `Input`. They are `start` and `end`, not `left` and `right`,
because the row follows the text direction: in a right-to-left page `startIcon` is
on the right.

| Size | Icon | Space to the label |
|---|---|---|
| `small` | 16px | 4px |
| `medium` | 20px | 8px |
| `large` | 24px | 8px |

- **Size is forced:** `[&_svg]:size-full` makes the icon fill its slot, so callers
  don't size it.
- **Color is inherited:** icons draw with `currentColor`, so they follow the
  button's text color, including `disabled`. Multi-color icons like `GoogleBrand`
  keep their own colors, also when disabled.
- **Accessibility:** icons from `@workspace/icons` are `aria-hidden`. The label
  names the button.

## Design decisions

### Padding is split between the button and the label

As in Figma, the button has the outer padding (12, 16, 24) and the label has its
own 4px on each side. On the side with an icon, only the outer padding applies.
This needs no "has an icon" variant: the two paddings add up without an icon and
the correct space appears with one.

### Not implemented yet

An icon-only button is a separate Figma component ("Button icon").
