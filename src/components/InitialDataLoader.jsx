"use client";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ResponsiveStack } from '@infinibay/harbor';
import { fetchInitialData } from '@/init';
import { selectAppSettingsInitialized, selectAppSettingsLoading } from '@/state/slices/appSettings';
import { createDebugger } from '@/utils/debug';

/* BootSplash removed — bootstrap now renders nothing while loading so
   the shell (sidebar/header + empty main) comes in cleanly via
   ContentSwap's initial fade-in. */

const debug = createDebugger('frontend:components:initial-data-loader');

export const InitialDataLoader = ({ children }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const authLoading = useSelector(state => state.auth.loading?.fetchUser);
  const appSettingsLoading = useSelector(selectAppSettingsLoading);
  const appSettingsInitialized = useSelector(selectAppSettingsInitialized);

  useEffect(() => {
    let timeoutId = null;
    let cancelled = false;
    let didError = false;

    const initialize = async () => {
      debug.info('Starting application initialization...');

      try {
        timeoutId = setTimeout(() => {
          // Don't downgrade an already-surfaced error screen (which offers
          // Retry) into the softer "taking longer" screen, and never setState
          // after the effect was torn down.
          if (cancelled || didError) return;
          debug.warn('Initialization timeout reached, proceeding with partial data');
          setHasTimedOut(true);
        }, 15000);

        debug.info('Restoring authentication from storage...');
        const { restoreAuthFromStorage } = await import('@/state/slices/auth');
        dispatch(restoreAuthFromStorage());

        try {
          debug.info('Fetching critical initial data...');
          const results = await dispatch(fetchInitialData()).unwrap();

          debug.info('Initial data fetch completed:', {
            successes: results.successes,
            failures: results.failures?.map(f => f.service) || []
          });
        } catch (initError) {
          debug.error('Critical data fetch failed:', initError);
          didError = true;
          if (!cancelled) setError(initError);
        }
      } catch (err) {
        debug.error('Failed to initialize application:', err);
        didError = true;
        if (!cancelled) setError(err);
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      }
    };

    initialize();

    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  }, [dispatch, retryCount]);

  const isCriticalLoading = authLoading || appSettingsLoading?.fetch || !appSettingsInitialized;

  // Once we've shown content at least once, never gate again — Apollo /
  // auth loading flags tickle true briefly on navigation and we don't
  // want to blank the whole app for 100ms every time.
  const [hasBootstrapped, setHasBootstrapped] = useState(false);
   
  useEffect(() => {
    if (!isCriticalLoading && !hasBootstrapped) setHasBootstrapped(true);
  }, [isCriticalLoading, hasBootstrapped]);
   

  const handleRetry = () => {
    debug.info(`Retrying initialization (attempt ${retryCount + 1})...`);
    setError(null);
    setHasTimedOut(false);
    setRetryCount(prev => prev + 1);
  };

  if (isCriticalLoading && !hasTimedOut && !hasBootstrapped) {
    // Render nothing while the initial auth/settings bootstrap is in
    // flight — we don't want any loading animation. The shell will
    // appear (and fade in via RouteFade) as soon as data is ready.
    return null;
  }

  if (error && !hasTimedOut) {
    const msg = error?.message?.toLowerCase() || '';
    // Apollo Client 4: GraphQL errors live on `error.errors` (CombinedGraphQLErrors),
    // not the removed `error.graphQLErrors`. Gather from both `errors` and a nested
    // `cause.errors` to mirror the isUnauthenticatedError idiom in utils/auth.js.
    const gqlCandidates = [
      ...(error?.errors || []),
      ...(error?.cause?.errors || []),
    ];
    const isAuthError = msg.includes('not authorized') ||
                       msg.includes('unauthorized') ||
                       msg.includes('authentication required') ||
                       msg.includes('not authenticated') ||
                       msg.includes('401') ||
                       msg.includes('403') ||
                       gqlCandidates.some(e =>
                         e?.extensions?.code === 'UNAUTHENTICATED' ||
                         e?.message?.toLowerCase().includes('not authorized') ||
                         e?.message?.toLowerCase().includes('unauthorized') ||
                         e?.message?.toLowerCase().includes('authentication required')
                       );

    if (isAuthError) {
      debug.info('Authentication error detected, skipping error modal and continuing to auth flow');
      return children;
    }

    // Any error that reaches this screen is a critical/bootstrap failure:
    // fetchInitialData only rejects when a CRITICAL service (appSettings /
    // currentUser) fails — deferred services use allSettled and never propagate
    // here — and the outer catch only fires on auth-restore / dynamic-import
    // bootstrap failures. So we never misclassify these as "just some features"
    // and never offer a misleading "Continue Anyway" into a broken app. A raw
    // Apollo/network message like "Failed to fetch" no longer downgrades the UI.
    const rawMessage = error?.message;

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <ResponsiveStack direction="col" gap={4} align="center">
          <div style={{ fontSize: 20, color: 'rgb(var(--harbor-danger))', textAlign: 'center' }}>
            Failed to load critical application data
          </div>
          <div style={{ fontSize: 14, opacity: 0.65, maxWidth: 448, textAlign: 'center' }}>
            The application requires certain data to function properly.
          </div>
          {rawMessage && (
            <div style={{ fontSize: 13, opacity: 0.5, maxWidth: 448, textAlign: 'center', fontFamily: 'monospace' }}>
              {rawMessage}
            </div>
          )}
          <ResponsiveStack direction="row" gap={2} justify="center">
            <Button variant="primary" onClick={handleRetry}>
              Retry
            </Button>
          </ResponsiveStack>
        </ResponsiveStack>
      </div>
    );
  }

  if (hasTimedOut) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <ResponsiveStack direction="col" gap={4} align="center">
          <div style={{ fontSize: 20, color: 'rgb(var(--harbor-warning))', textAlign: 'center' }}>
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
