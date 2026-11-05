import type { ComponentProps, ElementType } from "react";

// Props of a component that renders the HTML element passed in `as`.
// `E & string` rejects components, which `asChild` is for. Own props replace
// the element's props with the same name. `className` and `style` are removed:
// the styling API is closed.
export type PolymorphicProps<
  E extends ElementType,
  OwnProps = object,
> = OwnProps & { as?: E & string } & Omit<
    ComponentProps<E>,
    keyof OwnProps | "as" | "className" | "style"
  >;
