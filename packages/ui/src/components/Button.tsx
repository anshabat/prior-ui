import { ButtonHTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

type Size = "small" | "medium" | "large";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: Size;
  children: ReactNode;
};
export const Button = ({
  children,
  size = "large",
  className,
  ...rootProps
}: ButtonProps) => {
  const classes = twMerge(createClasses({ size }), className);

  return (
    <button className={classes} {...rootProps}>
      {children}
    </button>
  );
};

const createClasses = tv({
  base: [
    "inline-flex items-center justify-center",
    "font-strong whitespace-nowrap",
    "disabled:cursor-not-allowed",
  ],
  variants: {
    size: {
      small: "h-32 px-16 rounded-8 font-body text-tiny",
      medium: "h-48 px-20 rounded-8 font-body text-small",
      large: "h-56 px-24 rounded-12 font-heading text-heading-4",
    },
  },
  defaultVariants: {
    size: "large",
  },
});
