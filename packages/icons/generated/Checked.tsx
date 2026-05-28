import type { SVGProps } from "react";
interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  color2?: string;
  color3?: string;
  color4?: string;
}
function SvgChecked(allProps: IconProps) {
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
      width="1em"
      height="1em"
      fill="none"
      aria-label="Two-tone badge"
      data-icon="checked"
      viewBox="0 0 24 24"
      style={iconStyle}
      {...props}
    >
      <circle cx={12} cy={12} r={10} fill="var(--color-0, #2DD4BF)" />
      <path
        stroke="var(--color-1, #7C3AED)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.2}
        d="m8 12.5 2.5 2.5L16 9"
      />
    </svg>
  );
}
export default SvgChecked;
