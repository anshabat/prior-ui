import type { SVGProps } from "react";
interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  color2?: string;
  color3?: string;
  color4?: string;
}
function SvgHeartSolid(allProps: IconProps) {
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
      fill="var(--color-0, currentColor)"
      aria-hidden="true"
      data-icon="heart-solid"
      viewBox="0 0 24 24"
      style={iconStyle}
      {...props}
    >
      <path d="m11.645 20.91-.007-.003-.022-.012a15 15 0 0 1-.383-.218 25.2 25.2 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25 25 0 0 1-4.244 3.17 15 15 0 0 1-.383.219l-.022.012-.007.004-.003.001a.75.75 0 0 1-.704 0l-.003-.001Z" />
    </svg>
  );
}
export default SvgHeartSolid;
