import { ComponentProps } from "react";
import { tv } from "tailwind-variants/lite";

type Tag = "p" | "span" | "div";
type Size = "large" | "small" | "tiny";
type Weight = "strong" | "weak";
type Tone = "strong" | "weak";

// No ref: the tags have different element types, so one ref type can't fit them all
export type TextProps = Omit<
  ComponentProps<"p">,
  "className" | "style" | "ref"
> & {
  as?: Tag;
  size?: Size;
  weight?: Weight;
  tone?: Tone;
};

export const Text = ({
  as: Element = "p",
  size = "small",
  weight = "weak",
  tone = "strong",
  children,
  ...nativeProps
}: TextProps) => {
  return (
    <Element
      {...nativeProps}
      className={createClasses({ size, weight, tone })}
    >
      {children}
    </Element>
  );
};

const createClasses = tv({
  base: "m-0 break-words",
  variants: {
    // large is Figma's "Heading 4/Regular": a heading size, but body text
    size: {
      large: "font-heading text-heading-4",
      small: "font-body text-small",
      tiny: "font-body text-tiny",
    },
    weight: {
      strong: "font-strong",
      weak: "font-weak",
    },
    tone: {
      strong: "text-strong",
      weak: "text-weak",
    },
  },
});
