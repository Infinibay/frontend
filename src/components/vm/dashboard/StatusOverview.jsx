/**
 * Component that provides an executive summary of the VM's overall health status
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Clock, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const StatusOverview = ({ 
  overallStatus, 
  summary, 
  lastCheckTime,
  vmName = 'VM'
}) => {
  // Format last check time
  const formatLastCheck = (timestamp) => {
    if (!timestamp) return 'Nunca';
    
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  };

  // Get status icon component
  const getStatusIcon = () => {
    const iconProps = { className: "w-6 h-6" };
    
    switch (overallStatus.level) {
      case 'critical':
        return <AlertCircle {...iconProps} className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <AlertTriangle {...iconProps} className="w-6 h-6 text-yellow-600" />;
      case 'info':
        return <Info {...iconProps} className="w-6 h-6 text-blue-600" />;
      case 'healthy':
      default:
        return <CheckCircle {...iconProps} className="w-6 h-6 text-green-600" />;
    }
  };

  // Get status color classes
  const getStatusColors = () => {
    switch (overallStatus.level) {
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
      case 'healthy':
      default:
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          badge: 'bg-green-100 text-green-800'
        };
    }
  };

  const colors = getStatusColors();

  // Generate summary text
  const getSummaryText = () => {
    const totalProblems = summary.critical + summary.important + summary.informational;
    
    if (totalProblems === 0) {
      return 'No se han detectado problemas';
    }

    const parts = [];
    if (summary.critical > 0) {
      parts.push(`${summary.critical} crítico${summary.critical > 1 ? 's' : ''}`);
    }
    if (summary.important > 0) {
      parts.push(`${summary.important} importante${summary.important > 1 ? 's' : ''}`);
    }
    if (summary.informational > 0) {
      parts.push(`${summary.informational} informativo${summary.informational > 1 ? 's' : ''}`);
    }

    const problemText = totalProblems === 1 ? 'problema' : 'problemas';
    return `${totalProblems} ${problemText}: ${parts.join(', ')}`;
  };

  return (
    <Card className={`${colors.bg} ${colors.border} border-2`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Estado de {vmName}
          </CardTitle>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>Última revisión: {formatLastCheck(lastCheckTime)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-start space-x-4">
          {/* Status Icon */}
          <div className="flex-shrink-0 mt-1">
            {getStatusIcon()}
          </div>

          {/* Status Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className={`text-xl font-semibold ${colors.text}`}>
                {overallStatus.label}
              </h3>
              <Badge className={colors.badge}>
                {overallStatus.icon}
              </Badge>
            </div>

            <p className={`text-sm ${colors.text} mb-3 leading-relaxed`}>
              {overallStatus.description}
            </p>

            {/* Problem Summary */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {getSummaryText()}
              </span>
              
              {summary.total > 0 && (
                <div className="flex items-center space-x-2 text-xs">
                  {summary.critical > 0 && (
                    <span className="flex items-center text-red-600">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                      {summary.critical} críticos
                    </span>
                  )}
                  {summary.important > 0 && (
                    <span className="flex items-center text-yellow-600">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                      {summary.important} importantes
                    </span>
                  )}
                  {summary.informational > 0 && (
                    <span className="flex items-center text-blue-600">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                      {summary.informational} informativos
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Business Context */}
        {overallStatus.level === 'critical' && (
          <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Impacto en el negocio:</strong> Los problemas críticos pueden afectar 
              la operación normal de su empresa. Se recomienda atención inmediata.
            </p>
          </div>
        )}

        {overallStatus.level === 'warning' && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Recomendación:</strong> Estos problemas deben resolverse pronto 
              para mantener el rendimiento óptimo de su sistema.
            </p>
          </div>
        )}

        {overallStatus.level === 'healthy' && (
          <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Excelente:</strong> Su VM está funcionando correctamente. 
              Continúe con el mantenimiento regular para mantener este estado.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusOverview;
