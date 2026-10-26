import { Config } from "tailwindcss";
import { color } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";
import { elevation } from "./elevation";

export const defaultTheme = {
  theme: {
    colors: {
      inherit: "inherit",
      current: "currentColor",
      transparent: "transparent",
    },
    extend: {
      ...spacing,
      ...color,
      ...typography,
      ...elevation,
    },
  },
  plugins: [],
} satisfies Partial<Config>;
