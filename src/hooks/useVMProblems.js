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

  const isLoading = useSelector(state => state.health?.isLoading || false);
  const error = useSelector(state => state.health?.error || null);

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

  // Determine overall VM status
  const overallStatus = useMemo(() => {
    if (summary.critical > 0) {
      return {
        level: 'critical',
        label: 'Problemas críticos',
        description: 'Su VM tiene problemas que requieren atención inmediata',
        color: 'red',
        icon: '🚨'
      };
    }

    if (summary.important > 0) {
      return {
        level: 'warning',
        label: 'Requiere atención',
        description: 'Su VM tiene algunos problemas que deben resolverse pronto',
        color: 'yellow',
        icon: '⚠️'
      };
    }

    if (summary.informational > 0) {
      return {
        level: 'info',
        label: 'Funcionando bien',
        description: 'Su VM está funcionando correctamente con algunas recomendaciones',
        color: 'blue',
        icon: 'ℹ️'
      };
    }

    return {
      level: 'healthy',
      label: 'VM funcionando correctamente',
      description: 'Su VM está funcionando sin problemas detectados',
      color: 'green',
      icon: '✅'
    };
  }, [summary]);

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
    overallStatus,
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
