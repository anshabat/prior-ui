import { ButtonHTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

type Size = "sm" | "md" | "lg";
type ColorScheme = "primary" | "subtle";
type Variant = "solid" | "outline" | "ghost" | "link";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: Size;
  variant?: Variant;
  colorScheme?: ColorScheme;
  children: ReactNode;
};
export const Button = ({
  children,
  size = "md",
  colorScheme = "primary",
  variant = "solid",
  className,
  ...rootProps
}: ButtonProps) => {
  const classes = twMerge(
    createClasses({ variant, colorScheme, size }),
    className,
  );

  return (
    <button className={classes} {...rootProps}>
      {children}
    </button>
  );
};

const createClasses = tv({
  base: "whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed",
  variants: {
    variant: {
      solid: "border",
      outline: "border",
      ghost: "",
      link: "",
    },
    colorScheme: {
      primary: "",
      subtle: "",
      link: "",
    },
    size: {
      sm: "px-4 min-h-8 text-sm",
      md: "px-6 min-h-10 text-base",
      lg: "px-8 min-h-12 text-lg",
    },
  },
  compoundVariants: [
    {
      variant: "solid",
      colorScheme: "primary",
      class:
        "bg-color-bg-primary text-color-text-onPrimary border-color-bg-primary hover:bg-color-bg-primary-hover",
    },
    {
      variant: "solid",
      colorScheme: "subtle",
      class:
        "bg-color-bg-subtle text-color-text-onSubtle border-color-border-light hover:bg-color-bg-subtle-hover",
    },
    {
      variant: "outline",
      colorScheme: "primary",
      class:
        "text-color-text-primary bg-transparent border-color-text-primary hover:bg-color-bg-primary hover:text-color-text-onPrimary",
    },
    {
      variant: "outline",
      colorScheme: "subtle",
      class:
        "text-color-text-subtle bg-transparent border-color-border-medium hover:bg-color-bg-subtle hover:text-color-text-onSubtle",
    },
    {
      variant: "ghost",
      colorScheme: "primary",
      class:
        "text-color-text-primary bg-transparent hover:bg-color-bg-primary hover:text-color-text-onPrimary",
    },
    {
      variant: "ghost",
      colorScheme: "subtle",
      class:
        "text-color-text-subtle bg-transparent hover:bg-color-bg-subtle hover:text-color-text-onSubtle",
    },
  ],
  defaultVariants: {
    variant: "solid",
    colorScheme: "primary",
    size: "md",
  },
});
