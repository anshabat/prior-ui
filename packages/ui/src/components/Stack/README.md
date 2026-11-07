# Stack

Lays out its children in a column or a row with a fixed gap from the spacing
scale. It is the only place spacing between siblings is set: components have
no outer margin.

```tsx
<Stack gap="48">
  <Stack as="hgroup" gap="8">
    <Heading as="h1">Welcome</Heading>
    <Text tone="weak">Log in to your account</Text>
  </Stack>
  <form>…</form>
</Stack>

<Stack direction="row" gap="8" align="center">
  <Button>Save</Button>
  <Button variant="secondary">Cancel</Button>
</Stack>
```

## Props

| Prop        | Default     |                                                                                    |
| ----------- | ----------- | ---------------------------------------------------------------------------------- |
| `as`        | `"div"`     | Any HTML element: `ul`, `hgroup`, `form`, `a`, …                                   |
| `direction` | `"column"`  | `column`, `row`                                                                    |
| `gap`       | `"0"`       | Spacing token: `0`, `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `56`, `64` |
| `align`     | `"stretch"` | Cross axis: `start`, `center`, `end`, `stretch`, `baseline`                        |
| `justify`   | `"start"`   | Main axis: `start`, `center`, `end`, `between`                                     |

The props of the `as` element (`href` for `a`, `onSubmit` for `form`, `ref`,
`aria-*`, …) are typed for that element and passed to it. `className` and
`style` are not accepted.

## Why one component with `direction`

Atlassian (`Stack`/`Inline`), Braid and Polaris (`BlockStack`/`InlineStack`)
split vertical and horizontal layout into two components, so each one can
have its own defaults. MUI `Stack` and Radix Themes `Flex` use one component
with a direction prop. We chose one component: a single API to learn, and the
defaults are the CSS flexbox defaults.

## Gap

Values are spacing token names, the same numbers Figma uses, so a spec maps
straight to a prop. Only the scale up to 64 is allowed: larger distances are
page layout, not spacing between siblings.

## Why no margin props

Spacing belongs to the parent. A component never pushes its neighbours away;
the Stack around it sets the distance with `gap`. To put space between two
blocks, wrap them in a Stack instead of adding a margin.

## Element (`as`)

Stack is a layout, not a semantic element, so it can be any of them. It uses
the polymorphic component pattern with HTML elements only: the type of `as`
decides which props and which `ref` type are allowed.

```tsx
<Stack as="ul" gap="8">
  <li>…</li>
</Stack>

<Stack as="form" gap="24" onSubmit={handleSubmit}>…</Stack>
```

The types come from `PolymorphicProps` in `src/types/polymorphic.ts`, which
other components can reuse.

### Why only HTML elements

The full pattern also accepts components (`as={Button}`, as Chakra and Mantine
do). We don't, for two reasons:

- `as` is used twice: `<Stack as={Heading}>` takes the `as` Heading needs, so
  Heading crashes, and `<Stack as={Text}>` can only ever render a `<p>`.
- Both components would style one element, so one side loses its classes.

To lay out our components, nest them in a Stack:

```tsx
<Stack direction="row" gap="8">
  <Heading as="h2">Title</Heading>
  <Button>Save</Button>
</Stack>
```

### `asChild`

Not supported yet. `asChild` (Radix) merges a component's props into its only
child, so a component such as `motion.div` can carry Stack's layout without
an extra element. It is planned together with `Link` (see the `Link` README).
Until then, nest: put the Stack inside the component.

## Not included yet

- `wrap` for rows that should wrap onto several lines.
- Responsive values (`gap={{ base: "16", md: "24" }}`).
