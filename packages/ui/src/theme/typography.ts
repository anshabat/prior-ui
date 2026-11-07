const sizes = [
  "display",
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "small",
  "tiny",
];

const letterSpacingSizes = ["display", "heading-1"];

export const typography = {
  fontFamily: {
    heading: "var(--font-family-heading)",
    body: "var(--font-family-body)",
  },
  fontWeight: {
    strong: "var(--font-weight-strong)",
    weak: "var(--font-weight-weak)",
  },
  fontSize: Object.fromEntries<
    [string, { lineHeight: string; letterSpacing?: string }]
  >(
    sizes.map((size) => [
      size,
      [
        `var(--font-size-${size})`,
        {
          lineHeight: `var(--line-height-${size})`,
          ...(letterSpacingSizes.includes(size) && {
            letterSpacing: `var(--letter-spacing-${size})`,
          }),
        },
      ],
    ]),
  ),
};
