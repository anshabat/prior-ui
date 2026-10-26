# @workspace/ui

## Source of truth: Figma
- Design file: https://www.figma.com/design/vLd7saIPGNhXmCxIBlBTjI/Practical-UI-design-system
- Use the Figma MCP server to read components, variants and tokens from this file
  before implementing or changing anything in this package.

## Rules
- Implement components exactly as defined in Figma: sizes, spacing, radii,
  text styles (including font family), colors, shadows and states.
- Map Figma values to the existing tokens (`src/tokens`, `src/theme`).
  If a Figma value has no matching token, flag it; don't invent one.
- Do not add, simplify or "improve" styles. If you think a deviation from Figma
  is better, escalate it to the maintainer and wait for a decision.
