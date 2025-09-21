'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceArea
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Calendar,
  BarChart3
} from 'lucide-react';

const PerformanceTrends = ({ trends, vmId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  if (!trends) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  const periods = [
    { key: 'day', label: 'Último Día', icon: Clock },
    { key: 'week', label: 'Última Semana', icon: Calendar },
    { key: 'month', label: 'Último Mes', icon: BarChart3 }
  ];

  const getTrendIcon = (direction) => {
    switch (direction) {
      case 'mejorando':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'empeorando':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'estable':
        return <Minus className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (direction) => {
    switch (direction) {
      case 'mejorando':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'empeorando':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'estable':
        return 'text-foreground bg-muted border-border';
      default:
        return 'text-foreground bg-muted border-border';
    }
  };

  const currentTrend = trends[selectedPeriod];

  const getStatusFromValue = (value) => {
    if (value >= 90) return 'Excelente';
    if (value >= 70) return 'Normal';
    if (value >= 50) return 'Atención';
    return 'Crítico';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excelente': return '#10b981';
      case 'Normal': return '#3b82f6';
      case 'Atención': return '#f59e0b';
      case 'Crítico': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0]?.value;
      const status = getStatusFromValue(value);
      return (
        <div className="bg-background p-3 border border-border rounded-lg shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm" style={{ color: getStatusColor(status) }}>
            Estado: {status}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Tendencias de Rendimiento
          </CardTitle>
          <div className="flex space-x-1">
            {periods.map((period) => {
              const IconComponent = period.icon;
              return (
                <button
                  key={period.key}
                  onClick={() => setSelectedPeriod(period.key)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center space-x-1 ${selectedPeriod === period.key
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                  <IconComponent className="h-3 w-3" />
                  <span>{period.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Trend Summary */}
        {currentTrend && (
          <div className={`p-4 rounded-lg ${getTrendColor(currentTrend.direction)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getTrendIcon(currentTrend.direction)}
                <span className="font-medium">
                  {currentTrend.summary}
                </span>
              </div>
              <Badge className="bg-white/70">
                {currentTrend.direction === 'mejorando' ? 'Mejorando' :
                  currentTrend.direction === 'empeorando' ? 'Empeorando' : 'Estable'}
              </Badge>
            </div>
            <p className="text-sm opacity-80">
              {currentTrend.explanation}
            </p>
          </div>
        )}

        {/* Performance Chart */}
        {currentTrend && currentTrend.chartData && (
          <div className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentTrend.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis
                    tick={false}
                    axisLine={false}
                    width={0}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  {/* Status Bands */}
                  <ReferenceArea
                    y1={90}
                    y2={100}
                    fill="#10b981"
                    fillOpacity={0.1}
                  />
                  <ReferenceArea
                    y1={70}
                    y2={90}
                    fill="#3b82f6"
                    fillOpacity={0.1}
                  />
                  <ReferenceArea
                    y1={50}
                    y2={70}
                    fill="#f59e0b"
                    fillOpacity={0.1}
                  />
                  <ReferenceArea
                    y1={0}
                    y2={50}
                    fill="#ef4444"
                    fillOpacity={0.1}
                  />

                  <Area
                    type="monotone"
                    dataKey="performance"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Status Legend */}
            <div className="flex items-center justify-center space-x-6 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-muted-foreground">Excelente</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-muted-foreground">Normal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-muted-foreground">Atención</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-muted-foreground">Crítico</span>
              </div>
            </div>
          </div>
        )}

        {/* Performance Patterns */}
        {currentTrend && currentTrend.patterns && currentTrend.patterns.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">
              Patrones Identificados:
            </h4>
            <div className="space-y-2">
              {currentTrend.patterns.map((pattern, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-xs mt-1">📊</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {pattern.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {pattern.description}
                      </p>
                      {pattern.businessImpact && (
                        <p className="text-xs text-blue-600 mt-1">
                          <span className="font-medium">Impacto:</span> {pattern.businessImpact}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Events */}
        {currentTrend && currentTrend.significantEvents && currentTrend.significantEvents.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">
              Eventos Significativos:
            </h4>
            <div className="space-y-2">
              {currentTrend.significantEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${event.type === 'improvement' ? 'bg-green-500' :
                    event.type === 'degradation' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Insights */}
        {currentTrend && currentTrend.insights && currentTrend.insights.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              💡 Información Útil:
            </h4>
            <ul className="space-y-1">
              {currentTrend.insights.map((insight, index) => (
                <li key={index} className="text-sm text-blue-700 flex items-start space-x-2">
                  <span className="text-xs mt-1">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

PerformanceTrends.propTypes = {
  trends: PropTypes.objectOf(
    PropTypes.shape({
      direction: PropTypes.string,
      summary: PropTypes.string,
      explanation: PropTypes.string,
      chartData: PropTypes.arrayOf(
        PropTypes.shape({
          time: PropTypes.string,
          performance: PropTypes.number
        })
      ),
      patterns: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          description: PropTypes.string,
          businessImpact: PropTypes.string
        })
      ),
      significantEvents: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string,
          title: PropTypes.string,
          description: PropTypes.string,
          timestamp: PropTypes.string
        })
      ),
      insights: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  vmId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default PerformanceTrends;
