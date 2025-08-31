"use client";

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Loader, Wrench, ChevronRight, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

// Custom hook for auto-check data (placeholder for now)
const useAutoCheckData = (vmId, category) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data based on category - replace with real GraphQL query
  const getMockData = (category) => {
    const baseData = {
      updates: {
        status: 'warning',
        summary: 'Your system has 3 important updates waiting to be installed.',
        metrics: [
          { label: 'Available updates', value: '3' },
          { label: 'Security patches', value: '1' },
        ],
        hasIssues: true,
        lastCheck: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
        issues: [
          {
            id: 'updates-1',
            severity: 'medium',
            title: 'Security updates available',
            description: 'Important security patches are ready to install.'
          }
        ]
      },
      security: {
        status: 'healthy',
        summary: 'Your antivirus is active and firewall is properly configured.',
        metrics: [
          { label: 'Antivirus', value: 'Active' },
          { label: 'Firewall', value: 'Protected' },
        ],
        hasIssues: false,
        lastCheck: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
        issues: []
      },
      storage: {
        status: 'critical',
        summary: 'Storage space is running low. Consider cleaning up files.',
        metrics: [
          { label: 'Used space', value: '92%' },
          { label: 'Free space', value: '2.1 GB' },
        ],
        hasIssues: true,
        lastCheck: new Date(Date.now() - 1 * 60 * 1000), // 1 min ago
        issues: [
          {
            id: 'storage-1',
            severity: 'high',
            title: 'Low disk space',
            description: 'Storage is 92% full. System performance may be affected.'
          }
        ]
      },
      performance: {
        status: 'warning',
        summary: 'CPU usage is higher than normal. Some optimization may help.',
        metrics: [
          { label: 'CPU usage', value: '78%' },
          { label: 'Memory usage', value: '65%' },
        ],
        hasIssues: true,
        lastCheck: new Date(Date.now() - 3 * 60 * 1000), // 3 mins ago
        issues: [
          {
            id: 'performance-1',
            severity: 'medium',
            title: 'High CPU usage',
            description: 'CPU usage has been consistently high for the past hour.'
          }
        ]
      },
      applications: {
        status: 'healthy',
        summary: 'All applications are running smoothly with no issues detected.',
        metrics: [
          { label: 'Running apps', value: '12' },
          { label: 'Failed starts', value: '0' },
        ],
        hasIssues: false,
        lastCheck: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
        issues: []
      },
      firewall: {
        status: 'warning',
        summary: 'Firewall is active but some services may need configuration.',
        metrics: [
          { label: 'Active rules', value: '8' },
          { label: 'Blocked attempts', value: '23' },
        ],
        hasIssues: true,
        lastCheck: new Date(Date.now() - 7 * 60 * 1000), // 7 mins ago
        issues: [
          {
            id: 'firewall-1',
            severity: 'low',
            title: 'Service configuration',
            description: 'Some network services may need firewall configuration.'
          }
        ]
      }
    };
    
    return baseData[category] || baseData.security;
  };

  const mockData = getMockData(category);

  const runCheck = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual auto-check mutation
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Update check data
    } catch (error) {
      console.error('Auto-check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkData: mockData,
    isLoading,
    runCheck
  };
};

const AutoCheckCard = ({ title, icon, category, vmId }) => {
  const { toast } = useToast();
  const { checkData, isLoading, runCheck } = useAutoCheckData(vmId, category);

  const getStatusBadge = (status) => {
    const variants = {
      healthy: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Healthy'
      },
      warning: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: <AlertTriangle className="w-3 h-3" />,
        label: 'Warning'
      },
      critical: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: <XCircle className="w-3 h-3" />,
        label: 'Critical'
      },
      checking: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: <Loader className="w-3 h-3 animate-spin" />,
        label: 'Checking'
      }
    };
    
    const variant = variants[status] || variants.healthy;
    
    return (
      <Badge className={`${variant.color} border flex items-center gap-1`}>
        {variant.icon}
        <span>{variant.label}</span>
      </Badge>
    );
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return 'Over 1 day ago';
  };

  const openRemediationDialog = (checkData) => {
    // TODO: Implement remediation dialog
    toast({
      title: "Remediation Options",
      description: `Showing solutions for ${title}...`,
    });
  };

  const handleCardClick = () => {
    if (checkData.hasIssues) {
      openRemediationDialog(checkData);
    }
  };

  const handleRunCheck = async (e) => {
    e.stopPropagation(); // Prevent card click
    try {
      await runCheck();
      toast({
        title: "Check Complete",
        description: `${title} check completed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Check Failed",
        description: `Failed to run ${title} check.`,
        variant: "destructive",
      });
    }
  };

  if (isLoading && !checkData) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-5 w-16 rounded" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`hover:shadow-lg transition-shadow ${checkData.hasIssues ? 'cursor-pointer' : ''}`}
      onClick={checkData.hasIssues ? handleCardClick : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              {icon}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {getStatusBadge(isLoading ? 'checking' : checkData.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Summary Message */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {checkData.summary}
          </p>
          
          {/* Key Metrics */}
          {checkData.metrics && checkData.metrics.length > 0 && (
            <div className="grid grid-cols-1 gap-2 text-sm">
              {checkData.metrics.map((metric, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">{metric.label}:</span>
                  <span className="font-medium">{metric.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Last Check Time */}
          <p className="text-xs text-muted-foreground">
            Last checked: {formatTimeAgo(checkData.lastCheck)}
          </p>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {checkData.hasIssues && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  openRemediationDialog(checkData);
                }}
              >
                <Wrench className="w-4 h-4 mr-2" />
                View Solutions
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRunCheck}
              disabled={isLoading}
              className={checkData.hasIssues ? 'w-auto' : 'flex-1'}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Checking...' : 'Check Now'}
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Hover indicator for clickable cards */}
      {checkData.hasIssues && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </Card>
  );
};

export default AutoCheckCard;