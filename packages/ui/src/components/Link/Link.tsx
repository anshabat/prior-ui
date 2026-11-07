import { ComponentProps } from "react";
import { tv } from "tailwind-variants/lite";
import { Slot } from "../Slot";

type Tone =
  | "brand"
  | "neutral-strong"
  | "neutral-weak"
  | "destructive"
  | "inverse-strong"
  | "inverse-weak";
type Size = "large" | "small" | "tiny";
type Weight = "strong" | "weak";

// A plain link needs `href`. With `asChild` the child owns the destination
type Destination =
  | { asChild?: false; href: string }
  | { asChild: true; href?: never };

export type LinkProps = Omit<
  ComponentProps<"a">,
  "className" | "style" | "href"
> &
  Destination & {
    tone?: Tone;
    size?: Size;
    weight?: Weight;
    underline?: boolean;
  };

export const Link = ({
  asChild,
  tone = "brand",
  size = "small",
  weight = "weak",
  underline = true,
  children,
  ...nativeProps
}: LinkProps) => {
  const Element = asChild ? Slot : "a";

  return (
    <Element
      className={createClasses({ tone, size, weight, underline })}
      {...nativeProps}
    >
      {children}
    </Element>
  );
};

const createClasses = tv({
  base: [
    "font-body rounded-4",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
  ],
  variants: {
    tone: {
      brand: "text-brand",
      "neutral-strong": "text-strong",
      "neutral-weak": "text-weak",
      destructive: "text-error",
      "inverse-strong": "text-strong-inverse",
      "inverse-weak": "text-weak-inverse",
    },
    size: {
      large: "text-heading-4",
      small: "text-small",
      tiny: "text-tiny",
    },
    weight: {
      strong: "font-strong",
      weak: "font-weak",
    },
    underline: {
      true: "underline hover:no-underline active:no-underline",
      false: "no-underline hover:underline active:underline",
    },
  },
});
