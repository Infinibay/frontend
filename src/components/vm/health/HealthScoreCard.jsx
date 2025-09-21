"use client";

import React, { useState } from 'react';
import { RefreshCw, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

// Custom hook for health score data (placeholder for now)
const useHealthScore = (vmId) => {
  // TODO: Replace with actual GraphQL query when backend is ready
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data - replace with real data from GraphQL
  const mockData = {
    score: 85,
    lastCheck: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    trend: 'up', // 'up', 'down', 'stable'
    previousScore: 82,
    issues: {
      critical: 0,
      warning: 2,
      info: 1
    }
  };

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual health check mutation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      // Update health data
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    healthData: mockData,
    isLoading,
    runHealthCheck
  };
};

const HealthScoreCard = ({ vmId }) => {
  const { toast } = useToast();
  const { healthData, isLoading, runHealthCheck } = useHealthScore(vmId);

  if (!healthData && !isLoading) {
    return (
      <Card className="p-6">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No health data available</p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getHealthLabel = (score) => {
    if (score >= 80) return 'Healthy';
    if (score >= 60) return 'Needs Attention';
    return 'Critical Issues';
  };

  const getTrendIcon = (trend, currentScore, previousScore) => {
    if (trend === 'up' || currentScore > previousScore) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (trend === 'down' || currentScore < previousScore) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const handleRunHealthCheck = async () => {
    try {
      await runHealthCheck();
      toast({
        title: "Health Check Started",
        description: "Running comprehensive health check...",
      });
    } catch (error) {
      toast({
        title: "Health Check Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleShowDetails = () => {
    // TODO: Implement details modal/dialog
    toast({
      title: "Details",
      description: "Detailed health information coming soon...",
    });
  };

  if (isLoading && !healthData) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 transition-all duration-200 ${getScoreBackground(healthData.score)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Health Score Display */}
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(healthData.score)} mb-1`}>
              {healthData.score}
            </div>
            <div className="flex items-center justify-center gap-1">
              {getTrendIcon(healthData.trend, healthData.score, healthData.previousScore)}
              <span className="text-xs text-muted-foreground">
                {healthData.previousScore !== undefined && (
                  `${healthData.score > healthData.previousScore ? '+' : ''}${healthData.score - healthData.previousScore}`
                )}
              </span>
            </div>
          </div>
          
          {/* Health Info */}
          <div>
            <h3 className="text-2xl font-semibold mb-1">Overall Health</h3>
            <p className={`text-lg font-medium ${getScoreColor(healthData.score)} mb-2`}>
              {getHealthLabel(healthData.score)}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Last checked: {formatTimeAgo(healthData.lastCheck)}
            </p>
            
            {/* Issue Summary */}
            <div className="flex items-center gap-3 text-sm">
              {healthData.issues.critical > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {healthData.issues.critical} Critical
                </Badge>
              )}
              {healthData.issues.warning > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  {healthData.issues.warning} Warning
                </Badge>
              )}
              {healthData.issues.info > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {healthData.issues.info} Info
                </Badge>
              )}
              {healthData.issues.critical === 0 && healthData.issues.warning === 0 && (
                <Badge className="bg-green-100 text-green-800 text-xs">
                  No issues detected
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRunHealthCheck}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Checking...' : 'Check Now'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleShowDetails}
            className="min-w-[120px]"
          >
            <Info className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HealthScoreCard;