import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

/**
 * Loading state component for the VM detail page
 */
const LoadingState = () => {
  return (
    <div className="p-6">
      {/* Header skeleton */}
      <div className="mb-6">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center mb-4">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="ml-2 flex items-center space-x-2">
            <Skeleton className="h-4 w-20" />
            <span>/</span>
            <Skeleton className="h-4 w-24" />
            <span>/</span>
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* VM header skeleton */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            {/* VM name and status */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-6 w-20" />
            </div>

            {/* VM details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-36" />
              </div>
            </div>

            {/* Template specs */}
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          {/* Control buttons skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>

      {/* Tab controls skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Skeleton className="h-8 w-24 mr-1" />
            <Skeleton className="h-8 w-32 mr-1" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-8 w-24 ml-2" />
        </div>
      </div>

      {/* Content area skeleton */}
      <div className="space-y-6">
        {/* Content cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Additional content skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <div className="flex space-x-4">
            <Skeleton className="h-24 w-1/3" />
            <Skeleton className="h-24 w-1/3" />
            <Skeleton className="h-24 w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
