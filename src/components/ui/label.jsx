"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority"
import { HelpCircle } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"
import { cn } from "@/lib/utils"
import { useSizeContext, sizeVariants } from "./size-provider"

const labelVariants = cva(
  "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      size: {
        sm: cn(sizeVariants.sm.text, "[&+div>svg]:h-3 [&+div>svg]:w-3"),
        md: cn(sizeVariants.md.text, "[&+div>svg]:h-4 [&+div>svg]:w-4"),
        lg: cn(sizeVariants.lg.text, "[&+div>svg]:h-5 [&+div>svg]:w-5"),
        xl: cn(sizeVariants.xl.text, "[&+div>svg]:h-6 [&+div>svg]:w-6"),
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
)

const Label = React.forwardRef(({ 
  className, 
  size: sizeProp,
  moreInformation, 
  children, 
  ...props 
}, ref) => {
  const { size: contextSize } = useSizeContext()
  const size = sizeProp || contextSize

  return (
    <div className="flex items-center gap-2">
      <LabelPrimitive.Root 
        ref={ref} 
        className={cn(labelVariants({ size }), className)} 
        {...props}
      >
        {children}
      </LabelPrimitive.Root>
      {moreInformation && (
        <div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <HelpCircle className="text-muted-foreground cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent className={cn(
              "text-popover-foreground",
              size === "sm" && "w-48 text-xs p-2",
              size === "md" && "w-64 text-sm p-3",
              size === "lg" && "w-72 text-base p-4",
              size === "xl" && "w-80 text-lg p-4",
            )}>
              {moreInformation}
            </HoverCardContent>
          </HoverCard>
        </div>
      )}
    </div>
  )
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
