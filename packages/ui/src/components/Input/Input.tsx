import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants/lite";

type Size = "small" | "medium";

// Native `size` (width in characters) is replaced by the design-system size scale.
// `className` and `style` are not accepted: the input's look is owned by the design system.
export type InputProps = Omit<
  ComponentProps<"input">,
  "size" | "className" | "style"
> & {
  size?: Size;
  // An icon (<Search />) or an icon button (<button><X /></button>) inside the frame.
  // Input sets the size and color; the content decides whether it's interactive.
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

// The frame (border, background, states) lives on a wrapper, so icons can sit inside the border.
export const Input = ({
  type = "text",
  size,
  disabled,
  startIcon,
  endIcon,
  ...nativeProps
}: InputProps) => {
  const ariaInvalid = nativeProps["aria-invalid"];
  const invalid = ariaInvalid === true || ariaInvalid === "true";

  const classes = createClasses({
    size,
    disabled,
    invalid,
    hasStartIcon: Boolean(startIcon),
    hasEndIcon: Boolean(endIcon),
  });

  return (
    <div className={classes.frame()}>
      {startIcon && (
        <InputIcon side="start" size={size} disabled={disabled}>
          {startIcon}
        </InputIcon>
      )}
      {/* className goes last so it can't be overridden by props that bypass the type */}
      <input
        {...nativeProps}
        type={type}
        disabled={disabled}
        className={classes.control()}
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
    frame: [
      "relative box-border border-solid",
      "flex items-center w-full rounded-8 border",
      // Focus is a live DOM state, so it stays in CSS. `input` (not any element) keeps a focused
      // icon button from lighting up the frame.
      "has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2",
      "has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-focus",
    ],
    control: [
      // Reset browser defaults: dist/tailwind.css is built without preflight
      "box-border m-0 border-0 bg-transparent placeholder:opacity-100",
      // Safari draws type="search" as a native search field (own shape and padding) unless reset
      "appearance-none",
      // Fills the frame, so clicking anywhere inside it focuses the input
      "h-full w-full min-w-0",
      // Rounded like the frame, so the browser's autofill background doesn't fill the frame's corners.
      // The frame's inner radius is 7px (8 minus the 1px border); a larger radius stays inside it.
      "rounded-8",
      // The frame draws the focus ring
      "outline-none",
      "font-body font-weak text-strong placeholder:text-weak",
      "disabled:text-disabled disabled:placeholder:text-disabled disabled:cursor-not-allowed",
    ],
  },
  variants: {
    // Heights and text sizes match Button's small and medium
    size: {
      small: { frame: "h-32", control: "text-tiny" },
      medium: { frame: "h-48", control: "text-small" },
    },
    disabled: {
      true: { frame: "bg-fill-strong-inverse border-disabled cursor-not-allowed" },
      false: {},
    },
    invalid: {
      true: {},
      false: {},
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
    // Frame colors are either/or. Disabled wins over invalid: a disabled field can't be fixed.
    {
      disabled: false,
      invalid: false,
      class: { frame: "bg-fill-strong-inverse border-strong" },
    },
    {
      disabled: false,
      invalid: true,
      // The 2px stroke is a 1px border plus a 1px inset ring: a thicker border would shift the text.
      class: {
        frame: "bg-fill-error-weak border-error-strong ring-1 ring-inset ring-error-strong",
      },
    },
    // Padding is either/or per side: the edge padding, or edge + icon + gap so text clears the icon
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
    disabled: false,
    invalid: false,
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

// Positions an icon or icon button inside the frame, over the input's padding
const InputIcon = ({ side, size, disabled, children }: InputIconProps) => {
  const classes = createIconClasses({ side, size, disabled });

  return <span className={classes}>{children}</span>;
};

const createIconClasses = tv({
  base: [
    "absolute top-1/2 -translate-y-1/2 flex",
    // A plain icon lets clicks through to the input; a slot holding a button takes them
    "pointer-events-none has-[button]:pointer-events-auto",
    // Size is layout (the text padding is calculated for it), so it's forced: these rules are
    // more specific than a size class on the element itself.
    // The direct child (an icon or a button) fills the slot...
    "*:size-full",
    // ...and every icon inside, also one nested in a button, gets the same size
    "[&_svg]:size-full",
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
    // A default, not a force: icons draw with currentColor and inherit it,
    // so an icon with its own color class or `color` prop keeps it
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
