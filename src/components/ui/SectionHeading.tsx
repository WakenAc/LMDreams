import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]",
        tone === "light" ? "text-copper-500" : "text-copper-200",
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
  tone = "light",
  align = "left",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
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
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <Tag
        className={cn(
          "text-balance font-display text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-[2.75rem]",
          tone === "light" ? "text-ink" : "text-paper"
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-balance text-base leading-relaxed sm:text-lg",
            tone === "light" ? "text-stone-600" : "text-stone-300"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
