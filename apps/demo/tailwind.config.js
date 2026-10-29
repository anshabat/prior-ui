import { withUi } from "@workspace/ui/config";

/** @type {import('tailwindcss').Config} */
export default withUi({
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
});
