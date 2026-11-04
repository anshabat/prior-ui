# Stack

Lays out its children in a column or a row with a fixed gap from the spacing
scale. It is the only place spacing between siblings is set: components have
no outer margin.

```tsx
<Stack gap="48">
  <Stack gap="8">
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
| `direction` | `"column"`  | `column`, `row`                                                                    |
| `gap`       | `"0"`       | Spacing token: `0`, `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `56`, `64` |
| `align`     | `"stretch"` | Cross axis: `start`, `center`, `end`, `stretch`, `baseline`                        |
| `justify`   | `"start"`   | Main axis: `start`, `center`, `end`, `between`                                     |

Native `div` props (`id`, `aria-*`, `ref`, …) are passed to the element.
`className` and `style` are not accepted.

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

## Element

Always a `div` for now. Rendering other elements (`section`, `hgroup`, `ul`,
…) will come with the polymorphic `as` prop.

## Not included yet

- `wrap` for rows that should wrap onto several lines.
- Responsive values (`gap={{ base: "16", md: "24" }}`).
