"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInitialData } from '@/init';
import { Skeleton } from '@/components/ui/skeleton';
import { selectAppSettingsInitialized, selectAppSettingsLoading } from '@/state/slices/appSettings';

const LoadingSkeleton = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-border bg-card p-4">
        {/* Logo area */}
        <div className="mb-8">
          <Skeleton className="h-8 w-32" />
        </div>
        
        {/* Navigation items */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Top navigation bar */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-24" />
              <span>/</span>
              <Skeleton className="h-6 w-32" />
            </div>
            
            {/* User menu */}
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        {/* Main content area */}
        <div className="p-6">
          {/* Section title */}
          <div className="mb-6">
            <Skeleton className="h-8 w-48" />
          </div>

          {/* Grid of computers */}
          <div className="grid grid-cols-4 gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const InitialDataLoader = ({ children }) => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Only check loading states that are critical for initial app functionality
  const authLoading = useSelector(state => state.auth.loading?.fetchUser);
  const appSettingsLoading = useSelector(selectAppSettingsLoading);
  const appSettingsInitialized = useSelector(selectAppSettingsInitialized);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Set a timeout for the initialization process
        const timeoutId = setTimeout(() => {
          setHasTimedOut(true);
          setIsInitializing(false);
        }, 15000); // 15 second timeout

        // First, restore auth from localStorage if available
        const { restoreAuthFromStorage } = await import('@/state/slices/auth');
        dispatch(restoreAuthFromStorage());

        // Then fetch initial data with error boundaries
        try {
          await dispatch(fetchInitialData()).unwrap();
        } catch (initError) {
          console.warn('Initial data fetch failed, continuing with partial data:', initError);
          // Don't set error here, let individual pages handle their own data fetching
        }

        clearTimeout(timeoutId);
      } catch (err) {
        setError(err);
        console.error('Failed to initialize data:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, [dispatch, retryCount]);

  // Only wait for critical loading states (exclude departments and VMs to prevent infinite loop)
  // Departments and VMs will be loaded by individual pages as needed
  const isCriticalLoading = authLoading || appSettingsLoading?.fetch || !appSettingsInitialized;

  const handleRetry = () => {
    setError(null);
    setHasTimedOut(false);
    setIsInitializing(true);
    setRetryCount(prev => prev + 1);
  };

  if (isCriticalLoading && !hasTimedOut) {
    return <LoadingSkeleton />;
  }

  if (error && !hasTimedOut) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="text-xl text-red-500">
            Failed to load application data.
          </div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (hasTimedOut) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="text-xl text-yellow-600">
            Loading is taking longer than usual.
          </div>
          <div className="text-sm text-muted-foreground">
            The application will continue to load in the background.
          </div>
          <button
            onClick={() => {
              setHasTimedOut(false);
              setIsInitializing(false);
            }}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    );
  }

  return children;
};