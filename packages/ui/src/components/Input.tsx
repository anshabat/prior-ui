import { ComponentProps } from "react";

export type InputProps = ComponentProps<"input">;

export const Input = ({ type = "text", ...nativeProps }: InputProps) => {
  return <input type={type} {...nativeProps} />;
};
