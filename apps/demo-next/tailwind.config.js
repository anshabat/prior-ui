import { withUi } from "@workspace/ui/config";

/** @type {import('tailwindcss').Config} */
module.exports = withUi({
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
});
