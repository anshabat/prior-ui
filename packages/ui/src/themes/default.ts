import { Config } from "tailwindcss";

const color = {
  bg: {
    neutral: {
      DEFAULT: "rgb(from var(--color-bg-neutral) r g b / <alpha-value>)",
      hover: "rgb(from var(--color-bg-neutral-hover) r g b / <alpha-value>)",
    },
    primary: {
      DEFAULT: "rgb(from var(--color-bg-primary) r g b / <alpha-value>)",
      hover: "rgb(from var(--color-bg-primary-hover) r g b / <alpha-value>)",
      disabled:
        "rgb(from var(--color-bg-primary-disabled) r g b / <alpha-value>)",
    },
    subtle: {
      DEFAULT: "rgb(from var(--color-bg-subtle) r g b / <alpha-value>)",
      hover: "rgb(from var(--color-bg-subtle-hover) r g b / <alpha-value>)",
    },
    error: "rgb(from var(--color-bg-error) r g b / <alpha-value>)",
    success: "rgb(from var(--color-bg-success) r g b / <alpha-value>)",
    warning: "rgb(from var(--color-bg-warning) r g b / <alpha-value>)",
    info: "rgb(from var(--color-bg-info) r g b / <alpha-value>)",
  },
  text: {
    default: "rgb(from var(--color-text-default) r g b / <alpha-value>)",
    inverted: "rgb(from var(--color-text-inverted) r g b / <alpha-value>)",
    primary: "rgb(from var(--color-text-primary) r g b / <alpha-value>)",
    onPrimary: "rgb(from var(--color-text-on-primary) r g b / <alpha-value>)",
    muted: "rgb(from var(--color-text-muted) r g b / <alpha-value>)",
    subtle: "rgb(from var(--color-text-subtle) r g b / <alpha-value>)",
    onSubtle: "rgb(from var(--color-text-on-subtle) r g b / <alpha-value>)",
    error: "rgb(from var(--color-text-error) r g b / <alpha-value>)",
    success: "rgb(from var(--color-text-success) r g b / <alpha-value>)",
    warning: "rgb(from var(--color-text-warning) r g b / <alpha-value>)",
    info: "rgb(from var(--color-text-info) r g b / <alpha-value>)",
  },
  border: {
    dark: "rgb(from var(--color-border-dark) r g b / <alpha-value>)",
    medium: "rgb(from var(--color-border-medium) r g b / <alpha-value>)",
    light: "rgb(from var(--color-border-light) r g b / <alpha-value>)",
    error: "rgb(from var(--color-border-error) r g b / <alpha-value>)",
    success: "rgb(from var(--color-border-success) r g b / <alpha-value>)",
    warning: "rgb(from var(--color-border-warning) r g b / <alpha-value>)",
    info: "rgb(from var(--color-border-info) r g b / <alpha-value>)",
  },
};

export const defaultTheme = {
  theme: {
    colors: {
      inherit: "inherit",
      current: "currentColor",
      transparent: "transparent",
    },
    extend: {
      colors: { color },
    },
  },
  plugins: [],
} satisfies Partial<Config>;
