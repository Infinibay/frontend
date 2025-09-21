"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useSizeContext } from "./size-provider"
import { getTableGlass, getTableRowGlass, getDataGlassAnimation, getReducedTransparencyForm } from "@/utils/form-glass-effects"
import { useSafeResolvedTheme } from "@/utils/safe-theme"

const Table = React.forwardRef(({ className, size, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  return (
    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom",
        sizeClasses[effectiveSize],
        className
      )}
      {...props} />
  )
})
Table.displayName = "Table"

const TableContainer = React.forwardRef(({ className, size, glass = false, children, ...props }, ref) => {
  const contextSize = useSizeContext()
  const theme = useSafeResolvedTheme()
  const effectiveSize = size || contextSize || 'md'

  const glassEffect = getTableGlass(glass, theme)
  const animation = getDataGlassAnimation()
  const reducedTransparency = glass ? getReducedTransparencyForm(glassEffect.container) : ''

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-auto radius-fluent-md shadow-elevation-2",
        glass && glassEffect.container,
        glass && reducedTransparency,
        animation,
        className
      )}
      {...props}>
      {children}
    </div>
  )
})
TableContainer.displayName = "TableContainer"

const TableHeader = React.forwardRef(({ className, glass, ...props }, ref) => {
  const theme = useSafeResolvedTheme()
  const glassEffect = getTableGlass(glass, theme)
  const reducedTransparency = glass ? getReducedTransparencyForm(glassEffect.header) : ''

  return (
    <thead
      ref={ref}
      className={cn(
        "[&_tr]:border-b",
        glass && glassEffect.header,
        glass && reducedTransparency,
        className
      )}
      {...props}
    />
  )
})
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props} />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef(({ className, glass, ...props }, ref) => {
  const theme = useSafeResolvedTheme()
  const glassEffect = getTableGlass(glass, theme)
  const reducedTransparency = glass ? getReducedTransparencyForm(glassEffect.header) : ''

  return (
    <tfoot
      ref={ref}
      className={cn(
        "border-t font-medium [&>tr]:last:border-b-0",
        glass ? glassEffect.header : "bg-muted/50",
        glass && reducedTransparency,
        className
      )}
      {...props} />
  )
})
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef(({ className, glass, ...props }, ref) => {
  const animation = getDataGlassAnimation()
  const reducedTransparency = glass ? getReducedTransparencyForm('glass-subtle') : ''

  return (
    <tr
      ref={ref}
      className={cn(
        "border-b",
        glass
          ? cn(
              "transition-all duration-200 ease-in-out",
              "hover:glass-subtle hover:bg-brand-celeste/5",
              "data-[state=selected]:glass-medium data-[state=selected]:bg-brand-celeste/10",
              reducedTransparency
            )
          : "transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        animation,
        className
      )}
      {...props} />
  )
})
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ className, size, glass, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'

  const sizeClasses = {
    sm: "h-8 px-1.5",
    md: "h-10 px-2",
    lg: "h-12 px-3"
  }

  return (
    <th
      ref={ref}
      className={cn(
        "text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        sizeClasses[effectiveSize],
        glass && "glass-subtle bg-brand-celeste/5",
        className
      )}
      {...props} />
  )
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(({ className, size, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3"
  }

  return (
    <td
      ref={ref}
      className={cn(
        "align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        sizeClasses[effectiveSize],
        className
      )}
      {...props} />
  )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef(({ className, size, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'

  const sizeClasses = {
    sm: "mt-3 text-xs",
    md: "mt-4 text-sm",
    lg: "mt-5 text-base"
  }

  return (
    <caption
      ref={ref}
      className={cn(
        "text-muted-foreground",
        sizeClasses[effectiveSize],
        className
      )}
      {...props} />
  )
})
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
