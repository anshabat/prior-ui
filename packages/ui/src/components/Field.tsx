import { ComponentProps } from "react";
import { tv } from "tailwind-variants/lite";
import { XOctagon } from "@workspace/icons";

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

// `id` is required for the same reason as FieldDescription: the control points at it via aria-describedby
export type FieldErrorProps = Omit<
  ComponentProps<"p">,
  "id" | "className" | "style"
> & {
  id: string;
};

export const FieldError = ({ children, ...nativeProps }: FieldErrorProps) => {
  const classes = createErrorClasses();

  // No role="alert": the message is read through aria-describedby when the control is focused,
  // and a live region would announce every error at once on submit
  return (
    <p {...nativeProps} className={classes.base()}>
      {/* Decorative: the text carries the meaning, the icon makes the error visible without relying on color */}
      <XOctagon aria-hidden="true" className={classes.icon()} />
      {children}
    </p>
  );
};

const createErrorClasses = tv({
  slots: {
    base: [
      "m-0",
      "flex items-center gap-8 py-4",
      "font-body font-strong text-tiny text-error",
    ],
    // Icons have their own tokens (icon/error is lighter than text/error), applied via the stroke utility
    icon: "size-24 shrink-0 stroke-error",
  },
});
