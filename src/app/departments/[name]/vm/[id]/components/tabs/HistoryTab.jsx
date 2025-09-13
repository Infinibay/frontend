'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useHealthTransformation } from '@/hooks/useHealthTransformation';
import { useParams } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import {
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

// GraphQL queries for history data
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

// Helper functions to transform real data
const transformHealthHistory = (historyData) => {
  return historyData.map(snapshot => {
    const totalChecks = snapshot.checksCompleted + snapshot.checksFailed;
    const healthScore = totalChecks > 0 ? (snapshot.checksCompleted / totalChecks) * 100 : 100;

    return {
      date: new Date(snapshot.snapshotDate).toLocaleDateString('es-ES'),
      time: new Date(snapshot.snapshotDate).toLocaleTimeString('es-ES'),
      healthScore: Math.round(healthScore),
      status: snapshot.overallStatus,
      checksCompleted: snapshot.checksCompleted,
      checksFailed: snapshot.checksFailed
    };
  }).reverse(); // Reverse to get chronological order
};

const transformEventHistory = (historyData, filter) => {
  const events = historyData.map(snapshot => {
    const events = [];

    // Add health check events
    if (snapshot.checksFailed > 0) {
      events.push({
        id: `health-${snapshot.id}`,
        type: 'health',
        severity: 'critical',
        title: 'Verificaciones de Salud Fallidas',
        description: `${snapshot.checksFailed} verificaciones fallaron`,
        timestamp: snapshot.snapshotDate,
        category: 'system'
      });
    }

    // Add error events
    if (snapshot.errorSummary) {
      events.push({
        id: `error-${snapshot.id}`,
        type: 'error',
        severity: 'warning',
        title: 'Error del Sistema',
        description: snapshot.errorSummary,
        timestamp: snapshot.snapshotDate,
        category: 'system'
      });
    }

    return events;
  }).flat();

  // Filter events based on selected filter
  if (filter !== 'all') {
    return events.filter(event => {
      switch (filter) {
        case 'problems': return event.severity === 'critical' || event.severity === 'warning';
        case 'maintenance': return event.category === 'maintenance';
        case 'performance': return event.category === 'performance';
        default: return true;
      }
    });
  }

  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const transformPerformanceHistory = (historyData) => {
  return historyData.map(snapshot => {
    const totalChecks = snapshot.checksCompleted + snapshot.checksFailed;
    const successRate = totalChecks > 0 ? (snapshot.checksCompleted / totalChecks) * 100 : 100;

    return {
      date: new Date(snapshot.snapshotDate).toLocaleDateString('es-ES'),
      time: new Date(snapshot.snapshotDate).toLocaleTimeString('es-ES'),
      performance: Math.round(successRate),
      availability: Math.round(successRate) // Same as performance for now, based on check success rate
    };
  }).reverse();
};

const HistoryTab = ({ vm }) => {
  const { id: routerVmId } = useParams();
  const vmId = String(routerVmId || vm?.id || '');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const {
    problems,
    metrics,
    overallStatus,
    isLoading: healthLoading,
    error: healthError
  } = useHealthTransformation(vmId);

  // Calculate limit based on selected period
  const getHistoryLimit = (period) => {
    switch (period) {
      case 'day': return 24; // Last 24 hours
      case 'week': return 168; // Last week (hourly)
      case 'month': return 30; // Last 30 days
      case 'year': return 365; // Last year (daily)
      default: return 168;
    }
  };

  // Fetch health history data
  const {
    data: historyData,
    loading: historyLoading,
    error: historyError,
    refetch: refetchHistory
  } = useQuery(GET_VM_HEALTH_HISTORY, {
    variables: {
      machineId: vmId,
      limit: getHistoryLimit(selectedPeriod),
      offset: 0
    },
    skip: !vmId,
    errorPolicy: 'partial'
  });

  // Fetch health statistics
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError
  } = useQuery(GET_VM_HEALTH_STATS, {
    variables: { machineId: vmId },
    skip: !vmId,
    errorPolicy: 'partial'
  });

  const isLoading = healthLoading || historyLoading || statsLoading;
  const error = healthError || historyError || statsError;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 border-red-200 bg-red-50">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error al cargar historial
          </h3>
          <p className="text-red-600">
            No se pudo obtener el historial de la máquina virtual.
            Por favor, intenta recargar la página.
          </p>
        </Card>
      </div>
    );
  }

  const periods = [
    { key: 'day', label: 'Último Día' },
    { key: 'week', label: 'Última Semana' },
    { key: 'month', label: 'Último Mes' },
    { key: 'year', label: 'Último Año' }
  ];

  const filters = [
    { key: 'all', label: 'Todos los Eventos' },
    { key: 'problems', label: 'Solo Problemas' },
    { key: 'maintenance', label: 'Mantenimiento' },
    { key: 'performance', label: 'Rendimiento' }
  ];

  // Transform real data for charts
  const healthHistory = transformHealthHistory(historyData?.vmHealthHistory || []);
  const eventHistory = transformEventHistory(historyData?.vmHealthHistory || [], selectedFilter);
  const performanceHistory = transformPerformanceHistory(historyData?.vmHealthHistory || []);
  const healthStats = statsData?.vmHealthStats;

  // Compute real statistics from health history
  const computeHealthStatistics = () => {
    if (healthHistory.length === 0) {
      return {
        avgHealth: 0,
        maxHealth: 0,
        minHealth: 0,
        avgPerformance: 0,
        avgAvailability: 0
      };
    }

    const healthScores = healthHistory.map(h => h.healthScore);
    const performanceScores = performanceHistory.map(p => p.performance);
    const availabilityScores = performanceHistory.map(p => p.availability);

    return {
      avgHealth: Math.round(healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length),
      maxHealth: Math.max(...healthScores),
      minHealth: Math.min(...healthScores),
      avgPerformance: performanceScores.length > 0 ? Math.round(performanceScores.reduce((sum, score) => sum + score, 0) / performanceScores.length) : 0,
      avgAvailability: availabilityScores.length > 0 ? Math.round(availabilityScores.reduce((sum, score) => sum + score, 0) / availabilityScores.length) : 0
    };
  };

  const computedStats = computeHealthStatistics();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Historial de la Máquina Virtual
        </h2>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Period and Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Período:</span>
          {periods.map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${selectedPeriod === period.key
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filters.map((filter) => (
              <option key={filter.key} value={filter.key}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Health Score Evolution */}
      <Card className="p-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Evolución del Estado de Salud</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Estado de Salud']}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="healthScore"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{computedStats.avgHealth}%</p>
              <p className="text-sm text-green-700">Promedio</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{computedStats.maxHealth}%</p>
              <p className="text-sm text-blue-700">Máximo</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{computedStats.minHealth}%</p>
              <p className="text-sm text-yellow-700">Mínimo</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{computedStats.avgAvailability}%</p>
              <p className="text-sm text-purple-700">Disponibilidad</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Timeline and Performance Metrics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Event Timeline */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Línea de Tiempo de Eventos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {eventHistory.map((event, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full mt-2 ${event.statusColor}`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                    <span className="text-xs text-gray-500">{event.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                  {event.impact && (
                    <div className="flex items-center space-x-2">
                      <Badge className={event.impactColor}>
                        {event.impact}
                      </Badge>
                      {event.resolved && (
                        <Badge className="bg-green-100 text-green-800">
                          Resuelto
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Metrics History */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span>Métricas de Rendimiento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Rendimiento %"
                  />
                  <Line
                    type="monotone"
                    dataKey="availability"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Disponibilidad %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-2 bg-blue-50 rounded">
                <p className="text-sm font-medium text-blue-600">Rendimiento Promedio</p>
                <p className="text-lg font-bold text-blue-700">{computedStats.avgPerformance}%</p>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <p className="text-sm font-medium text-green-600">Disponibilidad Promedio</p>
                <p className="text-lg font-bold text-green-700">{computedStats.avgAvailability}%</p>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <p className="text-sm font-medium text-purple-600">Salud Máxima</p>
                <p className="text-lg font-bold text-purple-700">{computedStats.maxHealth}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{healthStats?.healthySnapshots || 0}</p>
            <p className="text-sm text-gray-600">Verificaciones Exitosas</p>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{healthStats?.totalSnapshots || 0}</p>
            <p className="text-sm text-gray-600">Total de Verificaciones</p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{healthStats?.warningSnapshots || 0}</p>
            <p className="text-sm text-gray-600">Advertencias</p>
          </div>
          <div className="text-center">
            <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{healthStats?.errorSnapshots || 0}</p>
            <p className="text-sm text-gray-600">Errores Detectados</p>
          </div>
        </div>
      </Card>
    </div>
  );
};



HistoryTab.propTypes = {
  vm: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};

export default HistoryTab;
