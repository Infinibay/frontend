import { useCallback, useEffect, useRef } from 'react';
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

  // Get slice data from Redux store
  const sliceData = useSelector((state) => {
    const slice = state[sliceName];
    if (!slice) {
      debug.warn(`Slice '${sliceName}' not found in Redux store`);
      return null;
    }
    return slice;
  });

  // Extract loading and error states - handle both boolean and object-based loading flags
  const isLoading = typeof sliceData?.loading === 'boolean'
    ? sliceData.loading
    : Boolean(sliceData?.loading?.fetch || Object.values(sliceData?.loading || {}).some(Boolean));

  // Handle both string/null and object-based error flags
  const error = typeof sliceData?.error === 'string' || sliceData?.error === null
    ? sliceData.error
    : sliceData?.error?.fetch || null;

  const data = sliceData?.data || sliceData?.items || sliceData || null;
  const lastUpdated = sliceData?.lastUpdated;

  // Transform data if transform function provided
  const transformedData = transform && data ? transform(data) : data;

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

        // Reset retry count on success
        retryCountRef.current = 0;
        lastFetchRef.current = Date.now();

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
    return executeFetch();
  }, [executeFetch, sliceName, getCacheKey]);

  // Retry failed request
  const retryFetch = useCallback(async () => {
    debug.info(`Retrying fetch for ${sliceName}`);
    retryCountRef.current = 0;
    return executeFetch();
  }, [executeFetch, sliceName]);

  // Main effect to handle data loading based on strategy
  useEffect(() => {
    if (!isComponentMountedRef.current) return;

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

  // Cleanup on unmount
  useEffect(() => {
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