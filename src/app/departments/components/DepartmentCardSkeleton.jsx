"use client"

import React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getGridClasses } from "@/components/ui/size-provider"

/**
 * Skeleton component for DepartmentCard
 * Replicates the exact visual structure while loading
 */
const DepartmentCardSkeleton = () => {
  return (
    <Card
      elevation="1"
      radius="md"
      className="h-full bg-card text-card-foreground border"
    >
      {/* Header with icon and delete button skeleton */}
      <CardContent className="pt-6 pb-0">
        <div className="flex justify-between items-start mb-4">
          {/* Icon skeleton */}
          <Skeleton className="w-12 h-12 rounded-lg" />
          {/* Delete button skeleton */}
          <Skeleton className="w-8 h-8 rounded-md" />
        </div>
      </CardContent>

      {/* Content skeleton */}
      <CardContent className="pt-0">
        <div className="flex justify-between items-start mb-2">
          {/* Title skeleton */}
          <Skeleton className="h-6 w-3/4 rounded" />
          {/* Arrow icon skeleton */}
          <Skeleton className="h-4 w-4 rounded flex-shrink-0 ml-2" />
        </div>

        {/* Computers stat skeleton */}
        <div className="flex items-center mb-1">
          <Skeleton className="h-4 w-4 rounded mr-2" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>

        {/* Users stat skeleton */}
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 rounded mr-2" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </CardContent>

      {/* Footer skeleton */}
      <CardFooter className="border-t bg-muted/50 py-3">
        <Skeleton className="h-4 w-4 rounded mr-2" />
        <Skeleton className="h-4 w-20 rounded" />
      </CardFooter>
    </Card>
  )
}

/**
 * Grid of DepartmentCard skeletons for loading state
 * Uses the same grid classes as the actual department grid
 */
const DepartmentGridSkeleton = ({ count = 6, size = "md" }) => {
  return (
    <div className={getGridClasses('departments', size)}>
      {[...Array(count)].map((_, i) => (
        <DepartmentCardSkeleton key={i} />
      ))}
    </div>
  )
}

export { DepartmentCardSkeleton, DepartmentGridSkeleton }
export default DepartmentCardSkeleton
