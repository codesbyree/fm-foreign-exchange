import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/style.utils";

type CardProps = ComponentPropsWithoutRef<"article">;

export function Card(props: CardProps) {
  const { children, className, ...rest } = props;

  return (
    <article className={cn("bg-neutral-700 border border-neutral-600 rounded-2xl px-5 py-3 space-y-4", className)} {...rest}>
      {children}
    </article>
  );
}

type CardTitleProps = ComponentPropsWithoutRef<"h4">;

export function CardTitle(props: CardTitleProps) {
  const { children, className, ...rest } = props;

  return (
    <h4 className={cn("uppercase text-sm text-neutral-200 tracking-widest", className)} {...rest}>
      {children}
    </h4>
  );
}

type CardContentProps = ComponentPropsWithoutRef<"div">;

export function CardContent(props: CardContentProps) {
  const { children, className, ...rest } = props;

  return (
    <div className={cn("", className)} {...rest}>
      {children}
    </div>
  );
}
