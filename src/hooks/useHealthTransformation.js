import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { gql } from '@apollo/client';
import { ProblemTransformationService } from '@/services/ProblemTransformationService';
import { setVMHealthData, updateAutoCheck } from '@/state/slices/health';

// GraphQL queries for VM health data
const GET_VM_HEALTH_DATA = gql`
  query GetVMHealthData($machineId: ID!) {
    getLatestVMHealth(machineId: $machineId) {
      id
      machineId
      snapshotDate
      overallStatus
      checksCompleted
      checksFailed
      createdAt
      updatedAt
      osType
      errorSummary
      executionTimeMs
      applicationInventory
      customCheckResults
      defenderStatus
      diskSpaceInfo
      resourceOptInfo
      windowsUpdateInfo
    }
  }
`;

const GET_BACKGROUND_HEALTH_STATUS = gql`
  query GetBackgroundHealthStatus {
    backgroundHealthServiceStatus {
      isRunning
      cronActive
      activeQueues
      pendingChecks
      totalVMsMonitored
      nextRun
    }
  }
`;

const GET_VM_HEALTH_HISTORY = gql`
  query GetVMHealthHistory($machineId: ID!, $limit: Int, $offset: Int) {
    vmHealthHistory(machineId: $machineId, limit: $limit, offset: $offset) {
      id
      machineId
      snapshotDate
      overallStatus
      checksCompleted
      checksFailed
      createdAt
      errorSummary
      osType
    }
  }
`;

const GET_VM_HEALTH_STATS = gql`
  query GetVMHealthStats($machineId: ID!) {
    vmHealthStats(machineId: $machineId) {
      totalSnapshots
      healthySnapshots
      warningSnapshots
      errorSnapshots
      lastHealthCheck
      lastHealthStatus
    }
  }
`;

// Helper function to calculate health trend
const calculateHealthTrend = (historyData, currentScore) => {
  if (!historyData || historyData.length < 2) {
    return 'stable';
  }

  // Calculate scores for historical data
  const historicalScores = historyData.map(snapshot => {
    const totalChecks = snapshot.checksCompleted + snapshot.checksFailed;
    return totalChecks > 0 ? (snapshot.checksCompleted / totalChecks) * 100 : 100;
  }).reverse(); // Reverse to get chronological order

  // Add current score
  const allScores = [...historicalScores, currentScore];

  if (allScores.length < 3) {
    return 'stable';
  }

  // Calculate moving average trend
  const recentScores = allScores.slice(-3); // Last 3 scores
  const olderScores = allScores.slice(-6, -3); // Previous 3 scores

  if (olderScores.length === 0) {
    return 'stable';
  }

  const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
  const olderAvg = olderScores.reduce((sum, score) => sum + score, 0) / olderScores.length;

  const difference = recentAvg - olderAvg;

  if (difference > 5) {
    return 'improving';
  } else if (difference < -5) {
    return 'declining';
  } else {
    return 'stable';
  }
};

export const useHealthTransformation = (vmId, options = {}) => {
  const {
    refreshInterval = 30000, // 30 seconds default
    enableRealTime = true,
    transformToProblems = true
  } = options;

  const dispatch = useDispatch();
  const [lastUpdate, setLastUpdate] = useState(null);
  const [transformationError, setTransformationError] = useState(null);

  // Get cached health data from Redux
  const cachedHealthData = useSelector(state =>
    state.health?.vmHealthData?.[vmId] || null
  );

  // GraphQL query for VM health data
  const {
    data: healthData,
    loading: healthLoading,
    error: healthError,
    refetch: refetchHealth
  } = useQuery(GET_VM_HEALTH_DATA, {
    variables: { machineId: vmId },
    skip: !vmId,
    pollInterval: enableRealTime ? refreshInterval : 0,
    errorPolicy: 'partial',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data?.getLatestVMHealth) {
        setLastUpdate(new Date());

        // Update Redux store with fresh health data
        dispatch(setVMHealthData({
          vmId,
          data: data.getLatestVMHealth
        }));

        // Hydrate autoChecks by parsing customCheckResults if present
        if (data.getLatestVMHealth.customCheckResults) {
          try {
            const customResults = typeof data.getLatestVMHealth.customCheckResults === 'string'
              ? JSON.parse(data.getLatestVMHealth.customCheckResults)
              : data.getLatestVMHealth.customCheckResults;

            if (customResults && typeof customResults === 'object') {
              Object.entries(customResults).forEach(([checkId, checkData]) => {
                dispatch(updateAutoCheck({
                  vmId,
                  check: {
                    id: checkId,
                    checkName: checkData.name || checkId,
                    category: checkData.category || 'system',
                    status: checkData.status || 'unknown',
                    message: checkData.message || '',
                    details: checkData.details || '',
                    confidence: checkData.confidence || 0,
                    timestamp: checkData.timestamp || data.getLatestVMHealth.snapshotDate
                  }
                }));
              });
            }
          } catch (error) {
            console.warn('Error parsing customCheckResults:', error);
          }
        }
      }
    },
    onError: (error) => {
      console.error('Health data fetch error:', error);
    }
  });

  // GraphQL query for background service status
  const {
    data: serviceStatusData,
    loading: serviceLoading,
    error: serviceError
  } = useQuery(GET_BACKGROUND_HEALTH_STATUS, {
    pollInterval: 60000, // Check service status every minute
    errorPolicy: 'partial'
  });

  // GraphQL query for health history (for trend calculation)
  const {
    data: historyData,
    loading: historyLoading
  } = useQuery(GET_VM_HEALTH_HISTORY, {
    variables: {
      machineId: vmId,
      limit: 10, // Last 10 snapshots for trend calculation
      offset: 0
    },
    skip: !vmId,
    errorPolicy: 'partial'
  });

  // Transform health data into problem-focused format
  const transformedData = useMemo(() => {
    try {
      const rawHealthData = healthData?.getLatestVMHealth || cachedHealthData;

      if (!rawHealthData) {
        return {
          problems: [],
          metrics: null,
          overallStatus: null,
          lastCheck: null,
          healthScore: null
        };
      }

      let transformedProblems = [];

      // Transform backend health data into problems
      if (transformToProblems && rawHealthData) {
        // Generate problems based on health check results
        if (rawHealthData.checksFailed > 0) {
          transformedProblems.push({
            id: `health-check-failures-${rawHealthData.id}`,
            severity: 'critical',
            category: 'system',
            title: 'Fallos en Verificaciones de Salud',
            description: `${rawHealthData.checksFailed} de ${rawHealthData.checksCompleted + rawHealthData.checksFailed} verificaciones fallaron`,
            impact: 'Alto',
            recommendations: ['Revisar logs del sistema', 'Ejecutar diagnósticos completos'],
            timestamp: rawHealthData.snapshotDate,
            resolved: false
          });
        }

        // Generate problems from error summary
        if (rawHealthData.errorSummary) {
          transformedProblems.push({
            id: `error-summary-${rawHealthData.id}`,
            severity: 'warning',
            category: 'system',
            title: 'Errores del Sistema Detectados',
            description: rawHealthData.errorSummary,
            impact: 'Medio',
            recommendations: ['Revisar detalles del error', 'Aplicar correcciones recomendadas'],
            timestamp: rawHealthData.snapshotDate,
            resolved: false
          });
        }

        // Generate problems from disk space info
        if (rawHealthData.diskSpaceInfo) {
          try {
            const diskInfo = typeof rawHealthData.diskSpaceInfo === 'string'
              ? JSON.parse(rawHealthData.diskSpaceInfo)
              : rawHealthData.diskSpaceInfo;

            if (diskInfo && diskInfo.usage > 85) {
              transformedProblems.push({
                id: `disk-space-${rawHealthData.id}`,
                severity: diskInfo.usage > 95 ? 'critical' : 'warning',
                category: 'storage',
                title: 'Espacio en Disco Limitado',
                description: `El disco está ${diskInfo.usage}% lleno`,
                impact: diskInfo.usage > 95 ? 'Crítico' : 'Medio',
                recommendations: ['Limpiar archivos temporales', 'Revisar archivos grandes innecesarios'],
                timestamp: rawHealthData.snapshotDate,
                resolved: false
              });
            }
          } catch (error) {
            console.warn('Error parsing disk space info:', error);
          }
        }
      }

      // Transform available data for business-friendly display
      const transformedMetrics = {
        // Extract disk space info if available
        storage: rawHealthData.diskSpaceInfo ? (() => {
          try {
            const diskInfo = typeof rawHealthData.diskSpaceInfo === 'string'
              ? JSON.parse(rawHealthData.diskSpaceInfo)
              : rawHealthData.diskSpaceInfo;
            return {
              usage: diskInfo.usage || 0,
              total: diskInfo.total || 0,
              available: diskInfo.available || 0,
              status: getMetricStatus(diskInfo.usage),
              businessImpact: getStorageBusinessImpact(diskInfo.usage)
            };
          } catch (error) {
            return null;
          }
        })() : null,

        // Extract resource optimization info if available
        performance: rawHealthData.resourceOptInfo ? (() => {
          try {
            const resourceInfo = typeof rawHealthData.resourceOptInfo === 'string'
              ? JSON.parse(rawHealthData.resourceOptInfo)
              : rawHealthData.resourceOptInfo;
            return {
              cpuOptimization: resourceInfo.cpu || 'normal',
              memoryOptimization: resourceInfo.memory || 'normal',
              recommendations: resourceInfo.recommendations || []
            };
          } catch (error) {
            return null;
          }
        })() : null
      };

      // Calculate overall health status
      const calculateOverallStatus = () => {
        if (!rawHealthData) return null;

        const criticalProblems = transformedProblems.filter(p => p.severity === 'critical').length;
        const warningProblems = transformedProblems.filter(p => p.severity === 'warning').length;

        let level, label;

        // Determine status based on backend overallStatus and problems
        const backendStatus = rawHealthData.overallStatus?.toLowerCase();

        if (criticalProblems > 0 || backendStatus === 'error' || backendStatus === 'critical') {
          level = 'critical';
          label = 'Problemas Críticos';
        } else if (warningProblems > 0 || backendStatus === 'warning' || rawHealthData.checksFailed > 0) {
          level = 'warning';
          label = 'Requiere Atención';
        } else if (backendStatus === 'healthy' || backendStatus === 'ok') {
          level = 'excellent';
          label = 'Funcionando Excelente';
        } else {
          level = 'normal';
          label = 'Funcionando Bien';
        }

        // Calculate a health score based on check success rate
        const totalChecks = rawHealthData.checksCompleted + rawHealthData.checksFailed;
        const successRate = totalChecks > 0 ? (rawHealthData.checksCompleted / totalChecks) * 100 : 100;

        // Calculate trend based on historical data
        const trend = calculateHealthTrend(historyData?.vmHealthHistory, Math.round(successRate));

        return {
          level,
          label,
          score: Math.round(successRate),
          criticalProblems,
          warningProblems,
          lastCheck: rawHealthData.snapshotDate,
          trend
        };
      };

      const overallStatus = calculateOverallStatus();

      setTransformationError(null);

      return {
        problems: transformedProblems,
        metrics: transformedMetrics,
        overallStatus,
        lastCheck: rawHealthData.snapshotDate,
        healthScore: overallStatus?.score || 0,
        systemInfo: {
          osType: rawHealthData.osType,
          lastSnapshot: rawHealthData.snapshotDate,
          checksCompleted: rawHealthData.checksCompleted,
          checksFailed: rawHealthData.checksFailed,
          executionTime: rawHealthData.executionTimeMs
        },
        rawData: rawHealthData
      };

    } catch (error) {
      console.error('Health data transformation error:', error);
      setTransformationError(error);
      return {
        problems: [],
        metrics: null,
        overallStatus: null,
        lastCheck: null,
        healthScore: null
      };
    }
  }, [healthData, cachedHealthData, transformToProblems, historyData]);

  // Service status information
  const serviceStatus = useMemo(() => {
    const status = serviceStatusData?.backgroundHealthServiceStatus;
    if (!status) return null;

    return {
      isRunning: status.isRunning,
      cronActive: status.cronActive,
      nextRun: status.nextRun,
      monitoring: {
        activeQueues: status.activeQueues,
        pendingChecks: status.pendingChecks,
        totalVMsMonitored: status.totalVMsMonitored
      }
    };
  }, [serviceStatusData]);



  // Manual refresh function
  const refresh = async () => {
    try {
      await refetchHealth();
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Manual health refresh error:', error);
    }
  };

  return {
    // Transformed data
    ...transformedData,

    // Service status
    serviceStatus,

    // Loading and error states
    isLoading: healthLoading || serviceLoading,
    error: healthError || serviceError || transformationError,

    // Control functions
    refresh,
    lastUpdate,

    // Raw data access
    rawHealthData: healthData?.getLatestVMHealth,
    rawServiceData: serviceStatusData?.backgroundHealthServiceStatus
  };
};

// Helper functions for metric status determination
const getMetricStatus = (usage) => {
  if (!usage) return 'unknown';
  if (usage > 90) return 'critical';
  if (usage > 75) return 'warning';
  return 'normal';
};

const getCpuBusinessImpact = (usage) => {
  if (!usage) return 'Estado desconocido';
  if (usage > 90) return 'Las aplicaciones pueden funcionar muy lentamente';
  if (usage > 75) return 'Puede haber ralentizaciones ocasionales';
  return 'Las aplicaciones funcionan con buen rendimiento';
};

const getMemoryBusinessImpact = (usage) => {
  if (!usage) return 'Estado desconocido';
  if (usage > 95) return 'Las aplicaciones pueden cerrarse inesperadamente';
  if (usage > 85) return 'Puede haber lentitud al abrir nuevas aplicaciones';
  return 'Buen rendimiento para las aplicaciones actuales';
};

const getStorageBusinessImpact = (usage) => {
  if (!usage) return 'Estado desconocido';
  if (usage > 95) return 'Guardado y carga de archivos muy lenta';
  if (usage > 80) return 'Puede haber demoras al trabajar con archivos';
  return 'Buen rendimiento para operaciones con archivos';
};

const getNetworkStatus = (network) => {
  if (!network) return 'unknown';
  if (network.latency > 200 || network.bandwidth > 90) return 'warning';
  if (network.latency > 100 || network.bandwidth > 70) return 'normal';
  return 'excellent';
};

const getNetworkBusinessImpact = (network) => {
  if (!network) return 'Estado desconocido';
  if (network.latency > 200) return 'Navegación web y transferencias más lentas';
  if (network.latency > 100) return 'Buen acceso a recursos en línea';
  return 'Acceso rápido a todos los recursos en línea';
};

const getOverallStatusLevel = (backendStatus, problems) => {
  const criticalProblems = problems.filter(p => p.severity === 'critical').length;
  const warningProblems = problems.filter(p => p.severity === 'warning').length;

  if (criticalProblems > 0) return 'critical';
  if (warningProblems > 2) return 'warning';
  if (warningProblems > 0) return 'normal';
  return 'excellent';
};

const getOverallStatusLabel = (backendStatus, problems) => {
  const level = getOverallStatusLevel(backendStatus, problems);

  switch (level) {
    case 'critical': return 'Problemas Críticos';
    case 'warning': return 'Requiere Atención';
    case 'normal': return 'Funcionando Bien';
    case 'excellent': return 'Funcionando Excelente';
    default: return 'Estado Desconocido';
  }
};

const getOverallStatusDescription = (backendStatus, problems) => {
  const level = getOverallStatusLevel(backendStatus, problems);

  switch (level) {
    case 'critical': return 'Se detectaron problemas que requieren atención inmediata';
    case 'warning': return 'Hay algunos aspectos que pueden mejorarse';
    case 'normal': return 'La máquina virtual está funcionando correctamente';
    case 'excellent': return 'La máquina virtual está funcionando de manera óptima';
    default: return 'No se puede determinar el estado actual';
  }
};
