import { cloneElement, isValidElement, ReactNode } from "react";

export type SlotProps = Record<string, unknown> & { children?: ReactNode };

// Powers `asChild`: renders its only child instead of an element of its own,
// with the slot's props passed to the child
export const Slot = ({ children, ...slotProps }: SlotProps) => {
  if (!isValidElement(children)) {
    throw new Error("asChild expects a single React element as its child");
  }

  return cloneElement(children, slotProps);
};
