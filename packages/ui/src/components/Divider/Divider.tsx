import { HTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants/lite";

type Tone = "weak" | "strong";

// HTMLElement, not a specific tag: the root is `hr` or `div`, depending on `children`
export type DividerProps = Omit<
  HTMLAttributes<HTMLElement>,
  "className" | "style" | "children"
> & {
  tone?: Tone;
  children?: ReactNode;
};

export const Divider = ({
  tone = "weak",
  children,
  ...nativeProps
}: DividerProps) => {
  const classes = createClasses({ tone });

  if (!children) {
    return <hr className={classes.line()} {...nativeProps} />;
  }

  // Not role="separator": its children are presentational, which would hide the label
  return (
    <div className={classes.labeled()} {...nativeProps}>
      <span className={classes.line()} />
      <span className={classes.label()}>{children}</span>
      <span className={classes.line()} />
    </div>
  );
};

const createClasses = tv({
  slots: {
    // Figma's line is a filled 1px box, but stroke colors are only exposed as border utilities
    line: "box-border m-0 w-full border-0 border-t border-solid",
    labeled: "flex items-center gap-16",
    label: "font-body font-weak text-small text-weak whitespace-nowrap",
  },
  variants: {
    tone: {
      weak: { line: "border-weak" },
      strong: { line: "border-strong" },
    },
  },
});
