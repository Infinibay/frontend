import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Zap,
  Shield
} from 'lucide-react';

const PerformanceOverview = ({ status, vmId }) => {
  if (!status) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  const getStatusIcon = (level) => {
    switch (level) {
      case 'excelente':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'normal':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'atencion':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case 'critico':
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Activity className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (level) => {
    switch (level) {
      case 'excelente':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'normal':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'atencion':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'critico':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusBadgeColor = (level) => {
    switch (level) {
      case 'excelente':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'atencion':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critico':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'mejorando':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'empeorando':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'estable':
        return <Minus className="h-4 w-4 text-gray-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className={`p-6 ${getStatusColor(status.level)}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(status.level)}
            <div>
              <CardTitle className="text-xl">
                Rendimiento: {status.label}
              </CardTitle>
              <p className="text-sm opacity-80 mt-1">
                {status.description}
              </p>
            </div>
          </div>
          <Badge className={getStatusBadgeColor(status.level)}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
            <Activity className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Rendimiento General</p>
              <p className="text-xs opacity-75">{status.overallPerformance}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
            <Zap className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium">Velocidad de Respuesta</p>
              <p className="text-xs opacity-75">{status.responseSpeed}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
            <Shield className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="text-sm font-medium">Estabilidad</p>
              <p className="text-xs opacity-75">{status.stability}</p>
            </div>
          </div>
        </div>

        {/* Performance Trend */}
        {status.trend && (
          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
            <div className="flex items-center space-x-2">
              {getTrendIcon(status.trend.direction)}
              <span className="text-sm font-medium">
                Tendencia: {status.trend.label}
              </span>
            </div>
            <span className="text-xs opacity-75">
              {status.trend.description}
            </span>
          </div>
        )}

        {/* Key Performance Highlights */}
        {status.highlights && status.highlights.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Aspectos Destacados:</h4>
            <ul className="space-y-1">
              {status.highlights.map((highlight, index) => (
                <li key={index} className="text-sm opacity-80 flex items-start space-x-2">
                  <span className="text-xs mt-1">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Actions */}
        {status.quickActions && status.quickActions.length > 0 && (
          <div className="pt-2 border-t border-white/30">
            <h4 className="text-sm font-medium mb-2">Acciones Recomendadas:</h4>
            <div className="flex flex-wrap gap-2">
              {status.quickActions.map((action, index) => (
                <button
                  key={index}
                  className="px-3 py-1 text-xs bg-white/70 hover:bg-white/90 rounded-md transition-colors"
                  onClick={() => {
                    // Handle quick action
                    console.log('Quick action:', action);
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

PerformanceOverview.propTypes = {
  status: PropTypes.shape({
    level: PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string,
    overallPerformance: PropTypes.string,
    responseSpeed: PropTypes.string,
    stability: PropTypes.string,
    trend: PropTypes.shape({
      direction: PropTypes.string,
      label: PropTypes.string,
      description: PropTypes.string
    }),
    highlights: PropTypes.arrayOf(PropTypes.string),
    quickActions: PropTypes.arrayOf(PropTypes.string)
  }),
  vmId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default PerformanceOverview;
