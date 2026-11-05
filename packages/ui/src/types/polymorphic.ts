import type { ComponentPropsWithRef, ElementType } from "react";

// Props of a component that renders the element or component passed in `as`.
// Own props replace the element's props with the same name. `className` and
// `style` are removed: the styling API is closed.
export type PolymorphicProps<
  E extends ElementType,
  OwnProps = object,
> = OwnProps & { as?: E } & Omit<
    ComponentPropsWithRef<E>,
    keyof OwnProps | "as" | "className" | "style"
  >;
