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
  extractRecommendationMetadata,
  PRIORITY_LEVELS,
  requiresImmediateAction
} from '@/utils/recommendationTypeMapper';

/**
 * Calculate urgency level for a recommendation
 * @param {Object} recommendation - Recommendation object
 * @returns {string} Urgency level: 'immediate', 'urgent', 'soon', 'normal'
 */
export const calculateUrgency = (recommendation) => {
  const metadata = extractRecommendationMetadata(recommendation);
  const priority = getRecommendationPriority(recommendation.type);

  // OS_UPDATE_AVAILABLE or SYSTEM_UPDATE_AVAILABLE with reboot pending >= 7 days
  if ((recommendation.type === 'OS_UPDATE_AVAILABLE' || recommendation.type === 'SYSTEM_UPDATE_AVAILABLE') && metadata?.rebootDays >= 7) {
    return 'immediate';
  }

  // DEFENDER_THREAT with active threats
  if (recommendation.type === 'DEFENDER_THREAT' && metadata?.activeThreats > 0) {
    return 'immediate';
  }

  // APP_UPDATE_AVAILABLE with security updates
  if (recommendation.type === 'APP_UPDATE_AVAILABLE' && metadata?.securityUpdateCount > 0) {
    return 'urgent';
  }

  // OS_UPDATE_AVAILABLE or SYSTEM_UPDATE_AVAILABLE with reboot pending >= 3 days
  if ((recommendation.type === 'OS_UPDATE_AVAILABLE' || recommendation.type === 'SYSTEM_UPDATE_AVAILABLE') && metadata?.rebootDays >= 3) {
    return 'urgent';
  }

  // PORT_BLOCKED
  if (recommendation.type === 'PORT_BLOCKED') {
    return 'soon';
  }

  // Based on priority
  if (priority === PRIORITY_LEVELS.CRITICAL) {
    return 'urgent';
  }

  if (priority === PRIORITY_LEVELS.HIGH) {
    return 'urgent';
  }

  if (priority === PRIORITY_LEVELS.MEDIUM) {
    return 'soon';
  }

  return 'normal';
};

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

  // Sort recommendations by urgency, priority, and creation date with metadata attachment
  const sortedRecommendations = useMemo(() => {
    return [...recommendations].map(rec => {
      // Clone the object since Apollo Client freezes cache objects
      const clonedRec = { ...rec };
      // Attach metadata as a non-enumerable property to avoid affecting serialization
      const metadata = extractRecommendationMetadata(clonedRec);
      if (metadata) {
        Object.defineProperty(clonedRec, '_metadata', {
          value: metadata,
          writable: false,
          enumerable: false,
          configurable: true
        });
      }
      return clonedRec;
    }).sort((a, b) => {
      // Define urgency value mapping
      const urgencyValues = {
        immediate: 4,
        urgent: 3,
        soon: 2,
        normal: 1
      };

      // Define priority value mapping
      const priorityValues = {
        [PRIORITY_LEVELS.CRITICAL]: 4,
        [PRIORITY_LEVELS.HIGH]: 3,
        [PRIORITY_LEVELS.MEDIUM]: 2,
        [PRIORITY_LEVELS.LOW]: 1
      };

      const aUrgency = urgencyValues[calculateUrgency(a)] || 0;
      const bUrgency = urgencyValues[calculateUrgency(b)] || 0;

      const aInfo = getRecommendationInfo(a.type, a);
      const bInfo = getRecommendationInfo(b.type, b);
      const aPriority = priorityValues[aInfo.priority] || 0;
      const bPriority = priorityValues[bInfo.priority] || 0;

      // Sort by urgency first, then priority, then creation date
      if (aUrgency !== bUrgency) {
        return bUrgency - aUrgency;
      }

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [recommendations]);

  // Get high priority recommendations using dynamic priority resolution
  const highPriorityRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      const info = getRecommendationInfo(rec.type, rec);
      return info.priority === PRIORITY_LEVELS.CRITICAL || info.priority === PRIORITY_LEVELS.HIGH;
    });
  }, [recommendations]);

  // Get urgent recommendations that require immediate attention
  const urgentRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      const urgency = calculateUrgency(rec);
      const metadata = extractRecommendationMetadata(rec);

      // OS_UPDATE_AVAILABLE or SYSTEM_UPDATE_AVAILABLE with reboot >= 7 days
      if ((rec.type === 'OS_UPDATE_AVAILABLE' || rec.type === 'SYSTEM_UPDATE_AVAILABLE') && metadata?.rebootDays >= 7) {
        return true;
      }

      // DEFENDER_THREAT with active threats
      if (rec.type === 'DEFENDER_THREAT' && metadata?.activeThreats > 0) {
        return true;
      }

      // APP_UPDATE_AVAILABLE with security updates
      if (rec.type === 'APP_UPDATE_AVAILABLE' && metadata?.securityUpdateCount > 0) {
        return true;
      }

      return urgency === 'immediate';
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

  // Filter recommendations by urgency level
  const filterByUrgency = useCallback((urgencyLevel) => {
    if (!urgencyLevel) return recommendations;
    return recommendations.filter(rec => calculateUrgency(rec) === urgencyLevel);
  }, [recommendations]);

  // Get recommendations count by category
  const categoryStats = useMemo(() => {
    return Object.keys(categorizedRecommendations).reduce((stats, category) => {
      stats[category] = categorizedRecommendations[category].length;
      return stats;
    }, {});
  }, [categorizedRecommendations]);

  // Summary statistics with urgency-based counts
  const summary = useMemo(() => {
    const urgent = urgentRecommendations.length;
    const rebootPending = recommendations.filter(rec => rec.type === 'OS_UPDATE_AVAILABLE' || rec.type === 'SYSTEM_UPDATE_AVAILABLE').length;
    const securityUpdates = recommendations.filter(rec => {
      const metadata = extractRecommendationMetadata(rec);
      return rec.type === 'APP_UPDATE_AVAILABLE' && metadata?.securityUpdateCount > 0;
    }).length;
    const activeThreats = recommendations.filter(rec => {
      const metadata = extractRecommendationMetadata(rec);
      return rec.type === 'DEFENDER_THREAT' && metadata?.activeThreats > 0;
    }).length;
    const blockedPorts = recommendations.filter(rec => rec.type === 'PORT_BLOCKED').length;
    const critical = recommendations.filter(rec => {
      const info = getRecommendationInfo(rec.type, rec);
      return info.priority === PRIORITY_LEVELS.CRITICAL;
    }).length;

    return {
      total: recommendations.length,
      highPriority: highPriorityRecommendations.length,
      urgent,
      rebootPending,
      securityUpdates,
      activeThreats,
      blockedPorts,
      critical,
      security: categoryStats.security,
      performance: categoryStats.performance,
      maintenance: categoryStats.maintenance,
      storage: categoryStats.storage,
      updates: categoryStats.updates,
      general: categoryStats.general
    };
  }, [recommendations, highPriorityRecommendations.length, urgentRecommendations.length, categoryStats]);

  // Check if requires immediate attention using dynamic urgency calculation
  const requiresImmediateAttentionFlag = useMemo(() => {
    return recommendations.some(rec => calculateUrgency(rec) === 'immediate');
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
    urgentRecommendations,

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
    filterByUrgency,
    calculateUrgency,
    refreshRecommendations,

    // Apollo query state
    networkStatus
  };
};

export default useVMRecommendations;