"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ResponsiveStack, Skeleton } from '@infinibay/harbor';
import { fetchInitialData, SERVICE_CONFIG } from '@/init';
import { selectAppSettingsInitialized, selectAppSettingsLoading } from '@/state/slices/appSettings';
import { createDebugger } from '@/utils/debug';

const LoadingSkeleton = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'rgb(var(--harbor-bg, 10 10 14))' }}>
      {/* Left Sidebar */}
      <div style={{ width: 256, borderRight: '1px solid rgba(255,255,255,0.08)', padding: 16 }}>
        <div style={{ marginBottom: 32 }}>
          <Skeleton height={32} width={128} />
        </div>
        <ResponsiveStack direction="col" gap={4}>
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
        </ResponsiveStack>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Top nav */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: 16 }}>
          <ResponsiveStack direction="row" gap={2} align="center" justify="between">
            <ResponsiveStack direction="row" gap={2} align="center">
              <Skeleton height={24} width={96} />
              <span>/</span>
              <Skeleton height={24} width={128} />
            </ResponsiveStack>
            <Skeleton circle width={40} height={40} />
          </ResponsiveStack>
        </div>

        {/* Main */}
        <div style={{ padding: 24 }}>
          <div style={{ marginBottom: 24 }}>
            <Skeleton height={32} width={192} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 32 }}>
            {[...Array(12)].map((_, i) => (
              <ResponsiveStack key={i} direction="col" gap={3}>
                <Skeleton height={192} />
                <Skeleton height={16} width="75%" />
                <Skeleton height={16} width="50%" />
              </ResponsiveStack>
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
  const [, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [, setDeferredLoading] = useState(false);
  const [, setDeferredServices] = useState([]);

  const authLoading = useSelector(state => state.auth.loading?.fetchUser);
  const appSettingsLoading = useSelector(selectAppSettingsLoading);
  const appSettingsInitialized = useSelector(selectAppSettingsInitialized);

  useEffect(() => {
    const initialize = async () => {
      debug.info('Starting application initialization...');

      try {
        const timeoutId = setTimeout(() => {
          debug.warn('Initialization timeout reached, proceeding with partial data');
          setHasTimedOut(true);
          setIsInitializing(false);
        }, 15000);

        debug.info('Restoring authentication from storage...');
        const { restoreAuthFromStorage } = await import('@/state/slices/auth');
        dispatch(restoreAuthFromStorage());

        setDeferredServices(SERVICE_CONFIG.deferred.map(s => ({ name: s.name, status: 'pending', description: s.description })));

        try {
          debug.info('Fetching critical initial data...');
          const results = await dispatch(fetchInitialData()).unwrap();

          debug.info('Initial data fetch completed:', {
            successes: results.successes,
            failures: results.failures?.map(f => f.service) || []
          });

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
      <div style={{ position: 'relative' }}>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error && !hasTimedOut) {
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
      return children;
    }

    const isCriticalError = error?.message?.includes('Critical') ||
      SERVICE_CONFIG.critical.some(s => error?.message?.includes(s.name));

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <ResponsiveStack direction="col" gap={4} align="center">
          <div style={{ fontSize: 20, color: 'rgb(239, 68, 68)', textAlign: 'center' }}>
            {isCriticalError ? 'Failed to load critical application data' : 'Some features may be limited'}
          </div>
          <div style={{ fontSize: 14, opacity: 0.65, maxWidth: 448, textAlign: 'center' }}>
            {isCriticalError
              ? 'The application requires certain data to function properly.'
              : 'Non-essential features failed to load, but you can continue using the app.'
            }
            {error?.message}
          </div>
          <ResponsiveStack direction="row" gap={2} justify="center">
            <Button variant="primary" onClick={handleRetry}>
              Retry
            </Button>
            {!isCriticalError && (
              <Button variant="secondary" onClick={handleContinueWithLimitedFunctionality}>
                Continue Anyway
              </Button>
            )}
          </ResponsiveStack>
        </ResponsiveStack>
      </div>
    );
  }

  if (hasTimedOut) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <ResponsiveStack direction="col" gap={4} align="center">
          <div style={{ fontSize: 20, color: 'rgb(202, 138, 4)', textAlign: 'center' }}>
            Loading is taking longer than usual
          </div>
          <div style={{ fontSize: 14, opacity: 0.65, maxWidth: 448, textAlign: 'center' }}>
            The application will continue to load additional features in the background.
            You can start using core features now.
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              debug.info('User chose to continue after timeout');
              setHasTimedOut(false);
              setIsInitializing(false);
            }}
          >
            Continue to App
          </Button>
        </ResponsiveStack>
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
};
