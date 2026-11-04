# Link

> **Status: not implemented.** These are design notes, kept here so the
> decisions aren't lost when we build the component.

A text link that navigates to another page or place. First use: "Already have
an account? **Log in**" on the auth pages.

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
<Link as={RouterLink} to="/sign-in">Log in</Link>
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

## Recommendation

- **Link: `asChild`.** We'll write the Slot once and reuse it for Button-as-link and
  overlay triggers.
- **Without `asChild`, Link renders a plain `<a>`.** That works for external URLs and
  apps without a router.
- **Add a provider later**, only when a component that generates its links from data
  (Breadcrumbs, which hardcodes `<a href>` today) needs it.
- **No fully polymorphic `as`.**

## Decide when building

- **The Slot itself:** write our own (about 30 lines, good for learning) or use
  `@radix-ui/react-slot`.
- **External links** (`target="_blank"`): add an icon and visually hidden
  "(opens in a new tab)" text, and set `rel="noopener noreferrer"`.
- **Variants** from Figma: color, size, underline, and the visited state.
- **Button that navigates:** it should be Button with `asChild` wrapping a link, not
  Link styled as a button. The element stays `<a>`, so assistive tech announces it
  as a link (WCAG 4.1.2).
