import { HTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants";

type ColorScheme = "error" | "success" | "warning" | "info";
type Variant = "solid" | "outline";

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: string;
  children: ReactNode;
  colorScheme: ColorScheme;
  variant?: Variant;
};
export const Alert = ({
  title,
  children,
  colorScheme,
  variant = "solid",
  ...rootProps
}: AlertProps) => {
  const tvClasses = createTvClasses({ variant, colorScheme });

  return (
    <div className={tvClasses.root()} {...rootProps}>
      <div className={tvClasses.title()}>{title}</div>
      <div className={tvClasses.description()}>{children}</div>
    </div>
  );
};

const createTvClasses = tv({
  slots: {
    root: "rounded border py-3 px-5",
    title: "font-bold mb-[0.5em] text-base",
    description: "text-sm",
  },
  variants: {
    variant: {
      solid: {
        root: "text-color-text-inverted",
      },
      outline: {
        root: "bg-color-bg-neutral",
      },
    },
    colorScheme: {
      error: {},
      success: {},
      warning: {},
      info: {},
    },
  },
  compoundVariants: [
    {
      variant: "solid",
      colorScheme: "error",
      class: {
        root: "bg-color-bg-error border-color-border-error",
      },
    },
    {
      variant: "solid",
      colorScheme: "success",
      class: {
        root: "bg-color-bg-success border-color-border-success",
      },
    },
    {
      variant: "solid",
      colorScheme: "warning",
      class: {
        root: "bg-color-bg-warning border-color-border-warning",
      },
    },
    {
      variant: "solid",
      colorScheme: "info",
      class: {
        root: "bg-color-bg-info border-color-border-info",
      },
    },
    {
      variant: "outline",
      colorScheme: "error",
      class: {
        root: "text-color-text-error border-color-border-error",
      },
    },
    {
      variant: "outline",
      colorScheme: "success",
      class: {
        root: "text-color-text-success border-color-border-success",
      },
    },
    {
      variant: "outline",
      colorScheme: "warning",
      class: {
        root: "text-color-text-warning border-color-border-warning",
      },
    },
    {
      variant: "outline",
      colorScheme: "info",
      class: {
        root: "text-color-text-info border-color-border-info",
      },
    },
  ],
  defaultVariants: {
    variant: "solid",
    colorScheme: "info",
  },
});
