/**
 * Custom hook that integrates problem transformation and prioritization services
 * with existing health state management
 */

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import ProblemTransformationService from '../services/ProblemTransformationService';
import ProblemPriorityService from '../services/ProblemPriorityService';
import { PriorityLevel } from '../types/problems';

const useVMProblems = (vmId, vmName) => {
  // Get health data from Redux state using correct selectors
  const healthData = useSelector(state => {
    if (!vmId) return null;
    return state.health?.vmHealthData?.[vmId] || null;
  });

  const autoChecks = useSelector(state => {
    if (!vmId) return null;
    return state.health?.autoChecks?.[vmId] || null;
  });

  // Per-VM loading flag. The slice tracks `loadingByVm[vmId]` so one VM's
  // snapshot fetch doesn't mark every VM's problems as loading (which the
  // shared global `state.health.isLoading` would).
  const isLoading = useSelector(state => {
    if (!vmId) return false;
    return !!state.health?.loadingByVm?.[vmId];
  });
  // Per-VM error (matches the per-VM loading above). The slice no longer writes a
  // global state.health.error, so one VM's failed snapshot no longer surfaces on
  // every VM's problems panel.
  const error = useSelector(state => {
    if (!vmId) return null;
    return state.health?.errorByVm?.[vmId] || null;
  });

  // Helper to normalize autoChecks to ProblemTransformationService's expected structure
  const buildTransformInput = (autoChecksData) => {
    if (!autoChecksData) return { autoChecks: {} };

    const transformedChecks = {};

    // Convert autoChecks object to expected format: { [category]: { issues: [...] } }
    Object.values(autoChecksData).forEach(check => {
      const category = check.category || 'system';

      if (!transformedChecks[category]) {
        transformedChecks[category] = { issues: [] };
      }

      // Convert check to issue format
      const issue = {
        id: check.id,
        type: check.checkName || check.type,
        severity: check.status === 'failed' ? 'high' : check.status === 'warning' ? 'medium' : 'low',
        description: check.message,
        detectedAt: check.timestamp || check.lastRun,
        affectedServices: check.affectedServices || [],
        ...check // Include any additional properties
      };

      transformedChecks[category].issues.push(issue);
    });

    return { autoChecks: transformedChecks };
  };

  // Transform health data into user-friendly problems
  const problems = useMemo(() => {
    if (!healthData || !autoChecks) {
      return [];
    }

    const vmInfo = { id: vmId, name: vmName };
    const transformInput = buildTransformInput(autoChecks);
    return ProblemTransformationService.transformHealthChecks(transformInput, vmInfo);
  }, [healthData, autoChecks, vmId, vmName]);

  // Sort and prioritize problems
  const prioritizedProblems = useMemo(() => {
    if (!problems.length) return [];
    return ProblemPriorityService.sortProblemsByPriority(problems);
  }, [problems]);

  // Group problems by priority level
  const problemsByPriority = useMemo(() => {
    return ProblemPriorityService.groupProblemsByPriority(prioritizedProblems);
  }, [prioritizedProblems]);

  // Get summary statistics
  const summary = useMemo(() => {
    return ProblemPriorityService.getPrioritySummary(prioritizedProblems);
  }, [prioritizedProblems]);

  // Check if immediate action is required
  const requiresImmediateAction = useMemo(() => {
    return ProblemPriorityService.requiresImmediateAction(prioritizedProblems);
  }, [prioritizedProblems]);

  // Get next recommended problem to work on
  const nextRecommendedProblem = useMemo(() => {
    return ProblemPriorityService.getNextRecommendedProblem(prioritizedProblems);
  }, [prioritizedProblems]);

  // Filter problems by priority level
  const filterByPriority = (priorityLevels) => {
    return ProblemPriorityService.filterByPriority(prioritizedProblems, priorityLevels);
  };

  // Get critical problems only
  const criticalProblems = useMemo(() => {
    return problemsByPriority[PriorityLevel.CRITICAL] || [];
  }, [problemsByPriority]);

  // Get important problems only
  const importantProblems = useMemo(() => {
    return problemsByPriority[PriorityLevel.IMPORTANT] || [];
  }, [problemsByPriority]);

  // Get informational problems only
  const informationalProblems = useMemo(() => {
    return problemsByPriority[PriorityLevel.INFORMATIONAL] || [];
  }, [problemsByPriority]);

  // Get last check timestamp
  const lastCheckTime = useMemo(() => {
    if (!healthData?.lastUpdated) return null;
    return new Date(healthData.lastUpdated);
  }, [healthData]);

  return {
    // Core data
    problems: prioritizedProblems,
    problemsByPriority,

    // Filtered problems
    criticalProblems,
    importantProblems,
    informationalProblems,

    // Summary and status
    summary,
    requiresImmediateAction,
    nextRecommendedProblem,
    lastCheckTime,

    // State management
    isLoading,
    error,

    // Utility functions
    filterByPriority,

    // Raw data (for debugging or advanced use)
    rawHealthData: healthData,
    rawAutoChecks: autoChecks
  };
};

export default useVMProblems;
