import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const SimpleMetricsCard = ({ type, data }) => {
  if (!data) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  const getMetricConfig = (type) => {
    const configs = {
      cpu: {
        icon: Cpu,
        title: 'Procesador',
        colorClass: 'text-blue-600',
        unit: ''
      },
      memory: {
        icon: MemoryStick,
        title: 'Memoria RAM',
        colorClass: 'text-purple-600',
        unit: ''
      },
      storage: {
        icon: HardDrive,
        title: 'Almacenamiento',
        colorClass: 'text-green-600',
        unit: ''
      },
      network: {
        icon: Wifi,
        title: 'Red',
        colorClass: 'text-orange-600',
        unit: ''
      }
    };
    return configs[type] || configs.cpu;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'atencion':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critico':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'atencion':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'critico':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getBadgeColor = (status) => {
    switch (status) {
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
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'empeorando':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      case 'estable':
        return <Minus className="h-3 w-3 text-gray-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  const config = getMetricConfig(type);
  const IconComponent = config.icon;

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${getStatusColor(data.status)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <IconComponent className={`h-5 w-5 ${config.colorClass}`} />
            <CardTitle className="text-sm font-medium">
              {config.title}
            </CardTitle>
          </div>
          <Badge className={getBadgeColor(data.status)}>
            {data.statusLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Main Status Display */}
        <div className="flex items-center space-x-2">
          {getStatusIcon(data.status)}
          <span className="text-lg font-semibold">
            {data.displayValue}
          </span>
          {data.trend && (
            <div className="flex items-center space-x-1">
              {getTrendIcon(data.trend.direction)}
              <span className="text-xs text-gray-600">
                {data.trend.label}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm opacity-80">
          {data.description}
        </p>

        {/* Business Impact */}
        {data.businessImpact && (
          <div className="p-2 bg-white/50 rounded-md">
            <p className="text-xs font-medium mb-1">Impacto en el Negocio:</p>
            <p className="text-xs opacity-75">
              {data.businessImpact}
            </p>
          </div>
        )}

        {/* Usage Pattern */}
        {data.usagePattern && (
          <div className="text-xs opacity-75">
            <span className="font-medium">Patrón de uso:</span> {data.usagePattern}
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations && data.recommendations.length > 0 && (
          <div className="pt-2 border-t border-white/30">
            <p className="text-xs font-medium mb-1">Recomendaciones:</p>
            <ul className="space-y-1">
              {data.recommendations.slice(0, 2).map((rec, index) => (
                <li key={index} className="text-xs opacity-75 flex items-start space-x-1">
                  <span className="text-xs mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Performance Indicator */}
        {data.performanceIndicator && (
          <div className="flex items-center justify-between text-xs">
            <span className="opacity-75">Rendimiento:</span>
            <span className={`font-medium ${data.performanceIndicator === 'Óptimo' ? 'text-green-600' :
              data.performanceIndicator === 'Bueno' ? 'text-blue-600' :
                data.performanceIndicator === 'Regular' ? 'text-yellow-600' :
                  'text-red-600'
              }`}>
              {data.performanceIndicator}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

SimpleMetricsCard.propTypes = {
  type: PropTypes.oneOf(['cpu', 'memory', 'storage', 'network']).isRequired,
  data: PropTypes.shape({
    status: PropTypes.string,
    statusLabel: PropTypes.string,
    displayValue: PropTypes.string,
    description: PropTypes.string,
    businessImpact: PropTypes.string,
    usagePattern: PropTypes.string,
    recommendations: PropTypes.arrayOf(PropTypes.string),
    trend: PropTypes.shape({
      direction: PropTypes.string,
      label: PropTypes.string
    }),
    performanceIndicator: PropTypes.string
  })
};

export default SimpleMetricsCard;
