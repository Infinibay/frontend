'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useHealthTransformation } from '@/hooks/useHealthTransformation';
import { useParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  Settings,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Shield,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Info
} from 'lucide-react';

const MaintenanceTab = ({ vm }) => {
  const { id: routerVmId } = useParams();
  const vmId = String(routerVmId || vm?.id || '');
  const [selectedTask, setSelectedTask] = useState(null);

  const {
    problems,
    metrics,
    overallStatus,
    serviceStatus,
    rawHealthData,
    isLoading,
    error
  } = useHealthTransformation(vmId);

  // Generate maintenance recommendations based on real data
  const generateMaintenanceRecommendations = () => {
    const recommendations = [];

    // Storage-based recommendations
    if (metrics?.storage?.usage > 85) {
      recommendations.push({
        id: 'disk-cleanup',
        title: 'Limpieza de Disco Recomendada',
        description: `El disco está ${metrics.storage.usage}% lleno. Se recomienda limpiar archivos temporales.`,
        priority: metrics.storage.usage > 95 ? 'high' : 'medium',
        category: 'storage',
        estimatedTime: '15-30 minutos',
        impact: 'Liberará espacio en disco y mejorará el rendimiento'
      });
    }

    // Performance-based recommendations
    if (metrics?.performance?.cpuOptimization === 'poor') {
      recommendations.push({
        id: 'cpu-optimization',
        title: 'Optimización de CPU',
        description: 'Se detectaron procesos que consumen recursos excesivos.',
        priority: 'medium',
        category: 'performance',
        estimatedTime: '10-20 minutos',
        impact: 'Mejorará la velocidad de respuesta del sistema'
      });
    }

    // Windows Update recommendations
    if (rawHealthData?.windowsUpdateInfo) {
      try {
        const updateInfo = typeof rawHealthData.windowsUpdateInfo === 'string'
          ? JSON.parse(rawHealthData.windowsUpdateInfo)
          : rawHealthData.windowsUpdateInfo;

        if (updateInfo?.pendingUpdates > 0) {
          recommendations.push({
            id: 'windows-updates',
            title: 'Actualizaciones Pendientes',
            description: `Hay ${updateInfo.pendingUpdates} actualizaciones disponibles.`,
            priority: updateInfo.securityUpdates > 0 ? 'high' : 'low',
            category: 'security',
            estimatedTime: '30-60 minutos',
            impact: 'Mejorará la seguridad y estabilidad del sistema'
          });
        }
      } catch (error) {
        console.warn('Error parsing Windows update info:', error);
      }
    }

    // Default recommendations if no specific issues
    if (recommendations.length === 0) {
      recommendations.push({
        id: 'routine-maintenance',
        title: 'Mantenimiento Rutinario',
        description: 'El sistema está funcionando bien. Se recomienda mantenimiento preventivo.',
        priority: 'low',
        category: 'routine',
        estimatedTime: '20-30 minutos',
        impact: 'Mantendrá el rendimiento óptimo del sistema'
      });
    }

    return recommendations;
  };

  const maintenanceRecommendations = generateMaintenanceRecommendations();

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
            Error al cargar datos de mantenimiento
          </h3>
          <p className="text-red-600">
            No se pudieron obtener los datos de mantenimiento de la máquina virtual.
            Por favor, intenta recargar la página.
          </p>
        </Card>
      </div>
    );
  }

  // Generate scheduled tasks and history (placeholder until backend provides this data)
  const scheduledTasks = generateScheduledTasks(serviceStatus);
  const maintenanceHistory = generateMaintenanceHistory();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Mantenimiento de la Máquina Virtual
        </h2>
        <div className="text-sm text-gray-500">
          Última revisión: {new Date().toLocaleString('es-ES')}
        </div>
      </div>

      {/* Maintenance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Próximo Mantenimiento</h3>
              <p className="text-sm text-blue-700">En 3 días</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Tareas Completadas</h3>
              <p className="text-sm text-green-700">12 este mes</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-900">Recomendaciones</h3>
              <p className="text-sm text-yellow-700">{maintenanceRecommendations.length} pendientes</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Maintenance Recommendations */}
      <Card className="p-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Wrench className="h-5 w-5 text-blue-600" />
            <span>Recomendaciones de Mantenimiento</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {maintenanceRecommendations.length > 0 ? (
            maintenanceRecommendations.map((recommendation, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {recommendation.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {recommendation.title}
                        </h4>
                        <Badge className={recommendation.priorityColor}>
                          {recommendation.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {recommendation.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{recommendation.estimatedTime}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{recommendation.impact}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors">
                      Programar
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 transition-colors">
                      Más Info
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <p className="text-sm text-gray-600">
                ¡Excelente! No hay recomendaciones de mantenimiento pendientes.
                Tu máquina virtual está funcionando de manera óptima.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Tasks and History */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Scheduled Tasks */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <span>Tareas Programadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduledTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${task.statusColor}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{task.name}</p>
                    <p className="text-xs text-gray-500">{task.schedule}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{task.nextRun}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Maintenance History */}
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <RotateCcw className="h-5 w-5 text-purple-600" />
              <span>Historial Reciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {maintenanceHistory.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${item.statusColor}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.task}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                  <p className="text-xs text-gray-600 mt-1">{item.result}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Automated Maintenance Options */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <Shield className="h-8 w-8 text-blue-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Mantenimiento Automático
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Configura tareas de mantenimiento automático para mantener tu VM funcionando de manera óptima
              sin intervención manual.
            </p>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                Configurar Automatización
              </button>
              <button className="px-4 py-2 bg-white text-blue-600 text-sm rounded-md border border-blue-200 hover:bg-blue-50 transition-colors">
                Ver Configuración Actual
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Helper functions to generate maintenance data
const generateScheduledTasks = (serviceStatus) => {
  const tasks = [
    {
      id: 'health-check',
      title: 'Verificación de Salud Automática',
      description: 'Monitoreo continuo del estado del sistema',
      schedule: 'Cada 5 minutos',
      status: serviceStatus?.isRunning ? 'active' : 'inactive',
      nextRun: serviceStatus?.nextRun || 'No programado',
      type: 'automatic'
    },
    {
      id: 'disk-cleanup',
      title: 'Limpieza de Archivos Temporales',
      description: 'Eliminación automática de archivos temporales y cache',
      schedule: 'Semanal',
      status: 'scheduled',
      nextRun: 'En 3 días',
      type: 'scheduled'
    },
    {
      id: 'security-scan',
      title: 'Escaneo de Seguridad',
      description: 'Verificación de vulnerabilidades y actualizaciones',
      schedule: 'Diario',
      status: 'scheduled',
      nextRun: 'En 8 horas',
      type: 'scheduled'
    }
  ];

  return tasks;
};

const generateMaintenanceHistory = () => {
  return [
    {
      task: 'Limpieza de archivos temporales completada',
      date: 'Hace 2 días',
      result: 'Liberados 2.3 GB de espacio',
      statusColor: 'bg-green-500'
    },
    {
      task: 'Actualización de sistema aplicada',
      date: 'Hace 5 días',
      result: '12 actualizaciones instaladas correctamente',
      statusColor: 'bg-blue-500'
    },
    {
      task: 'Optimización de memoria ejecutada',
      date: 'Hace 1 semana',
      result: 'Uso de memoria reducido en 15%',
      statusColor: 'bg-green-500'
    },
    {
      task: 'Verificación de integridad de disco',
      date: 'Hace 2 semanas',
      result: 'No se encontraron errores',
      statusColor: 'bg-green-500'
    }
  ];
};

MaintenanceTab.propTypes = {
  vm: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};

export default MaintenanceTab;
