// Mirrors src/css/tokens/color-semantic.css. Each Figma group is exposed only
// through the utilities it is meant for.

const text = {
  strong: {
    DEFAULT: "var(--color-text-strong)",
    inverse: "var(--color-text-strong-inverse)",
  },
  weak: {
    DEFAULT: "var(--color-text-weak)",
    inverse: "var(--color-text-weak-inverse)",
  },
  brand: "var(--color-text-brand)",
  disabled: {
    DEFAULT: "var(--color-text-disabled)",
    inverse: "var(--color-text-disabled-inverse)",
  },
  error: "var(--color-text-error)",
  warning: "var(--color-text-warning)",
  success: "var(--color-text-success)",
  information: "var(--color-text-information)",
};

const background = {
  base: {
    DEFAULT: "var(--color-background-base)",
    inverse: "var(--color-background-base-inverse)",
  },
  raised: "var(--color-background-raised)",
  overlay: "var(--color-background-overlay)",
  sunken: "var(--color-background-sunken)",
  alternate: "var(--color-background-alternate)",
  brand: "var(--color-background-brand)",
  fill: {
    brand: {
      strong: {
        DEFAULT: "var(--color-fill-brand-strong)",
        hover: "var(--color-fill-brand-strong-hover)",
        press: "var(--color-fill-brand-strong-press)",
      },
      weak: "var(--color-fill-brand-weak)",
    },
    strong: {
      DEFAULT: "var(--color-fill-strong)",
      hover: "var(--color-fill-strong-hover)",
      press: "var(--color-fill-strong-press)",
      inverse: {
        DEFAULT: "var(--color-fill-strong-inverse)",
        hover: "var(--color-fill-strong-inverse-hover)",
        press: "var(--color-fill-strong-inverse-press)",
      },
    },
    weak: {
      DEFAULT: "var(--color-fill-weak)",
      press: "var(--color-fill-weak-press)",
      inverse: {
        DEFAULT: "var(--color-fill-weak-inverse)",
        press: "var(--color-fill-weak-inverse-press)",
      },
    },
    weaker: "var(--color-fill-weaker)",
    selected: "var(--color-fill-selected)",
    disabled: {
      DEFAULT: "var(--color-fill-disabled)",
      inverse: "var(--color-fill-disabled-inverse)",
    },
    error: {
      strong: {
        DEFAULT: "var(--color-fill-error-strong)",
        hover: "var(--color-fill-error-strong-hover)",
        press: "var(--color-fill-error-strong-press)",
      },
      weak: "var(--color-fill-error-weak)",
    },
    warning: {
      strong: "var(--color-fill-warning-strong)",
      weak: "var(--color-fill-warning-weak)",
    },
    success: {
      strong: "var(--color-fill-success-strong)",
      weak: "var(--color-fill-success-weak)",
    },
    information: {
      strong: "var(--color-fill-information-strong)",
      weak: "var(--color-fill-information-weak)",
    },
    overlay: "var(--color-fill-overlay)",
    white: "var(--color-fill-white)",
  },
};

const stroke = {
  strong: {
    DEFAULT: "var(--color-stroke-strong)",
    inverse: "var(--color-stroke-strong-inverse)",
  },
  weak: {
    DEFAULT: "var(--color-stroke-weak)",
    inverse: "var(--color-stroke-weak-inverse)",
  },
  selected: "var(--color-stroke-selected)",
  focus: "var(--color-stroke-focus)",
  disabled: {
    DEFAULT: "var(--color-stroke-disabled)",
    inverse: "var(--color-stroke-disabled-inverse)",
  },
  brand: {
    strong: "var(--color-stroke-brand-strong)",
    weak: "var(--color-stroke-brand-weak)",
  },
  error: {
    strong: "var(--color-stroke-error-strong)",
    weak: "var(--color-stroke-error-weak)",
  },
  warning: {
    strong: "var(--color-stroke-warning-strong)",
    weak: "var(--color-stroke-warning-weak)",
  },
  success: {
    strong: "var(--color-stroke-success-strong)",
    weak: "var(--color-stroke-success-weak)",
  },
  information: {
    strong: "var(--color-stroke-information-strong)",
    weak: "var(--color-stroke-information-weak)",
  },
};

const icon = {
  neutral: {
    DEFAULT: "var(--color-icon-neutral)",
    inverse: "var(--color-icon-neutral-inverse)",
  },
  strong: {
    inverse: "var(--color-icon-strong-inverse)",
  },
  brand: "var(--color-icon-brand)",
  disabled: {
    DEFAULT: "var(--color-icon-disabled)",
    inverse: "var(--color-icon-disabled-inverse)",
  },
  error: "var(--color-icon-error)",
  warning: "var(--color-icon-warning)",
  success: "var(--color-icon-success)",
  information: "var(--color-icon-information)",
};

export const color = {
  // Icons draw with currentColor, so icon tokens also work through `color`: text-icon-neutral, …
  // Namespaced under `icon` so they can't be mistaken for text tokens.
  textColor: { ...text, icon },
  placeholderColor: text,
  caretColor: text,
  textDecorationColor: text,
  backgroundColor: background,
  ringOffsetColor: background,
  borderColor: stroke,
  divideColor: stroke,
  outlineColor: stroke,
  ringColor: stroke,
  fill: icon,
  stroke: icon,
};
