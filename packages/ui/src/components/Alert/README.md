# Alert

An inline message about the page or a section of it: an error, a warning, a
confirmation, or neutral information. Figma: COMPONENTS → Alert.

```tsx
<Alert tone="error" title="Payment failed">
  Your card was declined. Try another card.
</Alert>
```

## Props

| Prop | Default | |
|---|---|---|
| `tone` | required | `error`, `warning`, `success`, `information` |
| `size` | `"large"` | `small`, `large` |
| `orientation` | `"horizontal"` | `horizontal` (icon beside the text), `vertical` (icon above it). Figma: "Layout" |
| `title` | | Optional bold first line |
| `children` | | The description |
| `onDismiss` | | Renders the dismiss button when set |
| `dismissLabel` | `"Dismiss"` | Accessible name of the dismiss button, override for i18n |

Native `div` props (`id`, `role`, `aria-*`, …) are passed to the root.

The icon and the accent bar on the start edge are always shown. Figma's "Icon"
and "Border left" toggles are intentionally not props.

## Icons

Each tone has a fixed icon (`XOctagon`, `AlertTriangle`, `CheckCircle`,
`Info`), so the meaning doesn't depend on color alone (WCAG 1.4.1). It is always
shown and can't be replaced: an error looks like an error in every product.

The icon is `aria-hidden`. The title and description must say what happened.

## Dismissing

Alert has no state. It renders the button and calls `onDismiss`; the app removes
the alert. This keeps the component server-safe, but a server component can't
pass a function, so a dismissible alert lives in a client component.

When the alert disappears, focus on the button is lost. If the alert came before
other content, move focus to a sensible place (the next heading, the form).

## Live regions

There is no `role` by default:

- **Static alert**, rendered with the page: no role. It is ordinary content and
  is read in document order.
- **Appears after an action** (save failed, item deleted): pass
  `role="alert"` for urgent messages (interrupts the screen reader) or
  `role="status"` for confirmations (waits for a pause).

`role="alert"` on every alert would make each one announce itself on page load and
whenever a server-rendered page re-renders. This is the approach of GOV.UK,
Atlassian and Primer.

## Design decisions

### API

| Concept | MUI | Primer `Banner` | Polaris `Banner` | Here |
|---|---|---|---|---|
| Color meaning | `severity` | `variant` | `tone` | `tone`, as in `Button` |
| Bold line | `AlertTitle` child | `title` | `title` | `title` |
| Close | `onClose` | `onDismiss` | `onDismiss` | `onDismiss` |
| Icon | `icon` / `icon={false}` | `leadingVisual` | `icon` | None, fixed per tone |

Dismissibility comes from the handler, not a separate `dismissible` boolean: a
close button that does nothing can't be rendered by mistake.

### Layout

The root is a grid with three columns, `icon | text | dismiss`, and the parts are
its direct children. The only wrapper is around the dismiss button (see below):

```
horizontal                     vertical
[icon][title      ][X]         [icon][        ][X]
      [description]            [title    (all columns)]
                               [description (all)     ]
```

- **Spacing is item margins, not column gaps.** A missing dismiss button leaves
  an empty `auto` column that is 0px wide. A column gap would still add space
  before it.
- **The dismiss button is a grid item, not absolutely positioned.** Its space is
  part of the layout, so text can never run under it in horizontal alerts.
- **Alert places the dismiss button, `DismissButton` styles it.** Alert wraps
  the button in a `div` that holds only grid placement and margin. The internal
  `DismissButton` holds only its own look (reset, icon color, focus ring) and
  takes no `className`, so the two never mix. The wrapper is `flex` so it has no
  line box and stays as tall as the button.
- `minmax(0, 1fr)` lets the text column shrink below its content width, so long
  words wrap instead of widening the alert.

### Differences from Figma

Code quality comes first (see `packages/ui/AGENTS.md`), so the layout uses one
grid for every size and orientation and accepts these small differences:

- **Text alignment with the icon:** Figma nudges the text 2px down so its first
  line centers on the icon. Here the icon and text are top-aligned.
- **Space before the dismiss button:** always 12px. Figma uses 0 on large
  alerts, where the text can touch the button.
- **Large vertical:** the text spans under the dismiss button, as in Figma's
  small vertical. Figma's large vertical reserves the button's width there.

### Tones not implemented yet

Figma also has `neutral`, `brand`, `inverse-neutral` and `inverse-brand`. They are
left out until a product needs them: each tone is public API, and removing one
later is a breaking change, while adding one isn't.
