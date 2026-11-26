import { withUi } from "@workspace/ui/config";

// withUi adds the design-system preset and scans @workspace/ui components for classes
export default withUi({
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
});
