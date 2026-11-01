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
  // An icon element, e.g. <Search />. Input's wrapper sets its size, color and aria-hidden.
  startIcon?: ReactNode;
};

// The frame (border, background, states) lives on a wrapper, so icons can sit inside the border.
export const Input = ({
  type = "text",
  size,
  startIcon,
  ...nativeProps
}: InputProps) => {
  const classes = createClasses({ size, hasStartIcon: Boolean(startIcon) });

  return (
    <div className={classes.frame()}>
      {startIcon && (
        // Decorative: the input's label carries the meaning
        <span aria-hidden="true" className={classes.startIcon()}>
          {startIcon}
        </span>
      )}
      {/* className goes last so it can't be overridden by props that bypass the type */}
      <input {...nativeProps} type={type} className={classes.control()} />
    </div>
  );
};

const createClasses = tv({
  slots: {
    // The frame reacts to the state of the input inside it via :has()
    frame: [
      "group/input relative",
      "box-border border-solid",
      "flex items-center w-full rounded-8 border",
      "bg-fill-strong-inverse border-strong",
      "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
      "has-[:disabled]:border-disabled has-[:disabled]:cursor-not-allowed",
      // The 2px stroke is a 1px border plus a 1px inset ring: a thicker border would shift the text.
      "has-[:enabled[aria-invalid=true]]:bg-fill-error-weak has-[:enabled[aria-invalid=true]]:border-error-strong",
      "has-[:enabled[aria-invalid=true]]:ring-1 has-[:enabled[aria-invalid=true]]:ring-inset has-[:enabled[aria-invalid=true]]:ring-error-strong",
    ],
    // Overlays the input's padding and lets clicks through, so clicking the icon focuses the input
    startIcon: [
      "pointer-events-none absolute top-1/2 -translate-y-1/2 flex",
      // The wrapper styles the icon through the child selector (*:), so the icon element needs no props.
      // Child rules are more specific than a class on the icon itself, so they win.
      "*:size-full *:stroke-neutral",
      // Read from the DOM, so a disabled <fieldset> greys the icon too
      "group-has-[:disabled]/input:*:stroke-disabled",
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
      small: {
        frame: "h-32",
        startIcon: "left-12 size-16",
        control: "pr-12 text-tiny",
      },
      medium: {
        frame: "h-48",
        startIcon: "left-16 size-24",
        control: "pr-16 text-small",
      },
    },
    hasStartIcon: {
      true: {},
      false: {},
    },
  },
  // Left padding is either/or: the edge padding, or edge + icon + gap so text clears the icon
  compoundVariants: [
    { size: "small", hasStartIcon: false, class: { control: "pl-12" } },
    { size: "small", hasStartIcon: true, class: { control: "pl-32" } },
    { size: "medium", hasStartIcon: false, class: { control: "pl-16" } },
    { size: "medium", hasStartIcon: true, class: { control: "pl-48" } },
  ],
  defaultVariants: {
    size: "medium",
    hasStartIcon: false,
  },
});
