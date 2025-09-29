import { useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:hooks:useVMRecommendations');

// Import GraphQL query from generated hooks
import { GetVmRecommendationsDocument } from '@/gql/hooks';
import {
  getRecommendationInfo,
  getRecommendationPriority,
  getRecommendationCategory,
  PRIORITY_LEVELS,
  requiresImmediateAction
} from '@/utils/recommendationTypeMapper';

/**
 * Custom hook for managing VM recommendations data
 *
 * This hook automatically fetches recommendations from the latest health snapshot only,
 * eliminating duplicates at the backend level. The backend now filters recommendations
 * to show only those from the most recent scan.
 *
 * @param {string} vmId - VM identifier
 * @param {Object} options - Additional query options
 * @returns {Object} Hook state and utility functions
 */
const useVMRecommendations = (vmId, options = {}) => {
  debug.log('useVMRecommendations hook initialized', { vmId, options });

  const {
    types = null,
    limit = null,
    createdAfter = null,
    createdBefore = null,
    pollInterval = 60000, // Poll every 60 seconds - backend now filters by latest snapshot, reducing need for frequent polling
    skip = false
  } = options;

  // Build filter object for GraphQL query
  const filter = useMemo(() => {
    const filterObj = {};
    if (types && types.length > 0) filterObj.types = types;
    if (limit) filterObj.limit = limit;
    if (createdAfter) filterObj.createdAfter = createdAfter;
    if (createdBefore) filterObj.createdBefore = createdBefore;

    // Return null if no filters are set
    return Object.keys(filterObj).length > 0 ? filterObj : null;
  }, [types, limit, createdAfter, createdBefore]);

  // Apollo query with error handling
  const {
    data,
    loading: isLoading,
    error,
    refetch,
    networkStatus
  } = useQuery(GetVmRecommendationsDocument, {
    variables: {
      vmId,
      filter,
      refresh: false
    },
    skip: skip || !vmId,
    pollInterval,
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all' // Better handling when no health snapshots exist
  });

  // Raw recommendations data with client-side deduplication
  const recommendations = useMemo(() => {
    const rawRecommendations = data?.getVMRecommendations || [];

    // Deduplicate by id to guard against unexpected backend duplicates
    const seen = new Set();
    return rawRecommendations.filter(rec => {
      if (seen.has(rec.id)) {
        return false;
      }
      seen.add(rec.id);
      return true;
    });
  }, [data]);

  // Categorize recommendations by type using unified mapper
  const categorizedRecommendations = useMemo(() => {
    const categories = {
      security: [],
      performance: [],
      maintenance: [],
      storage: [],
      updates: [],
      general: []
    };

    recommendations.forEach(recommendation => {
      const category = getRecommendationCategory(recommendation.type);
      if (categories[category]) {
        categories[category].push(recommendation);
      } else {
        categories.general.push(recommendation);
      }
    });

    return categories;
  }, [recommendations]);

  // Sort recommendations by priority and creation date using unified mapper
  const sortedRecommendations = useMemo(() => {
    return [...recommendations].sort((a, b) => {
      // Define priority value mapping
      const priorityValues = {
        [PRIORITY_LEVELS.CRITICAL]: 4,
        [PRIORITY_LEVELS.HIGH]: 3,
        [PRIORITY_LEVELS.MEDIUM]: 2,
        [PRIORITY_LEVELS.LOW]: 1
      };

      const aPriority = priorityValues[getRecommendationPriority(a.type)] || 0;
      const bPriority = priorityValues[getRecommendationPriority(b.type)] || 0;

      // Sort by priority first, then by creation date
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [recommendations]);

  // Get high priority recommendations using unified mapper
  const highPriorityRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      const priority = getRecommendationPriority(rec.type);
      return priority === PRIORITY_LEVELS.CRITICAL || priority === PRIORITY_LEVELS.HIGH;
    });
  }, [recommendations]);

  // Get recommendations by category
  const getRecommendationsByCategory = useCallback((category) => {
    return categorizedRecommendations[category] || [];
  }, [categorizedRecommendations]);

  // Filter recommendations by types
  const filterByTypes = useCallback((typesList) => {
    if (!typesList?.length) return recommendations;
    return recommendations.filter(rec => typesList.includes(rec.type));
  }, [recommendations]);

  // Get recommendations count by category
  const categoryStats = useMemo(() => {
    return Object.keys(categorizedRecommendations).reduce((stats, category) => {
      stats[category] = categorizedRecommendations[category].length;
      return stats;
    }, {});
  }, [categorizedRecommendations]);

  // Summary statistics
  const summary = useMemo(() => {
    return {
      total: recommendations.length,
      highPriority: highPriorityRecommendations.length,
      security: categoryStats.security,
      performance: categoryStats.performance,
      maintenance: categoryStats.maintenance,
      storage: categoryStats.storage,
      updates: categoryStats.updates,
      general: categoryStats.general
    };
  }, [recommendations.length, highPriorityRecommendations.length, categoryStats]);

  // Check if requires immediate attention using unified mapper
  const requiresImmediateAttentionFlag = useMemo(() => {
    return recommendations.some(rec => requiresImmediateAction(rec.type));
  }, [recommendations]);

  // Get last update time
  const lastUpdateTime = useMemo(() => {
    if (!recommendations.length) return null;
    const latestRec = recommendations.reduce((latest, current) => {
      return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
    });
    return new Date(latestRec.createdAt);
  }, [recommendations]);

  // Refresh recommendations with force refresh - triggers new health scan and gets latest snapshot
  const refreshRecommendations = useCallback(async () => {
    try {
      debug.log('refresh', 'Forcing refresh to get latest snapshot recommendations for VM:', vmId);
      await refetch({
        vmId,
        filter,
        refresh: true // This triggers backend to create new health snapshot
      });
    } catch (error) {
      debug.error('refresh', 'Error refreshing recommendations from latest snapshot:', error);
    }
  }, [refetch, vmId, filter]);

  // Check if currently refreshing
  const isRefreshing = networkStatus === 4; // NetworkStatus.refetch

  return {
    // Core data
    recommendations: sortedRecommendations,
    rawRecommendations: recommendations,
    categorizedRecommendations,
    highPriorityRecommendations,

    // Summary and statistics
    summary,
    categoryStats,
    requiresImmediateAttention: requiresImmediateAttentionFlag,
    lastUpdateTime,

    // State management
    isLoading,
    isRefreshing,
    error,

    // Utility functions
    getRecommendationsByCategory,
    filterByTypes,
    refreshRecommendations,

    // Apollo query state
    networkStatus
  };
};

export default useVMRecommendations;