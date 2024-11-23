import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import { useSizeContext, sizeVariants } from "./size-provider"

const Breadcrumb = React.forwardRef(
  ({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />
)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => {
  const { size } = useSizeContext()
  const sizes = sizeVariants[size]

  return (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center break-words text-muted-foreground",
        sizes.text,
        sizes.gap,
        className
      )}
      {...props} 
    />
  )
})
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => {
  const { size } = useSizeContext()
  const sizes = sizeVariants[size]

  return (
    <li
      ref={ref}
      className={cn("inline-flex items-center", sizes.gap, className)}
      {...props} 
    />
  )
})
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
  const { size } = useSizeContext()
  const sizes = sizeVariants[size]
  const Comp = asChild ? Slot : "a"

  return (
    (<Comp
      ref={ref}
      className={cn(
        "transition-colors hover:text-foreground",
        sizes.text,
        className
      )}
      {...props} />)
  );
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => {
  const { size } = useSizeContext()
  const sizes = sizeVariants[size]

  return (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "font-normal text-foreground",
        sizes.text,
        className
      )}
      {...props} 
    />
  )
})
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => {
  const { size } = useSizeContext()
  const sizes = sizeVariants[size]

  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center mx-1",
        `[&>svg]:${sizes.icon.size}`,
        className
      )}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  )
}
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}) => {
  const { size } = useSizeContext()
  const sizes = sizeVariants[size]

  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center",
        sizes.text,
        className
      )}
      {...props}
    >
      <DotsHorizontalIcon className={sizes.icon.size} />
      <span className="sr-only">More</span>
    </span>
  )
}
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
