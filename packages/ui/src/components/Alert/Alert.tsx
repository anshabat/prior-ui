import { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  XOctagon,
} from "@workspace/icons";

type Tone = "error" | "warning" | "success" | "information";
type Size = "small" | "large";
type Orientation = "horizontal" | "vertical";

export type AlertProps = Omit<
  ComponentProps<"div">,
  "title" | "className" | "style"
> & {
  tone: Tone;
  size?: Size;
  orientation?: Orientation;
  title?: ReactNode;
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
  dismissLabel?: string;
};

const toneIcons: Record<Tone, typeof X> = {
  error: XOctagon,
  warning: AlertTriangle,
  success: CheckCircle,
  information: Info,
};

export const Alert = ({
  tone,
  size = "large",
  orientation = "horizontal",
  title,
  onDismiss,
  dismissLabel = "Dismiss",
  children,
  ...nativeProps
}: AlertProps) => {
  const ToneIcon = toneIcons[tone];

  const classes = createClasses({ tone, size, orientation });

  return (
    <div className={classes.root()} {...nativeProps}>
      <span aria-hidden="true" className={classes.icon()}>
        <ToneIcon />
      </span>
      {title && <p className={classes.title()}>{title}</p>}
      {children && <div className={classes.description()}>{children}</div>}
      {onDismiss && (
        <div className={classes.dismiss()}>
          <DismissButton label={dismissLabel} onClick={onDismiss} />
        </div>
      )}
    </div>
  );
};

const createClasses = tv({
  slots: {
    root: [
      "box-border grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-y-4",
      "rounded-8 border border-s-4 border-solid",
      "break-words",
    ],
    icon: "col-start-1 row-start-1 flex [&_svg]:size-24",
    title: "m-0 font-strong text-strong",
    description: "font-body font-weak text-weak",
    dismiss: "col-start-3 row-start-1 ms-12 flex",
  },
  variants: {
    tone: {
      error: {
        root: "bg-fill-error-weak border-error-weak border-s-error-strong",
        icon: "text-icon-error",
      },
      warning: {
        root: "bg-fill-warning-weak border-warning-weak border-s-warning-strong",
        icon: "text-icon-warning",
      },
      success: {
        root: "bg-fill-success-weak border-success-weak border-s-success-strong",
        icon: "text-icon-success",
      },
      information: {
        root: "bg-fill-information-weak border-information-weak border-s-information-strong",
        icon: "text-icon-information",
      },
    },
    size: {
      small: {
        root: "p-16",
        title: "font-body text-tiny",
        description: "text-tiny",
      },
      large: {
        root: "p-24",
        title: "font-heading text-heading-4",
        description: "text-small",
      },
    },
    orientation: {
      horizontal: {
        icon: "me-12",
        title: "col-start-2",
        description: "col-start-2",
      },
      vertical: {
        title: "col-span-full",
        description: "col-span-full",
      },
    },
  },
  compoundVariants: [
    { size: "large", orientation: "vertical", class: { icon: "mb-8" } },
    { size: "small", orientation: "vertical", class: { icon: "mb-4" } },
  ],
});

type DismissButtonProps = {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

// TODO: replace with IconButton component
const DismissButton = ({ label, onClick }: DismissButtonProps) => {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={createDismissButtonClasses()}
    >
      <X aria-hidden="true" />
    </button>
  );
};

const createDismissButtonClasses = tv({
  //TODO: after adding size prop to Icon components, remove [&_svg]:size-24
  base: [
    "flex m-0 p-0 border-0 bg-transparent appearance-none cursor-pointer",
    "text-icon-neutral [&_svg]:size-24",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
  ],
});
