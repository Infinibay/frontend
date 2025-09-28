"use client"

import { cn } from "@/lib/utils"

/**
 * A loading skeleton component that displays a shimmer effect
 * Used as a placeholder while content is loading
 */
export function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-primary/5 after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-primary/10 after:to-transparent",
        className
      )}
      {...props}
    />
  );
}

export default Skeleton
