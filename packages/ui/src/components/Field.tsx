import { ComponentProps } from "react";
import { tv } from "tailwind-variants/lite";

export type FieldLabelProps = Omit<
  ComponentProps<"label">,
  "className" | "style"
> & {
  required?: boolean;
  disabled?: boolean;
};

export const FieldLabel = ({
  required,
  disabled,
  children,
  ...nativeProps
}: FieldLabelProps) => {
  const classes = createLabelClasses({ disabled });

  return (
    <label {...nativeProps} className={classes.base()}>
      {children}
      {/* Native `required` on the control already makes screen readers say "required" */}
      {required && (
        <span aria-hidden="true" className={classes.marker()}>
          *
        </span>
      )}
    </label>
  );
};

const createLabelClasses = tv({
  slots: {
    base: "flex items-baseline gap-4 font-body font-weak text-small",
    marker: "",
  },
  variants: {
    // Colors are either/or: without tailwind-merge, two color classes would be decided by CSS order
    disabled: {
      false: {
        base: "text-strong",
        marker: "text-weak",
      },
      true: {
        base: "text-disabled",
        marker: "text-disabled",
      },
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

// `id` is required: a description only helps if the control can reference it via aria-describedby
export type FieldDescriptionProps = Omit<
  ComponentProps<"p">,
  "id" | "className" | "style"
> & {
  id: string;
};

export const FieldDescription = ({
  children,
  ...nativeProps
}: FieldDescriptionProps) => {
  const classes = createDescriptionClasses();

  return (
    <p {...nativeProps} className={classes}>
      {children}
    </p>
  );
};

const createDescriptionClasses = tv({
  base: ["m-0", "font-body font-weak text-tiny text-weak"],
});
