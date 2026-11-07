import type { SVGProps } from "react";
interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  color2?: string;
  color3?: string;
  color4?: string;
}
function SvgGoogleBrand(allProps: IconProps) {
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
      aria-hidden="true"
      data-icon="google-brand"
      viewBox="0 0 24 24"
      style={iconStyle}
      {...props}
    >
      <path
        fill="var(--color-0, #4285F4)"
        d="M12 9.818v4.647h6.458c-.283 1.495-1.134 2.76-2.41 3.611l3.894 3.022c2.269-2.094 3.578-5.17 3.578-8.825 0-.851-.076-1.67-.218-2.455z"
      />
      <path
        fill="var(--color-1, #34A853)"
        d="m5.275 14.284-.879.672-3.109 2.422C3.262 21.294 7.31 24 12 24c3.24 0 5.957-1.07 7.943-2.902l-3.895-3.022c-1.069.72-2.433 1.157-4.048 1.157-3.12 0-5.77-2.106-6.72-4.942z"
      />
      <path
        fill="var(--color-2, #FBBC05)"
        d="M1.287 6.622A11.85 11.85 0 0 0 0 12c0 1.942.469 3.764 1.287 5.378 0 .011 3.993-3.098 3.993-3.098A7.2 7.2 0 0 1 4.898 12c0-.797.142-1.56.382-2.28z"
      />
      <path
        fill="var(--color-3, #EA4335)"
        d="M12 4.778c1.767 0 3.338.611 4.593 1.79l3.436-3.437C17.945 1.189 15.239 0 11.999 0 7.31 0 3.263 2.695 1.288 6.622L5.28 9.72c.949-2.837 3.6-4.942 6.72-4.942"
      />
    </svg>
  );
}
export default SvgGoogleBrand;
