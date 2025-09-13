'use client';

import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateVmHealth } from '../state/slices/health';

/**
 * Custom hook for managing problem status transitions and updates
 * Provides functionality for marking problems as "En progreso" and "Resuelto"
 */
export function useProblemStatus() {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateErrors, setUpdateErrors] = useState({});

  // Valid status transitions
  const VALID_TRANSITIONS = {
    NEW: ['IN_PROGRESS', 'DISMISSED'],
    IN_PROGRESS: ['RESOLVED', 'DISMISSED', 'NEW'],
    RESOLVED: ['IN_PROGRESS'],
    DISMISSED: ['IN_PROGRESS', 'NEW']
  };

  // Status change history tracking
  const [statusHistory, setStatusHistory] = useState({});

  /**
   * Validates if a status transition is allowed
   */
  const validateStatusTransition = useCallback((currentStatus, newStatus) => {
    const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];
    return allowedTransitions.includes(newStatus);
  }, []);

  /**
   * Updates the status of a single problem
   */
  const updateProblemStatus = useCallback(async (problemId, newStatus, notes = '', currentStatusOverride = null) => {
    setIsUpdating(true);
    setUpdateErrors(prev => ({ ...prev, [problemId]: null }));

    try {
      // Get current problem status from state or override
      const currentStatus = currentStatusOverride || getProblemStatus(problemId);

      // Validate transition
      if (!validateStatusTransition(currentStatus, newStatus)) {
        throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
      }

      // Create status change record
      const statusChange = {
        problemId,
        fromStatus: currentStatus,
        toStatus: newStatus,
        timestamp: new Date().toISOString(),
        notes,
        userId: 'current-user' // This should come from auth context
      };

      // Update status history
      setStatusHistory(prev => ({
        ...prev,
        [problemId]: [...(prev[problemId] || []), statusChange]
      }));

      // In a real implementation, this would make an API call
      // For now, we'll simulate the update
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update Redux state (this would typically be done via an API response)
      // dispatch(updateProblemStatus({ problemId, status: newStatus, notes }));

      // Dispatch a mock state update to reflect changes in UI
      dispatch(updateVmHealth({
        vmId: problemId.split('-')[0], // Extract VM ID from problem ID
        updates: { problemStatus: { [problemId]: newStatus } }
      }));

      console.log(`Problem ${problemId} status updated to ${newStatus}`, statusChange);

      return { success: true, statusChange };
    } catch (error) {
      console.error('Error updating problem status:', error);
      setUpdateErrors(prev => ({ ...prev, [problemId]: error.message }));
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [validateStatusTransition]);

  /**
   * Updates the status of multiple problems in bulk
   */
  const bulkUpdateStatus = useCallback(async (problemIds, newStatus, notes = '') => {
    setIsUpdating(true);
    const results = [];
    const errors = {};

    try {
      // Process each problem
      for (const problemId of problemIds) {
        try {
          const result = await updateProblemStatus(problemId, newStatus, notes);
          results.push({ problemId, ...result });
        } catch (error) {
          errors[problemId] = error.message;
          results.push({ problemId, success: false, error: error.message });
        }
      }

      // Update errors state
      setUpdateErrors(prev => ({ ...prev, ...errors }));

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;

      console.log(`Bulk update completed: ${successCount} successful, ${errorCount} failed`);

      return {
        results,
        successCount,
        errorCount,
        hasErrors: errorCount > 0
      };
    } catch (error) {
      console.error('Error in bulk status update:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [updateProblemStatus]);

  /**
   * Gets the status history for a problem
   */
  const getProblemStatusHistory = useCallback((problemId) => {
    return statusHistory[problemId] || [];
  }, [statusHistory]);

  /**
   * Gets the current status of a problem
   */
  const getProblemStatus = useCallback((problemId) => {
    const history = statusHistory[problemId];
    if (!history || history.length === 0) {
      return 'NEW';
    }
    return history[history.length - 1].toStatus;
  }, [statusHistory]);

  /**
   * Checks if a problem can transition to a specific status
   */
  const canTransitionTo = useCallback((problemId, targetStatus) => {
    const currentStatus = getProblemStatus(problemId);
    return validateStatusTransition(currentStatus, targetStatus);
  }, [getProblemStatus, validateStatusTransition]);

  /**
   * Gets available status transitions for a problem
   */
  const getAvailableTransitions = useCallback((problemId) => {
    const currentStatus = getProblemStatus(problemId);
    return VALID_TRANSITIONS[currentStatus] || [];
  }, [getProblemStatus]);

  /**
   * Marks a problem as in progress
   */
  const markAsInProgress = useCallback(async (problemId, notes = '') => {
    return updateProblemStatus(problemId, 'IN_PROGRESS', notes);
  }, [updateProblemStatus]);

  /**
   * Marks a problem as resolved
   */
  const markAsResolved = useCallback(async (problemId, notes = '') => {
    return updateProblemStatus(problemId, 'RESOLVED', notes);
  }, [updateProblemStatus]);

  /**
   * Marks a problem as dismissed
   */
  const markAsDismissed = useCallback(async (problemId, notes = '') => {
    return updateProblemStatus(problemId, 'DISMISSED', notes);
  }, [updateProblemStatus]);

  /**
   * Reopens a resolved or dismissed problem
   */
  const reopenProblem = useCallback(async (problemId, notes = '') => {
    return updateProblemStatus(problemId, 'IN_PROGRESS', notes);
  }, [updateProblemStatus]);

  /**
   * Gets problem statistics
   */
  const getProblemStats = useCallback((problems = []) => {
    const stats = {
      total: problems.length,
      new: 0,
      inProgress: 0,
      resolved: 0,
      dismissed: 0
    };

    problems.forEach(problem => {
      const status = getProblemStatus(problem.id);
      switch (status) {
        case 'NEW':
          stats.new++;
          break;
        case 'IN_PROGRESS':
          stats.inProgress++;
          break;
        case 'RESOLVED':
          stats.resolved++;
          break;
        case 'DISMISSED':
          stats.dismissed++;
          break;
      }
    });

    return stats;
  }, [getProblemStatus]);

  /**
   * Clears errors for a specific problem
   */
  const clearProblemError = useCallback((problemId) => {
    setUpdateErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[problemId];
      return newErrors;
    });
  }, []);

  /**
   * Clears all errors
   */
  const clearAllErrors = useCallback(() => {
    setUpdateErrors({});
  }, []);

  return {
    // Status update functions
    updateProblemStatus,
    bulkUpdateStatus,
    markAsInProgress,
    markAsResolved,
    markAsDismissed,
    reopenProblem,

    // Status query functions
    getProblemStatus,
    getProblemStatusHistory,
    canTransitionTo,
    getAvailableTransitions,
    getProblemStats,

    // State and error management
    isUpdating,
    updateErrors,
    clearProblemError,
    clearAllErrors,

    // Validation
    validateStatusTransition,

    // Constants
    VALID_TRANSITIONS
  };
}
