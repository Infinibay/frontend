import * as React from "react"
import { cn } from "@/lib/utils"
import { useSizeContext, sizeVariants } from "./size-provider"

const Input = React.forwardRef(({ size: propSize, className, type, ...props }, ref) => {
  const { size: contextSize } = useSizeContext();
  const size = propSize || contextSize;
  const sizes = sizeVariants[size];

  return (
    <input
      type={type}
      className={cn(
        "w-full rounded-md border border-input bg-transparent shadow-sm transition-colors",
        "file:border-0 file:bg-transparent file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground focus:outline-none",
        "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizes.input.height,
        sizes.input.padding,
        sizes.input.text,
        className
      )}
      ref={ref}
      {...props}
    />
  );
})
Input.displayName = "Input"

export { Input }
