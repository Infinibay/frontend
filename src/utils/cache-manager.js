import { clearApolloCache, resetApolloCache } from '@/apollo-client';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:utils:cache-manager');

/**
 * Clear all GraphQL-related caches and persisted data
 */
export const clearAllCaches = async () => {
  try {
    // Clear Apollo Client cache
    await clearApolloCache();
    
    // Clear any persisted queries from localStorage
    if (typeof window !== 'undefined') {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Remove any Apollo-related or GraphQL-related items
        if (key && (key.includes('apollo') || key.includes('graphql') || key.includes('cache'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        debug.info('clear', `Removed localStorage key: ${key}`);
      });
    }
    
    debug.success('clear', 'All caches cleared successfully');
    return true;
  } catch (error) {
    debug.error('clear', 'Error clearing caches:', error);
    return false;
  }
};

/**
 * Reset Apollo cache and refetch all active queries
 */
export const resetAndRefetch = async () => {
  try {
    await resetApolloCache();
    debug.success('reset', 'Cache reset and queries refetched');
    return true;
  } catch (error) {
    debug.error('reset', 'Error resetting cache:', error);
    return false;
  }
};

/**
 * Clear ISO-specific cache entries
 */
export const clearISOCache = async (client) => {
  try {
    // Evict all ISO-related cache entries
    client.cache.evict({ 
      id: 'ROOT_QUERY',
      fieldName: 'availableISOs' 
    });
    client.cache.evict({ 
      id: 'ROOT_QUERY',
      fieldName: 'checkISOStatus' 
    });
    client.cache.evict({ 
      id: 'ROOT_QUERY',
      fieldName: 'checkSystemReadiness' 
    });
    client.cache.evict({ 
      id: 'ROOT_QUERY',
      fieldName: 'checkMultipleOSAvailability' 
    });
    client.cache.evict({ 
      id: 'ROOT_QUERY',
      fieldName: 'getSupportedOSTypes' 
    });
    
    // Garbage collect the cache
    client.cache.gc();
    
    debug.success('iso', 'ISO cache cleared');
    return true;
  } catch (error) {
    debug.error('iso', 'Error clearing ISO cache:', error);
    return false;
  }
};