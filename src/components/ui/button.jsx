import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"
import { useSizeContext, sizeVariants } from "./size-provider"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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
        sm: cn(sizeVariants.sm.padding, sizeVariants.sm.text, sizeVariants.sm.height, "[&>svg]:h-4 [&>svg]:w-4"),
        md: cn(sizeVariants.md.padding, sizeVariants.md.text, sizeVariants.md.height, "[&>svg]:h-5 [&>svg]:w-5"),
        lg: cn(sizeVariants.lg.padding, sizeVariants.lg.text, sizeVariants.lg.height, "[&>svg]:h-6 [&>svg]:w-6"),
        xl: cn(sizeVariants.xl.padding, sizeVariants.xl.text, sizeVariants.xl.height, "[&>svg]:h-7 [&>svg]:w-7"),
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const Button = React.forwardRef(({ 
  className, 
  size: sizeProp,
  variant, 
  asChild = false, 
  ...props 
}, ref) => {
  const { size: contextSize } = useSizeContext()
  const size = sizeProp || contextSize
  const Comp = asChild ? Slot : "button"
  
  return (
    <Comp
      className={cn(buttonVariants({ size, variant, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
