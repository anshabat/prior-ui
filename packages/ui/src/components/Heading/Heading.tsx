import { ComponentProps } from "react";
import { tv } from "tailwind-variants/lite";

type Level = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type Size = "display" | "heading-1" | "heading-2" | "heading-3" | "heading-4";

export type HeadingProps = Omit<ComponentProps<"h1">, "className" | "style"> & {
  as: Level;
  size?: Size;
};

const defaultSizes: Record<Level, Size> = {
  h1: "heading-1",
  h2: "heading-2",
  h3: "heading-3",
  h4: "heading-4",
  h5: "heading-4",
  h6: "heading-4",
};

export const Heading = ({
  as: Element,
  size = defaultSizes[Element],
  children,
  ...nativeProps
}: HeadingProps) => {
  return (
    <Element {...nativeProps} className={createClasses({ size })}>
      {children}
    </Element>
  );
};

const createClasses = tv({
  base: "m-0 font-heading font-strong text-strong break-words",
  variants: {
    size: {
      display: "text-display",
      "heading-1": "text-heading-1",
      "heading-2": "text-heading-2",
      "heading-3": "text-heading-3",
      "heading-4": "text-heading-4",
    },
  },
});
