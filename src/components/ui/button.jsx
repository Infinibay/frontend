import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"
import { useSizeContext, sizeVariants } from "./size-provider"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-background text-foreground shadow-sm hover:bg-accent/10 hover:border-ring/30 hover:shadow-md active:bg-accent/20 active:shadow-inner",
        primary:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-md active:bg-primary/80 active:shadow-inner",
        outline:
          "border-2 border-input bg-transparent shadow-sm hover:bg-accent/10 hover:border-ring/30 hover:shadow-md active:bg-accent/20 active:shadow-inner",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90 hover:shadow-md active:bg-secondary/70 active:shadow-inner",
        ghost: "hover:bg-accent/10 hover:text-foreground active:bg-accent/20",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/90 active:text-primary/70",
        success:
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 hover:shadow-md active:bg-accent/80 active:shadow-inner",
        error:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md active:bg-destructive/80 active:shadow-inner",
        info:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:bg-primary/80 active:shadow-inner",
        warning:
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 hover:shadow-md active:bg-accent/80 active:shadow-inner",
      },
      glass: {
        none: "",
        subtle: "glass-subtle backdrop-blur-sm",
        medium: "glass-medium backdrop-blur-md",
        strong: "glass-strong backdrop-blur-lg",
        mica: "mica backdrop-blur-xl",
        acrylic: "acrylic backdrop-blur-2xl",
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
      glass: "none",
    },
  }
)

const Button = React.forwardRef(({
  className,
  size: sizeProp,
  variant,
  glass: glassProp,
  asChild = false,
  ...props
}, ref) => {
  const { size: contextSize } = useSizeContext()
  const size = sizeProp || contextSize

  // Size-responsive glass intensity
  const getResponsiveGlass = (glass) => {
    if (!glass || glass === 'none') return 'none'
    if (size === 'sm') {
      return glass === 'strong' || glass === 'mica' || glass === 'acrylic' ? 'medium' : glass
    }
    return glass
  }

  const glass = getResponsiveGlass(glassProp)
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ size, variant, glass, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
