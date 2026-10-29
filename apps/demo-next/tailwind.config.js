import { defaultTheme } from "@workspace/ui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [defaultTheme],
  content: ["./app/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
