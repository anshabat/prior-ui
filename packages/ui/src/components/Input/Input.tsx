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
  // An icon (<Search />) or an icon button (<button><X /></button>) over the input's padding.
  // Input sets the size and default color; the content decides whether it's interactive.
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

  // Always wrapped, so the structure is the same with or without icons
  return (
    <div className={classes.wrapper()}>
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
    // Positioning context for the icons only: the input draws its own border and states.
    // w-full: a block already fills its parent, but a flex item would shrink to its content.
    wrapper: "relative w-full",
    control: [
      // Browser defaults that Tailwind's preflight would otherwise reset;
      // dist/tailwind.css is built without preflight, so the input resets itself
      "box-border border-solid placeholder:opacity-100",
      // Safari draws type="search" as a native search field (own shape and padding) unless reset
      "appearance-none",
      "w-full rounded-8 border",
      "font-body font-weak",
      "bg-fill-strong-inverse border-strong text-strong placeholder:text-weak",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
      "disabled:border-disabled disabled:text-disabled disabled:placeholder:text-disabled disabled:cursor-not-allowed",
      // Invalid is driven by aria-invalid, so the visual state always matches what assistive tech announces.
      // The 2px stroke is a 1px border plus a 1px inset ring: a thicker border would shift the text.
      "enabled:aria-[invalid=true]:bg-fill-error-weak enabled:aria-[invalid=true]:border-error-strong",
      "enabled:aria-[invalid=true]:ring-1 enabled:aria-[invalid=true]:ring-inset enabled:aria-[invalid=true]:ring-error-strong",
    ],
  },
  variants: {
    // Heights and text sizes match Button's small and medium
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
  // Padding is either/or per side: the edge padding, or edge + icon + gap so text clears the icon
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

// Positions an icon or icon button over the input's padding
const InputIcon = ({ side, size, disabled, children }: InputIconProps) => {
  const classes = createIconClasses({ side, size, disabled });

  return <span className={classes}>{children}</span>;
};

const createIconClasses = tv({
  base: [
    // flex: makes the icon a flex item, so no inline baseline gap shifts it off center
    "absolute top-1/2 -translate-y-1/2 flex",
    // A plain icon lets clicks through to the input (clicking it focuses the input);
    // a slot holding a button takes clicks
    "pointer-events-none has-[button]:pointer-events-auto",
    // Size is layout (the text padding is calculated for it), so it's forced:
    // these rules are more specific than a size class on the element itself.
    // The direct child (an icon or a button) fills the slot...
    // ...and an icon nested in a button gets the same size
    "*:size-full, [&_svg]:size-full",
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
