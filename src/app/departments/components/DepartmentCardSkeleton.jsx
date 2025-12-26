"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSizeContext, getGridClasses } from "@/components/ui/size-provider"
import { cn } from "@/lib/utils"

/**
 * Skeleton component for DepartmentCard
 * Matches the compact vertical card layout
 */
const DepartmentCardSkeleton = () => {
  return (
    <Card
      elevation="1"
      radius="md"
      className="h-full bg-card text-card-foreground border"
    >
      <CardContent className="flex flex-col gap-4 p-4 sm:p-5 h-full">
        {/* Header: Icon + Title + Delete button */}
        <div className="flex items-center gap-3">
          {/* Icon skeleton */}
          <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
          {/* Text skeleton */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
          {/* Delete button skeleton */}
          <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
        </div>

        {/* Stats row - at bottom */}
        <div className="flex items-center justify-between mt-auto">
          <Skeleton className="h-3.5 w-20 rounded" />
          <Skeleton className="h-3.5 w-16 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Grid of DepartmentCard skeletons for loading state
 * Uses responsive grid layout matching the actual department grid
 */
const DepartmentGridSkeleton = ({ count = 6 }) => {
  const { size } = useSizeContext()

  return (
    <div className={cn(getGridClasses('departments', size), "mt-6")}>
      {[...Array(count)].map((_, i) => (
        <DepartmentCardSkeleton key={i} />
      ))}
    </div>
  )
}

export { DepartmentCardSkeleton, DepartmentGridSkeleton }
export default DepartmentCardSkeleton
