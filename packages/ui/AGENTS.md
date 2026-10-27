# @workspace/ui

## Sources of truth
- **Tokens:** the CSS tokens (`src/tokens`) and the Tailwind theme (`src/theme`)
  are the source of truth for every design value: colors, spacing, radii,
  typography, shadows.
- **Components:** the Figma design file is the source of truth for component
  structure, variants and states.
  - Design file: https://www.figma.com/design/vLd7saIPGNhXmCxIBlBTjI/Practical-UI-design-system
  - Use the Figma MCP server to read components, variants and states from this
    file before implementing or changing anything in this package.

## Rules
- Match Figma's component structure exactly: variants, states, layers and
  which property each value applies to (fill, stroke, text, shadow, size,
  spacing, radius, text style).
- Take each value from the tokens, not from Figma. Figma tells you which token
  role to use; the token decides the actual value, even when it differs from Figma.
- Style components only with the existing tokens, through the Tailwind classes
  the theme generates. No hardcoded values or arbitrary values (`bg-[#…]`, `p-[13px]`).
- Do not change, rename or add tokens in `src/tokens` or `src/theme` while
  building components.
- If a Figma value differs from the tokens, use the closest matching token.
  If no token is a close match, stop and escalate to the maintainer with the
  Figma value and the closest candidates; don't invent a token or a value.
- Do not add, simplify or "improve" styles. If you think a deviation from Figma
  is better, escalate it to the maintainer and wait for a decision.
