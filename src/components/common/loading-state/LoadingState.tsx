import { Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Standardized LoadingState Component
 * 
 * Displays a loading spinner with optional label text.
 * Used consistently across all roles and modules.
 */

type LoadingStateProps = {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function LoadingState({
  label = "Loading",
  className,
  size = "md",
}: LoadingStateProps) {
  const sizeClass = {
    sm: "scale-100",
    md: "scale-125",
    lg: "scale-150",
  }[size];

  return (
    <section
      className={cn(
        "flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-border bg-background p-8 text-center dark:bg-background",
        className,
      )}
    >
      <div className={sizeClass}>
        <Spinner />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </section>
  );
}
