import { ButtonHTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary" | "tertiary";
type Size = "small" | "medium" | "large";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};
export const Button = ({
  children,
  variant = "primary",
  size = "large",
  className,
  ...rootProps
}: ButtonProps) => {
  //const classes = twMerge(createClasses({ variant, size }), className);
  const classes = createClasses({ variant, size });

  return (
    <button className={classes} {...rootProps}>
      {children}
    </button>
  );
};

const createClasses = tv({
  base: [
    "inline-flex items-center justify-center",
    "font-weak whitespace-nowrap",
    "disabled:cursor-not-allowed",
  ],
  variants: {
    variant: {
      primary: "bg-brand text-strong-inverse shadow-raised",
      secondary: "border border-brand-strong text-brand shadow-raised",
      tertiary: "text-brand underline",
    },
    size: {
      small: "h-32 px-16 rounded-8 font-body text-tiny",
      medium: "h-48 px-20 rounded-8 font-body text-small",
      large: "h-56 px-24 rounded-12 font-heading text-heading-4",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "large",
  },
});
