import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
        ) : null}
        <h2 className="text-4xl sm:text-5xl">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
