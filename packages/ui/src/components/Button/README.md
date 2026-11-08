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
| `loading` | `false` | Shows a spinner instead of the content and disables the button |

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

## Loading

```tsx
<Button type="submit" loading={isSubmitting}>Create account</Button>
```

- **The spinner replaces the content:** the label and icons become transparent
  and the `Loader` icon spins over them, at the icon size for the button size.
  The button keeps its width, so nothing around it moves.
- **Disabled while loading:** `loading` sets the native `disabled`, so the button
  can't be pressed again and gets the disabled look. `disabled={false}` doesn't
  re-enable it.
- **Accessibility:** the label stays in the accessibility tree, so the button is
  still named by it. The spinner is `aria-hidden`. Native `disabled` removes the
  button from the tab order, so focus is lost and nothing is announced: announce
  the progress or result in the app, e.g. in a live region.
- **Reduced motion:** with `prefers-reduced-motion: reduce` the spinner doesn't
  spin. The Loader's shape still reads as loading.

## Design decisions

### Padding is split between the button and the label

As in Figma, the button has the outer padding (12, 16, 24) and the label has its
own 4px on each side. On the side with an icon, only the outer padding applies.
This needs no "has an icon" variant: the two paddings add up without an icon and
the correct space appears with one.

### Loading state is not in Figma

Figma's Button has no loading state and there is no Spinner component. The
spinner is the Feather `Loader` icon from Figma's Icons page, spun with Tailwind's
`animate-spin`. It's a slot of Button until a second component needs a spinner;
then it becomes a public `Spinner`.

The content is hidden with `opacity-0`, not `invisible` or removed: those would
drop the label from the accessible name and change the button's width. The
spinner is positioned over the content (`absolute inset-0`), so the button's
layout doesn't change.

### Not implemented yet

An icon-only button is a separate Figma component ("Button icon").
