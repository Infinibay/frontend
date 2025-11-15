"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { fetchApplications } from "@/state/slices/applications";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import useEnsureData, { LOADING_STRATEGIES } from "@/hooks/useEnsureData";
import { usePageHeader } from '@/hooks/usePageHeader';
import { Package, Search, Plus, Settings } from 'lucide-react';
import { createDebugger } from "@/utils/debug";

const debug = createDebugger('frontend:pages:applications');

const Page = () => {
  const router = useRouter();

  // Use optimized data loading for applications
  const {
    data: applications,
    isLoading,
    error,
    hasData,
    refresh: refreshApplications
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

  const handleRefresh = () => {
    debug.info('action', 'Refresh button clicked');
    refreshApplications();
  };

  const handleNewApp = () => {
    debug.info('navigation', 'Create application navigation triggered');
    router.push('/applications/create');
  };

  // Help configuration
  const helpConfig = useMemo(() => ({
    title: "Applications Help",
    description: "Learn how to manage and configure applications in Infinibay",
    icon: <Package className="h-5 w-5 text-primary" />,
    sections: [
      {
        id: "managing-apps",
        title: "Managing Applications",
        icon: <Package className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Creating Applications</p>
              <p>The "New App" button creates new application entries. Each application requires a name and description.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Viewing Applications</p>
              <p>Applications are displayed in a table view with sortable columns. Click any row to view details.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Editing Applications</p>
              <p>Modify application settings and configurations through the details page.</p>
            </div>
          </div>
        ),
      },
      {
        id: "app-details",
        title: "Application Details",
        icon: <Settings className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Name and Description</p>
              <p>Core metadata for identifying applications in your system.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Configuration</p>
              <p>Application-specific settings and parameters for deployment.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Status Tracking</p>
              <p>Monitor application deployment status and health metrics.</p>
            </div>
          </div>
        ),
      },
      {
        id: "search-org",
        title: "Search and Organization",
        icon: <Search className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Search</p>
              <p>Filter applications by name or description in real-time using the search box.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Sorting</p>
              <p>Click column headers to sort applications alphabetically or by other criteria.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Refresh</p>
              <p>Use the refresh button to reload the application list and see latest changes.</p>
            </div>
          </div>
        ),
      },
    ],
    quickTips: [
      "Click on any application row to view or edit details",
      "Use the refresh button to reload the application list",
      "Applications help organize and track software deployments",
      "Keep application names descriptive for easier management",
    ],
  }), []);

  // Configure header
  usePageHeader({
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Applications', isCurrent: true }
    ],
    title: 'Applications',
    actions: [
      {
        id: 'refresh',
        label: '',
        icon: 'RefreshCw',
        variant: 'outline',
        size: 'sm',
        onClick: handleRefresh,
        loading: isLoading,
        disabled: isLoading,
        tooltip: isLoading ? 'Refreshing...' : error ? 'Retry loading applications' : 'Refresh applications',
        className: error ? 'border-destructive text-destructive hover:bg-destructive/10' : ''
      },
      {
        id: 'new-app',
        label: 'New App',
        icon: 'Plus',
        variant: 'default',
        size: 'sm',
        onClick: handleNewApp,
        tooltip: 'Create new application',
        className: 'whitespace-nowrap'
      }
    ],
    helpConfig: helpConfig,
    helpTooltip: 'Applications help'
  }, [isLoading, error]);

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
    <div className="flex flex-1 flex-col overflow-hidden w-full">
      <div className="flex pb-10 flex-col justify-between flex-1">
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
