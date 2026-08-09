import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/style.utils";

type Props = ComponentPropsWithoutRef<"input">;

export default function Input(props: Props) {
  const { id, onChange, disabled, defaultValue, name, className, ...rest } = props;

  return (
    <input
      id={id}
      onChange={onChange}
      disabled={disabled}
      defaultValue={defaultValue}
      name={name}
      className={cn("text-sm text-neutral-50 w-full border-none outline-transparent outline-1 focus:outline-lime-500 p-1 rounded-md", className)}
      {...rest}
    />
  );
}
