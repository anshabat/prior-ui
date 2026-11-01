import type { SVGProps } from "react";
interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  color2?: string;
  color3?: string;
  color4?: string;
}
function SvgX(allProps: IconProps) {
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
      width={24}
      height={24}
      fill="none"
      stroke="var(--color-0, currentColor)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      aria-hidden="true"
      data-icon="x"
      viewBox="0 0 24 24"
      style={iconStyle}
      {...props}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
export default SvgX;
