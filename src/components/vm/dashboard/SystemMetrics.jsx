/**
 * Component that displays system metrics in a simplified, user-friendly format
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  TrendingUp,
  TrendingDown,
  Minus,
  Info
} from 'lucide-react';

const SystemMetrics = ({
  healthData,
  problems = [],
  showNumbers = false
}) => {
  // Extract metrics from health data
  const getMetricValue = (category, metric) => {
    const value = healthData?.autoChecks?.[category]?.metrics?.[metric];
    return value !== undefined ? value : null;
  };

  // Determine metric status based on problems and thresholds
  const getMetricStatus = (category, value, thresholds = {}) => {
    // Check if there are problems related to this category
    const categoryProblems = problems.filter(p =>
      p.category.toLowerCase() === category.toLowerCase()
    );

    if (categoryProblems.some(p => p.priority === 'CRITICAL')) {
      return {
        level: 'critical',
        label: 'Crítico',
        color: 'red',
        icon: '🔴',
        description: 'Requiere atención inmediata'
      };
    }

    if (categoryProblems.some(p => p.priority === 'IMPORTANT')) {
      return {
        level: 'warning',
        label: 'Atención',
        color: 'yellow',
        icon: '🟡',
        description: 'Debe resolverse pronto'
      };
    }

    if (categoryProblems.some(p => p.priority === 'INFORMATIONAL')) {
      return {
        level: 'info',
        label: 'Información',
        color: 'blue',
        icon: '🔵',
        description: 'Recomendación disponible'
      };
    }

    // Use thresholds for status determination
    const { warning = 70, critical = 90 } = thresholds;

    if (value >= critical) {
      return {
        level: 'critical',
        label: 'Crítico',
        color: 'red',
        icon: '🔴',
        description: 'Uso muy alto'
      };
    }

    if (value >= warning) {
      return {
        level: 'warning',
        label: 'Atención',
        color: 'yellow',
        icon: '🟡',
        description: 'Uso elevado'
      };
    }

    return {
      level: 'normal',
      label: 'Normal',
      color: 'green',
      icon: '🟢',
      description: 'Funcionando correctamente'
    };
  };

  // Get trend indicator (mock implementation - would need historical data)
  const getTrendIndicator = (category) => {
    // This would typically compare current vs previous values
    // For now, return neutral
    return {
      direction: 'stable',
      icon: <Minus className="w-4 h-4 text-muted-foreground" />,
      label: 'Estable'
    };
  };

  // Define metrics configuration and compute statuses once
  const metricsWithStatus = useMemo(() => {
    const metricsConfig = [
      {
        id: 'cpu',
        title: 'Procesador',
        icon: <Cpu className="w-5 h-5" />,
        category: 'performance',
        value: getMetricValue('performance', 'cpu_usage'),
        unit: '%',
        thresholds: { warning: 70, critical: 85 },
        description: 'Uso del procesador'
      },
      {
        id: 'memory',
        title: 'Memoria',
        icon: <MemoryStick className="w-5 h-5" />,
        category: 'performance',
        value: getMetricValue('performance', 'memory_usage'),
        unit: '%',
        thresholds: { warning: 80, critical: 95 },
        description: 'Uso de memoria RAM'
      },
      {
        id: 'storage',
        title: 'Almacenamiento',
        icon: <HardDrive className="w-5 h-5" />,
        category: 'storage',
        value: getMetricValue('storage', 'disk_usage'),
        unit: '%',
        thresholds: { warning: 80, critical: 90 },
        description: 'Espacio en disco utilizado'
      },
      {
        id: 'network',
        title: 'Red',
        icon: <Network className="w-5 h-5" />,
        category: 'network',
        value: getMetricValue('network', 'bandwidth_usage'),
        unit: '%',
        thresholds: { warning: 75, critical: 90 },
        description: 'Uso de ancho de banda'
      }
    ];

    // Compute status for each metric once
    return metricsConfig.map(metric => ({
      ...metric,
      status: getMetricStatus(metric.category, metric.value, metric.thresholds),
      trend: getTrendIndicator(metric.category)
    }));
  }, [healthData, problems]);

  // Get status color classes
  const getStatusColors = (level) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          badge: 'bg-red-100 text-red-800'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          badge: 'bg-blue-100 text-blue-800'
        };
      case 'normal':
      default:
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          badge: 'bg-green-100 text-green-800'
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="w-5 h-5" />
          <span>Estado del Sistema</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metricsWithStatus.map((metric) => {
            const { status, trend } = metric;
            const colors = getStatusColors(status.level);

            return (
              <div
                key={metric.id}
                className={`p-4 rounded-lg border-2 ${colors.bg} ${colors.border}`}
              >
                {/* Metric Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={colors.text}>
                      {metric.icon}
                    </div>
                    <h3 className={`font-medium ${colors.text}`}>
                      {metric.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge className={colors.badge}>
                      {status.icon} {status.label}
                    </Badge>
                    {trend.icon}
                  </div>
                </div>

                {/* Metric Value and Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    {showNumbers ? (
                      <span className={`text-2xl font-bold ${colors.text}`}>
                        {metric.value === null ? 'N/A' : `${metric.value}${metric.unit}`}
                      </span>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Badge className={colors.badge}>
                          {status.icon} {status.label}
                        </Badge>
                      </div>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {trend.label}
                    </span>
                  </div>

                  {metric.value !== null ? (
                    <Progress
                      value={metric.value}
                      className="h-2"
                    // Custom color based on status
                    />
                  ) : (
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-full bg-foreground/30 rounded-full" style={{ width: '0%' }}>
                        <span className="sr-only">No disponible</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Description */}
                <p className={`text-sm ${colors.text}`}>
                  {status.description}
                </p>

                {/* Recommendations for non-normal status */}
                {status.level !== 'normal' && (
                  <div className="mt-2 text-xs">
                    {status.level === 'critical' && (
                      <p className="text-red-700">
                        <strong>Acción requerida:</strong> Revisar problemas críticos arriba
                      </p>
                    )}
                    {status.level === 'warning' && (
                      <p className="text-yellow-700">
                        <strong>Recomendación:</strong> Monitorear y considerar optimización
                      </p>
                    )}
                    {status.level === 'info' && (
                      <p className="text-blue-700">
                        <strong>Información:</strong> Revisar recomendaciones disponibles
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Overall System Health Summary */}
        <div className="mt-6 p-4 bg-muted border border-border rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Resumen del Sistema</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {metricsWithStatus.filter(m => m.status.level === 'normal').length}
              </div>
              <div className="text-muted-foreground">Normal</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-600">
                {metricsWithStatus.filter(m => m.status.level === 'warning').length}
              </div>
              <div className="text-muted-foreground">Atención</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">
                {metricsWithStatus.filter(m => m.status.level === 'critical').length}
              </div>
              <div className="text-muted-foreground">Crítico</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {metricsWithStatus.filter(m => m.status.level === 'info').length}
              </div>
              <div className="text-muted-foreground">Info</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemMetrics;
