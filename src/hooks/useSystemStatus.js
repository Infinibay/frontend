import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  checkSystemReadiness, 
  fetchAvailableISOs,
  fetchSupportedOSTypes,
  selectSystemReadiness,
  selectOSAvailabilityMap,
  selectISOLoading,
  selectISOError
} from '@/state/slices/iso';

/**
 * Hook to check and monitor system status, particularly ISO availability
 * @param {Object} options - Hook options
 * @param {boolean} options.checkOnMount - Whether to check status on mount (default: true)
 * @param {number} options.refreshInterval - Interval in ms to refresh status (default: null, no auto-refresh)
 * @returns {Object} System status information and utilities
 */
export function useSystemStatus(options = {}) {
  const { checkOnMount = true, refreshInterval = null } = options;
  
  const dispatch = useDispatch();
  
  const systemReadiness = useSelector(selectSystemReadiness);
  const osAvailabilityMap = useSelector(selectOSAvailabilityMap);
  const loading = useSelector(selectISOLoading);
  const error = useSelector(selectISOError);

  // Check system status
  const checkStatus = useCallback(async () => {
    try {
      // Fetch all ISO-related data in parallel
      const promises = [
        dispatch(checkSystemReadiness()),
        dispatch(fetchAvailableISOs()),
        dispatch(fetchSupportedOSTypes())
      ];
      
      await Promise.all(promises);
    } catch (err) {
      console.error('Failed to check system status:', err);
    }
  }, [dispatch]);

  // Check if a specific OS has an ISO available
  const isOSAvailable = useCallback((os) => {
    return osAvailabilityMap[os.toUpperCase()] || false;
  }, [osAvailabilityMap]);

  // Get availability status for multiple OS types
  const getOSAvailabilityList = useCallback((osList) => {
    return osList.map(os => ({
      os: os.toUpperCase(),
      available: isOSAvailable(os)
    }));
  }, [isOSAvailable]);

  // Check if the system is ready (at least one ISO available)
  const isSystemReady = useCallback(() => {
    return systemReadiness.ready;
  }, [systemReadiness.ready]);

  // Get user-friendly message about system status
  const getStatusMessage = useCallback(() => {
    if (loading.checkReadiness) {
      return 'Checking system status...';
    }
    
    if (error.checkReadiness) {
      return 'Failed to check system status';
    }
    
    if (!systemReadiness.ready) {
      return `No ISOs available. Please upload at least one ISO to create VMs.`;
    }
    
    const availableCount = systemReadiness.availableOS.length;
    const missingCount = systemReadiness.missingOS.length;
    
    if (missingCount === 0) {
      return 'All ISOs are available. System is fully ready.';
    }
    
    return `${availableCount} ISO(s) available, ${missingCount} missing.`;
  }, [loading.checkReadiness, error.checkReadiness, systemReadiness]);

  // Get list of missing OS ISOs
  const getMissingISOs = useCallback(() => {
    return systemReadiness.missingOS;
  }, [systemReadiness.missingOS]);

  // Get list of available OS ISOs
  const getAvailableISOs = useCallback(() => {
    return systemReadiness.availableOS;
  }, [systemReadiness.availableOS]);

  // Check on mount if requested
  useEffect(() => {
    if (checkOnMount) {
      checkStatus();
    }
  }, [checkOnMount, checkStatus]);

  // Set up refresh interval if requested
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(checkStatus, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, checkStatus]);

  return {
    // Status data
    systemReadiness,
    osAvailabilityMap,
    loading: loading.checkReadiness || loading.fetch,
    error: error.checkReadiness || error.fetch,
    
    // Utility functions
    checkStatus,
    isOSAvailable,
    getOSAvailabilityList,
    isSystemReady,
    getStatusMessage,
    getMissingISOs,
    getAvailableISOs,
    
    // Convenience flags
    isReady: systemReadiness.ready,
    hasAnyISO: systemReadiness.availableOS.length > 0,
    hasAllISOs: systemReadiness.missingOS.length === 0
  };
}

export default useSystemStatus;