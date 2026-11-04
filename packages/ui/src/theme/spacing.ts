// Spacing between siblings (gap). Larger steps are page layout
const gapSteps = [
  "0",
  "4",
  "8",
  "12",
  "16",
  "20",
  "24",
  "32",
  "40",
  "48",
  "56",
  "64",
] as const;

const steps = [...gapSteps, "80", "96", "128", "192", "256"] as const;

export type GapStep = (typeof gapSteps)[number];
export type SpacingStep = (typeof steps)[number];

const radii = ['0', '4', '8', '12', '16', '20', '24', '32'];

export const spacing = {
  spacing: Object.fromEntries(
    steps.map((step) => [step, `var(--spacing-${step})`]),
  ),
  borderRadius: Object.fromEntries(
    radii.map((radius) => [radius, `var(--radius-${radius})`]),
  ),
};
