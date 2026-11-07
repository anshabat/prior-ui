import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
//import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary" | "tertiary";
type Tone = "brand" | "neutral" | "destructive" | "inverse";
type Size = "small" | "medium" | "large";

export type ButtonProps = Omit<
  ComponentProps<"button">,
  "className" | "style"
> & {
  variant?: Variant;
  tone?: Tone;
  size?: Size;
  children: ReactNode;
};
export const Button = ({
  children,
  variant = "primary",
  tone = "brand",
  size = "large",
  ...nativeProps
}: ButtonProps) => {
  //const classes = twMerge(createClasses({ variant, size }), className);
  const classes = createClasses({ variant, tone, size });

  return (
    <button className={classes} {...nativeProps}>
      {children}
    </button>
  );
};

const createClasses = tv({
  base: [
    "box-border m-0 py-0 cursor-pointer", // Reset (no preflight)
    "inline-flex items-center justify-center",
    "font-body font-strong whitespace-nowrap",
    "disabled:cursor-not-allowed",
  ],
  variants: {
    // border and background are reset per variant: classes for the same
    // property can't be in both base and a variant (no class merging)
    variant: {
      primary: "border-0 shadow-raised",
      secondary: "border border-solid bg-transparent shadow-raised",
      tertiary: "border-0 bg-transparent underline",
    },
    tone: {
      brand: "",
      neutral: "",
      destructive: "",
      inverse: "",
    },
    // padding x = Figma State padding + Label container padding
    size: {
      small: [
        "h-32 px-[calc(var(--spacing-12)_+_var(--spacing-4))] rounded-8",
        "text-tiny",
      ],
      medium: [
        "h-48 px-[calc(var(--spacing-16)_+_var(--spacing-4))] rounded-8",
        "text-small",
      ],
      large: [
        "h-56 px-[calc(var(--spacing-24)_+_var(--spacing-4))] rounded-12",
        "text-heading-4",
      ],
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      tone: "brand",
      class: [
        "bg-fill-brand-strong text-strong-inverse",
        "enabled:hover:bg-fill-brand-strong-hover",
        "enabled:active:bg-fill-brand-strong-press enabled:active:shadow-none",
        "disabled:bg-fill-disabled disabled:shadow-none",
      ],
    },
    {
      variant: "primary",
      tone: "neutral",
      class: [
        "bg-fill-strong text-strong-inverse",
        "enabled:hover:bg-fill-strong-hover",
        "enabled:active:bg-fill-strong-press enabled:active:shadow-none",
        "disabled:bg-fill-disabled disabled:shadow-none",
      ],
    },
    {
      variant: "primary",
      tone: "destructive",
      class: [
        "bg-fill-error-strong text-strong-inverse",
        "enabled:hover:bg-fill-error-strong-hover",
        "enabled:active:bg-fill-error-strong-press enabled:active:shadow-none",
        "disabled:bg-fill-disabled disabled:shadow-none",
      ],
    },
    {
      variant: "primary",
      tone: "inverse",
      class: [
        "bg-fill-strong-inverse text-strong",
        "enabled:hover:bg-fill-strong-inverse-hover",
        "enabled:active:bg-fill-strong-inverse-press enabled:active:shadow-none",
        "disabled:bg-fill-disabled-inverse",
      ],
    },
    {
      variant: "secondary",
      tone: "brand",
      class: [
        "border-brand-strong text-brand",
        "enabled:hover:bg-fill-weak",
        "enabled:active:bg-fill-weak-press",
        "disabled:border-disabled disabled:text-disabled disabled:shadow-none",
      ],
    },
    {
      variant: "secondary",
      tone: "neutral",
      class: [
        "border-strong text-weak",
        "enabled:hover:bg-fill-weak",
        "enabled:active:bg-fill-weak-press",
        "disabled:border-disabled disabled:text-disabled disabled:shadow-none",
      ],
    },
    {
      variant: "secondary",
      tone: "destructive",
      class: [
        "border-error-strong text-error",
        "enabled:hover:bg-fill-weak",
        "enabled:active:bg-fill-weak-press",
        "disabled:border-disabled disabled:text-disabled disabled:shadow-none",
      ],
    },
    {
      variant: "secondary",
      tone: "inverse",
      class: [
        "border-strong-inverse text-strong-inverse",
        "enabled:hover:bg-fill-weak-inverse",
        "enabled:active:bg-fill-weak-inverse-press",
        "disabled:border-disabled-inverse disabled:text-disabled-inverse",
      ],
    },
    {
      variant: "tertiary",
      tone: "brand",
      class: [
        "text-brand",
        "enabled:hover:bg-fill-weak",
        "enabled:active:bg-fill-weak-press",
        "disabled:text-disabled",
      ],
    },
    {
      variant: "tertiary",
      tone: "neutral",
      class: [
        "text-weak",
        "enabled:hover:bg-fill-weak",
        "enabled:active:bg-fill-weak-press",
        "disabled:text-disabled",
      ],
    },
    {
      variant: "tertiary",
      tone: "destructive",
      class: [
        "text-error",
        "enabled:hover:bg-fill-weak",
        "enabled:active:bg-fill-weak-press",
        "disabled:text-disabled",
      ],
    },
    {
      variant: "tertiary",
      tone: "inverse",
      class: [
        "text-strong-inverse",
        "enabled:hover:bg-fill-weak-inverse",
        "enabled:active:bg-fill-weak-inverse-press",
        "disabled:text-disabled-inverse",
      ],
    },
  ],
  defaultVariants: {
    variant: "primary",
    tone: "brand",
    size: "large",
  },
});
