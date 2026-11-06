# Slot

Internal, not exported from the package. It powers the `asChild` prop: a
component renders `Slot` instead of its own element, and Slot renders the
component's only child with the component's props merged into it.

```tsx
<Link asChild tone="neutral-weak">
  <RouterLink to="/sign-in">Log in</RouterLink>
</Link>
// Renders one <a> with Link's classes and the router's behaviour
```

The child must be a single element. Anything else throws an error.

## How props are merged

| Prop                           | Result                                   |
| ------------------------------ | ---------------------------------------- |
| `className`                    | Slot's wins. The child's is ignored      |
| `on*` handlers                 | Both run: the child's first, then Slot's |
| Anything else, including `ref` | The child's value wins                   |

### Why Slot's `className` wins

Radix joins both values, which suits open systems where people style components
themselves. Our styling API is closed, so a child's classes must not change how
a component looks, and without class merging two classes for one property would
be decided by stylesheet order.

The cost: a child's `className` is ignored without a warning, including an
app's own class and the function form of React Router's `NavLink`. To keep one,
put it on a wrapper element.

### `ref` isn't combined

With a `ref` on both the component and the child, the component's stays `null`.
That's fine while only the app sets refs. A component that needs the element
itself, like a tooltip trigger, will need Slot to set both refs.
