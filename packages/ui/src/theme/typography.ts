const sizes = [
  "display",
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "small",
  "tiny",
  "uppercase",
];

export const typography = {
  fontFamily: {
    heading: "var(--font-family-heading)",
    body: "var(--font-family-body)",
  },
  fontWeight: {
    strong: "var(--font-weight-strong)",
    weak: "var(--font-weight-weak)",
  },
  fontSize: Object.fromEntries<[string, string]>(
    sizes.map((size) => [
      size,
      [`var(--font-size-${size})`, `var(--line-height-${size})`],
    ]),
  ),
};
