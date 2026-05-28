import { defaultTheme } from "@workspace/ui/src/themes/default.ts";
//import { defaultTheme } from "../../packages/ui/src/themes/default.ts";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [defaultTheme],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@workspace/ui/dist/**/*.{js,jsx}",
    //"../../packages/ui/src/**/*.{ts,tsx}", // Watch source files for theme changes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
