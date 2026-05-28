import { InputHTMLAttributes } from "react";
import { tv } from "tailwind-variants";

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = (props: CheckboxProps) => {
  const classes = tv({
    base: [
      "relative",
      "appearance-none",
      "w-5",
      "h-5",
      "border",
      "overflow-hidden",
      "cursor-pointer",
      "border-color-border-medium",
      "checked:border-color-bg-primary",
      "checked:before:content-[attr(data-check)]",
      "checked:before:bg-color-bg-primary",
      "checked:before:text-color-text-onPrimary",
      "checked:before:absolute",
      "checked:before:inset-0",
      "checked:before:flex",
      "checked:before:items-center",
      "checked:before:justify-center",
      "checked:before:text-sm",
    ],
  });

  return (
    <input type="checkbox" data-check="✓" className={classes()} {...props} />
  );
};
