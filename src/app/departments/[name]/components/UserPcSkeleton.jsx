"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getGridClasses } from "@/components/ui/size-provider"
import { getGlassClasses } from "@/utils/glass-effects"

/**
 * Skeleton component for UserPc in grid view
 * Replicates the exact visual structure of the UserPc card
 */
const UserPcSkeleton = () => {
  return (
    <Card className="w-[180px] border border-dashed">
      <div className="relative">
        <CardContent className="p-0">
          {/* Monitor Image Section skeleton */}
          <div className="px-8 py-4 rounded-t-xl">
            <Skeleton className="w-full max-w-[100px] h-20 mx-auto rounded" />
          </div>

          {/* PC Name Section skeleton */}
          <div className="bg-[#1E1E1E]/20 px-5 py-1.5 rounded-b-xl">
            <Skeleton className="h-5 w-full rounded" />
          </div>
        </CardContent>

        {/* User Avatar skeleton */}
        <div className="absolute -bottom-1.5 -right-2">
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>

        {/* Status Indicator skeleton */}
        <Skeleton className="absolute -top-2 -right-2 w-5 h-5 rounded-full" />
      </div>

      {/* Action Buttons skeleton */}
      <div className="flex justify-center gap-1 mt-1 pb-2">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-8 h-8 rounded" />
      </div>
    </Card>
  )
}

/**
 * Skeleton component for UserPc in table view (single row)
 */
const UserPcTableRowSkeleton = () => {
  return (
    <tr className="border-b border-glass-border">
      {/* Name column with status indicator */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
      </td>
      {/* User column */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      </td>
      {/* Status column */}
      <td className="px-4 py-3">
        <Skeleton className="h-6 w-16 rounded-full" />
      </td>
      {/* Actions column */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="w-16 h-8 rounded" />
          <Skeleton className="w-16 h-8 rounded" />
        </div>
      </td>
    </tr>
  )
}

/**
 * Grid of UserPc skeletons for loading state
 * Uses the same grid classes as the actual machine grid
 */
const MachineGridSkeleton = ({ count = 6, size = "md" }) => {
  return (
    <div className={cn(
      getGridClasses('computers', size),
      "justify-start gap-4"
    )}>
      {[...Array(count)].map((_, i) => (
        <UserPcSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Table of UserPc skeletons for loading state
 * Replicates the exact structure of MachineTable
 */
const MachineTableSkeleton = ({ count = 6 }) => {
  return (
    <div className={cn(
      getGlassClasses({ glass: 'subtle', elevation: 2, radius: 'lg' }),
      "p-4 overflow-x-auto"
    )}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-glass-surface/50 border-b border-glass-border">
            <th className="px-4 py-3 text-left text-glass-text-primary font-medium">
              Name
            </th>
            <th className="px-4 py-3 text-left text-glass-text-primary font-medium">
              User
            </th>
            <th className="px-4 py-3 text-left text-glass-text-primary font-medium">
              Status
            </th>
            <th className="px-4 py-3 text-right text-glass-text-primary font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(count)].map((_, i) => (
            <UserPcTableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export {
  UserPcSkeleton,
  UserPcTableRowSkeleton,
  MachineGridSkeleton,
  MachineTableSkeleton
}
export default UserPcSkeleton
