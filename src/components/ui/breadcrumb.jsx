import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import { useSizeContext } from "./size-provider"

const Breadcrumb = React.forwardRef(
  ({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />
)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center break-words text-muted-foreground",
        "size-text",
        "size-gap",
        className
      )}
      {...props}
    />
  )
})
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn("inline-flex items-center", "size-gap", className)}
      {...props}
    />
  )
})
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    (<Comp
      ref={ref}
      className={cn(
        "transition-colors hover:text-foreground",
        "size-text",
        className
      )}
      {...props} />)
  );
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "font-normal text-foreground",
        "size-text",
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
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center mx-1",
        "[&>svg]:size-icon",
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
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center",
        "size-text",
        className
      )}
      {...props}
    >
      <DotsHorizontalIcon className="size-icon" />
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
