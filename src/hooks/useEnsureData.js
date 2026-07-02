import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDebugger } from '../utils/debug.js';
import { trackDataLoading } from '../utils/performance.js';

const debug = createDebugger('frontend:hooks:ensure-data');

// Cache for tracking fetch requests to prevent duplicates
const fetchRequestCache = new Map();

// Default TTL for data freshness (5 minutes)
const DEFAULT_TTL = 5 * 60 * 1000;

// Configuration for different loading strategies
const LOADING_STRATEGIES = {
  IMMEDIATE: 'immediate',     // Block render until data loads
  BACKGROUND: 'background',   // Show skeleton while loading
  LAZY: 'lazy',              // Load on user interaction
  PREFETCH: 'prefetch',      // Load when component mounts
};

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,           // 1 second base delay
  maxDelay: 10000,           // 10 seconds max delay
  backoffFactor: 2,          // Exponential backoff
};

const useEnsureData = (
  sliceName,
  fetchAction,
  options = {}
) => {
  const {
    ttl = DEFAULT_TTL,
    strategy = LOADING_STRATEGIES.BACKGROUND,
    immediate = false,
    enableRetry = true,
    retryConfig = RETRY_CONFIG,
    dependencies = [],
    transform = null,
  } = options;

  const dispatch = useDispatch();
  const retryCountRef = useRef(0);
  const lastFetchRef = useRef(null);
  const isComponentMountedRef = useRef(true);
  // Records the timestamp of a terminal fetch failure per cacheKey so the main
  // effect can back off instead of re-dispatching the thunk on every render
  // cycle while the backend is down (see error cooldown below).
  const failedFetchRef = useRef({});

  // Cooldown before an exhausted/failed fetch is auto-retried without an
  // explicit refresh()/retry() call. Derived from the retry backoff ceiling.
  const errorCooldownMs = retryConfig?.maxDelay || RETRY_CONFIG.maxDelay;

  // Subscribe narrowly to only the fields this hook consumes so that unrelated
  // slice mutations (e.g. vms.pendingActions / per-action loading toggles during
  // a power action) don't re-render every useEnsureData consumer of that slice.
  const data = useSelector((state) => {
    const slice = state[sliceName];
    if (!slice) {
      debug.warn(`Slice '${sliceName}' not found in Redux store`);
      return null;
    }
    return slice.data || slice.items || slice;
  });

  // Extract loading state - handle both boolean and object-based loading flags.
  // Only consider 'fetch' loading for list loading state, not individual action
  // loadings (play, pause, stop, etc.).
  const isLoading = useSelector((state) => {
    const slice = state[sliceName];
    if (!slice) return false;
    return typeof slice.loading === 'boolean'
      ? slice.loading
      : Boolean(slice.loading?.fetch);
  });

  // Handle both string/null and object-based error flags
  const error = useSelector((state) => {
    const slice = state[sliceName];
    if (!slice) return null;
    return typeof slice.error === 'string' || slice.error === null
      ? slice.error
      : slice.error?.fetch || null;
  });

  const lastUpdated = useSelector((state) => state[sliceName]?.lastUpdated);

  // Transform data if a transform function is provided. Memoized so the derived
  // array/object identity is stable across renders where the raw data is unchanged.
  const transformedData = useMemo(
    () => (transform && data ? transform(data) : data),
    [transform, data],
  );

  // Check if data is stale
  const isDataStale = useCallback(() => {
    if (!lastUpdated) return true;
    const now = Date.now();
    const age = now - new Date(lastUpdated).getTime();
    return age > ttl;
  }, [lastUpdated, ttl]);

  // Check if data exists and is fresh
  const hasValidData = useCallback(() => {
    return data && !isDataStale();
  }, [data, isDataStale]);

  // Generate cache key for this request
  const getCacheKey = useCallback(() => {
    const depString = dependencies.length > 0 ? JSON.stringify(dependencies) : '';
    return `${sliceName}:${depString}`;
  }, [sliceName, dependencies]);

  // Execute fetch with retry logic
  const executeFetch = useCallback(async () => {
    const cacheKey = getCacheKey();
    const startTime = performance.now();

    // Check if fetch is already in progress
    if (fetchRequestCache.has(cacheKey)) {
      debug.info(`Fetch already in progress for ${sliceName}, waiting...`);
      return fetchRequestCache.get(cacheKey);
    }

    debug.info(`Starting fetch for ${sliceName} (attempt ${retryCountRef.current + 1})`);

    const fetchPromise = (async () => {
      try {
        const result = await dispatch(fetchAction()).unwrap();
        const endTime = performance.now();

        // Track successful data loading
        trackDataLoading(sliceName, startTime, endTime, true);

        // Reset retry count and clear any terminal-failure cooldown on success
        retryCountRef.current = 0;
        lastFetchRef.current = Date.now();
        delete failedFetchRef.current[cacheKey];

        debug.info(`Successfully fetched ${sliceName}`);
        return result;
      } catch (fetchError) {
        const endTime = performance.now();

        // Track failed data loading
        trackDataLoading(sliceName, startTime, endTime, false);

        debug.error(`Failed to fetch ${sliceName}:`, fetchError);

        // Implement retry logic
        if (enableRetry && retryCountRef.current < retryConfig.maxRetries) {
          retryCountRef.current += 1;
          const delay = Math.min(
            retryConfig.baseDelay * Math.pow(retryConfig.backoffFactor, retryCountRef.current - 1),
            retryConfig.maxDelay
          );

          debug.info(`Retrying ${sliceName} in ${delay}ms (attempt ${retryCountRef.current})`);

          return new Promise((resolve, reject) => {
            setTimeout(async () => {
              try {
                // Clear cache before retry
                fetchRequestCache.delete(cacheKey);
                const result = await executeFetch();
                resolve(result);
              } catch (retryError) {
                reject(retryError);
              }
            }, delay);
          });
        }

        // Retries exhausted (or disabled): stamp a terminal-failure time so the
        // main effect backs off instead of re-dispatching on every render cycle.
        failedFetchRef.current[cacheKey] = Date.now();
        throw fetchError;
      } finally {
        // Clean up cache
        fetchRequestCache.delete(cacheKey);
      }
    })();

    // Cache the promise to prevent duplicate requests
    fetchRequestCache.set(cacheKey, fetchPromise);

    return fetchPromise;
  }, [dispatch, fetchAction, sliceName, getCacheKey, enableRetry, retryConfig]);

  // Force refresh data (ignore cache and TTL)
  const refreshData = useCallback(async () => {
    debug.info(`Force refreshing data for ${sliceName}`);
    retryCountRef.current = 0;
    const cacheKey = getCacheKey();
    fetchRequestCache.delete(cacheKey);
    delete failedFetchRef.current[cacheKey];
    return executeFetch();
  }, [executeFetch, sliceName, getCacheKey]);

  // Retry failed request
  const retryFetch = useCallback(async () => {
    debug.info(`Retrying fetch for ${sliceName}`);
    retryCountRef.current = 0;
    delete failedFetchRef.current[getCacheKey()];
    return executeFetch();
  }, [executeFetch, sliceName, getCacheKey]);

  // Main effect to handle data loading based on strategy
  useEffect(() => {
    if (!isComponentMountedRef.current) return;

    // Back off after a terminal failure: don't auto-refetch a fetch that has
    // exhausted its retries until the cooldown window elapses (or the consumer
    // calls refresh()/retry()). This prevents the loading->error->render churn
    // from re-dispatching the thunk on every cycle when the backend is down.
    const cacheKey = getCacheKey();
    const lastFailure = failedFetchRef.current[cacheKey];
    if (lastFailure != null) {
      if (Date.now() - lastFailure < errorCooldownMs) {
        return;
      }
      // Cooldown elapsed — clear the stamp and allow one fresh retry cycle.
      delete failedFetchRef.current[cacheKey];
      retryCountRef.current = 0;
    }

    // Call hasValidData inline to avoid function reference in dependencies
    const shouldFetch = !hasValidData() && !isLoading;

    if (shouldFetch) {
      debug.info(`Data needed for ${sliceName}, strategy: ${strategy}`);

      if (strategy === LOADING_STRATEGIES.IMMEDIATE || immediate) {
        executeFetch().catch((err) => {
          debug.error(`Immediate fetch failed for ${sliceName}:`, err);
        });
      } else if (strategy === LOADING_STRATEGIES.PREFETCH) {
        // Delay prefetch slightly to not block initial render
        const timeoutId = setTimeout(() => {
          if (isComponentMountedRef.current) {
            executeFetch().catch((err) => {
              debug.error(`Prefetch failed for ${sliceName}:`, err);
            });
          }
        }, 100);

        return () => clearTimeout(timeoutId);
      } else if (strategy === LOADING_STRATEGIES.BACKGROUND) {
        executeFetch().catch((err) => {
          debug.error(`Background fetch failed for ${sliceName}:`, err);
        });
      }
      // LAZY strategy requires manual trigger via refreshData
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, lastUpdated, isLoading, strategy, immediate, sliceName, ...dependencies]);

  // Track mounted state. Set true on (re)mount so React StrictMode's
  // setup -> cleanup -> setup double-invoke in development doesn't leave the
  // ref permanently false and disable all subsequent refetch logic.
  useEffect(() => {
    isComponentMountedRef.current = true;
    return () => {
      isComponentMountedRef.current = false;
    };
  }, []);

  // Calculate loading state based on strategy
  const effectiveLoading = strategy === LOADING_STRATEGIES.LAZY ? false : isLoading;

  return {
    data: transformedData,
    isLoading: effectiveLoading,
    error,
    hasData: !!data,
    isStale: isDataStale(),
    canRetry: enableRetry && error && retryCountRef.current < retryConfig.maxRetries,
    retryCount: retryCountRef.current,
    lastUpdated,

    // Action functions
    refresh: refreshData,
    retry: retryFetch,

    // Strategy helpers
    loadNow: () => executeFetch(),

    // Debugging info
    debug: {
      sliceName,
      strategy,
      cacheKey: getCacheKey(),
      hasValidData: hasValidData(),
    },
  };
};

export default useEnsureData;
export { LOADING_STRATEGIES };