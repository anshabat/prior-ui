# Link

A text link that takes people to another page or another part of the same
page. Figma: COMPONENTS → Text link.

```tsx
<Link href="https://example.com">Plain link</Link>

<Text size="tiny" tone="weak">
  Already have an account?{" "}
  <Link href="/sign-in" size="tiny">
    Log in
  </Link>
</Text>
```

## Props

| Prop        | Default   |                                                                                            |
| ----------- | --------- | ------------------------------------------------------------------------------------------ |
| `href`      |           | Required                                                                                   |
| `tone`      | `"brand"` | `brand`, `neutral-strong`, `neutral-weak`, `destructive`, `inverse-strong`, `inverse-weak` |
| `size`      | `"small"` | `large` (20/28), `small` (16/24), `tiny` (14/20)                                           |
| `weight`    | `"weak"`  | `weak` (400), `strong` (600)                                                               |
| `underline` | `true`    | Hover and press flip it                                                                    |

Native `<a>` props (`target`, `aria-*`, `ref`, …) are passed to the element.
`className` and `style` are not accepted.

`tone="brand"` is Figma's "Default" tone, named as in `Button`.

## Underline

Keep it on for links inside text. Color alone can't be the only thing that
marks a link (WCAG 1.4.1). `underline={false}` is for places where the context
already shows it's a link, like a navigation list.

## Router links

Link always renders a plain `<a>`, so in an app with a router it causes a full
page reload. Router support is the next step: see the options below.

## Differences from Figma

- **Disabled state: not implemented.** HTML has no disabled link, and a link
  that can't be followed is usually better shown as plain text. If it's ever
  needed, the accessible form is `aria-disabled="true"` with no `href`.
- **Icons: not implemented.** Figma has start and end icons. They wait for a
  real use case.
- **`large` size: added.** Figma's Text link has only Small and Tiny. `large`
  matches `Text`, so a link inside large text has the same size and font.
- **Underline style.** Figma uses the font's underline position. We use the
  browser default, which looks almost the same with less CSS.

## The problem: `ui` can't depend on a router

Apps use different routers: `apps/auth` uses `react-router-dom`,
`apps/demo-next` uses `next/link`. `packages/ui` must not import either. A plain
`<a href>` causes a full page reload instead of client-side navigation, so
Link (and any other `ui` component that navigates) needs a way to render the
app's link component.

## Options

### 1. Fully polymorphic `as`

`as` accepts any tag or component, and the props are inferred from it with
generics (Chakra, MUI `component`, styled-components).

```tsx
<Link as={RouterLink} to="/sign-in">
  Log in
</Link>
```

- ✅ One component, and the props are type-checked against `as` (`to` is required).
- ❌ Complicated generic types: slower type-checking, hard-to-read errors, `ref` typing is tricky.
- ❌ Link's own props and the router's props live on one object, so a name like
  `size` or `replace` can collide.
- ❌ Too wide: `as="button"` compiles, and Link stops being a link.

### 2. `asChild` (Slot pattern)

Link renders its child instead of its own element and merges its props, class
and ref into it (Radix, shadcn/ui, Chakra v3).

```tsx
<Link asChild>
  <RouterLink to="/sign-in">Log in</RouterLink>
</Link>
```

- ✅ Simple types: the child keeps its own types, and Link only types its own props.
- ✅ No prop collisions: router props stay on the router's element.
- ✅ Same API for every router, and the same Slot works for overlay triggers
  (Tooltip, Popover, Menu, Dialog) later.
- ❌ More code at each call site, and it only works with a single child.
- ❌ Merging props correctly is subtle: event handlers must be chained,
  `className` concatenated, refs combined.

### 3. Link provider

The app registers its link component once, and every `ui` component that
renders links uses it (React Aria `RouterProvider`, Polaris
`AppProvider linkComponent`).

```tsx
<UiProvider linkComponent={RouterLink}>…</UiProvider>
<Link href="/sign-in">Log in</Link>
```

- ✅ The best API at the call site, and it works for components that generate many
  links themselves (Breadcrumbs, Pagination, SideNav).
- ❌ Hidden dependency on the provider: forget it and links quietly turn into
  full page reloads.
- ❌ The router's own props (`replace`, `prefetch`, `state`) don't fit a
  shared `href` API.

## Decision

- **Today, Link renders a plain `<a>`.** That works for external URLs and apps
  without a router.
- **Planned: `asChild`.** The Slot is written once and reused for Button-as-link
  and overlay triggers.
- **Add a provider later**, only when a component that generates its links from data
  (Breadcrumbs, which hardcodes `<a href>` today) needs it.
- **No fully polymorphic `as`.**

## Still to decide

- **The Slot itself:** write our own (about 30 lines, good for learning) or use
  `@radix-ui/react-slot`.
- **External links** (`target="_blank"`): add an icon and visually hidden
  "(opens in a new tab)" text.
- **Button that navigates:** it should be Button with `asChild` wrapping a link, not
  Link styled as a button. The element stays `<a>`, so assistive tech announces it
  as a link (WCAG 4.1.2).
