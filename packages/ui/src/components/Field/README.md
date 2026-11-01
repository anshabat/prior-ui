# Field

Wraps a form control with a label, an optional description and an optional
error, and wires the accessibility relationships between them. Works with any
control that accepts native input props (`Input`, later `Textarea`, `Select`).

```tsx
<Field label="Email" description="We'll never share it" error={error} required>
  {(control) => <Input {...control} type="email" name="email" />}
</Field>
```

## Parts

| Component | Element | Role |
|---|---|---|
| `Field` | `div` | Generates ids, computes the control's aria props, owns the layout |
| `FieldLabel` | `label` | Label text plus the required `*` marker |
| `FieldDescription` | `p` | Helper text. `id` is required |
| `FieldError` | `p` | Error message with an icon. `id` is required |

`Field` renders the parts itself. They are also exported for custom layouts,
where you wire `htmlFor`, `id` and `aria-describedby` yourself.

## What Field guarantees

- **Linked ids.** The control id comes from `useId()` (works in server
  components and matches between server and client render). The description
  and error ids are derived from it: `${id}-description`, `${id}-error`.
- **Optional `id` override.** Needed when something outside the field must point
  at the control, for example an error summary with `<a href="#email">` links,
  or a deep link like `/settings#email`. Set it on `Field`, never on the
  control, or the label stops pointing at it.
- **`aria-describedby` lists only rendered parts**, and is `undefined` when there
  are none. Browsers skip ids that don't exist, but accessibility checkers (axe)
  flag them, and if every id is missing the description is empty.
- **Invalid is derived from `error`.** There is no `invalid` prop: a control gets
  `aria-invalid` only when an error message is shown (WCAG 3.3.1), so "red
  without an explanation" can't happen.
- **One prop, every part.** `required` adds the label's `*` and the control's
  native `required`; `disabled` dims the label and disables the control.

## Using the render prop

`children` receives `{ id, aria-describedby, aria-invalid, required, disabled }`.

Spread it **first**, then your own props:

```tsx
{(control) => <Input {...control} type="email" />}
```

`control` contains keys whose value is `undefined` (for example `disabled`).
Spread last, it would overwrite props you set yourself.

## Accessibility

A screen reader reads a field with a description and an error as:
*"Email, required, invalid entry, edit text. We'll never share it. Enter a valid email."*

- **The `*` is `aria-hidden`.** "Required" is announced from the native
  `required` attribute on the control. Without `aria-hidden` it would read
  "Email star, required".
- **The error icon** makes the error visible without relying on color
  (WCAG 1.4.1). It is `aria-hidden` because the text already carries the meaning;
  otherwise some screen readers announce "image".
- **No `role="alert"` on the error.** The message is read through
  `aria-describedby` when the control gets focus. A live region would announce
  every error at once when a server-validated form re-renders after submit.
  Announcing a summary or moving focus to the first error is the form's job.
- **The error sits between the label and the control**, as in Figma (also the
  GOV.UK pattern): it stays visible to screen magnifier users and isn't covered
  by the mobile keyboard. DOM order matches visual order (WCAG 1.3.2).

## Design decisions

### Render prop instead of context

UI components in this package must render in React Server Components, and
`createContext` / `useContext` require a client component (`"use client"`).

| Option | Problem |
|---|---|
| Context (`<Field><FieldControl /></Field>`) | Client-only |
| `cloneElement` on `children` | Hidden prop injection, breaks with wrapper components, discouraged by the React docs |
| Render prop (`children(control)`) | None for RSC: `Field` is a shared component, so the function runs during the same server render and never crosses the server–client boundary |

The render prop is the "prop getter" pattern (Downshift, React Aria, TanStack):
every injected prop is visible at the call site.

Because `Field` renders all parts itself, it knows which ones exist. A
context-based design needs parts to register with the parent after mounting,
which requires effects and therefore a client component.

### Either/or color variants

`tailwind-variants/lite` doesn't merge classes. `text-strong` and
`text-disabled` have the same specificity, so if both were applied, whichever
comes later in the generated CSS would win, regardless of order in `className`.
`FieldLabel` therefore keeps color out of `base` and sets it in mutually
exclusive variants: `disabled: { false, true }`.

### Closed styling API

No part accepts `className` or `style` (`Omit<ComponentProps<…>, "className" | "style">`).
Layout spacing comes from `Field`, and parts have no outer margin (`m-0`), so
they also work in custom layouts.
