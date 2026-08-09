import type { ComponentPropsWithRef } from "react";
import { cn } from "../../utils/style.utils";
import { cva, type VariantProps } from "class-variance-authority";

const button = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "rounded-md",
    "text-xs",
    "font-medium",
    "uppercase",
    "tracking-[0.15em]",
    "transition-all",
    "duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-lime-400",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-neutral-950",
    "disabled:pointer-events-none",
    "cursor-pointer",
  ],
  {
    variants: {
      intent: {
        primary: ["bg-lime-500", "text-black", "hover:bg-lime-500/80"],
        outline: ["border", "border-lime-400", "text-neutral-50", "bg-transparent", "hover:bg-lime-400/20"],
        secondary: ["bg-neutral-600", "text-neutral-50", "hover:bg-neutral-500", "hover:text-white", "border", "border-neutral-400"],
      },
      size: {
        large: ["p-2.5", "h-10"],
        default: ["px-3", "h-8"],
        small: ["px-3", "h-7.5", "text-xs"],
        icon: ["w-8", "h-8", "p-0"],
        "icon-xl": ["w-12", "h-12"],
      },
      disabled: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        intent: "outline",
        disabled: true,
        class: "border-neutral-700 text-neutral-500 bg-transparent",
      },
      {
        intent: ["primary", "secondary"],
        disabled: true,
        class: "opacity-50",
      },
    ],
    defaultVariants: {
      intent: "primary",
      size: "default",
      disabled: false,
    },
  },
);

export interface ButtonProps extends Omit<ComponentPropsWithRef<"button">, "disabled">, VariantProps<typeof button> {}

export function Button({ className, intent, size, disabled, children, ...props }: ButtonProps) {
  return (
    <button className={cn(button({ intent, size, disabled }), className)} disabled={disabled || undefined} {...props}>
      {children}
    </button>
  );
}
