import { defaultTheme } from "@workspace/ui/src/themes/default.ts";

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [defaultTheme],
  content: ["./app/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
