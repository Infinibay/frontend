'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'next/navigation';
import PerformanceOverview from '@/components/vm/performance/PerformanceOverview';
import SimpleMetricsCard from '@/components/vm/performance/SimpleMetricsCard';
import PerformanceTrends from '@/components/vm/performance/PerformanceTrends';
import PerformanceRecommendations from '@/components/vm/performance/PerformanceRecommendations';
import { usePerformanceData } from '@/hooks/usePerformanceData';
import { Card } from '@/components/ui/card';

const PerformanceTab = ({ vm }) => {
  const { id: routerVmId } = useParams();

  // Normalize vmId to string for consistent Redux key lookup
  const vmId = String(routerVmId || vm?.id || '');

  const {
    performanceStatus,
    performanceMetrics,
    performanceTrends,
    recommendations,
    isLoading,
    error
  } = usePerformanceData(vmId);

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
            Error al cargar datos de rendimiento
          </h3>
          <p className="text-red-600">
            No se pudieron obtener los datos de rendimiento de la máquina virtual.
            Por favor, intenta recargar la página.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Rendimiento de la Máquina Virtual
        </h2>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleTimeString('es-ES')}
        </div>
      </div>

      {/* Performance Overview */}
      <PerformanceOverview
        status={performanceStatus}
        vmId={vmId}
      />

      {/* Performance Metrics Grid */}
      {performanceMetrics ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <SimpleMetricsCard
            type="cpu"
            data={performanceMetrics.cpu}
          />
          <SimpleMetricsCard
            type="memory"
            data={performanceMetrics.memory}
          />
          <SimpleMetricsCard
            type="storage"
            data={performanceMetrics.storage}
          />
          <SimpleMetricsCard
            type="network"
            data={performanceMetrics.network}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Performance Trends and Recommendations */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <PerformanceTrends
            trends={performanceTrends}
            vmId={vmId}
          />
        </div>
        <div>
          <PerformanceRecommendations
            recommendations={recommendations}
            vmId={vmId}
          />
        </div>
      </div>

      {/* Additional Performance Information */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Acerca del Monitoreo de Rendimiento
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Esta sección muestra el rendimiento de tu máquina virtual en términos fáciles de entender.
              Los indicadores te ayudan a identificar si tu VM está funcionando correctamente y qué
              acciones puedes tomar para mejorar su rendimiento.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

PerformanceTab.propTypes = {
  vm: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};

export default PerformanceTab;