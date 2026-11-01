import type { SVGProps } from "react";
interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  color2?: string;
  color3?: string;
  color4?: string;
}
function SvgXOctagon(allProps: IconProps) {
  const { color, color2, color3, color4, style, ...props } = allProps;
  const iconStyle = {
    ...(color && {
      "--color-0": color,
    }),
    ...(color2 && {
      "--color-1": color2,
    }),
    ...(color3 && {
      "--color-2": color3,
    }),
    ...(color4 && {
      "--color-3": color4,
    }),
    ...style,
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="var(--color-0, currentColor)"
      strokeWidth={2}
      aria-hidden="true"
      data-icon="x-octagon"
      viewBox="0 0 24 24"
      style={iconStyle}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15 9-6 6m0-6 6 6M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86z"
      />
    </svg>
  );
}
export default SvgXOctagon;
