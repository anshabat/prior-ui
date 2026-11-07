import type { SVGProps } from "react";
interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  color2?: string;
  color3?: string;
  color4?: string;
}
function SvgGithub(allProps: IconProps) {
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
      fill="var(--color-0, currentColor)"
      aria-hidden="true"
      data-icon="github"
      viewBox="0 0 24 24"
      style={iconStyle}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M12.01 0C5.369 0 0 5.408 0 12.1a12.09 12.09 0 0 0 8.212 11.477c.597.12.815-.26.815-.58 0-.281-.02-1.242-.02-2.244-3.34.721-4.036-1.443-4.036-1.443-.537-1.402-1.332-1.762-1.332-1.762-1.094-.741.08-.741.08-.741 1.212.08 1.849 1.242 1.849 1.242 1.073 1.842 2.803 1.322 3.5 1.001.098-.781.417-1.322.755-1.622-2.665-.28-5.468-1.323-5.468-5.97 0-1.322.477-2.404 1.232-3.245-.119-.3-.537-1.543.12-3.205 0 0 1.014-.32 3.3 1.242.98-.265 1.989-.4 3.003-.4s2.048.14 3.002.4c2.287-1.563 3.301-1.242 3.301-1.242.657 1.662.239 2.905.12 3.205.775.841 1.232 1.923 1.232 3.245 0 4.647-2.803 5.669-5.488 5.97.438.38.815 1.101.815 2.243 0 1.623-.02 2.925-.02 3.325 0 .32.22.702.816.581A12.09 12.09 0 0 0 24 12.1C24.02 5.41 18.63 0 12.01 0"
        clipRule="evenodd"
      />
    </svg>
  );
}
export default SvgGithub;
