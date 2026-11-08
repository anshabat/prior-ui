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
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children: ReactNode;
};
export const Button = ({
  children,
  variant = "primary",
  tone = "brand",
  size = "large",
  startIcon,
  endIcon,
  ...nativeProps
}: ButtonProps) => {
  //const classes = twMerge(createClasses({ variant, size }), className);
  const classes = createClasses({ variant, tone, size });

  return (
    <button className={classes.root()} {...nativeProps}>
      {startIcon && <span className={classes.icon()}>{startIcon}</span>}
      <span className={classes.label()}>{children}</span>
      {endIcon && <span className={classes.icon()}>{endIcon}</span>}
    </button>
  );
};

const createClasses = tv({
  slots: {
    root: [
      "box-border m-0 py-0 cursor-pointer", // Reset (no preflight)
      "inline-flex items-center justify-center",
      "font-body font-strong whitespace-nowrap",
      "disabled:cursor-not-allowed",
    ],
    // Flex, so an inline svg has no line box that shifts it off center
    icon: "flex shrink-0 [&_svg]:size-full",
    label: "px-4",
  },
  variants: {
    // border and background are reset per variant: classes for the same
    // property can't be in both the root slot and a variant (no class merging)
    variant: {
      primary: { root: "border-0 shadow-raised" },
      secondary: { root: "border border-solid bg-transparent shadow-raised" },
      tertiary: { root: "border-0 bg-transparent underline" },
    },
    tone: {
      brand: {},
      neutral: {},
      destructive: {},
      inverse: {},
    },
    // Padding x is Figma's State padding, the label adds its own 4px
    size: {
      small: {
        root: ["h-32 px-12 rounded-8", "text-tiny"],
        icon: "size-16",
      },
      medium: {
        root: ["h-48 px-16 gap-4 rounded-8", "text-small"],
        icon: "size-20",
      },
      large: {
        root: ["h-56 px-24 gap-4 rounded-12", "text-heading-4"],
        icon: "size-24",
      },
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      tone: "brand",
      class: {
        root: [
          "bg-fill-brand-strong text-strong-inverse",
          "enabled:hover:bg-fill-brand-strong-hover",
          "enabled:active:bg-fill-brand-strong-press enabled:active:shadow-none",
          "disabled:bg-fill-disabled disabled:shadow-none",
        ],
      },
    },
    {
      variant: "primary",
      tone: "neutral",
      class: {
        root: [
          "bg-fill-strong text-strong-inverse",
          "enabled:hover:bg-fill-strong-hover",
          "enabled:active:bg-fill-strong-press enabled:active:shadow-none",
          "disabled:bg-fill-disabled disabled:shadow-none",
        ],
      },
    },
    {
      variant: "primary",
      tone: "destructive",
      class: {
        root: [
          "bg-fill-error-strong text-strong-inverse",
          "enabled:hover:bg-fill-error-strong-hover",
          "enabled:active:bg-fill-error-strong-press enabled:active:shadow-none",
          "disabled:bg-fill-disabled disabled:shadow-none",
        ],
      },
    },
    {
      variant: "primary",
      tone: "inverse",
      class: {
        root: [
          "bg-fill-strong-inverse text-strong",
          "enabled:hover:bg-fill-strong-inverse-hover",
          "enabled:active:bg-fill-strong-inverse-press enabled:active:shadow-none",
          "disabled:bg-fill-disabled-inverse",
        ],
      },
    },
    {
      variant: "secondary",
      tone: "brand",
      class: {
        root: [
          "border-brand-strong text-brand",
          "enabled:hover:bg-fill-weak",
          "enabled:active:bg-fill-weak-press",
          "disabled:border-disabled disabled:text-disabled disabled:shadow-none",
        ],
      },
    },
    {
      variant: "secondary",
      tone: "neutral",
      class: {
        root: [
          "border-strong text-weak",
          "enabled:hover:bg-fill-weak",
          "enabled:active:bg-fill-weak-press",
          "disabled:border-disabled disabled:text-disabled disabled:shadow-none",
        ],
      },
    },
    {
      variant: "secondary",
      tone: "destructive",
      class: {
        root: [
          "border-error-strong text-error",
          "enabled:hover:bg-fill-weak",
          "enabled:active:bg-fill-weak-press",
          "disabled:border-disabled disabled:text-disabled disabled:shadow-none",
        ],
      },
    },
    {
      variant: "secondary",
      tone: "inverse",
      class: {
        root: [
          "border-strong-inverse text-strong-inverse",
          "enabled:hover:bg-fill-weak-inverse",
          "enabled:active:bg-fill-weak-inverse-press",
          "disabled:border-disabled-inverse disabled:text-disabled-inverse",
        ],
      },
    },
    {
      variant: "tertiary",
      tone: "brand",
      class: {
        root: [
          "text-brand",
          "enabled:hover:bg-fill-weak",
          "enabled:active:bg-fill-weak-press",
          "disabled:text-disabled",
        ],
      },
    },
    {
      variant: "tertiary",
      tone: "neutral",
      class: {
        root: [
          "text-weak",
          "enabled:hover:bg-fill-weak",
          "enabled:active:bg-fill-weak-press",
          "disabled:text-disabled",
        ],
      },
    },
    {
      variant: "tertiary",
      tone: "destructive",
      class: {
        root: [
          "text-error",
          "enabled:hover:bg-fill-weak",
          "enabled:active:bg-fill-weak-press",
          "disabled:text-disabled",
        ],
      },
    },
    {
      variant: "tertiary",
      tone: "inverse",
      class: {
        root: [
          "text-strong-inverse",
          "enabled:hover:bg-fill-weak-inverse",
          "enabled:active:bg-fill-weak-inverse-press",
          "disabled:text-disabled-inverse",
        ],
      },
    },
  ],
});
