import { ComponentProps } from "react";
import { tv } from "tailwind-variants/lite";

export type LogoProps = Omit<
  ComponentProps<"svg">,
  "className" | "style" | "children"
>;

// Letters are strokes, not text, so the logo doesn't depend on a loaded font
export const Logo = (nativeProps: LogoProps) => {
  const classes = createClasses();

  return (
    <svg
      role="img"
      aria-label="Prior"
      width="113"
      height="32"
      viewBox="0 0 113 32"
      className={classes.root()}
      {...nativeProps}
    >
      <rect width="32" height="32" rx="8" className={classes.mark()} />
      <g
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className={classes.markLetter()}
      >
        <path d="M11 8V24" />
        <circle cx="16" cy="13" r="5" />
      </g>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      >
        {/* p */}
        <path d="M43.5 10V27" />
        <circle cx="49.5" cy="16" r="6" />
        {/* r */}
        <path d="M63.5 22V16a6 6 0 0 1 6-6" />
        {/* i */}
        <path d="M76.5 10V22" />
        {/* o */}
        <circle cx="90.5" cy="16" r="6" />
        {/* r */}
        <path d="M104.5 22V16a6 6 0 0 1 6-6" />
      </g>
      <circle cx="76.5" cy="5" r="2" fill="currentColor" />
    </svg>
  );
};

const createClasses = tv({
  slots: {
    root: "block shrink-0 text-strong",
    mark: "fill-brand",
    markLetter: "stroke-strong-inverse",
  },
});
