import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

/**
 * Loading state component for the VM detail page
 */
const LoadingState = () => {
  return (
    <div className="size-container size-padding glass-medium">
      {/* Header skeleton */}
      <div className="size-margin-sm">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center size-margin-xs">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="size-icon" />
          </Button>
          <div className="ml-2 flex items-center space-x-2 size-small">
            <Skeleton className="h-4 w-20" />
            <span>/</span>
            <Skeleton className="h-4 w-24" />
            <span>/</span>
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* VM header skeleton card */}
        <Card glass="minimal" elevation="2" className="border-border/20">
          <CardContent className="size-card-padding">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                {/* VM name and status */}
                <div className="flex items-center gap-3">
                  <Skeleton className="size-mainheading w-48" />
                  <Skeleton className="h-6 w-20" />
                </div>

                {/* VM details */}
                <div className="grid grid-cols-1 md:grid-cols-3 size-gap">
                  <div className="space-y-1">
                    <Skeleton className="size-text w-16" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="size-text w-16" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="size-text w-16" />
                    <Skeleton className="h-5 w-36" />
                  </div>
                </div>

                {/* Template specs */}
                <div className="flex items-center size-gap">
                  <Skeleton className="size-text w-20" />
                  <Skeleton className="size-text w-24" />
                  <Skeleton className="size-text w-28" />
                </div>
              </div>

              {/* Control buttons skeleton */}
              <div className="flex items-center size-gap">
                <Skeleton className="size-button w-20" />
                <Skeleton className="size-button w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="size-margin-sm">
        {/* Tab controls skeleton */}
        <div className="flex items-center justify-between size-margin-xs">
          <div className="flex items-center size-gap">
            <div className="flex items-center glass-subtle rounded-lg p-1">
              <Skeleton className="h-8 w-24 mr-1" />
              <Skeleton className="h-8 w-32 mr-1" />
            </div>
            <Skeleton className="size-button w-24" />
          </div>
        </div>

        {/* Content area skeleton */}
        <div className="space-y-6">
          {/* Content cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 size-gap">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} glass="subtle" elevation="1">
                <CardContent className="size-card-padding">
                  <div className="space-y-3">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="size-text w-3/4" />
                    <Skeleton className="size-text w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional content skeleton */}
          <Card glass="subtle" elevation="1">
            <CardContent className="size-card-padding">
              <div className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <div className="flex size-gap">
                  <Skeleton className="h-24 w-1/3" />
                  <Skeleton className="h-24 w-1/3" />
                  <Skeleton className="h-24 w-1/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
