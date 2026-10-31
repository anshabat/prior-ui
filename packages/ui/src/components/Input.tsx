import { ComponentProps } from "react";
import { tv } from "tailwind-variants/lite";

type Size = "small" | "medium";

// Native `size` (width in characters) is replaced by the design-system size scale
export type InputProps = Omit<ComponentProps<"input">, "size"> & {
  size?: Size;
};

export const Input = ({ type = "text", size, ...nativeProps }: InputProps) => {
  const classes = createClasses({ size });

  return <input type={type} className={classes} {...nativeProps} />;
};

const createClasses = tv({
  base: [
    // Browser defaults that Tailwind's preflight would otherwise reset;
    // dist/tailwind.css is built without preflight, so the input resets itself
    "box-border border-solid placeholder:opacity-100",
    "w-full rounded-8 border",
    "font-body font-weak",
    "bg-fill-strong-inverse border-strong text-strong placeholder:text-weak",
  ],
  variants: {
    // Heights and text sizes match Button's small and medium
    size: {
      small: "h-32 px-12 text-tiny",
      medium: "h-48 px-16 text-small",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});
