import { cn } from "@/lib/utils";

import type { EmptyStateProps } from "./EmptyState.types";

/**
 * Standardized EmptyState Component
 * 
 * Displays an empty state with icon, title, description, and optional action button.
 * Used consistently across all roles and modules.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background p-8 text-center dark:bg-background",
        className,
      )}
    >
      {icon ? <div className="mb-4 text-primary">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}
