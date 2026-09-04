import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand",
        className
      )}
    >
      <span className="h-px w-6 bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag className="text-balance font-display text-3xl font-semibold leading-[1.1] text-fg sm:text-4xl lg:text-[2.75rem]">
        {title}
      </Tag>
      {description && (
        <p className="max-w-2xl text-balance text-base leading-relaxed text-fg-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
