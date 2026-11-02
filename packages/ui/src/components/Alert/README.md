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

### Values without a token

Figma uses 2px and 28px for icon alignment, and neither is a spacing token. The
classes compute them from the tokens they come from instead of hardcoding them:

- Large horizontal: the icon box is `var(--line-height-heading-4)` tall, so the
  icon centers on the title line.
- Small horizontal: the text is offset by `(icon 24 − line-height tiny 20) / 2`.

If the type scale changes, the alignment follows.

### Tones not implemented yet

Figma also has `neutral`, `brand`, `inverse-neutral` and `inverse-brand`. They are
left out until a product needs them: each tone is public API, and removing one
later is a breaking change, while adding one isn't.
