import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:scale-[1.02] hover:-translate-y-[1px] active:scale-[0.98] active:translate-y-[1px] active:transition-none",
  {
    variants: {
      variant: {
        default:
          "border border-gray-200 bg-white text-gray-900 shadow-sm hover:border-gray-300 hover:bg-gray-100 hover:shadow-md active:bg-gray-200 active:shadow-inner",
        primary:
          "bg-primary text-primary-foreground shadow hover:bg-primary-hover hover:shadow-md active:bg-primary/80 active:shadow-inner",
        outline:
          "border-2 border-gray-200 bg-transparent shadow-sm hover:bg-gray-100/80 hover:border-gray-400 hover:shadow-md active:bg-gray-200/90 active:shadow-inner",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary-hover hover:shadow-md active:bg-secondary/70 active:shadow-inner",
        ghost: "hover:bg-gray-200/80 hover:text-gray-900 active:bg-gray-300/90",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover active:text-primary/70",
        success:
          "bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 hover:shadow-md active:bg-emerald-700 active:shadow-inner",
        error:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive-hover hover:shadow-md active:bg-destructive/80 active:shadow-inner",
        info:
          "bg-blue-500 text-white shadow-sm hover:bg-blue-600 hover:shadow-md active:bg-blue-700 active:shadow-inner",
        warning:
          "bg-amber-500 text-white shadow-sm hover:bg-amber-600 hover:shadow-md active:bg-amber-700 active:shadow-inner",
      },
      size: {
        sm: "h-8 px-3 py-1.5 text-xs [&_svg]:size-3.5",
        md: "h-10 px-4 py-2 [&_svg]:size-4",
        lg: "h-12 px-6 py-2.5 text-base [&_svg]:size-5",
        xl: "h-14 px-8 py-3 text-lg [&_svg]:size-6",
        icon: "h-10 w-10 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
