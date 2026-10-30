// Builds dist/styles.css for apps without Tailwind; Tailwind apps use withUi instead
import { defaultTheme } from "./src/theme/index.ts";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/components/**/*.{ts,tsx}"],
  presets: [defaultTheme],
  corePlugins: { preflight: false },
};
