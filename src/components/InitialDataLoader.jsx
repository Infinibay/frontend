"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInitialData, SERVICE_CONFIG } from '@/init';
import { Skeleton } from '@/components/ui/skeleton';
import { selectAppSettingsInitialized, selectAppSettingsLoading } from '@/state/slices/appSettings';
import { createDebugger } from '@/utils/debug';

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

const debug = createDebugger('frontend:components:initial-data-loader');

export const InitialDataLoader = ({ children }) => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [deferredLoading, setDeferredLoading] = useState(false);
  const [deferredServices, setDeferredServices] = useState([]);

  // Only check loading states that are critical for initial app functionality
  const authLoading = useSelector(state => state.auth.loading?.fetchUser);
  const appSettingsLoading = useSelector(selectAppSettingsLoading);
  const appSettingsInitialized = useSelector(selectAppSettingsInitialized);

  useEffect(() => {
    const initialize = async () => {
      debug.info('Starting application initialization...');

      try {
        // Set a timeout for the initialization process
        const timeoutId = setTimeout(() => {
          debug.warn('Initialization timeout reached, proceeding with partial data');
          setHasTimedOut(true);
          setIsInitializing(false);
        }, 15000); // 15 second timeout

        // First, restore auth from localStorage if available
        debug.info('Restoring authentication from storage...');
        const { restoreAuthFromStorage } = await import('@/state/slices/auth');
        dispatch(restoreAuthFromStorage());

        // Track deferred services for status display
        setDeferredServices(SERVICE_CONFIG.deferred.map(s => ({ name: s.name, status: 'pending', description: s.description })));

        // Then fetch initial data with error boundaries
        try {
          debug.info('Fetching critical initial data...');
          const results = await dispatch(fetchInitialData()).unwrap();

          debug.info('Initial data fetch completed:', {
            successes: results.successes,
            failures: results.failures?.map(f => f.service) || []
          });

          // Update deferred services status based on results
          if (results.deferred) {
            setDeferredServices(current =>
              current.map(service => {
                const wasSuccessful = results.deferred.successes.includes(service.name);
                const failed = results.deferred.failures.find(f => f.service === service.name);
                return {
                  ...service,
                  status: failed ? 'failed' : (wasSuccessful ? 'completed' : 'pending')
                };
              })
            );
            setDeferredLoading(false);
          } else {
            // Deferred services are loading in background
            setDeferredLoading(true);
          }
        } catch (initError) {
          debug.warn('Critical data fetch failed, continuing with partial data:', initError);
          setError(initError);
        }

        clearTimeout(timeoutId);
      } catch (err) {
        debug.error('Failed to initialize application:', err);
        setError(err);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, [dispatch, retryCount]);

  // Only wait for critical loading states - app can start with just these
  const isCriticalLoading = authLoading || appSettingsLoading?.fetch || !appSettingsInitialized;

  const handleRetry = () => {
    debug.info(`Retrying initialization (attempt ${retryCount + 1})...`);
    setError(null);
    setHasTimedOut(false);
    setIsInitializing(true);
    setDeferredLoading(false);
    setRetryCount(prev => prev + 1);
  };

  const handleContinueWithLimitedFunctionality = () => {
    debug.info('User chose to continue with limited functionality');
    setError(null);
    setIsInitializing(false);
  };

  if (isCriticalLoading && !hasTimedOut) {
    return (
      <div className="relative">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error && !hasTimedOut) {
    // Don't show error modal for authentication errors - let the auth flow handle it
    const isAuthError = error?.message?.toLowerCase().includes('not authorized') ||
                       error?.message?.toLowerCase().includes('unauthorized') ||
                       error?.message?.toLowerCase().includes('401') ||
                       error?.message?.toLowerCase().includes('403') ||
                       error?.graphQLErrors?.some(e =>
                         e.message?.toLowerCase().includes('not authorized') ||
                         e.message?.toLowerCase().includes('unauthorized')
                       );

    if (isAuthError) {
      debug.info('Authentication error detected, skipping error modal and continuing to auth flow');
      // Continue to children to allow auth redirect to happen
      return children;
    }

    const isCriticalError = error?.message?.includes('Critical') ||
      SERVICE_CONFIG.critical.some(s => error?.message?.includes(s.name));

    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-xl text-red-500">
            {isCriticalError ? 'Failed to load critical application data' : 'Some features may be limited'}
          </div>
          <div className="text-sm text-muted-foreground">
            {isCriticalError
              ? 'The application requires certain data to function properly.'
              : 'Non-essential features failed to load, but you can continue using the app.'
            }
            {error?.message}
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retry
            </button>
            {!isCriticalError && (
              <button
                onClick={handleContinueWithLimitedFunctionality}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
              >
                Continue Anyway
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (hasTimedOut) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-xl text-yellow-600">
            Loading is taking longer than usual
          </div>
          <div className="text-sm text-muted-foreground">
            The application will continue to load additional features in the background.
            You can start using core features now.
          </div>
          <button
            onClick={() => {
              debug.info('User chose to continue after timeout');
              setHasTimedOut(false);
              setIsInitializing(false);
            }}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            Continue to App
          </button>
        </div>
      </div>
    );
  }

  // Show deferred loading indicator if services are still loading in background
  return (
    <>
      {children}
    </>
  );
};