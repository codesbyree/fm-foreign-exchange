import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/style.utils";

type EmptyProps = ComponentPropsWithoutRef<"div">;

export function Empty(props: EmptyProps) {
  const { children, className } = props;

  return <section className={cn("space-y-4 py-10", className)}>{children}</section>;
}

type EmptyTitleProps = ComponentPropsWithoutRef<"h2">;

export function EmptyTitle(props: EmptyTitleProps) {
  const { children, className } = props;

  return <h2 className={cn("text-lg md:text-xl text-neutral-100 text-center", className)}>{children}</h2>;
}

type EmptyDescriptionProps = ComponentPropsWithoutRef<"h2">;

export function EmptyDescription(props: EmptyDescriptionProps) {
  const { children, className } = props;

  return <p className={cn("text-xs md:text-sm text-neutral-200 tracking-wider text-center", className)}>{children}</p>;
}
