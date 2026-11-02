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

  const classes = createClasses({
    tone,
    size,
    orientation,
    hasTitle: Boolean(title),
    dismissible: Boolean(onDismiss),
  });

  return (
    <div {...nativeProps} className={classes.root()}>
      <div className={classes.content()}>
        <span aria-hidden="true" className={classes.icon()}>
          <ToneIcon />
        </span>
        <div className={classes.text()}>
          {title && <p className={classes.title()}>{title}</p>}
          {children && <div className={classes.description()}>{children}</div>}
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className={classes.dismiss()}
        >
          <X aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

const createClasses = tv({
  slots: {
    root: [
      "box-border relative flex",
      "rounded-8 border border-s-4 border-solid",
      "break-words",
    ],
    content: "flex flex-1 min-w-0 items-start",
    icon: "flex shrink-0 items-center [&_svg]:size-24",
    text: "flex flex-col gap-4",
    title: "m-0 text-strong",
    description: "text-weak",
    dismiss: [
      "absolute flex m-0 p-0 border-0 bg-transparent appearance-none cursor-pointer",
      "text-icon-neutral [&_svg]:size-24",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
    ],
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
        content: "p-16",
        title: "font-body font-strong text-tiny",
        description: "font-body font-weak text-tiny",
        dismiss: "top-16 end-16",
      },
      large: {
        content: "p-24",
        title: "font-heading font-strong text-heading-4",
        description: "font-body font-weak text-small",
        dismiss: "top-24 end-24",
      },
    },
    orientation: {
      horizontal: {
        content: "flex-row gap-12",
        text: "flex-1 min-w-0",
      },
      vertical: {
        content: "flex-col",
      },
    },
    hasTitle: { true: {}, false: {} },
    dismissible: { true: {}, false: {} },
  },
  compoundVariants: [
    { size: "small", orientation: "vertical", class: { content: "gap-8" } },
    { size: "large", orientation: "vertical", class: { content: "gap-12" } },
    {
      size: "large",
      orientation: "horizontal",
      class: { icon: "h-[var(--line-height-heading-4)]" },
    },
    {
      size: "large",
      orientation: "horizontal",
      hasTitle: false,
      class: {
        description:
          "pt-[calc((var(--line-height-heading-4)_-_var(--line-height-small))_/_2)]",
      },
    },
    {
      size: "small",
      orientation: "horizontal",
      class: {
        text: "pt-[calc((var(--spacing-24)_-_var(--line-height-tiny))_/_2)]",
      },
    },
    { size: "large", dismissible: true, class: { text: "pe-24" } },
    {
      size: "small",
      orientation: "horizontal",
      dismissible: true,
      class: { text: "pe-[calc(var(--spacing-24)_+_var(--spacing-12))]" },
    },
  ],
});
