import { ComponentProps } from "react";
import { tv } from "tailwind-variants/lite";

type Size = "small" | "medium";

// Native `size` (width in characters) is replaced by the design-system size scale.
// `className` and `style` are not accepted: the input's look is owned by the design system.
export type InputProps = Omit<
  ComponentProps<"input">,
  "size" | "className" | "style"
> & {
  size?: Size;
};

export const Input = ({ type = "text", size, ...nativeProps }: InputProps) => {
  const classes = createClasses({ size });

  // className goes last so it can't be overridden by props that bypass the type
  return <input {...nativeProps} type={type} className={classes} />;
};

const createClasses = tv({
  base: [
    // Browser defaults that Tailwind's preflight would otherwise reset;
    // dist/tailwind.css is built without preflight, so the input resets itself
    "box-border border-solid placeholder:opacity-100",
    "w-full rounded-8 border",
    "font-body font-weak",
    "bg-fill-strong-inverse border-strong text-strong placeholder:text-weak",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
    "disabled:border-disabled disabled:text-disabled disabled:placeholder:text-disabled disabled:cursor-not-allowed",
    // Invalid is driven by aria-invalid, so the visual state always matches what assistive tech announces.
    // The 2px stroke is a 1px border plus a 1px inset ring: a thicker border would shift the text.
      "enabled:aria-[invalid=true]:bg-fill-error-weak enabled:aria-[invalid=true]:border-error-strong",
      "enabled:aria-[invalid=true]:ring-1 enabled:aria-[invalid=true]:ring-inset enabled:aria-[invalid=true]:ring-error-strong",
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
