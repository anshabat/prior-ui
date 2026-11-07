import { cloneElement, isValidElement, ReactNode } from "react";

type Props = Record<string, unknown>;
export type SlotProps = Props & { children?: ReactNode };

// Powers `asChild`: renders its only child instead of an element of its own
export const Slot = ({ children, ...slotProps }: SlotProps) => {
  if (!isValidElement<Props>(children)) {
    throw new Error("asChild expects a single React element as its child");
  }

  return cloneElement(children, mergeProps(slotProps, children.props));
};

/**
 * Merges the slot's and the child's props. When both set the same prop:
 * - `className`: the slot's wins, because the look belongs to the component
 * - `on*` handlers: both run, the child's first
 * - anything else, including `ref`: the child's wins
 */
const mergeProps = (slotProps: Props, childProps: Props) => {
  const merged: Props = {
    ...slotProps,
    ...childProps, // Child wins for ordinary props
    className: slotProps.className, // Slot wins for className
  };

  // Run on<Event> handlers props for both Child and Slot
  for (const [name, slotValue] of Object.entries(slotProps)) {
    const childValue = childProps[name];

    if (
      /^on[A-Z]/.test(name) &&
      isHandler(slotValue) &&
      isHandler(childValue)
    ) {
      merged[name] = (...args: unknown[]) => {
        childValue(...args);
        slotValue(...args);
      };
    }
  }

  return merged;
};

type Handler = (...args: unknown[]) => void;
const isHandler = (value: unknown): value is Handler =>
  typeof value === "function";
