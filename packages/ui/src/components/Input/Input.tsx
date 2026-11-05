import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants/lite";

type Size = "small" | "medium";

export type InputProps = Omit<
  ComponentProps<"input">,
  "size" | "className" | "style"
> & {
  size?: Size;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export const Input = ({
  type = "text",
  size,
  disabled,
  startIcon,
  endIcon,
  ...nativeProps
}: InputProps) => {
  const classes = createClasses({
    size,
    hasStartIcon: Boolean(startIcon),
    hasEndIcon: Boolean(endIcon),
  });

  return (
    <div className={classes.wrapper()}>
      {startIcon && (
        <InputIcon side="start" size={size} disabled={disabled}>
          {startIcon}
        </InputIcon>
      )}
      <input
        className={classes.control()}
        {...nativeProps}
        type={type}
        disabled={disabled}
      />
      {endIcon && (
        <InputIcon side="end" size={size} disabled={disabled}>
          {endIcon}
        </InputIcon>
      )}
    </div>
  );
};

const createClasses = tv({
  slots: {
    wrapper: "relative w-full",
    control: [
      "box-border border-solid placeholder:opacity-100",
      "appearance-none",
      "w-full rounded-8 border",
      "font-body font-weak",
      "bg-fill-strong-inverse border-strong text-strong placeholder:text-weak",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
      "disabled:border-disabled disabled:text-disabled disabled:placeholder:text-disabled disabled:cursor-not-allowed",
      "enabled:aria-[invalid=true]:bg-fill-error-weak enabled:aria-[invalid=true]:border-error-strong",
      "enabled:aria-[invalid=true]:ring-1 enabled:aria-[invalid=true]:ring-inset enabled:aria-[invalid=true]:ring-error-strong",
    ],
  },
  variants: {
    size: {
      small: { control: "h-32 text-tiny" },
      medium: { control: "h-48 text-small" },
    },
    hasStartIcon: {
      true: {},
      false: {},
    },
    hasEndIcon: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    { size: "small", hasStartIcon: false, class: { control: "pl-12" } },
    { size: "small", hasStartIcon: true, class: { control: "pl-32" } },
    { size: "medium", hasStartIcon: false, class: { control: "pl-16" } },
    { size: "medium", hasStartIcon: true, class: { control: "pl-48" } },
    { size: "small", hasEndIcon: false, class: { control: "pr-12" } },
    { size: "small", hasEndIcon: true, class: { control: "pr-32" } },
    { size: "medium", hasEndIcon: false, class: { control: "pr-16" } },
    { size: "medium", hasEndIcon: true, class: { control: "pr-48" } },
  ],
  defaultVariants: {
    size: "medium",
    hasStartIcon: false,
    hasEndIcon: false,
  },
});

type InputIconProps = {
  side: "start" | "end";
  size?: Size;
  disabled?: boolean;
  children: ReactNode;
};

const InputIcon = ({ side, size, disabled, children }: InputIconProps) => {
  const classes = createIconClasses({ side, size, disabled });

  return <span className={classes}>{children}</span>;
};

const createIconClasses = tv({
  base: [
    "absolute top-1/2 -translate-y-1/2 flex",
    "pointer-events-none has-[button]:pointer-events-auto",
    "*:size-full [&_svg]:size-full",
  ],
  variants: {
    side: {
      start: "",
      end: "",
    },
    size: {
      small: "size-16",
      medium: "size-24",
    },
    disabled: {
      false: "text-icon-neutral",
      true: "text-icon-disabled",
    },
  },
  compoundVariants: [
    { side: "start", size: "small", class: "left-12" },
    { side: "start", size: "medium", class: "left-16" },
    { side: "end", size: "small", class: "right-12" },
    { side: "end", size: "medium", class: "right-16" },
  ],
  defaultVariants: {
    size: "medium",
    disabled: false,
  },
});
