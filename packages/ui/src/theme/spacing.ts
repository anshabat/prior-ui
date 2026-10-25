const steps = [
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
  "80",
  "96",
  "128",
  "192",
  "256",
];

const radii = ['0', '4', '8', '12', '16', '20', '24', '32'];

export const spacing = {
  spacing: Object.fromEntries(
    steps.map((step) => [step, `var(--spacing-${step})`]),
  ),
  borderRadius: Object.fromEntries(
    radii.map((radius) => [radius, `var(--radius-${radius})`]),
  ),
};
