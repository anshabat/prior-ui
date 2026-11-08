import { ComponentProps, ReactNode, useId } from "react";
import { tv } from "tailwind-variants/lite";
import { XOctagon } from "@workspace/icons";

// Props Field hands to its control. Any control (Input, later Textarea, Select) accepts them natively.
export type FieldControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  required?: boolean;
  disabled?: boolean;
};

export type FieldProps = {
  label: ReactNode;
  description?: ReactNode;
  // Invalid state is derived from `error`, so a field can't turn red without a message explaining why
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  // Render prop instead of context: Field stays usable in server components
  children: (control: FieldControlProps) => ReactNode;
};

export const Field = ({
  label,
  description,
  error,
  required,
  disabled,
  id,
  children,
}: FieldProps) => {
  // Hooks can't be called conditionally, so useId always runs even when `id` is passed
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const descriptionId = `${controlId}-description`;
  const errorId = `${controlId}-error`;

  const hasDescription = Boolean(description);
  const hasError = Boolean(error);

  // Only reference parts that are rendered: a dangling id makes the description empty
  const describedBy =
    [hasDescription && descriptionId, hasError && errorId]
      .filter(Boolean)
      .join(" ") || undefined;

  const classes = createFieldClasses();

  return (
    <div className={classes.root()}>
      <div className={classes.header()}>
        <FieldLabel htmlFor={controlId} required={required} disabled={disabled}>
          {label}
        </FieldLabel>
        {hasDescription && (
          <FieldDescription id={descriptionId} disabled={disabled}>
            {description}
          </FieldDescription>
        )}
      </div>
      {hasError && <FieldError id={errorId}>{error}</FieldError>}
      {children({
        id: controlId,
        "aria-describedby": describedBy,
        "aria-invalid": hasError ? true : undefined,
        required,
        disabled,
      })}
    </div>
  );
};

const createFieldClasses = tv({
  slots: {
    root: "flex flex-col gap-4 w-full",
    // Label and description sit together with no gap, as in Figma's "Text" frame
    header: "flex flex-col",
  },
});

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
    <label className={classes.base()} {...nativeProps}>
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
  disabled?: boolean;
};

export const FieldDescription = ({
  disabled,
  children,
  ...nativeProps
}: FieldDescriptionProps) => {
  const classes = createDescriptionClasses({ disabled });

  return (
    <p className={classes} {...nativeProps}>
      {children}
    </p>
  );
};

const createDescriptionClasses = tv({
  base: ["m-0", "font-body font-weak text-tiny"],
  variants: {
    // Dims together with the label, so a disabled field reads as one unit (approved deviation from Figma)
    disabled: {
      false: "text-weak",
      true: "text-disabled",
    },
  },
  defaultVariants: {
    disabled: false,
  },
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
    <p className={classes.base()} {...nativeProps}>
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
