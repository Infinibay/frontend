"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { fetchApplications } from "@/state/slices/applications";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import useEnsureData, { LOADING_STRATEGIES } from "@/hooks/useEnsureData";
import { createDebugger } from "@/utils/debug";

const debug = createDebugger('frontend:pages:applications');

const Page = () => {
  const router = useRouter();

  // Use optimized data loading for applications
  const {
    data: applications,
    isLoading,
    error,
    hasData
  } = useEnsureData('applications', fetchApplications, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 5 * 60 * 1000, // 5 minutes
  });

  debug.info('Applications page state:', {
    applicationsCount: applications?.length || 0,
    isLoading,
    hasError: !!error,
    hasData
  });

  const handleRowClick = (id) => {
    debug.info('Navigating to application:', id);
    router.push(`/applications/${id}`);
  };

  const renderLoadingSkeleton = () => (
    <Table className="mt-8 w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-48" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderErrorState = () => (
    <div className="mt-8 text-center">
      <div className="text-red-500 mb-4">Failed to load applications</div>
      <div className="text-sm text-muted-foreground">
        {error?.message || 'An error occurred while loading applications'}
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="mt-8 text-center">
      <div className="text-muted-foreground">No applications available</div>
    </div>
  );

  return (
    <div className="flex flex-1 justify-between overflow-hidden w-full">
      <div className="flex pb-10 border border-b-0 flex-col justify-between flex-1">
        <div className="border-b py-6">
          <div className="dashboard_container flex items-center justify-between w-full">
            <h1 className="5xl:text-3xl text-lg sm:text-2xl flex-1 font-medium text-gray-800">
              Applications
            </h1>
          </div>
        </div>
        <div className="dashboard_container flex-1">
          {isLoading ? (
            renderLoadingSkeleton()
          ) : error ? (
            renderErrorState()
          ) : !applications || applications.length === 0 ? (
            renderEmptyState()
          ) : (
            <Table className="mt-8 w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow
                    key={application.id}
                    onClick={() => handleRowClick(application.id)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>{application.name}</TableCell>
                    <TableCell>{application.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
