"use client";

import React from 'react';
import { Heart, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HealthIndicatorBadge = ({ vmId, className = "" }) => {
  // Mock health data - replace with real GraphQL query
  const mockHealthData = {
    score: 85,
    status: 'healthy', // 'healthy', 'warning', 'critical'
    issueCount: 2
  };

  const getIndicatorProps = (status, score) => {
    if (status === 'critical' || score < 60) {
      return {
        variant: 'destructive',
        icon: <AlertTriangle className="w-3 h-3" />,
        label: 'Critical',
        color: 'text-red-600'
      };
    }
    if (status === 'warning' || score < 80) {
      return {
        variant: 'secondary',
        icon: <AlertTriangle className="w-3 h-3" />,
        label: 'Warning',
        color: 'text-yellow-600',
        className: 'bg-yellow-100 text-yellow-800'
      };
    }
    return {
      variant: 'secondary',
      icon: <Heart className="w-3 h-3" />,
      label: 'Healthy',
      color: 'text-green-600',
      className: 'bg-green-100 text-green-800'
    };
  };

  const indicator = getIndicatorProps(mockHealthData.status, mockHealthData.score);

  return (
    <Badge 
      className={`flex items-center gap-1 text-xs ${indicator.className || ''} ${className}`}
      variant={indicator.variant}
    >
      {indicator.icon}
      <span>{indicator.label}</span>
      {mockHealthData.issueCount > 0 && (
        <span className="ml-1 bg-white/20 px-1 rounded">
          {mockHealthData.issueCount}
        </span>
      )}
    </Badge>
  );
};

export default HealthIndicatorBadge;