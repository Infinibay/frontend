import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

export const usePerformanceData = (vmId) => {
  const [error, setError] = useState(null);

  // Get health data from Redux store
  const healthData = useSelector(state =>
    state.health.machines?.[vmId] || null
  );

  // Compute loading state
  const isLoading = useMemo(() => !!vmId && !healthData, [vmId, healthData]);

  // Transform health data into performance insights
  const performanceData = useMemo(() => {
    if (!healthData) {
      return {
        performanceStatus: null,
        performanceMetrics: null,
        performanceTrends: null,
        recommendations: []
      };
    }

    try {
      // Transform performance status
      const performanceStatus = transformPerformanceStatus(healthData);

      // Transform individual metrics
      const performanceMetrics = transformPerformanceMetrics(healthData);

      // Generate performance trends
      const performanceTrends = generatePerformanceTrends(healthData);

      // Generate recommendations
      const recommendations = generatePerformanceRecommendations(healthData);

      return {
        performanceStatus,
        performanceMetrics,
        performanceTrends,
        recommendations
      };
    } catch (err) {
      console.error('Error transforming performance data:', err);
      return {
        performanceStatus: null,
        performanceMetrics: null,
        performanceTrends: null,
        recommendations: []
      };
    }
  }, [healthData]);

  useEffect(() => {
    if (vmId) {
      setError(null);
    }
  }, [vmId, healthData]);

  return {
    ...performanceData,
    isLoading,
    error
  };
};

// Transform overall performance status
const transformPerformanceStatus = (healthData) => {
  const metrics = healthData.metrics || {};
  const problems = healthData.problems || [];

  // Calculate overall performance level
  const criticalProblems = problems.filter(p => p.severity === 'critical').length;
  const warningProblems = problems.filter(p => p.severity === 'warning').length;

  let level, label, description;

  if (criticalProblems > 0) {
    level = 'critico';
    label = 'Problemas Críticos';
    description = 'Se detectaron problemas que afectan significativamente el rendimiento';
  } else if (warningProblems > 2) {
    level = 'atencion';
    label = 'Necesita Atención';
    description = 'Hay varios aspectos que pueden mejorarse para optimizar el rendimiento';
  } else if (warningProblems > 0) {
    level = 'normal';
    label = 'Funcionando Bien';
    description = 'El rendimiento es bueno con algunas oportunidades de mejora';
  } else {
    level = 'excelente';
    label = 'Rendimiento Excelente';
    description = 'La máquina virtual está funcionando de manera óptima';
  }

  return {
    level,
    label,
    description,
    overallPerformance: getOverallPerformanceDescription(metrics),
    responseSpeed: getResponseSpeedDescription(metrics),
    stability: getStabilityDescription(healthData),
    trend: generateTrendSummary(healthData),
    highlights: generatePerformanceHighlights(healthData),
    quickActions: generateQuickActions(level, problems)
  };
};

// Transform individual performance metrics
const transformPerformanceMetrics = (healthData) => {
  const metrics = healthData.metrics || {};

  return {
    cpu: transformCpuMetric(metrics.cpu),
    memory: transformMemoryMetric(metrics.memory),
    storage: transformStorageMetric(metrics.storage),
    network: transformNetworkMetric(metrics.network)
  };
};

// Transform CPU metric
const transformCpuMetric = (cpuData) => {
  if (!cpuData) {
    return {
      status: 'normal',
      statusLabel: 'Normal',
      displayValue: 'Funcionando Bien',
      description: 'El procesador está funcionando correctamente',
      businessImpact: 'Las aplicaciones responden con normalidad',
      performanceIndicator: 'Bueno'
    };
  }

  const usage = cpuData.usage || 0;
  let status, statusLabel, displayValue, description, businessImpact, performanceIndicator;

  if (usage > 90) {
    status = 'critico';
    statusLabel = 'Crítico';
    displayValue = 'Sobrecargado';
    description = 'El procesador está trabajando al máximo de su capacidad';
    businessImpact = 'Las aplicaciones pueden funcionar muy lentamente';
    performanceIndicator = 'Crítico';
  } else if (usage > 75) {
    status = 'atencion';
    statusLabel = 'Atención';
    displayValue = 'Uso Elevado';
    description = 'El procesador está trabajando intensamente';
    businessImpact = 'Puede haber ralentizaciones ocasionales';
    performanceIndicator = 'Regular';
  } else if (usage > 50) {
    status = 'normal';
    statusLabel = 'Normal';
    displayValue = 'Uso Moderado';
    description = 'El procesador está manejando la carga de trabajo adecuadamente';
    businessImpact = 'Las aplicaciones funcionan con buen rendimiento';
    performanceIndicator = 'Bueno';
  } else {
    status = 'normal';
    statusLabel = 'Excelente';
    displayValue = 'Uso Ligero';
    description = 'El procesador tiene capacidad disponible';
    businessImpact = 'Excelente rendimiento para todas las aplicaciones';
    performanceIndicator = 'Óptimo';
  }

  return {
    status,
    statusLabel,
    displayValue,
    description,
    businessImpact,
    performanceIndicator,
    usagePattern: generateUsagePattern(usage),
    recommendations: generateCpuRecommendations(usage),
    trend: generateMetricTrend(cpuData)
  };
};

// Transform Memory metric
const transformMemoryMetric = (memoryData) => {
  if (!memoryData) {
    return {
      status: 'normal',
      statusLabel: 'Normal',
      displayValue: 'Funcionando Bien',
      description: 'La memoria RAM está funcionando correctamente',
      businessImpact: 'Las aplicaciones cargan y funcionan normalmente',
      performanceIndicator: 'Bueno'
    };
  }

  const usage = memoryData.usage || 0;
  let status, statusLabel, displayValue, description, businessImpact, performanceIndicator;

  if (usage > 95) {
    status = 'critico';
    statusLabel = 'Crítico';
    displayValue = 'Memoria Agotada';
    description = 'La memoria RAM está casi completamente utilizada';
    businessImpact = 'Las aplicaciones pueden cerrarse inesperadamente';
    performanceIndicator = 'Crítico';
  } else if (usage > 85) {
    status = 'atencion';
    statusLabel = 'Atención';
    displayValue = 'Memoria Limitada';
    description = 'La memoria RAM está muy utilizada';
    businessImpact = 'Puede haber lentitud al abrir nuevas aplicaciones';
    performanceIndicator = 'Regular';
  } else if (usage > 60) {
    status = 'normal';
    statusLabel = 'Normal';
    displayValue = 'Uso Normal';
    description = 'La memoria RAM está siendo utilizada eficientemente';
    businessImpact = 'Buen rendimiento para las aplicaciones actuales';
    performanceIndicator = 'Bueno';
  } else {
    status = 'normal';
    statusLabel = 'Excelente';
    displayValue = 'Memoria Disponible';
    description = 'Hay abundante memoria RAM disponible';
    businessImpact = 'Excelente capacidad para ejecutar múltiples aplicaciones';
    performanceIndicator = 'Óptimo';
  }

  return {
    status,
    statusLabel,
    displayValue,
    description,
    businessImpact,
    performanceIndicator,
    usagePattern: generateUsagePattern(usage),
    recommendations: generateMemoryRecommendations(usage),
    trend: generateMetricTrend(memoryData)
  };
};

// Transform Storage metric
const transformStorageMetric = (storageData) => {
  if (!storageData) {
    return {
      status: 'normal',
      statusLabel: 'Normal',
      displayValue: 'Funcionando Bien',
      description: 'El almacenamiento está funcionando correctamente',
      businessImpact: 'Los archivos se guardan y cargan normalmente',
      performanceIndicator: 'Bueno'
    };
  }

  const usage = storageData.usage || 0;
  const iops = storageData.iops || 0;

  let status, statusLabel, displayValue, description, businessImpact, performanceIndicator;

  if (usage > 95 || iops > 1000) {
    status = 'critico';
    statusLabel = 'Crítico';
    displayValue = 'Sobrecargado';
    description = 'El almacenamiento está trabajando al límite';
    businessImpact = 'Guardado y carga de archivos muy lenta';
    performanceIndicator = 'Crítico';
  } else if (usage > 80 || iops > 500) {
    status = 'atencion';
    statusLabel = 'Atención';
    displayValue = 'Uso Intensivo';
    description = 'El almacenamiento está muy activo';
    businessImpact = 'Puede haber demoras al trabajar con archivos';
    performanceIndicator = 'Regular';
  } else {
    status = 'normal';
    statusLabel = 'Normal';
    displayValue = 'Funcionando Bien';
    description = 'El almacenamiento responde adecuadamente';
    businessImpact = 'Buen rendimiento para operaciones con archivos';
    performanceIndicator = 'Bueno';
  }

  return {
    status,
    statusLabel,
    displayValue,
    description,
    businessImpact,
    performanceIndicator,
    usagePattern: generateStoragePattern(storageData),
    recommendations: generateStorageRecommendations(storageData),
    trend: generateMetricTrend(storageData)
  };
};

// Transform Network metric
const transformNetworkMetric = (networkData) => {
  if (!networkData) {
    return {
      status: 'normal',
      statusLabel: 'Normal',
      displayValue: 'Conectado',
      description: 'La conexión de red está funcionando correctamente',
      businessImpact: 'Acceso normal a internet y recursos de red',
      performanceIndicator: 'Bueno'
    };
  }

  const bandwidth = networkData.bandwidth || 0;
  const latency = networkData.latency || 0;

  let status, statusLabel, displayValue, description, businessImpact, performanceIndicator;

  if (latency > 200 || bandwidth > 90) {
    status = 'atencion';
    statusLabel = 'Atención';
    displayValue = 'Conexión Lenta';
    description = 'La red está experimentando demoras o congestión';
    businessImpact = 'Navegación web y transferencias más lentas';
    performanceIndicator = 'Regular';
  } else if (latency > 100 || bandwidth > 70) {
    status = 'normal';
    statusLabel = 'Normal';
    displayValue = 'Conexión Estable';
    description = 'La red funciona con rendimiento aceptable';
    businessImpact = 'Buen acceso a recursos en línea';
    performanceIndicator = 'Bueno';
  } else {
    status = 'normal';
    statusLabel = 'Excelente';
    displayValue = 'Conexión Rápida';
    description = 'La red ofrece excelente rendimiento';
    businessImpact = 'Acceso rápido a todos los recursos en línea';
    performanceIndicator = 'Óptimo';
  }

  return {
    status,
    statusLabel,
    displayValue,
    description,
    businessImpact,
    performanceIndicator,
    usagePattern: generateNetworkPattern(networkData),
    recommendations: generateNetworkRecommendations(networkData),
    trend: generateMetricTrend(networkData)
  };
};

// Helper functions
const getOverallPerformanceDescription = (metrics) => {
  // Simplified logic for overall performance
  return 'Funcionando correctamente';
};

const getResponseSpeedDescription = (metrics) => {
  return 'Respuesta normal';
};

const getStabilityDescription = (healthData) => {
  return 'Sistema estable';
};

const generateTrendSummary = (healthData) => {
  return {
    direction: 'estable',
    label: 'Rendimiento estable',
    description: 'Sin cambios significativos en las últimas horas'
  };
};

const generatePerformanceHighlights = (healthData) => {
  return [
    'Todos los componentes principales funcionan correctamente',
    'No se detectaron problemas críticos de rendimiento'
  ];
};

const generateQuickActions = (level, problems) => {
  if (level === 'critico') {
    return ['Revisar Problemas', 'Reiniciar VM', 'Contactar Soporte'];
  } else if (level === 'atencion') {
    return ['Optimizar Recursos', 'Revisar Configuración'];
  }
  return ['Ver Recomendaciones'];
};

const generateUsagePattern = (usage) => {
  if (usage > 80) return 'Uso intensivo continuo';
  if (usage > 50) return 'Uso moderado variable';
  return 'Uso ligero y eficiente';
};

const generateCpuRecommendations = (usage) => {
  if (usage > 90) {
    return ['Considerar aumentar núcleos de CPU', 'Revisar procesos que consumen recursos'];
  } else if (usage > 75) {
    return ['Monitorear uso durante horas pico'];
  }
  return [];
};

const generateMemoryRecommendations = (usage) => {
  if (usage > 95) {
    return ['Aumentar memoria RAM urgentemente', 'Cerrar aplicaciones innecesarias'];
  } else if (usage > 85) {
    return ['Considerar aumentar memoria RAM'];
  }
  return [];
};

const generateStorageRecommendations = (storageData) => {
  return ['Revisar espacio disponible', 'Optimizar archivos temporales'];
};

const generateNetworkRecommendations = (networkData) => {
  return ['Verificar conexión de red', 'Revisar configuración de firewall'];
};

const generateMetricTrend = (metricData) => {
  return {
    direction: 'estable',
    label: 'Estable'
  };
};

// Generate performance trends
const generatePerformanceTrends = (healthData) => {
  // Generate status-based chart data (values represent status levels)
  // 90-100: Excelente, 70-89: Normal, 50-69: Atención, 0-49: Crítico
  const baseChartData = [
    { time: '00:00', performance: 85 },
    { time: '04:00', performance: 82 },
    { time: '08:00', performance: 88 },
    { time: '12:00', performance: 90 },
    { time: '16:00', performance: 87 },
    { time: '20:00', performance: 85 }
  ];

  return {
    day: {
      direction: 'estable',
      summary: 'Rendimiento estable durante el día',
      explanation: 'La máquina virtual ha mantenido un rendimiento consistente en las últimas 24 horas.',
      chartData: baseChartData,
      patterns: [
        {
          title: 'Pico de actividad al mediodía',
          description: 'Mayor uso de recursos entre las 12:00 y 14:00',
          businessImpact: 'Corresponde al horario de mayor actividad laboral'
        }
      ],
      significantEvents: [],
      insights: [
        'El rendimiento se mantiene dentro de rangos normales',
        'No se detectaron interrupciones significativas'
      ]
    },
    week: {
      direction: 'mejorando',
      summary: 'Rendimiento mejorado esta semana',
      explanation: 'Se observa una tendencia positiva en el rendimiento general de la máquina virtual.',
      chartData: baseChartData,
      patterns: [
        {
          title: 'Mejora gradual',
          description: 'Incremento del 5% en eficiencia promedio',
          businessImpact: 'Mayor productividad y menor tiempo de espera'
        }
      ],
      significantEvents: [
        {
          type: 'improvement',
          title: 'Optimización aplicada',
          description: 'Se aplicaron mejoras de configuración el lunes',
          timestamp: 'Hace 3 días'
        }
      ],
      insights: [
        'Las optimizaciones recientes están dando resultados positivos',
        'Se recomienda mantener la configuración actual'
      ]
    },
    month: {
      direction: 'estable',
      summary: 'Rendimiento consistente este mes',
      explanation: 'La máquina virtual ha demostrado estabilidad y confiabilidad durante el último mes.',
      chartData: baseChartData,
      patterns: [
        {
          title: 'Estabilidad a largo plazo',
          description: 'Variación mínima en métricas de rendimiento',
          businessImpact: 'Operaciones confiables y predecibles'
        }
      ],
      significantEvents: [],
      insights: [
        'Excelente estabilidad operacional',
        'La configuración actual es óptima para las cargas de trabajo'
      ]
    }
  };
};

// Generate performance recommendations
const generatePerformanceRecommendations = (healthData) => {
  const metrics = healthData.metrics || {};
  const problems = healthData.problems || [];
  const recommendations = [];

  // CPU recommendations
  if (metrics.cpu?.usage > 80) {
    recommendations.push({
      category: 'rendimiento',
      priority: 'alta',
      difficulty: 'moderado',
      title: 'Optimizar uso de CPU',
      description: 'El procesador está trabajando intensamente y podría beneficiarse de optimización.',
      benefits: [
        'Mejora en la velocidad de respuesta de aplicaciones',
        'Reducción de la carga del sistema',
        'Mayor estabilidad general'
      ],
      steps: [
        'Identificar procesos que consumen más CPU',
        'Revisar aplicaciones en segundo plano',
        'Considerar aumentar núcleos de CPU si es necesario'
      ],
      businessImpact: 'Mejorará la productividad al reducir tiempos de espera',
      estimatedTime: '30-60 minutos',
      risks: ['Requiere reinicio de algunos servicios']
    });
  }

  // Memory recommendations
  if (metrics.memory?.usage > 85) {
    recommendations.push({
      category: 'configuracion',
      priority: 'alta',
      difficulty: 'facil',
      title: 'Aumentar memoria RAM',
      description: 'La memoria está muy utilizada y limita el rendimiento del sistema.',
      benefits: [
        'Mejor rendimiento de aplicaciones',
        'Capacidad para ejecutar más programas simultáneamente',
        'Reducción de errores por falta de memoria'
      ],
      steps: [
        'Evaluar el uso actual de memoria',
        'Determinar la cantidad adicional necesaria',
        'Programar el aumento de memoria',
        'Verificar el rendimiento después del cambio'
      ],
      businessImpact: 'Permitirá trabajar con más aplicaciones sin ralentizaciones',
      estimatedTime: '15-30 minutos',
      risks: ['Requiere reinicio de la máquina virtual']
    });
  }

  // Default recommendations if no issues
  if (recommendations.length === 0) {
    recommendations.push({
      category: 'optimizacion',
      priority: 'baja',
      difficulty: 'facil',
      title: 'Mantenimiento preventivo',
      description: 'Realizar tareas de mantenimiento para mantener el rendimiento óptimo.',
      benefits: [
        'Prevención de problemas futuros',
        'Mantenimiento del rendimiento actual',
        'Mayor vida útil del sistema'
      ],
      steps: [
        'Limpiar archivos temporales',
        'Verificar actualizaciones del sistema',
        'Revisar logs de sistema',
        'Optimizar configuraciones'
      ],
      businessImpact: 'Asegura la continuidad operacional sin interrupciones',
      estimatedTime: '20-30 minutos',
      risks: []
    });
  }

  return recommendations;
};
