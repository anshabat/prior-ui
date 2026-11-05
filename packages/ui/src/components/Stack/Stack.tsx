import { ElementType, ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import type { GapStep } from "../../theme/spacing";
import type { PolymorphicProps } from "../../types/polymorphic";

type Direction = "column" | "row";
type Align = "start" | "center" | "end" | "stretch" | "baseline";
type Justify = "start" | "center" | "end" | "between";

type StackOwnProps = {
  direction?: Direction;
  gap?: GapStep;
  align?: Align;
  justify?: Justify;
  children?: ReactNode;
};

export type StackProps<E extends ElementType = "div"> = PolymorphicProps<
  E,
  StackOwnProps
>;

export const Stack = <E extends ElementType = "div">({
  as,
  direction = "column",
  gap = "0",
  align = "stretch",
  justify = "start",
  children,
  ...nativeProps
}: StackProps<E>) => {
  const Element: ElementType = as ?? "div";

  return (
    <Element
      className={createClasses({ direction, gap, align, justify })}
      {...nativeProps}
    >
      {children}
    </Element>
  );
};

const gapClasses: Record<GapStep, string> = {
  "0": "gap-0",
  "4": "gap-4",
  "8": "gap-8",
  "12": "gap-12",
  "16": "gap-16",
  "20": "gap-20",
  "24": "gap-24",
  "32": "gap-32",
  "40": "gap-40",
  "48": "gap-48",
  "56": "gap-56",
  "64": "gap-64",
};

const createClasses = tv({
  base: "flex",
  variants: {
    direction: {
      column: "flex-col",
      row: "flex-row",
    },
    gap: gapClasses,
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
  },
});
